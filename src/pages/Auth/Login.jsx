import { useState, useContext, useEffect } from "react";
import { login as loginAPI } from "../../api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import PrimaryButton from "../../components/PrimaryButton";
import InputField from "../../components/InputField";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/login.json";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
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

        navigate(res.role === "user" ? "/dashboard" : "/admin-dashboard");
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
      <div className="p-8 bg-white border-2 border-black shadow-lg rounded-2xl w-96 dark:border-gray-700 animate-fade-in">
        <div className="flex justify-center mb-4">
          <a href="/" className="inline-block">
            <img
              src="./logo.png"
              alt="OptiClick"
              className="w-20 transition-all duration-300 hover:drop-shadow-[0_0_10px_theme(colors.vistablue)]"
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
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded-sm focus:ring-chryslerblue dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="rememberCheckbox"
              className="text-sm font-medium text-gray-700 ms-2 dark:text-gray-300"
            >
              Recordar contraseña
            </label>
          </div>
          <PrimaryButton
            text={loading ? "Cargando..." : "Iniciar sesión"}
            classes="w-full mt-4 p-2"
            disabled={loading}
          />
        </form>
        <p className="my-2 text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="font-bold duration-300 text-vistablue hover:text-chryslerblue hover:underline"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
