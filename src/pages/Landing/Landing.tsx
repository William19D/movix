import React from "react";
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center mt-2 bg-white w-full">
      {/* Widened standardized container for all sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-screen-2xl">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full mb-8 md:mb-[7vh] p-4 md:p-5">
          <div className="w-full md:w-1/2 text-left mb-6 md:mb-0 md:pr-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[8.5vh] font-bold mb-4">Rápido, seguro, confiable.</h1>
            <p className="text-lg sm:text-xl md:text-[1.5rem] font-normal text-gray-800 mb-6">
              Envialo optimiza tus envíos con soluciones inteligentes y seguras.
              Calcula rutas y costos de manera precisa, garantizando entregas
              rápidas y confiables en todo momento.
            </p>
            <button className="font-normal text-lg leading-7 text-center bg-black text-white border-none py-3 px-6 md:py-[18px] md:px-[34px] rounded-lg cursor-pointer transition-colors duration-300 ease hover:bg-gray-800">Cotizar</button>
          </div>
          {/* Hide image on very small screens (mobile), show on sm and up */}
          <div className="hidden sm:flex w-full md:w-1/2 justify-center">
            <img src="welcome.svg" alt="Paquete en movimiento" className="w-[85%] md:w-[85%]" />
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-12 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
            <h2 className="text-2xl bg-[#C3E956] text-center p-2.5 rounded-lg mb-3 sm:mb-0 sm:mr-5">Servicios</h2>
            <p className="text-lg text-left sm:w-2/3 sm:ml-2">Envialo ofrece soluciones integrales de logística, incluyendo envíos nacionales, encomiendas seguras y mensajería express.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-xl mb-2.5">Rastrea tu Paquete</h3>
                <p className="text-base text-black no-underline cursor-pointer hover:underline">Saber más.</p>
              </div>
              <img src="rastrea.svg" alt="Rastrea tu Paquete" className="w-1/4 md:w-1/3" />
            </div>
            <div className="bg-[#C3E956] p-6 rounded-lg shadow-md flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-xl mb-2.5">Cotiza tu Envío</h3>
                <p className="text-base text-black no-underline cursor-pointer hover:underline">Saber más.</p>
              </div>
              <img src="cotiza.svg" alt="Cotiza tu Envío" className="w-1/4 md:w-1/3" />
            </div>
            <div className="bg-[#162521] text-white p-6 rounded-lg shadow-md flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-xl mb-2.5">Recogemos tu Pedido</h3>
                <p className="text-base text-white no-underline cursor-pointer hover:underline">Saber más.</p>
              </div>
              <img src="truck.svg" alt="Recogemos tu Pedido" className="w-1/4 md:w-1/3 filter invert brightness-0" />
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-xl mb-2.5">Habla con Nosotros</h3>
                <p className="text-base text-black no-underline cursor-pointer hover:underline">Saber más.</p>
              </div>
              <img src="contactanos.svg" alt="Habla con Nosotros" className="w-1/4 md:w-1/3" />
            </div>
          </div>
        </div>

        {/* Call to Action Section 1 */}
        <div className="mt-12 w-full">
          <div className="bg-gray-100 p-8 md:p-10 rounded-lg shadow-md">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Comencemos</h2>
            <p className="text-base md:text-lg mb-6">
              Inicia tu experiencia con Envialo en solo unos pasos. Cotiza, rastrea y gestiona tus envíos de manera rápida y sencilla. ¡Tu destino está a un clic de distancia! 🚀
            </p>
            <button 
              onClick={handleLoginClick}
              className="text-lg bg-black text-white py-2 px-4 md:py-3 md:px-6 rounded-lg">
              Empezar
            </button>
          </div>
        </div>

        {/* Call to Action Section 2 */}
        <div className="mt-12 mb-12 w-full">
          <div className="bg-gray-100 p-8 md:p-10 rounded-lg shadow-md">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-[#C3E956] inline-block p-1 rounded-lg">Nuestras Noticias</h2>
            <p className="text-base md:text-lg mb-6">
              Mantente al día con nuestros logros y novedades. Descubre cómo mejoramos nuestros servicios y optimizamos nuestras entregas para ti. 📦✨
            </p>
            <div className="flex flex-col md:flex-row gap-6 md:justify-around text-black">
              <div className="text-center bg-gray-900 text-white p-5 md:p-6 rounded-lg">
                <p className="mb-4">Envialo alcanzó un 98% de entregas a tiempo en el último trimestre, consolidando su eficiencia y compromiso con sus clientes.</p>
                <a href="#" className="text-[#C3E956] hover:text-green-600">Leer más</a>
              </div>
              <div className="text-center bg-gray-900 text-white p-5 md:p-6 rounded-lg">
                <p className="mb-4">Registramos un aumento del 35% en la demanda de envíos, destacándose en el sector logístico nacional.</p>
                <a href="#" className="text-[#C3E956] hover:text-green-600">Leer más</a>
              </div>
              <div className="text-center bg-gray-900 text-white p-5 md:p-6 rounded-lg">
                <p className="mb-4">El 92% de los usuarios calificó el servicio como excelente, destacando la rapidez y precisión en el seguimiento de pedidos.</p>
                <a href="#" className="text-[#C3E956] hover:text-green-600">Leer más</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;