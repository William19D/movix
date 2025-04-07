import React, { useState, useEffect } from 'react';
import Services from '../../core/services/services';

const Shipment: React.FC = () => {
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [declaredValue, setDeclaredValue] = useState<number>(10000);
  const [shippingType, setShippingType] = useState<string>('standard');
  const [senderName, setSenderName] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [originCities, setOriginCities] = useState<any[]>([]);
  const [destinationCities, setDestinationCities] = useState<any[]>([]);
  const [selectedOriginDepartment, setSelectedOriginDepartment] = useState<number | null>(null);
  const [selectedDestinationDepartment, setSelectedDestinationDepartment] = useState<number | null>(null);
  const [selectedOriginCity, setSelectedOriginCity] = useState<string>('');
  const [selectedDestinationCity, setSelectedDestinationCity] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [recipientContactNumber, setRecipientContactNumber] = useState<string>('');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await Services.getDepartments();
      setDepartments(data);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchOriginCities = async () => {
      if (selectedOriginDepartment) {
        const data = await Services.getCitiesByDepartment(selectedOriginDepartment);
        setOriginCities(data);
      }
    };

    fetchOriginCities();
  }, [selectedOriginDepartment]);

  useEffect(() => {
    const fetchDestinationCities = async () => {
      if (selectedDestinationDepartment) {
        const data = await Services.getCitiesByDepartment(selectedDestinationDepartment);
        setDestinationCities(data);
      }
    };

    fetchDestinationCities();
  }, [selectedDestinationDepartment]);

  const calculateDistanceAndCost = async () => {
    if (selectedOriginCity && selectedDestinationCity && selectedOriginDepartment && selectedDestinationDepartment) {
      if (selectedOriginCity !== selectedDestinationCity) {
        try {
          const response = await fetch("https://calcularcostoenvio-dc3dtifeqq-uc.a.run.app", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              length,
              width,
              height,
              peso: weight, // Peso del paquete
              origen: {
                ciudad: selectedOriginCity,
                departamento: departments.find(dep => dep.id === selectedOriginDepartment)?.name,
              },
              destino: {
                ciudad: selectedDestinationCity,
                departamento: departments.find(dep => dep.id === selectedDestinationDepartment)?.name,
              },
              valorDeclarado: declaredValue, // Valor declarado
            }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            let costo = data.costo; // Costo base calculado desde el backend
  
            // Agregar recargo por envío urgente
            if (shippingType === "urgent") {
              costo += 2000;
            }
  
            // Redondear el costo a un número entero
            costo = Math.round(costo);
  
            setShippingCost(costo); // Costo calculado
            setNotification({ type: "success", message: `Costo calculado exitosamente.` });
          } else {
            setNotification({ type: "error", message: data.error || "Error al calcular el costo de envío." });
          }
        } catch (error) {
          setNotification({ type: "error", message: "Error al conectar con el servidor. Inténtalo nuevamente." });
          console.error("Error al calcular la distancia:", error);
        }
      } else {
        setNotification({ type: "warning", message: "La ciudad de origen y destino no pueden ser iguales." });
      }
    } else {
      setNotification({ type: "warning", message: "Por favor, selecciona las ciudades de origen y destino y sus respectivos departamentos." });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000); // Limpiar notificación después de 5 segundos
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = () => {
    if (!shippingCost) {
      setNotification({ type: "error", message: "Por favor, calcula el costo del envío antes de continuar." });
      return;
    }

    console.log({
      length,
      width,
      height,
      weight,
      declaredValue,
      shippingType,
      senderName,
      pickupAddress,
      contactNumber,
      pickupDate,
      selectedOriginCity,
      selectedDestinationCity,
      recipientName,
      deliveryAddress,
      recipientContactNumber,
      additionalInstructions,
      paymentMethod,
      shippingCost,
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-semibold mb-4">🚚 Envía tu Paquete en Minutos</h1>
        <p className="text-gray-500 text-lg mb-6">
          Realiza tu envío de forma fácil y segura. Ingresa los detalles de tu paquete,
          selecciona el destino y nuestro equipo de logística se encargará de recogerlo
          en la dirección indicada. ¡Nosotros nos encargamos del resto!
        </p>
        {notification && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : notification.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {notification.message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Detalles del Paquete</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Dimensiones del Paquete (Cm)📦</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Ancho"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value))}
                  />
                  <input
                    type="number"
                    placeholder="Largo"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value))}
                  />
                  <input
                    type="number"
                    placeholder="Alto"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Peso del Paquete (Kg)</label>
                <input
                  type="number"
                  placeholder="Mínimo 2 Kg"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-700">Valor declarado</label>
                <input
                  type="number"
                  placeholder="Mínimo $10,000"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-700">Tipo de envío</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingType"
                      value="standard"
                      checked={shippingType === 'standard'}
                      onChange={(e) => setShippingType(e.target.value)}
                    />
                    <span className="ml-2">Estándar</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingType"
                      value="urgent"
                      checked={shippingType === 'urgent'}
                      onChange={(e) => setShippingType(e.target.value)}
                    />
                    <span className="ml-2">Urgente</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="mt-8.5 block text-gray-700">Departamento y Ciudad de origen</label>
                <select
                  className="w-full  p-2 border border-gray-300 rounded-lg"
                  value={selectedOriginDepartment || ''}
                  onChange={(e) => setSelectedOriginDepartment(parseInt(e.target.value))}
                >
                  <option value="" disabled>Selecciona un departamento</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>{department.name}</option>
                  ))}
                </select>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                  value={selectedOriginCity}
                  onChange={(e) => setSelectedOriginCity(e.target.value)}
                  disabled={!selectedOriginDepartment}
                >
                  <option value="" disabled>Selecciona una ciudad</option>
                  {originCities.map((city) => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-gray-700">Costo del envío:</label>
              <input
                type="text"
                value={shippingCost !== null ? `$${shippingCost}` : "Sin calcular"}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
            </div>
            <button
              onClick={calculateDistanceAndCost}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition mt-4"
            >
              Calcular Costo
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Datos del Remitente</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Nombre del remitente✍️</label>
                <input
                  type="text"
                  placeholder="Nombre completo de quien envía el paquete"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">Dirección de recogida📍</label>
                <input
                  type="text"
                  placeholder="Lugar donde nuestro equipo recogerá el paquete"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">Teléfono del remitente📞</label>
                <input
                  type="text"
                  placeholder="Número de contacto"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">Fecha de recogida📅</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={today} // Establecer la fecha mínima como hoy
                />
              </div>
              <div>
                <label className="block text-gray-700">Departamento y Ciudad de destino</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedDestinationDepartment || ''}
                  onChange={(e) => setSelectedDestinationDepartment(parseInt(e.target.value))}
                >
                  <option value="" disabled>Selecciona un departamento</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>{department.name}</option>
                  ))}
                </select>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                  value={selectedDestinationCity}
                  onChange={(e) => setSelectedDestinationCity(e.target.value)}
                  disabled={!selectedDestinationDepartment}
                >
                  <option value="" disabled>Selecciona una ciudad</option>
                  {destinationCities.map((city) => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Datos del Destinatario📋</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Nombre del destinatario📝</label>
                <input
                  type="text"
                  placeholder="Nombre completo de quien recibe el paquete"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">Dirección de entrega📍</label>
                <input
                  type="text"
                  placeholder="Lugar donde se entregará el paquete"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">Teléfono del destinatario📞</label>
                <input
                  type="text"
                  placeholder="Número de contacto del receptor"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={recipientContactNumber}
                  onChange={(e) => setRecipientContactNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">Instrucciones adicionales📝</label>
                <input
                  type="text"
                  placeholder='Ejemplo: "Frágil", "Entregar en portería", etc.'
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Método de pago💳</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="contraentrega"
                  checked={paymentMethod === 'contraentrega'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="ml-2 text-gray-700">Contraentrega</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pse"
                  checked={paymentMethod === 'pse'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="ml-2 text-gray-700">Efectivo al Recoger</label>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition mt-6"
            >
              Proceder con el pago
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
export default Shipment;