import React, { useContext } from "react";
import { getCitasGraduadasUser, getGraduacion } from "../../api";
import Lottie from "lottie-react";
import activityAnimation from "../../assets/activity.json";
import fileAnimation from "../../assets/file.json";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import AuthContext from "../../context/AuthContext";
import { saveAs } from "file-saver";
import Documentacion from "../../pdf/GeneradorPdf";
import ReactPDF from "@react-pdf/renderer";
import SecondaryButton from "../../components/SecondaryButton";
import Spinner from "../../components/Spinner";

const Historial = () => {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [openAccordions, setOpenAccordions] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const [graduacion, setGraduacion] = React.useState([
    {
      eje: "",
      esfera: "",
      cilindro: "",
    },
  ]);
  const [selectedFecha, setSelectedFecha] = React.useState(null);
  const [selectedHora, setSelectedHora] = React.useState(null);

  React.useEffect(() => {
    const fetchCitas = async () => {
      if (!user) return;
      try {
        const data = await getCitasGraduadasUser(user.id);
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
    fetchCitas();
  }, [user?.id]);

  const handleOpenModal = (id, fecha, hora) => {
    const fetchGraduacion = async () => {
      try {
        const data = await getGraduacion(id);
        setGraduacion(data);
      } catch (err) {
        console.error("Error fetching graduacion:", err);
        setError("No se pudo cargar la graduación.");
      }
      setLoading(false);
    };
    fetchGraduacion();
    // Obtener la fecha y hora de la cita seleccionada
    setSelectedFecha(fecha);
    setSelectedHora(hora);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //Gestionar apertura de acordeón
  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle para descarga de PDF
  const handleDownloadPDF = async () => {
    setLoading(true);
    const docProps = {
      nombre: user?.name + " " + user?.surname || "Cliente",
      graduacion: graduacion,
      fecha: selectedFecha,
      hora: selectedHora,
    };
    // Generar PDF de forma asíncrona
    const pdfDoc = <Documentacion {...docProps} />;

    // Crear blob y abrir en nueva pestaña
    const blob = await ReactPDF.pdf(pdfDoc).toBlob();
    const pdfUrl = URL.createObjectURL(blob);

    // Solución alternativa para navegadores que bloquean popups
    const newWindow = window.open();
    if (newWindow) {
      newWindow.location.href = pdfUrl;
    } else {
      // Descarga directa si no se puede abrir ventana
      saveAs(blob, `graduacion_${docProps.nombre.replace(/\s+/g, "_")}.pdf`);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;
  const [searchTerm, setSearchTerm] = React.useState("");

  // Resetear a la primera página cuando el término de búsqueda cambie
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtrar las graduaciones por fecha u hora
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

      // Convert date to d/m/yyyy format for simple searching
      const dateParts = normalizedFecha.split("-");
      const day = dateParts[0].replace(/^0+/, ""); // Elimina ceros a la izquierda
      const month = dateParts[1].replace(/^0+/, ""); // Elimina ceros a la izquierda
      const year = dateParts[2]; // Mantiene el año completo
      const normalizedFormattedDate = `${day}/${month}/${year}`.toLowerCase();

      // Get day and month names in Spanish
      const dayName = new Date(cita.fecha)
        .toLocaleDateString("es-ES", { weekday: "long" })
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const monthName = new Date(cita.fecha)
        .toLocaleDateString("es-ES", { month: "long" })
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedOptica = cita.optica_nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return (
        normalizedHora.includes(normalizedSearchTerm) ||
        normalizedFormattedDate.includes(normalizedSearchTerm) ||
        normalizedOptica.includes(normalizedSearchTerm) ||
        normalizedFecha.includes(normalizedSearchTerm) ||
        normalizedSearchTerm.startsWith(dayName) ||
        normalizedSearchTerm.startsWith(monthName)
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
    <div className="my-auto md:max-w-7xl md:mx-auto">
      <div className="flex mb-4 space-x-3 text-start">
        <Lottie animationData={activityAnimation} style={{ height: 80 }} />
        <h2 className="mt-4 text-4xl font-semibold dark:text-babypowder">
          Tu historial de graduaciones, {user?.name}
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
            placeholder="Buscar graduación por fecha, hora u óptica..."
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
                            <SecondaryButton
                              action={() =>
                                handleOpenModal(
                                  cita.id,
                                  formattedDate,
                                  cita.hora.substring(0, 5)
                                )
                              }
                              classes={"px-5"}
                              text="Ver graduación"
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
                                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
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
          {/* Loader */}
          {loading && <Spinner />}
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
                // Obtener el día de la semana
                const dayOfWeek = new Intl.DateTimeFormat("es-ES", {
                  weekday: "long",
                }).format(date);
                const capitalizedDayOfWeek =
                  dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

                // Obtener el mes
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
                          <SecondaryButton
                            action={() =>
                              handleOpenModal(
                                cita.id,
                                formattedDate,
                                cita.hora.substring(0, 5)
                              )
                            }
                            classes={"px-7"}
                            text="Ver graduación"
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
                                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
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
          <Modal
            onClose={handleCloseModal}
            open={openModal}
            title={
              <div className="flex space-x-2">
                <Lottie
                  animationData={fileAnimation}
                  style={{ height: 60 }}
                  loop={false}
                />
                <h2 className="my-4 text-2xl font-bold text-center">
                  Graduación de la cita:
                </h2>
              </div>
            }
            text={
              <div>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl font-semibold text-center">
                    Día{" "}
                    <span className="text-chryslerblue">{selectedFecha}</span> a
                    las{" "}
                    <span className="text-chryslerblue">{selectedHora}</span>
                  </span>
                </div>
                <div className="my-6 overflow-x-auto rounded-lg shadow-md">
                  <table className="min-w-full border-2 border-black divide-y divide-gray-200">
                    <thead className="text-xs font-medium tracking-wider text-left uppercase bg-chryslerblue text-babypowder">
                      <tr>
                        <th className="px-6 py-3">Eje</th>
                        <th className="px-6 py-3">Cilindro</th>
                        <th className="px-6 py-3">Esfera</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 ">
                      <tr>
                        <td className="px-6 py-4 text-sm font-bold whitespace-nowrap">
                          {graduacion.eje}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold whitespace-nowrap">
                          {graduacion.cilindro}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold whitespace-nowrap">
                          {graduacion.esfera}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            }
            bottom={
              <div className="flex w-full justify-end">
                <SecondaryButton
                  action={handleDownloadPDF}
                  classes={"mt-4 px-6"}
                  text="Descargar PDF"
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
                        d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"
                      />
                    </svg>
                  }
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Historial;
