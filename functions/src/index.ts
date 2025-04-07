import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import fetch from "node-fetch";
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: true });

const haversineDistance = (
  coords1: { lat: number; lon: number },
  coords2: { lat: number; lon: number }
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) *
    Math.cos(toRad(coords2.lat)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
};

const calcularCostoPorRangos = (distancia: number, peso: number, tamano: number, valorDeclarado: number) => {
  const costoBase = 3000; // Costo mínimo
  let costoDistancia = 0;
  let costoPeso = 0;
  let costoTamano = 0;

  // Calcular costo por distancia
  if (distancia <= 50) {
    costoDistancia = 5000;
  } else if (distancia <= 200) {
    costoDistancia = 10000;
  } else if (distancia <= 500) {
    costoDistancia = 20000;
  } else {
    costoDistancia = 30000;
  }

  // Calcular costo por peso
  if (peso <= 5) {
    costoPeso = 2000;
  } else if (peso <= 20) {
    costoPeso = 5000;
  } else {
    costoPeso = 10000;
  }

  // Calcular costo por tamaño
  if (tamano <= 100) {
    costoTamano = 1000;
  } else if (tamano <= 500) {
    costoTamano = 3000;
  } else {
    costoTamano = 5000;
  }

  // Calcular seguro
  const seguro = valorDeclarado * 0.2;

  // Sumar todos los costos
  const costoTotal = costoBase + costoDistancia + costoPeso + costoTamano + seguro;

  return Math.round(costoTotal);
};

// Bloque de código para generar el código de seguimiento a un envío
const generarCodigoSeguimeinto = (): string => {
  const uuid = uuidv4().split('-')[0].toUpperCase(); //identificador único universla
  const tiempo = Date.now().toString().slice(-5);// da algo de orden cronológcio
  return `Código de envío : CDE-${uuid}-${tiempo}`;
}

// Función para crear un envío
const crearEnvio = async (ciudadDestino: string, ciudadOrigen: string, departamentoDestino: string,
  departamentoOrigen: string, celularDestinatario: string, direccionDestino: string,
  nombreDestinatario: string, nombreRemitente: string, tipoEnvio: string, valorDeclarado: number) => {

  const codSeguimiento = generarCodigoSeguimeinto();

  const nuevoEnvio = {
    ciudadDestino,
    ciudadOrigen,
    departamentoDestino,
    departamentoOrigen,
    celularDestinatario,
    codigoSeguimiento: codSeguimiento,
    direccionDestino,
    estado: 'Pendiente de pago',
    fechaCreacion: new Date(),
    nombreDestinatario,
    nombreRemitente,
    tipoEnvio,
    valorDeclarado
  }
  try {
    const envio = await db.collection('envios').add(nuevoEnvio);
    return { id: envio.id, ...nuevoEnvio };
  } catch (error) {
    console.log(error);

    throw new Error('Error al crear un envío');
  }
}
// función encargada de registrar el envío 
export const registrarEnvio = onRequest(async (request, response) => {
  try {
    const { ciudadDestino, ciudadOrigen, departamentoDestino, departamentoOrigen, celularDestinatario,
      direccionDestino, nombreDestinatario, nombreRemitente, tipoEnvio, valorDeclarado } = request.body;

    if (!celularDestinatario && !direccionDestino && !nombreDestinatario && !nombreRemitente
      && !valorDeclarado
    ) {
      response.status(400).send("Información incompleta o inválida");
      return;
    }

    const envio = await crearEnvio(ciudadDestino, ciudadOrigen, departamentoDestino, departamentoOrigen, celularDestinatario,
      direccionDestino, nombreDestinatario, nombreRemitente, tipoEnvio, valorDeclarado);

    response.status(200).json(envio);
  } catch (error) {
    console.error("Error al crear envío:", error);
    response.status(500).send("Error al rgeistrar el envío");
  }
});

export const calcularCostoEnvio = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    logger.info("Solicitud recibida para calcular costo de envío", {
      structuredData: true,
    });

    const { tamano, peso, origen, destino, valorDeclarado } = request.body;

    // Validación de entradas
    if (
      typeof tamano !== "number" ||
      typeof peso !== "number" ||
      typeof origen !== "string" ||
      typeof destino !== "string" ||
      typeof valorDeclarado !== "number" ||
      tamano <= 0 ||
      peso <= 0 ||
      valorDeclarado <= 0
    ) {
      response.status(400).send({
        error:
          "Campos de entrada vacíos.",
      });
      return;
    }

    // Validar que las ciudades no sean iguales
    if (origen.toLowerCase() === destino.toLowerCase()) {
      response.status(400).send({
        error: "La ciudad de origen y destino no pueden ser iguales.",
      });
      return;
    }

    // Validar que el tamaño y el peso estén dentro de un rango razonable
    if (tamano > 10000 || peso > 1000) {
      response.status(400).send({
        error: "El tamaño o el peso exceden los límites permitidos. Verifique los valores ingresados.",
      });
      return;
    }

    try {
      const headers = {
        "User-Agent": "movix-app/1.0 (jhonya.pereap@uqvirtual.edu.co)",
      };

      // Coordenadas del origen
      const originRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
          origen
        )}&format=json`,
        { headers }
      );
      const originData = await originRes.json();

      // Coordenadas del destino
      const destinationRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
          destino
        )}&format=json`,
        { headers }
      );
      const destinationData = await destinationRes.json();

      // Validar que las respuestas de las APIs sean exitosas
      if (!originRes.ok || !destinationRes.ok) {
        response.status(500).send({
          error: "Error al obtener coordenadas de las ciudades. Inténtelo más tarde.",
        });
        return;
      }

      if (originData.length === 0 || destinationData.length === 0) {
        response.status(400).send({
          error:
            "No se encontraron coordenadas para las ciudades proporcionadas. Verifique los nombres.",
        });
        return;
      }

      const originCoords = {
        lat: parseFloat(originData[0].lat),
        lon: parseFloat(originData[0].lon),
      };
      const destinationCoords = {
        lat: parseFloat(destinationData[0].lat),
        lon: parseFloat(destinationData[0].lon),
      };

      // Validar que las coordenadas sean válidas
      if (
        isNaN(originCoords.lat) ||
        isNaN(originCoords.lon) ||
        isNaN(destinationCoords.lat) ||
        isNaN(destinationCoords.lon)
      ) {
        response.status(400).send({
          error: "No se pudieron obtener coordenadas válidas para las ciudades proporcionadas.",
        });
        return;
      }

      const distancia = haversineDistance(originCoords, destinationCoords);

      const costoTotal = calcularCostoPorRangos(distancia, peso, tamano, valorDeclarado);

      response.status(200).send({
        origen,
        destino,
        distancia: distancia.toFixed(2),
        costo: costoTotal,
        seguro: Math.round(valorDeclarado * 0.2),
      });
    } catch (error) {
      logger.error("Error calculando el costo de envío", error);
      response
        .status(500)
        .send({ error: "Error interno del servidor. Inténtelo más tarde." });
    }
  });
});
