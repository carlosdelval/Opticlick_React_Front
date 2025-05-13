import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // Cambiamos a un estado más descriptivo

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

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    authChecked,
    login,
    logout,
    setUser
  }), [user, authChecked]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;