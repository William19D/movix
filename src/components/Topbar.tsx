import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Notify} from '../components/Notify';

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const [showNotify, setShowNotify] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleCotizarClick = () => {
    navigate('/cotizar');
  };

  const handleNotify = () => {
    setShowNotify(true);
    setTimeout(() => setShowNotify(false), 1500);
  };

  return (
    <>
      <div className={`flex items-center justify-between p-2.5 px-5 bg-white shadow-md ${showNotify ? 'blur-sm' : ''}`}>
        <div className="flex items-center ml-[11%]" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src="vite.svg" alt="Logo" className="h-[6vh] mr-2.5" />
          <h2 className="text-[5vh] m-0 font-bold">Movix</h2>
        </div>
        <div className="flex items-center gap-[5vh]">
          <a href="cotizar" className="text-black text-[2vh] no-underline hover:underline" onClick={handleCotizarClick}>
            Cotizar
          </a>
          <button onClick={handleNotify} className="text-black text-[2vh] hover:underline bg-transparent border-none cursor-pointer">
            Rastrear
          </button>
          <button onClick={handleNotify} className="text-black text-[2vh] hover:underline bg-transparent border-none cursor-pointer">
            Enviar
          </button>
          <button onClick={handleNotify} className="text-black text-[2vh] hover:underline bg-transparent border-none cursor-pointer">
            Contáctanos
          </button>
        </div>
        <div className="flex items-center gap-5 mr-[11%]">
          <button
            className="bg-[#b9ff66] text-[2vh] rounded-2xl border border-solid py-5 px-8 cursor-pointer hover:bg-[#a4e05b]"
            onClick={handleLoginClick}
          >
            Ingresar
          </button>
          <a href="register" className="text-black text-[2vh] hover:underline" onClick={handleRegisterClick}>
            Registrarse
          </a>
        </div>
      </div>

      <Notify message="🚧 En desarrollo" show={showNotify} />
    </>
  );
};

export default Topbar;
