import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  type = "button",
}) => {
  // Colores HEX según variante
  const baseClasses = `px-4 py-2 rounded-md font-semibold text-black transition-colors ${
    fullWidth ? "w-full" : "inline-block"
  }`;

  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-[#BB86FC] hover:bg-[#03DAC6]";
      break;
    case "secondary":
      variantClasses = "bg-[#03DAC6] hover:bg-[#BB86FC]";
      break;
    case "danger":
      variantClasses = "bg-[#CF6679] hover:bg-[#FF5252]";
      break;
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </button>
  );
};

export default Button;
