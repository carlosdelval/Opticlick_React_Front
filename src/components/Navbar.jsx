import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import timeNavigation from "../assets/time.json";
import { Modal } from "flowbite-react";
import PrimaryButton from "./PrimaryButton";
import InputField from "./InputField";
import AuthContext from "../context/AuthContext";
import { addCita, getCitaFechaHora } from "../api";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = React.useContext(AuthContext);
  const [openModal, setOpenModal] = React.useState(false);
  const [opticas, setOpticas] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const [horas, setHoras] = React.useState([]);
  const [formData, setFormData] = React.useState({
    optica_id: "",
    user_id: "",
    turno: "",
    hora: "",
    fecha: "",
  });

  useEffect(() => {
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
      // Reset hora when turno changes
      setFormData((prev) => ({ ...prev, hora: "" }));
    } else {
      setHoras([]);
    }
  }, [formData.turno]);
  const id = user?.id || null;
  const handleReservarCita = async (id) => {
    const { optica_id, fecha, hora } = formData;
    const data = {
      user_id: id,
      optica_id,
      fecha,
      hora,
    };
    try {
      await addCita(data);
      setOpenModal(false);
      setFormData({
        optica_id: "",
        user_id: "",
        turno: "",
        hora: "",
        fecha: "",
      });
      navigate("/dashboard/success='¡Cita reservada con éxito!'");
    } catch (error) {
      console.error("Error reservando cita:", error);
    }
  };

  const fetchOpticas = async () => {
    try {
      const response = await fetch(`http://localhost:5000/opticas`);
      const data = await response.json();
      console.log("Raw fetch data:", data);
      setOpticas(data);
    } catch (error) {
      console.error("Simple fetch error:", error);
    }
  };

  useEffect(() => {
    fetchOpticas();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.optica_id) {
      newErrors.optica_id = "Debe seleccionar una óptica.";
    }
    if (!formData.fecha) {
      newErrors.fecha = "Debe seleccionar una fecha.";
    }
    if (!formData.turno) {
      newErrors.turno = "Debe seleccionar un turno.";
    }
    if (formData.fecha) {
      const selectedDate = new Date(formData.fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.fecha = "La fecha no puede ser anterior a la fecha actual.";
      }

      // Si la fecha es hoy, validar que la hora no sea anterior a la actual
      if (
        selectedDate.toDateString() === today.toDateString() &&
        formData.hora
      ) {
        const [hours, minutes] = formData.hora.split(":").map(Number);
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes, 0, 0);

        const currentTime = new Date();

        if (selectedTime < currentTime) {
          newErrors.hora =
            "La hora no puede ser anterior a la hora actual en el día de hoy.";
        }
      }
    }
    if (!formData.hora) {
      newErrors.hora = "Debe seleccionar una hora";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    const newErrors = {};
    e.preventDefault();
    if (validateForm()) {
      try {
        const { fecha, hora, optica_id } = formData;
        const existingAppointments = await getCitaFechaHora(
          fecha,
          hora,
          optica_id
        );
        if (existingAppointments.length > 0) {
          newErrors.hora =
            "La hora para esta fecha ya está reservada en la óptica seleccionada.";
          setErrors(newErrors);
          return;
        }

        await handleReservarCita(id);
        navigate("/dashboard/success='¡Cita reservada con éxito!'");
      } catch (error) {
        console.error("Error reservando cita:", error);
      }
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenu = document.getElementById('user-menu-dropdown');
      const userMenuButton = document.getElementById('user-menu-button');
      
      if (userMenu && !userMenu.contains(event.target) && 
          userMenuButton && !userMenuButton.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-inherit">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
        <a
          href={
            user?.role === "user"
              ? "/dashboard"
              : user?.role === "admin"
              ? "/admin-dashboard"
              : "/"
          }
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="./logo.png" className="h-8" alt="OptiClick Logo" />
          <span className="self-center text-2xl font-semibold duration-300 cursor-pointer whitespace-nowrap rounded-xl dark:hover:text-vistablue dark:text-babypowder hover:text-chryslerblue">
            OptiClick
          </span>
        </a>
        <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          {user && (
            <div className="relative flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
              <button
                id="user-menu-button"
                type="button"
                className="hidden text-sm rounded-full md:flex bg-inherit md:me-0"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="flex px-3 py-2 m-2 text-sm text-black duration-300 rounded-lg cursor-pointer hover:text-chryslerblue dark:text-babypowder">
                  <span className="p-1 font-medium">{user.name}</span>
                  <svg
                    className="w-6 h-6 my-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
              </button>
              {isUserMenuOpen && (
                <div id="user-menu-dropdown" className="absolute right-0 z-50 my-2 text-base list-none bg-white border-2 border-black divide-y divide-gray-100 rounded-lg shadow-sm top-full dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {user.email}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm font-semibold text-gray-700 duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white hover:text-chryslerblue"
                      >
                        <div className="flex space-x-2">
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="square"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                            />
                          </svg>
                          <span>Mi perfil</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2 text-sm font-semibold text-gray-700 duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white hover:text-chryslerblue"
                      >
                        <div className="flex space-x-2">
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M18 18V6h-5v12h5Zm0 0h2M4 18h2.5m3.5-5.5V12M6 6l7-2v16l-7-2V6Z"
                            />
                          </svg>
                          <span>Cerrar sesión</span>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {user && (
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm duration-300 rounded-lg cursor-pointer hover:text-chryslerblue dark:text-babypowder md:hidden"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          )}
        </div>
        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col p-4 mt-4 font-medium rounded-lg md:p-0 md:space-x-8 md:flex-row md:mt-0">
            {user && (
              <li>
                <a
                  href={
                    user?.role === "user" ? "/dashboard" : "/admin-dashboard"
                  }
                  className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-chryslerblue hover:dark:text-vistablue dark:text-babypowder"
                >
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                      />
                    </svg>
                    <span>Inicio</span>
                  </div>
                </a>
              </li>
            )}
            {user?.role === "user" && (
              <>
                <li>
                  <a
                    href="/historial"
                    className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-chryslerblue hover:dark:text-vistablue dark:text-babypowder"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                        />
                      </svg>
                      <span>Mis revisiones</span>
                    </div>
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-chryslerblue hover:dark:text-vistablue dark:text-babypowder"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m11.5 11.5 2.071 1.994M4 10h5m11 0h-1.5M12 7V4M7 7V4m10 3V4m-7 13H8v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L10 17Zm-5 3h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                        />
                      </svg>
                      <span>Reservar cita</span>
                    </div>
                  </button>
                </li>
              </>
            )}
            {user?.role === "admin" && (
              <li>
                <a
                  href="/lista-clientes"
                  className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-chryslerblue hover:dark:text-vistablue dark:text-babypowder"
                >
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                      />
                    </svg>
                    <span>Listado clientes</span>
                  </div>
                </a>
              </li>
            )}
            {user && (
              <>
                <li className="md:hidden">
                  <a
                    href="/profile"
                    className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-chryslerblue hover:dark:text-vistablue dark:text-babypowder"
                    aria-current="page"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                        />
                      </svg>
                      <span>Mi perfil</span>
                    </div>
                  </a>
                </li>
                <li className="md:hidden">
                  <button
                    onClick={logout}
                    className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-chryslerblue hover:dark:text-vistablue dark:text-babypowder"
                    aria-current="page"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18 18V6h-5v12h5Zm0 0h2M4 18h2.5m3.5-5.5V12M6 6l7-2v16l-7-2V6Z"
                        />
                      </svg>
                      <span>Cerrar sesión</span>
                    </div>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <Modal
        className="justify-center bg-gray-200 bg-opacity-50"
        size="md"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className="justify-center p-4 border-2 border-black rounded-md shadow-sm dark:border-gray-700">
          <Modal.Header className="p-4">
            <div className="flex">
              <Lottie animationData={timeNavigation} style={{ height: 60 }} />
              <h2 className="my-4 text-2xl font-bold text-center">
                Reservar cita
              </h2>
            </div>
          </Modal.Header>
          <Modal.Body className="justify-center p-4">
            <form onSubmit={handleSubmit}>
              <div className="my-2">
                <InputField
                  type="select"
                  text="Óptica"
                  placeholder={"Seleccione una óptica"}
                  value={opticas.map((optica) => ({
                    display: optica.nombre,
                    value: optica.id,
                  }))}
                  selectedValue={formData.optica_id}
                  onChange={(value) =>
                    setFormData({ ...formData, optica_id: value })
                  }
                />
                <InputField
                  type="date"
                  text="Fecha"
                  value={formData.fecha}
                  error={errors.fecha}
                  onChange={(value) =>
                    setFormData({ ...formData, fecha: value })
                  }
                />
                <InputField
                  type="select"
                  text="Turno"
                  placeholder={"Seleccione un turno"}
                  value={[
                    { display: "Mañana", value: "mañana" },
                    { display: "Tarde", value: "tarde" },
                  ]}
                  selectedValue={formData.turno}
                  error={errors.turno}
                  onChange={(value) =>
                    setFormData({ ...formData, turno: value })
                  }
                />
                <InputField
                  type="select"
                  text="Hora"
                  placeholder={"Seleccione una hora"}
                  value={horas.map((hora) => ({
                    display: hora,
                    value: hora,
                  }))}
                  selectedValue={formData.hora}
                  error={errors.hora}
                  onChange={(value) =>
                    setFormData({ ...formData, hora: value })
                  }
                  hidden={formData.turno ? "" : "hidden"}
                />
              </div>
              <div className="flex justify-end">
                <PrimaryButton classes={"mt-4"} text="Reservar" />
              </div>
            </form>
          </Modal.Body>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
