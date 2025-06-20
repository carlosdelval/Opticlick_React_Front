import axios from "axios";

const API_URL = "https://opticlick-react-back.onrender.com";
const user = JSON.parse(localStorage.getItem("user"));

// Verificar email
export const verifyEmail = async (token) => {
  const res = await axios.get(`${API_URL}/verify-email/${token}`);
  return res.data;
};

// Reenviar email verificacion
export const resendEmail = async (email) => {
  const res = await axios.post(`${API_URL}/resend-email`, { email });
  return res.data;
};

// Iniciar sesión
export const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
};

// Iniciar sesión con Google
export const loginConGoogle = async (userData) => {
  const res = await axios.post(`${API_URL}/login-google`, userData);
  return res.data;
};

// Obtener usuarios clientes
export const getClientes = async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
};

// Obtener usuarios administradores
export const getAdmins = async () => {
  const res = await axios.get(`${API_URL}/admins`);
  return res.data;
};

// Obtener óptica de un admin
export const getOpticaUsuario = async (id) => {
  const res = await axios.get(`${API_URL}/optica-usuario/${id}`);
  return res.data;
};

// Obtener admins de una óptica
export const getAdminsOptica = async (id) => {
  const res = await axios.get(`${API_URL}/admins-optica/${id}`);
  return res.data;
};

// Asignar óptica a un usuario
export const setOptica = async (id, optica_id) => {
  const res = await axios.put(`${API_URL}/asignar-optica`, {
    user_id: id,
    optica_id: optica_id,
  });
  return res.data;
};

// Eliminar usuario de una óptica
export const deleteUserOptica = async (id, optica_id) => {
  const res = await axios.delete(`${API_URL}/users-optica/${id}/${optica_id}`);
  return res.data;
};

// Obtener usuario por id
export const getCliente = async (id) => {
  const res = await axios.get(`${API_URL}/users/${id}`);
  return res.data;
};

// Obtener usuarios por óptica
export const getClientesOptica = async (id) => {
  const res = await axios.get(`${API_URL}/users-optica/${id}`);
  return res.data;
};

// Registrar usuario
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

// Editar usuario (api.js)
export const updateUser = async (userData) => {
  try {
    const res = await axios.put(`${API_URL}/users`, userData);
    return res.data; // Si todo va bien, devuelve los datos
  } catch (error) {
    // Si hay un error (400, 500, etc.), devuelve el mensaje del backend
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Lanza el error específico del backend
    } else {
      throw new Error("Error al actualizar el usuario"); // Error genérico
    }
  }
};

//Actualizar contraseña
export const updatePassword = async (userData) => {
  const token = user.token;

  const res = await axios.put(`${API_URL}/update-password`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

// Agregar óptica
export const addOptica = async (optica) => {
  const res = await axios.post(`${API_URL}/opticas`, optica);
  return res.data;
};
// Editar óptica
export const updateOptica = async (id, optica) => {
  const res = await axios.put(`${API_URL}/opticas/${id}`, optica);
  return res.data;
};
// Eliminar óptica
export const deleteOptica = async (id) => {
  const res = await axios.delete(`${API_URL}/opticas/${id}`);
  return res.data;
};

// Obtener citas
export const getCitas = async () => {
  const res = await axios.get(`${API_URL}/citas`);
  return res.data;
};

// Obtener citas por óptica
export const getCitasOptica = async (id) => {
  const res = await axios.get(`${API_URL}/citas-optica/${id}`);
  return res.data;
};

// Obtener todas las citas reservadas en una fecha de una optica
export const getCitasReservadasFecha = async (id, fecha) => {
  const res = await axios.get(`${API_URL}/citas-reservadas/${id}/${fecha}`);
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

// Editar graduación
export const updateGraduacion = async (id, graduacion) => {
  const res = await axios.put(`${API_URL}/graduaciones/${id}`, graduacion);
  return res.data;
};

// Eliminar graduación
export const deleteGraduacion = async (id) => {
  const res = await axios.delete(`${API_URL}/graduaciones/${id}`);
  return res.data;
};

// Marcar cita como graduada
export const setGraduada = async (id) => {
  const res = await axios.put(`${API_URL}/citas/${id}`);
  return res.data;
};

// Obtener notificaciones de un usuario
export const getNotificaciones = async (destinatario, id, tipo) => {
  const res = await axios.get(
    `${API_URL}/notificaciones/${destinatario}/${id}/${tipo}`
  );
  return res.data;
};

// Marcar notificacion como leida
export const setNotificacionLeida = async (id) => {
  const res = await axios.put(`${API_URL}/notificaciones/${id}`);
  return res.data;
};

// Crear notificacion
export const createNotificacion = async (notificacion) => {
  const res = await axios.post(`${API_URL}/notificaciones`, notificacion);
  return res.data;
};
