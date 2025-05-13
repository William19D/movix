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
  // Configuración CORS
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
    if (req.method !== 'POST') {
      res.status(405).json({ success: false, message: 'Método no permitido' });
      return;
    }

    // Corregido: idCliente -> idCliente
    const { idCliente } = req.body;

    if (!idCliente) {
      res.status(400).json({ success: false, message: 'ID de cliente es requerido' });
      return;
    }

    // 1. Desactivar en Firestore
    const clienteRef = db.collection('clientes').doc(idCliente);
    await clienteRef.update({
      estadoCuenta: false,
      fechaDesactivacion: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2. Desactivar en Authentication
    try {
      await admin.auth().updateUser(idCliente, {
        disabled: true
      });
    } catch (authError: any) { // Tipado explícito del error
      // Solo ignoramos si el usuario no existe en Auth
      if (authError.code !== 'auth/user-not-found') {
        throw authError;
      }
      // Podemos registrar que no existía en Auth si es necesario
      console.log(`Usuario ${idCliente} no encontrado en Auth, solo desactivado en Firestore`);
    }

    res.status(200).json({ 
      success: true,
      message: 'Cuenta desactivada exitosamente'
    });

  } catch (error: any) { // Tipado explícito del error
    console.error('Error al desactivar la cuenta:', error);
    
    // Mapeo de errores comunes
    let statusCode = 500;
    let errorMessage = 'Error al desactivar la cuenta';
    
    if (error.code === 'auth/insufficient-permission') {
      statusCode = 403;
      errorMessage = 'No tienes permisos para realizar esta acción';
    } else if (error.code === 'not-found') {
      statusCode = 404;
      errorMessage = 'Cliente no encontrado';
    } else if (error.code === 'permission-denied') {
      statusCode = 403;
      errorMessage = 'Permisos insuficientes en Firestore';
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      // Solo muestra detalles del error en desarrollo
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        code: error.code 
      })
    });
  }
});

export const obtenerEnviosPorRepartiord = onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  try {
    const { idRepartidor } = req.body;

    if (!idRepartidor) {
      res.status(400).json({ error: 'Falta el ID del delivery' });
      return;
    }

    const snapshot = await db
      .collection('envios')
      .where('ID', '==', idRepartidor)
      .get();

    const envios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(envios);
  } catch (error) {
    console.error('Error obteniendo envíos del delivery:', error);
    res.status(500).send('Error al obtener los envíos');
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

export const cambioEnvio = onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  try {
    const { codigo, estado } = req.body;

    if (!codigo || !estado) {
      res.status(400).json({ mensaje: 'Código y estado son requeridos' });
      return;
    }

    const resultado = await cambioEstadoEnvio(codigo, estado);
    res.status(200).json(resultado);

  } catch (error) {
   console.error('Error al cambiar estado del envío:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});
