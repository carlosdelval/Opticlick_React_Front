import React from "react";
import PropTypes from "prop-types";
import {
  getCliente,
  getAdmins,
  getClientes,
  getClientesOptica,
  getAdminsOptica,
  registerUser,
  deleteUser,
  updateUser,
  deleteUserOptica,
  updatePassword,
} from "../api";

const UserContext = React.createContext();
const UserProvider = ({ children }) => {
  const [clientes, setClientes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [admins, setAdmins] = React.useState([]);

  // Obtener todos los usuarios clientes
  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  // Obtener todos los usuarios administradores
  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  // Obtener todos los usuarios clientes por óptica
  const fetchClientesOptica = async (id) => {
    try {
      const data = await getClientesOptica(id);
      setClientes(data);
    } catch (error) {
      console.error("Error fetching clientes optica:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  // Obtener todos los usuarios administradores por óptica
  const fetchAdminsOptica = async (id) => {
    try {
      const data = await getAdminsOptica(id);
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins optica:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  // Obtener un usuario cliente por id
  const fetchCliente = async (id) => {
    try {
      const data = await getCliente(id);
      return data;
    } catch (error) {
      console.error("Error fetching cliente:", error);
    }
  };
  // Registrar un usuario cliente
  const registrarCliente = async (userData) => {
    try {
      const data = await registerUser(userData);
      return data;
    } catch (error) {
      console.error(
        "Error fetching registerCliente:",
        error.response?.data || error.message
      );
      throw error.response?.data || { error: "Error desconocido" };
    }
  };

  // Eliminar un usuario cliente
  const eliminarCliente = async (id) => {
    try {
      const data = await deleteUser(id);
      return data;
    } catch (error) {
      console.error("Error deleting cliente:", error);
    }
  };
  // Actualizar un usuario cliente
  const actualizarCliente = async (userData) => {
    try {
      const data = await updateUser(userData);
      return data;
    } catch (error) {
      console.error("Error updating cliente:", error);
    }
  };
  // Actualizar contraseña de un usuario
  const actualizarContrasena = async (userData) => {
    try {
      const data = await updatePassword(userData);
      return data;
    } catch (error) {
      console.error(
        "Error updating cliente:",
        error.response?.data || error.message
      );
      throw error.response?.data || { error: "Error desconocido" };
    }
  };
  // Eliminar un usuario cliente de una óptica
  const eliminarClienteOptica = async (id, optica_id) => {
    try {
      const data = await deleteUserOptica(id, optica_id);
      fetchClientesOptica(optica_id);
      return data;
    } catch (error) {
      console.error("Error deleting cliente optica:", error);
    }
  };
  React.useEffect(() => {
    fetchClientes();
    fetchAdmins();
  }, []);
  return (
    <UserContext.Provider
      value={{
        clientes,
        setClientes,
        loading,
        setLoading,
        fetchClientes,
        fetchCliente,
        admins,
        fetchAdmins,
        fetchClientesOptica,
        fetchAdminsOptica,
        registrarCliente,
        eliminarCliente,
        actualizarCliente,
        eliminarClienteOptica,
        actualizarContrasena,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
UserContext.displayName = "UserContext";
export { UserProvider };
export default UserContext;
