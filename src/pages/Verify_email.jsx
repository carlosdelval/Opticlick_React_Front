import { useEffect, useState, useContext } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { verifyEmail } from "../api";
import AuthContext from "../context/AuthContext";

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
          {loading && (
            <output className="flex items-center justify-center w-full h-32 bg-white dark:bg-gray-800">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-chryslerblue"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Cargando...</span>
            </output>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
