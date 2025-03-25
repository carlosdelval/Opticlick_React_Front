// DangerButton.jsx
import React from "react";

const DangerButton = ({ text, classes }) => {
  return (
    <button
      type="button"
      className={`${classes} text-babypowder bg-gradient-to-br from-redpantone to-lightcoral hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">`}
    >
      {text}
    </button>
  );
};

export default DangerButton;
