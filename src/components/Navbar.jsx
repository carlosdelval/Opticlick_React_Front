import React, { useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import PrimaryButton from "./PrimaryButton";
import NotificationDropdown from "./NotificacionDropdown";
import DarkModeSwitch from "./DarkModeSwitch";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, authChecked, logout } = React.useContext(AuthContext);

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
      const userMenu = document.getElementById("user-menu-dropdown");
      const userMenuButton = document.getElementById("user-menu-button");

      if (
        userMenu &&
        !userMenu.contains(event.target) &&
        userMenuButton &&
        !userMenuButton.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full px-4 pt-4 border-t-2 md:px-10 bg-inherit">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl gap-4 mx-auto">
        <a
          href={user?.id ? "/dashboard" : "/"}
          className="flex items-center space-x-3 rounded-lg rtl:space-x-reverse"
        >
          <img
            src="/logo.png"
            className="h-14 md:h-8 transition-all duration-300 hover:drop-shadow-[0_0_10px_theme(colors.chryslerblue)] dark:hover:drop-shadow-[0_0_10px_theme(colors.vistablue)]"
            alt="OptiClick Logo"
          />
          <span className="hidden md:flex self-center text-2xl font-semibold duration-300 cursor-pointer whitespace-nowrap rounded-xl hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue">
            OptiClick
          </span>
        </a>
        <div className="flex items-center space-x-6 md:order-2 md:space-x-0 rtl:space-x-reverse">
          {!user && authChecked && (
            <ul className="flex-col hidden font-medium rounded-lg md:flex md:p-0 md:space-x-8 md:flex-row md:mt-0 md:items-center">
              <li className="md:py-2">
                <DarkModeSwitch />
              </li>
              <li className="md:py-2">
                <PrimaryButton
                  action={() => (window.location.href = "/business")}
                  text="Incluye tu negocio"
                  className="h-full"
                />
              </li>
              <li className="md:py-2">
                <a
                  href="/login"
                  className="flex items-center px-3 py-2 duration-300 rounded-xl hover:text-chryslerblue hover:dark:text-vistablue dark:text-babypowder"
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
                        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    <span>Iniciar sesión</span>
                  </div>
                </a>
              </li>
            </ul>
          )}
          {user && (
            <div className="relative flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
              <button
                id="user-menu-button"
                type="button"
                className="hidden text-sm rounded-full md:flex bg-inherit md:me-0"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="flex py-2 my-2 text-sm text-black duration-300 rounded-lg cursor-pointer hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue">
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
                <div
                  id="user-menu-dropdown"
                  className="absolute right-0 z-50 my-2 text-base list-none bg-white border-2 border-black divide-y divide-gray-100 rounded-lg shadow-sm top-full dark:bg-gray-700 dark:divide-gray-600 dark:border-gray-400"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-300">
                      {user.email}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm font-semibold text-gray-700 duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:text-babypowder dark:hover:text-white hover:text-chryslerblue"
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
                        className="block w-full px-4 py-2 text-sm font-semibold text-gray-700 duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:text-babypowder dark:hover:text-white hover:text-chryslerblue"
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
          <div className="flex md:hidden">
            <DarkModeSwitch />
          </div>
          {user && <NotificationDropdown />}
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm duration-300 rounded-lg cursor-pointer hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue md:hidden"
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
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col p-4 mt-4 font-medium rounded-lg md:p-0 md:space-x-8 md:flex-row md:mt-0">
            {user && user.role != "master" && (
              <li>
                <a
                  href="/dashboard"
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
            )}

            {user && user.role === "master" && (
              <li>
                <a
                  href="/administracion"
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
                        d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      />
                    </svg>
                    <span>Administración</span>
                  </div>
                </a>
              </li>
            )}
            {user?.role && user?.role != "user" && (
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
                    <span>{user?.role === "admin" ? "Listado clientes" : "Listado usuarios"}</span>
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
            {!user && authChecked && (
              <>
                <li className="md:hidden">
                  <button
                    onClick={() => (window.location.href = "/")}
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
                          d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                        />
                      </svg>
                      <span>Inicio</span>
                    </div>
                  </button>
                </li>
                <li className="md:hidden">
                  <button
                    onClick={() => (window.location.href = "/business")}
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
                          d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>Incluye tu negocio</span>
                    </div>
                  </button>
                </li>
                <li className="md:hidden">
                  <button
                    onClick={() => (window.location.href = "/login")}
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
                          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      <span>Iniciar sesión</span>
                    </div>
                  </button>
                </li>
                <li className="md:hidden">
                  <button
                    onClick={() => (window.location.href = "/register")}
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
                          d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      <span>Registrarme</span>
                    </div>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
