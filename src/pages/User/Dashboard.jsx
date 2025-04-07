import React, { useContext } from "react";
import { getCitasUser, deleteCita } from "../../api";
import Lottie from "lottie-react";
import calendarAnimation from "../../assets/calendar.json";
import callMissedAnimation from "../../assets/call-missed-red.json";
import DangerButton from "../../components/DangerButton";
import { Alert, Modal } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import AuthContext from "../../context/AuthContext";
import SecondaryDanger from "../../components/SecondaryDanger";
import { useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [citas, setCitas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [openModalAnular, setOpenModalAnular] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [openAccordions, setOpenAccordions] = React.useState({});

  React.useEffect(() => {
    const fetchCitas = async () => {
      if (!user) return;
      try {
        const data = await getCitasUser(user.id);
        setCitas(data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching citas:", err);
        setError("No se pudieron cargar las citas.");
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    if (location.state?.reload) {
      // Forzar recarga de datos
      fetchCitas();
      // Mostrar mensaje de éxito si existe
      if (location.state.success) {
        setSuccess(location.state.success);
      }
      // Limpiar el estado de navegación para evitar recargas múltiples
      window.history.replaceState({}, document.title);
    }
    fetchCitas();
  }, [user?.id, location.state]);
  
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

  //Gestionar apertura de acordeón
  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
            className="block w-full p-4 pl-10 text-sm text-gray-900 bg-white border-2 border-black rounded-lg focus:bg-blue-50 focus:border-chryslerblue focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Buscar cita por fecha u hora..."
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden border-2 border-black rounded-lg shadow-lg">
        <div className="overflow-x-auto bg-white dark:bg-gray-800">
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs font-bold tracking-wider text-left uppercase bg-chryslerblue text-babypowder dark:text-black dark:bg-vistablue">
                <tr>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Hora</th>
                  <th className="px-6 py-3">Óptica</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {!loading &&
                  currentFilteredCitas.map((cita) => {
                    const date = new Date(cita.fecha);
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    const formattedDate = `${day}/${month}/${year}`;

                    return (
                      <tr
                        key={cita.id}
                        className="transition-colors duration-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-left text-gray-900 dark:text-babypowder whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-200">
                            <span className="bg-blue-100 text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                              <svg
                                className="w-3.5 h-3.5 me-1.5"
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
                                  d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                                />
                              </svg>
                              {formattedDate}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-left text-gray-500 dark:text-gray-200 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-200">
                            <span className="bg-blue-100 text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                              <svg
                                className="w-2.5 h-2.5 me-1.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                              </svg>
                              {cita.hora ? cita.hora.substring(0, 5) : ""}
                              {"h"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-left text-gray-500 dark:text-gray-200 whitespace-nowrap">
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
                                d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                              />
                            </svg>
                            {cita.optica_nombre}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div className="flex justify-end space-x-2">
                            <SecondaryDanger
                              action={() => handleOpenModalAnular(cita.id)}
                              text="Anular cita"
                              classes={"px-5"}
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
                                    d="m17.0896 13.371 1.1431 1.1439c.1745.1461.3148.3287.4111.5349.0962.2063.1461.4312.1461.6588 0 .2276-.0499.4525-.1461.6587-.0963.2063-.4729.6251-.6473.7712-3.1173 3.1211-6.7739 1.706-9.90477-1.4254-3.13087-3.1313-4.54323-6.7896-1.41066-9.90139.62706-.61925 1.71351-1.14182 2.61843-.23626l1.1911 1.19193c1.1911 1.19194.3562 1.93533-.4926 2.80371-.92477.92481-.65643 1.72741 0 2.38391l1.8713 1.8725c.3159.3161.7443.4936 1.191.4936.4468 0 .8752-.1775 1.1911-.4936.8624-.8261 1.6952-1.6004 2.8382-.4565Zm-2.2152-4.39103 2.1348-2.13485m0 0 2.1597-1.90738m-2.1597 1.90738 2.1597 2.15076m-2.1597-2.15076-2.1348-1.90738"
                                  />
                                </svg>
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
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
          {filteredCitas.length === 0 && !loading && (
            <p className="p-4 my-4 text-center">
              No hay citas que coincidan con la búsqueda
            </p>
          )}
          {/* Versión de acordeón para dispositivos móviles */}
          <div
            className="md:hidden"
            id="accordion-color"
            data-accordion="collapse"
            data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white"
          >
            {!loading &&
              currentFilteredCitas.map((cita, index) => {
                const date = new Date(cita.fecha);

                const day = date.getDate();
                // Get day of the week
                const dayOfWeek = new Intl.DateTimeFormat("es-ES", {
                  weekday: "long",
                }).format(date);
                const capitalizedDayOfWeek =
                  dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

                // Get the month name in Spanish
                const month = date.toLocaleString("es-ES", {
                  month: "long",
                });
                const capitalizedMonth =
                  month.charAt(0).toUpperCase() + month.slice(1);
                const year = date.getFullYear();
                const formattedDate = `${capitalizedDayOfWeek}, ${day} de ${capitalizedMonth} de ${year}`;

                return (
                  <div
                    key={cita.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <h2 id={`accordion-color-heading-${index}`}>
                      <button
                        type="button"
                        className={`${
                          openAccordions[cita.id]
                            ? "bg-blue-50 dark:bg-gray-800"
                            : ""
                        } flex items-center justify-between w-full gap-3 p-5 font-medium text-gray-500 rtl:text-right dark:border-gray-700 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800`}
                        data-accordion-target={`#accordion-color-body-${index}`}
                        onClick={() => toggleAccordion(cita.id)}
                        aria-expanded={openAccordions[cita.id] || false}
                      >
                        <div className="space-y-4 text-left">
                          <div className="font-medium text-gray-900 dark:text-babypowder">
                            {formattedDate}
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-200">
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
                                    d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                                  />
                                </svg>
                                {cita.optica_nombre}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-200">
                              <span className="bg-blue-100 text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
                                <svg
                                  className="w-2.5 h-2.5 me-1.5"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                                </svg>
                                {cita.hora ? cita.hora.substring(0, 5) : ""}
                                {"h"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <svg
                          data-accordion-icon
                          className={`w-4 h-4 transition-transform duration-150 shrink-0 ${
                            openAccordions[cita.id] ? "rotate-180" : ""
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
                        openAccordions[cita.id] ? "max-h-96" : "max-h-0"
                      }`}
                      aria-hidden={!openAccordions[cita.id]}
                    >
                      <div className="flex p-4 border-t dark:border-gray-700">
                        <div className="flex justify-end space-x-2">
                          <SecondaryDanger
                            action={() => handleOpenModalAnular(cita.id)}
                            classes={"px-5"}
                            text="Anular cita"
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
                                  d="m17.0896 13.371 1.1431 1.1439c.1745.1461.3148.3287.4111.5349.0962.2063.1461.4312.1461.6588 0 .2276-.0499.4525-.1461.6587-.0963.2063-.4729.6251-.6473.7712-3.1173 3.1211-6.7739 1.706-9.90477-1.4254-3.13087-3.1313-4.54323-6.7896-1.41066-9.90139.62706-.61925 1.71351-1.14182 2.61843-.23626l1.1911 1.19193c1.1911 1.19194.3562 1.93533-.4926 2.80371-.92477.92481-.65643 1.72741 0 2.38391l1.8713 1.8725c.3159.3161.7443.4936 1.191.4936.4468 0 .8752-.1775 1.1911-.4936.8624-.8261 1.6952-1.6004 2.8382-.4565Zm-2.2152-4.39103 2.1348-2.13485m0 0 2.1597-1.90738m-2.1597 1.90738 2.1597 2.15076m-2.1597-2.15076-2.1348-1.90738"
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
                      : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
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
                        : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
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
                      : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
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
