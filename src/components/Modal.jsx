"use client";

import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState } from "react";

const ModalCita = ({accion}) => {
  const [openModal, setOpenModal] = useState(true);

  return (
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center bg-babypowder">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas anular esta cita?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="aquamarine" onClick={() => {
                setOpenModal(false);
                accion();
              }}>
                {"Sí, estoy seguro"}
              </Button>
              <Button color="redpantone" onClick={() => setOpenModal(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
  );
}

export default ModalCita;
