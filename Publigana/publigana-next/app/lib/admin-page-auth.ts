import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireRole } from "@/app/lib/auth";
import { ADMIN_SESSION_COOKIE } from "@/app/lib/security";

export async function requireAdminPage() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const request = new Request("http://localhost", {
    headers: { Cookie: `${ADMIN_SESSION_COOKIE}=${token}` },
  });
  const auth = await requireRole(request, "ADMIN");

  if ("response" in auth) {
    redirect("/admin/login");
  }

  return auth.usuario;
}