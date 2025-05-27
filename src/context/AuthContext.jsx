import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { getOpticaUsuario, loginConGoogle } from "../api";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "./Firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
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

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Prepara los datos para el backend
      const googleData = {
        email: googleUser.email,
        name: googleUser.displayName || googleUser.email.split("@")[0],
      };

      // Envía al endpoint de Google
      const backendResponse = await loginConGoogle(googleData);

      // Verifica si hay error en la respuesta
      if (backendResponse.error) {
        throw new Error(backendResponse.error);
      }

      // Prepara los datos para el login local
      const userData = {
        ...backendResponse, // Usa los datos devueltos por el backend
        token: backendResponse.token,
      };

      // Completa con datos adicionales si es admin
      if (userData.role === "admin") {
        try {
          const optica = await getOpticaUsuario(userData.id);
          userData.optica_id = optica.optica_id;
        } catch (error) {
          console.error("Óptica no encontrada:", error);
        }
      }

      // Guarda en estado y localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Redirección
      navigate(userData.role === "master" ? "/administracion" : "/dashboard");
    } catch (error) {
      console.error("Error con login de Google:", error);
      // Aquí puedes mostrar un mensaje de error al usuario
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
      loginWithGoogle, // ✅ nuevo método
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
