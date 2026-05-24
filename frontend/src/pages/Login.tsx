import React, { useState } from "react";

import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { notify } from "../utils/notify";

const Login: React.FC = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(form.email, form.password);

      setAuth(res.data.user, res.data.token);

      navigate("/");
    } catch (err) {
      notify.error("Email o contraseña incorrectos");
      setError("Email o contraseña incorrectos");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-md bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Bienvenido</h1>
          <p className="text-sm text-gray-400">Inicia sesión para continuar</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Email</label>
            <div className="flex items-center bg-[#121212] border border-[#2A2A2A] rounded-lg px-3">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none py-2 text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Contraseña</label>
            <div className="flex items-center bg-[#121212] border border-[#2A2A2A] rounded-lg px-3">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none py-2 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BB86FC] hover:bg-[#9b6dfc] transition p-2 rounded-lg font-semibold text-black"
          >
            {loading ? "Entrando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Sistema de Inventario
        </p>
      </div>
    </div>
  );
};

export default Login;
