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
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded || typeof decoded === "string") {
    throw new Error("Token inválido");
  }

  const userId = decoded.userId;
  const rol = decoded.rol;

  // Validación defensiva: ambos campos son obligatorios
  if (!userId || !rol) {
    throw new Error(`Token incompleto: falta userId o rol`);
  }

  return {
    userId: String(userId),
    rol: String(rol),
  };
}

export function getTokenExpiration(token: string): Date {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string" || typeof decoded.exp !== "number") {
    throw new Error("Token sin fecha de expiración válida");
  }

  return new Date(decoded.exp * 1000);
}

export default jwt;
