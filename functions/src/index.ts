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

// Función para obtener un delivery aleatorio
const obtenerRepartidorleatorio = async () => {
  const snapshot = await db.collection('delivery').get();

  if (snapshot.empty) {
    throw new Error('No hay repartidores disponibles');
  }

  const deliverys = snapshot.docs;
  const indiceAleatorio = Math.floor(Math.random() * deliverys.length);
  const repartidorSelect = deliverys[indiceAleatorio];

  return {
    id: repartidorSelect.id,
    ...repartidorSelect.data()
  };
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
  const repartidorAsignado = await obtenerRepartidorleatorio();


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
    deliveryId: repartidorAsignado.id
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
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  // CORS para solicitudes POST normales
  res.set('Access-Control-Allow-Origin', '*'); 

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

export const obtenerCliente = async (id : any) => {
  try {
    
    const clientRef = db.collection('clientes').doc(id);
    const doc = await clientRef.get();

    if (!doc.exists) {
      throw new Error('Cliente no encontrado');
    }

    return doc.data(); 
  } catch (error) {
    console.error('Error obteniendo los datos del cliente:', error);
    throw error;
  }
};


export const getCliente = onRequest(async (req, res) => {
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  // CORS para solicitudes GET normales
  res.set('Access-Control-Allow-Origin', '*'); 

  try {
    const { id } = req.params; // obtengan el id desde los parámetros de la url

    if (!id) {
      res.status(400).send("El ID del cliente es requerido");
      return;
    }

    const cliente = await obtenerCliente(id);

    res.status(200).json(cliente);
  } catch (error) {
    console.error("Error al obtener los datos del cliente:", error);
    res.status(500).send("Error al obtener los datos del cliente");
  }
});


export const desactivarCuentaCliente = async (id: string) => {
  try {
    
    const cliente = db.collection('clientes').doc(id);
    
    await cliente.update({
      estadoCuenta: false
    });

    return { message: 'Cuenta desactivada exitosamente' };
  } catch (error) {
    console.error('Error desactivando la cuenta:', error);
    throw new Error('Error al desactivar la cuenta');
  }
};


export const desactivarCuenta = onRequest(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  res.set('Access-Control-Allow-Origin', '*');

  try {
    const { idCliente } = req.params;

    if (!idCliente) {
      res.status(400).send('ID de cliente es requerido');
      return;
    }

    const result = await desactivarCuentaCliente(idCliente);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al desactivar la cuenta:', error);
    res.status(500).send('Error al desactivar la cuenta');
  }
});

export const obtenerEnviosPorRepartiord = onRequest(async (req, res) => {
  
});
