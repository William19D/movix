import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {Notify} from '../../../components/Notify'; 
import { useEffect, useState } from 'react';

const Dashboard = () => {



  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [showNotify, setShowNotify] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const nameFromEmail = user.email ? user.email.split('@')[0] : '';
        setUserName(user.displayName || nameFromEmail);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  const handleNotify = () => {
    setShowNotify(true);
    setTimeout(() => setShowNotify(false), 1500);
  };

  const features = [
    { 
        name: "Perfil", 
        icon: "👤", 
        color: "bg-blue-500 hover:bg-blue-600", 
        onClick: () => {
        console.log("Perfil clickeado") ;
        navigate('/profile');
        }
    },
    { 
        name: "Consultar mis envíos", 
        icon: "📦", 
        color: "bg-green-500 hover:bg-green-600", 
        onClick: () => {
            console.log("Consultar envíos");
            handleNotify(); 
        } 
    },
    { 
        name: "Historial de envíos", 
        icon: "📁", 
        color: "bg-purple-500 hover:bg-purple-600", 
        onClick: () => {
          console.log("Historial") 
          handleNotify();
        }
    },
    { 
        name: "Solicitar recogida", 
        icon: "🚚", 
        color: "bg-yellow-500 hover:bg-yellow-600", 
        onClick: () => {
          console.log("Recogida")
          handleNotify();
        } 
    },
];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera responsive */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            ¡Bienvenido, <span className="text-blue-600">{userName}</span>!
          </h1>
          <p className="text-gray-600 mt-2 md:mt-4 text-base md:text-lg">
            Accede a las funcionalidades del sistema
          </p>
        </div>

        {/* Panel principal */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            {/* Grid de botones responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={feature.onClick}
                  className={`${feature.color} text-white w-full h-28 md:h-32 py-2 px-4 rounded-lg transition-all cursor-pointer duration-200 transform hover:scale-[1.02] flex flex-col items-center justify-center space-y-2 group`}
                >
                  <span className="text-4xl md:text-6xl transition-transform duration-200 group-hover:scale-110">
                    {feature.icon}
                  </span>
                  <span className="text-sm md:text-base font-medium text-center px-2">
                    {feature.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Notify message="🚧 En desarrollo" show={showNotify} />
    </div>
    
  );
};

export default Dashboard;