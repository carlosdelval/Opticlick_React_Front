import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PropTypes from "prop-types";
import Background from "../components/Background";
import { resendEmail } from "../api";
import Lottie from "lottie-react";
import mailAnimation from "../assets/mail.json";
import successAnimation from "../assets/success.json";
import PrimaryButton from "../components/PrimaryButton";
import Spinner from "../components/Spinner";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, authChecked, loading } = useContext(AuthContext);
  const [emailloading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Si no hay authchecked O si loading está activo, muestra un spinner o nada
  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center my-auto">
        <div className="z-10 max-w-md text-center w-96">
          <Spinner/>
        </div>
      </div>
    );
  }

  if (user === null && !loading) {
    return (
      <>
        <Background />
        <div className="flex items-center justify-center">
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
              <p className="m-4 text-gray-700">
                ¡No tienes acceso a esta página! Por favor, inicia sesión para
                continuar.
              </p>
              <PrimaryButton
                text="Volver a inicio"
                action={() => (window.location.href = "/")}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Comprobamos si el usuario tiene el rol permitido
  // Si no tiene el rol permitido, redirigimos a la página de inicio

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Comprobamos si ha verificado el email
  if (!user.email_verified) {
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
          {!emailloading && !loaded && (
            <div className="mb-4 text-center">
              <h2 className="my-4 text-2xl font-bold text-center">
                Verifica tu correo electrónico para continuar
              </h2>
              <p className="mt-2 text-gray-600">
                ¿No has recibido el correo?{" "}
                <button
                  onClick={async () => {
                    setLoading(true);
                    await resendEmail(user.email);
                    setTimeout(() => {
                      setLoading(false);
                      setLoaded(true);
                    }, 1500);
                  }}
                  className="font-bold duration-300 text-vistablue hover:underline hover:text-chryslerblue"
                >
                  <div className="flex">
                    <span>Reenviar</span>
                    <Lottie
                      speed={2}
                      animationData={mailAnimation}
                      style={{ height: 30 }}
                    />
                  </div>
                </button>
              </p>
            </div>
          )}
          {emailloading && (
            <Spinner/>
          )}
          {loaded && (
            <div className="mb-4 text-center">
              <Lottie
                speed={2}
                animationData={successAnimation}
                style={{ height: 80 }}
                loop={false}
              />
              <h2 className="my-4 text-2xl font-bold text-center">
                ¡Correo de verificación enviado!
              </h2>
              <p className="mt-2 text-gray-600">
                Revisa tu bandeja de entrada y la carpeta de spam.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
