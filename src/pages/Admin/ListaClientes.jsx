import React from "react";
import { getClientes, deleteUser, updateUser } from "../../api";
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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [modalDelete, setModalDelete] = React.useState(false);
  const [modalInfoCliente, setModalInfoCliente] = React.useState(false);
  const [selectedName, setSelectedName] = React.useState("");
  const [selectedSurname, setSelectedSurname] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(null);
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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("No se pudieron cargar los clientes");
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

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

  const handleUpdateCliente = async (id) => {
    try {
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
      setModalInfoCliente(false);
      setError("No se pudo actualizar el cliente");
      setSuccess(null);
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

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;
  const [searchTerm, setSearchTerm] = React.useState("");

  // Resetear a la primera página cuando el término de búsqueda cambie
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtrar las citas por cliente o fecha
  const filteredCitas = React.useMemo(() => {
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
  const totalFilteredPages = Math.ceil(filteredCitas.length / itemsPerPage);
  const currentFilteredClientes = filteredCitas.slice(
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
      <div className="mb-4">
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
            className="block w-full p-4 pl-10 text-sm text-gray-900 bg-white border-2 border-black rounded-lg focus:bg-gray-50 focus:border-chryslerblue focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Buscar clientes por nombre, e-mail o dni..."
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!loading && (
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
                {currentFilteredClientes.map((cliente) => (
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
            {loading && <p className="text-center">Cargando citas...</p>}
            {filteredCitas.length === 0 && !loading && (
              <p className="p-4 my-4 text-center">
                No hay clientes que coincidan con la búsqueda
              </p>
            )}
          </div>

          {/* Paginación */}
          {!loading && filteredCitas.length > 0 && (
            <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-800">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                    {selectedName}{" "}
                    {selectedSurname}
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
            onClose={() => setModalInfoCliente(false)}
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
                      onChange={(e) => setFormData({ ...formData, name: e })}
                    />
                    <InputField
                      text={"Apellidos"}
                      value={formData.surname}
                      onChange={(e) => setFormData({ ...formData, surname: e })}
                    />
                    <InputField
                      text={"Email"}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e })}
                    />
                    <InputField
                      text={"DNI"}
                      value={formData.dni}
                      onChange={(e) => setFormData({ ...formData, dni: e })}
                    />
                    <InputField
                      text={"Teléfono"}
                      value={formData.tlf}
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
      )}
    </div>
  );
}

export default Dashboard;
