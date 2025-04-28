import { onRequest } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const db = admin.firestore();

// Bloque para generar el código de seguimiento a un envío
export const generarCodigoSeguimeinto = (): string => {
  const uuid = uuidv4().split('-')[0].toUpperCase();
  const tiempo = Date.now().toString().slice(-5);
  return `CDE-${uuid}-${tiempo}`;
};

// Función para crear un envío
export const crearEnvio = async (
  ciudadDestino: string,
  ciudadOrigen: string,
  departamentoDestino: string,
  departamentoOrigen: string,
  celularDestinatario: string,
  direccionDestino: string,
  nombreDestinatario: string,
  nombreRemitente: string,
  tipoEnvio: string,
  valorDeclarado: number
) => {
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
    valorDeclarado,
  };

  try {
    const envio = await db.collection('envios').add(nuevoEnvio);
    return { id: envio.id, ...nuevoEnvio };
  } catch (error) {
    console.error(error);
    throw new Error('Error al crear un envío');
  }
};

// Función HTTP para registrar el envío, con CORS manual
export const registrarEnvio = onRequest(async (req, res) => {
  // Manejo de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*'); // Puedes reemplazar * por tu dominio
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  // CORS para solicitudes POST normales
  res.set('Access-Control-Allow-Origin', '*'); // Puedes reemplazar * por 'http://localhost:3000', etc.

  try {
    const {
      ciudadDestino,
      ciudadOrigen,
      departamentoDestino,
      departamentoOrigen,
      celularDestinatario,
      direccionDestino,
      nombreDestinatario,
      nombreRemitente,
      tipoEnvio,
      valorDeclarado,
    } = req.body;

    if (
      !ciudadDestino ||
      !ciudadOrigen ||
      !departamentoDestino ||
      !departamentoOrigen ||
      !celularDestinatario ||
      !direccionDestino ||
      !nombreDestinatario ||
      !nombreRemitente ||
      !tipoEnvio ||
      !valorDeclarado
    ) {
      res.status(400).send("Información incompleta o inválida");
      return;
    }

    const envio = await crearEnvio(
      ciudadDestino,
      ciudadOrigen,
      departamentoDestino,
      departamentoOrigen,
      celularDestinatario,
      direccionDestino,
      nombreDestinatario,
      nombreRemitente,
      tipoEnvio,
      valorDeclarado
    );

    res.status(200).json(envio);
  } catch (error) {
    console.error("Error al crear envío:", error);
    res.status(500).send("Error al registrar el envío");
  }
});

/**
 * Cambio de estado del envío, de Pendiente a Finalizado
 */

export const cambioEstadoEnvio = async (codigo: string, estado: string) => {
  try {
    const enviosRef = db.collection('envios');
    const query = await enviosRef.where('codigoSeguimiento', '==', codigo).get();

    const batch = db.batch();

    query.forEach((i) => {
      const docRef = enviosRef.doc(i.id);
      batch.update(docRef, { estado: 'finalizado' });
    });

    await batch.commit();
    return { mensaje: `Estado actualizado a ${estado}` };
  } catch (error) {
    console.log(error);

    throw new Error('Error al cambiar el estado del envío');
  }
};

