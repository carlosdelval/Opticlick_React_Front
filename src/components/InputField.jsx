const InputField = ({
  label,
  text,
  type,
  value,
  defaultValue,
  onChange,
  error,
  hidden,
  classes,
  placeholder,
}) => (
  <div
    className={`${hidden || ""} mb-3
  }`}
  >
    <label
      className="text-sm font-semibold dark:text-babypowder"
      htmlFor={label}
    >
      {text}
    </label>
    {type === "select" ? (
      <select
        name={label}
        className={`${
          classes || ""
        } dark:bg-gray-900 dark:border-gray-400 dark:text-babypowder w-full p-2 focus:outline-none focus:ring-2 focus:ring-chryslerblue dark:focus:ring-vistablue border rounded-lg ${
          error ? "border-redpantone dark:border-lightcoral" : ""
        }`}
        defaultValue={defaultValue || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {Array.isArray(value) &&
          value.map((option, index) => (
            <option key={index} value={option.value} disabled={option.disabled}>
              {option.display}
            </option>
          ))}
      </select>
    ) : (
      <input
        type={type}
        name={label}
        placeholder={label}
        className={`${
          classes || ""
        } dark:bg-gray-900 dark:border-gray-400 dark:text-babypowder w-full p-2 focus:outline-none focus:ring-2 focus:ring-chryslerblue dark:focus:ring-vistablue border rounded-lg ${
          error ? "border-redpantone dark:border-lightcoral" : ""
        }`}
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        autoComplete="off"
        maxLength={40}
      />
    )}
    {error && (
      <p className="mt-1 text-xs text-redpantone dark:text-lightcoral">
        {error}
      </p>
    )}
  </div>
);

export default InputField;
