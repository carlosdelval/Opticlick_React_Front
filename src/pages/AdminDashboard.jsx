import React from "react";
import { getCitas } from "../api";
import AuthContext from "../context/AuthContext";

const AdminDashboard = () => {
  const [citas, setCitas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { user } = React.useContext(AuthContext);
  React.useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await getCitas();
        setCitas(data);
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
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Lista de Citas</h2>
      </div>
      {loading && <p>Cargando citas...</p>}
      {error && <p>Hubo un error al cargar las citas: {error}</p>}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        {citas.length === 0 && !loading && <p>No hay citas programadas</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase">
                  Hora
                </th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase">
                  Cliente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {citas.map((cita) => (
                <tr
                  key={cita.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
                    {new Date(cita.fecha)
                      .toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/\//g, "-")}
                  </td>
                  <td className="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    {cita.hora ? cita.hora.substring(0, 5) : ""}
                  </td>
                  <td className="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                    {cita.user_id}
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
