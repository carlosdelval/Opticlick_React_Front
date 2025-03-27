import React from "react";
import Lottie from "lottie-react";
import editAnimation from "../../assets/edit.json";
import InputField from "../../components/InputField";

const Graduar = () => {
  return (
    <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex mb-8 space-x-2 text-start">
        <Lottie animationData={editAnimation} style={{ height: 80 }} />
        <h2 className="text-4xl font-semibold my-7 dark:text-babypowder">
          Graduar esta cita
        </h2>
      </div>
      <div className="p-6 mx-auto bg-white border rounded-lg shadow-md dark:bg-gray-800 max-w-7xl my-7">
        <h2 className="mb-4 text-2xl font-semibold dark:text-babypowder">
          Datos de la cita
        </h2>
        <InputField label="Fecha" type="date" />
        <InputField label="Hora" type="time" />
        <InputField label="Cliente" type="text" />
      </div>
      <div className="p-6 mx-auto bg-white border rounded-lg shadow-md dark:bg-gray-800 max-w-7xl">
        <h2 className="mb-4 text-2xl font-semibold dark:text-babypowder">
          Asignar graduación
        </h2>
        <InputField label="Fecha" type="date" />
        <InputField label="Hora" type="time" />
        <InputField label="Cliente" type="text" />
      </div>
    </div>
  );
};

export default Graduar;
