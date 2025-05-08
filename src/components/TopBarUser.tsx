import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Notify from '../components/Notify';

const TopbarUser: React.FC = () => {
  const navigate = useNavigate();
  const [showNotify, setShowNotify] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
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
          <a href="#cotizar" className="text-black text-[2vh] no-underline hover:underline" onClick={handleCotizarClick}>
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
        <div>
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <Notify message="🚧 En desarrollo" show={showNotify} />
    </>
  );
};

export default TopbarUser;
