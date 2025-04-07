import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import fetch from "node-fetch";

const corsHandler = cors({ origin: true });

const distanciaORS = async (
  coords1: { lat: number; lon: number },
  coords2: { lat: number; lon: number }
): Promise<number> => {
  const apiKey = "5b3ce3597851110001cf62484d708269fb784a7e88f9e59b98473375"; // ← pon aquí tu API Key real

  const body = {
    locations: [
      [coords1.lon, coords1.lat],
      [coords2.lon, coords2.lat],
    ],
    metrics: ["distance"],
  };

  const res = await fetch("https://api.openrouteservice.org/v2/matrix/driving-car", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error en OpenRouteService API");
  }

  const data = await res.json();

  // La distancia viene en metros, la convertimos a kilómetros
  const distanceInKm = data.distances[0][1] / 1000;
  return distanceInKm;
};

const calcularCostoPorRangos = (
  distancia: number,
  volumen: number,
  alto: number,
  peso: number,
  valorDeclarado: number
) => {
  const costoBase = 3000; // Costo mínimo
  let costoDistancia = 0;
  let costoVolumen = 0;
  let costoPeso = 0;

  // Validaciones físicas
  if (alto > 50) {
    throw new Error("La altura del paquete excede el límite permitido de 50cm");
  }

  if (volumen > 2000000) {
    throw new Error("El volumen del paquete excede el máximo permitido de 2.000.000 cm³");
  }

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

  // Calcular costo por volumen
  if (volumen <= 30000) {
    costoVolumen = 1900;
  } else if (volumen <= 100000) {
    costoVolumen = 3900;
  } else {
    costoVolumen = 7900;
  }

  // Calcular costo por peso
  if (peso <= 5) {
    costoPeso = 2000;
  } else if (peso <= 20) {
    costoPeso = 5000;
  } else {
    costoPeso = 10000;
  }

  // Calcular seguro
  const seguro = valorDeclarado * 0.2;

  // Costo total
  const costoTotal = costoBase + costoDistancia + costoVolumen + costoPeso + seguro;

  return Math.round(costoTotal);
};

export const calcularCostoEnvio = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    logger.info("Solicitud recibida para calcular costo de envío", {
      structuredData: true,
    });

    const { length, width, height, peso, origen, destino, valorDeclarado } = request.body;

    // Validación de entradas
    if (
      typeof length !== "number" ||
      typeof width !== "number" ||
      typeof height !== "number" ||
      typeof peso !== "number" ||
      typeof origen !== "object" ||
      typeof destino !== "object" ||
      typeof valorDeclarado !== "number" ||
      length <= 0 ||
      width <= 0 ||
      height <= 0 ||
      peso <= 0 ||
      valorDeclarado <= 0
    ) {
      response.status(400).send({
        error: "Campos de entrada vacíos.",
      });
      return;
    }

    const { ciudad: ciudadOrigen, departamento: departamentoOrigen } = origen;
    const { ciudad: ciudadDestino, departamento: departamentoDestino } = destino;

    // Validar que las ciudades no sean iguales
    if (
      ciudadOrigen.toLowerCase() === ciudadDestino.toLowerCase() &&
      departamentoOrigen.toLowerCase() === departamentoDestino.toLowerCase()
    ) {
      response.status(400).send({
        error: "La ciudad de origen y destino no pueden ser iguales.",
      });
      return;
    }

    // Validar que el tamaño y el peso estén dentro de un rango razonable
    const volumen = length * width * height;
    if (volumen > 2000000 || peso > 1000) {
      response.status(400).send({
        error: "El volumen o el peso exceden los límites permitidos. Verifique los valores ingresados.",
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
          ciudadOrigen
        )}&state=${encodeURIComponent(departamentoOrigen)}&format=json`,
        { headers }
      );
      const originData = await originRes.json();

      // Coordenadas del destino
      const destinationRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
          ciudadDestino
        )}&state=${encodeURIComponent(departamentoDestino)}&format=json`,
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
          error: "No se encontraron coordenadas para las ciudades proporcionadas. Verifique los nombres.",
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

      const distancia = await distanciaORS(originCoords, destinationCoords);
      console.log(`Distancia calculada: ${distancia.toFixed(2)} km`);

      const costoTotal = calcularCostoPorRangos(distancia, volumen, height, peso, valorDeclarado);

      response.status(200).send({
        origen: `${departamentoOrigen}, ${ciudadOrigen}`,
        destino: `${departamentoDestino}, ${ciudadDestino}`,
        distancia: distancia.toFixed(2),
        costo: costoTotal,
        seguro: Math.round(valorDeclarado * 0.2),
      });
    } catch (error) {
      logger.error("Error calculando el costo de envío", error);
      response.status(500).send({ error: "Error interno del servidor. Inténtelo más tarde." });
    }
  });
});