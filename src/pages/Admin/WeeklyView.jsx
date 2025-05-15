import React from "react";
import Lottie from "lottie-react";
import glassesAnimation from "../../assets/Glasses.json";
import MenuButton from "../../components/MenuButton";
import SecondaryButton from "../../components/SecondaryButton";
import SecondaryDanger from "../../components/SecondaryDanger";
const WeeklyView = ({
  citas,
  turnos,
  setTurnos,
  weekOffSet,
  setWeekOffSet,
    setLoading,
    loading,
    handleOpenModal,
    handleOpenModalAnular,
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
    return weekDates.some((date) => formatDate(date) === formatDate(citaDate));
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
            {(turnos ? morningSlots : afternoonSlots).map((time, timeIndex) => (
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
                                action={() => handleOpenModalAnular(cita.id)}
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
            ))}
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


export default WeeklyView;