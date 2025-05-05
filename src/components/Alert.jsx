import React, { useState } from "react";

const Alert = ({ text, type, onDismiss }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleDismiss = () => {
    setIsClosing(true);
    // Esperamos a que termine la animación antes de llamar a onDismiss
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };

  return (
    <div
      id={`alert-${type}`}
      className={`${
        type === "success" ? "bg-aquamarine" : "bg-lightcoral"
      } flex items-center p-4 mb-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
        isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
      role="alert"
    >
      {type === "success" ? (
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
            d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ) : (
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
            d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      )}
      <span className="sr-only">{type}</span>
      <div className="text-sm font-medium ms-3">{text}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 h-8 w-8"
        data-dismiss-target={`#alert-${type}`}
        aria-label="Close"
        onClick={handleDismiss}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;