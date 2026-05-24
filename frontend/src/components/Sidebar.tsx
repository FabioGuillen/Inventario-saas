import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaExchangeAlt,
  FaChartBar,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useAuthStore } from "../store/auth.store";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Productos", path: "/products", icon: <FaBox /> },
    { name: "Movimientos", path: "/movements", icon: <FaExchangeAlt /> },
    { name: "Reportes", path: "/reports", icon: <FaChartBar /> },
  ];
  {
    user?.role === "owner" &&
      menuItems.push({ name: "Usuarios", path: "/users", icon: <FaUser /> });
  }
  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full z-50
          bg-[#1e1e1e] border-r border-[#2A2A2A]
          flex flex-col transition-all duration-300

          w-full md:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#2A2A2A]">
          <span className="text-[#BB86FC] font-bold text-lg">Inventario</span>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white text-xl"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col gap-2 mt-6 px-3">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-4 p-3 rounded-lg transition

                  ${
                    active
                      ? "bg-[#BB86FC] text-black"
                      : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#BB86FC] flex items-center justify-center text-black font-bold">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="flex flex-col">
              <span className="text-white text-sm">
                {user?.email || "Usuario"}
              </span>
              <span className="text-gray-400 text-xs">
                {user?.role || "Rol"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
