import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs-react";
import Lottie from "lottie-react";
import registerAnimation from "../assets/register.json";
import PrimaryButton from "../components/PrimaryButton";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [surname, setSurname] = useState("");
  const [dni, setDni] = useState("");
  const [tlf, setTlf] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!surname.trim()) newErrors.surname = "Los apellidos son obligatorios";
    if (!dni.trim() || !/^\d{8}[A-Za-z]$/.test(dni))
      newErrors.dni = "DNI inválido";
    if (!tlf.trim() || !/^\d{9}$/.test(tlf))
      newErrors.tlf = "Teléfono inválido";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email inválido";
    if (!password || password.length < 6)
      newErrors.password = "Contraseña débil";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "No coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await axios.post("http://localhost:5000/register", {
        name,
        surname,
        dni,
        tlf,
        email,
        password: hashedPassword,
      });
      alert("¡Te has registrado con éxito!");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <div className="flex">
          <Lottie animationData={registerAnimation} style={{ height: 60 }} />
          <h2 className="my-4 text-2xl font-bold text-center">Registro</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Nombre"
            value={name}
            setValue={setName}
            error={errors.name}
          />
          <InputField
            label="Apellidos"
            value={surname}
            setValue={setSurname}
            error={errors.surname}
          />
          <InputField
            label="DNI"
            value={dni}
            setValue={setDni}
            error={errors.dni}
          />
          <InputField
            label="Teléfono"
            value={tlf}
            setValue={setTlf}
            error={errors.tlf}
          />
          <InputField
            label="Correo electrónico"
            type="email"
            value={email}
            setValue={setEmail}
            error={errors.email}
          />
          <InputField
            label="Contraseña"
            type="password"
            value={password}
            setValue={setPassword}
            error={errors.password}
          />
          <InputField
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <PrimaryButton
            text="Registrar"
            classes={"w-full p-2 mt-4"}
          ></PrimaryButton>
        </form>
        <p className="mt-4 text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a
            href="login"
            className="font-bold text-blue-500 hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ label, type = "text", value, setValue, error }) => (
  <div className="mb-3">
    <input
      type={type}
      placeholder={label}
      className={`w-full p-2 border rounded ${error ? "border-red-500" : ""}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default Register;
