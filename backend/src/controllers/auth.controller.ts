import bcrypt from "bcryptjs";
import "dotenv/config";
import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { createAccessToken } from "../utils/jwt.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = createAccessToken({
      id: user.id,
      role: { name: user.role.name },
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error during login" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as RegisterBody;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Ya existe un usuario con ese email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await prisma.user.count();
    let roleName = "employee";

    if (userCount === 0) roleName = "owner";
    else if (userCount === 1) roleName = "admin";

    const role = await prisma.role.findUnique({ where: { name: roleName } });

    if (!role) {
      return res.status(500).json({ error: `Rol ${roleName} no encontrado` });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        roleId: role.id,
      },
      include: { role: true },
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error during registration" });
  }
};

export const verifyProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ ok: false });
  }
  return res.json({
    ok: true,
    user: {
      id: user.id,
      role: user.role,
    },
  });
};

export const createUserByOwner = async (req: AuthRequest, res: Response) => {
  try {
    const owner = req.user;
    if (!owner || owner.role !== "owner") {
      return res
        .status(403)
        .json({ error: "Solo el propietario puede crear usuarios" });
    }
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Ya existe un usuario con ese email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).json({ error: "Rol inválido" });
    }
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        roleId: roleRecord.id,
      },
      include: { role: true },
    });
    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error during user creation" });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  try {
    if (!user || (user.role !== "owner" && user.role !== "admin")) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para ver los usuarios" });
    }
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { id: "asc" },
    });
    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role.name,
      createdAt: u.createdAt,
    }));
    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const changeUserRole = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  try {
    if (!user || user.role !== "owner") {
      return res
        .status(403)
        .json({ error: "Solo el propietario puede cambiar roles" });
    }
    const { id } = req.params;
    const { role } = req.body;
    const dbRole = await prisma.role.findUnique({ where: { name: role } });
    if (!dbRole) {
      return res.status(400).json({ error: "Rol inválido" });
    }
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { roleId: dbRole.id },
      include: { role: true },
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role.name,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user role" });
  }
};
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  try {
    if (!user || user.role !== "owner") {
      return res
        .status(403)
        .json({ error: "Solo el propietario puede eliminar usuarios" });
    }
    const { id } = req.params;
    if (Number(id) === user.id) {
      return res
        .status(400)
        .json({ error: "No puedes eliminar tu propio usuario" });
    }
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};
export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: {
          select: { name: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const formattedProfile = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role.name,
    };

    res.json(formattedProfile);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};
