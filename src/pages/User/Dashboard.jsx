import React, { useContext } from "react";
import { getCitasUser, deleteCita } from "../../api";
import Lottie from "lottie-react";
import calendarAnimation from "../../assets/calendar.json";
import callMissedAnimation from "../../assets/call-missed-red.json";
import TransparentDanger from "../../components/TransparentButtonDanger";
import TransparentPrimary from "../../components/TransparentButtonPrimary";
import DangerButton from "../../components/DangerButton";
import { Alert, Modal } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import AuthContext from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [openModalAnular, setOpenModalAnular] = React.useState(false);
  const [id, setId] = React.useState(null);

  React.useEffect(() => {
    const fetchCitas = async () => {
      if (!user) return;
      try {
        const data = await getCitasUser(user.id);
        setCitas(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching citas:", err);
        setError("No se pudieron cargar las citas.");
        setLoading(false);
      }
    };
    fetchCitas();
  }, [user?.id]);
  const handleOpenModalAnular = (id) => {
    setOpenModalAnular(true);
    setId(id);
  };
  const handleDeleteCita = async (id) => {
    try {
      await deleteCita(id);
      setCitas(citas.filter((cita) => cita.id !== id));
      setOpenModalAnular(false);
      setSuccess("Cita anulada correctamente.");
      setError(null);
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("No se pudo anular la cita.");
      setSuccess(null);
      setOpenModalAnular(false);
    }
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
    return citas.filter((cita) => {
      const normalizedHora = cita.hora
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedSearchTerm = searchTerm
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const normalizedFecha = new Date(cita.fecha)
        .toLocaleDateString("es-ES")
        .replace(/\//g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return (
        normalizedFecha.includes(normalizedSearchTerm) ||
        normalizedHora.includes(normalizedSearchTerm)
      );
    });
  }, [citas, searchTerm]);

  // Paginación de las citas filtradas
  const totalFilteredPages = Math.ceil(filteredCitas.length / itemsPerPage);
  const currentFilteredCitas = filteredCitas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex mb-4 space-x-3 text-start">
        <Lottie animationData={calendarAnimation} style={{ height: 60 }} />
        <h2 className="mt-4 text-4xl font-semibold dark:text-babypowder">
          Tus próximas citas, {user?.name}
        </h2>
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
          className="mb-4 rounded-lg shadow-md bg-aquamarine"
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
            placeholder="Buscar cita por fecha u hora..."
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden border-2 border-black rounded-lg shadow-lg">
        <div className="overflow-x-auto bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-xs font-bold tracking-wider text-left uppercase bg-chryslerblue text-babypowder dark:text-black dark:bg-vistablue">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Hora</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {currentFilteredCitas.map((cita) => {
                const date = new Date(cita.fecha);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;

                return (
                  <tr
                    key={cita.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-left text-gray-900 dark:text-babypowder whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-left text-gray-500 dark:text-gray-200 whitespace-nowrap">
                      {cita.hora ? cita.hora.substring(0, 5) : ""}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        <TransparentDanger
                          action={() => handleOpenModalAnular(cita.id)}
                          text={
                            <div className="flex space-x-2">
                              <span>Anular</span>
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
                                  d="m17.0896 13.371 1.1431 1.1439c.1745.1461.3148.3287.4111.5349.0962.2063.1461.4312.1461.6588 0 .2276-.0499.4525-.1461.6587-.0963.2063-.4729.6251-.6473.7712-3.1173 3.1211-6.7739 1.706-9.90477-1.4254-3.13087-3.1313-4.54323-6.7896-1.41066-9.90139.62706-.61925 1.71351-1.14182 2.61843-.23626l1.1911 1.19193c1.1911 1.19194.3562 1.93533-.4926 2.80371-.92477.92481-.65643 1.72741 0 2.38391l1.8713 1.8725c.3159.3161.7443.4936 1.191.4936.4468 0 .8752-.1775 1.1911-.4936.8624-.8261 1.6952-1.6004 2.8382-.4565Zm-2.2152-4.39103 2.1348-2.13485m0 0 2.1597-1.90738m-2.1597 1.90738 2.1597 2.15076m-2.1597-2.15076-2.1348-1.90738"
                                />
                              </svg>
                            </div>
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && <p className="text-center">Cargando citas...</p>}
          {filteredCitas.length === 0 && !loading && (
            <p className="p-4 my-4 text-center">
              No hay citas que coincidan con la búsqueda
            </p>
          )}

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
          {/* Modal anular cita*/}
          <Modal
            className="justify-center bg-gray-200 bg-opacity-50"
            size="md"
            show={openModalAnular}
            onClose={() => setOpenModalAnular(false)}
          >
            <div className="justify-center p-4 border-2 border-black rounded-md shadow-sm dark:border-gray-700">
              <Modal.Header className="p-4">
                <div className="flex">
                  <Lottie
                    animationData={callMissedAnimation}
                    style={{ height: 60 }}
                  />
                  <h2 className="my-4 text-2xl font-bold text-center">
                    Anular esta cita
                  </h2>
                </div>
              </Modal.Header>
              <Modal.Body className="justify-center p-4">
                <div className="my-2">
                  <p>¿Está seguro de que desea anular esta cita?</p>
                  <p>La óptica será notificada.</p>
                </div>
                <div className="flex justify-end">
                  <DangerButton
                    action={() => handleDeleteCita(id)}
                    classes={"mt-4 "}
                    text="Anular"
                  />
                </div>
              </Modal.Body>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
