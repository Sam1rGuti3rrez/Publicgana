import { normalizeRole } from "./roles";

export interface OwnershipPolicy {
  ownerUserId: string;
  resourceUserId: string;
}

export interface CompanyOwnershipPolicy {
  ownerUserId: string;
  companyOwnerUserId: string | null;
}

export function canAccessOwnResource(
  role: string,
  authenticatedUserId: string,
  resourceUserId: string,
): boolean {
  const normalized = normalizeRole(role);
  return ["ADMIN", "PROMOTOR", "NEGOCIO"].includes(normalized)
    && authenticatedUserId.length > 0
    && authenticatedUserId === resourceUserId;
}

export function canNegocioAccessOwnCompany(
  role: string,
  authenticatedUserId: string,
  companyOwnerUserId: string | null,
): boolean {
  return (
    normalizeRole(role) === "NEGOCIO" &&
    authenticatedUserId.length > 0 &&
    companyOwnerUserId !== null &&
    authenticatedUserId === companyOwnerUserId
  );
}

export function canAccessOwnCampaign(
  role: string,
  authenticatedUserId: string,
  campaignCreatorId: string,
): boolean {
  return (
    normalizeRole(role) === "NEGOCIO" &&
    authenticatedUserId.length > 0 &&
    authenticatedUserId === campaignCreatorId
  );
}
