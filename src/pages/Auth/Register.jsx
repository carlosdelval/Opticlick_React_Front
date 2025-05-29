import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import registerAnimation from "../../assets/register.json";
import PrimaryButton from "../../components/PrimaryButton";
import InputField from "../../components/InputField";
import { registerUser } from "../../api";
import RotatingText from "../../components/RotatingText";

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
  const [loading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const response = await registerUser(formData);

      if (response) {
        alert("¡Te has registrado con éxito, bienvenido!");
        navigate("/login");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error al registrar el usuario:", error);
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
    <div className="flex items-center justify-center gap-16 md:px-8">
      <div className="flex-col items-start hidden max-w-xl md:flex">
        <h3 className="mb-4 font-bold text-center md:text-2xl lg:text-6xl dark:text-babypowder">
          Consulta{" "}
          <RotatingText
            texts={["Todas tus citas", "Tus Graduaciones", "Tu historial"]}
            mainClassName="px-2 sm:px-2 md:px-3 text-chryslerblue dark:text-vistablue justify-center"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={4000}
          />
        </h3>
      </div>
      <div className="w-full max-w-md p-8 bg-white border-2 border-black shadow-lg rounded-2xl dark:border-gray-400 dark:bg-gray-700 animate-fade-in">
        <div className="flex justify-center mb-4">
          <a href="/" className="inline-block">
            <img
              src="./logo.png"
              alt="OptiClick"
              className="w-20 transition-all duration-300 hover:drop-shadow-[0_0_10px_theme(colors.vistablue) dark:drop-shadow-[0_0_30px_theme(colors.vistablue)]"
            />
          </a>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Lottie animationData={registerAnimation} style={{ height: 60 }} />
          <h2 className="text-2xl font-bold dark:text-babypowder">Registro</h2>
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
          <div className="gap-2 md:flex">
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
          </div>
          <InputField
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
          />
          <div className="gap-2 md:flex">
            <InputField
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={(value) =>
                setFormData({ ...formData, password: value })
              }
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
          </div>
          <PrimaryButton text={
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
                "Registrar"
              )
            } classes="w-full p-2 mt-4" />
        </form>
        <p className="mt-2 text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a
            href="login"
            className="font-bold duration-300 text-vistablue hover:text-chryslerblue dark:hover:text-dark-vista hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
