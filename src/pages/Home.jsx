import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import CountUp from "../components/CountUp";
import GradientText from "../components/GradientText";
import cookies from "../assets/cookies.json";
import Lottie from "lottie-react";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.id) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const [showCookieConsent, setShowCookieConsent] = useState(true);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "true") {
      setShowCookieConsent(false);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowCookieConsent(false);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow h-auto">
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-semibold dark:text-babypowder">
            {"¡Más de "}
            <GradientText
              colors={
                localStorage.getItem("darkMode")
                  ? ["#8AAADC", "#23F0C7"]
                  : ["#531CB3", "#23F0C7"]
              }
            >
              <CountUp
                to={1000000}
                from={999900}
                duration={1}
                direction="up"
                className="font-bold"
                separator=","
              />
            </GradientText>
            {" de citas gestionadas!"}
          </h3>
        </div>
        <div className="flex items-center justify-center">
          <div className="z-10 max-w-md p-10 text-center bg-white border-2 border-black shadow-xl dark:border-gray-400 dark:bg-gray-700 rounded-2xl animate-fade-in">
            <div className="flex justify-center mb-4">
              <a href="/" className="inline-block">
                <img
                  src="./logo.png"
                  alt="OptiClick"
                  className="w-20 transition-all duration-300 hover:drop-shadow-[0_0_10px_theme(colors.vistablue)] dark:drop-shadow-[0_0_30px_theme(colors.vistablue)]"
                />
              </a>
            </div>
            <div className="mb-4 text-center">
              <h1 className="font-bold leading-none tracking-tight underline text-7xl md:text-5xl lg:text-6xl dark:text-babypowder underline-offset-3 decoration-8 decoration-vistablue">
                OptiClick
              </h1>
              <p className="mt-2 text-gray-700 dark:text-gray-200">
                Tu sistema de gestión de citas ópticas
              </p>
            </div>
            <PrimaryButton
              text="Iniciar sesión"
              action={() => (window.location.href = "/login")}
              classes="mt-2"
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
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{" "}
              <a
                href="register"
                className="font-bold duration-300 text-vistablue hover:underline hover:text-chryslerblue dark:hover:text-dark-vista"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Cookie Consent Popup */}
      {showCookieConsent && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          {/* Overlay oscurecido que bloquea interacción */}
          <div className="absolute inset-0 bg-black pointer-events-auto bg-opacity-60 backdrop-blur-sm" />

          {/* Popup de cookies */}
          <div className="relative w-full px-8 py-8 duration-300 ease-in-out bg-gray-800 shadow-lg pointer-events-auto bg-opacity-95 rounded-t-xl animate-fade-in">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex flex-col items-center justify-center space-y-2 md:space-y-0 md:space-x-2 md:flex-row">
                <Lottie
                  animationData={cookies}
                  alt="Cookies Animation"
                  className="w-28 h-28 md:w-24 md:h-24"
                  loop={true}
                />
                <p className="text-sm text-center text-white md:text-left text-balance">
                  Este sitio utiliza cookies para mejorar tu experiencia. Al
                  continuar navegando, aceptas nuestra política de cookies.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex flex-row items-center justify-center space-x-2">
                  <button
                    onClick={acceptCookies}
                    className="px-4 py-1 text-sm font-bold text-white duration-300 rounded bg-vistablue hover:bg-chryslerblue"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("cookieConsent", "false");
                      setShowCookieConsent(false);
                    }}
                    className="px-4 py-1 text-sm font-bold text-white duration-300 rounded bg-lightcoral hover:bg-redpantone"
                  >
                    Rechazar
                  </button>
                </div>
                <a
                  href="/informacion#privacy"
                  className="text-sm underline duration-300 text-vistablue hover:text-chryslerblue"
                >
                  Más información
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
