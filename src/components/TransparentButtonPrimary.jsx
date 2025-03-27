// Botón primario transparente
const TransparentPrimary = ({ text, classes, action }) => {
    return (
      <button
      onClick={action}
      type="button"
      className={`${classes} relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-chryslerblue to-vistablue group-hover:from-chryslerblue group-hover:to-vistablue hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800`}>
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          {text}
        </span>
      </button>
    );
  };

export default TransparentPrimary;