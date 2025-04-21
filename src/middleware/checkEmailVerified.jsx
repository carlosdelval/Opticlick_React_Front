import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.email_verified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="mb-4 text-2xl font-bold">Acceso denegado</h1>
        <p className="mb-4">
          Por favor, verifica tu correo electrónico para acceder a esta página.
        </p>
        <a href="/verify_email" className="text-blue-500 hover:underline">
          Reenviar correo de verificación
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
