import React, { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Table from "../components/Table";
import type { Column, Movement } from "../types/types";
import Loader from "../components/Loader";
import { useMovementStore } from "../store/movements.store";
import { notify } from "../utils/notify";
import { createMovement, getMovements } from "../services/movement";

const Movements: React.FC = () => {
  const {
    movements,
    setMovements,
    loading,
    modal,
    setLoading,
    setModal,
    form,
    setForm,
  } = useMovementStore();

  const [filterType, setFilterType] = useState("ALL");
  const [sortDate, setSortDate] = useState("DESC");

  const loadMovements = async () => {
    setLoading(true);

    try {
      const res = await getMovements();
      setMovements(res.data);
    } catch {
      notify.error("No se pudieron cargar los movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const movementRows = useMemo(() => {
    const rows = movements.flatMap((product) =>
      product.movements.map((m: any) => ({
        id: m.id,
        name: product.name,
        type: m.type,
        quantity: m.quantity,
        createdAt: m.createdAt,
      }))
    );

    const filtered =
      filterType === "ALL"
        ? rows
        : rows.filter((item) => item.type === filterType);

    return filtered.sort((a, b) => {
      const first =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      return sortDate === "ASC" ? first : -first;
    });
  }, [movements, filterType, sortDate]);

  const columns: Column<Movement>[] = [
    {
      header: "Producto",
      accessor: "name",
    },
    {
      header: "Tipo",
      accessor: "type",
      render: (value) => (
        <span
          className={
            value === "IN"
              ? "text-green-400 font-semibold"
              : "text-red-400 font-semibold"
          }
        >
          {value}
        </span>
      ),
    },
    {
      header: "Cantidad",
      accessor: "quantity",
    },
    {
      header: "Fecha",
      accessor: "createdAt",
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value = e.target.value;

    if (e.target.name === "quantity") {
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
      await createMovement({
        productId: Number(form.productId),
        type: form.type === "IN" ? "IN" : "OUT",
        quantity: Number(form.quantity),
      });

      await loadMovements();

      setForm({
        productId: "",
        type: "IN",
        quantity: "",
      });

      setModal(false);

      notify.success("Movimiento registrado exitosamente");
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "Error al registrar movimiento";

      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Movimientos</h1>

        <Button onClick={() => setModal(true)}>Registrar Movimiento</Button>
      </div>

      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex flex-col gap-1 w-full md:w-52">
          <label className="text-sm text-gray-400">Filtrar Tipo</label>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#121212] border border-[#2A2A2A] p-2 rounded text-white"
          >
            <option value="ALL">Todos</option>
            <option value="IN">Entradas</option>
            <option value="OUT">Salidas</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full md:w-60">
          <label className="text-sm text-gray-400">Ordenar por Fecha</label>

          <select
            value={sortDate}
            onChange={(e) => setSortDate(e.target.value)}
            className="bg-[#121212] border border-[#2A2A2A] p-2 rounded text-white"
          >
            <option value="DESC">Más recientes primero</option>
            <option value="ASC">Más antiguos primero</option>
          </select>
        </div>

        <div className="md:ml-auto text-sm text-gray-400">
          Total visibles:{" "}
          <span className="text-white font-semibold">
            {movementRows.length}
          </span>
        </div>
      </div>

      {loading ? <Loader /> : <Table columns={columns} data={movementRows} />}

      {modal && (
        <Modal
          title="Nuevo Movimiento"
          onClose={() => setModal(false)}
          isOpen={modal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">Producto</label>

              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                className="p-2 rounded bg-[#1E1E1E]"
              >
                <option value="">Seleccionar producto</option>

                {movements.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">Tipo</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="p-2 rounded bg-[#1E1E1E]"
              >
                <option value="IN">Entrada</option>
                <option value="OUT">Salida</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">Cantidad</label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                className="p-2 rounded bg-[#1E1E1E]"
                placeholder="Ej: 2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#03DAC6] hover:bg-[#02c4b0] p-2 rounded font-bold text-black"
            >
              {loading ? "Guardando..." : "Registrar Movimiento"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Movements;
