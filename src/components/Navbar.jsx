import React, { useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = React.useContext(AuthContext);

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

  return (
    <nav className="border-gray-200 bg-inherit dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
        <a href={user?.role === "user" ? "/dashboard" : user?.role === "admin" ? "/admin-dashboard" : "/"} className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="././public/logo.png" className="h-8" alt="OptiClick Logo" />
          <span className="self-center text-2xl font-semibold duration-300 cursor-pointer whitespace-nowrap rounded-xl dark:text-white hover:text-indigo-600">
            OptiClick
          </span>
        </a>
        <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          {user && (
            <div className="relative flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                className="hidden text-sm rounded-full md:flex bg-inherit md:me-0"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <svg
                  className="w-6 h-6 text-black duration-300 cursor-pointer rounded-xl hover:text-indigo-600 dark:text-white dark:hover:text-indigo-600"
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
              {isUserMenuOpen && (
                <div className="absolute right-0 z-50 my-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm top-full dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {user.name}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {user.email}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Mi perfil
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Cerrar sesión
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm duration-300 rounded-lg cursor-pointer hover:text-indigo-600 md:hidden"
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
        </div>
        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col p-4 mt-4 font-medium rounded-lg md:p-0 md:space-x-8 md:flex-row md:mt-0">
            {user && (
              <li>
                <a
                  href={user?.role === "user" ? "/dashboard" : "/admin-dashboard"}
                  className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-indigo-600"
                >
                  Inicio
                </a>
              </li>
            )}
            {user?.role === "user" && (
              <>
                <li>
                  <a
                    href="/mis-revisiones"
                    className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-indigo-600"
                  >
                    Mis revisiones
                  </a>
                </li>
                <li>
                  <a
                    href="/mis-citas"
                    className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-indigo-600"
                  >
                    Reservar cita
                  </a>
                </li>
              </>
            )}
            {user?.role === "admin" && (
              <li>
                <a
                  href="/lista-clientes"
                  className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-indigo-600"
                >
                  Listado clientes
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
