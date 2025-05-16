import React, { useEffect } from "react";

const Modal = ({ title, text, bottom, open, onClose }) => {
  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.id === "small-modal") {
      onClose();
    }
  };

  // Close modal when pressing Escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      id="small-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-gray-500 bg-opacity-50"
    >
      <div className="relative w-full max-w-md">
        <div className="relative bg-white border-2 border-black rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t md:p-5 dark:border-gray-600">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
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
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 space-y-4 md:p-5">{text}</div>
          <div className="flex items-center p-4 border-t border-gray-200 rounded-b md:p-5 dark:border-gray-600">
            {bottom}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
