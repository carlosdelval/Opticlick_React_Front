import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Background from "./components/Background";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListaClientes from "./pages/Admin/ListaClientes";
import Graduar from "./pages/Admin/Graduar";
import Profile from "./pages/Profile";
import "./index.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ user }) => (
          <>
            <Navbar />
            <Background />
            <Routes>
              <Route
                path="/"
                element={
                  user ? (
                    user.role === "admin" ? (
                      <AdminDashboard />
                    ) : (
                      <Dashboard />
                    )
                  ) : (
                    <Home />
                  )
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/lista-clientes" element={<ListaClientes />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/graduar" element={<Graduar />} />
            </Routes>
          </>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;
