import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged
} from 'firebase/auth';
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  // Manejo del resultado de redirección
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserPhoto(user.photoURL);
      } else {
        setUserPhoto(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Autenticación con Google
  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      if (result.user?.photoURL) {
        setUserPhoto(result.user.photoURL);
      }
      navigate('/User-dashboard');
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Función para manejar errores
  const handleAuthError = (error: any) => {
    console.error('Error de autenticación:', error.code, error.message);
    
    const errorMap: Record<string, string> = {
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email',
      'auth/popup-closed-by-user': 'Ventana de login cerrada',
      'auth/network-request-failed': 'Error de conexión',
      'auth/invalid-credential': 'Credenciales inválidas o expiradas',
      'auth/popup-blocked': 'Permite ventanas emergentes para este sitio',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
      'default': 'Error al iniciar sesión'
    };
    
    setError(errorMap[error.code] || errorMap['default']);
    setIsModalOpen(true);
  };

  // Autenticación con email y contraseña
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsModalOpen(true);
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (email === 'admin@gmail.com' && password === 'aDmIN2025')
      {
        navigate('/admin-dashboard');
      }
      else{
        navigate('/User-dashboard');
      }
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Error Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
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
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Login Container */}
      <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg w-full max-w-5xl overflow-hidden">
        {/* Left Column - Illustration (hidden on mobile) */}
        <div className="hidden sm:flex flex-col items-start justify-center lg:w-1/2 p-6 lg:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Bienvenido a Movix</h2>
          <p className="text-gray-500 text-base md:text-lg mb-4">
            Inicia sesión para gestionar tus envíos y rastrear tus paquetes de manera sencilla y rápida.
          </p>
          <img src="login.svg" alt="Logística" className="w-full h-auto max-h-80 lg:max-h-96 object-contain" />
        </div>

        {/* Right Column - Login Form */}
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 lg:p-8">
          {/* Mobile Welcome Message (shown only on small screens) */}
          <div className="sm:hidden text-center mb-6 w-full">
            <h2 className="text-2xl font-semibold mb-2">Bienvenido a Movix</h2>
            <p className="text-gray-500 text-sm mb-4">
              Inicia sesión para gestionar tus envíos
            </p>
          </div>
          
          {/* User Photo and Login Title */}
          <div className="flex flex-col items-center mb-6">
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt="Foto de perfil" 
                className="w-16 h-16 rounded-full mb-4 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-4" />
            )}
            <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
            <p className="text-gray-500 text-sm text-center">
              ¿No tienes una cuenta?{' '}
              <button onClick={handleRegisterClick} className="text-[#1C8E19] hover:text-blue-800">
                Regístrate
              </button>
            </p>
          </div>

          {/* Google Sign-in Button */}
          <div className="mt-4 space-y-3 w-full max-w-md">
            <button
              onClick={signInWithGoogle}
              disabled={googleLoading}
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {googleLoading ? (
                <span className="mr-2">Cargando...</span>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar con Google
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4 w-full max-w-md">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-400 text-sm">O</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 w-full max-w-md">
            <div>
              <label className="text-sm text-gray-600">Tu correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Tu contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            <div className="text-right text-sm">
              <a href="#" className="text-[#1C8E19] hover:text-blue-800">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#5EEB5B] hover:bg-[#3BD838] text-black p-3 rounded-lg transition-colors duration-300"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}