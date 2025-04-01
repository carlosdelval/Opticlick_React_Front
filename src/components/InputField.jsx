const InputField = ({
  label,
  text,
  type,
  value,
  selectedValue,
  onChange,
  error,
  hidden,
  classes,
  placeholder
}) => (
  <div
    className={`${hidden || ""} mb-3
  }`}
  >
    <label className="text-sm font-semibold" htmlFor={label}>
      {text}
    </label>
    {type === "select" ? (
      <select
        name={label}
        className={`${
          classes || ""
        } w-full p-2 focus:outline-none focus:ring-2 focus:ring-chryslerblue border rounded-lg ${
          error ? "border-redpantone" : ""
        }`}
        value={selectedValue || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
      >
        <option value="" defaultValue disabled>{placeholder}</option>
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
        } w-full p-2 focus:outline-none focus:ring-2 focus:ring-chryslerblue border rounded-lg ${
          error ? "border-redpantone" : ""
        }`}
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        autoComplete="off"
      />
    )}
    {error && <p className="mt-1 text-xs text-redpantone">{error}</p>}
  </div>
);

export default InputField;
