export const ADMIN_SESSION_COOKIE = "publigana_admin_session";

export function getAdminSessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

export function getRequestToken(request: Pick<Request, "headers">) {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const bearerToken = match?.[1]?.trim();

  if (bearerToken) {
    return bearerToken;
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));

  return cookie?.slice(ADMIN_SESSION_COOKIE.length + 1) || null;
}

export function hasRequiredRole(actualRole: string, requiredRole: string) {
  return actualRole.toUpperCase() === requiredRole.toUpperCase();
}

function parseOrigin(value: string) {
  try {
    const url = new URL(value);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export function isTrustedWebOrigin(request: Pick<Request, "headers">) {
  const requestOrigin = request.headers.get("origin");
  const configuredOrigin =
    process.env.WEB_ORIGIN ??
    (process.env.NODE_ENV === "production" ? null : "http://localhost:3000");

  if (!requestOrigin || !configuredOrigin) {
    return false;
  }

  const parsedRequestOrigin = parseOrigin(requestOrigin);
  const parsedConfiguredOrigin = parseOrigin(configuredOrigin);

  return Boolean(
    parsedRequestOrigin &&
      parsedConfiguredOrigin &&
      parsedRequestOrigin === requestOrigin &&
      parsedRequestOrigin === parsedConfiguredOrigin,
  );
}

export function shouldIssueAdminSessionCookie(
  role: string,
  request: Pick<Request, "headers">,
) {
  return hasRequiredRole(role, "ADMIN") && isTrustedWebOrigin(request);
}