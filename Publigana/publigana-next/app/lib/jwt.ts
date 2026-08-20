import jwt from "jsonwebtoken";

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET no está definida");
}

const JWT_SECRET: string = rawSecret;

export interface TokenPayload {
  userId: string;
  rol: string;
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

  if (!decoded || typeof decoded === "string") {
    throw new Error("Token inválido");
  }

  const userId = (decoded as any).userId;
  const rol = (decoded as any).rol;

  // Validación defensiva: ambos campos son obligatorios
  if (!userId || !rol) {
    throw new Error(`Token incompleto: falta userId o rol`);
  }

  return {
    userId: String(userId),
    rol: String(rol),
  };
}

export default jwt;
