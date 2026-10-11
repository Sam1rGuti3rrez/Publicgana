import type { Metadata } from "next";
import DocsShell from "./_components/DocsShell";

export const metadata: Metadata = {
  title: {
    default: "Documentación técnica | PubliGana",
    template: "%s | PubliGana Docs",
  },
  description: "Guía técnica de PubliGana: arquitectura, configuración, API, PostgreSQL y aplicación móvil.",
};

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DocsShell>{children}</DocsShell>;
}