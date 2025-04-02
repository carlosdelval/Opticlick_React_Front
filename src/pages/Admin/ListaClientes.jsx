import React from "react";
import {
  getClientes,
  deleteUser,
  updateUser,
  getOpticas,
  getClientesOptica,
} from "../../api";
import { HiInformationCircle } from "react-icons/hi";
import Lottie from "lottie-react";
import teamAnimation from "../../assets/clients.json";
import profileAnimation from "../../assets/profile.json";
import TransparentDanger from "../../components/TransparentButtonDanger";
import TransparentPrimary from "../../components/TransparentButtonPrimary";
import PrimaryButton from "../../components/PrimaryButton";
import DangerButton from "../../components/DangerButton";
import deleteAnimation from "../../assets/delete.json";
import { Modal, Alert } from "flowbite-react";
import InputField from "../../components/InputField";

function Dashboard() {
  const [clientes, setClientes] = React.useState([]);
  const [opticas, setOpticas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
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
  const [errorForm, setErrorForm] = React.useState({
    name: "",
    surname: "",
    dni: "",
    tlf: "",
    email: "",
  });
  const [formData, setFormData] = React.useState({
    id: "",
    name: "",
    surname: "",
    dni: "",
    tlf: "",
    email: "",
  });

  React.useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientes();
        setClientes(data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("No se pudieron cargar los clientes");
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    const fetchOpticas = async () => {
      try {
        const data = await getOpticas();
        setOpticas(data);
      } catch (err) {
        console.error("Error fetching opticas:", err);
        setError("No se pudieron cargar las ópticas");
      }
    };

    const fetchClientesOptica = async () => {
      try {
        setLoading(true);
        const data = await getClientesOptica(opticaSearch);
        setClientes(data);
        setTimeout(() => {
          setLoading(false);
        }, 250);
      } catch (err) {
        console.error("Error fetching clients by optica:", err);
        setError("No se pudieron cargar los clientes de esta óptica");
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    if (opticaSearch) {
      fetchClientesOptica();
    } else {
      fetchClientes();

      fetchOpticas();
    }
  }, [opticaSearch]);

  const handleDeleteCliente = async (id) => {
    try {
      await deleteUser(id);
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      setModalDelete(false);
      setSuccess("Cliente eliminado correctamente");
      setError(null);
    } catch (err) {
      console.error("Error deleting client:", err);
      setModalDelete(false);
      setError("No se pudo eliminar el cliente");
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
      await updateUser(formData);
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
    });
    setModalInfoCliente(true);
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
    <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex mb-4 space-x-3 text-start">
        <Lottie animationData={teamAnimation} style={{ height: 60 }} />
        <h2 className="my-2 text-4xl font-semibold">Todos tus clientes</h2>
      </div>

      {error && (
        <Alert
          icon={HiInformationCircle}
          className="mb-4 rounded-lg shadow-md bg-lightcoral"
          onDismiss={() => setError(null)}
        >
          <span className="font-medium">{error}</span>
        </Alert>
      )}
      {success && (
        <Alert
          className="mb-4 space-x-4 rounded-lg shadow-md bg-aquamarine"
          icon={HiInformationCircle}
          onDismiss={() => setSuccess(null)}
        >
          <span className="font-medium">{success}</span>
        </Alert>
      )}

      {/* Barrita de búsqueda */}
      <div className="flex mb-4 space-x-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="block p-4 pl-10 text-sm text-gray-900 bg-white border-2 border-black rounded-lg w-96 focus:bg-gray-50 focus:border-chryslerblue focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Buscar clientes por nombre, e-mail o dni..."
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="block p-4 text-sm text-gray-900 bg-white border-2 border-black rounded-lg w-96 focus:bg-gray-50 focus:border-chryslerblue focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
      </div>

      <div className="overflow-hidden bg-white border-2 border-black rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="text-xs font-medium tracking-wider text-left uppercase bg-chryslerblue text-babypowder">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading &&
                currentFilteredClientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {cliente.name} {cliente.surname}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {cliente.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {cliente.tlf}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        <TransparentPrimary
                          text={
                            <div className="flex space-x-2">
                              <span>Ver perfil</span>
                              <svg
                                className="w-4 h-4 mt-1"
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
                            </div>
                          }
                          action={() => handleOpenModalInfoCliente(cliente)}
                        />
                        <TransparentDanger
                          action={() => handleOpenModalDelete(cliente)}
                          text={
                            <svg
                              className="w-4 h-4 mt-1"
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
          {loading && (
            <output className="flex items-center justify-center w-full h-32 bg-white dark:bg-gray-800">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-chryslerblue"
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
              <span className="sr-only">Loading...</span>
            </output>
          )}
          {filteredClientes.length === 0 && !loading && (
            <p className="p-4 my-4 text-center">
              No hay clientes que coincidan con la búsqueda
            </p>
          )}
        </div>

        {/* Paginación */}
        {!loading && filteredClientes.length > 0 && (
          <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-800">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
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
                      ? "bg-chryslerblue text-white"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
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
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
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
          className="justify-center bg-gray-200 bg-opacity-50"
          size="md"
          show={modalDelete}
          onClose={() => setModalDelete(false)}
        >
          <div className="justify-center p-4 border-2 border-black rounded-md shadow-sm dark:border-gray-700">
            <Modal.Header>
              <div className="flex">
                <Lottie
                  animationData={deleteAnimation}
                  style={{ height: 60 }}
                />
                <h2 className="my-4 text-2xl font-bold text-center">
                  Eliminar cliente:
                </h2>
              </div>
            </Modal.Header>
            <Modal.Body className="justify-center p-4">
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
              <div className="flex justify-end">
                <DangerButton
                  action={() => handleDeleteCliente(selectedId)}
                  classes={"mt-6 "}
                  text="Eliminar"
                />
              </div>
            </Modal.Body>
          </div>
        </Modal>
        {/* Modal de información del cliente */}
        <Modal
          className="justify-center bg-gray-200 bg-opacity-50"
          size="md"
          show={modalInfoCliente}
          onClose={() => {
            setModalInfoCliente(false), setErrorForm({});
          }}
        >
          <div className="justify-center p-4 border-2 border-black rounded-md shadow-sm dark:border-gray-700">
            <Modal.Header>
              <div className="flex">
                <Lottie
                  animationData={profileAnimation}
                  style={{ height: 60 }}
                />
                <h2 className="my-4 text-2xl font-bold text-center">
                  Datos del cliente
                </h2>
              </div>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={(e) => e.preventDefault()}>
                <InputField
                  text={"Nombre"}
                  value={formData.name}
                  error={errorForm.name}
                  onChange={(e) => setFormData({ ...formData, name: e })}
                />
                <InputField
                  text={"Apellidos"}
                  value={formData.surname}
                  error={errorForm.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e })}
                />
                <InputField
                  text={"Email"}
                  value={formData.email}
                  error={errorForm.email}
                  onChange={(e) => setFormData({ ...formData, email: e })}
                />
                <InputField
                  text={"DNI"}
                  value={formData.dni}
                  error={errorForm.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e })}
                />
                <InputField
                  text={"Teléfono"}
                  value={formData.tlf}
                  error={errorForm.tlf}
                  onChange={(e) => setFormData({ ...formData, tlf: e })}
                />
                <div className="flex justify-end">
                  <PrimaryButton
                    classes="mt-6"
                    text="Actualizar"
                    action={() => handleUpdateCliente(formData.id)}
                  />
                </div>
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Dashboard;
