import React, { useState, useEffect } from "react";

const Navbar = () => {
  // Estado para controlar el menú colapsable
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Estado para controlar el menú de usuario
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Escuchar el cambio de tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      // Cerrar el menú desplegable si la pantalla es menor que md (768px)
      if (window.innerWidth < 768) {
        setIsUserMenuOpen(false);
      }
    };

    // Agregar el listener de resize
    window.addEventListener("resize", handleResize);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="border-gray-200 bg-inherit dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="././public/logo.png" className="h-8" alt="OptiClick Logo" />
          <span className="self-center text-2xl font-semibold duration-300 cursor-pointer whitespace-nowrap rounded-xl dark:text-white hover:text-indigo-600">
            OptiClick
          </span>
        </a>
        <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          {/* Botón del menú de usuario */}
          <div className="relative flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
            {/* Botón del menú de usuario */}
            <button
              type="button"
              className="hidden text-sm rounded-full md:flex bg-inherit md:me-0"
              id="user-menu-button"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <svg
                className="w-6 h-6 text-black duration-300 cursor-pointer rounded-xl hover:text-indigo-600 dark:text-white dark:hover:text-indigo-600"
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
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>

            {/* Menú de usuario (desplegable) */}
            <div
              className={`absolute ${
                isUserMenuOpen ? "block" : "hidden"
              } top-full right-0 z-50 my-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600`}
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  Bonnie Green
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  name@flowbite.com
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Mi perfil
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Cerrar sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Botón del menú hamburguesa (para móviles) */}
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm duration-300 rounded-lg cursor-pointer hover:text-indigo-600 md:hidden"
            aria-controls="navbar-user"
            aria-expanded={isNavOpen}
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <span className="sr-only">Abrir menú principal</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
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
        </div>

        {/* Menú colapsable (para móviles) */}
        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul className="flex flex-col p-4 mt-4 font-medium rounded-lg md:p-0 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
            <li>
              <a
                href="/"
                className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-indigo-600"
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
                      d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                    />
                  </svg>
                  <span>Inicio</span>
                </div>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-indigo-600"
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
                      d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                    />
                  </svg>
                  <span>Mis revisiones</span>
                </div>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-indigo-600"
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
                      d="m11.5 11.5 2.071 1.994M4 10h5m11 0h-1.5M12 7V4M7 7V4m10 3V4m-7 13H8v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L10 17Zm-5 3h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                    />
                  </svg>
                  <span>Reservar cita</span>
                </div>
              </a>
            </li>
            <li className="md:hidden">
              <a
                href="/"
                className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-indigo-600"
                aria-current="page"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Mi perfil</span>
                </div>
              </a>
            </li>
            <li className="md:hidden">
              <a
                href="/"
                className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-indigo-600"
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
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
