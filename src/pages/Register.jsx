import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs-react";
import Lottie from "lottie-react";
import registerAnimation from "../assets/register.json";
import PrimaryButton from "../components/PrimaryButton";
import InputField from "../components/InputField";
import { registerUser } from "../api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dni: "",
    tlf: "",
    email: "",
    role: "user",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(formData.name)) {
      newErrors.name = "El nombre solo debe contener letras";
    }
    if (!formData.surname.trim()) {
      newErrors.surname = "Los apellidos son obligatorios";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(formData.surname)) {
      newErrors.surname = "Los apellidos solo deben contener letras";
    }
    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio";
    } else if (!/^[0-9]{8}[A-Z]$/i.test(formData.dni.trim())) {
      newErrors.dni = "El DNI debe tener 8 números seguidos de una letra";
    } else {
      const dniNumber = formData.dni.slice(0, 8);
      const dniLetter = formData.dni.slice(8, 9).toUpperCase();
      const validLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
      const calculatedLetter = validLetters.charAt(dniNumber % 23);

      if (dniLetter !== calculatedLetter) {
        newErrors.dni = "La letra del DNI no es válida";
      }
    }
    if (!formData.tlf.trim() || !/^\d{9}$/.test(formData.tlf))
      newErrors.tlf = "El teléfono debe tener 9 dígitos";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      newErrors.email = "Correo electrónico inválido";
    if (formData.password && formData.password.length < 8)
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Las contraseñas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const hashedPassword = bcrypt.hashSync(formData.password, 10);
      const response = await registerUser({
        ...formData,
        password: hashedPassword,
      });

      if (response) {
        alert("¡Te has registrado con éxito, bienvenido!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error); // Inspecciona la estructura del error

      if (
        error.response &&
        error.response.data &&
        error.response.data.errno === 1062
      ) {
        const newErrors = { ...errors };
        if (error.response.data.sqlMessage.includes("email")) {
          newErrors.dni = "";
          newErrors.email =
            "El correo electrónico ya está registrado. Por favor, utiliza otro correo.";
          setErrors(newErrors);
        } else if (error.response.data.sqlMessage.includes("dni")) {
          newErrors.email = "";
          newErrors.dni =
            "El DNI ya está registrado. Por favor, utiliza otro DNI.";
          setErrors(newErrors);
        } else {
          alert("Error de duplicación: " + error.response.data.sqlMessage);
        }
      } else {
        alert(
          "Se ha producido un error al registrar el usuario. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white border-2 border-black rounded-lg shadow-lg w-96 dark:border-gray-700">
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
          <Lottie animationData={registerAnimation} style={{ height: 60 }} />
          <h2 className="my-4 text-2xl font-bold text-center">Registro</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
          />
          <InputField
            label="Apellidos"
            name="surname"
            value={formData.surname}
            onChange={(value) => setFormData({ ...formData, surname: value })}
            error={errors.surname}
          />
          <InputField
            label="DNI"
            name="dni"
            value={formData.dni}
            onChange={(value) => setFormData({ ...formData, dni: value })}
            error={errors.dni}
          />
          <InputField
            label="Teléfono"
            name="tlf"
            value={formData.tlf}
            onChange={(value) => setFormData({ ...formData, tlf: value })}
            error={errors.tlf}
          />
          <InputField
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
          />
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            error={errors.password}
          />
          <InputField
            label="Confirmar contraseña"
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={(value) =>
              setFormData({ ...formData, confirm_password: value })
            }
            error={errors.confirm_password}
          />
          <PrimaryButton text="Registrar" classes="w-full p-2 mt-4" />
        </form>
        <p className="mt-2 text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a
            href="login"
            className="font-bold duration-300 text-vistablue hover:text-chryslerblue hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
