import axios from "axios";

const API_URL = "http://localhost:5000";

// Obtener clientes
export const getClientes = async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
};

// Agregar cliente
export const addCliente = async (cliente) => {
  const res = await axios.post(`${API_URL}/clientes`, cliente);
  return res.data;
};

// Obtener citas
export const getCitas = async () => {
  const res = await axios.get(`${API_URL}/citas`);
  return res.data;
};

// Agregar cita
export const addCita = async (cita) => {
  const res = await axios.post(`${API_URL}/citas`, cita);
  return res.data;
};

// Eliminar cita
export const deleteCita = async (id) => {
  const res = await axios.delete(`${API_URL}/citas/${id}`);
  return res.data;
};
