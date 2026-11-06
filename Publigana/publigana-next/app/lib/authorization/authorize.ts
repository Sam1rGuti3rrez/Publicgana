import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  type AuthenticatedUser,
} from "../auth";
import { normalizeRole, isAuthenticatedRole, type AuthenticatedRole } from "./roles";
import { PERMISSIONS, hasPermission, type Permission } from "./permissions";
import {
  canAccessOwnResource,
  canAccessOwnCampaign,
  canNegocioAccessOwnCompany,
} from "./policies";

export type AuthorizationResult =
  | { usuario: NonNullable<AuthenticatedUser> }
  | { response: NextResponse };

export function forbiddenResponse(): NextResponse {
  return NextResponse.json(
    { error: "No tienes permisos para realizar esta acción" },
    { status: 403 },
  );
}

export async function requireRoleAuthorization(
  request: Request,
  requiredRoles: readonly AuthenticatedRole[],
): Promise<AuthorizationResult> {
  const result = await getAuthenticatedUser(request);

  if ("response" in result) {
    return result;
  }

  const role = normalizeRole(result.usuario.rol.nombre);
  if (!isAuthenticatedRole(role) || !requiredRoles.includes(role)) {
    return { response: forbiddenResponse() };
  }

  return { usuario: result.usuario };
}

export async function requirePermission(
  request: Request,
  permission: Permission,
): Promise<AuthorizationResult> {
  const result = await getAuthenticatedUser(request);

  if ("response" in result) {
    return result;
  }

  if (!hasPermission(result.usuario.rol.nombre, permission)) {
    return { response: forbiddenResponse() };
  }

  return { usuario: result.usuario };
}

export async function requireSelfResource(
  request: Request,
  resourceUserId: string,
): Promise<AuthorizationResult> {
  const result = await getAuthenticatedUser(request);

  if ("response" in result) {
    return result;
  }

  if (
    !canAccessOwnResource(
      result.usuario.rol.nombre,
      result.usuario.id,
      resourceUserId,
    )
  ) {
    return { response: forbiddenResponse() };
  }

  return { usuario: result.usuario };
}

export async function requireEmpresaOwner(
  request: Request,
  companyOwnerUserId: string | null,
  adminPermission: Permission = PERMISSIONS.COMPANY_VIEW_ALL,
): Promise<AuthorizationResult> {
  const result = await getAuthenticatedUser(request);

  if ("response" in result) {
    return result;
  }

  const role = normalizeRole(result.usuario.rol.nombre);
  const ownsCompany = canNegocioAccessOwnCompany(
    role,
    result.usuario.id,
    companyOwnerUserId,
  );
  const hasExplicitAdminPermission =
    role === "ADMIN" && hasPermission(role, adminPermission);

  if (!ownsCompany && !hasExplicitAdminPermission) {
    return { response: forbiddenResponse() };
  }

  return { usuario: result.usuario };
}

export async function requireCampaignOwner(
  request: Request,
  campaignCreatorId: string,
  adminPermission: Permission = PERMISSIONS.CAMPAIGN_VIEW_ALL,
): Promise<AuthorizationResult> {
  const result = await getAuthenticatedUser(request);

  if ("response" in result) {
    return result;
  }

  const role = normalizeRole(result.usuario.rol.nombre);
  const ownsCampaign = canAccessOwnCampaign(
    role,
    result.usuario.id,
    campaignCreatorId,
  );
  const hasExplicitAdminPermission =
    role === "ADMIN" && hasPermission(role, adminPermission);

  if (!ownsCampaign && !hasExplicitAdminPermission) {
    return { response: forbiddenResponse() };
  }

  return { usuario: result.usuario };
}
