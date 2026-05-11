import { useEffect, useState } from "react";
import { FaTrash, FaUserPlus } from "react-icons/fa";
import { useUserStore } from "../store/user.store";
import { changeRole, deleteUser, getUsers } from "../services/auth";
import { Link } from "react-router-dom";
import { notify } from "../utils/notify";

const Users = () => {
  const { users, setUsers } = useUserStore();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      notify.error("No se pudieron cargar los usuarios");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoadingDelete(true);

      await notify.promise(deleteUser(deleteId), {
        loading: "Eliminando usuario...",
        success: "Usuario eliminado correctamente",
        error: "No se pudo eliminar el usuario",
      });

      await loadUsers();
      setDeleteId(null);
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "No se pudo eliminar el usuario";

      notify.error(message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleRole = async (id: number, role: string) => {
    const user = users.find((u: any) => u.id === id);
    if (!user) return;

    const ownersCount = users.filter((u: any) => u.role === "owner").length;

    if (user.role === "owner" && role !== "owner" && ownersCount === 1) {
      notify.error("Debe existir al menos un owner en el sistema.");
      return;
    }

    try {
      await notify.promise(changeRole(id, role.toLowerCase()), {
        loading: "Actualizando rol...",
        success: "Rol actualizado correctamente",
        error: "No se pudo cambiar el rol",
      });

      await loadUsers();
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>

        <Link
          to="/create-user"
          className="bg-[#BB86FC] text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
        >
          <FaUserPlus />
          Crear
        </Link>
      </div>

      {/* TABLE DESKTOP */}
      <div className="hidden md:block bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden">
        <table className="w-full text-sm text-white">
          <thead className="bg-[#121212]">
            <tr>
              <th className="p-4 text-left">Rol</th>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t border-[#2A2A2A]">
                <td className="p-4 font-bold text-[#BB86FC] uppercase">
                  {u.role}
                </td>

                <td className="p-4">{u.name}</td>

                <td className="p-4">{u.email}</td>

                <td className="p-4 flex gap-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRole(u.id, e.target.value)}
                    className="bg-[#121212] p-2 rounded text-white"
                  >
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                    <option value="employee">employee</option>
                  </select>

                  <button
                    onClick={() => setDeleteId(u.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3">
        {users.map((u: any) => (
          <div
            key={u.id}
            className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4 space-y-2"
          >
            <div className="text-[#BB86FC] font-bold uppercase">{u.role}</div>

            <div className="text-white font-semibold">{u.name}</div>

            <div className="text-gray-400 text-sm">{u.email}</div>

            <div className="flex justify-between items-center pt-2">
              <select
                value={u.role}
                onChange={(e) => handleRole(u.id, e.target.value)}
                className="bg-[#121212] p-2 rounded text-white w-full mr-2"
              >
                <option value="owner">owner</option>
                <option value="admin">admin</option>
                <option value="employee">employee</option>
              </select>

              <button
                onClick={() => setDeleteId(u.id)}
                className="text-red-400"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h2 className="text-xl font-bold text-white">
              Confirmar eliminación
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              ¿Seguro que deseas eliminar este usuario? Esta acción no se puede
              deshacer.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-[#2A2A2A] text-white hover:bg-[#333] transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={loadingDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
              >
                {loadingDelete ? "Eliminando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
