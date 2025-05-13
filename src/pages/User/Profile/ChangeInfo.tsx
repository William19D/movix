import { useState, useEffect } from 'react';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { db, auth } from '../../../firebase';
import { Notify } from '../../../components/Notify';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

interface DepartmentOption {
  value: number;
  label: string;
}

interface CityOption {
  value: number;
  label: string;
}

interface UserData {
  name: string;
  email: string;
  city: string;
  department: string;
}

const ChangeInfo = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    city: '',
    department: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');


  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
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
                department: data.department || '',
  
               
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




  
   useEffect(() => {
      const handleRedirectResult = async () => {
        try {
          const result = await getRedirectResult(auth);
          if (result?.user) {
            navigate('/home');
          }
        } catch (error: any) {
          handleAuthError(error);
        }
      };
      handleRedirectResult();
    }, [navigate]);

  // Obtener departamentos de Colombia
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('https://api-colombia.com/api/v1/Department');
        const data = await response.json();
        
        const departmentsOptions = data.map((department: {id: number, name: string}) => ({
          value: department.id,
          label: department.name,
        }));
        
        setDepartments(departmentsOptions);
        
        // Seleccionar departamento actual del usuario
        if (userData.department) {
          const currentDept = departmentsOptions.find(
            (dept: DepartmentOption) => dept.label === userData.department
          );
          if (currentDept) setSelectedDepartment(currentDept);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [userData.department]);

  // Obtener ciudades cuando se selecciona un departamento
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedDepartment) {
        setLoadingCities(true);
        try {
          const response = await fetch(
            `https://api-colombia.com/api/v1/Department/${selectedDepartment.value}/cities`
          );
          const data = await response.json();
          
          const citiesOptions = data.map((city: {id: number, name: string}) => ({
            value: city.id,
            label: city.name,
          }));
          
          setCities(citiesOptions);
          
          // Seleccionar ciudad actual del usuario
          if (userData.city) {
            const currentCity = citiesOptions.find(
              (city: CityOption) => city.label === userData.city
            );
            if (currentCity) setSelectedCity(currentCity);
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        } finally {
          setLoadingCities(false);
        }
      }
    };

    fetchCities();
  }, [selectedDepartment, userData.city]);

  // Manejadores
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (selectedOption: DepartmentOption | null) => {
    setSelectedDepartment(selectedOption);
    setSelectedCity(null);
  };

  const handleCityChange = (selectedOption: CityOption | null) => {
    setSelectedCity(selectedOption);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (auth.currentUser) {
        // Actualizar datos en Firestore
        await updateDoc(doc(db, 'clientes', auth.currentUser.uid), {
          name: formData.name,
          city: selectedCity?.label || '',
          department: selectedDepartment?.label || ''
        });

        // Actualizar contraseña si es necesario
        if (showPasswordFields && formData.newPassword && formData.currentPassword) {
          if (formData.newPassword !== formData.confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
          }

          const credential = EmailAuthProvider.credential(
            auth.currentUser.email || '',
            formData.currentPassword
          );

          await reauthenticateWithCredential(auth.currentUser, credential);
          await updatePassword(auth.currentUser, formData.newPassword);
        }

        // Actualizar estado local
        setUserData(prev => ({
          ...prev,
          name: formData.name,
          city: selectedCity?.label || '',
          department: selectedDepartment?.label || ''
        }));

        setNotifyMessage('Perfil actualizado correctamente');
        setShowNotify(true);
        setTimeout(() => {
          setShowNotify(false);
          navigate(-1); // Regresar a la página anterior
        }, 1500);
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setNotifyMessage(error instanceof Error ? error.message : 'Error al actualizar el perfil');
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Editar <span className="text-blue-600">Perfil</span>
              </h2>
              <button
                    onClick={() => navigate(-1)} // Regresa a la página anterior
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Cerrar formulario"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Nombre */}
                <div className="form-group">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Departamento */}
                <div className="form-group">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Departamento
                  </label>
                  <Select
                    options={departments}
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    isLoading={loadingDepartments}
                    placeholder="Selecciona un departamento"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "No hay departamentos disponibles"}
                  />
                </div>

                {/* Municipio/Ciudad */}
                <div className="form-group">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Ciudad/Municipio
                  </label>
                  <Select
                    options={cities}
                    value={selectedCity}
                    onChange={handleCityChange}
                    isLoading={loadingCities}
                    isDisabled={!selectedDepartment}
                    placeholder={selectedDepartment ? "Selecciona una ciudad" : "Primero selecciona un departamento"}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "No hay ciudades disponibles"}
                  />
                </div>

                {/* Campos de contraseña (condicionales) */}
                {showPasswordFields && (
                  <>
                    <div className="form-group md:col-span-2">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Cambiar contraseña</h3>
                    </div>
                    <div className="form-group">
                      <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-medium mb-2">
                        Contraseña actual
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-2">
                        Nueva contraseña
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                        Confirmar nueva contraseña
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </>
                )}

                {/* Botón para mostrar/ocultar campos de contraseña */}
                <div className="form-group md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    {showPasswordFields ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Ocultar cambio de contraseña
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Cambiar contraseña
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <Notify message={notifyMessage} show={showNotify} />
      </div>
    </div>
  );
};

export default ChangeInfo;

function handleAuthError(error: any) {
    throw new Error('Function not implemented.');
}
