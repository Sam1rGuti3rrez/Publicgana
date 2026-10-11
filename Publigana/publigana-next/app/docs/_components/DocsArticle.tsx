import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiBookOpen } from "react-icons/fi";
import CodeBlock from "./CodeBlock";
import TableOfContents from "./TableOfContents";
import { docsPages, getDocsHref, type DocBlock, type DocPage } from "../content";
import styles from "../docs.module.css";

function Block({ block }: { block: DocBlock }) {
  switch (block.kind) {
    case "paragraph":
      return <p className={styles.paragraph}>{block.text}</p>;
    case "list":
      return (
        <ul className={styles.articleList}>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      );
    case "table":
      return (
        <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Tabla desplazable">
          <table className={styles.dataTable}>
            <thead>
              <tr>{block.table.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr>
            </thead>
            <tbody>
              {block.table.rows.map((row) => (
                <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "code":
      return <CodeBlock code={block.code} language={block.language} />;
    case "callout":
      return (
        <aside className={block.tone === "warning" ? styles.calloutWarning : styles.callout}>
          <span className={styles.calloutMark} aria-hidden="true">{block.tone === "warning" ? "!" : "i"}</span>
          <div>
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </div>
        </aside>
      );
  }
}

export default function DocsArticle({ page }: { page: DocPage }) {
  const pageIndex = docsPages.findIndex((item) => item.slug === page.slug);
  const previousPage = docsPages[pageIndex - 1];
  const nextPage = docsPages[pageIndex + 1];

  return (
    <div className={styles.articleLayout}>
      <article className={styles.article}>
        <div className={styles.breadcrumb}>
          <FiBookOpen aria-hidden="true" />
          <Link href="/docs">Documentación</Link>
          <span aria-hidden="true">/</span>
          <span>{page.title}</span>
        </div>

        <header className={styles.articleHeader}>
          <p className={styles.eyebrow}>{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className={styles.lede}>{page.description}</p>
          <div className={styles.articleMeta}>
            <span><span className={styles.statusDot} /> Basado en el código actual</span>
            <span>{page.sections.length} temas</span>
          </div>
        </header>

        <div className={styles.sections}>
          {page.sections.map((section, index) => (
            <section className={styles.docSection} id={section.id} key={section.id}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
              </div>
              <div className={styles.sectionBody}>
                {section.blocks.map((block, blockIndex) => (
                  <Block block={block} key={`${section.id}-${block.kind}-${blockIndex}`} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav className={styles.pageNav} aria-label="Navegación entre páginas">
          {previousPage ? (
            <Link className={styles.pageNavCard} href={getDocsHref(previousPage)}>
              <span><FiArrowLeft aria-hidden="true" /> Anterior</span>
              <strong>{previousPage.title}</strong>
            </Link>
          ) : <span />}
          {nextPage ? (
            <Link className={`${styles.pageNavCard} ${styles.pageNavNext}`} href={getDocsHref(nextPage)}>
              <span>Siguiente <FiArrowRight aria-hidden="true" /></span>
              <strong>{nextPage.title}</strong>
            </Link>
          ) : <span />}
        </nav>
      </article>

      <TableOfContents sections={page.sections} />
    </div>
  );
}