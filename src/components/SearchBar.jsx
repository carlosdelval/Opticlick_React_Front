const SearchBar = ({searchTerm, setSearchTerm, className}) => {
  return (
    <div className="relative">
      <div className={`${className} absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none`}>
        <svg
          className="w-4 h-4 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        id="search"
        className="block w-full p-4 pl-10 text-sm text-gray-900 bg-white border-2 border-black rounded-lg md:w-96 focus:bg-blue-50 focus:border-chryslerblue focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        placeholder="Buscar citas por cliente, fecha u hora..."
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
