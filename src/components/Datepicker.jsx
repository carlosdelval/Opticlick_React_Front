import Datepicker from "tailwind-datepicker-react";
import { useState } from "react";
import { addDays, isSunday } from "date-fns";

// Función para obtener todos los domingos
const getDisabledSundays = () => {
  const disabledDates = [];
  const today = new Date();
  const sixMonthsLater = addDays(today, 360);

  let currentDate = new Date(today);
  while (currentDate <= sixMonthsLater) {
    if (isSunday(currentDate)) {
      disabledDates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }
  return disabledDates;
};

const options = {
  title: "Seleccionar fecha",
  autoHide: true,
  todayBtn: true,
  clearBtn: true,
  clearBtnText: "Limpiar",
  todayBtnText: "Hoy",
  maxDate: new Date("2040-01-01"),
  minDate: new Date(Date.now()),
  formats: ["dd/mm/yyyy"],
  theme: {
    background: "bg-white dark:bg-gray-800",
    toggleSelected: "bg-chryslerblue text-white",
    todayBtn: "bg-chryslerblue text-white hover:bg-vistablue duration-300",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "transparent",
    input: "",
    inputIcon: "",
    selected: "bg-chryslerblue text-white hover:bg-vistablue duration-300",
  },
  icons: {
    // () => ReactElement | JSX.Element
    prev: () => (
      <svg
        className="w-6 h-6 dark:text-white"
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
    ),
    next: () => (
      <svg
        className="w-6 h-6 dark:text-white"
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
    ),
  },
  datepickerClassNames: "top-12",
  language: "es",
  format: "dd/MM/yyyy",
  disabledDates: [getDisabledSundays], // Disable Sunday
  weekDays: ["L", "M", "X", "J", "V", "S", "D"],
  inputNameProp: "date",
  inputIdProp: "date",
  inputLabelProp: "Fecha",
  inputPlaceholderProp: "Seleccionar fecha",
  inputDateFormatProp: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};
const SelectorFecha = ({ error, classes, onChange }) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleChange = (selectedDate) => {
    // Crear nueva fecha sin problemas de zona horaria
    const fixedDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );
    setSelectedDate(fixedDate);
    onChange(fixedDate); // Pasar la fecha corregida al padre
  };
  const handleClose = (state) => {
    setShow(state);
  };

  return (
    <div className="mb-4">
      <Datepicker
        options={options}
        onChange={handleChange}
        show={show}
        setShow={handleClose}
      >
        <div className="...">
          <div className="...">
            <svg
              className="w-6 h-6 dark:text-white"
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
          </div>
          <input
            type="text"
            className={`${
              classes || ""
            } w-full p-2 focus:outline-none focus:ring-2 focus:ring-chryslerblue border rounded-lg ${
              error ? "border-redpantone" : ""
            }`}
            placeholder={options.inputPlaceholderProp}
            value={selectedDate ? selectedDate.toLocaleDateString("es-ES") : ""}
            onFocus={() => setShow(true)}
            readOnly
          />
        </div>
        {error && <p className="text-xs text-redpantone">{error}</p>}
      </Datepicker>
    </div>
  );
};

export default SelectorFecha;
