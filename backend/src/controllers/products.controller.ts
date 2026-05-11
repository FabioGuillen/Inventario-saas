import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching products" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, stock, price } = req.body;

    if (!name || !category || stock == null || price == null) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const parsedStock = Number(stock);
    const parsedPrice = Number(price);

    if (isNaN(parsedStock) || isNaN(parsedPrice)) {
      return res.status(400).json({ error: "Stock o precio inválido" });
    }

    const normalizedName = name.trim();

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: "insensitive",
        },
      },
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Ya existe un producto con ese nombre" });
    }

    const product = await prisma.product.create({
      data: {
        name: normalizedName,
        category: category.trim(),
        stock: parsedStock,
        price: parsedPrice,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({ error: "Error creating product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, stock, price } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const duplicateProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        NOT: {
          id: Number(id),
        },
      },
    });

    if (duplicateProduct) {
      return res
        .status(400)
        .json({ error: "Ya existe un producto con ese nombre" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: name.trim(),
        category: category.trim(),
        stock: Number(stock),
        price: Number(price),
      },
    });

    return res.json(updatedProduct);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({ error: "Error updating product" });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const query = (req.query.query as string)?.trim();

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 20,
      orderBy: {
        name: "asc",
      },
    });

    return res.json(products);
  } catch (error) {
    console.error("SEARCH PRODUCTS ERROR:", error);
    return res.status(500).json({ error: "Error searching products" });
  }
};
