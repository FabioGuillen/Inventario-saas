import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

interface ReportResponse {
  totalProducts: number;
  totalStock: number;
  recentMovements: any[];
  lowStock: any[];
}

const getReports = async (req: Request, res: Response) => {
  try {
    const [lowStock, totalProducts, totalStockResult, recentMovements] =
      await Promise.all([
        prisma.product.findMany({
          where: { stock: { lt: 5 } },
        }),
        prisma.product.count(),
        prisma.product.aggregate({
          _sum: { stock: true },
        }),
        prisma.movement.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { product: true },
        }),
      ]);

    const totalStock = totalStockResult._sum.stock ?? 0;

    const response: ReportResponse = {
      totalProducts,
      totalStock,
      recentMovements,
      lowStock,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Error fetching reports" });
  }
};

export default getReports;
