import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "master") {
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
          <a href="/" className="inline-block">
            <img
              src="./logo.png"
              alt="OptiClick"
              className="w-20 transition-all duration-300 hover:drop-shadow-[0_0_10px_theme(colors.vistablue)]"
            />
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
          <PrimaryButton
            text="Iniciar sesión"
            icon={
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                />
              </svg>
            }
          />
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
