import { useState, useEffect } from "react";
import { getClientes } from "../api";
import Lottie from "lottie-react";
import teamAnimation from "../assets/clients.json";

function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientes();
        setClientes(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("No se pudieron cargar los clientes");
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex mb-10 space-x-3 text-start">
        <Lottie animationData={teamAnimation} style={{ height: 60 }} />
        <h2 className="my-2 text-4xl font-semibold">Todos tus clientes</h2>
      </div>

      {loading && (
        <div className="flex justify-center">
          <div className="text-lg text-chryslerblue animate-pulse">
            Cargando clientes...
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 border-l-4 rounded shadow-md border-redpantone bg-lightcoral text-redpantone">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          {clientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-xs font-medium tracking-wider text-left uppercase bg-chryslerblue text-babypowder">
                  <tr>
                    <th className="px-6 py-3">
                      ID
                    </th>
                    <th className="px-6 py-3">
                      Nombre
                    </th>
                    <th className="px-6 py-3">
                      Email
                    </th>
                    <th className="px-6 py-3">
                      Teléfono
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {cliente.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {cliente.name} {cliente.surname}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {cliente.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {cliente.tlf}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p className="text-lg">No hay clientes registrados</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
