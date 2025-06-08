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
    setLoading(true); // ✅ mostrar spinner
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
    setLoading(false); // ✅ ocultar spinner
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true); // ✅ mostrar spinner

      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const googleData = {
        email: googleUser.email,
        name: googleUser.displayName || googleUser.email.split("@")[0],
      };

      const backendResponse = await loginConGoogle(googleData);

      if (backendResponse.error) {
        throw new Error(backendResponse.error);
      }

      const userData = {
        ...backendResponse,
        token: backendResponse.token,
      };

      if (userData.role === "admin") {
        try {
          const optica = await getOpticaUsuario(userData.id);
          userData.optica_id = optica.optica_id;
        } catch (error) {
          console.error("Óptica no encontrada:", error);
        }
      }

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate(userData.role === "master" ? "/administracion" : "/dashboard");
    } catch (error) {
      console.error("Error con login de Google:", error);
      // Aquí puedes mostrar una notificación de error si quieres
    } finally {
      setLoading(false); // ✅ ocultar spinner
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
