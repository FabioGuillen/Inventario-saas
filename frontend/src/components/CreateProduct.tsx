import { useState } from "react";
import { createProduct } from "../services/api";
import Alert from "./Alert";
import { notify } from "../utils/notify";

export const CreateProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let value = e.target.value;

    if (e.target.name === "stock" || e.target.name === "price") {
      value = value.replace(/^0+(?=\d)/, "");
    }

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
      });

      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
      });

      setInfo("Producto creado!");
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "No se pudo crear el producto";
      notify.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#ff2929] p-6 rounded-xl text-white max-w-md">
      {info && <Alert message={info} type="success" />}

      <h2 className="text-xl font-bold mb-4">Crear Producto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-400">
            Nombre del Producto
          </label>

          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Mouse Gamer"
            required
            className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-400"
          >
            Categoría
          </label>

          <input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Ej: Electrónica"
            required
            className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
          />
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-2">
          <label htmlFor="stock" className="text-sm font-medium text-gray-400">
            Stock Inicial
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            placeholder="Ej: 5"
            required
            className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
          />
        </div>

        {/* Precio */}
        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="text-sm font-medium text-gray-400">
            Precio
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Ej: 150000"
            required
            className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#BB86FC] hover:bg-[#9b6dfc] p-3 rounded-lg font-bold transition"
        >
          {loading ? "Creando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
};
