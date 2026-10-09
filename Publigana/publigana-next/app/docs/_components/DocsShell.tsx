"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiBookOpen, FiChevronRight, FiMenu, FiX } from "react-icons/fi";
import { docsPageGroups, docsPages, getDocsHref } from "../content";
import DocsSearch from "./DocsSearch";
import styles from "../docs.module.css";

export default function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPage = docsPages.find((page) => getDocsHref(page) === pathname);

  return (
    <div className={styles.docsRoot}>
      {menuOpen && (
        <button
          className={styles.mobileScrim}
          type="button"
          aria-label="Cerrar navegación"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`} aria-label="Navegación de documentación">
        <div className={styles.brandRow}>
          <Link className={styles.brand} href="/docs" onClick={() => setMenuOpen(false)}>
            <Image src="/images/logo.jpg" alt="PubliGana" width={44} height={44} priority />
            <span><strong>PubliGana</strong><small>Docs técnicas</small></span>
          </Link>
          <button className={styles.mobileClose} type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className={styles.sidebarSearch}>
          <DocsSearch onNavigate={() => setMenuOpen(false)} />
        </div>

        <nav className={styles.sidebarNav} aria-label="Capítulos">
          {docsPageGroups.map((group) => (
            <div className={styles.navGroup} key={group.title}>
              <p className={styles.navGroupTitle}>{group.title}</p>
              {group.slugs.map((slug) => {
                const page = docsPages.find((item) => item.slug === slug);
                if (!page) return null;
                const active = getDocsHref(page) === pathname;

                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={active ? styles.navLinkActive : styles.navLink}
                    href={getDocsHref(page)}
                    key={page.slug}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{page.title}</span>
                    {active && <FiChevronRight aria-hidden="true" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.footerIcon}><FiBookOpen aria-hidden="true" /></span>
          <span><strong>Manual del proyecto</strong><small>Web · móvil · datos</small></span>
          <span className={styles.footerDot} aria-label="Estado documentado" />
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.topbar}>
          <button
            className={styles.mobileMenu}
            type="button"
            aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
          <div className={styles.mobileSearch}><DocsSearch /></div>
          <p className={styles.topbarContext}>
            <span>DOCUMENTACIÓN</span>
            <FiChevronRight aria-hidden="true" />
            <strong>{currentPage?.title ?? "PubliGana"}</strong>
          </p>
          <Link className={styles.siteLink} href="/">
            <span>Volver al sitio</span><FiChevronRight aria-hidden="true" />
          </Link>
        </header>
        <main className={styles.mainContent} id="contenido-principal" tabIndex={-1}>
          {children}
        </main>
        <footer className={styles.pageFooter}>
          <span>PubliGana · documentación técnica</span>
          <span>Contenido basado en el repositorio actual</span>
        </footer>
      </div>
    </div>
  );
}