import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import Landing from "../pages/Landing/Landing";
import Topbar from "../components/Topbar";
import TopbarUser from "../components/TopBarUser";
import TopbarAdmin from "../components/TopBarAdmin";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";
import Shipment from "../pages/Register-Shipment/shipment";
import Cotizar from "../pages/Cotizar/Cotizar";
import Admin from "../pages/Admin/Admin";
import CotizarAdmin from "../pages/Cotizar/CotizarAdmdin";

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsAdmin(user.email === "admin@gmail.com"); // Ajusta el correo según tu lógica
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const noTopbarRoutes: string[] = ["/home", "/admin-dashboard", "/shipment"];

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {/* Si es admin y está en /admin-dashboard */}
      {isAuthenticated && isAdmin && location.pathname === "/admin-dashboard" && (
        <TopbarAdmin />
      )}

      {/* Si es usuario autenticado (NO admin) */}
      {isAuthenticated && !isAdmin && (
        <TopbarUser />
      )}

      {/* Si no está autenticado y la ruta no está en la lista */}
      {!isAuthenticated && !noTopbarRoutes.includes(location.pathname) && (
        <Topbar />
      )}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shipment" element={<Shipment />} />
        <Route path="/cotizar" element={<Cotizar />} />
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/cotizar-admin" element={<CotizarAdmin />} />

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
