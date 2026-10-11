import { NextResponse } from "next/server";
import { getPrisma } from "@/app/lib/prisma";
import { verifyToken, type TokenPayload } from "@/app/lib/jwt";
import {
  getRequestToken,
  hasRequiredRole,
  isTrustedWebOrigin,
} from "@/app/lib/security";

const unauthorized = (error: string) =>
  NextResponse.json({ error }, { status: 401 });

type AuthenticatedUser = Awaited<
  ReturnType<typeof findActiveUser>
>;

type AuthResult =
  | { usuario: NonNullable<AuthenticatedUser>; payload: TokenPayload }
  | { response: NextResponse };

async function findActiveUser(userId: string) {
  return getPrisma().usuario.findUnique({
    where: { id: userId },
    include: { rol: true },
  });
}

export async function getAuthenticatedUser(
  request: Request,
): Promise<AuthResult> {
  const token = getRequestToken(request);

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

  if (!hasRequiredRole(result.usuario.rol.nombre, requiredRole)) {
    return {
      response: NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 },
      ),
    };
  }

  return result;
}

export async function requireAdminMutation(
  request: Request,
): Promise<AuthResult> {
  if (!isTrustedWebOrigin(request)) {
    return {
      response: NextResponse.json(
        { error: "Origen no permitido" },
        { status: 403 },
      ),
    };
  }

  return requireRole(request, "ADMIN");
}
