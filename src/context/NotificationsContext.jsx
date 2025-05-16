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
  const [novedades, setNovedades] = React.useState([]);
  React.useEffect(() => {
    combinarNovedades(mensajes, notificaciones);
  }, [mensajes, notificaciones]);
  const [loadingNotificaciones, setLoadingNotificaciones] =
    React.useState(true);
  const { user } = React.useContext(AuthContext);

  const fetchNotificaciones = async (destinatario, id, tipo) => {
    try {
      const data = await getNotificaciones(destinatario, id, tipo);
      if (tipo === 2) {
        setNotificaciones(data);
      } else if (tipo === 1) {
        setMensajes(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotificaciones(false);
    }
  };

  const marcarLeida = async (id, tipo) => {
    try {
      await setNotificacionLeida(id);
      if (tipo === 1) {
        if (user.role === "admin") {
          fetchNotificaciones(0, user?.optica_id, 1);
        } else {
          fetchNotificaciones(1, user?.id, 1);
        }
      } else if (tipo === 2) {
        if (user.role === "admin") {
          fetchNotificaciones(0, user?.optica_id, 2);
        } else {
          fetchNotificaciones(1, user?.id, 2);
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const combinarNovedades = (mensajes, notificaciones) => {
    const combinedNovedades = [...mensajes, ...notificaciones].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setNovedades(combinedNovedades);
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
    if (user?.role === "user") {
      fetchNotificaciones(1, user?.id, 2);
      fetchNotificaciones(1, user?.id, 1);
    } else if (user?.role === "admin") {
      fetchNotificaciones(0, user?.optica_id, 2);
      fetchNotificaciones(0, user?.optica_id, 1);
    }
  }, [user]);

  return (
    <NotificationsContext.Provider
      value={{
        notificaciones,
        mensajes,
        novedades,
        loading: loadingNotificaciones,
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
