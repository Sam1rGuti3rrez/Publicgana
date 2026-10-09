import type { Metadata } from "next";
import DocsArticle from "./_components/DocsArticle";
import { getDocsPage } from "./content";

export const metadata: Metadata = {
  title: "Documentación técnica",
  description: "Introducción a PubliGana y mapa de la documentación del proyecto.",
};

export default function DocsHomePage() {
  const page = getDocsPage("introduccion");

  if (!page) {
    return null;
  }

  return <DocsArticle page={page} />;
}