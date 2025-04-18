import { Routes, Route } from "react-router-dom";
import React from "react";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Background from "./components/Background";
import Dashboard from "./pages/User/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListaClientes from "./pages/Admin/ListaClientes";
import HistorialCliente from "./pages/Admin/HistorialCliente";
import Administracion from "./pages/Admin/Administracion";
import Profile from "./pages/Profile";
import Historial from "./pages/User/Historial";
import "./index.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { Buffer } from "buffer";

function App() {
  // Polyfill for Buffer
  if (typeof window !== "undefined") {
    window.Buffer = Buffer;
  }
  return (
    <AuthProvider>
      <>
        <Background />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Navbar />
                <Historial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Navbar />
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lista-clientes"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Navbar />
                <ListaClientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Navbar />
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Navbar />
                <HistorialCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/administracion"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Navbar />
                <Administracion />
              </ProtectedRoute>
            }
          />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
