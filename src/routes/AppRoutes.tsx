import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import Landing from "../pages/Landing/Landing";
import Topbar from "../components/Topbar";
import TopbarUser from "../components/TopBarUser";
import TopbarAdmin from "../components/TopBarAdmin";
import Login from "../pages/Login/Login";
import Register from "../pages/User/Register/Register";
import Shipment from "../pages/Admin/RegisterShipment/RegisterShipment";
import Cotizar from "../pages/User/Quote/Quote";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import CotizarAdmin from "../pages/Admin/Quote/QuoteAdmin";
import Footer from "../components/footer"; // Make sure Footer is imported
import Profile from "../pages/User/Profile/Profile"
import Dashboard from "../pages/User/Dashboard/Dashboard";
import Rastrear from "../pages/Rastrear/Rastrear";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import DriverDashboard from "../pages/Driver-dashboard/DriverDashboard";

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsAdmin(user.email === "admin@gmail.com"); // Adjust logic as needed
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Define routes where the Footer should NOT appear
  const excludedFooterRoutes: string[] = ["/login", "/register", "/shipment"];

  // Define routes where the Topbar should NOT appear
  const noTopbarRoutes: string[] = ["/home", "/admin-dashboard", "/shipment"];

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar logic */}
      {isAuthenticated && isAdmin && 
        (location.pathname === "/admin-dashboard" || location.pathname === "/cotizar-admin") && (
        <TopbarAdmin />
      )}

      {isAuthenticated && !isAdmin && <TopbarUser />}

      {!isAuthenticated && !noTopbarRoutes.includes(location.pathname) && (
        <Topbar />
      )}

      {/* Main application content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/User-dashboard" element={<Dashboard />} />
          <Route path="/shipment" element={<Shipment />} />
          <Route path="/cotizar" element={<Cotizar />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cotizar-admin" element={<CotizarAdmin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rastrear" element={<Rastrear />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>

      {/* Footer logic */}
      {!excludedFooterRoutes.includes(location.pathname) && <Footer />}
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