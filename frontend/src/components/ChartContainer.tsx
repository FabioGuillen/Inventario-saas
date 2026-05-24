import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
);

interface ChartContainerProps {
  title: string;
  type: "bar" | "doughnut";
  data: any;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  type,
  data,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#FFFFFF",
          padding: 16,
        },
      },
    },
    layout: {
      padding: 12,
    },
    scales:
      type === "bar"
        ? {
            x: {
              ticks: { color: "#B0B0B0" },
              grid: { color: "#2A2A2A" },
            },
            y: {
              ticks: { color: "#B0B0B0" },
              grid: { color: "#2A2A2A" },
            },
          }
        : undefined,
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#373737] rounded-lg p-4 sm:p-6 w-full flex flex-col gap-4">
      <h3 className="text-white font-semibold text-sm sm:text-base">{title}</h3>

      <div className="relative w-full  sm:h-[300px] md:h-[340px]">
        {type === "bar" && <Bar data={data} options={options} />}
        {type === "doughnut" && <Doughnut data={data} options={options} />}
      </div>
    </div>
  );
};

export default ChartContainer;
