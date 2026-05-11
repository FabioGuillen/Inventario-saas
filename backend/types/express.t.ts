import { JwtPayload } from "jsonwebtoken";

interface AuthUser {
  id: number;
  role: string;
}

interface TokenPayload extends JwtPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
