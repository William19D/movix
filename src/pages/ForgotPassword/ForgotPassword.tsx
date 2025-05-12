import React, { useState } from 'react';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ 
        text: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.', 
        type: 'success' 
      });
      setIsModalOpen(true);
      setEmail('');
    } catch (error: any) {
      let errorMessage = 'Error al enviar el correo de recuperación';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico';
      }
      setMessage({ 
        text: errorMessage, 
        type: 'error' 
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Modal para mostrar mensajes */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo semitransparente */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => {
                setIsModalOpen(false);
                if (message?.type === 'success') {
                  navigate('/login');
                }
              }}
            />

            {/* Contenido del modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
            >
              <h3 className={`text-xl font-bold mb-3 ${
                message?.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {message?.type === 'success' ? 'Éxito' : 'Error'}
              </h3>
              <p className="text-gray-700 mb-5">{message?.text}</p>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (message?.type === 'success') {
                    navigate('/login');
                  }
                }}
                className={`w-full py-2 rounded-lg transition ${
                  message?.type === 'success' 
                    ? 'bg-[#C3E956] text-black hover:bg-[#B3D946]' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white p-8 md:p-12 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="lock">
            🔒
          </span>
          ¿Olvidaste tu <span className="text-[#C3E956]">contraseña</span>?
        </h1>
        
        <p className="text-gray-600 mt-4 text-base md:text-lg">
          <span role="img" aria-label="email">
            📧
          </span>
          Ingresa tu correo electrónico. Te enviaremos un enlace con instrucciones para restablecer tu contraseña.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-base md:text-lg">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#C3E956] text-white py-3 px-6 rounded-lg hover:bg-[#a9c84a] transition text-base md:text-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Enviando...' : 'Recuperar Contraseña'}
          </button>
        </form>
        
        <p className="text-base text-gray-500 mt-6 text-center">
          ¿Recordaste tu contraseña?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="text-[#C3E956] hover:underline font-medium"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;