import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Landing/Landing";
import Topbar from "../components/Topbar";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

const AppContent: React.FC = () => {
  const location = useLocation();

  // Lista de rutas donde la topbar no debe mostrarse
  const noTopbarRoutes: string[] = [];

  return (
    <div>
      {!noTopbarRoutes.includes(location.pathname) && <Topbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Puedes agregar más rutas aquí */}
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