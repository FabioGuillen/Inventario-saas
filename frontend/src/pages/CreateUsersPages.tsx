import { useState } from "react";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";
import { register } from "../services/auth";
import Alert from "../components/Alert";

const CreateUsersPages = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createUser = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await register(form.name, form.email, form.password);
      console.log(res);

      setMessage("Usuario creado correctamente");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "employee",
      });
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#BB86FC] flex items-center justify-center text-black text-xl">
          <FaUserPlus />
        </div>

        <div>
          <h2 className="text-white text-xl font-bold">Crear Usuario</h2>
          <p className="text-gray-400 text-sm">Panel exclusivo OWNER</p>
        </div>
      </div>

      <form onSubmit={createUser} className="space-y-4">
        <div>
          <label className="text-sm text-gray-300 mb-1 block">Nombre</label>

          <div className="flex items-center bg-[#121212] rounded-lg px-3 border border-[#2A2A2A]">
            <FaUser className="text-gray-500" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              className="w-full bg-transparent px-3 py-3 text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-1 block">Email</label>

          <div className="flex items-center bg-[#121212] rounded-lg px-3 border border-[#2A2A2A]">
            <FaEnvelope className="text-gray-500" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@email.com"
              className="w-full bg-transparent px-3 py-3 text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-1 block">Contraseña</label>

          <div className="flex items-center bg-[#121212] rounded-lg px-3 border border-[#2A2A2A]">
            <FaLock className="text-gray-500" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="******"
              className="w-full bg-transparent px-3 py-3 text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-1 block">Rol</label>

          <div className="flex items-center bg-[#121212] rounded-lg px-3 border border-[#2A2A2A]">
            <FaShieldAlt className="text-gray-500" />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-3 text-white outline-none"
            >
              <option className="bg-[#121212]" value="ADMIN">
                ADMIN
              </option>

              <option className="bg-[#121212]" value="EMPLOYEE">
                EMPLOYEE
              </option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#BB86FC] hover:opacity-90 transition py-3 rounded-lg text-black font-bold"
        >
          {loading ? "Creando..." : "Crear Usuario"}
        </button>

        {message && (
          <Alert
            type={message.includes("correctamente") ? "success" : "error"}
            message={message}
          />
        )}
      </form>
    </div>
  );
};

export default CreateUsersPages;
