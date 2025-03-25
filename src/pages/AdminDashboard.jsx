import React from "react";
import { getCitas } from "../api";
import { getClienteCita } from "../api";
import { deleteCita } from "../api";
import Lottie from "lottie-react";
import calendarAnimation from "../assets/calendar.json";
import DangerButton from "../components/dangerbutton";
import SecondaryButton from "../components/secondarybutton";

const AdminDashboard = () => {
  const [citas, setCitas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await getCitas();

        // Fetch client info for each cita
        const citasWithClients = await Promise.all(
          data.map(async (cita) => {
            try {
              const cliente = await getClienteCita(cita.user_id);
              return {
                ...cita,
                cliente:
                  cliente && cliente[0]
                    ? `${cliente[0].name} ${cliente[0].surname}`
                    : "Cliente desconocido",
              };
            } catch (err) {
              console.error(`Error fetching client for cita ${cita.id}:`, err);
              return { ...cita, cliente: "Error al cargar cliente" };
            }
          })
        );

        setCitas(citasWithClients);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching citas:", err);
        setError("No se pudieron cargar las citas.");
        setLoading(false);
      }
    };
    fetchCitas();
  }, []);
  return (
    <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex mb-10 space-x-3 text-start">
        <Lottie animationData={calendarAnimation} style={{ height: 60 }} />
        <h2 className="my-4 text-4xl font-semibold dark:text-babypowder">Citas actuales</h2>
      </div>
      {loading && <p>Cargando citas...</p>}
      {error && <p>Hubo un error al cargar las citas: {error}</p>}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        {citas.length === 0 && !loading && <p>No hay citas programadas</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-xs font-bold tracking-wider text-left uppercase bg-chryslerblue text-babypowder dark:text-black dark:bg-vistablue">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Hora</th>
                <th className="px-6 py-3">Cliente</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {citas.map((cita) => (
                <tr
                  key={cita.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 text-sm font-medium text-left text-gray-900 dark:text-babypowder whitespace-nowrap">
                    {new Date(cita.fecha)
                      .toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/\//g, "-")}
                  </td>
                  <td className="px-6 py-4 text-sm text-left text-gray-500 dark:text-gray-200 whitespace-nowrap">
                    {cita.hora ? cita.hora.substring(0, 5) : ""}
                  </td>
                  <td className="px-6 py-4 text-sm text-left text-gray-500 dark:text-gray-200 whitespace-nowrap">
                    {cita.cliente}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="items-center justify-end space-x-2">
                      <SecondaryButton
                        text={
                          <>
                            <div className="flex space-x-2">
                              <span>Graduar</span>
                              <svg
                                className="w-4 h-4 mt-1"
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
                            </div>
                          </>
                        }
                      />
                      <DangerButton action={() => deleteCita(cita.id)}
                        text={
                          <>
                            <div className="flex space-x-2">
                              <span>Anular</span>
                              <svg
                                className="w-4 h-4 mt-1"
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
                                  d="m17.0896 13.371 1.1431 1.1439c.1745.1461.3148.3287.4111.5349.0962.2063.1461.4312.1461.6588 0 .2276-.0499.4525-.1461.6587-.0963.2063-.4729.6251-.6473.7712-3.1173 3.1211-6.7739 1.706-9.90477-1.4254-3.13087-3.1313-4.54323-6.7896-1.41066-9.90139.62706-.61925 1.71351-1.14182 2.61843-.23626l1.1911 1.19193c1.1911 1.19194.3562 1.93533-.4926 2.80371-.92477.92481-.65643 1.72741 0 2.38391l1.8713 1.8725c.3159.3161.7443.4936 1.191.4936.4468 0 .8752-.1775 1.1911-.4936.8624-.8261 1.6952-1.6004 2.8382-.4565Zm-2.2152-4.39103 2.1348-2.13485m0 0 2.1597-1.90738m-2.1597 1.90738 2.1597 2.15076m-2.1597-2.15076-2.1348-1.90738"
                                />
                              </svg>
                            </div>
                          </>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
