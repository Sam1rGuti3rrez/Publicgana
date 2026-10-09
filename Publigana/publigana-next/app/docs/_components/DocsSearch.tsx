"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import { docsPages, getDocsHref, type DocBlock } from "../content";
import styles from "../docs.module.css";

function getBlockText(block: DocBlock): string {
  switch (block.kind) {
    case "paragraph":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "table":
      return block.table.rows.flat().join(" ");
    case "code":
      return block.code;
    case "callout":
      return `${block.title} ${block.text}`;
  }
}

export default function DocsSearch({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const inputId = useId();
  const resultsId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const normalizedQuery = query.trim().toLocaleLowerCase("es");

  const results = normalizedQuery
    ? docsPages
        .map((page) => {
          const title = page.title.toLocaleLowerCase("es");
          const description = page.description.toLocaleLowerCase("es");
          const keywords = page.keywords.join(" ").toLocaleLowerCase("es");
          const sectionTitles = page.sections.map((section) => section.title).join(" ").toLocaleLowerCase("es");
          const body = page.sections.flatMap((section) => section.blocks.map(getBlockText)).join(" ").toLocaleLowerCase("es");
          const score =
            (title.includes(normalizedQuery) ? 8 : 0) +
            (sectionTitles.includes(normalizedQuery) ? 5 : 0) +
            (keywords.includes(normalizedQuery) ? 4 : 0) +
            (description.includes(normalizedQuery) ? 2 : 0) +
            (body.includes(normalizedQuery) ? 1 : 0);

          return { page, score };
        })
        .filter((result) => result.score > 0)
        .sort((first, second) => second.score - first.score)
        .slice(0, 6)
    : [];

  function openResult(index: number) {
    const result = results[index];
    if (!result) return;

    router.push(getDocsHref(result.page));
    setQuery("");
    setIsOpen(false);
    onNavigate?.();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && results.length) {
      event.preventDefault();
      openResult(activeIndex);
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  }

  return (
    <div className={styles.searchRoot}>
      <label className={styles.srOnly} htmlFor={inputId}>Buscar en la documentación</label>
      <div className={`${styles.searchBox} ${isOpen && query ? styles.searchBoxOpen : ""}`}>
        <FiSearch className={styles.searchIcon} aria-hidden="true" />
        <input
          autoComplete="off"
          id={inputId}
          ref={inputRef}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={Boolean(query) && isOpen}
          aria-controls={resultsId}
          aria-activedescendant={isOpen && results[activeIndex] ? `${resultsId}-${results[activeIndex].page.slug}` : undefined}
          placeholder="Buscar temas, rutas, modelos…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query ? (
          <button
            className={styles.searchClear}
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
          >
            <FiX aria-hidden="true" />
          </button>
        ) : <kbd className={styles.searchShortcut} aria-hidden="true">/</kbd>}
      </div>

      {query && isOpen && (
        <div className={styles.searchResults}>
          {results.length ? (
            <ul id={resultsId} role="listbox" aria-label="Resultados de búsqueda">
              {results.map(({ page }, index) => (
                <li id={`${resultsId}-${page.slug}`} role="option" aria-selected={activeIndex === index} key={page.slug}>
                  <button
                    type="button"
                    className={activeIndex === index ? styles.searchResultActive : styles.searchResult}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => openResult(index)}
                  >
                    <span>
                      <strong>{page.title}</strong>
                      <small>{page.description}</small>
                    </span>
                    <FiArrowRight aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.searchEmpty} role="status">
              <strong>Sin coincidencias</strong>
              <span>Prueba con una ruta, un modelo o una tecnología.</span>
            </div>
          )}
          <div className={styles.searchFooter}>
            <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
            <span><kbd>Enter</kbd> abrir</span>
            <span><kbd>Esc</kbd> cerrar</span>
          </div>
        </div>
      )}
    </div>
  );
}