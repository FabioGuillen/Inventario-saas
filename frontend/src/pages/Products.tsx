import React, { useEffect, useMemo, useState } from "react";

import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Table from "../components/Table";

import {
  createProduct,
  getProducts,
  searchProducts,
  updateProduct,
} from "../services/api";

import type { Column, Product } from "../types/types";

import { useProductStore } from "../store/products.store";
import { useSearchStore } from "../store/search.store";
import { useAuthStore } from "../store/auth.store";

import { notify } from "../utils/notify";

import { FaPlus, FaSearch } from "react-icons/fa";

const Products: React.FC = () => {
  const {
    products,
    addProduct,
    setProducts,
    updateProductLocal,
    editProduct,
    loading,
    setEditProduct,
    setError,
    setLoading,
    setShowModal,
    showModal,
  } = useProductStore();

  const { query, setQuery } = useSearchStore();

  const { user } = useAuthStore();

  const ownerOnly = user?.role === "owner" || user?.role === "admin";

  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
  });

  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      await getProductsApi(query.trim());

      setTyping(false);
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  const getProductsApi = async (searchText: string) => {
    try {
      const res = searchText
        ? await searchProducts(searchText)
        : await getProducts();

      setProducts(res.data);
    } catch (error) {
      notify.error("Error al cargar productos");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: 0,
      stock: 0,
      category: "",
    });

    setEditProduct(null);
    setError(null);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const exists = products.some(
        (p) =>
          p.name.toLowerCase().trim() === form.name.toLowerCase().trim() &&
          p.id !== editProduct?.id,
      );

      if (exists) {
        notify.error("Ya existe un producto con ese nombre");
        return;
      }

      if (editProduct) {
        const res = await updateProduct(editProduct.id, form);

        updateProductLocal(res.data);
      } else {
        const res = await createProduct(form);

        addProduct(res.data);
      }

      notify.success(
        `Producto ${editProduct ? "actualizado" : "creado"} correctamente`,
      );

      resetForm();
    } catch (error: any) {
      notify.error(error?.response?.data?.error || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);

    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });

    setShowModal(true);
  };

  const columns: Column<Product>[] = [
    {
      header: "Nombre",
      accessor: "name",
    },
    {
      header: "Categoría",
      accessor: "category",
    },
    {
      header: "Stock",
      accessor: "stock",
    },
    {
      header: "Precio",
      accessor: "price",
      render: (value) => `Gs ${Number(value).toLocaleString()}`,
    },
    {
      header: "Acciones",
      accessor: "actions",
      render: (_, row) =>
        ownerOnly ? (
          <button
            onClick={() => handleEdit(row)}
            className="text-[#BB86FC] hover:underline"
          >
            Editar
          </button>
        ) : (
          "-"
        ),
    },
  ];

  const totalProducts = useMemo(() => products.length, [products]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Productos</h1>

            <p className="text-sm text-gray-400 mt-1">
              Gestiona inventario, stock y precios.
            </p>
          </div>

          {ownerOnly && (
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Agregar Producto
            </Button>
          )}
        </div>

        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />

            <input
              value={query}
              onChange={(e) => {
                setTyping(true);

                setQuery(e.target.value);
              }}
              placeholder="Buscar productos..."
              className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-[#BB86FC]"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-5 text-sm">
            <span className="text-gray-400">
              Total:
              <span className="text-white font-bold ml-2">{totalProducts}</span>
            </span>

            {typing && (
              <span className="text-[#BB86FC] animate-pulse">buscando...</span>
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} data={products} />

      {showModal && (
        <Modal
          title={editProduct ? "Editar Producto" : "Nuevo Producto"}
          isOpen={showModal}
          onClose={resetForm}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
            />

            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Categoría"
            />

            <Input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
            />

            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Precio"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BB86FC] hover:bg-[#a56dfd] text-black font-bold p-3 rounded-xl"
            >
              {loading
                ? "Guardando..."
                : editProduct
                  ? "Actualizar"
                  : "Crear Producto"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Products;
