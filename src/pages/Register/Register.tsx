import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';


interface Option {
    value: number;
    label: string;
}
interface User {
  name: string;
  email: string;
  password: string;
  departamento: string;
  municipio: string;
}

export default function Register() {
    const [departments, setDepartments] = useState<Option[]>([]);
    const [cities, setCities] = useState<Option[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<SingleValue<Option>>(null);
    const [selectedCity, setSelectedCity] = useState<SingleValue<Option>>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Nuevo estado
    const [error, setError] = useState<string | null>(null); // Nuevo estado para el error
    const [isModalOpen, setIsModalOpen] = useState(false); // Nuevo estado para el modal

    useEffect(() => {
        // Obtener la lista de departamentos de Colombia
        fetch('https://api-colombia.com/api/v1/Department')
            .then(response => response.json())
            .then(data => {
                const departmentsOptions = data.map((departamento: any) => ({
                    value: departamento.id,
                    label: departamento.name,
                }));
                setDepartments(departmentsOptions);
            })
            .catch(error => {
                console.error("Error fetching departamentos:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            // Obtener los municipios del departamento seleccionado
            fetch(`https://api-colombia.com/api/v1/Department/${selectedDepartment.value}/cities`)
                .then(response => response.json())
                .then(data => {
                    const citiesOptions = data.map((municipio: any) => ({
                        value: municipio.id,
                        label: municipio.name,
                    }));
                    setCities(citiesOptions);
                })
                .catch(error => {
                    console.error("Error fetching municipios:", error);
                });
        }
    }, [selectedDepartment]);

    const cleanUpForm = () => {
      setName('');
      setEmail('');
      setPassword('');
      setSelectedDepartment(null);
      setSelectedCity(null);
    };
    
    const handleDepartmentChange = (selectedOption: SingleValue<Option>) => {
        setSelectedDepartment(selectedOption);
        setSelectedCity(null); // Resetear municipio al cambiar departamento
    };

    const handleCityChange = (selectedOption: SingleValue<Option>) => {
        setSelectedCity(selectedOption); 
    };

    const registerUser = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          // Crea el usuario en Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
  
          if (user) {
              // Guarda los datos adicionales en Cloud Firestore
              const clientsCollection = collection(db, 'clientes');
              const userDocRef = doc(clientsCollection, user.uid);
              await setDoc(userDocRef, {
                  name: name, // Usamos la variable name del estado
                  email: email, // Usamos la variable email del estado
                  department: selectedDepartment?.label || '',
                  city: selectedCity?.label || '',
              });
              console.log('Usuario registrado con éxito');
              cleanUpForm();

          }
        } catch (error: any) { // Tipamos el error como `any` para acceder a sus propiedades
            let errorMessage = "Error al registrar usuario";
            
            // Manejo de errores específicos de Firebase
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "El correo electrónico ya está en uso.";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "La contraseña es demasiado débil (mínimo 6 caracteres).";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "El correo electrónico no es válido.";
            }
            
            setError(errorMessage);
            setIsModalOpen(true); // Mostrar el modal de error
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
               {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Fondo con blur y transición suave */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={closeModal} // Cierra al hacer clic fuera
                    ></div>

                    {/* Contenedor del modal con animación de escala */}
                    <div className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                        <h3 className="text-xl font-bold text-red-600 mb-3">Error en el registro</h3>
                        <p className="text-gray-700 mb-5">{error}</p>
                        <button
                            onClick={closeModal}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
            <div className="flex bg-white p-8 rounded-2xl shadow-lg w-3/4">
                <div className="flex flex-col items-start justify-center w-1/2 pr-8">
                    <h2 className="text-3xl font-semibold mb-4">Bienvenido a Movix</h2>
                    <p className="text-gray-500 text-lg mb-4">Regístrate para empezar a gestionar tus envíos y rastrear tus paquetes de manera sencilla y rápida.</p>
                    <img src="register.jpg" alt="Registro" className="w-full h-auto" />
                </div>
                <div className="flex flex-col items-center justify-center w-1/2">
                    <div className="flex flex-col items-center mb-6">
                        <h2 className="text-2xl font-semibold">Registrarse</h2>
                        <p className="text-gray-500 text-sm">Crea una cuenta para comenzar</p>
                    </div>

                    <form className="space-y-4 w-full" onSubmit={registerUser}>
                        <div>
                            <label className="text-sm text-gray-600">Nombre</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Correo electrónico</label>
                            <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'} {/* Opcional: puedes cambiar el ícono según el estado */}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Departamento</label>
                            <Select
                                options={departments}
                                value={selectedDepartment}
                                onChange={handleDepartmentChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Municipio</label>
                            <Select
                                options={cities}
                                value={selectedCity}
                                onChange={handleCityChange}
                                className="w-full"
                                isDisabled={!selectedDepartment}
                            />
                        </div>
                        <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600" type="submit">Registrarse</button>
                    </form>
                </div>
            </div>
        </div>
    );
}