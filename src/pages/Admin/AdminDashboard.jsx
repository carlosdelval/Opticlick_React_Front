import React from "react";
import AuthContext from "../../context/AuthContext";
import {
  deleteCita,
  addGraduacion,
  setGraduada,
  getOpticas,
  getCitasOptica,
  getOpticaAdmin,
} from "../../api";
import Lottie from "lottie-react";
import calendarAnimation from "../../assets/calendar.json";
import glassesAnimation from "../../assets/Glasses.json";
import callMissedAnimation from "../../assets/call-missed-red.json";
import SecondaryDanger from "../../components/SecondaryDanger";
import SecondaryButton from "../../components/SecondaryButton";
import PrimaryButton from "../../components/PrimaryButton";
import DangerButton from "../../components/DangerButton";
import MenuButton from "../../components/MenuButton";
import Spinner from "../../components/Spinner";
import { Modal, Popover } from "flowbite-react";
import Alert from "../../components/Alert";
import InputField from "../../components/InputField";
import Documentacion from "../../pdf/GeneradorPdf";
import ReactPDF from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const AdminDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [citas, setCitas] = React.useState([]);
  const [opticas, setOpticas] = React.useState([]);
  const [opticaAdmin, setOpticaAdmin] = React.useState("");
  const [opticaSearch, setOpticaSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [generatePdf, setGeneratePdf] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalAnular, setOpenModalAnular] = React.useState(false);
  const [vistaSemanal, setVistaSemanal] = React.useState(false);
  const [turnos, setTurnos] = React.useState(true);
  const [weekOffSet, setWeekOffSet] = React.useState(0);
  const [id, setId] = React.useState(null);
  const [openAccordions, setOpenAccordions] = React.useState({});
  const [formData, setFormData] = React.useState({
    eje: "",
    cilindro: "",
    esfera: "",
  });

  const WeeklyView = ({
    citas,
    turnos,
    setTurnos,
    weekOffSet,
    setWeekOffSet,
  }) => {
    const morningSlots = [];
    const afternoonSlots = [];
    const turnosRef = React.useRef(turnos);

    React.useEffect(() => {
      turnosRef.current = turnos;
    }, [turnos]);

    for (let hour = 10; hour <= 13; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 13 && minute > 30) break;
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        morningSlots.push(time);
      }
    }

    for (let hour = 17; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 30) break;
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        afternoonSlots.push(time);
      }
    }

    const daysOfWeek = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() -
        today.getDay() +
        (today.getDay() === 0 ? -6 : 1) +
        weekOffSet * 7
    );

    const weekDates = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    const formatDate = (date) => date.toISOString().split("T")[0];

    const citasSemana = citas.filter((cita) => {
      const citaDate = new Date(cita.fecha);
      return weekDates.some(
        (date) => formatDate(date) === formatDate(citaDate)
      );
    });

    const findCita = (date, time) => {
      return citasSemana.find(
        (cita) =>
          formatDate(new Date(cita.fecha)) === formatDate(date) &&
          cita.hora.startsWith(time)
      );
    };

    return (
      <div className="max-w-screen-xl">
        <div className="flex items-center justify-between my-2">
          <MenuButton
            action={() => {
              setLoading(true);
              setWeekOffSet((prev) => prev - 1);
              setTimeout(() => setLoading(false), 500);
            }}
            text="Semana anterior"
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
                  d="M5 12h14M5 12l4-4m-4 4 4 4"
                />
              </svg>
            }
          />

          <MenuButton
            action={() => {
              setLoading(true);
              setWeekOffSet(0);
              setTimeout(() => setLoading(false), 500);
            }}
            text="Semana actual"
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
                  d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5"
                />
              </svg>
            }
          />

          <MenuButton
            action={() => {
              setLoading(true);
              setWeekOffSet((prev) => prev + 1);
              setTimeout(() => setLoading(false), 500);
            }}
            text="Semana siguiente"
            iconRight={true}
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
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            }
          />
        </div>
        {citasSemana.length > 0 && !loading && (
          <table className="min-w-full border-2 border-black divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-chryslerblue dark:bg-vistablue">
              <tr>
                <th className="px-2 py-3 text-[11px] font-bold tracking-wider text-center uppercase border border-black text-babypowder dark:text-black">
                  <div className="flex items-center justify-center space-x-2">
                    {turnos ? <span>Mañana</span> : <span>Tarde</span>}
                    <button
                      onClick={() => {
                        setLoading(true);
                        setTurnos(!turnos);
                        setTimeout(() => setLoading(false), 500);
                      }}
                    >
                      <svg
                        className="w-5 h-5 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                        />
                      </svg>
                    </button>
                  </div>
                </th>
                {weekDates.map((date, index) => (
                  <th
                    key={index}
                    className={`px-2 py-3 text-[11px] font-bold tracking-wider text-center uppercase border border-black text-babypowder dark:text-black ${
                      date.toDateString() === today.toDateString()
                        ? "bg-vistablue dark:bg-chryslerblue"
                        : ""
                    } ${index >= 4 ? "hidden sm:table-cell" : ""}`}
                  >
                    <div>{daysOfWeek[index]}</div>
                    <div className="text-[10px] font-normal">
                      {date.getDate()}/{date.getMonth() + 1}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {(turnos ? morningSlots : afternoonSlots).map(
                (time, timeIndex) => (
                  <tr
                    key={`${turnos ? "morning" : "afternoon"}-${timeIndex}`}
                    className="dark:hover:bg-gray-700"
                  >
                    <td className="px-2 py-2 text-[14px] font-medium text-center border border-black hover:bg-blue-50 whitespace-nowrap h-[70px] max-h-[70px]">
                      {time}
                    </td>
                    {weekDates.map((date, dayIndex) => {
                      const cita = findCita(date, time);
                      return (
                        <td
                          key={`${
                            turnos ? "morning" : "afternoon"
                          }-${timeIndex}-${dayIndex}`}
                          className="transition-colors relative group px-1 py-1 text-[11px] border border-black h-[70px] max-h-[70px] align-top overflow-hidden hover:bg-blue-50"
                        >
                          {cita ? (
                            <>
                              {/* Contenido base (oculto al hacer hover) */}
                              <div className="absolute inset-0 z-10 flex items-center justify-center px-1 text-[10px] font-medium text-chryslerblue transition duration-500 group-hover:-translate-y-[150%]">
                                <div className="flex flex-col space-y-1 truncate">
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
                              </div>

                              {/* Capa que sube al hacer hover */}
                              <div className="absolute inset-0 z-20 flex items-center justify-center p-2 space-x-2 translate-y-[100%] transition duration-500 group-hover:translate-y-0">
                                {/* Botones de acción */}
                                <div className="flex space-x-1">
                                  <SecondaryButton
                                    action={() => handleOpenModal(cita.id)}
                                    classes="px-1"
                                    text="Graduar"
                                    icon={
                                      <svg
                                        className="w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg"
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
                                  <SecondaryDanger
                                    action={() =>
                                      handleOpenModalAnular(cita.id)
                                    }
                                    classes="px-1"
                                    text="Anular"
                                    icon={
                                      <svg
                                        className="w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg"
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

                              {/* Fondo animado para transición visual */}
                              <span className="absolute inset-0 z-0 transition duration-500 scale-y-0 translate-y-full skew-y-12 bg-blue-50 group-hover:translate-y-0 group-hover:scale-150"></span>
                            </>
                          ) : (
                            <div className="w-full h-full"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}

        {citasSemana.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center w-full h-64 bg-white border-2 border-black">
            <Lottie
              animationData={glassesAnimation}
              style={{ height: 100, width: 100 }}
            />
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              No hay citas programadas del {weekDates[0].getDate()}/
              {weekDates[0].getMonth() + 1} al {weekDates[5].getDate() + 1}/
              {weekDates[5].getMonth() + 1} en esta óptica.
            </p>
          </div>
        )}
      </div>
    );
  };

  const WeeklyViewMobile = ({ citas }) => {
    const [openAccordions, setOpenAccordions] = React.useState({});
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    );

    const toggleAccordion = (id) => {
      setOpenAccordions((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    const weekDates = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    const formatDate = (date) => date.toISOString().split("T")[0];

    const citasSemana = citas.filter((cita) => {
      const citaDate = new Date(cita.fecha);
      return weekDates.some(
        (date) => formatDate(date) === formatDate(citaDate)
      );
    });

    return (
      <div
        className="bg-white md:hidden"
        id="accordion-color"
        data-accordion="collapse"
        data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white"
      >
        {citasSemana?.map((cita, index) => {
          const date = new Date(cita.fecha);

          const day = date.getDate();
          const dayOfWeek = new Intl.DateTimeFormat("es-ES", {
            weekday: "long",
          }).format(date);
          const capitalizedDayOfWeek =
            dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

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
                  className={`transition-all bg-blue-50 duration-200 overflow-hidden ${
                    openAccordions[cita.id] ? "max-h-96" : "max-h-0"
                  }`}
                  aria-hidden={!openAccordions[cita.id]}
                >
                  <div className="flex p-4 border-t dark:border-gray-700">
                    <div className="flex justify-end w-full space-x-2">
                      <SecondaryButton
                        action={() => handleOpenModal(cita.id)}
                        text="Graduar cita"
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
                        classes="px-4"
                      />
                      <SecondaryDanger
                        action={() => handleOpenModalAnular(cita.id)}
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
                              d="m17.0896 13.371 1.1431 1.1439c.1745.1461.3148.3287.4111.5349.0962.2063.1461.4312.1461.6588 0 .2276-.0499.4525-.1461.6587-.0963.2063-.4729.6251-.6473.7712-3.1173 3.1211-6.7739 1.706-9.90477-1.4254-3.13087-3.1313-4.54323-6.7896-1.41066-9.90139.62706-.61925 1.71351-1.14182 2.61843-.23626l1.1911 1.19193c1.1911 1.19194.3562 1.93533-.4926 2.80371-.92477.92481-.65643 1.72741 0 2.38391l1.8713 1.8725c.3159.3161.7443.4936 1.191 .4936c .4468 0 .8752-.1775 1 .4936c .8624-.8261 1 .6952-1 .6004Z"
                            />
                          </svg>
                        }
                        classes="px-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          );
        })}
        {citasSemana.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center w-full h-64 bg-white border-2 border-black">
            <Lottie
              animationData={glassesAnimation}
              style={{ height: 100, width: 100 }}
            />
            <p className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400">
              No hay citas programadas para esta semana en esta óptica.
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleGeneratePdfChange = (e) => {
    setGeneratePdf(e.target.checked);
  };

  React.useEffect(() => {
    const fetchOpticaAdmin = async () => {
      try {
        const data = await getOpticaAdmin(user.id);
        setOpticaAdmin(data.optica_id);
      } catch (err) {
        console.error("Error fetching optica admin:", err);
        setError("No se pudo cargar la óptica.");
        setSuccess(null);
      }
    };

    const fetchOpticas = async () => {
      try {
        const data = await getOpticas();
        setOpticas(data);
      } catch (err) {
        console.error("Error fetching opticas:", err);
        setError("No se pudieron cargar las ópticas");
        setSuccess(null);
      }
    };

    fetchOpticaAdmin();
    fetchOpticas();
  }, [user.id]);

  // Nuevo useEffect para obtener citas SOLO cuando opticaAdmin esté definido
  React.useEffect(() => {
    const fetchCitasOptica = async () => {
      if (!opticaAdmin) return;
      try {
        setLoading(true);
        const idToSearch = opticaSearch || opticaAdmin;
        const data = await getCitasOptica(idToSearch);
        setCitas(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("No se pudieron cargar las citas de esta óptica");
        setSuccess(null);
      } finally {
        setTimeout(() => setLoading(false), 250);
      }
    };

    fetchCitasOptica();
  }, [opticaSearch, opticaAdmin]);

  const handleOpenModalAnular = (id) => {
    setOpenModalAnular(true);
    setId(id);
  };
  const handleOpenModal = (id) => {
    setOpenModal(true);
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

  const handleGraduarCita = async (e, id) => {
    e.preventDefault();
    try {
      // Validar datos antes de continuar
      if (!formData.eje || !formData.cilindro || !formData.esfera) {
        setError("Todos los campos de graduación son requeridos");
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
      setCitas(citas.filter((c) => c.id !== id));
      setOpenModal(false);
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
      const normalizedCliente = cita.user_name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedSearchTerm = searchTerm
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const normalizedApellido = cita.user_surname
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const normalizedFecha = new Date(cita.fecha)
        .toLocaleDateString("es-ES")
        .replace(/\//g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedHora = cita.hora
        ? cita.hora
            .substring(0, 5)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        : "";
      const normalizedTelefono = cita.telefono
        ? cita.telefono.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        : "";

      return (
        normalizedCliente.includes(normalizedSearchTerm) ||
        normalizedFecha.includes(normalizedSearchTerm) ||
        normalizedHora.includes(normalizedSearchTerm) ||
        normalizedApellido.includes(normalizedSearchTerm) ||
        normalizedTelefono.includes(normalizedSearchTerm)
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
    <div className="my-auto md:max-w-7xl md:mx-auto">
      <div className="flex mb-4 space-x-3 text-start">
        <Lottie animationData={calendarAnimation} style={{ height: 60 }} />
        <h2 className="text-4xl font-semibold md:mt-4 dark:text-babypowder">
          Tus citas actuales, {user?.name}
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
      <div className="mb-4 space-y-2 md:flex md:space-x-3 md:space-y-0">
        <div className="space-y-2 md:flex md:space-x-2 md:space-y-0">
          {!vistaSemanal && (
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
                className="block w-full p-4 pl-10 text-sm text-gray-900 bg-white border-2 border-black rounded-lg md:w-96 focus:bg-blue-50 focus:border-chryslerblue focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Buscar citas por cliente, fecha u hora..."
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <div className="relative">
            <select
              className="block w-full p-4 text-sm text-gray-900 bg-white border-2 border-black rounded-lg md:w-96 focus:bg-blue-50 focus:border-chryslerblue focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              onChange={(e) => setOpticaSearch(e.target.value)}
              value={opticaSearch}
            >
              <option value="" disabled>
                Filtrar por óptica
              </option>
              {opticas.map((optica) => (
                <option key={optica.id} value={optica.id}>
                  {optica.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative flex items-center justify-end w-full fixated">
          <MenuButton
            text={`${
              !vistaSemanal
                ? "Cambiar a vista semanal"
                : "Cambiar a lista completa"
            }`}
            action={async () => {
              setLoading(true);
              setTimeout(() => {
                setWeekOffSet(0);
                if (opticaSearch === "") {
                  setOpticaSearch(opticaAdmin);
                }
                setVistaSemanal(!vistaSemanal);
                setLoading(false);
              }, 300);
            }}
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
                  d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                />
              </svg>
            }
          />
        </div>
      </div>

      <div
        className={`overflow-hidden rounded-lg shadow-lg ${
          !vistaSemanal ? "border-2 border-black" : ""
        }`}
      >
        <div className="overflow-x-auto">
          {vistaSemanal ? (
            <>
              {/* Vista móvil */}
              <div className={`block md:hidden ${!loading ? "border-2 border-black" : ""}`}>
                <WeeklyViewMobile citas={citas} />
              </div>

              {/* Vista escritorio */}
              <div className="hidden md:block">
                <WeeklyView
                  citas={citas}
                  turnos={turnos}
                  setTurnos={setTurnos}
                  weekOffSet={weekOffSet}
                  setWeekOffSet={setWeekOffSet}
                />
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:block">
                {/* Versión de tabla para pantallas medianas/grandes */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-xs font-bold tracking-wider text-left uppercase bg-chryslerblue text-babypowder dark:text-black dark:bg-vistablue">
                    <tr>
                      <th className="px-6 py-3">Cliente</th>
                      <th className="px-6 py-3">Fecha</th>
                      <th className="px-6 py-3">Hora</th>
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
                            className="transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-left text-gray-900 dark:text-babypowder whitespace-nowrap">
                              <Popover
                                arrow={false}
                                trigger="hover"
                                content={
                                  <div className="flex flex-col items-start p-2 text-xs bg-blue-100 border rounded-lg shadow-md border-vistablue text-chryslerblue dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        className="w-4 h-4 dark:text-white"
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

                                      <span className="font-semibold dark:text-gray-400">
                                        {cita.telefono}
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
                                  {cita.user_name} {cita.user_surname}
                                </span>
                              </Popover>
                            </td>
                            <td className="px-6 py-4 text-sm text-left text-gray-500 dark:text-gray-200 whitespace-nowrap">
                              <span className="bg-babypowder text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
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
                              <span className="bg-babypowder text-chryslerblue text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-vistablue border border-vistablue">
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
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <div className="flex justify-end space-x-2">
                                <SecondaryButton
                                  action={() => handleOpenModal(cita.id)}
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
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
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
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Versión de acordeón para dispositivos móviles */}
              <div
                className="md:hidden"
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
                          className="bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800"
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
                                      {cita.hora
                                        ? cita.hora.substring(0, 5)
                                        : ""}
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
                                  action={() => handleOpenModal(cita.id)}
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
            </>
          )}
          {loading && (
            <Spinner/>
          )}
          {filteredCitas.length === 0 && !vistaSemanal && !loading && (
            <div className="flex items-center justify-center w-full h-32 bg-white dark:bg-gray-800">
              <p className="p-4 my-4 text-center">
                No hay citas que coincidan con la búsqueda
              </p>
            </div>
          )}
          {/* Paginación */}
          {!loading && !vistaSemanal && filteredCitas.length > 0 && (
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

          {/* Modal graduaciones*/}
          <Modal
            className="justify-center bg-gray-200 bg-opacity-50 py-96"
            size="md"
            show={openModal}
            onClose={() => setOpenModal(false)}
          >
            <div className="justify-center p-4 border-2 border-black rounded-md shadow-sm dark:border-gray-700">
              <Modal.Header className="p-4">
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
              </Modal.Header>
              <Modal.Body className="justify-center p-4">
                <form onSubmit={(e) => handleGraduarCita(e, id)}>
                  <div className="my-2">
                    <InputField
                      type="number"
                      label="Eje"
                      value={formData.eje}
                      onChange={(value) =>
                        setFormData({ ...formData, eje: value })
                      }
                    />
                    <InputField
                      type="number"
                      label="Cilindro"
                      value={formData.cilindro}
                      onChange={(value) =>
                        setFormData({ ...formData, cilindro: value })
                      }
                    />
                    <InputField
                      type="number"
                      label="Esfera"
                      value={formData.esfera}
                      onChange={(value) =>
                        setFormData({ ...formData, esfera: value })
                      }
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
                    <PrimaryButton classes={"mt-4"} text="Graduar" />
                  </div>
                </form>
              </Modal.Body>
            </div>
          </Modal>
          {/* Modal anular cita*/}
          <Modal
            className="mx-auto bg-gray-200 bg-opacity-50 py-96"
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
                  <p>El cliente será notificado.</p>
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
