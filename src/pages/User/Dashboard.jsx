import React, { useContext } from "react";
import {
  getCitasUser,
  deleteCita,
  getNotificaciones,
  setNotificacionLeida,
} from "../../api";
import Lottie from "lottie-react";
import calendarAnimation from "../../assets/calendar.json";
import callMissedAnimation from "../../assets/call-missed-red.json";
import notificacionAnimation from "../../assets/notification.json";
import mensajeAnimation from "../../assets/chat.json";
import DangerButton from "../../components/DangerButton";
import { Modal } from "flowbite-react";
import AuthContext from "../../context/AuthContext";
import SecondaryDanger from "../../components/SecondaryDanger";
import SecondaryButton from "../../components/SecondaryButton";
import Spinner from "../../components/Spinner";
import { useLocation } from "react-router-dom";
import Alert from "../../components/Alert";
import ModalReserva from "./ModalReserva";
import MenuButton from "../../components/MenuButton";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [citas, setCitas] = React.useState([]);
  const [notificaciones, setNotificaciones] = React.useState([]);
  const [mensajes, setMensajes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [successMessage] = React.useState(null);
  const [errorNotification, setErrorNotification] = React.useState(null);
  const [successNotification] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [openModalAnular, setOpenModalAnular] = React.useState(false);
  const [openModalReserva, setOpenModalReserva] = React.useState(false);
  const modalRef = React.useRef(null);
  const [id, setId] = React.useState(null);
  const [openAccordions, setOpenAccordions] = React.useState({});

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

  const fetchNotificaciones = async () => {
    if (!user) return;
    try {
      const data = await getNotificaciones(user.id, 2);
      setNotificaciones(data);
    } catch (err) {
      console.error("Error fetching notificaciones:", err);
      setErrorNotification("No se pudieron cargar las notificaciones.");
    }
  };

  const fetchMensajes = async () => {
    if (!user) return;
    try {
      const data = await getNotificaciones(user.id, 1);
      setMensajes(data);
    } catch (err) {
      console.error("Error fetching mensajes:", err);
      setErrorMessage("No se pudieron cargar los mensajes.");
    }
  };

  const leerNotificacion = async (id) => {
    if (!user) return;
    try {
      await setNotificacionLeida(id);
      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.filter((notificacion) => notificacion.id !== id)
      );
    } catch (err) {
      console.error("Error setting notificacion leida:", err);
      setErrorNotification("No se pudo marcar la notificación como leída.");
    }
  };

  React.useEffect(() => {
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
    fetchNotificaciones();
    fetchMensajes();
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

  // Paginación de las citas filtradas
  const [currentPageCita, setCurrentPageCita] = React.useState(1);
  const itemsPerPage = 6;
  const totalFilteredPages = Math.ceil(citas.length / itemsPerPage);
  const currentFilteredCitas = citas.slice(
    (currentPageCita - 1) * itemsPerPage,
    currentPageCita * itemsPerPage
  );

  // Paginación de las notificaciones filtradas
  const [currentPageNotis, setCurrentPageNotis] = React.useState(1);
  const totalFilteredPagesNotis = Math.ceil(
    notificaciones.length / itemsPerPage
  );
  const currentFilteredNotis = notificaciones.slice(
    (currentPageNotis - 1) * itemsPerPage,
    currentPageNotis * itemsPerPage
  );

  // Paginación de los mensajes filtrados
  const [currentPageMessage, setCurrentPageMessage] = React.useState(1);
  const totalFilteredPagesMessage = Math.ceil(mensajes.length / itemsPerPage);
  const currentFilteredMessage = mensajes.slice(
    (currentPageMessage - 1) * itemsPerPage,
    currentPageMessage * itemsPerPage
  );

  //Gestionar apertura de acordeón
  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Gestionar cierre de modal al clickar fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenModalReserva(false);
      }
    };

    if (openModalReserva) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModalReserva]);

  return (
    <div className="my-auto md:max-w-7xl md:mx-auto">
      <div className="flex flex-col justify-between w-full md:flex-row">
        {/* Contenedor de citas */}
        <div className="overflow-hidden md:w-1/2">
          <div className="flex mb-4 space-x-3 text-start">
            <Lottie
              animationData={calendarAnimation}
              className="h-28 md:h-16"
            />
            <h2 className="mt-4 text-4xl font-semibold dark:text-babypowder">
              Tus próximas citas, {user?.name}
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
          <div className="relative flex items-center justify-center w-full pb-4">
            <MenuButton
              text="Reservar cita"
              classes={"w-full"}
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
                    d="m11.5 11.5 2.071 1.994M4 10h5m11 0h-1.5M12 7V4M7 7V4m10 3V4m-7 13H8v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L10 17Zm-5 3h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                  />
                </svg>
              }
              action={() => setOpenModalReserva(true)}
            />
          </div>
          <div className="overflow-x-auto bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-800">
            {loading && <Spinner />}
            {citas.length === 0 && !loading && (
              <div className="flex items-center justify-center w-full h-32 bg-white dark:bg-gray-800">
                <Lottie
                  animationData={calendarAnimation}
                  style={{ height: 60 }}
                  loop={false}
                  className="mx-auto my-4"
                />
                <p className="p-4 my-4 text-center">
                  ¡No tienes citas programadas!
                </p>
              </div>
            )}
            {/* Acordeón de citas */}
            <div
              className="accordion"
              id="accordion-color"
              data-accordion="collapse"
              data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white"
            >
              {!loading &&
                currentFilteredCitas.map((cita, index) => {
                  const date = new Date(cita.fecha);

                  const day = date.getDate();
                  // Día de la semana
                  const dayOfWeek = new Intl.DateTimeFormat("es-ES", {
                    weekday: "long",
                  }).format(date);
                  const capitalizedDayOfWeek =
                    dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

                  // Nombre del mes
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
                          } flex items-center justify-between w-full gap-3 p-5 font-medium text-gray-500 rtl:text-right dark:border-gray-700 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 duration-300 ease-out`}
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
                        <div className="flex justify-end p-4 border-t dark:border-gray-700">
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
                  );
                })}
            </div>
            {/* Paginación */}
            {!loading && citas.length > 0 && (
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-800">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPageCita((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPageCita === 1}
                    className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                      currentPageCita === 1
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
                      onClick={() => setCurrentPageCita(index + 1)}
                      className={`inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md ${
                        currentPageCita === index + 1
                          ? "bg-chryslerblue text-white"
                          : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPageCita((prev) =>
                        Math.min(prev + 1, totalFilteredPages)
                      )
                    }
                    disabled={currentPageCita === totalFilteredPages}
                    className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                      currentPageCita === totalFilteredPages
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
              className="justify-center bg-gray-200 bg-opacity-50 py-96"
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
                      loop={false}
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
        {/* Contenedor derecho */}
        <div className="flex-col hidden w-1/3 space-y-20 md:flex">
          {/* Contenedor de notificaciones */}
          <div>
            <div className="flex justify-end mb-4 space-x-3">
              <Lottie
                animationData={notificacionAnimation}
                loop={false}
                className="h-16"
              />
              <h2 className="mt-4 text-4xl font-semibold dark:text-babypowder">
                Tus novedades
              </h2>
            </div>
            {error && (
              <Alert
                onDismiss={() => setError(null)}
                text={errorNotification}
                type="error"
              />
            )}
            {success && (
              <Alert
                onDismiss={() => setSuccess(null)}
                text={successNotification}
                type="success"
              />
            )}
            <div className="overflow-x-auto bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center w-full bg-white dark:bg-gray-800">
                {loading && <Spinner />}
                {notificaciones &&
                  !loading &&
                  notificaciones.length > 0 &&
                  currentFilteredNotis.map((notificacion) => (
                    <div
                      key={notificacion.id}
                      className="flex items-center justify-between w-full p-4 space-x-2 duration-300 ease-out border-b dark:border-gray-700 hover:bg-blue-50"
                    >
                      <div className="flex-col items-center w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-8 h-8"
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
                              d="m10.827 5.465-.435-2.324m.435 2.324a5.338 5.338 0 0 1 6.033 4.333l.331 1.769c.44 2.345 2.383 2.588 2.6 3.761.11.586.22 1.171-.31 1.271l-12.7 2.377c-.529.099-.639-.488-.749-1.074C5.813 16.73 7.538 15.8 7.1 13.455c-.219-1.169.218 1.162-.33-1.769a5.338 5.338 0 0 1 4.058-6.221Zm-7.046 4.41c.143-1.877.822-3.461 2.086-4.856m2.646 13.633a3.472 3.472 0 0 0 6.728-.777l.09-.5-6.818 1.277Z"
                            />
                          </svg>
                          <p className="text-lg font-semibold text-gray-900 dark:text-babypowder">
                            {notificacion.titulo}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-200">
                            {notificacion.descripcion}
                          </p>
                        </div>
                        <div className="flex items-center justify-between w-full">
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
                            {notificacion.updated_at
                              ? new Date(
                                  notificacion.updated_at
                                ).toLocaleString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : ""}
                          </span>
                          <SecondaryButton
                            action={() => {
                              leerNotificacion(notificacion.id);
                            }}
                            classes={"px-5"}
                            text="Marcar leído"
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
                                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
                                />
                              </svg>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                {notificaciones.length === 0 && !loading && (
                  <div className="flex items-center justify-center w-full h-32 bg-white dark:bg-gray-800">
                    <p className="p-4 my-4 font-semibold text-center">
                      ¡No tienes notificaciones!
                    </p>
                  </div>
                )}
              </div>
              {/* Paginación */}
              {!loading && notificaciones.length > 0 && (
                <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-800">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPageNotis((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPageNotis === 1}
                      className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                        currentPageNotis === 1
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
                    {[...Array(totalFilteredPagesNotis)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPageNotis(index + 1)}
                        className={`inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md ${
                          currentPageNotis === index + 1
                            ? "bg-chryslerblue text-white"
                            : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPageNotis((prev) =>
                          Math.min(prev + 1, totalFilteredPagesNotis)
                        )
                      }
                      disabled={currentPageNotis === totalFilteredPagesNotis}
                      className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                        currentPageNotis === totalFilteredPagesNotis
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
            </div>
          </div>
          {/* Contenedor de mensajes */}
          <div>
            <div className="flex justify-end mb-4 space-x-3">
              <Lottie
                animationData={mensajeAnimation}
                className="h-16"
                loop={false}
              />
              <h2 className="mt-4 text-4xl font-semibold dark:text-babypowder">
                Tus mensajes
              </h2>
            </div>
            {error && (
              <Alert
                onDismiss={() => setError(null)}
                text={errorMessage}
                type="error"
              />
            )}
            {success && (
              <Alert
                onDismiss={() => setSuccess(null)}
                text={successMessage}
                type="success"
              />
            )}
            <div className="overflow-x-auto bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center w-full bg-white dark:bg-gray-800">
                {loading && <Spinner />}
                {mensajes &&
                  !loading &&
                  mensajes.length > 0 &&
                  currentFilteredMessage.map((mensaje) => (
                    <div
                      key={mensaje.id}
                      className="flex items-center w-full p-4 space-x-2 duration-300 ease-out border-b dark:border-gray-700 hover:bg-blue-50"
                    >
                      <div className="flex-col items-center w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-8 h-8"
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
                              d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"
                            />
                          </svg>
                          <p className="text-lg font-semibold text-gray-900 dark:text-babypowder">
                            {mensaje.titulo}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-200">
                            {mensaje.descripcion}
                          </p>
                        </div>
                        <div className="flex items-center justify-between w-full">
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
                            {mensaje.updated_at
                              ? new Date(mensaje.updated_at).toLocaleString(
                                  "es-ES",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )
                              : ""}
                          </span>
                          <SecondaryButton
                            action={() => {
                              leerNotificacion(mensaje.id);
                            }}
                            classes={"px-5"}
                            text="Marcar leído"
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
                                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
                                />
                              </svg>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                {mensajes.length === 0 && !loading && (
                  <div className="flex items-center justify-center w-full h-32 bg-white dark:bg-gray-800">
                    <p className="p-4 my-4 font-semibold text-center">
                      ¡No tienes nuevos mensajes!
                    </p>
                  </div>
                )}
              </div>
              {/* Paginación */}
              {!loading && mensajes.length > 0 && (
                <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-800">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPageMessage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPageMessage === 1}
                      className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                        currentPageMessage === 1
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
                    {[...Array(totalFilteredPagesMessage)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPageMessage(index + 1)}
                        className={`inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md ${
                          currentPageMessage === index + 1
                            ? "bg-chryslerblue text-white"
                            : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPageMessage((prev) =>
                          Math.min(prev + 1, totalFilteredPagesMessage)
                        )
                      }
                      disabled={
                        currentPageMessage === totalFilteredPagesMessage
                      }
                      className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                        currentPageMessage === totalFilteredPagesMessage
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
            </div>
          </div>
        </div>
      </div>
      {openModalReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-200 bg-opacity-50">
          <div
            ref={modalRef}
            className="w-screen"
            style={{ maxWidth: "480px" }}
          >
            <ModalReserva
              onReservaExitosa={() => {
                fetchCitas(); // Vuelve a cargar las citas del usuario para que se actualice la lista
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
