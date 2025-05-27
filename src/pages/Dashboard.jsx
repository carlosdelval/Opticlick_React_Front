import React from "react";
import AuthContext from "../context/AuthContext";
import { addGraduacion, setGraduada } from "../api";
import Lottie from "lottie-react";
import calendarAnimation from "../assets/calendar.json";
import glassesAnimation from "../assets/Glasses.json";
import callMissedAnimation from "../assets/call-missed-red.json";
import SecondaryDanger from "../components/SecondaryDanger";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";
import DangerButton from "../components/DangerButton";
import MenuButton from "../components/MenuButton";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import ModalReserva from "./user/ModalReserva";
import notificacionAnimation from "../assets/notification.json";
import mensajeAnimation from "../assets/chat.json";
import { NotificationsContext } from "../context/NotificationsContext";
import { CitasContext } from "../context/CitasContext";
import InputField from "../components/InputField";
import Documentacion from "../pdf/GeneradorPdf";
import ReactPDF from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const Dashboard = () => {
  const { user } = React.useContext(AuthContext);
  const {
    fetchCitasOptica,
    eliminarCita,
    loading,
    setLoading,
    fetchCitasUser,
    citasUser,
    citasOptica,
  } = React.useContext(CitasContext);
  const { novedades, marcarLeida, addNotificacion } =
    React.useContext(NotificationsContext);
  const [citas, setCitas] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [generatePdf, setGeneratePdf] = React.useState(false);
  const [openModalReserva, setOpenModalReserva] = React.useState(false);
  const [openModalGraduar, setOpenModalGraduar] = React.useState(false);
  const [openModalMensaje, setOpenModalMensaje] = React.useState(false);
  const [openModalAnular, setOpenModalAnular] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [openAccordions, setOpenAccordions] = React.useState({});
  const [formError, setFormError] = React.useState({
    eje: "",
    cilindro: "",
    esfera: "",
    mensaje: "",
  });
  const [formData, setFormData] = React.useState({
    eje: "",
    cilindro: "",
    esfera: "",
    mensaje: "",
  });

  const handleGeneratePdfChange = (e) => {
    setGeneratePdf(e.target.checked);
  };

  React.useEffect(() => {
    setLoading(true);
    user.role === "admin"
      ? fetchCitasOptica(user.optica_id)
      : fetchCitasUser(user.id);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [user.optica_id, user.id]);

  React.useEffect(() => {
    user.role === "admin" ? setCitas(citasOptica) : setCitas(citasUser);
  }, [citasOptica, citasUser]);

  const handleEnviarMensaje = async (id) => {
    // Validar datos antes de continuar
    if (formData.mensaje.length < 5) {
      setFormError({
        ...formError,
        mensaje: "El mensaje debe tener al menos 5 caracteres",
      });
      return;
    }
    const nuevaNotificacion = {
      user_id: user.role === "admin" ? id : user.id,
      optica_id: user.role === "admin" ? user.optica_id : id,
      tipo: user.role === "admin" ? 2 : 1,
      destinatario: user.role === "admin" ? 1 : 0,
      titulo: `${user.name} ${user.surname}`,
      descripcion: formData.mensaje,
    };
    try {
      await addNotificacion(nuevaNotificacion);
      setOpenModalMensaje(false);
      setError(null);
      setSuccess("Mensaje enviado correctamente");
      setFormData({
        eje: "",
        cilindro: "",
        esfera: "",
        mensaje: "",
      });
      // Scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError("No se pudo enviar el mensaje");
      setSuccess(null);
    }
  };

  const handleOpenModalAnular = (id) => {
    setOpenModalAnular(true);
    setId(id);
  };
  const handleOpenModalGraduar = (id) => {
    setOpenModalGraduar(true);
    setId(id);
  };
  const handleOpenModalReserva = () => {
    setOpenModalReserva(true);
  };
  const handleOpenModalMensaje = (id) => {
    setOpenModalMensaje(true);
    setId(id);
  };

  const handleCloseModal = () => {
    setOpenModalAnular(false);
    setOpenModalGraduar(false);
    setOpenModalMensaje(false);
    setOpenModalReserva(false);
    setFormData({
      eje: "",
      cilindro: "",
      esfera: "",
      mensaje: "",
    });
    setFormError({
      eje: "",
      cilindro: "",
      esfera: "",
      mensaje: "",
    });
  };

  const handleDeleteCita = async (id) => {
    try {
      await eliminarCita(id);
      user.role === "admin"
        ? fetchCitasOptica(user.optica_id)
        : fetchCitasUser(user.id);
      setOpenModalAnular(false);
      setSuccess("Cita anulada correctamente");
      setError(null);
      // Scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Error al anular cita:", err);
      setError("No se pudo anular la cita.");
      setSuccess(null);
      setOpenModalAnular(false);
    }
  };

  const handleGraduarCita = async (e, id) => {
    e.preventDefault();
    try {
      // Validar datos antes de continuar
      if (!formData.eje || !formData.cilindro || !formData.esfera) {
        setFormError({
          eje: !formData.eje ? "Campo requerido" : "",
          cilindro: !formData.cilindro ? "Campo requerido" : "",
          esfera: !formData.esfera ? "Campo requerido" : "",
        });
        return;
      }

      // 1. Registrar la graduación
      await addGraduacion({
        cita_id: id,
        eje: formData.eje,
        cilindro: formData.cilindro,
        esfera: formData.esfera,
      });

      // 2. Marcar la cita como graduada
      await setGraduada(id);

      // 3. Generar PDF si está marcado el checkbox
      if (generatePdf) {
        const citaActual = citas.find((c) => c.id === id);
        if (citaActual) {
          // Crear props para el documento
          const docProps = {
            nombre: citaActual.cliente || "Cliente",
            graduacion: formData,
            fecha: new Date().toLocaleDateString("es-ES"),
            hora: new Date().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            }),
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
            saveAs(
              blob,
              `graduacion_${docProps.nombre.replace(/\s+/g, "_")}.pdf`
            );
          }
        }
      }

      // 4. Actualizar estado
      fetchCitasOptica(user.optica_id);
      setOpenModalGraduar(false);
      setSuccess(
        `Graduación registrada correctamente${
          generatePdf ? " y PDF generado" : ""
        }`
      );
      setError(null);

      // 5. Resetear formulario
      setFormData({ eje: "", cilindro: "", esfera: "" });
      setGeneratePdf(false);
    } catch (err) {
      console.error("Error en handleGraduarCita:", err);
      setError(
        err.response?.data?.message || "Error al procesar la graduación"
      );
      setSuccess(null);
    }
  };

  // Paginación de las citas filtradas
  const [currentPageCita, setCurrentPageCita] = React.useState(1);
  const itemsPerPageCita = 6;
  const itemsPerPageNotis = 4;
  const totalFilteredPages = Math.ceil(citas.length / itemsPerPageCita);
  const currentFilteredCitas = citas.slice(
    (currentPageCita - 1) * itemsPerPageCita,
    currentPageCita * itemsPerPageCita
  );

  // Paginación de las novedades filtradas
  const [currentPageNotis, setCurrentPageNotis] = React.useState(1);
  const totalFilteredPagesNotis = Math.ceil(
    novedades.length / itemsPerPageNotis
  );
  const currentFilteredNotis = novedades.slice(
    (currentPageNotis - 1) * itemsPerPageNotis,
    currentPageNotis * itemsPerPageNotis
  );

  //Gestionar apertura de acordeón
  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="my-auto md:max-w-7xl md:mx-auto">
      <div className="flex flex-col justify-between w-full md:flex-row">
        {/* Contenedor de citas */}
        <div className="overflow-hidden md:w-1/2">
          <div className="flex flex-col items-center text-center mb-4 space-y-3 md:flex-row md:items-start md:space-x-3 md:space-y-0 md:text-left">
            <Lottie
              animationData={calendarAnimation}
              className="h-24 md:h-16"
              loop={false}
            />
            <h2 className="text-2xl md:text-4xl font-semibold dark:text-babypowder">
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
          {user.role === "user" && (
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
                action={() => handleOpenModalReserva()}
              />
            </div>
          )}
          <div className="overflow-x-auto bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-400">
            {loading && <Spinner />}
            {citas.length === 0 && !loading && (
              <div className="flex items-center justify-center w-full h-32 bg-white dark:bg-gray-700">
                <p className="p-4 my-4 text-center">
                  ¡No tienes citas programadas!
                </p>
              </div>
            )}
            {/* Acordeón de citas */}
            <div
              className="accor"
              id="accordion-color"
              data-accordion="collapse"
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
                    !loading && (
                      <div
                        key={cita.id}
                        className="bg-white border-b border-gray-200 dark:border-gray-400 dark:bg-gray-700"
                      >
                        <h2 id={`accordion-color-heading-${index}`}>
                          <button
                            type="button"
                            className={`${
                              openAccordions[cita.id]
                                ? "bg-blue-50 dark:bg-gray-800"
                                : ""
                            } flex items-center justify-between w-full gap-3 p-5 font-medium text-gray-500 rtl:text-right dark:border-gray-700 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 ease-out duration-300`}
                            data-accordion-target={`#accordion-color-body-${index}`}
                            onClick={() => toggleAccordion(cita.id)}
                            aria-expanded={openAccordions[cita.id] || false}
                          >
                            <div className="space-y-4 text-left">
                              <div className="font-medium text-gray-900 dark:text-babypowder">
                                {formattedDate}
                              </div>
                              <div className="space-y-2">
                                {user.role === "user" && (
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
                                        strokeWidth="2"
                                        d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      />
                                    </svg>
                                    {cita.optica_nombre}
                                  </span>
                                )}
                                {user.role === "admin" && (
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
                                          strokeWidth="2"
                                          d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                      </svg>
                                      {cita.user_name} {cita.user_surname}
                                    </span>
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
                                          d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"
                                        />
                                      </svg>
                                      {cita.telefono}
                                    </span>
                                  </div>
                                )}
                                <div>
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
                          className={`transition-all bg-blue-50 dark:bg-gray-800 duration-200 overflow-hidden ${
                            openAccordions[cita.id] ? "max-h-96" : "max-h-0"
                          }`}
                          aria-hidden={!openAccordions[cita.id]}
                        >
                          <div className="flex p-4 border-t dark:border-gray-700">
                            <div className="flex justify-end w-full space-x-2">
                              {user.role === "admin" && (
                                <SecondaryButton
                                  action={() => handleOpenModalGraduar(cita.id)}
                                  text="Graduar cita"
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
                                        strokeWidth="2"
                                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                                      />
                                      <path
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      />
                                    </svg>
                                  }
                                />
                              )}
                              <SecondaryButton
                                text="Enviar mensaje"
                                classes={"px-4"}
                                action={() => {
                                  handleOpenModalMensaje(
                                    user.role === "admin"
                                      ? cita.user_id
                                      : cita.optica_id
                                  );
                                }}
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
                                      d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                                    />
                                  </svg>
                                }
                              />
                              <SecondaryDanger
                                action={() => handleOpenModalAnular(cita.id)}
                                text="Anular cita"
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
                                      d="m17.0896 13.371 1.1431 1.1439c.1745.1461.3148.3287.4111.5349.0962.2063.1461.4312.1461.6588 0 .2276-.0499.4525-.1461.6587-.0963.2063-.4729.6251-.6473.7712-3.1173 3.1211-6.7739 1.706-9.90477-1.4254-3.13087-3.1313-4.54323-6.7896-1.41066-9.90139.62706-.61925 1.71351-1.14182 2.61843-.23626l1.1911 1.19193c1.1911 1.19194.3562 1.93533-.4926 2.80371-.92477.92481-.65643 1.72741 0 2.38391l1.8713 1.8725c.3159.3161.7443.4936 1.191.4936.4468 0 .8752-.1775 1.1911-.4936.8624-.8261 1.6952-1.6004 2.8382-.4565Zm-2.2152-4.39103 2.1348-2.13485m0 0 2.1597-1.90738m-2.1597 1.90738 2.1597 2.15076m-2.1597-2.15076-2.1348-1.90738"
                                    />
                                  </svg>
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
            </div>
            {/* Paginación */}
            {!loading && citas.length > 0 && (
              <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-700">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPageCita((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPageCita === 1}
                    className={`inline-flex items-center justify-center p-2 border border-gray-300 dark:border-gray-400 rounded-md ${
                      currentPageCita === 1
                        ? "text-gray-400 dark:text-babypowder"
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
                      onClick={() => setCurrentPageCita(index + 1)}
                      className={`inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md ${
                        currentPageCita === index + 1
                          ? "bg-chryslerblue text-white dark:bg-vistablue dark:text-babypowder"
                          : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800"
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
                        ? "text-gray-400 dark:text-babypowder"
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
            <div className="overflow-x-auto bg-white border-2 border-black rounded-lg shadow-lg dark:border-gray-400 dark:bg-gray-700">
              <div className="flex flex-col items-center justify-center w-full bg-white dark:bg-gray-700">
                {loading && <Spinner />}
                {novedades &&
                  !loading &&
                  novedades.length > 0 &&
                  currentFilteredNotis.map((notificacion) => (
                    <div
                      key={notificacion.id}
                      className="flex items-center justify-between w-full p-4 space-x-2 duration-300 ease-out border-b dark:border-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-col items-center w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          {notificacion.tipo === 2 ? (
                            <svg
                              className="w-8 h-8 dark:text-babypowder"
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
                          ) : (
                            <svg
                              className="w-8 h-8 dark:text-babypowder"
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
                          )}
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
                            {notificacion.created_at
                              ? new Date(
                                  notificacion.created_at
                                ).toLocaleString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }) + "h"
                              : ""}
                          </span>
                          <SecondaryButton
                            action={() => {
                              marcarLeida(notificacion.id, notificacion.tipo);
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
                {novedades.length === 0 && !loading && (
                  <div className="flex items-center justify-center w-full h-32 bg-white dark:bg-gray-700 dark:text-babypowder">
                    <p className="p-4 my-4 font-semibold text-center">
                      ¡No tienes notificaciones!
                    </p>
                  </div>
                )}
              </div>
              {/* Paginación */}
              {!loading && novedades.length > 0 && (
                <div className="flex items-center justify-center py-4 bg-white dark:bg-gray-700">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPageNotis((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPageNotis === 1}
                      className={`inline-flex items-center justify-center p-2 border border-gray-300 rounded-md ${
                        currentPageNotis === 1
                          ? "text-gray-400 dark:text-babypowder"
                          : "text-gray-700 hover:bg-blue-50 dark:text-babypowder dark:hover:bg-gray-800"
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
                            ? "bg-chryslerblue text-white dark:bg-vistablue dark:text-babypowder"
                            : "text-gray-700 hover:bg-blue-50 dark:text-babypowder dark:hover:bg-gray-800"
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
                          ? "text-gray-400 dark:text-babypowder"
                          : "text-gray-700 hover:bg-blue-50 dark:text-babypowder dark:hover:bg-gray-800"
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
      {/* Modal graduaciones*/}
      <Modal
        open={openModalGraduar}
        onClose={handleCloseModal}
        title={
          <div className="flex space-x-2">
            <Lottie
              animationData={glassesAnimation}
              style={{ height: 60 }}
              loop={false}
            />
            <h2 className="my-4 text-2xl font-bold text-center">
              Graduar esta cita
            </h2>
          </div>
        }
        text={
          <div>
            <div className="my-2">
              <InputField
                type="number"
                label="Eje"
                value={formData.eje}
                onChange={(value) => setFormData({ ...formData, eje: value })}
                error={formError.eje}
              />
              <InputField
                type="number"
                label="Cilindro"
                value={formData.cilindro}
                onChange={(value) =>
                  setFormData({ ...formData, cilindro: value })
                }
                error={formError.cilindro}
              />
              <InputField
                type="number"
                label="Esfera"
                value={formData.esfera}
                onChange={(value) =>
                  setFormData({ ...formData, esfera: value })
                }
                error={formError.esfera}
              />
            </div>
            <div className="flex items-center me-4">
              <input
                onChange={handleGeneratePdfChange}
                checked={generatePdf}
                id="generatePdfCheckbox"
                type="checkbox"
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded-sm focus:ring-chryslerblue dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="generatePdfCheckbox"
                className="text-sm font-medium text-gray-700 ms-2 dark:text-gray-300"
              >
                Deseo descargar la graduación en PDF
              </label>
            </div>
            <div className="flex justify-end">
              <PrimaryButton
                classes={"mt-4"}
                text="Graduar"
                action={(e) => handleGraduarCita(e, id)}
              />
            </div>
          </div>
        }
      />
      {/* Modal enviar mensaje*/}
      <Modal
        open={openModalMensaje}
        onClose={handleCloseModal}
        title={
          <div className="flex space-x-2">
            <Lottie
              animationData={mensajeAnimation}
              style={{ height: 60 }}
              loop={false}
            />
            <h2 className="my-4 text-2xl font-bold text-center">
              Enviar mensaje
            </h2>
          </div>
        }
        text={
          <div>
            <div className="my-2">
              <textarea
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:border-chryslerblue dark:bg-gray-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 focus:ring-chryslerblue dark:focus:border-chryslerblue"
                placeholder="Escribe tu mensaje aquí..."
                value={formData.mensaje}
                onChange={(e) => {
                  setFormData({ ...formData, mensaje: e.target.value });
                  setFormError({ ...formError, mensaje: "" });
                }}
              ></textarea>
              {formError.mensaje && (
                <p className="py-1 text-sm text-redpantone dark:text-lightcoral">
                  {formError.mensaje}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <PrimaryButton
                classes={"mt-4"}
                text="Enviar"
                action={() => handleEnviarMensaje(id)}
              />
            </div>
          </div>
        }
      />
      {/* Modal anular cita*/}
      <Modal
        open={openModalAnular}
        onClose={handleCloseModal}
        title={
          <div className="flex space-x-2">
            <Lottie
              animationData={callMissedAnimation}
              style={{ height: 60 }}
              loop={false}
            />
            <h2 className="my-4 text-2xl font-bold text-center">
              Anular esta cita
            </h2>
          </div>
        }
        text={
          <div className="my-2">
            <p>¿Está seguro de que desea anular esta cita?</p>
            <p>El cliente será notificado.</p>
          </div>
        }
        bottom={
          <div className="flex justify-end w-full">
            <DangerButton
              action={() => handleDeleteCita(id)}
              classes="mt-4"
              text="Anular"
            />
          </div>
        }
      />
      {/* Modal reservar cita*/}
      <ModalReserva
        isOpen={openModalReserva}
        onClose={handleCloseModal}
        onReservaExitosa={() => fetchCitasUser(user.id)}
      />
    </div>
  );
};

export default Dashboard;
