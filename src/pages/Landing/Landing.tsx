import React from "react";
import "./landing.css";

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      <div className="main-content">
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
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">Servicios</h2>
          <p className="services-description">
            Envialo ofrece soluciones integrales de logística, incluyendo envíos nacionales, encomiendas seguras y mensajería express.
          </p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-text">
              <h3 className="service-title">Rastrea tu Paquete</h3>
              <p className="service-link">Saber más.</p>
            </div>
            <img src="rastrea.svg" alt="Rastrea tu Paquete" className="service-image" />
          </div>
          <div className="service-card highlighted">
            <div className="service-text">
              <h3 className="service-title">Cotiza tu Envío</h3>
              <p className="service-link">Saber más.</p>
            </div>
            <img src="cotiza.svg" alt="Cotiza tu Envío" className="service-image" />
          </div>
          <div className="service-card dark">
            <div className="service-text">
              <h3 className="service-title">Recogemos tu Pedido</h3>
              <p className="service-link">Saber más.</p>
            </div>
            <img src="recogemos.svg" alt="Recogemos tu Pedido" className="service-image" />
          </div>
          <div className="service-card">
            <div className="service-text">
              <h3 className="service-title">Habla con Nosotros</h3>
              <p className="service-link">Saber más.</p>
            </div>
            <img src="contactanos.svg" alt="Habla con Nosotros" className="service-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;