import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const TopbarAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email);
        setUserPhoto(user.photoURL);
      } else {
        setUserName(null);
        setUserPhoto(null);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCotizarClick = () => {
    navigate('/cotizar');
  };

  return (
    <div className="flex items-center justify-between p-2.5 px-5 bg-white shadow-md">
      <div className="flex items-center ml-[11%]" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="vite.svg" alt="Logo" className="h-[6vh] mr-2.5" />
        <h2 className="text-[5vh] m-0 font-bold">Movix</h2>
      </div>
      <div className="flex items-center gap-[5vh]">
        <a href="#cotizar" className="text-black text-[2vh] no-underline hover:underline"onClick={handleCotizarClick}>Cotizar</a>
        <a href="#rastrear" className="text-black text-[2vh] no-underline hover:underline" >Rastrear</a>
        <a href="#enviar" className="text-black text-[2vh] no-underline hover:underline">Enviar</a>
        <a href="#contactanos" className="text-black text-[2vh] no-underline hover:underline">Contáctanos</a>
      </div>
     {
      /*
      <div className="flex items-center gap-5 mr-[11%] relative">
        {userName && userPhoto && (
          <div className="relative">
            <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
              <img 
                src={userPhoto} 
                alt="User Photo" 
                className="w-10 h-10 rounded-full object-cover mr-2"
                referrerPolicy="no-referrer"
              />
              <span className="text-black text-[2vh]">{userName.split(' ')[0]}</span>
            </div>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div> 
      */
     } 
     <div>
      <button 
      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
      onClick={handleLogout}>
        Cerrar Sesion
      </button>
     </div>
    </div>
  );
};

export default TopbarAdmin;