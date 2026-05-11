import React from "react";

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-[#373737] border-t-[#BB86FC] rounded-full animate-spin"></div>

      {/* Texto */}
      <p className="mt-4 text-[#B0B0B0] text-sm">{text}</p>
    </div>
  );
};

export default Loader;
