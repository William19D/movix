import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F0F14] text-white py-10 rounded-t-3xl flex justify-center">
      <div className="w-[70%]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          {/* Navigation Links */}
          <div className="flex flex-wrap space-x-6 text-sm sm:text-base mb-6 lg:mb-0">
            <a
              href="#cotizar"
              className="hover:text-[#C3E956] transition duration-300"
            >
              Cotizar
            </a>
            <a
              href="#rastrear"
              className="hover:text-[#C3E956] transition duration-300"
            >
              Rastrear
            </a>
            <a
              href="#enviar"
              className="hover:text-[#C3E956] transition duration-300"
            >
              Enviar
            </a>
            <a
              href="#servicios"
              className="hover:text-[#C3E956] transition duration-300"
            >
              Servicios
            </a>
            <a
              href="#contactanos"
              className="hover:text-[#C3E956] transition duration-300"
            >
              Contáctanos
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="#linkedin"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1C1C1E] hover:bg-[#C3E956] text-white hover:text-black transition duration-300"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="#facebook"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1C1C1E] hover:bg-[#C3E956] text-white hover:text-black transition duration-300"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#twitter"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1C1C1E] hover:bg-[#C3E956] text-white hover:text-black transition duration-300"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          {/* Contact Information */}
          <div className="mb-6 lg:mb-0">
            <h4 className="bg-[#C3E956] text-black py-1 px-3 rounded-lg inline-block mb-4">
              Contactanos
            </h4>
            <p className="text-sm sm:text-base">
              Email: envialo@uniquindio.com
            </p>
            <p className="text-sm sm:text-base">Phone: 555-567-8901</p>
            <p className="text-sm sm:text-base">
              Address: 1234 Main St Moonstone City, Stardust State 12345
            </p>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-[#1C1C1E] p-4 rounded-lg w-full lg:w-auto max-w-md">
            <form className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                placeholder="Email"
                className="flex-grow p-3 border border-[#C3E956] rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
              />
              <button
                type="submit"
                className="bg-[#C3E956] text-black py-3 px-6 rounded-lg hover:bg-[#B3D946] transition duration-300"
              >
                Subscribe a nuestras noticias
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-4 flex flex-col lg:flex-row justify-between items-center text-sm">
          <p className="text-gray-400">
            © 2025 Envialo. All Rights Reserved.
          </p>
          <a
            href="#privacy"
            className="text-gray-400 hover:text-[#C3E956] transition duration-300"
          >
            Política de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;