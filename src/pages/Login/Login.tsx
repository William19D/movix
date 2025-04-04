import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Topbar from '../../components/Topbar'; // Asegúrate de importar Topbar si no está en el mismo nivel

const clientId = '.'; // Reemplaza esto con tu Client ID de Google

export default function LoginForm() {
  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log('Login Success:', response);
    alert('Inicio de sesión exitoso');
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
    alert('Error al iniciar sesión con Google');
  };

  return (
    <div>
      <Topbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
            <h2 className="text-2xl font-semibold">Log in</h2>
            <p className="text-gray-500 text-sm">Don’t have an account? <a href="#" className="text-blue-600">Sign up</a></p>
          </div>
          
          <div className="mt-6 space-y-3">
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                useOneTap
              />
            </GoogleOAuthProvider>
          </div>
          
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Your email</label>
              <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Your password</label>
              <div className="relative">
                <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer">👁️</span>
              </div>
            </div>
            <div className="text-right text-sm">
              <a href="#" className="text-blue-600">Forgot your password</a>
            </div>
            <button className="w-full bg-gray-300 text-white p-3 rounded-lg cursor-not-allowed">Log in</button>
          </form>
        </div>
      </div>
    </div>
  );
}