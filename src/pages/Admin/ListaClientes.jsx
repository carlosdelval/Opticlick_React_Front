import React from "react";
import AuthContext from "../../context/AuthContext";
import UserContext from "../../context/UserContext";
import OpticasContext from "../../context/OpticasContext";
import Lottie from "lottie-react";
import teamAnimation from "../../assets/clients.json";
import profileAnimation from "../../assets/profile.json";
import SecondaryDanger from "../../components/SecondaryDanger";
import SecondaryButton from "../../components/SecondaryButton";
import PrimaryButton from "../../components/PrimaryButton";
import Spinner from "../../components/Spinner";
import DangerButton from "../../components/DangerButton";
import deleteAnimation from "../../assets/delete.json";
import { Popover } from "flowbite-react";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import InputField from "../../components/InputField";
import MenuButton from "../../components/MenuButton";
import SearchBar from "../../components/SearchBar";

function ListaClientes() {
  const { user } = React.useContext(AuthContext);
  const {
    clientes,
    setClientes,
    fetchClientes,
    fetchClientesOptica,
    eliminarCliente,
    eliminarClienteOptica,
    registrarCliente,
    actualizarCliente,
    loading,
    setLoading,
  } = React.useContext(UserContext);
  const { opticas, fetchOpticas, asignarOptica } =
    React.useContext(OpticasContext);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [modalDelete, setModalDelete] = React.useState(false);
  const [modalInfoCliente, setModalInfoCliente] = React.useState(false);
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
  });
  const [formData, setFormData] = React.useState(() => ({
    id: "",
    name: "",
    surname: "",
    dni: "",
    tlf: "",
    email: "",
    password: "",
    role: "user",
    optica: user?.role === "admin" ? user?.optica_id : "",
  }));

  const handleAddCliente = async (data) => {
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
      if (result.id && data.optica) {
        console.log(result.id, data.optica);
        await asignarOptica(result.id, data.optica);
      }
      fetchClientesOptica(opticaSearch);
      setSearchTerm("");
      setModalInfoCliente(false);
      setSuccess("Cliente registrado correctamente");
      setError(null);
      setLoading(false);
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
        setModalInfoCliente(false);
        setError("No se pudo registrar el cliente");
        setSuccess(null);
      }
    }
  };

  React.useEffect(() => {
    if (user.role === "admin") {
      setOpticaSearch(user.optica_id);
    }
    if (opticaSearch) {
      fetchClientesOptica(opticaSearch);
    } else {
      fetchClientes();
      fetchOpticas();
    }
  }, [opticaSearch]);

  // Eliminar cliente, si es master, eliminamos el cliente por completo, si somos admin, simplemente eliminamos
  // este cliente de nuestra óptica actual
  const handleDeleteCliente = async (id) => {
    if (user.role === "master") {
      try {
        await eliminarCliente(id);
        if (opticaSearch) {
          fetchClientesOptica(opticaSearch);
        } else {
          fetchClientes();
        }
        setModalDelete(false);
        setSuccess("Cliente eliminado correctamente");
        setError(null);
      } catch (err) {
        console.error("Error deleting client:", err);
        setModalDelete(false);
        setError("No se pudo eliminar el cliente");
        setSuccess(null);
      }
    } else {
      try {
        await eliminarClienteOptica(id, user.optica_id);
        setModalDelete(false);
        setSuccess("Cliente eliminado correctamente");
        setError(null);
      } catch (err) {
        console.error("Error deleting client:", err);
        setModalDelete(false);
        setError("No se pudo eliminar el cliente");
        setSuccess(null);
      }
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
    setErrorForm(newErrorForm);
    return isValid;
  };

  const handleUpdateCliente = async (id) => {
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
      });
      await actualizarCliente(formData);
      setClientes((prev) =>
        prev.map((cliente) => {
          if (cliente.id === id) {
            return {
              ...cliente,
              id: formData.id,
              name: formData.name,
              surname: formData.surname,
              dni: formData.dni,
              tlf: formData.tlf,
              email: formData.email,
            };
          }
          return cliente;
        })
      );
      setModalInfoCliente(false);
      setSuccess("Cliente actualizado correctamente");
      setError(null);
    } catch (err) {
      console.error("Error updating client:", err);
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
        setModalInfoCliente(false);
        setError("No se pudo actualizar el cliente");
        setSuccess(null);
      }
    }
  };

  const handleOpenModalDelete = (cliente) => {
    setSelectedName(cliente.name);
    setSelectedSurname(cliente.surname);
    setSelectedId(cliente.id);
    setModalDelete(true);
  };

  const handleOpenModalInfoCliente = (cliente) => {
    setFormData({
      id: cliente.id,
      name: cliente.name,
      surname: cliente.surname,
      dni: cliente.dni,
      tlf: cliente.tlf,
      email: cliente.email,
      role: "user",
      optica: opticaSearch,
    });
    setModalInfoCliente(true);
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
  const filteredClientes = React.useMemo(() => {
    return clientes.filter((cliente) => {
      const normalizedName = cliente.name
        .concat(" ", cliente.surname)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedDni = cliente.dni
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedEmail = cliente.email
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedSearchTerm = searchTerm
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return (
        normalizedName.includes(normalizedSearchTerm) ||
        normalizedDni.includes(normalizedSearchTerm) ||
        normalizedEmail.includes(normalizedSearchTerm)
      );
    });
  }, [clientes, searchTerm]);

  // Paginación de las citas filtradas
  const totalFilteredPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const currentFilteredClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="my-auto md:max-w-7xl md:mx-auto dark:text-babypowder">
      <div className="flex mb-4 space-x-3 text-start">
        <Lottie animationData={teamAnimation} style={{ height: 60 }} />
        <h2 className="my-2 text-4xl font-semibold dark:text-babypowder">Todos tus clientes</h2>
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

      {/* Barrita de búsqueda */}
      <div className="mb-2 space-y-2 md:mb-4 md:flex md:space-x-3 md:space-y-0">
        <div className="space-y-2 lg:flex lg:space-y-0 lg:space-x-3">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          className={`${
            user.role === "master" ? "md:w-1/2" : "md:w-2/3"
          } w-full`}
          placeholder="Buscar cliente por nombre, email o DNI"
        />
        {user.role === "master" && (
          <div className="relative">
            <select
              className="block w-full p-4 text-sm text-gray-900 bg-white border-2 border-black rounded-lg dark:bg-gray-700 md:w-96 focus:bg-blue-50 focus:border-chryslerblue dark:focus:border-chryslerblue focus:outline-none dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
        <div className="relative flex items-center justify-end w-full pt-2 md:pt-0">
          <MenuButton
            text="Nuevo cliente"
            icon={
              <svg
                className="w-5 h-5"
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
            action={() => {
              setFormData({
                id: "",
                name: "",
                surname: "",
                dni: "",
                tlf: "",
                email: "",
                password: "",
                role: "user",
              });
              setModalInfoCliente(true);
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden bg-white border-2 border-black rounded-lg shadow-lg dark:border-gray-400 dark:bg-gray-700">
        <div className="overflow-x-auto">
          <div className="hidden md:block">
            <table className="min-w-full bg-white divide-y divide-gray-200 dark:divide-gray-300">
              <thead className="text-xs font-medium tracking-wider text-left uppercase bg-chryslerblue dark:bg-gray-900 text-babypowder">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">DNI</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-300 dark:bg-gray-700 dark:text-babypowder">
                {!loading &&
                  currentFilteredClientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="transition-colors duration-300 ease-out hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        <Popover
                          arrow={false}
                          trigger="hover"
                          content={
                            <div className="flex flex-col items-start p-2 text-xs bg-blue-100 border rounded-lg shadow-md border-vistablue text-chryslerblue dark:bg-gray-800 dark:text-white dark:border-gray-700">
                              <div className="flex items-center space-x-2 dark:text-vistablue">
                                <svg
                                  className="w-4 h-4 "
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
                                  {cliente.tlf}
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
                            {cliente.name} {cliente.surname}
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
                          {cliente.email}
                        </span>
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
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z"
                            />
                          </svg>
                          {cliente.dni}
                        </span>
                      </td>
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
                            action={() => handleOpenModalInfoCliente(cliente)}
                          />
                          <SecondaryButton
                            text="Ver historial"
                            classes={"px-3"}
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
                                  d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                                />
                              </svg>
                            }
                            action={() =>
                              (window.location.href = `/historial/${cliente.id}`)
                            }
                          />
                          <SecondaryDanger
                            action={() => handleOpenModalDelete(cliente)}
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
          {filteredClientes.length === 0 && !loading && (
            <p className="p-4 my-4 text-center">
              No hay clientes que coincidan con la búsqueda
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
            currentFilteredClientes.map((cliente, index) => {
              return (
                <div
                  key={cliente.id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <h2 id={`accordion-color-heading-${index}`}>
                    <button
                      type="button"
                      className={`${
                        openAccordions[cliente.id]
                          ? "bg-blue-50 dark:bg-gray-800"
                          : ""
                      } flex items-center justify-between w-full gap-3 p-5 font-medium text-gray-500 rtl:text-right dark:border-gray-700 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800`}
                      data-accordion-target={`#accordion-color-body-${index}`}
                      onClick={() => toggleAccordion(cliente.id)}
                      aria-expanded={openAccordions[cliente.id] || false}
                    >
                      <div className="space-y-4 text-left">
                        <div className="font-medium text-gray-900 dark:text-babypowder">
                          {cliente.name} {cliente.surname}
                        </div>
                        <div className="flex flex-col space-y-2">
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
                            {cliente.email}
                          </span>
                          <div className="flex flex-row space-x-2">
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
                                  d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z"
                                />
                              </svg>
                              {cliente.dni}
                            </span>
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
                              {cliente.tlf}
                            </span>
                          </div>
                        </div>
                      </div>
                      <svg
                        data-accordion-icon
                        className={`w-4 h-4 transition-transform duration-150 shrink-0 ${
                          openAccordions[cliente.id] ? "rotate-180" : ""
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
                    className={`transition-all bg-blue-50 duration-200 overflow-hidden dark:bg-gray-800 ${
                      openAccordions[cliente.id] ? "max-h-96" : "max-h-0"
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
                          action={() => handleOpenModalInfoCliente(cliente)}
                        />
                        <SecondaryButton
                          text="Ver historial"
                          classes={"px-3"}
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
                                d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                              />
                            </svg>
                          }
                          action={() =>
                            (window.location.href = `/historial/${cliente.id}`)
                          }
                        />
                        <SecondaryDanger
                          action={() => handleOpenModalDelete(cliente)}
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
        {!loading && filteredClientes.length > 0 && (
          <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-700">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                Eliminar cliente
              </h2>
            </div>
          }
          text={
            <div>
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl font-semibold text-center text-redpantone">
                  {selectedName} {selectedSurname}
                </span>
              </div>
              <div className="my-2">
                <p>¿Está seguro de que desea borrar este cliente?</p>
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
                action={() => handleDeleteCliente(selectedId)}
                classes={"mt-6 "}
                text="Eliminar"
              />
            </div>
          }
        />
        {/* Modal de información del cliente */}
        <Modal
          open={modalInfoCliente}
          onClose={() => {
            setModalInfoCliente(false), setErrorForm({});
          }}
          title={
            <div className="flex">
              <Lottie
                animationData={profileAnimation}
                style={{ height: 60 }}
                loop={false}
              />
              <h2 className="my-4 text-2xl font-bold text-center">
                Datos del cliente
              </h2>
            </div>
          }
          text={
            loading ? (
              <Spinner />
            ) : (
              <div>
                <InputField
                  text={"Nombre"}
                  value={formData.name ? formData.name : ""}
                  error={errorForm.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e, password: e + e })
                  }
                />
                <InputField
                  text={"Apellidos"}
                  value={formData.surname ? formData.surname : ""}
                  error={errorForm.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e })}
                />
                <InputField
                  text={"Email"}
                  value={formData.email ? formData.email : ""}
                  error={errorForm.email}
                  onChange={(e) => setFormData({ ...formData, email: e })}
                />
                <div className="flex flex-col md:flex-row md:space-x-3">
                  <InputField
                    text={"DNI"}
                    value={formData.dni ? formData.dni : ""}
                    error={errorForm.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e })}
                  />
                  <InputField
                    text={"Teléfono"}
                    option
                    value={formData.tlf ? formData.tlf : ""}
                    error={errorForm.tlf}
                    onChange={(e) => setFormData({ ...formData, tlf: e })}
                  />
                </div>
                {user.role === "master" && formData.id === "" && (
                  <InputField
                    type="select"
                    placeholder={"Selecciona una óptica"}
                    value={
                      opticas.map((optica) => ({
                        value: optica.id,
                        display: optica.nombre,
                        disabled: false,
                      })) || []
                    }
                    defaultValue={formData.optica ? formData.optica : ""}
                    error={errorForm.optica}
                    onChange={(e) => setFormData({ ...formData, optica: e })}
                  />
                )}
              </div>
            )
          }
          bottom={
            <div className="flex justify-end w-full">
              <PrimaryButton
                classes="my-2"
                text={formData.id ? "Actualizar" : "Añadir"}
                action={() => {
                  if (formData.id) {
                    handleUpdateCliente(formData.id);
                  } else {
                    const newData = {
                      ...formData,
                      password: formData.name + formData.name,
                      optica: formData.optica || user?.optica_id || "",
                    };

                    setFormData(newData);
                    handleAddCliente(newData);
                  }
                }}
              />
            </div>
          }
        />
      </div>
    </div>
  );
}

export default ListaClientes;
