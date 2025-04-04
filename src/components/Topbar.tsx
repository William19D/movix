import React from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-between p-2.5 px-5 bg-white shadow-md">
      <div className="flex items-center ml-[11%]" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="vite.svg" alt="Logo" className="h-[6vh] mr-2.5" />
        <h2 className="text-[5vh] m-0 font-bold">Movix</h2>
      </div>
      <div className="flex items-center gap-[5vh]">
        <a href="#cotizar" className="text-black text-[2vh] no-underline hover:underline">Cotizar</a>
        <a href="#rastrear" className="text-black text-[2vh] no-underline hover:underline">Rastrear</a>
        <a href="#enviar" className="text-black text-[2vh] no-underline hover:underline">Enviar</a>
        <a href="#contactanos" className="text-black text-[2vh] no-underline hover:underline">Contáctanos</a>
      </div>
      <div className="flex items-center gap-5 mr-[11%]">
        <button 
          className="bg-[#b9ff66] text-[2vh] rounded-2xl border border-solid py-5 px-8 cursor-pointer hover:bg-[#a4e05b]"
          onClick={handleLoginClick}
        >
          Ingresar
        </button>
        <a href="register" className="text-black text-[2vh] hover:underline" onClick={handleRegisterClick}>Registrarse</a>
      </div>
    </div>
  );
};

export default Topbar;