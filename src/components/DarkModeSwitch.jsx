import { useDarkMode } from "../context/DarkModeContext";

const DarkModeSwitch = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-16 h-7 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow"
    >
      <div
        id="switch-toggle"
        className={`w-9 h-9 relative rounded-full transition duration-500 transform p-1 text-white 
          ${darkMode ? "bg-gray-700 translate-x-full" : "bg-yellow-500 -translate-x-2"}`}
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </div>
    </button>
  );
};

export default DarkModeSwitch;
