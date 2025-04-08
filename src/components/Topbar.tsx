import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Notify} from '../components/Notify';

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const [showNotify, setShowNotify] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    navigate('/register');
    setMobileMenuOpen(false);
  };

  const handleCotizarClick = () => {
    navigate('/cotizar');
    setMobileMenuOpen(false);
  };

  const handleNotify = () => {
    setShowNotify(true);
    setMobileMenuOpen(false);
    setTimeout(() => setShowNotify(false), 1500);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <div className={`relative flex items-center justify-between p-2.5 px-4 sm:px-5 bg-white shadow-md ${showNotify ? 'blur-sm' : ''}`}>
        {/* Logo - Centered on mobile, left on larger screens */}
        <div 
          className="flex items-center ml-0 sm:ml-[5%] md:ml-[8%] lg:ml-[11%]" 
          onClick={handleLogoClick} 
          style={{ cursor: 'pointer' }}
        >
          <img src="vite.svg" alt="Logo" className="h-[6vh] mr-2" />
          <h2 className="text-[4vh] sm:text-[5vh] m-0 font-bold">Movix</h2>
        </div>

        {/* Hamburger menu button - Visible only on mobile */}
        <button 
          className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 p-2 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <div className="w-6 h-0.5 bg-black mb-1.5"></div>
          <div className="w-6 h-0.5 bg-black mb-1.5"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>

        {/* Navigation Links - Hidden on mobile, visible on larger screens */}
        <div className="hidden md:flex items-center gap-[2vh] lg:gap-[5vh]">
          <a href="cotizar" className="text-black text-[1.8vh] lg:text-[2vh] no-underline hover:underline" onClick={handleCotizarClick}>
            Cotizar
          </a>
          <button onClick={handleNotify} className="text-black text-[1.8vh] lg:text-[2vh] hover:underline bg-transparent border-none cursor-pointer">
            Rastrear
          </button>
          <button onClick={handleNotify} className="text-black text-[1.8vh] lg:text-[2vh] hover:underline bg-transparent border-none cursor-pointer">
            Enviar
          </button>
          <button onClick={handleNotify} className="text-black text-[1.8vh] lg:text-[2vh] hover:underline bg-transparent border-none cursor-pointer">
            Contáctanos
          </button>
        </div>

        {/* Login/Register buttons - Hidden on mobile, visible on larger screens */}
        <div className="hidden md:flex items-center gap-3 lg:gap-5 mr-[5%] lg:mr-[11%]">
          <button
            className="bg-[#C3E956] text-[1.8vh] lg:text-[2vh] rounded-2xl border border-solid py-3 px-6 lg:py-5 lg:px-8 cursor-pointer hover:bg-[#a6d71c]"
            onClick={handleLoginClick}
          >
            Ingresar
          </button>
          <a href="register" className="text-black text-[1.8vh] lg:text-[2vh] hover:underline" onClick={handleRegisterClick}>
            Registrarse
          </a>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 pt-20 px-4">
          <div className="flex flex-col items-center gap-6">
            <a 
              href="cotizar" 
              className="text-black text-xl no-underline hover:underline w-full text-center py-3 border-b border-gray-200"
              onClick={handleCotizarClick}
            >
              Cotizar
            </a>
            <button 
              onClick={handleNotify} 
              className="text-black text-xl hover:underline bg-transparent border-none cursor-pointer w-full text-center py-3 border-b border-gray-200"
            >
              Rastrear
            </button>
            <button 
              onClick={handleNotify} 
              className="text-black text-xl hover:underline bg-transparent border-none cursor-pointer w-full text-center py-3 border-b border-gray-200"
            >
              Enviar
            </button>
            <button 
              onClick={handleNotify} 
              className="text-black text-xl hover:underline bg-transparent border-none cursor-pointer w-full text-center py-3 border-b border-gray-200"
            >
              Contáctanos
            </button>
            
            <div className="flex flex-col w-full gap-4 mt-6">
              <button
                className="bg-[#C3E956] text-xl rounded-2xl border border-solid py-4 px-8 cursor-pointer hover:bg-[#a6d71c] w-full"
                onClick={handleLoginClick}
              >
                Ingresar
              </button>
              <button 
                className="text-black text-xl hover:underline bg-transparent border border-gray-300 rounded-2xl py-4 w-full" 
                onClick={handleRegisterClick}
              >
                Registrarse
              </button>
            </div>
            
            {/* Close button */}
            <button 
              onClick={toggleMobileMenu} 
              className="absolute top-6 right-6 text-2xl font-bold"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Notify message="🚧 En desarrollo" show={showNotify} />
    </>
  );
};

export default Topbar;