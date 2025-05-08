import React, { useState } from 'react';
import { auth } from '../../firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oobCode) {
      setError('Código de recuperación no válido');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verificar el código de reseteo
      await verifyPasswordResetCode(auth, oobCode);
      
      // Cambiar la contraseña
      await confirmPasswordReset(auth, oobCode, newPassword);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      let errorMessage = 'Error al restablecer la contraseña';
      if (err.code === 'auth/expired-action-code') {
        errorMessage = 'El enlace ha expirado. Solicita uno nuevo.';
      } else if (err.code === 'auth/invalid-action-code') {
        errorMessage = 'El enlace no es válido. Solicita uno nuevo.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md backdrop-blur-sm bg-opacity-90"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Restablecer Contraseña
        </h1>
        
        {success ? (
          <div className="text-center">
            <div className="text-green-500 mb-4 text-lg">
              Contraseña actualizada correctamente
            </div>
            <p className="text-gray-600">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3E956]"
                placeholder="Repite tu contraseña"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#C3E956] text-white py-3 px-6 rounded-lg hover:bg-[#a9c84a] transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Procesando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;