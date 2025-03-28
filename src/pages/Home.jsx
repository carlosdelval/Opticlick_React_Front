import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import TransparentPrimary from "../components/TransparentButtonPrimary";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="z-10 max-w-md p-10 text-center bg-white border-2 border-black shadow-xl dark:border-gray-700 rounded-2xl">
        <div className="flex justify-center mb-4">
          <a href="/">
            <img src="./logo.png" alt="OptiClick" className="w-20"></img>
          </a>
        </div>
        <div className="mb-4 text-center">
          <h1 className="font-bold leading-none tracking-tight underline text-7xl md:text-5xl lg:text-6xl dark:text-white underline-offset-3 decoration-8 decoration-vistablue dark:decoration-blue-600">
            OptiClick
          </h1>
          <p className="mt-2 text-gray-700">
            Tu sistema de gestión de citas ópticas
          </p>
        </div>
        <a href="login">
          <TransparentPrimary text="Iniciar sesión" />
        </a>
        <p className="mt-4 text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <a
            href="register"
            className="font-bold duration-300 text-vistablue hover:underline hover:text-chryslerblue"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
