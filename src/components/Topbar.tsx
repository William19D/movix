import React from 'react';
import './Topbar.css';

const Topbar: React.FC = () => {
  return (
    <div className="topbar-container">
      <div className="logo-container">
        <img src="vite.svg" alt="Logo" className="logo-image" />
        <h1 className="logo-text">Movix</h1>
      </div>
      <div className="nav-links">
        <a href="#cotizar" className="nav-link">Cotizar</a>
        <a href="#rastrear" className="nav-link">Rastrear</a>
        <a href="#enviar" className="nav-link">Enviar</a>
        <a href="#contactanos" className="nav-link">Contáctanos</a>
      </div>
      <button className="login-button">Ingresar</button>
    </div>
  );
};

export default Topbar;