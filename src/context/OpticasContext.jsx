import React from "react";
import PropTypes from "prop-types";
import { getOptica, getOpticas, setOptica } from "../api";

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
