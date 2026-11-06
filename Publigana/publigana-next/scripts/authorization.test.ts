import assert from "node:assert/strict";
import { test } from "node:test";

process.env.JWT_SECRET ??= "authorization-test-secret";

import { PERMISSIONS, hasPermission } from "../app/lib/authorization/permissions";
import {
  canAccessOwnResource,
  canAccessOwnCampaign,
  canNegocioAccessOwnCompany,
} from "../app/lib/authorization/policies";
import { normalizeRole } from "../app/lib/authorization/roles";

test("normalizes role names from persisted database values", () => {
  assert.equal(normalizeRole(" admin "), "ADMIN");
  assert.equal(normalizeRole("PROMOTOR"), "PROMOTOR");
  assert.equal(normalizeRole(null), "");
});

test("ADMIN has administrative permissions", () => {
  assert.equal(hasPermission("ADMIN", PERMISSIONS.USERS_LIST), true);
  assert.equal(hasPermission("admin", PERMISSIONS.USERS_MANAGE), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.PLATFORM_STATS_VIEW), true);
});

test("PROMOTOR cannot access administrative permissions", () => {
  assert.equal(hasPermission("PROMOTOR", PERMISSIONS.USERS_LIST), false);
  assert.equal(hasPermission("PROMOTOR", PERMISSIONS.USERS_MANAGE), false);
});

test("NEGOCIO cannot access administrative permissions", () => {
  assert.equal(hasPermission("NEGOCIO", PERMISSIONS.USERS_LIST), false);
  assert.equal(hasPermission("NEGOCIO", PERMISSIONS.PLATFORM_STATS_VIEW), false);
});

test("users can access only matching owned resources", () => {
  assert.equal(
    canAccessOwnResource("PROMOTOR", "promotor-a", "promotor-a"),
    true,
  );
  assert.equal(
    canAccessOwnResource("PROMOTOR", "promotor-a", "promotor-b"),
    false,
  );
  assert.equal(
    canAccessOwnResource("NEGOCIO", "negocio-a", "negocio-b"),
    false,
  );
});

test("NEGOCIO can access a company only when its owner matches the user", () => {
  assert.equal(
    canNegocioAccessOwnCompany("NEGOCIO", "negocio-a", "negocio-a"),
    true,
  );
  assert.equal(
    canNegocioAccessOwnCompany("NEGOCIO", "negocio-a", "negocio-b"),
    false,
  );
  assert.equal(
    canNegocioAccessOwnCompany("PROMOTOR", "negocio-a", "negocio-a"),
    false,
  );
});

test("campaign owner policy uses creator identity and excludes PROMOTOR", () => {
  assert.equal(
    canAccessOwnCampaign("NEGOCIO", "negocio-a", "negocio-a"),
    true,
  );
  assert.equal(
    canAccessOwnCampaign("NEGOCIO", "negocio-a", "negocio-b"),
    false,
  );
  assert.equal(
    canAccessOwnCampaign("PROMOTOR", "negocio-a", "negocio-a"),
    false,
  );
});

test("frontend role values are ignored by policy helpers", () => {
  assert.equal(hasPermission("unknown", PERMISSIONS.USERS_LIST), false);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.CAMPAIGN_MANAGE_OWN), false);
});

test("ADMIN permissions are explicit and role-independent", () => {
  assert.equal(hasPermission("ADMIN", PERMISSIONS.COMPANY_VIEW_ALL), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.COMPANY_MANAGE_ALL), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.CAMPAIGN_VIEW_ALL), true);
  assert.equal(hasPermission("ADMIN", PERMISSIONS.CAMPAIGN_MANAGE_ALL), true);
  assert.equal(hasPermission("PROMOTOR", PERMISSIONS.COMPANY_VIEW_ALL), false);
  assert.equal(hasPermission("NEGOCIO", PERMISSIONS.CAMPAIGN_VIEW_ALL), false);
});

test("nullable company owners never authorize NEGOCIO access", () => {
  assert.equal(
    canNegocioAccessOwnCompany("NEGOCIO", "negocio-a", null),
    false,
  );
  assert.equal(
    canNegocioAccessOwnCompany("NEGOCIO", "negocio-a", "negocio-a"),
    true,
  );
  assert.equal(
    canNegocioAccessOwnCompany("NEGOCIO", "negocio-a", "negocio-b"),
    false,
  );
  assert.equal(
    canNegocioAccessOwnCompany("ADMIN", "admin-a", "admin-a"),
    false,
  );
});

test("different users in the same role cannot access private resources", () => {
  assert.equal(
    canAccessOwnResource("PROMOTOR", "promotor-a", "promotor-b"),
    false,
  );
  assert.equal(
    canAccessOwnResource("NEGOCIO", "negocio-a", "negocio-b"),
    false,
  );
  assert.equal(
    canAccessOwnResource("ADMIN", "admin-a", "admin-b"),
    false,
  );
  assert.equal(
    canAccessOwnResource("PROMOTOR", "promotor-a", "promotor-a"),
    true,
  );
});

test("campaign ownership rejects other users and manipulated frontend role values", () => {
  assert.equal(
    canAccessOwnCampaign("NEGOCIO", "negocio-a", "negocio-a"),
    true,
  );
  assert.equal(
    canAccessOwnCampaign("NEGOCIO", "negocio-a", "negocio-b"),
    false,
  );
  assert.equal(
    canAccessOwnCampaign("ADMIN", "admin-a", "negocio-a"),
    false,
  );
  assert.equal(
    canAccessOwnCampaign("unknown", "negocio-a", "negocio-a"),
    false,
  );
});

test("protected endpoints return HTTP 401 without authentication", async () => {
  const { GET: getUsuarios } = await import("../app/api/usuarios/route");
  const { GET: getOwnProfile } = await import("../app/api/usuarios/me/route");

  const usuariosResponse = await getUsuarios(
    new Request("http://localhost/api/usuarios"),
  );
  const profileResponse = await getOwnProfile(
    new Request("http://localhost/api/usuarios/me"),
  );

  assert.equal(usuariosResponse.status, 401);
  assert.equal(profileResponse.status, 401);
});

test("authorization denial returns a non-descriptive HTTP 403 response", async () => {
  const { forbiddenResponse } = await import("../app/lib/authorization/authorize");
  const response = forbiddenResponse();

  assert.equal(response.status, 403);
});
