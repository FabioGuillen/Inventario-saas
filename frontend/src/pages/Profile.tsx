import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import {
  FaIdCard,
  FaEnvelope,
  FaUserShield,
  FaSignOutAlt,
  FaUserPlus,
  FaUsers,
  FaExchangeAlt,
  FaArrowRight,
  FaHistory,
} from "react-icons/fa";
import { getUser } from "../services/auth";

export default function Profile() {
  const { token, user, logout, setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    if (token && !user) {
      getUser().then((res) => {
        setAuth(res.data, token);
      });
    }
  }, [token, user, setAuth]);

  if (!user) {
    return (
      <p className="text-center text-white mt-10 animate-pulse">
        Cargando perfil...
      </p>
    );
  }

  const isOwner = user.role === "owner" || user.role === "admin";

  const InfoCard = ({ icon, label, value }: any) => (
    <div className="flex items-center gap-4 p-4 bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] hover:border-[#BB86FC] transition-all">
      <div className="p-3 rounded-xl bg-[#BB86FC]/15 text-[#BB86FC] text-xl">
        {icon}
      </div>

      <div className="overflow-hidden">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-white font-semibold truncate">{value}</p>
      </div>
    </div>
  );

  const OwnerCard = ({
    title,
    desc,
    icon,
    route,
  }: {
    title: string;
    desc: string;
    icon: any;
    route: string;
  }) => (
    <button
      onClick={() => navigate(route)}
      className="w-full text-left p-5 rounded-2xl bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#BB86FC] hover:-translate-y-1 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#BB86FC]/15 text-[#BB86FC] flex items-center justify-center text-xl">
            {icon}
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-400 mt-1">{desc}</p>
          </div>
        </div>

        <FaArrowRight className="text-gray-500 group-hover:text-[#BB86FC] transition" />
      </div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#1E1E1E] to-[#151515] rounded-3xl p-6 border border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-[#BB86FC] flex items-center justify-center text-3xl font-bold text-black shrink-0">
          {user.email?.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white break-all">
            {user.email}
          </h1>

          <p className="text-gray-400 mt-1">Perfil principal del sistema</p>

          <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[#BB86FC]/15 text-[#BB86FC] text-sm font-medium">
            {user.role}
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={<FaIdCard />} label="ID Usuario" value={user.id} />
        <InfoCard icon={<FaEnvelope />} label="Correo" value={user.email} />
        <InfoCard icon={<FaUserShield />} label="Rol" value={user.role} />
      </div>

      {/* OWNER PANEL */}
      {isOwner && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              Panel de Administración
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Control total de usuarios y permisos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.role === "owner" && (
              <OwnerCard
                title="Crear Usuario"
                desc="Registrar nuevos administradores o empleados."
                icon={<FaUserPlus />}
                route="/create-user"
              />
            )}

            <OwnerCard
              title="Ver Usuarios"
              desc="Lista completa de usuarios registrados."
              icon={<FaUsers />}
              route="/users"
            />
            {user.role === "owner" && (
              <OwnerCard
                title="Cambiar Roles"
                desc="Modificar permisos y jerarquías."
                icon={<FaExchangeAlt />}
                route="/roles"
              />
            )}

            <OwnerCard
              title="Movimientos de Usuarios"
              desc="Ver actividad y movimientos de cada usuario."
              icon={<FaHistory />}
              route="/movement-users"
            />
          </div>
        </div>
      )}

      {/* LOGOUT */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 transition-all p-4 rounded-2xl font-semibold text-white"
      >
        <FaSignOutAlt />
        Cerrar sesión
      </button>
    </div>
  );
}
