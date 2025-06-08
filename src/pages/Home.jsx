import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import CountUp from "../components/CountUp";
import GradientText from "../components/GradientText";
import cookies from "../assets/cookies.json";
import Lottie from "lottie-react";
import RotatingText from "../components/RotatingText";
import CardSwap, { Card } from "../components/CardSwap";

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
    <div className="flex flex-col items-center justify-center space-y-5 md:space-y-24">
      {/* Hero principal */}
      <section className="w-full md:max-w-7xl rounded-3xl py-10 animate-fade-in overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col text-center md:text-left md:space-y-10">
            <div className="bg-white dark:bg-gray-700 dark:border-gray-400 border-2 border-black dark:shadow-none shadow-xl rounded-2xl p-10">
              <div className="mb-4 flex justify-center flex-col items-center">
                <a href="/">
                  <img
                    src="./logo.png"
                    alt="OptiClick"
                    className="w-20 transition-all duration-300 hover:drop-shadow-[0_0_10px_theme(colors.vistablue)] dark:drop-shadow-[0_0_30px_theme(colors.vistablue)]"
                  />
                </a>
                <h1 className="text-5xl lg:text-6xl font-bold underline underline-offset-4 decoration-8 decoration-vistablue dark:text-babypowder">
                  OptiClick
                </h1>
                <p className="mt-2 text-gray-700 dark:text-gray-200">
                  Tu sistema de gestión de citas ópticas
                </p>
              </div>
              <div className="mb-4 flex flex-col flex-grow justify-end">
                <PrimaryButton
                  text="¡Regístrate gratis!"
                  action={() => (window.location.href = "/register")}
                  classes="mt-6"
                  icon={
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 013 3v10a3 3 0 01-3 3h-2"
                      />
                    </svg>
                  }
                />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                  ¿Ya tienes cuenta?{" "}
                  <a
                    href="login"
                    className="font-bold text-vistablue hover:underline hover:text-chryslerblue dark:hover:text-chryslerblue duration-300"
                  >
                    Inicia sesión
                  </a>
                </p>
              </div>
            </div>
            <div className="space-y-4 hidden md:block">
              <h3 className="text-2xl lg:text-6xl font-bold dark:text-babypowder">
                Consulta{" "}
              </h3>
              <h3 className="text-2xl lg:text-6xl font-bold">
                <RotatingText
                  texts={[
                    "Todas tus citas",
                    "Tus Graduaciones",
                    "Tu historial",
                  ]}
                  mainClassName="text-chryslerblue dark:text-vistablue"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5"
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 400,
                  }}
                  rotationInterval={4000}
                />
              </h3>
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
          </div>

          <div className="relative w-40 md:w-full h-[300px] md:h-[500px] hidden md:block">
            <CardSwap
              cardDistance={60}
              verticalDistance={70}
              delay={4000}
              pauseOnHover={false}
            >
              <Card>
                <img
                  src="card1.png"
                  alt="Card 1"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Card>
              <Card>
                <img
                  src="card2.png"
                  alt="Card 2"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Card>
              <Card>
                <img
                  src="card3.png"
                  alt="Card 3"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Card>
            </CardSwap>
          </div>
        </div>
      </section>

      {/* Segunda sección: características destacadas */}

      <section className="w-full md:max-w-7xl mx-auto text-center space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
          {/* Tarjeta izquierda */}
          <div className="flex-1 bg-white dark:bg-gray-700 dark:border-gray-400 border-2 border-black shadow-xl rounded-2xl p-6 flex flex-col text-center animate-fade-in">
            <div className="flex items-center space-x-2 mb-4 justify-center">
              <img
                src="./logo.png"
                alt="OptiClick App Icon"
                className="md:w-8 md:h-8 h-16 w-16"
              />
              <span className="text-lg font-semibold dark:text-babypowder">
                OptiClick App • iOS, Android
              </span>
            </div>
            <h4 className="text-xl font-bold mb-2 dark:text-babypowder">
              Buscar y reservar una cita
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Deja de llamar por teléfono. Encuentra tu próxima cita y{" "}
              <span className="font-bold">reserva al instante</span> en
              cualquier momento y desde cualquier lugar.
            </p>
            <div className="mb-4 flex flex-col flex-grow justify-end">
              <PrimaryButton
                text="¡Descarga la app!"
                action={() =>
                  (window.location.href = "https://www.apple.com/es/app-store/")
                }
                classes="mt-6"
                icon={
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 013 3v10a3 3 0 01-3 3h-2"
                    />
                  </svg>
                }
              />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                ¿Ya tienes cuenta?{" "}
                <a
                  href="login"
                  className="font-bold text-vistablue hover:underline hover:text-chryslerblue dark:hover:text-chryslerblue duration-300"
                >
                  Inicia sesión
                </a>
              </p>
            </div>
            <div className="mt-auto w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center dark:bg-gray-600">
              <img
                src="/reservar.jpg"
                alt="App screenshot"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Tarjeta derecha */}
          <div className="flex-1 bg-white dark:bg-gray-700 dark:border-gray-400 border-2 border-black shadow-xl rounded-2xl p-6 flex flex-col text-center animate-fade-in">
            <div className="flex items-center space-x-2 mb-4 justify-center">
              <img
                src="./logo.png"
                alt="OptiClick App Icon"
                className="md:w-8 md:h-8 h-16 w-16"
              />
              <span className="text-lg font-semibold dark:text-babypowder">
                OptiClick App • iOS, Android
              </span>
            </div>
            <h4 className="text-xl font-bold mb-2 dark:text-babypowder">
              OptiClick para tu negocio
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Regístrate en OptiClick para gestionar tu negocio,{" "}
              <strong className="font-bold">mejor</strong>. Calendario,
              reservas, marketing, todo en uno.
            </p>
            <div className="mb-4 flex flex-col flex-grow justify-end">
              <PrimaryButton
                text="¡Únete a nosotros!"
                action={() => (window.location.href = "/business")}
                classes="mt-6"
                icon={
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 013 3v10a3 3 0 01-3 3h-2"
                    />
                  </svg>
                }
              />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                ¿Ya formas parte?{" "}
                <a
                  href="/informacion#contact"
                  className="font-bold text-vistablue hover:underline hover:text-chryslerblue dark:hover:text-chryslerblue duration-300"
                >
                  Contacta con nosotros
                </a>
              </p>
            </div>
            <div className="mt-auto w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center dark:bg-gray-600">
              <img
                src="/negocio.jpg"
                alt="Business app screenshot"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cobertura geográfica */}
      <section className="border-2 border-black bg-white dark:bg-gray-700 dark:border-gray-400 shadow-xl rounded-3xl text-center px-6 py-10 order-3 animate-fade-in">
        <h3 className="text-lg font-semibold dark:text-babypowder mb-4">
          Trabajamos con ópticas en toda España, incluyendo:
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Andalucía, Aragón, Asturias, Cantabria, Castilla-La Mancha, Castilla y
          León, Cataluña, Comunidad Valenciana, Extremadura, Galicia, Islas
          Baleares, Islas Canarias, La Rioja, Madrid, Murcia, Navarra, País
          Vasco
        </p>
      </section>

      {/* Consentimiento de cookies */}
      {showCookieConsent && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm pointer-events-auto" />
          <div className="relative w-full px-8 py-8 bg-gray-800 bg-opacity-95 shadow-lg rounded-t-xl animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-4">
                <Lottie animationData={cookies} className="w-24 h-24" loop />
                <p className="text-sm text-white text-center md:text-left">
                  Este sitio utiliza cookies para mejorar tu experiencia. Al
                  continuar navegando, aceptas nuestra política de cookies.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={acceptCookies}
                    className="px-4 py-1 text-sm font-bold text-white bg-vistablue hover:bg-chryslerblue rounded"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("cookieConsent", "false");
                      setShowCookieConsent(false);
                    }}
                    className="px-4 py-1 text-sm font-bold text-white bg-lightcoral hover:bg-redpantone rounded"
                  >
                    Rechazar
                  </button>
                </div>
                <a
                  href="/informacion#privacy"
                  className="text-sm underline text-vistablue hover:text-chryslerblue"
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
