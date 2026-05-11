import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      {/* Modal Container */}
      <div className="bg-[#1E1E1E] rounded-lg shadow-lg w-full max-w-md p-6 border border-[#373737]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-[#FFFFFF]">{title}</h2>
          )}

          <button
            onClick={onClose}
            className="text-[#B0B0B0] hover:text-[#FFFFFF] text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="text-[#FFFFFF]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
