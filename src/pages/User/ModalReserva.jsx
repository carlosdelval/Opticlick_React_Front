import React from "react";
import { format, addDays, startOfDay, isSunday, getDay } from "date-fns";
import es from "date-fns/locale/es";
import { addCita, getCitasReservadasFecha, getOpticas } from "../../api";
import InputField from "../../components/InputField";
import Stepper, { Step } from "../../components/Stepper";
import Lottie from "lottie-react";
import { disableInstantTransitions } from "framer-motion";

const ModalReserva = () => {
  // Array de las fechas de los próximos 2 meses, días y meses
  const dias = Array.from({ length: 60 }, (_, i) =>
    startOfDay(addDays(new Date(), i))
  );
  const [opticas, setOpticas] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const [horas, setHoras] = React.useState([]);
  const [horasReservadas, setHorasReservadas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const buttonRefs = React.useRef([]);
  const [scrollContainerRef] = React.useState(null);
  const [formData, setFormData] = React.useState({
    optica_id: "",
    user_id: "",
    turno: "",
    hora: "",
    fecha: "",
  });

  // Obtener ópticas al cargar el componente
  React.useEffect(() => {
    const fetchOpticas = async () => {
      try {
        const opticasData = await getOpticas();
        setOpticas(opticasData);
        console.log("Opticas:", opticasData);
      } catch (error) {
        console.error("Error fetching opticas:", error);
      }
    };
    fetchOpticas();
  }, []);

  // Obtener citas reservadas al cargar el componente
  React.useEffect(() => {
    const fetchCitasReservadas = async () => {
      const fechaISO = new Date(formData.fecha.getTime() + 86400000).toISOString().split("T")[0];
      try {
        console.log(formData.optica_id, fechaISO);
        const citasReservadasData = await getCitasReservadasFecha(
          formData.optica_id,
          fechaISO
        );
        // Asegurándonos de que las horas estén en formato hh:mm
        setHorasReservadas(citasReservadasData.map(cita => {
          // Verifica si la hora ya está en formato hh:mm
          const horaStr = cita.hora;
          if (/^\d{2}:\d{2}$/.test(horaStr)) {
            return horaStr;
          }
          // Si no, intenta convertirla
          const [hour, minute] = horaStr.split(':').map(Number);
          return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }));
        console.log("Citas reservadas:", citasReservadasData);
      } catch (error) {
        console.error("Error fetching citas reservadas:", error);
      }
    };
    if (formData.optica_id && formData.fecha) {
      fetchCitasReservadas();
    }
  }, [formData.optica_id, formData.fecha]);

  // Actualiza slots cuando cambia el turno

  React.useEffect(() => {
    if (formData.turno) {
      const slots = [];
      const startHour = formData.turno === "mañana" ? 10 : 17;
      const endHour = formData.turno === "mañana" ? 14 : 21;

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
          slots.push(timeString);
        }
      }

      setHoras(slots);
      setFormData((prev) => ({ ...prev, hora: "" }));
    } else {
      setHoras([]);
    }
  }, [formData.turno]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones básicas
    if (!formData.optica_id) {
      newErrors.optica_id = "Debe seleccionar una óptica.";
    }
    if (!formData.fecha) {
      newErrors.fecha = "Debe seleccionar una fecha.";
    }
    if (!formData.turno) {
      newErrors.turno = "Debe seleccionar un turno.";
    }
    if (!formData.hora) {
      newErrors.hora = "Debe seleccionar una hora.";
    }

    // Validaciones de fecha y hora
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(formData.fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      newErrors.fecha = "La fecha no puede ser anterior a hoy.";
    }

    if (getDay(fechaSeleccionada) === 0) {
      newErrors.fecha = "No se puede reservar en domingo.";
    }

    if (
      fechaSeleccionada.toDateString() === hoy.toDateString() &&
      formData.hora
    ) {
      const [hh, mm] = formData.hora.split(":").map(Number);
      const selectedTime = new Date();
      selectedTime.setHours(hh, mm, 0, 0);
      const now = new Date();
      if (selectedTime < now) {
        newErrors.hora = "No se puede reservar una hora anterior a la actual.";
      }
    }

    // Si hay errores hasta ahora, los seteamos
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const fechaISO = formData.fecha.toISOString().split("T")[0];

      // Obtenemos horas ya reservadas
      const citasReservadas = await getCitasReservadasFecha(
        formData.optica_id,
        fechaISO
      );

      const horasReservadas = citasReservadas.map((cita) => cita.hora);

      // Si ya existe la hora seleccionada
      if (horasReservadas.includes(formData.hora)) {
        setErrors({
          hora: "Esta hora ya está reservada. Selecciona otra.",
        });
        setLoading(false);
        return;
      }

      // Si pasa todo, reservamos la cita
      await addCita({
        ...formData,
        fecha: fechaISO,
      });

      // Limpieza y cierre modal
      setFormData({
        optica_id: "",
        user_id: "",
        turno: "",
        hora: "",
        fecha: "",
      });
      setErrors({});
      alert("Cita reservada con éxito."); // Cambiar por modal/toast si deseas
    } catch (error) {
      console.error("Error al reservar cita:", error);
      alert("Error al reservar. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleHoraClick = (hora, index) => {
    setFormData((prev) => ({ ...prev, hora }));

    // Scroll al botón seleccionado (versión simplificada)
    buttonRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleFechaClick = (dia, index) => {
    if (!isSunday(dia)) {
      setFormData((prev) => ({ ...prev, fecha: dia }));
      buttonRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handleTurno = (turno) => {
    setFormData((prev) => ({
      ...prev,
      turno,
      hora: "",
    }));
  };

  //Validaciones paso por paso

  const validatePaso1 = () => {
    if (!formData.optica_id) {
      setErrors((prev) => ({
        ...prev,
        optica_id: "Debe seleccionar una óptica.",
      }));
      return false;
    }
    return true;
  };

  const validatePaso2 = () => {
    if (!formData.fecha) {
      setErrors((prev) => ({ ...prev, fecha: "Debe seleccionar una fecha." }));
      return false;
    }
    return true;
  };

  const validatePaso3 = () => {
    if (!formData.turno) {
      setErrors((prev) => ({ ...prev, turno: "Debe seleccionar un turno." }));
      return false;
    }
    return true;
  };

  const validatePaso4 = () => {
    if (!formData.hora) {
      setErrors((prev) => ({ ...prev, hora: "Debe seleccionar una hora." }));
      return false;
    }
    return true;
  };

  const esSabado = formData.fecha && getDay(new Date(formData.fecha)) === 6;

  return (
    <Stepper
      initialStep={1}
      onFinalStepCompleted={validatePaso4 ? handleSubmit : null}
    >
      <Step>
        <div className="my-2 space-y-2">
          <h3 className="text-lg font-semibold">
            ¿A qué óptica desea asistir?
          </h3>
          <InputField
            placeholder="Seleccione una óptica"
            name="optica_id"
            type="select"
            defaultValue={formData.optica_id}
            value={opticas.map((optica) => ({
              value: optica.id,
              display: optica.nombre,
            }))}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, optica_id: e }));
              setFormData((prev) => ({ ...prev, fecha: "" }));
              setErrors((prev) => ({ ...prev, optica_id: "" }));
            }}
            error={errors.optica_id}
          />
        </div>
      </Step>
      <Step canProceed={validatePaso1}>
        <div className="flex justify-center mb-4">
          <div className="text-center">
            <h2
              className={
                formData.fecha
                  ? `capitalize text-lg font-semibold`
                  : `text-lg font-semibold`
              }
            >
              {formData.fecha
                ? format(new Date(formData.fecha), "MMMM yyyy", {
                    locale: es,
                  })
                : "Seleccione una fecha"}
            </h2>
          </div>
        </div>
        <div
          className="flex mt-4 space-x-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dias.map((dia, idx) => {
            const disabled = isSunday(dia);
            return (
              <button
                ref={(el) => (buttonRefs.current[idx] = el)}
                key={idx}
                type="button"
                onClick={() => {
                  handleFechaClick(dia, idx);
                  setErrors({});
                  setFormData((prev) => ({
                    ...prev,
                    fecha: new Date(dia), // en handleFechaClick o setFormData manual
                    turno: "",
                    hora: "",
                  }));
                }}
                disabled={disabled}
                className={`p-4 rounded-lg border flex-shrink-0 ${
                  disabled
                    ? "bg-gray-200 text-gray-500"
                    : formData.fecha &&
                      new Date(formData.fecha).toDateString() ===
                        dia.toDateString()
                    ? "bg-chryslerblue text-white"
                    : "bg-white text-black"
                }`}
              >
                <div className="capitalize">
                  {format(dia, "EEE", { locale: es })}
                </div>
                <div>{format(dia, "d")}</div>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-redpantone">{errors.fecha}</p>
      </Step>
      <Step canProceed={validatePaso2}>
        <div className="flex justify-center space-y-2">
          <h3 className="px-4 text-lg font-semibold">
            ¿Qué turno desea reservar?
          </h3>
          <button
            type="button"
            className={`px-4 py-1 rounded-l bg-blue-50 ${
              formData.turno === "mañana" ? "bg-chryslerblue text-white" : ""
            }`}
            onClick={() => {
              handleTurno("mañana");
              setErrors({});
              setFormData((prev) => ({ ...prev, hora: "" }));
            }}
          >
            Mañana
          </button>
          <button
            type="button"
            disabled={esSabado}
            className={`px-4 py-1 rounded-r bg-blue-50 ${
              formData.turno === "tarde" ? "bg-chryslerblue text-white" : ""
            } ${esSabado ? "opacity-50" : ""}`}
            onClick={() => {
              !esSabado && handleTurno("tarde");
              setErrors({});
            }}
          >
            Tarde
          </button>
        </div>
        <p className="mt-2 text-sm text-redpantone">{errors.turno}</p>
      </Step>
      <Step canProceed={validatePaso3}>
        <div
          ref={scrollContainerRef}
          className="flex space-x-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {horas.map((hora, index) => (
            <button
              ref={(el) => (buttonRefs.current[index] = el)}
              type="button"
              disabled={horasReservadas.includes(hora)}
              key={hora}
              onClick={() => handleHoraClick(hora, index)}
              className={`px-4 py-2 rounded border flex-shrink-0 ${horasReservadas.includes(hora) ? "bg-gray-200 text-gray-300" : ""} ${
                formData.hora === hora
                  ? "bg-chryslerblue text-white"
                  : "bg-white text-black"
              }`}
            >
              {hora}
            </button>
          ))}
          <p className="mt-2 text-sm text-redpantone">{errors.hora}</p>
        </div>
      </Step>
    </Stepper>
  );
};

export default ModalReserva;
