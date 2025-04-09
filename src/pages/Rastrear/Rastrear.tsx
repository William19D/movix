import React, { useState } from "react";

const Rastrear: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(event.target.value);
  };

  const handleTrack = () => {
    if (trackingNumber.trim() === "") {
      alert("Por favor, ingresa un número de guía válido.");
      return;
    }
    // Handle the tracking functionality here
    console.log("Tracking number:", trackingNumber);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-screen-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 flex items-center">
              <span className="mr-2 text-2xl sm:text-3xl">📍</span>
              Rastrea tu Envío en Tiempo Real
            </h1>
            <p className="text-lg sm:text-xl text-gray-800">
              Consulta la ubicación y el estado de tu envío en cualquier momento. Solo ingresa tu número de guía y obtén información detallada sobre el recorrido de tu paquete hasta su destino final.
            </p>
          </div>

          {/* Right Content */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <label
              htmlFor="trackingNumber"
              className="block text-lg font-medium text-gray-800 mb-2"
            >
              Número de Guía
            </label>
            <input
              type="text"
              id="trackingNumber"
              value={trackingNumber}
              onChange={handleInputChange}
              placeholder="Ingresa tu número de Guía"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956] mb-4"
            />
            <button
              onClick={handleTrack}
              className="w-full bg-[#0F0F14] text-white py-3 rounded-lg font-medium hover:bg-black transition duration-300"
            >
              Rastrear
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-8 space-x-4">
          {/* Decorative Elements */}
          <div className="w-6 h-6 bg-black rounded-full"></div>
          <div className="w-4 h-4 bg-[#C3E956] rounded-full"></div>
          <div className="w-6 h-6 bg-black rotate-45"></div>
          <div className="w-4 h-4 bg-[#C3E956] rounded-full"></div>
          <div className="w-6 h-6 bg-black rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default Rastrear;