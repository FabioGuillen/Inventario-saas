import jwt from "jsonwebtoken";
import "dotenv/config";

interface UserForToken {
  id: number;
  role: {
    name: string;
  };
}

interface TokenPayload {
  id: number;
  role: string;
}

export const createAccessToken = (user: UserForToken): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload: TokenPayload = {
    id: user.id,
    role: user.role.name,
  };

  return jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
};
