import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useNavbarStore } from "../store/navbar.store";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toggle } = useNavbarStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-[#1E1E1E] border-b border-[#2A2A2A] flex items-center justify-between px-3 md:px-6 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-[#121212] hover:bg-[#2A2A2A] transition text-white"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          onClick={() => navigate("/")}
          className="text-[#BB86FC] font-bold text-base md:text-lg cursor-pointer"
        >
          <span className="md:hidden">INV</span>
          <span className="hidden md:block">Inventario</span>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 md:gap-3 bg-[#121212] px-2 md:px-3 py-2 rounded-lg hover:bg-[#2A2A2A] transition"
        >
          <div className="w-8 h-8 rounded-full bg-[#BB86FC] flex items-center justify-center text-black font-bold">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm text-white">
              {user?.email || "Usuario"}
            </span>
            <span className="text-xs text-gray-400">{user?.role || "Rol"}</span>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
                toggle();
              }}
              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#2A2A2A]"
            >
              Ver perfil
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-[#2A2A2A]"
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
