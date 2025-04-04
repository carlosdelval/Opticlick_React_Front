import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Background from "./components/Background";
import Dashboard from "./pages/User/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListaClientes from "./pages/Admin/ListaClientes";
import HistorialCliente from "./pages/Admin/HistorialCliente";
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
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/historial"
            element={
              <>
                <Navbar />
                <Historial />
              </>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <>
                <Navbar />
                <AdminDashboard />
              </>
            }
          />
          <Route
            path="/lista-clientes"
            element={
              <>
                <Navbar />
                <ListaClientes />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />
          <Route
            path="/historial/:id"
            element={
              <>
                <Navbar />
                <HistorialCliente />
              </>
            }
          />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
