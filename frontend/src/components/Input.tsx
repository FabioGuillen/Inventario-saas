import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col ${fullWidth ? "w-full" : "w-auto"}`}>
      {label && <label className="mb-1 text-sm text-[#FFFFFF]">{label}</label>}
      <input
        {...props}
        className={`
          p-3 rounded-md
          bg-[#1E1E1E] text-[#FFFFFF]
          border border-[#373737] 
          focus:outline-none focus:ring-2 focus:ring-[#BB86FC]
          placeholder:text-[#B0B0B0]
          transition-colors
        `}
      />
      {error && <span className="text-[#CF6679] text-xs mt-1">{error}</span>}
    </div>
  );
};

export default Input;
