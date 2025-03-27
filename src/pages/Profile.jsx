import React, { useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import DangerButton from "../components/DangerButton";
import InputField from "../components/InputField";
import Lottie from "lottie-react";
import userProfileAnimation from "../assets/profile.json";
import { deleteUser } from "../api";

const Profile = () => {
  const { user, setUser } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dni: "",
    tlf: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        dni: user.dni || "",
        tlf: user.tlf || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const [errors, setErrors] = useState({});

  const validateFormInfo = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  };

  const validateFormPass = () => {
    let newErrors = {};
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (!formData.new_password.trim()) {
      newErrors.new_password = "La contraseña es obligatoria";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Las contraseñas no coinciden";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPass = async (e) => {
    e.preventDefault();
    if (!validateFormPass()) return;

    try {
      const response = await fetch("http://localhost:5000/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // 📌 Enviar el token
        },
        body: JSON.stringify({
          password: formData.password,
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tu contraseña ha sido actualizada correctamente.");
        // Reset password fields
        setFormData((prevData) => ({
          ...prevData,
          password: "",
          new_password: "",
          confirm_password: "",
        }));
        // Clear any errors related to password fields
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.password;
          delete newErrors.new_password;
          delete newErrors.confirm_password;
          return newErrors;
        });
      } else {
        alert(data.error || "Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con la actualización.");
    }
  };

  const handleDelete = () => async () => {
    if (!window.confirm("¿Estás seguro que deseas eliminar tu cuenta?")) {
      return;
    }
    try {
      await deleteUser(user.id);
      setUser(null);
      localStorage.removeItem("user");
      alert("Cuenta eliminada correctamente.");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("No se pudo eliminar la cuenta.");
    }
  };
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!validateFormInfo()) return;

    try {
      const response = await fetch("http://localhost:5000/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // 📌 Enviar el token
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 📌 Actualizar el estado global y el localStorage
        const updatedUser = { ...user, ...formData };
        delete updatedUser.password;
        delete updatedUser.confirm_password;

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        alert("Perfil actualizado correctamente.");
      } else {
        alert(data.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con la actualización.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex mb-8 space-x-2 text-start">
        <Lottie animationData={userProfileAnimation} style={{ height: 70 }} />
        <h2 className="my-5 text-4xl font-semibold dark:text-babypowder">
          Editar perfil
        </h2>
      </div>
      <div className="p-6 mx-auto bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-800 max-w-7xl sm:px-6 lg:px-8 dark:border-gray-700">
        <h2 className="mb-4 text-2xl font-semibold dark:text-babypowder">
          Información
        </h2>
        <form onSubmit={handleSubmitInfo} className="space-y-4">
          <InputField
            text="Nombre:"
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
          />
          <InputField
            text="Apellidos:"
            label="Apellido"
            name="surname"
            value={formData.surname}
            onChange={(value) => setFormData({ ...formData, surname: value })}
            error={errors.surname}
          />
          <InputField
            text="DNI:"
            label="DNI"
            name="dni"
            value={formData.dni}
            onChange={(value) => setFormData({ ...formData, dni: value })}
            error={errors.dni}
          />
          <InputField
            text="Teléfono:"
            label="Teléfono"
            name="tlf"
            value={formData.tlf}
            onChange={(value) => setFormData({ ...formData, tlf: value })}
            error={errors.tlf}
          />
          <InputField
            text="Correo electrónico:"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
          />
          <PrimaryButton text="Guardar cambios" classes="py-2"></PrimaryButton>
        </form>
      </div>
      <div className="p-6 mx-auto bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-800 max-w-7xl my-7 sm:px-6 lg:px-8 dark:border-gray-700">
        <h2 className="mb-4 text-2xl font-semibold dark:text-babypowder">
          Contraseña
        </h2>
        <form onSubmit={handleSubmitPass} className="space-y-4">
          <InputField
            label="Contraseña actual"
            name="password"
            type="password"
            value={formData.password}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, password: value }))
            }
            error={errors.password}
          />
          <InputField
            label="Nueva contraseña"
            name="new_password"
            type="password"
            value={formData.new_password}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, new_password: value }))
            }
            error={errors.new_password}
          />
          <InputField
            label="Confirmar contraseña"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, confirm_password: value }))
            }
            error={errors.confirm_password}
          />
          <PrimaryButton
            text="Confirmar contraseña"
            classes="py-2"
          ></PrimaryButton>
        </form>
      </div>
      <div className="p-6 mx-auto bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-800 max-w-7xl my-7 sm:px-6 lg:px-8 dark:border-gray-700">
        <h2 className="text-2xl font-semibold dark:text-babypowder">
          Eliminar mi cuenta
        </h2>
        <DangerButton
          text="Eliminar cuenta"
          classes="p-2 mt-4"
          action={handleDelete()}
        ></DangerButton>
      </div>
    </div>
  );
};

export default Profile;
