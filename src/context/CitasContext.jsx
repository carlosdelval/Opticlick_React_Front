import React from "react";
import PropTypes from "prop-types";
import {
  getCitas,
  getCitasOptica,
  getCitasGraduadasUser,
  getCitasUser,
  getCitasReservadasFecha,
  deleteCita,
  addCita,
} from "../api";

const CitasContext = React.createContext();
const CitasProvider = ({ children }) => {
  const [citas, setCitas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [citasOptica, setCitasOptica] = React.useState([]);
  const [citasUser, setCitasUser] = React.useState([]);
  const [horasReservadas, setHorasReservadas] = React.useState([]);
  const [citasGraduadasUser, setCitasGraduadasUser] = React.useState([]);

  // Obtener todas las citas
  const fetchCitas = async () => {
    try {
      const data = await getCitas();
      setCitas(data);
    } catch (error) {
      console.error("Error fetching citas:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  // Obtener citas por óptica
  const fetchCitasOptica = async (id) => {
    try {
      const data = await getCitasOptica(id);
      setCitasOptica(data);
    } catch (error) {
      console.error("Error fetching citas optica:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  // Obtener citas de un usuario
  const fetchCitasUser = async (id) => {
    try {
      const data = await getCitasUser(id);
      setCitasUser(data);
    } catch (error) {
      console.error("Error fetching citas user:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  // Obtener todas las citas reservadas en una fecha de una optica
  const fetchCitasReservadasFecha = async (optica_id, fecha) => {
    const fechaISO = new Date(fecha.getTime() + 86400000)
      .toISOString()
      .split("T")[0];
    try {
      const citasReservadasData = await getCitasReservadasFecha(
        optica_id,
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

  // Obtener citas graduadas de un usuario
  const fetchCitasGraduadasUser = async (id) => {
    try {
      const data = await getCitasGraduadasUser(id);
      setCitasGraduadasUser(data);
    } catch (error) {
      console.error("Error fetching citas graduadas user:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  // Eliminar cita
  const eliminarCita = async (id) => {
    try {
      const data = await deleteCita(id);
      setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      setCitasOptica((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      return data;
    } catch (error) {
      console.error("Error deleting cita:", error);
    }
  };
  // Agregar cita
  const agregarCita = async (cita) => {
    try {
      const data = await addCita(cita);
      return data;
    } catch (error) {
      console.error("Error adding cita:", error);
    }
  };

  return (
    <CitasContext.Provider
      value={{
        citas,
        loading,
        fetchCitas,
        citasOptica,
        fetchCitasOptica,
        citasUser,
        fetchCitasUser,
        horasReservadas,
        fetchCitasReservadasFecha,
        citasGraduadasUser,
        fetchCitasGraduadasUser,
        eliminarCita,
        agregarCita,
        setLoading,
      }}
    >
      {children}
    </CitasContext.Provider>
  );
};
CitasProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
CitasContext.displayName = "CitasContext";
export { CitasProvider, CitasContext };
