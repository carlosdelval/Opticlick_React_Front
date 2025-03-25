// PrimaryButton.jsx
import React from "react";

const PrimaryButton = ({ text, classes, action }) => {
  return (
    <button
      onClick={action}
      type="submit"
      className={`${classes} text-babypowder bg-gradient-to-br from-chryslerblue to-vistablue hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
