import { type ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div
      className="
        flex items-center gap-3
        p-3 sm:p-4
        bg-[#1E1E1E]
        rounded-xl
        border border-[#2A2A2A]
        hover:bg-[#181818]
        transition
        w-full
        min-w-[180px]
      "
    >
      {/* ICON */}
      <div
        className="
          flex items-center justify-center
        w-20 h-12
          rounded-lg
          bg-[#BB86FC]
          text-black
          text-base sm:text-lg
          flex-shrink-0
        "
      >
        {icon}
      </div>

      {/* TEXT */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs sm:text-sm text-gray-400 ">{title}</span>

        <span className="text-sm sm:text-xl font-bold text-white truncate">
          {value}
        </span>
      </div>
    </div>
  );
};

export default Card;
