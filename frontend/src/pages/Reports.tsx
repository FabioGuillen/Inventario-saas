import React, { useEffect, useMemo } from "react";
import ChartContainer from "../components/ChartContainer";
import Table from "../components/Table";
import Card from "../components/Card";
import { useReportStore } from "../store/reports.store";
import { getMovements } from "../services/movement";

const Reports: React.FC = () => {
  const { filter, report, setFilter, setReport } = useReportStore();

  useEffect(() => {
    getMovements().then((res) => setReport(res.data));
  }, []);

  const movements = useMemo(() => {
    return report.flatMap((p) =>
      (p.movements ?? []).map((m: any) => ({
        ...m,
        productName: p.name,
        category: p.category,
        price: p.price,
      })),
    );
  }, [report]);

  const filtered = useMemo(() => {
    const now = new Date();

    return movements.filter((m) => {
      const date = new Date(m.createdAt);

      if (filter === "today") {
        return date.toDateString() === now.toDateString();
      }

      if (filter === "week") {
        const week = new Date();
        week.setDate(now.getDate() - 7);
        return date >= week;
      }

      if (filter === "month") {
        const month = new Date();
        month.setMonth(now.getMonth() - 1);
        return date >= month;
      }

      return true;
    });
  }, [movements, filter]);

  const kpis = useMemo(() => {
    const inTotal = filtered
      .filter((m) => m.type === "IN")
      .reduce((a, m) => a + m.quantity, 0);

    const outTotal = filtered
      .filter((m) => m.type === "OUT")
      .reduce((a, m) => a + m.quantity, 0);

    const revenue = filtered
      .filter((m) => m.type === "OUT")
      .reduce((a, m) => a + m.quantity * m.price, 0);

    const stock = report.reduce((a, p) => a + p.stock, 0);

    return {
      revenue,
      inTotal,
      outTotal,
      stock,
    };
  }, [filtered, report]);

  const insights = useMemo(() => {
    const topCategory = report.reduce((acc: any, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.stock;
      return acc;
    }, {});

    const bestCategory = Object.entries(topCategory).sort(
      (a: any, b: any) => b[1] - a[1],
    )[0];

    return {
      bestCategory: bestCategory?.[0],
      lowStock: report.filter((p) => p.stock <= 5).length,
      trend: kpis.outTotal > kpis.inTotal ? "down" : "up",
    };
  }, [report, kpis]);

  const byDay = useMemo(() => {
    const data: Record<string, number> = {};

    filtered.forEach((m) => {
      const day = new Date(m.createdAt).toLocaleDateString();
      data[day] = (data[day] || 0) + m.quantity;
    });

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Actividad",
          data: Object.values(data),
          backgroundColor: "#BB86FC",
        },
      ],
    };
  }, [filtered]);

  const inOut = {
    labels: ["Entradas", "Salidas"],
    datasets: [
      {
        data: [kpis.inTotal, kpis.outTotal],
        backgroundColor: ["#03DAC6", "#CF6679"],
      },
    ],
  };

  const stockByCategory = useMemo(() => {
    const data: Record<string, number> = {};

    report.forEach((p) => {
      data[p.category] = (data[p.category] || 0) + p.stock;
    });

    return {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: ["#BB86FC", "#03DAC6", "#CF6679", "#FFD166"],
        },
      ],
    };
  }, [report]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Reportes</h1>
        <p className="text-gray-400 text-sm">
          Descripción general del desempeño empresarial
        </p>
      </div>

      <div className="flex gap-2">
        {[
          { label: "Hoy", value: "today" },
          { label: "Semana", value: "week" },
          { label: "Mes", value: "month" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={`px-4 py-1 rounded-lg text-sm transition ${
              filter === f.value
                ? "bg-[#BB86FC] text-black"
                : "bg-[#2A2A2A] text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          title="Ganancias"
          value={`Gs ${kpis.revenue.toLocaleString()}`}
          icon="sales"
        />

        <Card title="Stock" value={kpis.stock} icon="stock" />

        <Card title="Entradas" value={kpis.inTotal} icon="products" />

        <Card title="Salidas" value={kpis.outTotal} icon="products" />
      </div>

      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Insights</h2>

          <span className="text-xs text-gray-400">Análisis automático</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Mejor categoría</p>

            <p className="text-white font-semibold text-sm">
              {insights.bestCategory || "Sin datos"}
            </p>

            <div className="mt-2 h-1 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-[#BB86FC]" />
            </div>
          </div>

          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Riesgo de stock</p>

            <p className="text-white font-semibold text-sm">
              {insights.lowStock} productos
            </p>

            <p className="text-xs text-red-400 mt-2">Requiere atención</p>
          </div>

          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Tendencia del negocio</p>

            <p
              className={`font-semibold text-sm ${
                insights.trend === "up" ? "text-green-400" : "text-red-400"
              }`}
            >
              {insights.trend === "up" ? "Creciendo ↗" : "Bajando ↘"}
            </p>

            <p className="text-xs text-gray-300 mt-2">
              Comparación últimos días
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-300 border-t border-[#2A2A2A] pt-3">
          Datos generados automáticamente desde la actividad del inventario
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartContainer title="Actividad" type="bar" data={byDay} />

        <ChartContainer
          title="Entradas vs Salidas"
          type="doughnut"
          data={inOut}
        />
      </div>

      <ChartContainer
        title="Stock por categoría"
        type="doughnut"
        data={stockByCategory}
      />

      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4">
        <h2 className="text-white font-semibold mb-3">
          Productos con Stock Bajo
        </h2>

        <Table
          columns={[
            { header: "Product", accessor: "name" },
            { header: "Stock", accessor: "stock" },
          ]}
          data={report.filter((p) => p.stock <= 5)}
        />
      </div>
    </div>
  );
};

export default Reports;
