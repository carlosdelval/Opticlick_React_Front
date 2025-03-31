// SecondaryButton.jsx
import React from "react";

const SecondaryButton = ({ text, classes, action }) => {
  return (
    <button
      onClick={action}
      type="button"
      className={`${classes} text-babypowder bg-gradient-to-r from-vistablue to-chryslerblue hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
