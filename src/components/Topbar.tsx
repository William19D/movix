import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notify } from '../components/Notify';

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const [showNotify, setShowNotify] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const handleLabelClick = (label: string, action: () => void) => {
    setActiveLabel(label); // Set the active label
    action(); // Perform the action (e.g., navigation or notify)
  };

  const handleLogoClick = () => {
    setActiveLabel(null); // Remove all active labels
    navigate('/'); // Navigate to the home page
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

  const handleRastrearClick = () => {
    navigate('/rastrear');
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
        {/* Logo */}
        <div 
          className="flex items-center ml-0 sm:ml-[5%] md:ml-[8%] lg:ml-[11%]" 
          onClick={handleLogoClick} 
          style={{ cursor: 'pointer' }}
        >
          <img src="vite.svg" alt="Logo" className="h-[6vh] mr-2" />
          <h2 className="text-[4vh] sm:text-[5vh] m-0 font-bold">Movix</h2>
        </div>

        {/* Hamburger menu button */}
        <button 
          className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 p-2 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <div className="w-6 h-0.5 bg-black mb-1.5"></div>
          <div className="w-6 h-0.5 bg-black mb-1.5"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-[2vh] lg:gap-[5vh]">
          <button
            className={`text-[1.8vh] lg:text-[2vh] px-2 py-1 rounded cursor-pointer transition-colors duration-300 ${
              activeLabel === 'Cotizar' ? 'bg-[#C3E956] text-black' : 'text-black hover:text-[#8eb717]'
            }`}
            onClick={() => handleLabelClick('Cotizar', handleCotizarClick)}
          >
            Cotizar
          </button>
          <button
            className={`text-[1.8vh] lg:text-[2vh] px-2 py-1 rounded cursor-pointer transition-colors duration-300 ${
              activeLabel === 'Rastrear' ? 'bg-[#C3E956] text-black' : 'text-black hover:text-[#8eb717]'
            }`}
            onClick={() => handleLabelClick('Rastrear', handleRastrearClick)}
          >
            Rastrear
          </button>
          <button
            className={`text-[1.8vh] lg:text-[2vh] px-2 py-1 rounded cursor-pointer transition-colors duration-300 ${
              activeLabel === 'Enviar' ? 'bg-[#C3E956] text-black' : 'text-black hover:text-[#8eb717]'
            }`}
            onClick={() => handleLabelClick('Enviar', handleNotify)}
          >
            Enviar
          </button>
          <button
            className={`text-[1.8vh] lg:text-[2vh] px-2 py-1 rounded cursor-pointer transition-colors duration-300 ${
              activeLabel === 'Contáctanos' ? 'bg-[#C3E956] text-black' : 'text-black hover:text-[#8eb717]'
            }`}
            onClick={() => handleLabelClick('Contáctanos', handleNotify)}
          >
            Contáctanos
          </button>
        </div>

        {/* Login/Register buttons */}
        <div className="hidden md:flex items-center gap-3 lg:gap-5 mr-[5%] lg:mr-[11%]">
          <button
            className="bg-[#C3E956] text-[1.8vh] lg:text-[2vh] rounded-2xl border border-solid py-2 px-6 lg:py-3 lg:px-8 cursor-pointer hover:bg-[#a6d71c]"
            onClick={handleLoginClick}
          >
            Ingresar
          </button>
          <button
            className="text-black text-[1.8vh] lg:text-[2vh] hover:underline"
            onClick={handleRegisterClick}
            style={{ cursor: 'pointer' }}
            
          >
            Registrarse
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 pt-20 px-4">
          <div className="flex flex-col items-center gap-6">
            {['Cotizar', 'Rastrear', 'Enviar', 'Contáctanos'].map((label) => (
              <button
                key={label}
                className={`text-black text-xl w-full text-center py-3 border-b border-gray-200 rounded transition-colors duration-300 ${
                  activeLabel === label ? 'bg-[#C3E956] text-black' : 'hover:text-[#C3E956]'
                }`}
                onClick={() =>
                  handleLabelClick(
                    label,
                    label === 'Cotizar'
                      ? handleCotizarClick
                      : label === 'Rastrear'
                      ? handleRastrearClick
                      : handleNotify
                  )
                }
              >
                {label}
              </button>
            ))}

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