import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { getOpticaUsuario } from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // Cambiamos a un estado más descriptivo
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          // Simulamos un pequeño delay para pruebas
          // await new Promise(resolve => setTimeout(resolve, 500));
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error al parsear user de localStorage:", error);
        localStorage.removeItem("user");
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  const login = async (userData) => {
    if (userData.role === "admin") {
      try {
        const optica = await getOpticaUsuario(userData.id);
        userData = {
          ...userData,
          optica_id: optica.optica_id,
        };
      } catch (error) {
        console.error("Óptica no encontrada:", error);
      }
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    if (userData.role === "master") {
      navigate("/administracion");
    } else {
      navigate("/dashboard");
    }
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const value = useMemo(
    () => ({
      user,
      authChecked,
      loading,
      login,
      logout,
      setUser,
    }),
    [user, authChecked]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
