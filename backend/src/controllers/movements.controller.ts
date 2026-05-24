import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

type MovementType = "IN" | "OUT";

export const getMovements = async (req: Request, res: Response) => {
  try {
    const movements = await prisma.product.findMany({
      include: {
        movements: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los movimientos" });
  }
};

export const createMovement = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, type } = req.body as {
      productId: number;
      quantity: number;
      type: MovementType;
    };

    if (!productId || quantity == null || !type) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (type !== "IN" && type !== "OUT") {
      return res.status(400).json({ message: "Tipo de movimiento inválido" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    let newStock = product.stock;

    if (type === "IN") {
      newStock += quantity;
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Stock insuficiente" });
      }
      newStock -= quantity;
    }

    const createdMovement = await prisma.movement.create({
      data: {
        productId,
        quantity,
        type,
        userId: req.user.id,
      },
    });

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        stock: newStock,
      },
    });

    res.status(201).json({ createdMovement, updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el movimiento" });
  }
};

export const getMovementUsers = async (req: Request, res: Response) => {
  try {
    const movementUsers = await prisma.movement.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        product: { select: { id: true, name: true, stock: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const formatted = movementUsers.map((item) => ({
      id: item.id,
      userId: item.user.id,
      userName: item.user.name,
      userEmail: item.user.email,
      userRole: item.user.role,
      productId: item.product.id,
      productName: item.product.name,
      type: item.type,
      quantity: item.quantity,
      createdAt: item.createdAt,
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los movimientos por usuarios" });
  }
};
