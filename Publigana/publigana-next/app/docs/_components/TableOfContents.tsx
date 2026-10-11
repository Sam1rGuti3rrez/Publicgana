"use client";

import { useEffect, useState } from "react";
import type { DocSection } from "../content";
import styles from "../docs.module.css";

export default function TableOfContents({ sections }: { sections: DocSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((heading): heading is HTMLElement => heading instanceof HTMLElement);

    if (!headings.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];

        if (visibleHeading) {
          setActiveId(visibleHeading.target.id);
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [sections]);

  const links = sections.map((section) => (
    <a
      className={activeId === section.id ? styles.tocLinkActive : styles.tocLink}
      href={`#${section.id}`}
      aria-current={activeId === section.id ? "location" : undefined}
      key={section.id}
    >
      {section.title}
    </a>
  ));

  return (
    <aside className={styles.toc} aria-label="Tabla de contenidos">
      <div className={styles.tocDesktop}>
        <p className={styles.tocTitle}>En esta página</p>
        <nav>{links}</nav>
      </div>
      <details className={styles.tocMobile}>
        <summary>En esta página</summary>
        <nav>{links}</nav>
      </details>
    </aside>
  );
}