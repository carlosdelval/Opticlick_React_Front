import React from "react";
import {
  getNotificaciones,
  setNotificacionLeida,
  createNotificacion,
} from "../api";
import AuthContext from "./AuthContext";
import PropTypes from "prop-types";

const NotificationsContext = React.createContext();

const NotificationsProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = React.useState([]);
  const [mensajes, setMensajes] = React.useState([]);
  const [loadingNotificaciones, setLoadingNotificaciones] =
    React.useState(true);
  const [loadingMensajes, setLoadingMensajes] = React.useState(true);
  const { user } = React.useContext(AuthContext);

  const fetchNotificaciones = async () => {
    let destinatario;
    if (user?.role === "user") {
      destinatario = 1;
    } else if (user?.role === "admin") {
      destinatario = 0;
    }
    try {
      const data = await getNotificaciones(user.id, 2, destinatario);
      setNotificaciones(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotificaciones(false);
    }
  };

  const fetchMensajes = async () => {
    let destinatario;
    if (user?.role === "user") {
      destinatario = 1;
    } else if (user.role === "admin") {
      destinatario = 0;
    }
    try {
      const data = await getNotificaciones(user.id, 1, destinatario);
      setMensajes(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMensajes(false);
    }
  };

  const marcarLeida = async (id, tipo) => {
    try {
      await setNotificacionLeida(id);
      if (tipo === 1) {
        fetchMensajes();
      } else if (tipo === 2) {
        fetchNotificaciones();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const addNotificacion = async (notificacion) => {
    try {
      // Validación adicional si es necesaria
      if (!notificacion.user_id || !notificacion.optica_id) {
        throw new Error("Datos incompletos para la notificación");
      }

      const response = await createNotificacion(notificacion);
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchNotificaciones();
      fetchMensajes();
    }
  }, [user]);

  return (
    <NotificationsContext.Provider
      value={{
        notificaciones,
        mensajes,
        loading: loadingNotificaciones || loadingMensajes,
        fetchNotificaciones,
        fetchMensajes,
        marcarLeida,
        addNotificacion,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

NotificationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { NotificationsContext, NotificationsProvider };
