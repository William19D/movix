import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Landing/Landing";
import Topbar from "../components/Topbar";

const AppContent: React.FC = () => {
  const location = useLocation();

  // Lista de rutas donde la topbar no debe mostrarse
  const noTopbarRoutes = ['/login'];

  return (
    <div>
      {!noTopbarRoutes.includes(location.pathname) && <Topbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Agrega más rutas según sea necesario */}
      </Routes>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default AppRoutes;