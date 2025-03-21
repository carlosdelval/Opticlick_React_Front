import React, { useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import InputField from "../components/InputField";
import Lottie from "lottie-react";
import editAnimation from "../assets/edit.json";

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

  const validateForm = () => {
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
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    <div className="max-w-2xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
      <div className="flex">
        <Lottie animationData={editAnimation} style={{ height: 60 }} />
        <h2 className="my-4 text-2xl font-bold text-center">Editar perfil</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <InputField
          text="Contraseña:"
          label="Nueva contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, password: value }))
          }
          error={errors.password}
        />
        <InputField
          text="Confirmar contraseña:"
          label="Confirmar contraseña"
          name="confirm_password"
          type="password"
          value={formData.confirm_password}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, confirm_password: value }))
          }
          error={errors.confirm_password}
        />
        <PrimaryButton text="Guardar cambios" classes="w-full py-2">
          Guardar cambios
        </PrimaryButton>
      </form>
    </div>
  );
};

export default Profile;
