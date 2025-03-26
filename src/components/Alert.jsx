
"use client";

import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

const Alerta = ({ text, color }) => {
  return (
    <Alert icon={HiInformationCircle} color={color} onDismiss={() => alert('Alert dismissed!')}>
      <span className="font-medium">{text}</span>
    </Alert>
  );
}

export default Alerta;
