import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from "framer-motion";

interface Option {
    value: number;
    label: string;
}

const Register: React.FC = () => {
    const [departments, setDepartments] = useState<Option[]>([]);
    const [cities, setCities] = useState<Option[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<SingleValue<Option>>(null);
    const [selectedCity, setSelectedCity] = useState<SingleValue<Option>>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Custom styles for react-select
    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderColor: '#d1d5db',
            borderRadius: '0.5rem',
            padding: '0.25rem',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#C3E956'
            },
            '&:focus': {
                borderColor: '#C3E956',
                boxShadow: '0 0 0 1px #C3E956'
            }
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#C3E956' : state.isFocused ? '#ddeea1' : null,
            color: state.isSelected ? 'black' : 'inherit',
            '&:active': {
                backgroundColor: '#C3E956'
            }
        })
    };

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
        if (!name || !email || !password || !selectedDepartment || !selectedCity) {
            setError("Por favor, completa todos los campos obligatorios.");
            setIsModalOpen(true);
            return; // Detiene la ejecución si hay campos vacíos
        }
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Fondo con animación de fade */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        ></motion.div>

                        {/* Modal con animación de escala y fade */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4"
                        >
                            <h3 className="text-xl font-bold text-red-600 mb-3">Error</h3>
                            <p className="text-gray-700 mb-5">{error}</p>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full bg-[#C3E956] text-black py-2 rounded-lg hover:bg-[#B3D946] transition"
                            >
                                Cerrar
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row bg-white p-5 md:p-8 rounded-2xl shadow-lg w-full max-w-5xl">
                {/* Left column (image and welcome text) - hidden on mobile, shown on medium screens and up */}
                <div className="hidden md:flex flex-col items-start justify-center md:w-1/2 md:pr-8 mb-6 md:mb-0">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">Bienvenido a Movix</h2>
                    <p className="text-gray-500 text-base md:text-lg mb-6">Regístrate para empezar a gestionar tus envíos y rastrear tus paquetes de manera sencilla y rápida.</p>
                    <img src="register.jpg" alt="Registro" className="w-full h-auto rounded-lg" />
                </div>

                {/* Right column (form) - full width on mobile, half width on medium screens and up */}
                <div className="flex flex-col items-center justify-center w-full md:w-1/2">
                    {/* Mobile welcome header - shown only on mobile */}
                    <div className="md:hidden text-center mb-6 w-full">
                        <h2 className="text-2xl font-semibold mb-2">Bienvenido a Movix</h2>
                        <p className="text-gray-500 text-sm">Regístrate para empezar a gestionar tus envíos</p>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        <h2 className="text-2xl font-semibold">Registrarse</h2>
                        <p className="text-gray-500 text-sm">Crea una cuenta para comenzar</p>
                    </div>

                    <form className="space-y-4 w-full max-w-md" onSubmit={registerUser}>
                        <div>
                            <label className="text-sm text-gray-600">Nombre</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Correo electrónico</label>
                            <input 
                                type="email" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
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
                                styles={customStyles}
                                placeholder="Selecciona un departamento"
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
                                styles={customStyles}
                                placeholder={selectedDepartment ? "Selecciona un municipio" : "Primero selecciona un departamento"}
                            />
                        </div>
                        <button 
                            className="w-full bg-[#C3E956] text-black p-3 rounded-lg hover:bg-[#B3D946] transition-colors duration-300" 
                            type="submit"
                        >
                            Registrarse
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;