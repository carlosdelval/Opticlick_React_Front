import axios from "axios";

const API_URL = "http://localhost:5000";

// Obtener usuarios
export const getClientes = async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
};

// Obtener usuarios por óptica
export const getClientesOptica = async (id) => {
  const res = await axios.get(`${API_URL}/users/${id}`);
  return res.data;
}

// Registrar usuario
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

// Editar usuario
export const updateUser = async (userData) => {
  const res = await axios.put(`${API_URL}/users`, userData);
  return res.data;
};

// Obtener ópticas
export const getOpticas = async () => {
  const res = await axios.get(`${API_URL}/opticas`);
  return res.data;
};

// Obtener óptica por id
export const getOptica = async (id) => {
  const res = await axios.get(`${API_URL}/opticas/${id}`);
  return res.data;
};

// Obtener citas
export const getCitas = async () => {
  const res = await axios.get(`${API_URL}/citas`);
  return res.data;
};

// Obtener cita por fecha y hora
export const getCitaFechaHora = async (fecha, hora, optica_id) => {
  const res = await axios.get(`${API_URL}/citas/${fecha}/${hora}/${optica_id}`);
  return res.data;
};

// Obtener citas de un usuario
export const getCitasUser = async (id) => {
  const res = await axios.get(`${API_URL}/citas-user/${id}`);
  return res.data;
};

// Obtener citas graduadas de un usuario
export const getCitasGraduadasUser = async (id) => {
  const res = await axios.get(`${API_URL}/citas-graduadas/${id}`);
  return res.data;
};

// Obtener cliente de una cita
export const getClienteCita = async (id) => {
  const res = await axios.get(`${API_URL}/user-citas/${id}`);
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

// Eliminar user
export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}/users/${id}`);
  return res.data;
};

// Obtener graduación por id de cita
export const getGraduacion = async (id) => {
  const res = await axios.get(`${API_URL}/graduaciones/${id}`);
  return res.data;
};

// Agregar graduación
export const addGraduacion = async (graduacion) => {
  const res = await axios.post(`${API_URL}/graduaciones`, graduacion);
  return res.data;
};

// Marcar cita como graduada
export const setGraduada = async (id) => {
  const res = await axios.put(`${API_URL}/citas/${id}`);
  return res.data;
};
