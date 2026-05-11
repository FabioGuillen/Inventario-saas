import React, { useEffect, useMemo } from "react";
import {
  FaBox,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import Card from "../components/Card";
import ChartContainer from "../components/ChartContainer";
import { useReportStore } from "../store/reports.store";
import { getMovements } from "../services/movement";

const Dashboard: React.FC = () => {
  const { filter, report, setReport } = useReportStore();

  useEffect(() => {
    getMovements().then((res) => {
      setReport(res.data);
    });
  }, []);

  const movements = useMemo(() => {
    return report.flatMap((p) =>
      p.movements.map((m: any) => ({
        ...m,
        productName: p.name,
        category: p.category,
        price: p.price,
      }))
    );
  }, [report]);

  /* 
     Filtro por fecha
  */
  const filteredMovements = useMemo(() => {
    const now = new Date();

    return movements.filter((m) => {
      const date = new Date(m.createdAt);

      if (filter === "today") {
        return date.toDateString() === now.toDateString();
      }

      if (filter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo;
      }

      if (filter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return date >= monthAgo;
      }

      return true;
    });
  }, [movements, filter]);

  const totalProducts = useMemo(() => report.length, [report]);

  const totalStock = useMemo(
    () => report.reduce((acc, p) => acc + p.stock, 0),
    [report]
  );

  const lowStockProducts = useMemo(
    () => report.filter((p) => p.stock <= 5),
    [report]
  );

  const today = new Date();

  const todayMovements = useMemo(
    () =>
      movements.filter((m) => {
        const date = new Date(m.createdAt);

        return date.toDateString() === today.toDateString();
      }),
    [movements]
  );

  const todaySales = useMemo(() => {
    return movements
      .filter((m) => {
        const date = new Date(m.createdAt);

        return m.type === "OUT" && date.toDateString() === today.toDateString();
      })
      .reduce((acc, m) => acc + m.quantity * m.price, 0);
  }, [movements]);

  const todayIn = todayMovements.filter((m) => m.type === "IN").length;

  const todayOut = todayMovements.filter((m) => m.type === "OUT").length;

  //Charts Data
  const salesByDay = useMemo(() => {
    const data: Record<string, number> = {};

    filteredMovements.forEach((m) => {
      const day = new Date(m.createdAt).toLocaleDateString();

      data[day] = (data[day] || 0) + m.quantity;
    });

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Movimientos",
          data: Object.values(data),
          backgroundColor: "#BB86FC",
        },
      ],
    };
  }, [filteredMovements]);

  const stockByCategory = useMemo(() => {
    const data: Record<string, number> = {};

    report.forEach((p) => {
      data[p.category] = (data[p.category] || 0) + p.stock;
    });

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Stock",
          data: Object.values(data),
          backgroundColor: [
            "#BB86FC",
            "#03DAC6",
            "#CF6679",
            "#00dd5c",
            "#ffb300",
          ],
        },
      ],
    };
  }, [report]);

  const critical = lowStockProducts.length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        <p className="text-gray-400 text-sm mt-1">
          Resumen en tiempo real de tu negocio
        </p>
      </div>

      {/* ALERTS */}
      <div className="grid md:grid-cols-3 gap-4">
        {critical > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl flex items-center gap-2">
            <FaExclamationTriangle />
            {critical} productos con stock crítico
          </div>
        )}

        <div className="bg-[#1E1E1E] border border-[#2A2A2A] p-4 rounded-xl text-gray-300">
          <FaArrowUp className="text-green-400 inline mr-2" />
          Entradas hoy: {todayIn}
        </div>

        <div className="bg-[#1E1E1E] border border-[#2A2A2A] p-4 rounded-xl text-gray-300">
          <FaArrowDown className="text-red-400 inline mr-2" />
          Salidas hoy: {todayOut}
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Productos" value={totalProducts} icon={<FaBox />} />

        <Card title="Stock Total" value={totalStock} icon={<FaBox />} />

        <Card
          title="Ventas Hoy"
          value={`Gs ${todaySales.toLocaleString()}`}
          icon={<FaDollarSign />}
        />

        <Card
          title="Movimientos Hoy"
          value={todayMovements.length}
          icon={<FaExchangeAlt />}
        />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartContainer title="Movimientos" type="bar" data={salesByDay} />

        <ChartContainer
          title="Stock por categoría"
          type="doughnut"
          data={stockByCategory}
        />
      </div>

      {/* LOW STOCK */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-3">
          Productos con bajo stock
        </h2>

        <div className="space-y-2">
          {lowStockProducts.map((p) => (
            <div
              key={p.id}
              className="flex justify-between text-sm text-gray-300"
            >
              <span>{p.name}</span>

              <span className="text-red-400 font-bold">{p.stock}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
