import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Background from "./components/Background";
import Dashboard from "./pages/Dashboard";
import ListaClientes from "./pages/Admin/ListaClientes";
import HistorialCliente from "./pages/Admin/HistorialCliente";
import Administracion from "./pages/Admin/Administracion";
import VerifyEmail from "./pages/Auth/Verify_email";
import Profile from "./pages/Auth/Profile";
import Historial from "./pages/User/Historial";
import Who from "./pages/Who";
import Info from "./pages/Info";
import Footer from "./components/Footer";
import errorAnimation from "./assets/404";
import Lottie from "lottie-react";
import PrimaryButton from "./components/PrimaryButton";
import "./index.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { CitasProvider } from "./context/CitasContext";
import { OpticasProvider } from "./context/OpticasContext";
import { UserProvider } from "./context/UserContext";
import { Buffer } from "buffer";

function App() {
  // Polyfill for Buffer
  if (typeof window !== "undefined") {
    window.Buffer = Buffer;
  }

  //Modo oscuro
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // Componente para la página 404
  const NotFound = () => {
    return (
      <div className="flex items-center justify-center h-[60vh] animate-fade-in">
        <div className="z-10 max-w-md p-10 text-center bg-white border-2 border-black shadow-xl dark:border-gray-300 dark:bg-gray-700 rounded-2xl">
          <Lottie
            animationData={errorAnimation}
            loop={true}
            className="w-40 h-40 mx-auto"
            style={{ height: "200px", width: "200px" }}
          />
          <p className="py-4 text-gray-600 dark:text-babypowder">¡Oops! Página no encontrada.</p>
          <PrimaryButton
            text="Volver a inicio"
            action={() => (window.location.href = "/")}
          />
        </div>
      </div>
    );
  };

  return (
    <AuthProvider>
      <NotificationsProvider>
        <CitasProvider>
          <OpticasProvider>
            <UserProvider>
              <div className="flex flex-col min-h-screen">
                <Background />
                <Navbar />
                <main className="px-10 pt-10 pb-10">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/business" element={<Who />} />
                    <Route path="/informacion" element={<Info />} />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute
                          allowedRoles={["user", "admin", "master"]}
                        >
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
                        <ProtectedRoute
                          allowedRoles={["user", "admin", "master"]}
                        >
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

                    {/* Ruta para 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </UserProvider>
          </OpticasProvider>
        </CitasProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
