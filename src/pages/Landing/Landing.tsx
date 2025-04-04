import React from "react";

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-2 bg-white w-full">
      <div className="flex items-center justify-center w-full mb-[7vh] p-5">
        <div className="max-w-1/2 text-left relative left-[17vh]" >
          <h1 className="text-[8.5vh] font-bold mb-4">Rápido, seguro, confiable.</h1>
          <p className="text-[1.5rem] font-normal text-gray-800 mb-6 mr-10">
            Envialo optimiza tus envíos con soluciones inteligentes y seguras.
            Calcula rutas y costos de manera precisa, garantizando entregas
            rápidas y confiables en todo momento.
          </p>
          <button className="font-normal text-lg leading-7 text-center bg-black text-white border-none py-[18px] px-[34px] rounded-lg cursor-pointer transition-colors duration-300 ease hover:bg-gray-800">Cotizar</button>
        </div>
        <div className="flex justify-center max-w-[100%]">
        <img src="welcome.svg" alt="Paquete en movimiento" className="relative left-[-1vh] w-[100%]" />
        </div>
      </div>
      <div className="mt-3 w-3/4">
        <div className="flex items-center">
          <h2 className="text-2xl bg-[#b9ff66] text-center p-2.5 rounded-lg mr-5">Servicios</h2>
          <p className="text-lg text-left w-1/2 ml-2">Envialo ofrece soluciones integrales de logística, incluyendo envíos nacionales, encomiendas seguras y mensajería express.</p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-gray-100 p-5 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl mb-2.5">Rastrea tu Paquete</h3>
              <p className="text-base text-black no-underline cursor-pointer hover:underline">Saber más.</p>
            </div>
            <img src="rastrea.svg" alt="Rastrea tu Paquete" className="w-1/3" />
          </div>
          <div className="bg-[#b9ff66] p-5 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl mb-2.5">Cotiza tu Envío</h3>
              <p className="text-base text-black no-underline cursor-pointer hover:underline">Saber más.</p>
            </div>
            <img src="cotiza.svg" alt="Cotiza tu Envío" className="w-1/3" />
          </div>
          <div className="bg-black text-white p-5 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl mb-2.5">Recogemos tu Pedido</h3>
              <p className="text-base text-white no-underline cursor-pointer hover:underline">Saber más.</p>
            </div>
            <img src="recogemos.svg" alt="Recogemos tu Pedido" className="w-1/3" />
          </div>
          <div className="bg-gray-100 p-5 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl mb-2.5">Habla con Nosotros</h3>
              <p className="text-base text-black no-underline cursor-pointer hover:underline">Saber más.</p>
            </div>
            <img src="contactanos.svg" alt="Habla con Nosotros" className="w-1/3" />
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white w-full">
        <div className="bg-gray-100 p-10 mx-60 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">Comencemos</h2>
          <p className="text-lg mb-6">
            Inicia tu experiencia con Envialo en solo unos pasos. Cotiza, rastrea y gestiona tus envíos de manera rápida y sencilla. ¡Tu destino está a un clic de distancia! 🚀
          </p>
          <button className="text-lg bg-black text-white py-3 px-6 rounded-lg">Empezar</button>
        </div>
        <div className="bg-gray-100 p-8 mx-60 mt-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 bg-[#b9ff66] inline-block p-1 rounded-lg">Nuestras Noticias</h2>
          <p className="text-lg mb-6">
            Mantente al día con nuestros logros y novedades. Descubre cómo mejoramos nuestros servicios y optimizamos nuestras entregas para ti. 📦✨
          </p>
          <div className="flex justify-around text-black">
            <div className="text-center max-w-sm bg-gray-900 text-white p-5 rounded-lg">
              <p className="mb-4">Envialo alcanzó un 98% de entregas a tiempo en el último trimestre, consolidando su eficiencia y compromiso con sus clientes.</p>
              <a href="#" className="text-green-400 hover:text-green-600">Leer más</a>
            </div>
            <div className="text-center max-w-sm bg-gray-900 text-white p-5 rounded-lg">
              <p className="mb-4">Registramos un aumento del 35% en la demanda de envíos, destacándose en el sector logístico nacional.</p>
              <a href="#" className="text-green-400 hover:text-green-600">Leer más</a>
            </div>
            <div className="text-center max-w-sm bg-gray-900 text-white p-5 rounded-lg">
              <p className="mb-4">El 92% de los usuarios calificó el servicio como excelente, destacando la rapidez y precisión en el seguimiento de pedidos.</p>
              <a href="#" className="text-green-400 hover:text-green-600">Leer más</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;