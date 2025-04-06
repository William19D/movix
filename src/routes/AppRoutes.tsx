import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Topbar from "../components/Topbar";
import TopbarUser from '../components/TopBarUser'; // Asegúrate de importar TopbarUser
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";
import Shipment from "../pages/Register-Shipment/shipment"

const AppContent: React.FC = () => {
  const location = useLocation();
  const noTopbarRoutes: string[] = ["/home"];
  return (
    <div>
      {!noTopbarRoutes.includes(location.pathname) && location.pathname !== "/shipment" && <Topbar />}
      {(location.pathname === "/shipment" || location.pathname === "/home") && <TopbarUser />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shipment" element={<Shipment />} />
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