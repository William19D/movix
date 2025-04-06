import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const calcularCostoEnvio = onRequest((request, response) => {
  logger.info("Calculando costo de envío", { structuredData: true });

  const { tamano, peso, distancia } = request.body; // Obtener los datos del cuerpo de la solicitud

  if (typeof tamano !== 'number' || typeof peso !== 'number' || typeof distancia !== 'number') {
    response.status(400).send({ error: "Datos de entrada inválidos. Asegúrese de que tamaño, peso y distancia sean números." });
    return;
  }

  // Definir las tarifas base y los factores de cálculo
  const costoBase = 8000; // Costo mínimo
  const tarifaTamano = 0.5; // Tarifa por unidad de tamaño
  const tarifaPeso = 200; // Tarifa por unidad de peso
  const tarifaDistancia = 50; // Tarifa por unidad de distancia

  // Calcular el costo total
  let costoTotal = costoBase + (tamano * tarifaTamano) + (peso * tarifaPeso) + (distancia * tarifaDistancia);

  // Asegurar que el costo total no sea menor que el costo base
  costoTotal = Math.max(costoTotal, costoBase);

  // Enviar la respuesta con el costo calculado
  response.send({ costo: costoTotal });
});