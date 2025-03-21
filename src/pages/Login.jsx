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
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        setError("Respuesta inesperada del servidor.");
      }
    } catch (err) {
      console.error("Error en el login:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Error desconocido");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <div className="flex">
          <Lottie animationData={loginAnimation} style={{ height: 60 }} />
          <h2 className="my-4 text-2xl font-bold text-center">
            Iniciar sesión
          </h2>
        </div>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <InputField
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required
          />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            required
          />
          <PrimaryButton text="Iniciar sesión" classes="w-full mt-4 p-2" />
        </form>
        <p className="mt-2 text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="font-bold text-blue-500 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
