//SecondaryDanger.jsx
import React from "react";

const SecondaryDanger = ({ text, classes, action, icon }) => {
  return (
    <button
      onClick={action}
      className={` ${classes} relative inline-flex items-center justify-center h-12 overflow-hidden font-medium bg-redpantone border rounded-md group border-neutral-200`}
    >
      <div className="inline-flex h-12 translate-y-0 items-center justify-center px-6 text-babypowder transition duration-500 group-hover:-translate-y-[150%]">
        {icon}
      </div>
      <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center text-babypowder transition duration-500 group-hover:translate-y-0">
        <span className="absolute w-full h-full transition duration-500 scale-y-0 translate-y-full skew-y-12 bg-lightcoral group-hover:translate-y-0 group-hover:scale-150"></span>
        <span className="z-10">{text}</span>
      </div>
    </button>
  );
};

export default SecondaryDanger;
