import React, { useContext } from "react";
import {
  getCitasGraduadasUser,
  getGraduacion,
  getCliente,
  updateGraduacion,
  deleteGraduacion,
  deleteCita,
} from "../../api";
import deleteAnimation from "../../assets/delete.json";
import Lottie from "lottie-react";
import activityAnimation from "../../assets/activity.json";
import fileAnimation from "../../assets/file.json";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import AuthContext from "../../context/AuthContext";
import { saveAs } from "file-saver";
import Documentacion from "../../pdf/GeneradorPdf";
import ReactPDF from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import DangerButton from "../../components/DangerButton";
import Spinner from "../../components/Spinner";
import InputField from "../../components/InputField";
import SecondaryButton from "../../components/SecondaryButton";
import SecondaryDanger from "../../components/SecondaryDanger";
import SearchBar from "../../components/SearchBar";

const HistorialCliente = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [cliente, setCliente] = React.useState(null);
  const [citas, setCitas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [openAccordions, setOpenAccordions] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const [modalDelete, setModalDelete] = React.useState(false);
  const [graduacion, setGraduacion] = React.useState([
    {
      eje: "",
      esfera: "",
      cilindro: "",
    },
  ]);
  const [selectedFecha, setSelectedFecha] = React.useState(null);
  const [selectedHora, setSelectedHora] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(null);

  React.useEffect(() => {
    if (!user || !id) return;

    const fetchData = async () => {
      try {
        // Primero obtener el cliente
        const clienteData = await getCliente(id);
        setCliente(clienteData);

        // Luego obtener las citas usando el ID del cliente recién obtenido
        const citasData = await getCitasGraduadasUser(id);
        setCitas(citasData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, id]);

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
    // Obtener id, la fecha y hora de la cita seleccionada
    setSelectedId(id);
    setSelectedFecha(fecha);
    setSelectedHora(hora);
    setOpenModal(true);
  };

  const handleDeleteGraduacion = async (id) => {
    try {
      await deleteGraduacion(id);
      await deleteCita(id);
      setCitas((prev) => prev.filter((cita) => cita.id !== id));
      setSuccess("Graduación eliminada con éxito");
      setError(null);
      setModalDelete(false);
    } catch (err) {
      console.error("Error deleting graduacion:", err);
      setError("No se pudo eliminar la graduación.");
      setSuccess(null);
      setModalDelete(false);
    }
  };

  const handleUpdateGraduacion = async (id, graduacion) => {
    try {
      await updateGraduacion(id, graduacion);
      setSuccess("Graduación actualizada con éxito");
      setError(null);
      setOpenModal(false);
    } catch (err) {
      console.error("Error updating graduacion:", err);
      setError("No se pudo actualizar la graduación.");
      setSuccess(null);
      setOpenModal(false);
    }
  };

  const handleOpenModalDelete = (id, fecha, hora) => {
    setSelectedFecha(fecha);
    setSelectedHora(hora);
    setSelectedId(id);
    setModalDelete(true);
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
  const handleDownloadPDF = async (graduacion, fecha, hora) => {
    setLoading(true);
    const docProps = {
      nombre: cliente?.name + " " + cliente?.surname || "Cliente",
      graduacion: graduacion,
      fecha: fecha,
      hora: hora,
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
    <div className="my-auto md:max-w-7xl md:mx-auto dark:text-babypowder">
      <div className="flex flex-col items-center text-center mb-4 space-y-3 md:flex-row md:items-start md:space-x-3 md:text-left">
            <Lottie
              animationData={activityAnimation}
              className="h-32 md:h-16"
              loop={false}
            />
            <h2 className="text-2xl md:text-4xl font-semibold dark:text-babypowder">
              Historial de graduaciones de {cliente?.name}{" "}{cliente?.surname}
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
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar por fecha, hora u óptica"
        />
      </div>

      <div className="overflow-hidden border-2 border-black rounded-lg shadow-lg dark:border-gray-400">
        <div className="overflow-x-auto bg-white dark:bg-gray-700">
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-300">
              <thead className="text-xs font-bold tracking-wider text-left uppercase bg-chryslerblue text-babypowder dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Hora</th>
                  <th className="px-6 py-3">Óptica</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-300">
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
                        className="transition-colors ease-out hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-left text-gray-900 dark:text-babypowder whitespace-nowrap">
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
                              text="Ver graduación"
                              classes={"px-4"}
                              icon={
                                <svg
                                  className="h-6"
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
                            <SecondaryDanger
                              action={() =>
                                handleOpenModalDelete(
                                  cita.id,
                                  formattedDate,
                                  cita.hora.substring(0, 5)
                                )
                              }
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
                    className="border-b border-gray-200 dark:border-gray-300"
                  >
                    <h2 id={`accordion-color-heading-${index}`}>
                      <button
                        type="button"
                        className={`${
                          openAccordions[cita.id]
                            ? "bg-blue-50 dark:bg-gray-800"
                            : ""
                        } flex items-center justify-between w-full gap-3 p-5 font-medium text-gray-500 rtl:text-right dark:border-gray-700 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 ease-out transition-colors duration-300`}
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
                            openAccordions[cita.id] ? "rotate-0" : "rotate-180"
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
                      className={`transition-all bg-blue-50 dark:bg-gray-800 duration-200 overflow-hidden ${
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
                            text="Ver graduación"
                            classes={"px-4"}
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
                          <SecondaryDanger
                            action={() =>
                              handleOpenModalDelete(
                                cita.id,
                                formattedDate,
                                cita.hora.substring(0, 5)
                              )
                            }
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
          {/* Modal borrar graduacion*/}
          <Modal
            open={modalDelete}
            onClose={() => setModalDelete(false)}
            text={
              <div className="flex flex-col items-center justify-center p-4">
                <h2 className="mb-4 text-lg text-center text-gray-500 dark:text-gray-400">
                  ¿Estás seguro de que deseas eliminar la graduación?
                </h2>
                <p className="text-sm font-semibold">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            }
            title={
              <div className="flex space-x-2">
                <Lottie
                  animationData={deleteAnimation}
                  style={{ height: 60 }}
                  loop={false}
                />
                <h2 className="my-4 text-2xl font-bold text-center">
                  Eliminar graduación:
                </h2>
              </div>
            }
            bottom={
              <div className="flex flex-row justify-end w-full space-x-2">
                <DangerButton
                  action={() => handleDeleteGraduacion(selectedId)}
                  text="Eliminar"
                  classes={"px-4"}
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
            }
          />
          {/* Modal graduacion */}
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            title={
              <div className="flex">
                <Lottie
                  animationData={fileAnimation}
                  style={{ height: 60 }}
                  loop={false}
                  hover={true}
                />
                <h2 className="my-4 text-2xl font-bold text-center">
                  Graduación de cita:
                </h2>
              </div>
            }
            text={
              <form onSubmit={(e) => e.preventDefault()}>
                <InputField
                  type="number"
                  text="Eje"
                  name="eje"
                  value={graduacion.eje}
                  onChange={(e) =>
                    setGraduacion({
                      ...graduacion,
                      eje: e,
                    })
                  }
                />

                <InputField
                  type="number"
                  name="cilindro"
                  text="Cilindro"
                  value={graduacion.cilindro}
                  onChange={(e) =>
                    setGraduacion({
                      ...graduacion,
                      cilindro: e,
                    })
                  }
                />
                <InputField
                  type="number"
                  text="Esfera"
                  name="esfera"
                  value={graduacion.esfera}
                  onChange={(e) =>
                    setGraduacion({
                      ...graduacion,
                      esfera: e,
                    })
                  }
                />
              </form>
            }
            bottom={
              <div className="flex flex-row justify-end w-full space-x-2">
                <SecondaryButton
                  action={() => handleUpdateGraduacion(selectedId, graduacion)}
                  text="Actualizar"
                  classes={"px-4"}
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
                        strokeWidth="2"
                        d="M11 16h2m6.707-9.293-2.414-2.414A1 1 0 0 0 16.586 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.414a1 1 0 0 0-.293-.707ZM16 20v-6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6h8ZM9 4h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Z"
                      />
                    </svg>
                  }
                />
                <SecondaryButton
                  action={() =>
                    handleDownloadPDF(graduacion, selectedFecha, selectedHora)
                  }
                  classes={"px-4"}
                  text={loading ? <Spinner /> : "Descargar"}
                  icon={
                    loading ? (
                      <Spinner />
                    ) : (
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
                    )
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

export default HistorialCliente;
