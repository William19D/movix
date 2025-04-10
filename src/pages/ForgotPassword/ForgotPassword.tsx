import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del correo para restablecer la contraseña
    console.log('Correo enviado a:', email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Aumentamos el tamaño del contenedor */}
      <div className="bg-white p-12 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="lock">
            🔒
          </span>
          ¿Olvidaste tu <span className="text-[#C3E956]">contraseña</span>?
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          <span role="img" aria-label="email">
            📧
          </span>
          Ingresa tu correo electrónico. Te enviaremos un enlace con instrucciones para restablecer tu contraseña.
        </p>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-lg">
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
          <p className="text-base text-gray-500 mb-6">
            ¿Recordaste tu contraseña?{' '}
            <a href="/login" className="text-[#C3E956] hover:underline">
              Inicia sesión aquí
            </a>
          </p>
          <button
            type="submit"
            className="w-full bg-[#C3E956] text-white py-3 px-6 rounded-lg hover:bg-[#a9c84a] transition text-lg"
          >
            Recuperar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;