import { useEffect, useState, useContext } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { verifyEmail } from "../../api";
import AuthContext from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

const VerifyEmail = () => {
  const { login } = useContext(AuthContext);
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const verificarEmail = async () => {
    try {
      const res = await verifyEmail(token);
      if (res.token && res.id) {
        login({
          token: res.token,
          role: res.role,
          email: res.email,
          name: res.name,
          tlf: res.tlf,
          dni: res.dni,
          surname: res.surname,
          id: res.id,
          email_verified: true,
        });
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setSuccess("¡Correo electrónico verificado con éxito!");
      setError(null);
    } catch (error) {
      if (error.response) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setSuccess(false);
        console.log(error.response.data);
        setError("Error al verificar, el código ha expirado o no es válido.");
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setSuccess(false);
        setError("Error. Por favor, intenta de nuevo más tarde.");
      }
    }
  };

  useEffect(() => {
    verificarEmail();
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
  }, [success]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="z-10 max-w-md p-10 text-center bg-white border-2 border-black shadow-xl dark:border-gray-400 dark:bg-gray-700 dark:text-babypowder rounded-2xl animate-fade-in">
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
          <p className="mt-2 text-gray-700">
            Tu sistema de gestión de citas ópticas
          </p>
        </div>
        <div className="mb-4 text-center">
          {!loading && error && (
            <Alert
              icon={HiInformationCircle}
              className="mb-4 rounded-lg shadow-md bg-lightcoral"
            >
              <span className="font-medium">{error}</span>
            </Alert>
          )}
          {!loading && success && (
            <Alert
              className="mb-4 rounded-lg shadow-md bg-aquamarine"
              icon={HiInformationCircle}
            >
              <span className="font-medium">{success}</span>
            </Alert>
          )}
          {loading && <Spinner />}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
