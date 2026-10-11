import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocsArticle from "../_components/DocsArticle";
import { docsPages, getDocsPage } from "../content";

export function generateStaticParams() {
  return docsPages
    .filter((page) => page.slug !== "introduccion")
    .map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocsPage(slug);

  return page
    ? { title: page.title, description: page.description }
    : { title: "Página no encontrada" };
}

export default async function DocsPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  const page = getDocsPage(slug);

  if (!page || page.slug === "introduccion") {
    notFound();
  }

  return <DocsArticle page={page} />;
}