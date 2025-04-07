import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import Landing from "../pages/Landing/Landing";
import Topbar from "../components/Topbar";
import TopbarUser from "../components/TopBarUser";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";
import Shipment from "../pages/Register-Shipment/shipment";
import Cotizar from "../pages/Cotizar/Cotizar";
import Admin from "../pages/Admin/Admin";

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const noTopbarRoutes: string[] = ["/home", "/admin-dashboard", "/shipment"];

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {/* Si el usuario está autenticado, siempre se muestra TopbarUser */}
      {isAuthenticated && <TopbarUser />}

      {/* Si no está autenticado y la ruta NO está en la lista, mostrar Topbar */}
      {!isAuthenticated && !noTopbarRoutes.includes(location.pathname) && <Topbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shipment" element={<Shipment />} />
        <Route path="/cotizar" element={<Cotizar />} />
        <Route path="/admin-dashboard" element={<Admin />} />
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
