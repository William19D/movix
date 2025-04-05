import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-3xl font-semibold mb-4">Hola {userName}</h2>
          <p className="text-gray-500 text-lg mb-6">Bienvenido a tu página de inicio</p>
          <div className="space-y-4">
            <button
              onClick={() => handleNavigation('/recoger-paquete')}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Recoger un paquete
            </button>
            <button
              onClick={() => handleNavigation('/consultar-envios')}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Consultar mis envíos
            </button>
            <button
              onClick={() => handleNavigation('/historial-envios')}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Historial de envíos
            </button>
            <button
              onClick={() => handleNavigation('/perfil')}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Mi perfil
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;