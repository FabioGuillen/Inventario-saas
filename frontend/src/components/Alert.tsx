import React from "react";

interface AlertProps {
  type?: "success" | "warning" | "error" | "info";
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type = "info", message }) => {
  const styles = {
    success: "bg-[#1E1E1E] border-[#03DAC6] text-[#03DAC6]",
    warning: "bg-[#1E1E1E] border-[#FFD166] text-[#FFD166]",
    error: "bg-[#1E1E1E] border-[#CF6679] text-[#CF6679]",
    info: "bg-[#1E1E1E] border-[#BB86FC] text-[#BB86FC]",
  };

  return (
    <div
      className={`w-full border-l-4 p-4 rounded-md ${styles[type]} transition-colors`}
    >
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default Alert;
