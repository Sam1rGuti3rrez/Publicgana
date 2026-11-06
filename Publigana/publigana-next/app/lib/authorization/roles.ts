export const AUTHENTICATED_ROLES = ["ADMIN", "PROMOTOR", "NEGOCIO"] as const;

export type AuthenticatedRole = (typeof AUTHENTICATED_ROLES)[number];

export function normalizeRole(role: string | null | undefined): string {
  return role?.trim().toUpperCase() ?? "";
}

export function isAuthenticatedRole(role: string): role is AuthenticatedRole {
  return AUTHENTICATED_ROLES.includes(normalizeRole(role) as AuthenticatedRole);
}
