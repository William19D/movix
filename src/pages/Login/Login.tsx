import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { motion, AnimatePresence } from "framer-motion";

const clientId = '619179219683-em0dug36mn8ta4h94rkfa938e7e6f029.apps.googleusercontent.com';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential);
      await signInWithCredential(auth, credential);
      navigate('/dashboard');
    } catch (error) {
      setError('Error al iniciar sesión con Google');
      setIsModalOpen(true);
    }
  };

  const handleLoginFailure = () => {
    setError('Error al iniciar sesión con Google');
    setIsModalOpen(true);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validación básica de campos
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsModalOpen(true);
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error detallado:', {
        code: error.code,
        message: error.message,
        email: email,
        timestamp: new Date().toISOString()
      });
  
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
      }
  
      setError(errorMessage);
      setIsModalOpen(true);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
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

      <div className="flex bg-white p-8 rounded-2xl shadow-lg w-3/4">
        <div className="flex flex-col items-start justify-center w-1/2 pr-8">
          <h2 className="text-3xl font-semibold mb-4">Bienvenido a Movix</h2>
          <p className="text-gray-500 text-lg mb-4">
            Inicia sesión para gestionar tus envíos y rastrear tus paquetes de manera sencilla y rápida.
          </p>
          <img src="login.svg" alt="Logística" className="w-full h-80" />
        </div>

        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full mb-4" />
            <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
            <p className="text-gray-500 text-sm">
              ¿No tienes una cuenta?{' '}
              <button onClick={handleRegisterClick} className="text-blue-600 hover:text-blue-800">
                Regístrate
              </button>
            </p>
          </div>

          <div className="mt-6 space-y-3 w-full">
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleLoginFailure}
                useOneTap
              />
            </GoogleOAuthProvider>
          </div>

          <div className="flex items-center my-6 w-full">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-400">O</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4 w-full">
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
              <a href="#" className="text-blue-600 hover:text-blue-800">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors duration-300"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}