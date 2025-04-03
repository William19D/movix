import React from "react";
import "./landing.css";

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      <div className="text-content">
        <h1 className="title">Rápido, seguro, confiable.</h1>
        <p className="description">
          Envialo optimiza tus envíos con soluciones inteligentes y seguras.
          Calcula rutas y costos de manera precisa, garantizando entregas
          rápidas y confiables en todo momento.
        </p>
        <button className="quote-button">Cotizar</button>
      </div>
      <div className="image-content">
        <img src="welcome.svg" alt="Paquete en movimiento" />
      </div>
    </div>
  );
};

export default Landing;
