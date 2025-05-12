import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from "framer-motion";
import { FaTruck, FaSearch, FaSignOutAlt, FaUser, FaBox, FaClipboardList, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [pendingDeliveries, setPendingDeliveries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'pending'>('search');

  // Verificar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPendingDeliveries(currentUser.uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Buscar pedidos pendientes del transportista
  const fetchPendingDeliveries = async (driverId: string) => {
    try {
      setLoading(true);
      const enviosRef = collection(firestore, 'envios');
      const q = query(enviosRef, where('idDelivery', '==', driverId), where('estado', 'in', ['En tránsito', 'En ruta']));
      
      const querySnapshot = await getDocs(q);
      const envios = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPendingDeliveries(envios);
    } catch (error) {
      console.error('Error fetching pending deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar pedido por número de guía
  const searchByTrackingNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      showModalMessage('Por favor ingrese un número de guía', 'error');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const enviosRef = collection(firestore, 'envios');
      const q = query(enviosRef, where('codigoSeguimiento', '==', trackingNumber.trim()));
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setSearchResult(null);
        showModalMessage('No se encontró ningún envío con ese número de guía', 'error');
      } else {
        const envioData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        };
        
        setSearchResult(envioData);
        
        // Guardar en búsquedas recientes
        if (!recentSearches.includes(trackingNumber)) {
          setRecentSearches(prev => [trackingNumber, ...prev.slice(0, 4)]);
        }
      }
    } catch (error) {
      console.error('Error searching package:', error);
      setError('Error al buscar el envío');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado del pedido
  const updatePackageStatus = async (envioId: string, nuevoEstado: string) => {
    try {
      setLoading(true);
      
      const envioRef = doc(firestore, 'envios', envioId);
      
      // Crear objeto de historial de estados si no existe
      const estadoHistorial = searchResult.estadoHistorial || [];
      
      await updateDoc(envioRef, {
        estado: nuevoEstado,
        ultimaActualizacion: Timestamp.now(),
        estadoHistorial: [
          ...estadoHistorial,
          {
            estado: nuevoEstado,
            timestamp: Timestamp.now(),
            actualizadoPor: user.uid
          }
        ]
      });
      
      // Actualizar el resultado de búsqueda local
      setSearchResult({
        ...searchResult,
        estado: nuevoEstado,
        ultimaActualizacion: Timestamp.now()
      });
      
      // Actualizar lista de envíos pendientes
      fetchPendingDeliveries(user.uid);
      
      showModalMessage(`El estado del envío ha sido actualizado a: ${nuevoEstado}`, 'success');
    } catch (error) {
      console.error('Error updating package status:', error);
      showModalMessage('Error al actualizar el estado del envío', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Mostrar mensaje modal
  const showModalMessage = (message: string, type: 'success' | 'error') => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  // Obtener color según estado
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'Pendiente de pago': 'text-yellow-500',
      'Pago confirmado': 'text-blue-500',
      'En preparación': 'text-blue-500',
      'En tránsito': 'text-purple-500',
      'En ruta': 'text-orange-500',
      'Entregado': 'text-green-500',
      'Cancelado': 'text-red-500'
    };
    return statusColors[status] || 'text-gray-500';
  };

  // Formatear fecha
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaTruck className="text-[#5EEB5B] text-3xl mr-3" />
              <h1 className="text-2xl font-bold">Dashboard del Transportista</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Perfil" 
                      className="h-8 w-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">
                  {user?.displayName || user?.email || 'Transportista'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex items-center justify-center"
                title="Cerrar sesión"
              >
                <FaSignOutAlt className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'search' ? 'text-[#1C8E19] border-b-2 border-[#5EEB5B]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('search')}
          >
            <FaSearch className="inline mr-2" /> Buscar Envío
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'pending' ? 'text-[#1C8E19] border-b-2 border-[#5EEB5B]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            <FaClipboardList className="inline mr-2" /> Envíos Pendientes ({pendingDeliveries.length})
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Buscar Envío</h2>
            
            <form onSubmit={searchByTrackingNumber} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Seguimiento
                  </label>
                  <input
                    id="tracking"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EEB5B]"
                    placeholder="Ej: CDE-123456"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
                <div className="sm:self-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#5EEB5B] hover:bg-[#3BD838] text-black font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Buscando...
                      </span>
                    ) : (
                      <>
                        <FaSearch className="mr-2" /> Buscar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Búsquedas recientes:</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setTrackingNumber(search)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResult && (
              <div className="border border-gray-200 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Detalles del Envío</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(searchResult.estado)}`}>
                    {searchResult.estado}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Código de Seguimiento</p>
                    <p className="font-medium">{searchResult.codigoSeguimiento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Creación</p>
                    <p className="font-medium">{formatDate(searchResult.fechaCreacion)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ciudad Origen</p>
                    <p className="font-medium">{searchResult.ciudadOrigen}, {searchResult.departamentoOrigen}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ciudad Destino</p>
                    <p className="font-medium">{searchResult.ciudadDestino}, {searchResult.departamentoDestino}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Envío</p>
                    <p className="font-medium">{searchResult.tipoEnvio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Declarado</p>
                    <p className="font-medium">${searchResult.valorDeclarado?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Remitente</p>
                    <p className="font-medium">{searchResult.nombreRemitente}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Destinatario</p>
                    <p className="font-medium">{searchResult.nombreDestinatario}</p>
                    <p className="text-sm">{searchResult.celularDestinatario}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Dirección de Entrega</p>
                  <p className="font-medium">
                    {searchResult.direccionDestino}, {searchResult.ciudadDestino}, {searchResult.departamentoDestino}
                  </p>
                </div>
                
                {/* Update Status Buttons */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Actualizar Estado:</p>
                  <div className="flex flex-wrap gap-2">
                    {['En tránsito', 'En ruta', 'Entregado'].map(estado => (
                      <button
                        key={estado}
                        onClick={() => updatePackageStatus(searchResult.id, estado)}
                        disabled={loading || searchResult.estado === estado}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                          ${searchResult.estado === estado 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                      >
                        {estado}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* No Results */}
            {trackingNumber && !searchResult && !loading && error && (
              <div className="text-center py-8">
                <FaTimesCircle className="mx-auto text-red-500 text-3xl mb-2" />
                <p className="text-gray-700">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Pending Deliveries Tab */}
        {activeTab === 'pending' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Envíos Pendientes</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <svg className="animate-spin h-10 w-10 text-[#5EEB5B] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600">Cargando envíos...</p>
              </div>
            ) : (
              <>
                {pendingDeliveries.length > 0 ? (
                  <div className="space-y-4">
                    {pendingDeliveries.map(delivery => (
                      <div 
                        key={delivery.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setTrackingNumber(delivery.codigoSeguimiento);
                          setSearchResult(delivery);
                          setActiveTab('search');
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="bg-gray-100 p-2 rounded-lg mr-3">
                              <FaBox className="text-[#1C8E19] text-lg" />
                            </div>
                            <div>
                              <h3 className="font-medium">{delivery.codigoSeguimiento}</h3>
                              <p className="text-sm text-gray-600">{delivery.nombreDestinatario}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.estado)}`}>
                            {delivery.estado}
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600 flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-gray-500" />
                          {delivery.direccionDestino}, {delivery.ciudadDestino}, {delivery.departamentoDestino}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaClipboardList className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-700">No tienes envíos pendientes por entregar</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4"
            >
              <div className="flex items-center mb-4">
                {modalType === 'success' ? (
                  <FaCheckCircle className="text-green-500 text-2xl mr-2" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-2xl mr-2" />
                )}
                <h3 className={`text-xl font-bold ${modalType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {modalType === 'success' ? 'Éxito' : 'Error'}
                </h3>
              </div>
              <p className="text-gray-700 mb-5">{modalMessage}</p>
              <button
                onClick={() => setShowModal(false)}
                className={`w-full ${modalType === 'success' ? 'bg-[#5EEB5B] hover:bg-[#3BD838]' : 'bg-blue-600 hover:bg-blue-700'} text-black py-2 rounded-lg transition`}
              >
                Aceptar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}