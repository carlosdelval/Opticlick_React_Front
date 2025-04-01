import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Background from "./components/Background";
import Dashboard from "./pages/User/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListaClientes from "./pages/Admin/ListaClientes";
import Profile from "./pages/Profile";
import Historial from "./pages/User/Historial";
import "./index.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
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
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
