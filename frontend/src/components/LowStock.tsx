import { useEffect, useState } from "react";
import { getReports } from "../services/report";

const LowStock = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getReports().then((data) => {
      setProducts(data.data.lowStock);
    });
  }, []);

  return (
    <div className="bg-[#121212] p-4 rounded-xl text-white">
      <h2 className="font-bold mb-2">Stock Bajo</h2>
      {products.length === 0 ? (
        <p>Todo en orden ✅</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} - {p.stock}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LowStock;
