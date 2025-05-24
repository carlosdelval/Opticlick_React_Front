import React, { useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import UserContext from "../../context/UserContext";
import PrimaryButton from "../../components/PrimaryButton";
import DangerButton from "../../components/DangerButton";
import InputField from "../../components/InputField";
import Lottie from "lottie-react";
import userProfileAnimation from "../../assets/profile.json";
import deleteAnimation from "../../assets/delete.json";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";
import ToggleSwitch from "../../components/ToggleSwitch";
import traducciones from "../../lang/traducciones";
import { useDarkMode } from "../../context/DarkModeContext";

const Profile = () => {
  const { user, setUser } = React.useContext(AuthContext);
  const { eliminarCliente, actualizarCliente, actualizarContrasena } =
    React.useContext(UserContext);
  const [modalDelete, setModalDelete] = useState(false);
  const [activeTab, setActiveTab] = useState("configuracion");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [correo, setCorreo] = useState(false);
  const [navegador, setNavegador] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const [idioma, setIdioma] = useState("es");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dni: "",
    tlf: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Cargar desde localStorage
  useEffect(() => {
    const storedCorreo = localStorage.getItem("notis_correo") === "true";
    const storedNavegador = localStorage.getItem("notis_navegador") === "true";
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    const storedIdioma = localStorage.getItem("idioma") || "es";

    setCorreo(storedCorreo);
    setNavegador(storedNavegador);
    setDarkMode(storedDarkMode);
    setIdioma(storedIdioma);
  }, []);

  // Guardar cambios
  useEffect(() => {
    localStorage.setItem("notis_correo", correo);
  }, [correo]);

  useEffect(() => {
    localStorage.setItem("notis_navegador", navegador);
  }, [navegador]);

  useEffect(() => {
    localStorage.setItem("idioma", idioma);
  }, [idioma]);

  const t = traducciones[idioma];

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
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (!formData.new_password) {
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
      setLoading(true);
      await actualizarContrasena({
        id: user.id,
        password: formData.password,
        new_password: formData.new_password,
      });
      setFormData({
        ...formData,
        password: "",
        new_password: "",
        confirm_password: "",
      });
      setErrors({ password: "", new_password: "", confirm_password: "" });
      setTimeout(() => {
        setLoading(false);
        setSuccess("Contraseña actualizada correctamente.");
        setError(null);
      }, 300);
    } catch (error) {
      console.error("Error:", error);
      setTimeout(() => {
        setLoading(false);
      }, 300);
      setErrors({ password: error.error });
      !error.error && setError("Error al actualizar la contraseña");
      setSuccess(null);
    }
  };

  const handleDelete = () => async () => {
    try {
      await eliminarCliente(user.id);
      setUser(null);
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
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
      setLoading(true);
      const response = await actualizarCliente({
        id: user.id,
        name: formData.name,
        surname: formData.surname,
        dni: formData.dni,
        tlf: formData.tlf,
        email: formData.email,
      });

      if (response) {
        user.name = formData.name;
        user.surname = formData.surname;
        user.dni = formData.dni;
        user.tlf = formData.tlf;
        user.email = formData.email;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => {
          setSuccess("Información actualizada correctamente.");
          setError(null);
          setLoading(false);
        }, 300);
      } else {
        setTimeout(() => {
          setLoading(false);
          setError("Error al actualizar la información");
          setSuccess(null);
        }, 300);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
      }, 300);
      console.error("Error:", error);
      setError("Hubo un problema con la actualización.");
    }
  };

  return (
    <div className="flex flex-col my-auto md:gap-8 md:flex-row md:max-w-7xl md:mx-auto">
      <div className="flex flex-col space-y-8 md:w-1/4 md:space-y-2">
        <div className="p-4 bg-white border-2 border-black rounded-lg shadow-lg h-min animate-fade-in dark:bg-gray-700 dark:border-gray-400">
          <div className="flex mb-4 space-x-2 text-start">
            <Lottie
              animationData={userProfileAnimation}
              loop={true}
              style={{ height: 60 }}
            />
            <h2 className="my-3 text-4xl font-semibold dark:text-babypowder">
              Mi perfil
            </h2>
          </div>
          <ul className="space-y-2">
            {["configuracion", "datos", "password", "delete"].map((tab) => (
              <button
                key={tab}
                className={`p-3 rounded-md cursor-pointer w-full text-left transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-blue-100 font-medium text-chryslerblue border-l-4 border-chryslerblue dark:border-vistablue dark:bg-gray-900 dark:text-babypowder"
                    : "hover:bg-blue-50 hover:text-blue-70 dark:hover:bg-gray-800 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "configuracion" && (
                  <div className="flex flex-row space-x-2">
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      />
                    </svg>
                    <p>Ajustes</p>
                  </div>
                )}
                {tab === "datos" && (
                  <div className="flex flex-row space-x-2">
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                    <p>Mis datos</p>
                  </div>
                )}
                {tab === "password" && (
                  <div className="flex flex-row space-x-2">
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14v3m4-6V7a3 3 0 1 1 6 0v4M5 11h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                      />
                    </svg>
                    <p>Actualizar contraseña</p>
                  </div>
                )}
                {tab === "delete" && (
                  <div className="flex flex-row space-x-2">
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                      />
                    </svg>
                    <p>Eliminar mi cuenta</p>
                  </div>
                )}
              </button>
            ))}
          </ul>
        </div>
        <div className="w-full">
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
        </div>
      </div>
      <div className="p-6 bg-white border-2 border-black rounded-lg shadow-lg md:w-3/4 animate-fade-in h-min dark:bg-gray-700 dark:border-gray-400">
        {loading && (
          <div className="flex items-center justify-center w-auto h-auto">
            <Spinner />
          </div>
        )}
        {activeTab === "datos" && !loading && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="mb-4 text-2xl font-semibold dark:text-babypowder">
              Actualizar mi información
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
                onChange={(value) =>
                  setFormData({ ...formData, surname: value })
                }
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
        )}
        {activeTab === "password" && !loading && (
          <div className="space-y-4 animate-fade-in">
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
        )}
        {activeTab === "configuracion" && !loading && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="mb-4 text-2xl font-semibold dark:text-babypowder">
              {t.configuracion}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{t.descripcion}</p>

            <div className="flex flex-col space-y-4">
              <h2 className="text-lg font-semibold dark:text-babypowder">
                {t.notificaciones}
              </h2>

              <ToggleSwitch
                label={t.correo}
                checked={correo}
                onChange={() => setCorreo(!correo)}
              />
              <ToggleSwitch
                label={t.navegador}
                checked={navegador}
                onChange={() => setNavegador(!navegador)}
              />
            </div>

            <div className="flex flex-col space-y-4">
              <h2 className="mt-4 text-lg font-semibold dark:text-babypowder">
                {t.pagina}
              </h2>
              <ToggleSwitch
                label={t.darkMode}
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>

            <div className="flex flex-col space-y-4">
              <h2 className="mt-4 text-lg font-semibold dark:text-babypowder">
                {t.idioma}
              </h2>
              <select
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                className="w-48 p-2 border rounded dark:bg-gray-800 dark:text-white"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        )}
        {activeTab === "delete" && !loading && (
          <div className="space-y-4 animate-fade-in dark:text-babypowder">
            <h2 className="text-2xl font-semibold">Eliminar mi cuenta</h2>
            <p className="my-4">
              Si desea eliminar su cuenta, haga clic en el botón de abajo.
              <br />
              <span className="font-semibold text-redpantone dark:text-lightcoral">
                Esta acción no se puede deshacer.
              </span>
            </p>
            <DangerButton
              text="Eliminar cuenta"
              classes="p-2 mt-4"
              action={handleModalDelete}
            />
          </div>
        )}
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
          <div className="flex justify-end w-full">
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
