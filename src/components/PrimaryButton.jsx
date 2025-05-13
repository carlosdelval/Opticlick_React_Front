// PrimaryButton.jsx

const PrimaryButton = ({ text, classes, action }) => {
  return (
    <button
      onClick={action}
      className={` ${classes} relative h-12 px-8 py-2 overflow-hidden overflow-x-hidden rounded-md group bg-chryslerblue text-babypowder`}
    >
      <span className="relative z-10">{text}</span>
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <span className="absolute left-0 w-full transition-all duration-500 origin-center -translate-x-full rounded-full bg-vistablue aspect-square group-hover:-translate-x-0 group-hover:scale-150"></span>
      </span>
    </button>
  );
};

export default PrimaryButton;
