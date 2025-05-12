import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { Notify } from '../../../components/Notify';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface UserData {
  name: string;
  email: string;
  city: string;
  department: string;
  createdAt?: Date;
}

const UserProfilePage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const [notifyMessage, setNotifyMessage] = useState('');
  const [showNotify, setShowNotify] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setProfilePhoto(user.photoURL || 'https://randomuser.me/api/portraits/women/44.jpg');

        try {
          const userDoc = await getDoc(doc(db, 'clientes', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              name: user.displayName || data.name || user.email?.split('@')[0] || 'Usuario',
              email: user.email || data.email || '',
              city: data.city || 'None',
              department: data.department || 'None',
              createdAt: data.createdAt?.toDate()
            });
          } else {
            setUserData({
              name: user.displayName || user.email?.split('@')[0] || 'Usuario',
              email: user.email || '',
              city: 'None',
              department: 'None'
            });
          }
        } catch (error) {
          console.error("Error obteniendo datos:", error);
          setNotifyMessage("Error al cargar datos del usuario");
          setShowNotify(true);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleDesactivarCuenta = async () => {
    setDeleting(true);
    try {
      if (!auth.currentUser) throw new Error('No autenticado');
      
      const functions = getFunctions(app);
      const desactivarCuenta = httpsCallable(functions, 'desactivarCuenta');
      
      await desactivarCuenta({ idCliente: auth.currentUser.uid });
      
      setNotifyMessage('✅ Cuenta desactivada correctamente');
      setShowNotify(true);
      setShowDeleteModal(false); // Cerrar modal inmediatamente
      
      setTimeout(() => {
        signOut(auth);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setNotifyMessage('❌ ' + (error instanceof Error ? error.message : 'Error al desactivar la cuenta'));
      setShowNotify(true);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!deleting) {
      setShowDeleteModal(false);
    }
  };

  // Cerrar modal cuando se muestra la notificación
  useEffect(() => {
    if (showNotify) {
      const timer = setTimeout(() => {
        setShowNotify(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotify]);

  const profileActions = [
    { 
      name: "Editar Perfil", 
      icon: "✏️", 
      color: "bg-blue-500 hover:bg-blue-600", 
      onClick: () => navigate('/change-info')
    },
    { 
      name: "Configuración", 
      icon: "⚙️", 
      color: "bg-yellow-500 hover:bg-yellow-600", 
      onClick: () => {
        setNotifyMessage('⚙️ Configuración en desarrollo');
        setShowNotify(true);
      }
    },
    { 
      name: "Eliminar cuenta", 
      icon: "🗑️", 
      color: "bg-red-500 hover:bg-red-600", 
      onClick: () => setShowDeleteModal(true)
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error al cargar los datos del usuario</div>
      </div>
    );
  }

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
            {/* Sección superior */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
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

              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{userData.name}</h2>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => navigate(-1)}
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
                    <span className="text-gray-500 w-32">Tipo:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Usuario
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Miembro desde:</span>
                    <span className="font-medium">
                      {userData.createdAt?.toLocaleDateString() || 'No disponible'}
                    </span>
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
                {['Total Envíos', 'Pendientes', 'Entregados', 'En Tránsito'].map((item, index) => (
                  <div key={index} className={`bg-${[
                    'blue', 'yellow', 'green', 'purple'
                  ][index]}-50 p-4 rounded-lg`}>
                    <p className={`text-${[
                      'blue', 'yellow', 'green', 'purple'
                    ][index]}-800 text-sm font-medium`}>{item}</p>
                    <p className={`text-2xl font-bold text-${[
                      'blue', 'yellow', 'green', 'purple'
                    ][index]}-600`}>(data)</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Acciones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`${action.color} text-white w-full h-18 rounded-lg transition-all duration-200 hover:opacity-90 flex items-center justify-center space-x-2`}
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

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar desactivación</h2>
            <div className="flex items-start mb-6">
              <svg className="w-6 h-6 text-red-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-600">
                ¿Estás seguro de desactivar tu cuenta? Esta acción es reversible contactando al soporte.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                disabled={deleting}
                className={`px-4 py-2 border rounded-md transition-colors ${
                  deleting 
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleDesactivarCuenta}
                disabled={deleting}
                className={`px-4 py-2 rounded-md text-white ${
                  deleting ? 'bg-red-400 cursor-wait' : 'bg-red-600 hover:bg-red-700'
                } flex items-center justify-center min-w-[120px]`}
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación */}
      <Notify 
        message={notifyMessage}
        show={showNotify}
      />
    </div>
  );
};

export default UserProfilePage;