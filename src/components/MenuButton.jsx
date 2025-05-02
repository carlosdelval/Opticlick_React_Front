import React from "react";

const MenuButton = ({ text, classes, action, icon, iconRight = false }) => {
  return (
    <button
      onClick={action}
      className={`${classes} text-babypowder bg-chryslerblue border border-black relative inline-flex items-center justify-center h-12 px-6 overflow-hidden font-medium rounded-md group`}
    >
      {!iconRight && (
        <div className="mr-0 w-0 -translate-x-[100%] opacity-0 transition-all duration-200 group-hover:mr-1 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100">
          {icon}
        </div>
      )}
      <span>{text}</span>
      {iconRight && (
        <div className="ml-0 w-0 translate-x-[100%] opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100">
          {icon}
        </div>
      )}
    </button>
  );
};

export default MenuButton;
