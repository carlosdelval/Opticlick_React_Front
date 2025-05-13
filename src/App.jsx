import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Background from "./components/Background";
import Dashboard from "./pages/User/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListaClientes from "./pages/Admin/ListaClientes";
import HistorialCliente from "./pages/Admin/HistorialCliente";
import Administracion from "./pages/Admin/Administracion";
import VerifyEmail from "./pages/Auth/Verify_email";
import Profile from "./pages/Auth/Profile";
import Historial from "./pages/User/Historial";
import Who from "./pages/Who";
import Footer from "./components/Footer";
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
      <div className="flex flex-col min-h-screen">
        <Background />
        <Navbar />
        <main className="px-10 pt-10 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/business" element={<Who />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Historial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "master"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lista-clientes"
              element={
                <ProtectedRoute allowedRoles={["admin", "master"]}>
                  <ListaClientes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["user", "admin", "master"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "master"]}>
                  <HistorialCliente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/administracion"
              element={
                <ProtectedRoute allowedRoles={["master"]}>
                  <Administracion />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
