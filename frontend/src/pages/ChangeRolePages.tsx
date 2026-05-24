import { useEffect, useState } from "react";
import {
  FaUserShield,
  FaSyncAlt,
  FaSave,
  FaUsers,
  FaCrown,
} from "react-icons/fa";
import { changeRole, getUsers } from "../services/auth";
import { notify } from "../utils/notify";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
}

const roles = ["owner", "admin", "employee"];

export default function ChangeRolesPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const getUsersApi = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      notify.error("No se pudieron cargar los usuarios.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersApi();
  }, []);

  const updateRole = async (id: number, role: string) => {
    const user = users.find((u) => u.id === id);

    if (!user) return;

    if (user.role === "owner" && role !== "owner") {
      notify.error("No puedes cambiar el rol del owner directamente.");
      return;
    }

    try {
      setSavingId(id);

      await changeRole(id, role);

      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      notify.success("Rol actualizado correctamente.");
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.error || "No se pudo actualizar el rol";
      notify.error(message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-6">
      {/* HEADER */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FaUserShield className="text-[#BB86FC]" />
            Gestión de Roles
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Cambia permisos de usuarios del sistema.
          </p>
        </div>

        <button
          onClick={getUsersApi}
          className="flex items-center gap-2 bg-[#BB86FC] hover:opacity-90 text-black font-semibold px-4 py-2 rounded-xl transition"
        >
          <FaSyncAlt />
          Recargar
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10 animate-pulse">
          Cargando usuarios...
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-10 text-center text-gray-400">
          No hay usuarios registrados.
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => {
            const isOwner = user.role === "owner";

            return (
              <div
                key={user.id}
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-black ${
                      isOwner ? "bg-yellow-400" : "bg-[#BB86FC]"
                    }`}
                  >
                    {isOwner ? <FaCrown /> : user.email.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">
                      {user.name}
                    </p>

                    <p className="text-sm text-gray-400 truncate">
                      {user.email}
                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "owner"
                          ? "bg-yellow-400/20 text-yellow-300"
                          : user.role === "admin"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <select
                    value={user.role}
                    onChange={(e) => {
                      const newRole = e.target.value;

                      const ownersCount = users.filter(
                        (u) => u.role === "owner",
                      ).length;

                      if (
                        user.role === "owner" &&
                        newRole !== "owner" &&
                        ownersCount === 1
                      ) {
                        notify.error(
                          "No puedes cambiar este owner porque debe existir al menos un owner en el sistema.",
                        );
                        return;
                      }

                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === user.id ? { ...u, role: newRole } : u,
                        ),
                      );
                    }}
                    className="bg-[#121212] border border-[#2A2A2A] text-white px-4 py-2 rounded-xl outline-none"
                  >
                    {roles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => updateRole(user.id, user.role)}
                    disabled={savingId === user.id}
                    className="flex items-center justify-center gap-2 bg-[#BB86FC] hover:opacity-90 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-xl transition"
                  >
                    <FaSave />
                    {savingId === user.id ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4 text-sm text-gray-400 flex items-center gap-3">
        <FaUsers className="text-[#BB86FC]" />
        Total usuarios: {users.length}
      </div>
    </div>
  );
}
