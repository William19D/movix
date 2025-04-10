import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase'; // Asegúrate de importar tus configuraciones de Firebase
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  email: string;
  city: string;
  department: string;
}

const UserProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtener foto de perfil de Google
        if (user.photoURL) {
          setProfilePhoto(user.photoURL);
        } else {
          setProfilePhoto('https://randomuser.me/api/portraits/women/44.jpg'); // Foto por defecto
        }

        // Obtener datos adicionales de Firestore
        try {
          const userDoc = await getDoc(doc(db, 'clientes', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(
              {
              name: user.displayName || data.name || user.email?.split('@')[0] || 'Usuario',
              email: user.email || data.email || '',
              city: data.city || '' ,
              department: data.department || ''

             
            });
          } else {
            // Datos por defecto si no existe el documento
            setUserData({
              name: user.displayName || user.email?.split('@')[0] || 'Usuario',
              email: user.email || '',
              city: 'None' ,
              department: 'None'
            });
          }
        } catch (error) {
          console.error("Error obteniendo datos de Firestore:", error);
        }
        
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
          <p className="mt-3">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return <div>Error al cargar los datos del usuario</div>;
  }

  const profileActions = [
    { 
      name: "Editar Perfil", 
      icon: "✏️", 
      color: "bg-blue-500 hover:bg-blue-600", 
      onClick: () => console.log("Editar perfil") 
    },
    { 
      name: "Cambiar Contraseña", 
      icon: "🔒", 
      color: "bg-purple-500 hover:bg-purple-600", 
      onClick: () => console.log("Cambiar contraseña") 
    },
    { 
      name: "Configuración", 
      icon: "⚙️", 
      color: "bg-yellow-500 hover:bg-yellow-600", 
      onClick: () => console.log("Configuración") 
    },
    { 
      name: "Cerrar Sesión", 
      icon: "🚪", 
      color: "bg-red-500 hover:bg-red-600", 
      onClick: () => auth.signOut().then(() => navigate('/login')) 
    },
  ];
  const handleRegresarClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Mi <span className="text-blue-600">Perfil</span>
          </h1>
          <p className="text-gray-600 mt-2 md:mt-3 text-base md:text-lg">
            Administra tu información personal y configuración
          </p>
        </div>

        
  
        
       
       
        

        {/* Contenido principal */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            {/* Sección superior: Información básica */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              {/* Avatar y datos personales */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src={profilePhoto} 
                    alt="Avatar" 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-100"
                  />
                  <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Activo
                  </span>
                </div>
              </div>

              {/* Datos del usuario */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{userData.name}</h2>
              
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    onClick={handleRegresarClick}
                  >
                    Regresar
                  </button>
              
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Email:</span>
                    <span className="font-medium">{userData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Tipo de cuenta:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Usuario
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Miembro desde:</span>
                    <span className="font-medium">(Data)</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Ciudad:</span>
                    <span className="font-medium">{userData.city}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Departamento:</span>
                    <span className="font-medium">{userData.department}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tus Estadísticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">Total Envíos</p>
                  <p className="text-2xl font-bold text-blue-600">(data)</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">(data)</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">Entregados</p>
                  <p className="text-2xl font-bold text-green-600">(data)</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800 text-sm font-medium">En Tránsito</p>
                  <p className="text-2xl font-bold text-purple-600">(data)</p>
                </div>
              </div>
            </div>

            {/* Acciones de perfil */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Acciones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {profileActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`${action.color} text-white w-full h-24 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-90 flex items-center justify-center space-x-2`}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="font-medium">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;