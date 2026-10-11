import assert from "node:assert/strict";
import { after, test } from "node:test";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "security-session-test-secret";

const originalWebOrigin = process.env.WEB_ORIGIN;
const originalNodeEnv = process.env.NODE_ENV;
const { getTokenExpiration, verifyToken } = await import("../app/lib/jwt.ts");
const {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  getRequestToken,
  hasRequiredRole,
  isTrustedWebOrigin,
  shouldIssueAdminSessionCookie,
} = await import("../app/lib/security.ts");

after(() => {
  if (originalWebOrigin === undefined) {
    delete process.env.WEB_ORIGIN;
  } else {
    process.env.WEB_ORIGIN = originalWebOrigin;
  }

  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }
});

test("requires ADMIN while accepting stored role casing", () => {
  assert.equal(hasRequiredRole("ADMIN", "ADMIN"), true);
  assert.equal(hasRequiredRole("admin", "ADMIN"), true);
  assert.equal(hasRequiredRole("promotor", "ADMIN"), false);
});

test("reads bearer and admin cookie credentials, and rejects missing tokens", () => {
  assert.equal(getRequestToken(new Request("https://example.test")), null);
  assert.equal(
    getRequestToken(
      new Request("https://example.test", {
        headers: { Authorization: "Bearer access-token" },
      }),
    ),
    "access-token",
  );
  assert.equal(
    getRequestToken(
      new Request("https://example.test", {
        headers: { Cookie: `${ADMIN_SESSION_COOKIE}=session-token` },
      }),
    ),
    "session-token",
  );
});

test("rejects expired JWTs and derives cookie expiry from the JWT exp claim", () => {
  const expiredToken = jwt.sign(
    { userId: "user-id", rol: "ADMIN" },
    process.env.JWT_SECRET,
    { expiresIn: -1 },
  );
  assert.throws(() => verifyToken(expiredToken));

  const validToken = jwt.sign(
    { userId: "user-id", rol: "ADMIN" },
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
  );
  const payload = jwt.decode(validToken);
  assert.equal(
    getTokenExpiration(validToken).getTime(),
    payload.exp * 1000,
  );
});

test("sets a host-only HttpOnly Lax cookie with production Secure", () => {
  process.env.NODE_ENV = "production";
  const options = getAdminSessionCookieOptions(new Date("2030-01-01T00:00:00Z"));

  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.sameSite, "lax");
  assert.equal(options.path, "/");
  assert.equal("domain" in options, false);
});

test("allows only the configured web origin and excludes Expo and hostile origins", () => {
  process.env.NODE_ENV = "production";
  process.env.WEB_ORIGIN = "https://admin.publigana.example";

  const requestFrom = (origin) =>
    new Request("https://api.publigana.example", {
      headers: origin ? { Origin: origin } : {},
    });

  assert.equal(isTrustedWebOrigin(requestFrom("https://admin.publigana.example")), true);
  assert.equal(isTrustedWebOrigin(requestFrom("http://localhost:8081")), false);
  assert.equal(isTrustedWebOrigin(requestFrom("https://admin.publigana.example.attacker.test")), false);
  assert.equal(isTrustedWebOrigin(requestFrom(null)), false);
  assert.equal(
    shouldIssueAdminSessionCookie("ADMIN", requestFrom("https://admin.publigana.example")),
    true,
  );
  assert.equal(
    shouldIssueAdminSessionCookie("NEGOCIO", requestFrom("https://admin.publigana.example")),
    false,
  );
  assert.equal(
    shouldIssueAdminSessionCookie("ADMIN", requestFrom("http://localhost:8081")),
    false,
  );
});

test("fails closed when production WEB_ORIGIN is missing", () => {
  process.env.NODE_ENV = "production";
  delete process.env.WEB_ORIGIN;

  assert.equal(
    isTrustedWebOrigin(
      new Request("https://admin.publigana.example", {
        headers: { Origin: "https://admin.publigana.example" },
      }),
    ),
    false,
  );
});