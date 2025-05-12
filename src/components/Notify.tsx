import React, { useEffect } from "react";

interface NotifyProps {
  message: string;
  show: boolean;
}

export const Notify: React.FC<NotifyProps> = ({ message, show }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        // La notificación se ocultará automáticamente después de 3 segundos
        // No necesitamos un estado para controlar esto porque el componente se desmonta
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <>
      {/* Fondo desenfocado */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Notificación centrada */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white text-gray-800 px-8 py-6 rounded-2xl shadow-2xl text-xl font-semibold text-center max-w-md w-full mx-4">
          {message}
        </div>
      </div>
    </>
  );
};

export default Notify;