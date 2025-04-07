import React, { useState, useEffect } from 'react';
import Services from '../../core/services/services';
import { useNavigate } from 'react-router-dom';

const CotizarAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [declaredValue, setDeclaredValue] = useState(10000);
  const [shippingType, setShippingType] = useState('standard');
  const [departments, setDepartments] = useState<any[]>([]);
  const [originCities, setOriginCities] = useState<any[]>([]);
  const [destinationCities, setDestinationCities] = useState<any[]>([]);
  const [selectedOriginDepartment, setSelectedOriginDepartment] = useState<number | null>(null);
  const [selectedDestinationDepartment, setSelectedDestinationDepartment] = useState<number | null>(null);
  const [selectedOriginCity, setSelectedOriginCity] = useState('');
  const [selectedDestinationCity, setSelectedDestinationCity] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Services.getDepartments().then(setDepartments);
  }, []);

  useEffect(() => {
    if (selectedOriginDepartment) {
      Services.getCitiesByDepartment(selectedOriginDepartment).then(setOriginCities);
    }
  }, [selectedOriginDepartment]);

  useEffect(() => {
    if (selectedDestinationDepartment) {
      Services.getCitiesByDepartment(selectedDestinationDepartment).then(setDestinationCities);
    }
  }, [selectedDestinationDepartment]);

  const calculateCost = async () => {
    if (
      selectedOriginCity &&
      selectedDestinationCity &&
      selectedOriginDepartment &&
      selectedDestinationDepartment &&
      selectedOriginCity !== selectedDestinationCity
    ) {
      setLoading(true); // Mostrar el símbolo de carga
      try {
        const response = await fetch('https://calcularcostoenvio-dc3dtifeqq-uc.a.run.app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            length,
            width,
            height,
            peso: weight,
            valorDeclarado: declaredValue,
            origen: {
              ciudad: selectedOriginCity,
              departamento: departments.find(dep => dep.id === selectedOriginDepartment)?.name,
            },
            destino: {
              ciudad: selectedDestinationCity,
              departamento: departments.find(dep => dep.id === selectedDestinationDepartment)?.name,
            },
          }),
        });

        const data = await response.json();
        if (response.ok) {
          let cost = data.costo;
          if (shippingType === 'urgent') cost += 2000;
          setShippingCost(Math.round(cost));
          setNotification({ type: 'success', message: 'Costo calculado exitosamente.' });
        } else {
          setNotification({ type: 'error', message: data.error || 'Error al calcular el costo.' });
        }
      } catch (error) {
        setNotification({ type: 'error', message: 'Error de conexión con el servidor.' });
      } finally {
        setLoading(false); // Ocultar el símbolo de carga
      }
    } else {
      setNotification({ type: 'warning', message: 'Verifica los datos ingresados y selecciona ciudades distintas.' });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

    const handleRegresarClick = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full">
        <div className="flex justify-end mb-4">
          <button className=
          "bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          onClick={handleRegresarClick}
          >
            Regresar
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">📦 Cotizador de Envíos</h1>

        {notification && (
          <div
            className={`p-4 mb-4 rounded-md text-center ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-700'
                : notification.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Paquete */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detalles del Paquete</h2>
            <div className="space-y-2">
              <label className="block text-gray-700">Ancho (cm)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={width}
                onChange={e => setWidth(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Largo (cm)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={length}
                onChange={e => setLength(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Alto (cm)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Peso (kg)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Valor declarado ($)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={declaredValue}
                onChange={e => setDeclaredValue(Number(e.target.value))}
              />
            </div>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="standard"
                  checked={shippingType === 'standard'}
                  onChange={e => setShippingType(e.target.value)}
                />
                Estándar
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="urgent"
                  checked={shippingType === 'urgent'}
                  onChange={e => setShippingType(e.target.value)}
                />
                Urgente (+$2.000)
              </label>
            </div>
          </div>

          {/* Ruta */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ruta del Envío</h2>
            <div>
              <label className="text-sm text-gray-600">Departamento de Origen</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedOriginDepartment || ''}
                onChange={e => setSelectedOriginDepartment(Number(e.target.value))}
              >
                <option value="">Selecciona</option>
                {departments.map(dep => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded-lg mt-2"
                value={selectedOriginCity}
                onChange={e => setSelectedOriginCity(e.target.value)}
              >
                <option value="">Ciudad de origen</option>
                {originCities.map(city => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Departamento de Destino</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedDestinationDepartment || ''}
                onChange={e => setSelectedDestinationDepartment(Number(e.target.value))}
              >
                <option value="">Selecciona</option>
                {departments.map(dep => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded-lg mt-2"
                value={selectedDestinationCity}
                onChange={e => setSelectedDestinationCity(e.target.value)}
              >
                <option value="">Ciudad de destino</option>
                {destinationCities.map(city => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="mt-8 text-center">
          <button
            onClick={calculateCost}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cargando...
              </div>
            ) : (
              'Calcular Costo'
            )}
          </button>
          {shippingCost !== null && (
            <div className="mt-4 text-lg font-semibold">
              Costo estimado: <span className="text-green-600">${shippingCost}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CotizarAdmin;