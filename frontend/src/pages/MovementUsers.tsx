import { useEffect, useMemo, useState } from "react";
import Loader from "../components/Loader";
import Table from "../components/Table";
import { getMovementUsers } from "../services/movement";
import type { Column } from "../types/types";

interface MovementUser {
  id: number;
  userName: string;
  userEmail: string;
  productName: string;
  type: "IN" | "OUT";
  quantity: number;
  createdAt: string;
}

type DateFilter = "today" | "week" | "month" | "all";

const MovementUsers = () => {
  const [data, setData] = useState<MovementUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterUser, setFilterUser] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [filterDate, setFilterDate] = useState<DateFilter>("all");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getMovementUsers();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const users = useMemo(() => {
    return [...new Set(data.map((d) => d.userName))];
  }, [data]);

  const filterByDate = (items: MovementUser[]) => {
    const now = new Date();

    return items.filter((m) => {
      const date = new Date(m.createdAt);

      if (filterDate === "today") {
        return date.toDateString() === now.toDateString();
      }

      if (filterDate === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo;
      }

      if (filterDate === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return date >= monthAgo;
      }

      return true;
    });
  };

  const filteredData = useMemo(() => {
    let rows = [...data];

    if (filterUser !== "ALL") {
      rows = rows.filter((r) => r.userName === filterUser);
    }

    if (filterType !== "ALL") {
      rows = rows.filter((r) => r.type === filterType);
    }

    rows = filterByDate(rows);

    return rows.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data, filterUser, filterType, filterDate]);

  //Kpis

  const kpis = useMemo(() => {
    const today = new Date();

    const todayMovements = data.filter(
      (m) => new Date(m.createdAt).toDateString() === today.toDateString()
    );

    const totalIn = todayMovements
      .filter((m) => m.type === "IN")
      .reduce((acc, m) => acc + m.quantity, 0);

    const totalOut = todayMovements
      .filter((m) => m.type === "OUT")
      .reduce((acc, m) => acc + m.quantity, 0);

    const totalMovements = todayMovements.length;

    return {
      totalIn,
      totalOut,
      totalMovements,
    };
  }, [data]);

  const topUser = useMemo(() => {
    const map: Record<string, number> = {};

    filteredData.forEach((m) => {
      map[m.userName] = (map[m.userName] || 0) + m.quantity;
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);

    return sorted[0] || ["-", 0];
  }, [filteredData]);

  //Table
  const columns: Column<MovementUser>[] = [
    { header: "Usuario", accessor: "userName" },
    { header: "Email", accessor: "userEmail" },
    { header: "Producto", accessor: "productName" },
    {
      header: "Tipo",
      accessor: "type",
      render: (v) => (
        <span
          className={
            v === "IN"
              ? "text-green-400 font-semibold"
              : "text-red-400 font-semibold"
          }
        >
          {v}
        </span>
      ),
    },
    { header: "Cantidad", accessor: "quantity" },
    {
      header: "Fecha",
      accessor: "createdAt",
      render: (v) => new Date(v).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Auditoría de Movimientos
        </h1>
        <p className="text-gray-400 text-sm">
          Actividad en tiempo real por usuario
        </p>
      </div>

      {/*KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Movimientos hoy</p>
          <p className="text-white text-2xl font-bold">{kpis.totalMovements}</p>
        </div>

        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Entradas</p>
          <p className="text-green-400 text-2xl font-bold">{kpis.totalIn}</p>
        </div>

        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Salidas</p>
          <p className="text-red-400 text-2xl font-bold">{kpis.totalOut}</p>
        </div>
      </div>

      {/*INSIGHT STRIPE*/}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-5 space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wide">
            Insights
          </h2>

          <span className="text-xs text-gray-400 bg-[#121212] px-2 py-1 rounded-md border border-[#2A2A2A]">
            Tiempo real
          </span>
        </div>

        {/* CONTENT GRID */}
        <div className="space-y-3">
          {/* USER TOP */}
          <div className="flex items-center justify-between bg-[#121212] border border-[#2A2A2A] rounded-xl p-3">
            <div>
              <p className="text-gray-400 text-xs">Usuario más activo</p>
              <p className="text-white font-semibold">
                {topUser[0] || "Sin datos"}
              </p>
            </div>

            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* ACTIVITY */}
          <div className="flex items-center justify-between bg-[#121212] border border-[#2A2A2A] rounded-xl p-3">
            <div>
              <p className="text-gray-400 text-xs">Actividad total</p>
              <p className="text-white font-semibold">
                {topUser[1] || 0} movimientos
              </p>
            </div>

            <p className="text-[#BB86FC] text-sm font-semibold">
              +{Math.floor((topUser[1] || 0) * 0.1)}%
            </p>
          </div>
        </div>
      </div>

      {/*FILTERS*/}
      <div className="grid md:grid-cols-3 gap-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-4">
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="bg-[#121212] p-2 rounded text-white"
        >
          <option value="ALL">Todos usuarios</option>
          {users.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#121212] p-2 rounded text-white"
        >
          <option value="ALL">Todos tipos</option>
          <option value="IN">Entradas</option>
          <option value="OUT">Salidas</option>
        </select>

        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value as DateFilter)}
          className="bg-[#121212] p-2 rounded text-white"
        >
          <option value="all">Todo</option>
          <option value="today">Hoy</option>
          <option value="week">7 días</option>
          <option value="month">30 días</option>
        </select>
      </div>

      {/*TABLE*/}
      {loading ? <Loader /> : <Table columns={columns} data={filteredData} />}
    </div>
  );
};

export default MovementUsers;
