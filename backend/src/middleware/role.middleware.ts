import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware.js";

type Role = string;

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user as { role?: string } | undefined;

    if (!user) {
      return res.status(401).json({ error: "Acceso denegado" });
    }

    if (!user.role || !roles.includes(user.role)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para acceder a esta ruta" });
    }

    next();
  };
};
