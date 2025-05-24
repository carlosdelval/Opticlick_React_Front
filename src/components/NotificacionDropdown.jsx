import React, { useState, useContext } from "react";
import { NotificationsContext } from "../context/NotificationsContext";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const { notificaciones, mensajes, marcarLeida } =
    useContext(NotificationsContext);

  const totalNoLeidos = notificaciones.length + mensajes.length;

  // Close dropdown when clicking outside
  const handleOutsideClick = (e) => {
    const button = e.target.closest("button");
    if (!dropdownRef.current?.contains(e.target) && !button) {
      setIsOpen(false);
    }
  };

  // Close dropdown when pressing Escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative md:hidden">
      {/* Botón campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 dark:text-babypowder hover:scale-110 transition-transform duration-200 hover:text-chryslerblue dark:hover:text-vistablue"
      >
        {/* Campana SVG */}
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {totalNoLeidos > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white transition-transform ease-in-out rounded-full bg-redpantone animate-pulse">
            {totalNoLeidos}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 z-50 p-3 mt-2 space-y-2 text-sm bg-white border-2 border-black rounded-lg shadow-lg w-72 dark:bg-gray-700 dark:border-gray-400"
        >
          <div className="flex items-center space-x-2 dark:text-babypowder">
            <svg
              className="w-8 h-8"
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
                d="m10.827 5.465-.435-2.324m.435 2.324a5.338 5.338 0 0 1 6.033 4.333l.331 1.769c.44 2.345 2.383 2.588 2.6 3.761.11.586.22 1.171-.31 1.271l-12.7 2.377c-.529.099-.639-.488-.749-1.074C5.813 16.73 7.538 15.8 7.1 13.455c-.219-1.169.218 1.162-.33-1.769a5.338 5.338 0 0 1 4.058-6.221Zm-7.046 4.41c.143-1.877.822-3.461 2.086-4.856m2.646 13.633a3.472 3.472 0 0 0 6.728-.777l.09-.5-6.818 1.277Z"
              />
            </svg>
            <h4 className="font-bold text-center">
              Notificaciones
            </h4>
          </div>
          <ul className="space-y-2">
            {notificaciones.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">
                ¡No tienes notificaciones!
              </li>
            )}
            {notificaciones.map((notif) => (
              <li
                key={notif.id}
                className="flex items-start justify-between p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col space-y-1 text-left">
                    <span className="text-sm font-extrabold dark:text-gray-300">
                      {notif.titulo}
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-300">
                      {notif.descripcion}
                    </span>
                  </div>
                  <button
                    onClick={() => marcarLeida(notif.id, 2)}
                      className=" text-chryslerblue dark:text-vistablue hover:scale-150 transition-transform duration-200"
                  >
                    <svg
                      className="w-6 h-6"
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
                        d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <hr className="border-gray-200 dark:border-gray-600" />

          <div className="flex items-center space-x-2 dark:text-babypowder">
            <svg
              className="w-8 h-8"
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
                d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"
              />
            </svg>
            <h4 className="font-bold text-center">Mensajes</h4>
          </div>
          <ul className="space-y-2">
            {mensajes.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">
                ¡No tienes mensajes!
              </li>
            )}
            {mensajes.map((msg) => (
              <li
                key={msg.id}
                className="flex items-start justify-between p-2 duration-300 ease-out rounded hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center w-full dark:text-gray-300">
                  <div className="flex flex-col w-3/4 space-y-1 text-left">
                    <span className="text-sm font-extrabold">
                      {msg.titulo}
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-300">
                      {msg.descripcion}
                    </span>
                  </div>
                  <div className="flex justify-end w-1/4">
                    <button
                      onClick={() => marcarLeida(msg.id, 1)}
                      className=" text-chryslerblue dark:text-vistablue hover:scale-150 transition-transform duration-200"
                    >
                      <svg
                        className="w-6 h-6"
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
                          d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
