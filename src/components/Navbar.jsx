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
          <img src="././public/logo.png" className="h-8" alt="OptiClick Logo" />
          <span className="self-center text-2xl font-semibold duration-300 cursor-pointer whitespace-nowrap rounded-xl dark:text-white hover:text-chryslerblue">
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
              ><div className="flex px-3 py-2 m-2 text-sm text-black duration-300 rounded-lg cursor pointer-xl hover:text-chryslerblue"><span className="p-1 font-medium">{user.name}</span>
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
                </svg></div>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 z-50 my-2 text-base list-none divide-y divide-gray-100 rounded-lg shadow-sm bg-babypowder top-full dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
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
                      <a
                        href="#"
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
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
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {user && (
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm duration-300 rounded-lg cursor-pointer hover:text-chryslerblue md:hidden"
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
                  className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-chryslerblue"
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
                    href="/mis-revisiones"
                    className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-chryslerblue"
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
                    href="/mis-citas"
                    className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-chryslerblue"
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
              </>
            )}
            {user?.role === "admin" && (
              <li>
                <a
                  href="/lista-clientes"
                  className="block px-3 py-2 m-2 duration-300 cursor-pointerblock rounded-xl hover:text-chryslerblue"
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
                    className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-chryslerblue"
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
                  <a
                    href="#"
                    onClick={logout}
                    className="block px-3 py-2 m-2 duration-300 cursor-pointer rounded-xl hover:text-chryslerblue"
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
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
