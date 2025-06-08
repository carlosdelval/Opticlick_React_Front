import React from "react";
import AuthContext from "../context/AuthContext";

const Footer = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <footer className="px-10 py-10 mt-auto bg-inherit md:py-5">
      <div className="grid items-center grid-cols-1 gap-6 mx-auto font-semibold md:grid-cols-3">
        {/* Columna izquierda: info y créditos */}
        <div className="space-y-2 text-sm text-center md:text-left dark:text-babypowder">
          <p>
            &copy; {new Date().getFullYear()} OptiClick. Todos los derechos
            reservados.
          </p>
          <p>
            Desarrollado por{" "}
            <a
              href="https://github.com/carlosdelval"
              className="font-bold duration-300 text-chryslerblue dark:text-vistablue hover:underline hover:animate-pulse"
            >
              Carlos López Del Val
            </a>
          </p>
        </div>

        {/* Columna centro: enlaces */}
        <div className="space-y-2 text-sm text-center">
          <ul className="flex flex-wrap justify-center gap-4">
            <li>
              <a
                href="informacion#privacy"
                className="duration-300 hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue"
              >
                Política de Privacidad
              </a>
            </li>
            <li>
              <a
                href="business"
                className="duration-300 hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue"
              >
                Quiénes Somos
              </a>
            </li>
            <li>
              <a
                href="informacion#terms"
                className="duration-300 hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue"
              >
                Condiciones de Uso
              </a>
            </li>
            <li>
              <a
                href="informacion#legal"
                className="duration-300 hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue"
              >
                Información legal
              </a>
            </li>
            <li>
              <a
                href="informacion#contact"
                className="duration-300 hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Columna derecha: botones de app y redes */}
        <div className="flex flex-col items-center space-y-4 md:items-end">
          {!user && (
            <div className="flex flex-col gap-3 xl:flex-row">
              <button
                type="button"
                className="flex items-center justify-center w-48 mt-3 text-white bg-black h-14 rounded-xl dark:text-black dark:bg-babypowder"
                onClick={() =>
                  (window.location.href = "https://www.apple.com/es/app-store/")
                }
              >
                <div className="mr-3">
                  <svg viewBox="0 0 384 512" width="30">
                    <path
                      fill="currentColor"
                      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="-mt-1 font-sans text-xl font-semibold">
                    App Store
                  </div>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-48 mt-3 text-white bg-black rounded-lg dark:bg-babypowder dark:text-black h-14"
                onClick={() =>
                  (window.location.href =
                    "https://play.google.com/store/games?hl=es_419")
                }
              >
                <div className="mr-3">
                  <svg viewBox="30 336.7 120.9 129.2" width="30">
                    <path
                      fill="#FFD400"
                      d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
                    ></path>
                    <path
                      fill="#FF3333"
                      d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
                    ></path>
                    <path
                      fill="#48FF48"
                      d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
                    ></path>
                    <path
                      fill="#3BCCFF"
                      d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="-mt-1 font-sans text-xl font-semibold">
                    Google Play
                  </div>
                </div>
              </button>
            </div>
          )}
          <div className="flex gap-4 text-lg xl:h-10">
            <a
              href="#"
              aria-label="Instagram"
              className="duration-300 hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue"
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
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="duration-300 hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              aria-label="X"
              className="duration-300 hover:text-chryslerblue dark:text-babypowder dark:hover:text-vistablue"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
