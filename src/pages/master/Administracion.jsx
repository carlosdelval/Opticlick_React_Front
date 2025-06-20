import React from "react";
import OpticasContext from "../../context/OpticasContext";
import UserContext from "../../context/UserContext";
import Lottie from "lottie-react";
import settingAnimation from "../../assets/setting.json";
import profileAnimation from "../../assets/profile.json";
import SecondaryDanger from "../../components/SecondaryDanger";
import SecondaryButton from "../../components/SecondaryButton";
import PrimaryButton from "../../components/PrimaryButton";
import DangerButton from "../../components/DangerButton";
import Spinner from "../../components/Spinner";
import deleteAnimation from "../../assets/delete.json";
import { Popover } from "flowbite-react";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import InputField from "../../components/InputField";
import MenuButton from "../../components/MenuButton";
import SearchBar from "../../components/SearchBar";

function Administracion() {
  const [activeTab, setActiveTab] = React.useState("admins");
  const {
    opticas,
    asignarOptica,
    addNewOptica,
    deleteOpticaById,
    updateOpticaById,
  } = React.useContext(OpticasContext);
  const {
    fetchAdmins,
    fetchAdminsOptica,
    eliminarCliente,
    actualizarCliente,
    registrarCliente,
    loading,
    setLoading,
    admins,
  } = React.useContext(UserContext);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [modalDelete, setModalDelete] = React.useState(false);
  const [modalInfoAdmin, setModalInfoAdmin] = React.useState(false);
  const [selectedName, setSelectedName] = React.useState("");
  const [selectedSurname, setSelectedSurname] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [opticaSearch, setOpticaSearch] = React.useState("");
  const [openAccordions, setOpenAccordions] = React.useState({});
  const [errorForm, setErrorForm] = React.useState({
    name: "",
    surname: "",
    dni: "",
    tlf: "",
    email: "",
    optica: "",
  });
  const [formData, setFormData] = React.useState({
    id: "",
    name: "",
    surname: "",
    dni: "",
    tlf: "",
    email: "",
    password: "",
    optica: "",
    role: "admin",
  });
  const [errorFormOptica, setErrorFormOptica] = React.useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });
  const [formDataOptica, setFormDataOptica] = React.useState({
    id: "",
    nombre: "",
    direccion: "",
    telefono: "",
  });

  const validateFormOptica = () => {
    let isValid = true;
    const newErrorFormOptica = {
      nombre: "",
      direccion: "",
      telefono: "",
    };
    if (!formDataOptica.nombre) {
      newErrorFormOptica.nombre = "El nombre de la óptica es obligatorio";
      isValid = false;
    }
    if (!formDataOptica.direccion) {
      newErrorFormOptica.direccion = "La dirección es obligatoria";
      isValid = false;
    }
    if (!formDataOptica.telefono) {
      newErrorFormOptica.telefono = "El teléfono es obligatorio";
      isValid = false;
    } else if (!/^\d{9}$/.test(formDataOptica.telefono)) {
      newErrorFormOptica.telefono = "El formato de teléfono no es válido";
      isValid = false;
    }
    setErrorFormOptica(newErrorFormOptica);
    return isValid;
  };

  const handleAddOptica = async (data) => {
    setLoading(true);
    try {
      if (!validateFormOptica()) {
        return;
      }
      setErrorFormOptica({
        nombre: "",
        direccion: "",
        telefono: "",
      });
      await addNewOptica(data);
      // Update optica in the UI
      if (opticaSearch) {
        fetchAdminsOptica(opticaSearch);
      } else {
        fetchAdmins();
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setSuccess("Óptica registrada con éxito");
      setError(null);
      setModalInfoAdmin(false);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      console.error("Error registering optica:", err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.error || "";
        if (errorMessage.toLowerCase().includes("nombre")) {
          setErrorFormOptica({
            ...errorFormOptica,
            nombre: "El nombre de la óptica ya está en uso",
          });
          return;
        }
      } else if (err.response && err.response.status === 500) {
        setModalInfoAdmin(false);
        setError("No se pudo registrar la óptica");
        setSuccess(null);
      }
    }
  };
  const handleUpdateOptica = async (id) => {
    setError(null);
    setSuccess(null);
    if (!validateFormOptica()) {
      return;
    }
    try {
      setLoading(true);
      setErrorFormOptica({
        nombre: "",
        direccion: "",
        telefono: "",
      });
      await updateOpticaById(id, formDataOptica);
      // Update optica in the UI
      if (opticaSearch) {
        fetchAdminsOptica(opticaSearch);
      } else {
        fetchAdmins();
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setModalInfoAdmin(false);
      setSuccess("Óptica actualizada con éxito");
      setError(null);
    } catch (err) {
      console.error("Error updating optica:", err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.error || "";
        if (errorMessage.toLowerCase().includes("nombre")) {
          setErrorFormOptica({
            ...errorFormOptica,
            nombre: "El nombre de la óptica ya está en uso",
          });
          return;
        }
      } else if (err.response && err.response.status === 500) {
        setModalInfoAdmin(false);
        setError("No se pudo actualizar la óptica");
        setSuccess(null);
      }
    }
  };

  const handleDeleteOptica = async (id) => {
    try {
      await deleteOpticaById(id);
      if (opticaSearch) {
        fetchAdminsOptica(opticaSearch);
      } else {
        fetchAdmins();
      }
      setModalDelete(false);
      setCurrentPage(1);
      setSuccess("Óptica eliminada correctamente");
      setError(null);
    } catch (err) {
      console.error("Error deleting optica:", err);
      setModalDelete(false);
      setError("No se pudo eliminar la óptica");
      setSuccess(null);
    }
  };

  const handleAddAdmin = async (data) => {
    setLoading(true);
    try {
      if (!validateForm()) {
        return;
      }
      setErrorForm({
        name: "",
        surname: "",
        dni: "",
        tlf: "",
        email: "",
      });
      const result = await registrarCliente(data);
      if (result?.id && data.optica) {
        console.log(result.id, data.optica);
        await asignarOptica(result.id, data.optica);
      }
      if (opticaSearch) {
        fetchAdminsOptica(opticaSearch);
      } else {
        fetchAdmins();
      }
      setSearchTerm("");
      setModalInfoAdmin(false);
      setSuccess("Cliente registrado correctamente");
      setError(null);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      console.error("Error registering client:", err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.error || "";
        if (errorMessage.toLowerCase().includes("dni")) {
          setErrorForm({
            ...errorForm,
            dni: "El DNI ya está en uso",
          });
          return;
        }
        if (errorMessage.toLowerCase().includes("email")) {
          setErrorForm({
            ...errorForm,
            email: "El email ya está en uso",
          });
          return;
        }
      } else if (err.response && err.response.status === 500) {
        setModalInfoAdmin(false);
        setError("No se pudo registrar el cliente");
        setSuccess(null);
      }
    }
  };

  React.useEffect(() => {
    if (opticaSearch) {
      fetchAdminsOptica(opticaSearch);
    } else {
      fetchAdmins();
    }
  }, [opticaSearch]);

  const handleDeleteAdmin = async (id) => {
    try {
      await eliminarCliente(id);
      if (opticaSearch) {
        fetchAdminsOptica(opticaSearch);
      } else {
        fetchAdmins();
      }
      setModalDelete(false);
      setCurrentPage(1);
      setSuccess("Admin eliminado correctamente");
      setError(null);
    } catch (err) {
      console.error("Error deleting client:", err);
      setModalDelete(false);
      setError("No se pudo eliminar el Admin");
      setSuccess(null);
    }
  };

  // Validar formulario
  const validateForm = () => {
    let isValid = true;
    const newErrorForm = {
      name: "",
      surname: "",
      dni: "",
      tlf: "",
      email: "",
      optica: "",
    };
    if (!formData.name) {
      newErrorForm.name = "El nombre es obligatorio";
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.name)) {
      newErrorForm.name = "El nombre sólo puede contener letras.";
      isValid = false;
    }
    if (!formData.surname) {
      newErrorForm.surname = "Los apellidos son obligatorios";
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.surname)) {
      newErrorForm.surname = "Los apellidos sólo pueden contener letras.";
      isValid = false;
    }
    if (!formData.dni) {
      newErrorForm.dni = "El DNI es obligatorio";
      isValid = false;
    } else if (!/^\d{8}[A-HJ-NP-TV-Z]$/.test(formData.dni)) {
      newErrorForm.dni = "El formato del DNI no es válido";
      isValid = false;
    }
    if (!formData.tlf) {
      newErrorForm.tlf = "El teléfono es obligatorio";
      isValid = false;
    } else if (!/^\d{9}$/.test(formData.tlf)) {
      newErrorForm.tlf = "El formato de teléfono no es válido";
      isValid = false;
    }
    if (!formData.email) {
      newErrorForm.email = "El email es obligatorio";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrorForm.email = "El formato de email no es válido.";
      isValid = false;
    }
    if (!formData.optica) {
      newErrorForm.optica = "La óptica es obligatoria";
      isValid = false;
    }
    setErrorForm(newErrorForm);
    return isValid;
  };

  const handleUpdateAdmin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!validateForm()) {
      return;
    }
    try {
      setErrorForm({
        name: "",
        surname: "",
        dni: "",
        tlf: "",
        email: "",
        optica: "",
      });
      await actualizarCliente(formData);
      // Update admin in the UI
      if (opticaSearch) {
        fetchAdminsOptica(opticaSearch);
      } else {
        fetchAdmins();
      }
      setModalInfoAdmin(false);
      setSuccess("Admin actualizado correctamente");
      setError(null);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      console.error("Error updating admin:", err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.error || "";
        if (errorMessage.toLowerCase().includes("dni")) {
          errorForm.setErrorForm({
            ...errorForm,
            dni: "El DNI ya está en uso",
          });
          return;
        }
        if (errorMessage.toLowerCase().includes("email")) {
          setErrorForm({
            ...errorForm,
            email: "El email ya está en uso",
          });
          return;
        }
      } else if (err.response && err.response.status === 500) {
        setModalInfoAdmin(false);
        setError("No se pudo actualizar el admin");
        setSuccess(null);
      }
    }
  };

  const handleOpenModalDelete = (i) => {
    if (activeTab === "admins") {
      setSelectedName(i.name);
      setSelectedSurname(i.surname);
      setSelectedId(i.id);
      setModalDelete(true);
    } else {
      setSelectedName(i.nombre);
      setSelectedSurname(null);
      setSelectedId(i.id);
      setModalDelete(true);
    }
  };

  const handleOpenModalInfoAdmin = async (i) => {
    activeTab === "admins"
      ? setFormData({
          id: i.id,
          name: i.name,
          surname: i.surname,
          dni: i.dni,
          tlf: i.tlf,
          email: i.email,
          optica: i.optica_id,
        })
      : setFormDataOptica({
          id: i.id,
          nombre: i.nombre,
          direccion: i.direccion,
          telefono: i.telefono,
        });
    setModalInfoAdmin(true);
  };

  //Gestionar apertura de acordeón
  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Resetear a la primera página cuando el término de búsqueda cambie
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtrar los clientes por nombre, email o dni
  const filteredList = React.useMemo(() => {
    const listasToFilter = activeTab === "admins" ? admins : opticas;
    return listasToFilter.filter((i) => {
      let normalized1 = null;
      let normalized2 = null;
      let normalized3 = null;
      if (activeTab === "admins") {
        normalized1 = i.name
          .concat(" ", i.surname)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        normalized2 = i.dni
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        normalized3 = i.email
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      }
      if (activeTab === "opticas") {
        normalized1 = i.nombre
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        normalized2 = i.direccion
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        normalized3 = i.telefono
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      }
      const normalizedSearchTerm = searchTerm
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return (
        normalized1.includes(normalizedSearchTerm) ||
        normalized2.includes(normalizedSearchTerm) ||
        normalized3.includes(normalizedSearchTerm)
      );
    });
  }, [admins, searchTerm]);

  // Paginación de las citas filtradas
  const totalFilteredPages = Math.ceil(filteredList.length / itemsPerPage);
  const currentFilteredList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCambio = async (tab) => {
    if (activeTab === tab) return;
    setSearchTerm("");
    setCurrentPage(1);
    setOpticaSearch("");
    fetchAdmins();
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <div className="flex flex-col my-auto lg:gap-12 lg:flex-row lg:max-w-7xl lg:mx-auto">
      <div className="flex flex-col space-y-8 lg:w-1/4 lg:space-y-2">
        <div className="p-4 bg-white border-2 border-black rounded-lg shadow-lg h-min animate-fade-in dark:bg-gray-700 dark:border-gray-400">
          <div className="flex mb-4 space-x-2 text-start">
            <Lottie
              animationData={settingAnimation}
              style={{ height: 50 }}
              loop={false}
            />
            <h2 className="my-2 text-3xl font-semibold my dark:text-babypowder">
              Administración
            </h2>
          </div>
          <ul className="space-y-2">
            {["admins", "opticas"].map((tab) => (
              <button
                key={tab}
                className={`p-3 rounded-md cursor-pointer w-full text-left transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-blue-100 font-medium text-chryslerblue border-l-4 border-chryslerblue dark:border-vistablue dark:bg-gray-900 dark:text-babypowder"
                    : "hover:bg-blue-50 hover:text-blue-70 dark:hover:bg-gray-800 dark:text-gray-400"
                }`}
                onClick={() => {
                  handleCambio(tab);
                }}
              >
                {tab === "admins" && (
                  <div className="flex flex-row space-x-2">
                    <svg
                      className="w-6 h-6 "
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
                        d="M14.079 6.839a3 3 0 0 0-4.255.1M13 20h1.083A3.916 3.916 0 0 0 18 16.083V9A6 6 0 1 0 6 9v7m7 4v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-7-4v-6H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1Zm12-6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z"
                      />
                    </svg>
                    <p>Gestión administradores</p>
                  </div>
                )}
                {tab === "opticas" && (
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
                        d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                      />
                    </svg>
                    <p>Gestión ópticas</p>
                  </div>
                )}
              </button>
            ))}
          </ul>
          <div className="w-full pt-5">
            <MenuButton
              classes={"w-full"}
              text={
                activeTab === "admins"
                  ? "Añadir administrador"
                  : "Añadir óptica"
              }
              icon={
                <svg
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
                    d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              }
              action={
                activeTab === "admins"
                  ? () => {
                      setFormData({
                        id: "",
                        name: "",
                        surname: "",
                        dni: "",
                        tlf: "",
                        email: "",
                        password: "",
                      });
                      setModalInfoAdmin(true);
                    }
                  : () => {
                      setFormDataOptica({
                        id: "",
                        nombre: "",
                        direccion: "",
                        telefono: "",
                      });
                      setModalInfoAdmin(true);
                    }
              }
            />
          </div>
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
      <div className="lg:w-3/4 animate-fade-in">
        {/* Barrita de búsqueda */}
        <div className="mb-2 space-y-2 lg:mb-4 lg:flex lg:space-x-3 lg:space-y-0">
          <div className="space-y-2 lg:flex lg:space-y-0 lg:space-x-3">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              className="w-full md:w-1/2"
              placeholder={
                activeTab === "admins"
                  ? "Buscar por nombre, email o DNI"
                  : "Buscar por nombre, dirección o teléfono"
              }
            />
            {activeTab === "admins" && (
              <div className="relative">
                <select
                  className="block w-full p-4 text-sm text-gray-900 bg-white border-2 border-black rounded-lg md:w-96 focus:bg-blue-50 focus:border-chryslerblue focus:outline-none dark:bg-gray-700 dark:border-gray-300 dark:placeholder-gray-400 dark:text-white"
                  onChange={(e) => setOpticaSearch(e.target.value)}
                  value={opticaSearch}
                >
                  <option value="" disabled>
                    Filtrar por óptica
                  </option>
                  <option value="">Todas las ópticas</option>
                  {opticas.map((optica) => (
                    <option key={optica.id} value={optica.id}>
                      {optica.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden bg-white border-2 border-black rounded-lg shadow-lg dark:border-gray-300 dark:bg-gray-700">
          <div className="overflow-x-auto">
            <div className="hidden md:block">
              <table className="min-w-full bg-white divide-y divide-gray-200 dark:divide-gray-300">
                <thead className="text-xs font-medium tracking-wider text-left uppercase bg-chryslerblue dark:bg-gray-900 text-babypowder">
                  <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">
                      {activeTab === "admins" ? "Email" : "Dirección"}
                    </th>
                    {activeTab === "admins" && (
                      <th className="px-6 py-3">DNI</th>
                    )}
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700">
                  {!loading &&
                    currentFilteredList.map((i) => (
                      <tr
                        key={i.id}
                        className="transition-colors duration-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          <Popover
                            arrow={false}
                            trigger="hover"
                            content={
                              <div className="flex flex-col items-start p-2 text-xs bg-blue-100 border rounded-lg shadow-md border-vistablue text-chryslerblue dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                <div className="flex items-center space-x-2 dark:text-babypowder">
                                  <svg
                                    className="w-4 h-4"
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
                                      d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"
                                    />
                                  </svg>

                                  <span className="font-semibold">
                                    {activeTab === "admins"
                                      ? i.tlf
                                      : i.telefono}
                                  </span>
                                </div>
                              </div>
                            }
                          >
                            <span className="bg-blue-100 text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                              <svg
                                className="w-4 h-4 me-1.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                              </svg>
                              {activeTab === "admins"
                                ? i.name + " " + i.surname
                                : i.nombre}
                            </span>
                          </Popover>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <span className="bg-babypowder text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                            <svg
                              className="w-4 h-4 me-1.5"
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
                                strokeWidth="2"
                                d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                              />
                            </svg>
                            {activeTab === "admins" ? i.email : i.direccion}
                          </span>
                        </td>
                        {activeTab === "admins" && (
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <span className="bg-babypowder text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                              <svg
                                className="w-4 h-4 me-1.5"
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
                                  d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z"
                                />
                              </svg>
                              {i.dni}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div className="flex justify-end space-x-3">
                            <SecondaryButton
                              text="Ver perfil"
                              classes={"px-1"}
                              icon={
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
                              }
                              action={() => handleOpenModalInfoAdmin(i)}
                            />
                            <SecondaryDanger
                              action={() => handleOpenModalDelete(i)}
                              text="Eliminar"
                              icon={
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
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {loading && <Spinner />}
            {filteredList.length === 0 && !loading && (
              <p className="p-4 my-4 text-center">
                No hay {activeTab === "admins" ? "administradores" : "ópticas"}{" "}
                que coincidan con la búsqueda
              </p>
            )}
          </div>
          <div
            className="md:hidden"
            id="accordion-color"
            data-accordion="collapse"
            data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white"
          >
            {!loading &&
              currentFilteredList.map((i, index) => {
                return (
                  <div
                    key={i.id}
                    className="border-b border-gray-200 dark:border-gray-300"
                  >
                    <h2 id={`accordion-color-heading-${index}`}>
                      <button
                        type="button"
                        className={`${
                          openAccordions[i.id]
                            ? "bg-blue-50 dark:bg-gray-800"
                            : ""
                        } flex items-center justify-between w-full gap-3 p-5 font-medium text-gray-500 rtl:text-right dark:border-gray-700 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800`}
                        data-accordion-target={`#accordion-color-body-${index}`}
                        onClick={() => toggleAccordion(i.id)}
                        aria-expanded={openAccordions[i.id] || false}
                      >
                        <div className="space-y-4 text-left">
                          <div className="font-medium text-gray-900 dark:text-babypowder">
                            {activeTab === "admins"
                              ? i.name + " " + i.surname
                              : i.nombre}
                          </div>
                          <div className="space-y-2">
                            <div className="space-x-2">
                              <span className="bg-babypowder text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                                <svg
                                  className="w-4 h-4 me-1.5"
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
                                    strokeWidth="2"
                                    d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                                  />
                                </svg>
                                {activeTab === "admins" ? i.email : i.direccion}
                              </span>
                              {activeTab === "admins" && (
                                <span className="bg-babypowder text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                                  <svg
                                    className="w-4 h-4 me-1.5"
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
                                      d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z"
                                    />
                                  </svg>
                                  {i.dni}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="bg-blue-100 text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                                <svg
                                  className="w-4 h-4 me-1.5"
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
                                    d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"
                                  />
                                </svg>
                                {activeTab === "admins" ? i.tlf : i.telefono}
                              </span>
                            </div>
                          </div>
                        </div>
                        <svg
                          data-accordion-icon
                          className={`w-4 h-4 transition-transform duration-150 shrink-0 ${
                            openAccordions[i.id] ? "rotate-0" : "rotate-180"
                          }`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5 5 1 1 5"
                          />
                        </svg>
                      </button>
                    </h2>
                    <div
                      className={`transition-all bg-blue-50 duration-200 overflow-hidden ${
                        openAccordions[i.id] ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="flex p-4 border-t dark:border-gray-700">
                        <div className="flex justify-end space-x-3">
                          <SecondaryButton
                            text="Ver perfil"
                            classes={"px-1"}
                            icon={
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
                            }
                            action={() => handleOpenModalInfoAdmin(i)}
                          />
                          <SecondaryDanger
                            action={() => handleOpenModalDelete(i)}
                            text="Eliminar"
                            icon={
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
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {/* Paginación */}
          {!loading && filteredList.length > 0 && (
            <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-700">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400"
                      : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {[...Array(totalFilteredPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md ${
                      currentPage === index + 1
                        ? "bg-chryslerblue text-white dark:text-babypowder dark:bg-vistablue"
                        : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalFilteredPages)
                    )
                  }
                  disabled={currentPage === totalFilteredPages}
                  className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                    currentPage === totalFilteredPages
                      ? "text-gray-400"
                      : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
          {/* Modal borrar cliente*/}
          <Modal
            open={modalDelete}
            onClose={() => setModalDelete(false)}
            title={
              <div className="flex">
                <Lottie
                  animationData={deleteAnimation}
                  style={{ height: 60 }}
                  loop={false}
                />
                <h2 className="my-4 text-2xl font-bold text-center">
                  Eliminar {activeTab === "admins" ? "admin" : "óptica"}:
                </h2>
              </div>
            }
            text={
              <div>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl font-semibold text-center text-redpantone dark:text-lightcoral">
                    {activeTab === "admins"
                      ? selectedName + " " + selectedSurname
                      : selectedName}
                  </span>
                </div>
                <div className="my-2">
                  <p>
                    ¿Está seguro de que desea borrar{" "}
                    {activeTab === "admins"
                      ? "este administrador"
                      : "esta óptica"}{" "}
                    ?
                  </p>
                  <p>
                    La información de este contacto se eliminará de la base de
                    datos y no podrá ser recuperada.
                  </p>
                </div>
              </div>
            }
            bottom={
              <div className="flex justify-end w-full">
                <DangerButton
                  action={
                    activeTab === "admins"
                      ? () => handleDeleteAdmin(selectedId)
                      : () => handleDeleteOptica(selectedId)
                  }
                  text="Eliminar"
                />
              </div>
            }
          />
          {/* Modal de información del cliente */}
          <Modal
            open={modalInfoAdmin}
            onClose={() => {
              setModalInfoAdmin(false);
              setErrorForm({});
              setErrorFormOptica({});
            }}
            title={
              <div className="flex">
                <Lottie
                  animationData={profileAnimation}
                  style={{ height: 60 }}
                  loop={false}
                />
                <h2 className="my-4 text-2xl font-bold text-center">
                  Datos {activeTab === "admins" ? "del admin" : "de la óptica"}
                </h2>
              </div>
            }
            text={
              loading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              ) : activeTab === "admins" ? (
                <form onSubmit={(e) => e.preventDefault()}>
                  <InputField
                    text="Nombre"
                    value={formData.name || ""}
                    error={errorForm.name}
                    onChange={(e) => setFormData({ ...formData, name: e })}
                  />
                  <InputField
                    text="Apellidos"
                    value={formData.surname || ""}
                    error={errorForm.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e })}
                  />
                  <InputField
                    text="Email"
                    value={formData.email || ""}
                    error={errorForm.email}
                    onChange={(e) => setFormData({ ...formData, email: e })}
                  />
                  <div className="flex space-x-3">
                    <InputField
                      text="DNI"
                      value={formData.dni || ""}
                      error={errorForm.dni}
                      onChange={(e) => setFormData({ ...formData, dni: e })}
                    />
                    <InputField
                      text="Teléfono"
                      value={formData.tlf || ""}
                      error={errorForm.tlf}
                      onChange={(e) => setFormData({ ...formData, tlf: e })}
                    />
                  </div>
                  {!formData.id && (
                    <InputField
                      text="Óptica"
                      type="select"
                      value={opticas.map((optica) => ({
                        value: optica.id,
                        display: optica.nombre,
                      }))}
                      defaultValue={formData.optica || ""}
                      placeholder="Selecciona una óptica"
                      error={errorForm.optica}
                      onChange={(e) => setFormData({ ...formData, optica: e })}
                    />
                  )}
                </form>
              ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                  <InputField
                    text="Nombre"
                    value={formDataOptica.nombre || ""}
                    error={errorFormOptica.nombre}
                    onChange={(e) =>
                      setFormDataOptica({ ...formDataOptica, nombre: e })
                    }
                  />
                  <InputField
                    text="Dirección"
                    value={formDataOptica.direccion || ""}
                    error={errorFormOptica.direccion}
                    onChange={(e) =>
                      setFormDataOptica({ ...formDataOptica, direccion: e })
                    }
                  />
                  <InputField
                    text="Teléfono"
                    value={formDataOptica.telefono || ""}
                    error={errorFormOptica.telefono}
                    onChange={(e) =>
                      setFormDataOptica({ ...formDataOptica, telefono: e })
                    }
                  />
                </form>
              )
            }
            classes="max-w-2xl"
            bottom={
              <div className="flex justify-end w-full">
                <PrimaryButton
                  text={
                    formData.id || formDataOptica.id ? "Actualizar" : "Crear"
                  }
                  action={
                    activeTab === "admins"
                      ? () => {
                          if (formData.id) {
                            handleUpdateAdmin(formData.id);
                          } else {
                            const newData = {
                              ...formData,
                              password: formData.name + formData.name,
                              optica_id: formData.optica,
                              role: "admin",
                            };

                            setFormData(newData);
                            handleAddAdmin(newData);
                          }
                        }
                      : () => {
                          if (formDataOptica.id) {
                            handleUpdateOptica(formDataOptica.id);
                            console.log("Updating optica:", formDataOptica);
                          } else {
                            handleAddOptica(formDataOptica);
                            console.log("Adding new optica:", formDataOptica);
                          }
                        }
                  }
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Administracion;
