import React from "react";
import PropTypes from "prop-types";
import {
  getOptica,
  getOpticas,
  setOptica,
  addOptica,
  updateOptica,
  deleteOptica,
} from "../api";

const OpticasContext = React.createContext();
const OpticasProvider = ({ children }) => {
  const [opticas, setOpticas] = React.useState([]);

  const fetchOpticas = async () => {
    try {
      const data = await getOpticas();
      setOpticas(data);
    } catch (error) {
      console.error("Error fetching opticas:", error);
    }
  };
  const addNewOptica = async (optica) => {
    try {
      const data = await addOptica(optica);
      fetchOpticas(); // Refresh the list after adding
      return data;
    } catch (error) {
      console.error("Error adding optica:", error);
    }
  };
  const updateOpticaById = async (id, optica) => {
    try {
      const data = await updateOptica(id, optica);
      fetchOpticas(); // Refresh the list after update
      return data;
    } catch (error) {
      console.error("Error updating optica:", error);
    }
  };
  const deleteOpticaById = async (id) => {
    try {
      await deleteOptica(id);
      setOpticas((prevOpticas) => prevOpticas.filter((o) => o.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting optica:", error);
      return false;
    }
  };
  const fetchOptica = async (id) => {
    try {
      const data = await getOptica(id);
      return data;
    } catch (error) {
      console.error("Error fetching optica:", error);
    }
  };
  const asignarOptica = async (id, optica_id) => {
    try {
      const data = await setOptica(id, optica_id);
      return data;
    } catch (error) {
      console.error("Error fetching setOptica:", error);
    }
  };
  React.useEffect(() => {
    fetchOpticas();
  }, []);
  return (
    <OpticasContext.Provider
      value={{
        opticas,
        fetchOpticas,
        fetchOptica,
        asignarOptica,
        addNewOptica,
        updateOpticaById,
        deleteOpticaById,
      }}
    >
      {children}
    </OpticasContext.Provider>
  );
};
OpticasProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
OpticasContext.displayName = "OpticasContext";
export { OpticasProvider };
export default OpticasContext;
