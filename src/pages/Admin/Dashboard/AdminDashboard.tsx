import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Notify } from '../../../components/Notify';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showNotify, setShowNotify] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario autenticado
      } else {
        navigate('/login');
      }
    });  // <-- Aquí faltaba cerrar esta llave y paréntesis

    return () => unsubscribe();
  }, [navigate]);

  const handleNotify = () => {
    setShowNotify(true);
    setTimeout(() => setShowNotify(false), 1500);
  };

  const features = [
    { 
      name: "Crear envío", 
      icon: "📦", 
      color: "bg-green-500 hover:bg-green-600", 
      onClick: () => {
        console.log("Crear envío");
        navigate('/shipment');
      } 
    },
    { 
      name: "Recoger un paquete", 
      icon: "🚚", 
      color: "bg-yellow-500 hover:bg-yellow-600", 
      onClick: () => {
        console.log("Recogida");
        handleNotify();
      }  // <-- Aquí faltaba una coma
    },
    { 
      name: "Historial de envíos", 
      icon: "📁", 
      color: "bg-purple-500 hover:bg-purple-600", 
      onClick: () => {
        console.log("Historial");
        handleNotify();
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* ... (el resto del JSX permanece igual) ... */}
      <Notify message="🚧 En desarrollo" show={showNotify} />
    </div>
  );
};

export default Dashboard;
