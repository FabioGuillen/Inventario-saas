import React from "react";

export interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  createdAt: Date;
  movements: Movement[];
}

export interface Movement {
  id?: number;
  productId: number;
  name?: string;
  type: "IN" | "OUT";
  quantity: number;
  createdAt: string;
}

export interface MovementWithProduct extends Movement {
  product: Product;
}

export interface MovementUser {
  id: number;

  userId: number;
  userName: string;
  userEmail: string;
  userRole: "owner" | "admin" | "employee";

  productId: number;
  productName: string;

  type: "IN" | "OUT";
  quantity: number;

  createdAt: string;
}

export interface Column<T> {
  header: string;

  accessor: keyof T | "actions";

  render?: (value: T[keyof T] | any, row: T) => React.ReactNode;

  className?: string;
}

export interface Dashboard {
  totalProducts: number;
  totalStock: number;
  recentMovements: MovementWithProduct[];
  lowStock: Product[];
}
