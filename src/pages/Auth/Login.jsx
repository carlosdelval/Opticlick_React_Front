import { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { login as loginAPI } from "../../api";
import PrimaryButton from "../../components/PrimaryButton";
import InputField from "../../components/InputField";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/login.json";
import Spinner from "../../components/Spinner";

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [error_user, setError_user] = useState("");
  const [error_pass, setError_pass] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for saved credentials when component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
      });
      setRemember(true);
    }
  }, []);

  const handleRememberChange = (e) => {
    const isChecked = e.target.checked;
    setRemember(isChecked);

    // Si se desmarca, eliminamos las credenciales guardadas
    if (!isChecked) {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError_user("");
    setError_pass("");
    setLoading(true);

    try {
      const res = await loginAPI(formData);

      if (res.token && res.role) {
        if (remember) {
          localStorage.setItem("rememberedEmail", formData.email);
          localStorage.setItem("rememberedPassword", formData.password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        login({
          token: res.token,
          role: res.role,
          email: res.email,
          name: res.name,
          tlf: res.tlf,
          dni: res.dni,
          surname: res.surname,
          id: res.id,
          email_verified: res.email_verified,
        });
      } else {
        setError_user("Respuesta inesperada del servidor.");
      }
    } catch (err) {
      console.error("Error en el login:", err.response?.data || err.message);
      if (err.response?.data.error === "Usuario no encontrado") {
        setError_user("Usuario no encontrado");
      }
      if (err.response?.data.error === "Contraseña incorrecta") {
        setError_pass("Contraseña incorrecta");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow">
      <div className="p-8 space-y-4 bg-white border-2 border-black shadow-lg rounded-2xl w-96 dark:border-gray-400 dark:bg-gray-700 dark:text-babypowder animate-fade-in">
        <div className="flex justify-center mb-4">
          <a href="/" className="inline-block">
            <img
              src="./logo.png"
              alt="OptiClick"
              className="w-20 transition-all duration-300 hover:drop-shadow-[0_0_10px_theme(colors.vistablue)] dark:drop-shadow-[0_0_30px_theme(colors.vistablue)]"
            />
          </a>
        </div>
        <div className="flex">
          <Lottie
            speed={2}
            animationData={loginAnimation}
            style={{ height: 60 }}
          />
          <h2 className="my-4 text-2xl font-bold text-center">
            Iniciar sesión
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={error_user}
            required
          />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            error={error_pass}
            onChange={(value) => setFormData({ ...formData, password: value })}
            required
          />
          <div className="flex items-center me-4">
            <input
              onChange={handleRememberChange}
              checked={remember}
              id="rememberCheckbox"
              type="checkbox"
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded-sm focus:ring-chryslerblue dark:focus:ring-vistablue dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="rememberCheckbox"
              className="text-sm font-medium text-gray-700 ms-2 dark:text-gray-300"
            >
              Recordar contraseña
            </label>
          </div>
          <PrimaryButton
            text={
              loading ? (
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-chryslerblue dark:fill-vistablue"
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
              ) : (
                "Iniciar sesión"
              )
            }
            classes="w-full mt-4 p-2"
            disabled={loading}
          />
        </form>
        {/* Google Login Button */}
        <div className="justify-center pt-4 border-t border-gray-300">
          <button
            onClick={loginWithGoogle}
            className="flex w-full gap-2 px-4 py-2 transition duration-150 border rounded-lg border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow"
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
            <span>Iniciar sesión con Google</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 ">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="font-bold duration-300 text-vistablue hover:text-chryslerblue dark:hover:text-dark-vista hover:underline"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
