import React, { useContext } from "react";
import { getCitasGraduadasUser, getGraduacion } from "../../api";
import Lottie from "lottie-react";
import activityAnimation from "../../assets/activity.json";
import fileAnimation from "../../assets/file.json";
import { Modal } from "flowbite-react";
import Alert from "../../components/Alert";
import AuthContext from "../../context/AuthContext";
import { saveAs } from "file-saver";
import Documentacion from "../../pdf/GeneradorPdf";
import ReactPDF from "@react-pdf/renderer";
import SecondaryButton from "../../components/SecondaryButton";

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

  // Filtrar las citas por fecha u hora
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

      const normalizedOptica = cita.optica_nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return (
        normalizedFecha.includes(normalizedSearchTerm) ||
        normalizedHora.includes(normalizedSearchTerm) ||
        normalizedOptica.includes(normalizedSearchTerm)
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
            placeholder="Buscar cita por fecha, hora u óptica..."
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
            className="justify-center py-20 bg-gray-200 bg-opacity-50"
            size="md"
            show={openModal}
            onClose={() => setOpenModal(false)}
          >
            <div className="justify-center p-4 border-2 border-black rounded-md shadow-sm dark:border-gray-700">
              <Modal.Header className="p-4">
                <div className="flex">
                  <Lottie
                    animationData={fileAnimation}
                    style={{ height: 60 }}
                    loop={false}
                  />
                  <h2 className="my-4 text-2xl font-bold text-center">
                    Graduación de cita:
                  </h2>
                </div>
              </Modal.Header>
              <Modal.Body className="justify-center p-4">
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
                <div className="flex justify-end">
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
              </Modal.Body>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Historial;
