import React from "react";
import { format, addDays, startOfDay, isSunday, getDay } from "date-fns";
import es from "date-fns/locale/es";
import { addCita, getCitasReservadasFecha, getOpticas } from "../../api";
import InputField from "../../components/InputField";
import Stepper, { Step } from "../../components/Stepper";
import AuthContext from "../../context/AuthContext";
import { NotificationsContext } from "../../context/NotificationsContext";
import Lottie from "lottie-react";
import Glasses from "../../assets/Glasses.json";
import Spinner from "../../components/Spinner";

const ModalReserva = ({ onReservaExitosa }) => {
  // Array de las fechas de los próximos 2 meses, días y meses
  const dias = Array.from({ length: 60 }, (_, i) =>
    startOfDay(addDays(new Date(), i))
  );
  const { user } = React.useContext(AuthContext);
  const { addNotificacion } = React.useContext(NotificationsContext);
  const [opticas, setOpticas] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const [horas, setHoras] = React.useState([]);
  const [horasReservadas, setHorasReservadas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const buttonRefs = React.useRef([]);
  const [scrollContainerRef] = React.useState(null);
  const [formData, setFormData] = React.useState({
    optica_id: "",
    user_id: user.id,
    turno: "",
    hora: "",
    fecha: "",
  });

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      optica_id: "",
      user_id: user.id,
      turno: "",
      hora: "",
      fecha: "",
    });
    setErrors({});
    setHoras([]);
    setHorasReservadas([]);
  };

  // Resetear el formulario al desmontar el componente
  React.useEffect(() => {
    return () => {
      resetForm(); // Se llama automáticamente al desmontarse el componente
    };
  }, []);

  // Obtener ópticas al cargar el componente
  React.useEffect(() => {
    const fetchOpticas = async () => {
      try {
        const opticasData = await getOpticas();
        setOpticas(opticasData);
      } catch (error) {
        console.error("Error fetching opticas:", error);
      }
    };
    fetchOpticas();
  }, []);

  // Obtener citas reservadas al cargar el componente
  React.useEffect(() => {
    const fetchCitasReservadas = async () => {
      const fechaISO = new Date(formData.fecha.getTime() + 86400000)
        .toISOString()
        .split("T")[0];
      try {
        const citasReservadasData = await getCitasReservadasFecha(
          formData.optica_id,
          fechaISO
        );
        // Asegurándonos de que las horas estén en formato hh:mm
        setHorasReservadas(
          citasReservadasData.map((cita) => {
            // Verifica si la hora ya está en formato hh:mm
            const horaStr = cita.hora;
            if (/^\d{2}:\d{2}$/.test(horaStr)) {
              return horaStr;
            }
            // Si no, intenta convertirla
            const [hour, minute] = horaStr.split(":").map(Number);
            return `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`;
          })
        );
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const cita = {
        ...formData,
        fecha: new Date(formData.fecha.getTime() + 86400000),
      };

      // Primero creamos la notificación con los datos actualizados
      const nuevaNotificacion = {
        user_id: user.id,
        optica_id: formData.optica_id,
        tipo: 2,
        destinatario: 0,
        titulo: `${user?.name} ${user?.surname}`,
        descripcion: `Cita reservada el día ${formData.fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })} a las ${
          formData.hora
        } en ${
          opticas.find((o) => o.id === parseInt(formData.optica_id))?.nombre ||
          "desconocida"
        }`,
      };

      await addCita(cita);
      await addNotificacion(nuevaNotificacion); // Usamos el objeto directamente

      onReservaExitosa?.();
    } catch (error) {
      console.error("Error al agregar la cita:", error);
      // Manejo de errores
    } finally {
      setTimeout(() => {
        setLoading(false);
        resetForm();
      }, 2000);
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
    handleSubmit();
    return true;
  };

  const esSabado = formData.fecha && getDay(new Date(formData.fecha)) === 6;
  const esHoy =
    formData.fecha &&
    new Date(formData.fecha).toDateString() === new Date().toDateString();
  const now = new Date();
  const horaActual = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <Stepper
      initialStep={1}
      validatePaso4={validatePaso4}
      finalStepContent={
        loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-32 bg-white dark:bg-gray-800">
            <Lottie
              animationData={Glasses}
              style={{ height: 100 }}
              loop={true}
              onComplete={() => {
                setFormData({
                  optica_id: "",
                  user_id: user.id,
                  turno: "",
                  hora: "",
                  fecha: "",
                });
              }}
            />
            <h2 className="text-lg font-semibold">
              ¡Tu cita ha sido reservada con éxito!
            </h2>
          </div>
        )
      }
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
            disabled={esHoy && horaActual >= "14:00"}
            className={`px-4 py-1 rounded-l bg-blue-100 ${
              formData.turno === "mañana" ? "bg-chryslerblue text-white" : ""
            } ${esHoy && horaActual >= "14:00" ? "opacity-50" : ""}`}
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
            className={`px-4 py-1 rounded-r bg-blue-100 ${
              formData.turno === "tarde" ? "bg-chryslerblue text-white" : ""
            } ${esSabado ? "opacity-50 cursor-not-allowed" : ""}`}
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
          {horas.map((hora, index) => {
            // Determinar si la hora está deshabilitada
            const isReserved = horasReservadas.includes(hora);
            const isPastTime = esHoy && hora < horaActual;
            const isDisabled = isReserved || isPastTime;

            return (
              <button
                ref={(el) => (buttonRefs.current[index] = el)}
                type="button"
                disabled={isDisabled}
                key={hora}
                onClick={() => handleHoraClick(hora, index)}
                className={`px-4 py-2 rounded border flex-shrink-0 ${
                  isDisabled
                    ? "bg-gray-200 text-gray-300 cursor-not-allowed"
                    : ""
                } ${
                  formData.hora === hora
                    ? "bg-chryslerblue text-white"
                    : "bg-white text-black"
                }`}
              >
                {hora}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-redpantone">{errors.hora}</p>
      </Step>
    </Stepper>
  );
};

export default ModalReserva;
