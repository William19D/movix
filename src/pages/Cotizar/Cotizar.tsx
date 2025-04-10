import React, { useState, useEffect } from "react";
import Services from "../../core/services/services";

const Cotizar: React.FC = () => {
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [declaredValue, setDeclaredValue] = useState<string>("10000");
  const [shippingType, setShippingType] = useState("standard"); // Default to standard
  const [departments, setDepartments] = useState<any[]>([]);
  const [originCities, setOriginCities] = useState<any[]>([]);
  const [destinationCities, setDestinationCities] = useState<any[]>([]);
  const [selectedOriginDepartment, setSelectedOriginDepartment] = useState<number | null>(null);
  const [selectedDestinationDepartment, setSelectedDestinationDepartment] = useState<number | null>(null);
  const [selectedOriginCity, setSelectedOriginCity] = useState("");
  const [selectedDestinationCity, setSelectedDestinationCity] = useState("");
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
      setLoading(true);
      try {
        const response = await fetch("https://calcularcostoenvio-dc3dtifeqq-uc.a.run.app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            length: Number(length),
            width: Number(width),
            height: Number(height),
            peso: Number(weight),
            valorDeclarado: Number(declaredValue),
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
          if (shippingType === "urgent") cost += 2000; // Add $2000 for urgent shipping
          setShippingCost(Math.round(cost));
          setNotification({ type: "success", message: "Costo calculado exitosamente." });
        } else {
          setNotification({ type: "error", message: data.error || "Error al calcular el costo." });
        }
      } catch (error) {
        setNotification({ type: "error", message: "Error de conexión con el servidor." });
      } finally {
        setLoading(false);
      }
    } else {
      setNotification({ type: "warning", message: "Verifica los datos ingresados y selecciona ciudades distintas." });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (value: string) => {
    return value === "" || /^[0-9]*$/.test(value) ? value : "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">📦 Cotizador de Envíos</h1>
        </div>

        {notification && (
          <div
            className={`p-4 mb-4 rounded-md text-center ${
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

        <div className="grid md:grid-cols-2 gap-6">
          {/* Paquete */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Detalles del Paquete</h2>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="block text-gray-600">Ancho (cm)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                  value={width}
                  onChange={(e) => setWidth(handleInputChange(e.target.value))}
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="block text-gray-600">Largo (cm)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                  value={length}
                  onChange={(e) => setLength(handleInputChange(e.target.value))}
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="block text-gray-600">Alto (cm)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                  value={height}
                  onChange={(e) => setHeight(handleInputChange(e.target.value))}
                />
              </div>
            </div>

            {/* Peso */}
            <div className="space-y-2">
              <label className="block text-gray-600">Peso (kg)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                value={weight}
                onChange={(e) => setWeight(handleInputChange(e.target.value))}
              />
            </div>

            {/* Valor declarado */}
            <div className="space-y-2">
              <label className="block text-gray-600">Valor declarado ($)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(handleInputChange(e.target.value))}
              />
            </div>

            {/* Tipo de envío */}
            <div className="space-y-2">
              <label className="block text-gray-600">Tipo de envío</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="standard"
                    checked={shippingType === "standard"}
                    onChange={(e) => setShippingType(e.target.value)}
                  />
                  Estándar
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="urgent"
                    checked={shippingType === "urgent"}
                    onChange={(e) => setShippingType(e.target.value)}
                  />
                  Urgente (+$2.000)
                </label>
              </div>
            </div>
          </div>

          {/* Ruta */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Ruta del Envío</h2>
            <div>
              <label className="text-sm text-gray-600">Departamento de Origen</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                value={selectedOriginDepartment || ""}
                onChange={(e) => setSelectedOriginDepartment(Number(e.target.value) || null)}
              >
                <option value="">Selecciona</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                value={selectedOriginCity}
                onChange={(e) => setSelectedOriginCity(e.target.value)}
              >
                <option value="">Ciudad de origen</option>
                {originCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Departamento de Destino</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                value={selectedDestinationDepartment || ""}
                onChange={(e) => setSelectedDestinationDepartment(Number(e.target.value) || null)}
              >
                <option value="">Selecciona</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                value={selectedDestinationCity}
                onChange={(e) => setSelectedDestinationCity(e.target.value)}
              >
                <option value="">Ciudad de destino</option>
                {destinationCities.map((city) => (
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
            className="bg-[#0F0F14] text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition"
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
                Calculando...
              </div>
            ) : (
              "Calcular Costo"
            )}
          </button>
          {shippingCost !== null && (
            <div className="mt-6 text-3xl font-bold">
              Costo estimado:{" "}
              <span className="bg-[#C3E956] text-[#0F0F14] px-2 py-1 rounded-lg">
                ${shippingCost}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cotizar;