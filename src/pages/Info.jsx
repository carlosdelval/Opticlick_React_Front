//Página de información legal, política de privacidad y condiciones de uso
import React from "react";

const Info = () => {
  const [activeTab, setActiveTab] = React.useState("legal");

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setActiveTab(hash);
  }, []);

  React.useEffect(() => {
    const handleHashChange = () => {
      const newTab = window.location.hash.replace("#", "");
      setActiveTab(newTab || "legal");
    };

    window.addEventListener("hashchange", handleHashChange);

    // Ejecuta al cargar también
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="flex flex-col w-full gap-8 my-auto md:mx-auto max-w-7xl md:flex-row">
      <div className="p-4 bg-white border-2 border-black rounded-lg shadow-lg dark:border-gray-400 dark:bg-gray-700 md:w-1/4 h-min animate-fade-in">
        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-babypowder">
          Menú
        </h3>
        <ul className="space-y-2">
          {["legal", "privacy", "terms", "contact"].map((tab) => (
            <button
              key={tab}
              className={`p-3 rounded-md cursor-pointer w-full text-left transition-all duration-200 ${
                activeTab === tab
                  ? "bg-blue-100 font-medium text-chryslerblue border-l-4 border-chryslerblue dark:border-vistablue dark:bg-gray-900 dark:text-babypowder"
                  : "hover:bg-blue-50 hover:text-blue-70 dark:hover:bg-gray-800 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "legal" && (
                <div className="flex flex-row space-x-2">
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
                      strokeWidth="2"
                      d="M3 21h18M4 18h16M6 10v8m4-8v8m4-8v8m4-8v8M4 9.5v-.955a1 1 0 0 1 .458-.84l7-4.52a1 1 0 0 1 1.084 0l7 4.52a1 1 0 0 1 .458.84V9.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5Z"
                    />
                  </svg>
                  <p>Información legal</p>
                </div>
              )}
              {tab === "privacy" && (
                <div className="flex flex-row space-x-2">
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
                      d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                    />
                  </svg>
                  <p>Política de privacidad</p>
                </div>
              )}
              {tab === "terms" && (
                <div className="flex flex-row space-x-2">
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
                      d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                    />
                  </svg>
                  <p>Condiciones de uso</p>
                </div>
              )}
              {tab === "contact" && (
                <div className="flex flex-row space-x-2">
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
                      strokeWidth="2"
                      d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                    />
                  </svg>
                  <p>Contacto</p>
                </div>
              )}
            </button>
          ))}
        </ul>
      </div>
      <div className="p-6 bg-white border-2 border-black rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-400 md:w-3/4 animate-fade-in">
        {activeTab === "legal" && (
          <div className="space-y-5 animate-fade-in dark:text-babypowder">
            <div className="space-y-6">
              <h2 className="pb-2 text-2xl font-bold text-gray-900 border-b border-gray-200 dark:text-babypowder">
                Información Legal
              </h2>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-babypowder">
                  Reglamento de Servicios Digitales
                </h3>

                <div className="p-4 space-y-3 rounded-lg bg-blue-50 dark:bg-gray-800">
                  <h4 className="text-lg font-medium text-gray-700 dark:text-babypowder">
                    Número medio de perceptores activos mensuales
                  </h4>
                  <p className="leading-relaxed text-gray-600 dark:text-babypowder">
                    El número medio de destinatarios activos mensuales en la UE
                    de nuestra plataforma online que opera en{" "}
                    <span className="font-semibold text-chryslerblue dark:text-vistablue">
                      www.OptiClick.com
                    </span>{" "}
                    y está dedicada a España es{" "}
                    <span className="font-bold">1813243</span> (para el período
                    de: 05.2024–01.2026)
                  </p>
                </div>

                <div className="p-4 space-y-3 rounded-lg bg-blue-50 dark:bg-gray-800">
                  <h4 className="text-lg font-medium text-gray-700 dark:text-babypowder">
                    Puntos de contacto
                  </h4>
                  <p className="leading-relaxed text-gray-600 dark:text-babypowder">
                    El punto de contacto para los destinatarios de nuestros
                    servicios:
                  </p>
                  <ul className="pl-5 space-y-2 text-gray-600 list-disc dark:text-babypowder">
                    <li>
                      Para los clientes está disponible{" "}
                      <a
                        href="#contact"
                        className="font-semibold transition-colors hover:underline text-chryslerblue dark:text-vistablue"
                      >
                        aquí
                      </a>
                      .
                    </li>
                    <li>
                      Para los socios está disponible{" "}
                      <a
                        href="#contact"
                        className="font-semibold transition-colors hover:underline text-chryslerblue dark:text-vistablue"
                      >
                        aquí
                      </a>
                      .
                    </li>
                  </ul>

                  <p className="mt-3 leading-relaxed text-gray-600 dark:text-babypowder">
                    <span className="font-semibold">
                      El punto de contacto para las autoridades de los Estados
                      miembros, la Comisión Europea y la Junta de Servicios
                      Digitales es:
                    </span>{" "}
                    <a
                      href="mailto:dsa@opticlick.com"
                      className="font-semibold transition-colors hover:underline text-chryslerblue dark:text-vistablue"
                    >
                      dsa@opticlick.com
                    </a>{" "}
                    . Puedes contactarnos en español o en inglés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "privacy" && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="pb-2 text-2xl font-bold text-gray-900 border-b border-gray-200 dark:text-babypowder">
              Política de Privacidad
            </h2>

            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              En <strong>OptiClick</strong>, nos comprometemos a proteger la
              privacidad y la seguridad de los datos personales de nuestros
              usuarios. Esta política explica cómo gestionamos la información
              que recopilamos a través de nuestra plataforma para agendar citas
              de graduación de vista en diferentes ópticas.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              1. Responsable del tratamiento
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              El responsable es <strong>OptiClick S.L.</strong>, con domicilio
              en Puente Genil, Córdoba. Puedes contactarnos en:{" "}
              <a
                href="mailto:privacidad@opticlick.com"
                className="font-semibold text-chryslerblue hover:underline dark:text-vistablue"
              >
                privacidad@opticlick.com
              </a>
              .
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              2. Datos personales que recopilamos
            </h3>
            <ul className="pl-5 space-y-1 leading-relaxed text-gray-700 list-disc dark:text-babypowder">
              <li>Nombre y apellidos</li>
              <li>Correo electrónico</li>
              <li>Teléfono</li>
              <li>Detalles de la cita (fecha, óptica seleccionada)</li>
              <li>Historial de citas</li>
            </ul>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              3. Finalidad del tratamiento
            </h3>
            <ul className="pl-5 space-y-1 leading-relaxed text-gray-700 list-disc dark:text-babypowder">
              <li>Gestión de tus citas de graduación de vista</li>
              <li>Confirmación y recordatorio de citas</li>
              <li>Atención al cliente</li>
              <li>Comunicaciones relacionadas con el servicio</li>
            </ul>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              4. Base legal
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Tratamos tus datos sobre la base de tu consentimiento y la
              ejecución del servicio solicitado.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              5. Destinatarios
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Compartimos tus datos con las ópticas donde solicitas una cita,
              únicamente para cumplir con el servicio.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              6. Conservación
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Tus datos se conservarán mientras exista una relación activa o por
              requerimiento legal.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              7. Derechos
            </h3>
            <ul className="pl-5 space-y-1 leading-relaxed text-gray-700 list-disc dark:text-babypowder">
              <li>Acceder, rectificar o eliminar tus datos</li>
              <li>Solicitar la limitación u oposición al tratamiento</li>
              <li>Solicitar la portabilidad de tus datos</li>
            </ul>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Para ejercerlos, escribe a:{" "}
              <a
                href="mailto:privacidad@opticlick.com"
                className="font-semibold text-chryslerblue hover:underline dark:text-vistablue"
              >
                privacidad@opticlick.com
              </a>
              .
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              8. Seguridad
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Aplicamos medidas técnicas y organizativas para proteger tus datos
              contra accesos no autorizados, pérdidas o manipulaciones.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              9. Cambios
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Esta política puede actualizarse. Te informaremos de cualquier
              cambio importante.
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Última actualización: 21 de mayo de 2025
            </p>
          </div>
        )}
        {activeTab === "terms" && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="pb-2 text-2xl font-bold text-gray-900 border-b border-gray-200 dark:text-babypowder">
              Condiciones de Uso
            </h2>

            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Estas Condiciones de Uso regulan el acceso y la utilización de la
              plataforma <strong>OptiClick</strong>, que permite a los usuarios
              agendar citas de graduación de vista en diferentes ópticas de
              Puente Genil, Córdoba.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              1. Aceptación
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Al utilizar nuestro servicio, aceptas estas condiciones en su
              totalidad. Si no estás de acuerdo, no debes utilizar la
              plataforma.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              2. Registro de usuario
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Para acceder a ciertos servicios, deberás registrarte
              proporcionando información veraz y actualizada. Eres responsable
              de mantener la confidencialidad de tus credenciales.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              3. Uso permitido
            </h3>
            <ul className="pl-5 space-y-1 leading-relaxed text-gray-700 list-disc dark:text-babypowder">
              <li>Agendar y gestionar citas de graduación visual</li>
              <li>Recibir confirmaciones y recordatorios</li>
              <li>Contactar con ópticas colaboradoras</li>
            </ul>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              4. Uso prohibido
            </h3>
            <ul className="pl-5 space-y-1 leading-relaxed text-gray-700 list-disc dark:text-babypowder">
              <li>Suplantar a otros usuarios</li>
              <li>Proporcionar información falsa</li>
              <li>Alterar el funcionamiento de la plataforma</li>
            </ul>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              5. Propiedad intelectual
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Todo el contenido, marca, diseño y funcionalidad de OptiClick son
              propiedad de la empresa. No se permite su reproducción sin
              autorización.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              6. Responsabilidad
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              OptiClick no se hace responsable por cancelaciones, retrasos o
              errores atribuibles a las ópticas. Nos comprometemos a facilitar
              la comunicación entre ambas partes.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              7. Modificaciones
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Podremos actualizar estas condiciones en cualquier momento. Te
              notificaremos de cambios relevantes a través de la plataforma o
              correo electrónico.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              8. Legislación aplicable
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              Estas condiciones se rigen por la legislación española. En caso de
              conflicto, se resolverá ante los tribunales de Córdoba.
            </p>

            <p className="text-sm text-gray-500 dark:text-babypowder">
              Última actualización: 21 de mayo de 2025
            </p>
          </div>
        )}
        {activeTab === "contact" && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="pb-2 text-2xl font-bold text-gray-900 border-b border-gray-200 dark:text-babypowder">
              Contáctanos
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-babypowder">
              ¿Tienes alguna pregunta o problema? Ponte en contacto con nuestro
              equipo de atención al cliente.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-babypowder">
              Contactar con el servicio de atención al cliente
            </h3>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-gray-800">
              <svg
                className="w-6 h-6 text-chryslerblue dark:text-vistablue"
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
                  d="M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1"
                />
              </svg>
              <a
                href="mailto:help.es@opticlick.com"
                className="font-semibold transition-colors hover:underline text-chryslerblue dark:text-vistablue"
              >
                help.es@opticlick.com
              </a>
            </div>

            <p className="p-4 mt-4 leading-relaxed text-gray-600 rounded-lg dark:text-babypowder bg-blue-50 dark:bg-gray-800">
              El administrador de tus datos personales es OptiClick S.L. Calle
              Hola 123, Puente Genil, Córdoba, 14500. Tus datos personales serán
              procesados para responder a tu mensaje y comunicarnos contigo.
              Puedes conocer más detalles sobre cómo procesamos tus datos
              personales en{" "}
              <a
                href="#privacy"
                className="font-semibold transition-colors hover:underline text-chryslerblue dark:text-vistablue"
              >
                la sección de información sobre el procesamiento de datos
                personales
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
