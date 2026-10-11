import type { ReactNode } from "react";
import { requireAdminPage } from "@/app/lib/admin-page-auth";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await requireAdminPage();
  return children;
}