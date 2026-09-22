import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken, type TokenPayload } from "@/app/lib/jwt";

const unauthorized = (error: string) =>
  NextResponse.json({ error }, { status: 401 });

type AuthenticatedUser = Awaited<
  ReturnType<typeof findActiveUser>
>;

type AuthResult =
  | { usuario: NonNullable<AuthenticatedUser>; payload: TokenPayload }
  | { response: NextResponse };

async function findActiveUser(userId: string) {
  return prisma.usuario.findUnique({
    where: { id: userId },
    include: { rol: true },
  });
}

export async function getAuthenticatedUser(
  request: Request,
): Promise<AuthResult> {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();

  if (!token) {
    return { response: unauthorized("No autorizado") };
  }

  let payload: TokenPayload;
  try {
    payload = verifyToken(token);
  } catch {
    return { response: unauthorized("Token inválido") };
  }

  if (!payload.userId) {
    return { response: unauthorized("Token incompleto o inválido") };
  }

  const usuario = await findActiveUser(payload.userId);

  if (!usuario || !usuario.activo) {
    return { response: unauthorized("Usuario no encontrado") };
  }

  return { usuario, payload };
}

export async function requireRole(
  request: Request,
  requiredRole: string,
): Promise<AuthResult> {
  const result = await getAuthenticatedUser(request);

  if ("response" in result) {
    return result;
  }

  if (result.usuario.rol.nombre.toUpperCase() !== requiredRole.toUpperCase()) {
    return {
      response: NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 },
      ),
    };
  }

  return result;
}
