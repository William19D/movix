import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const clientId = '619179219683-em0dug36mn8ta4h94rkfa938e7e6f029.apps.googleusercontent.com';
export default function LoginForm() {
  const navigate = useNavigate();

  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log('Login Success:', response);
    alert('Inicio de sesión exitoso');
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
    alert('Error al iniciar sesión con Google');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex bg-white p-8 rounded-2xl shadow-lg w-3/4">
          <div className="flex flex-col items-start justify-center w-1/2 pr-8">
            <h2 className="text-3xl font-semibold mb-4">Bienvenido a Movix</h2>
            <p className="text-gray-500 text-lg mb-4">Inicia sesión para gestionar tus envíos y rastrear tus paquetes de manera sencilla y rápida.</p>
            <img src="login.svg" alt="Logística" className="w-full h-80" />
          </div>
          <div className="flex flex-col items-center justify-center w-1/2">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
              <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
              <p className="text-gray-500 text-sm">¿No tienes una cuenta? <button onClick={handleRegisterClick} className="text-blue-600">Regístrate</button></p>
            </div>
            
            <div className="mt-6 space-y-3 w-full">
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
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
            
            <form className="space-y-4 w-full">
              <div>
                <label className="text-sm text-gray-600">Tu correo electrónico</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tu contraseña</label>
                <div className="relative">
                  <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer">👁️</span>
                </div>
              </div>
              <div className="text-right text-sm">
                <a href="#" className="text-blue-600">¿Olvidaste tu contraseña?</a>
              </div>
              <button className="w-full bg-gray-300 text-white p-3 rounded-lg cursor-not-allowed">Iniciar sesión</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}