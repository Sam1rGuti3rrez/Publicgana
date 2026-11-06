import { normalizeRole, type AuthenticatedRole } from "./roles";

export const PERMISSIONS = {
  USERS_LIST: "users:list",
  USERS_VIEW: "users:view",
  USERS_MANAGE: "users:manage",
  PROFILE_VIEW_OWN: "profile:view-own",
  PROFILE_UPDATE_OWN: "profile:update-own",
  PROMOTOR_DATA_VIEW_OWN: "promotor-data:view-own",
  NEGOCIO_DATA_VIEW_OWN: "negocio-data:view-own",
  CAMPAIGN_VIEW_PUBLIC: "campaign:view-public",
  CAMPAIGN_VIEW_OWN: "campaign:view-own",
  CAMPAIGN_MANAGE_OWN: "campaign:manage-own",
  PARTICIPATION_VIEW_OWN: "participation:view-own",
  EVIDENCE_VIEW_OWN: "evidence:view-own",
  PLATFORM_STATS_VIEW: "platform-stats:view",
  COMPANY_VIEW_ALL: "company:view-all",
  COMPANY_MANAGE_ALL: "company:manage-all",
  CAMPAIGN_VIEW_ALL: "campaign:view-all",
  CAMPAIGN_MANAGE_ALL: "campaign:manage-all",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ADMIN_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.USERS_LIST,
  PERMISSIONS.USERS_VIEW,
  PERMISSIONS.USERS_MANAGE,
  PERMISSIONS.PROFILE_VIEW_OWN,
  PERMISSIONS.PROFILE_UPDATE_OWN,
  PERMISSIONS.PLATFORM_STATS_VIEW,
  PERMISSIONS.COMPANY_VIEW_ALL,
  PERMISSIONS.COMPANY_MANAGE_ALL,
  PERMISSIONS.CAMPAIGN_VIEW_ALL,
  PERMISSIONS.CAMPAIGN_MANAGE_ALL,
];

const PROMOTOR_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.PROFILE_VIEW_OWN,
  PERMISSIONS.PROFILE_UPDATE_OWN,
  PERMISSIONS.PROMOTOR_DATA_VIEW_OWN,
  PERMISSIONS.CAMPAIGN_VIEW_PUBLIC,
  PERMISSIONS.PARTICIPATION_VIEW_OWN,
  PERMISSIONS.EVIDENCE_VIEW_OWN,
];

const NEGOCIO_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.PROFILE_VIEW_OWN,
  PERMISSIONS.PROFILE_UPDATE_OWN,
  PERMISSIONS.NEGOCIO_DATA_VIEW_OWN,
  PERMISSIONS.CAMPAIGN_VIEW_PUBLIC,
  PERMISSIONS.CAMPAIGN_VIEW_OWN,
  PERMISSIONS.CAMPAIGN_MANAGE_OWN,
];

const PERMISSIONS_BY_ROLE: Record<AuthenticatedRole, readonly Permission[]> = {
  ADMIN: ADMIN_PERMISSIONS,
  PROMOTOR: PROMOTOR_PERMISSIONS,
  NEGOCIO: NEGOCIO_PERMISSIONS,
};

export function hasPermission(role: string, permission: Permission): boolean {
  const normalized = normalizeRole(role) as AuthenticatedRole;
  return PERMISSIONS_BY_ROLE[normalized]?.includes(permission) ?? false;
}
