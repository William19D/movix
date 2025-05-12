import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
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
      const packagesRef = collection(firestore, 'packages');
      const q = query(packagesRef, where('assignedDriver', '==', driverId), where('status', 'in', ['en_transito', 'en_ruta']));
      
      const querySnapshot = await getDocs(q);
      const packages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPendingDeliveries(packages);
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
      
      const packagesRef = collection(firestore, 'packages');
      const q = query(packagesRef, where('trackingNumber', '==', trackingNumber.trim()));
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setSearchResult(null);
        showModalMessage('No se encontró ningún pedido con ese número de guía', 'error');
      } else {
        const packageData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        };
        
        setSearchResult(packageData);
        
        // Guardar en búsquedas recientes
        if (!recentSearches.includes(trackingNumber)) {
          setRecentSearches(prev => [trackingNumber, ...prev.slice(0, 4)]);
        }
      }
    } catch (error) {
      console.error('Error searching package:', error);
      setError('Error al buscar el pedido');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado del pedido
  const updatePackageStatus = async (packageId: string, newStatus: string) => {
    try {
      setLoading(true);
      
      const packageRef = doc(firestore, 'packages', packageId);
      await updateDoc(packageRef, {
        status: newStatus,
        lastUpdated: new Date(),
        statusHistory: [
          ...(searchResult.statusHistory || []),
          {
            status: newStatus,
            timestamp: new Date(),
            updatedBy: user.uid
          }
        ]
      });
      
      // Actualizar el resultado de búsqueda local
      setSearchResult({
        ...searchResult,
        status: newStatus,
        lastUpdated: new Date()
      });
      
      // Actualizar lista de pedidos pendientes
      fetchPendingDeliveries(user.uid);
      
      showModalMessage(`El estado del pedido ha sido actualizado a: ${formatStatus(newStatus)}`, 'success');
    } catch (error) {
      console.error('Error updating package status:', error);
      showModalMessage('Error al actualizar el estado del pedido', 'error');
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

  // Formatear estado para mostrar
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'pendiente': 'Pendiente',
      'en_preparacion': 'En preparación',
      'en_transito': 'En tránsito',
      'en_ruta': 'En ruta de entrega',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Obtener color según estado
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'pendiente': 'text-yellow-500',
      'en_preparacion': 'text-blue-500',
      'en_transito': 'text-purple-500',
      'en_ruta': 'text-orange-500',
      'entregado': 'text-green-500',
      'cancelado': 'text-red-500'
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
            <FaSearch className="inline mr-2" /> Buscar Pedido
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'pending' ? 'text-[#1C8E19] border-b-2 border-[#5EEB5B]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            <FaClipboardList className="inline mr-2" /> Pedidos Pendientes ({pendingDeliveries.length})
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Buscar Pedido</h2>
            
            <form onSubmit={searchByTrackingNumber} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Guía
                  </label>
                  <input
                    id="tracking"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EEB5B]"
                    placeholder="Ej: MX12345678"
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
                  <h3 className="text-lg font-semibold">Detalles del Pedido</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(searchResult.status)}`}>
                    {formatStatus(searchResult.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Número de Guía</p>
                    <p className="font-medium">{searchResult.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Creado</p>
                    <p className="font-medium">{formatDate(searchResult.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Origen</p>
                    <p className="font-medium">{searchResult.origin || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destino</p>
                    <p className="font-medium">{searchResult.destination || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destinatario</p>
                    <p className="font-medium">{searchResult.recipientName || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{searchResult.recipientPhone || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-1">Dirección de Entrega</p>
                  <p className="font-medium">
                    {searchResult.deliveryAddress || 'No especificada'}
                  </p>
                </div>
                
                {/* Update Status Buttons */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Actualizar Estado:</p>
                  <div className="flex flex-wrap gap-2">
                    {['en_transito', 'en_ruta', 'entregado'].map(status => (
                      <button
                        key={status}
                        onClick={() => updatePackageStatus(searchResult.id, status)}
                        disabled={loading || searchResult.status === status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                          ${searchResult.status === status 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                      >
                        {formatStatus(status)}
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
            <h2 className="text-xl font-semibold mb-4">Pedidos Pendientes</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <svg className="animate-spin h-10 w-10 text-[#5EEB5B] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600">Cargando pedidos...</p>
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
                          setTrackingNumber(delivery.trackingNumber);
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
                              <h3 className="font-medium">{delivery.trackingNumber}</h3>
                              <p className="text-sm text-gray-600">{delivery.recipientName}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                            {formatStatus(delivery.status)}
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600 flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-gray-500" />
                          {delivery.deliveryAddress || 'Dirección no especificada'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaClipboardList className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-700">No tienes pedidos pendientes por entregar</p>
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