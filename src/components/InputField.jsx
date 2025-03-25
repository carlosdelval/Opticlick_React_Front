const InputField = ({ label, text, type = "text", value, onChange, error }) => (
  <div className="mb-3">
    <label className="text-sm font-semibold" htmlFor={label}>
      {text}
    </label>
    <input
      type={type}
      name={label}
      placeholder={label}
      className={`w-full p-2 focus:outline-none focus:ring-2 focus:ring-chryslerblue border rounded-lg ${error ? "border-redpantone" : ""}`}
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
    {error && <p className="mt-1 text-xs text-redpantone">{error}</p>}
  </div>
);

export default InputField;
