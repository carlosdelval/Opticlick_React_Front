import React, { useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import PrimaryButton from "../../components/PrimaryButton";
import DangerButton from "../../components/DangerButton";
import InputField from "../../components/InputField";
import Lottie from "lottie-react";
import userProfileAnimation from "../../assets/profile.json";
import deleteAnimation from "../../assets/delete.json";
import { deleteUser } from "../../api";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";

const Profile = () => {
  const { user, setUser } = React.useContext(AuthContext);
  const [modalDelete, setModalDelete] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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

  const handleModalDelete = () => {
    setModalDelete(!modalDelete);
  };

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
        setSuccess("Contraseña actualizada correctamente.");
        setError(null);
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
        if (data.error === "Contraseña incorrecta") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: data.error,
          }));
        } else {
          setError(data.error || "Error al actualizar la contraseña");
          setSuccess(null);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un problema con la actualización.");
    }
  };

  const handleDelete = () => async () => {
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

        setSuccess("Perfil actualizado correctamente.");
        setError(null);
      } else {
        setError(data.error || "Error al actualizar el perfil");
        setSuccess(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un problema con la actualización.");
    }
  };

  return (
    <div className="my-auto md:max-w-7xl md:mx-auto">
      <div className="flex mb-4 space-x-2 text-start">
        <Lottie animationData={userProfileAnimation} style={{ height: 70 }} />
        <h2 className="my-5 text-4xl font-semibold dark:text-babypowder">
          Editar perfil
        </h2>
      </div>
      {error && (
        <Alert onDismiss={() => setError(null)} text={error} type="error" />
      )}
      {success && (
        <Alert
          onDismiss={() => setSuccess(null)}
          text={success}
          type="success"
        />
      )}
      <div className="md:flex md:space-x-4 space-y-7 md:space-y-0">
        <div className="p-6 bg-white border-2 border-black rounded-lg shadow-lg md:w-1/2 dark:bg-gray-800 max-w-7xl sm:px-6 lg:px-8 dark:border-gray-700">
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
            <PrimaryButton
              text="Guardar cambios"
              classes="py-2"
            ></PrimaryButton>
          </form>
        </div>
        <div className="md:flex md:flex-col md:justify-between md:w-1/2 md:space-y-0 space-y-7">
          <div className="p-6 bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-800 max-w-7xl sm:px-6 lg:px-8 dark:border-gray-700">
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
          <div className="p-6 bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-800 max-w-7xl sm:px-6 lg:px-8 dark:border-gray-700">
            <h2 className="text-2xl font-semibold dark:text-babypowder">
              Eliminar mi cuenta
            </h2>
            <p className="my-4">
              Si desea eliminar su cuenta, haga clic en el botón de abajo.
              <br />
              <span className="font-semibold text-redpantone">
                Esta acción no se puede deshacer.
              </span>
            </p>
            <DangerButton
              text="Eliminar cuenta"
              classes="p-2 mt-4"
              action={handleModalDelete}
            ></DangerButton>
          </div>
        </div>
      </div>
      {/* Modal borrar cliente*/}
      <Modal
        open={modalDelete}
        onClose={handleModalDelete}
        text={
          <div className="my-2">
            <p>¿Está seguro de que desea borrar su cuenta?</p>
            <p>
              La información se eliminará de la base de datos y no podrá ser
              recuperada.
            </p>
          </div>
        }
        title={
          <div className="flex space-x-2">
            <Lottie animationData={deleteAnimation} style={{ height: 60 }} />
            <h2 className="my-4 text-2xl font-bold text-center">
              Eliminar mi cuenta
            </h2>
          </div>
        }
        bottom={
          <div className="flex w-full justify-end">
            <DangerButton
              action={handleDelete()}
              classes={"mt-6 "}
              text="Eliminar"
            />
          </div>
        }
      />
    </div>
  );
};

export default Profile;
