import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import InputField from "../components/InputField";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login.json";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error_user, setError_user] = useState("");
  const [error_pass, setError_pass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError_user("");
    setError_pass("");

    try {
      const res = await axios.post("http://localhost:5000/login", formData);

      if (res.data.token && res.data.role) {
        login({
          token: res.data.token,
          role: res.data.role,
          email: res.data.email,
          name: res.data.name,
          tlf: res.data.tlf,
          dni: res.data.dni,
          surname: res.data.surname,
          id: res.data.id,
        });

        navigate(res.data.role === "admin" ? "/admin-dashboard" : "/dashboard");
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white border-2 border-black rounded-lg shadow-lg w-96 dark:border-gray-700">
        <div className="flex">
          <Lottie animationData={loginAnimation} style={{ height: 60 }} />
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
          <PrimaryButton text="Iniciar sesión" classes="w-full mt-4 p-2" />
        </form>
        <p className="mt-2 text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="font-bold duration-300 text-vistablue hover:text-chryslerblue hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
