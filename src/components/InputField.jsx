const InputField = ({ label, text, type = "text", value, onChange, error }) => (
  <div className="mb-3">
    <label className="text-sm font-semibold" htmlFor={label}>
      {text}
    </label>
    <input
      type={type}
      name={label}
      placeholder={label}
      className={`w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 border rounded-lg ${error ? "border-red-500" : ""}`}
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default InputField;
