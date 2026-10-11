"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import styles from "../docs.module.css";

const keywords = new Set([
  "async",
  "await",
  "const",
  "datasource",
  "export",
  "false",
  "from",
  "function",
  "generator",
  "if",
  "import",
  "let",
  "model",
  "new",
  "null",
  "provider",
  "return",
  "true",
  "type",
]);

const tokenPattern = /(\/\/.*$|#.*$|--.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b[A-Z][A-Z0-9_]*\b|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_$][\w$]*\b)/g;

function highlightLine(line: string) {
  const tokens: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      tokens.push(line.slice(lastIndex, index));
    }

    let className = "";
    if (token.startsWith("//") || token.startsWith("#") || token.startsWith("--")) {
      className = styles.tokenComment;
    } else if (token.startsWith("\"") || token.startsWith("'") || token.startsWith("`")) {
      className = styles.tokenString;
    } else if (/^\d/.test(token)) {
      className = styles.tokenNumber;
    } else if (keywords.has(token)) {
      className = styles.tokenKeyword;
    } else if (/^[A-Z][A-Z0-9_]*$/.test(token)) {
      className = styles.tokenConstant;
    }

    tokens.push(
      className ? (
        <span className={className} key={`${index}-${token}`}>
          {token}
        </span>
      ) : (
        token
      ),
    );
    lastIndex = index + token.length;
  }

  if (lastIndex < line.length) {
    tokens.push(line.slice(lastIndex));
  }

  return tokens;
}

export default function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <figure className={styles.codeFigure}>
      <figcaption className={styles.codeToolbar}>
        <span className={styles.codeLanguage}>{language}</span>
        <button
          className={styles.copyButton}
          type="button"
          onClick={copyCode}
          aria-label={copyState === "copied" ? "Código copiado" : "Copiar código"}
        >
          {copyState === "copied" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
          <span aria-live="polite">
            {copyState === "copied" ? "Copiado" : copyState === "error" ? "No se pudo copiar" : "Copiar"}
          </span>
        </button>
      </figcaption>
      <pre className={styles.codeContent}>
        <code>
          {code.split("\n").map((line, index) => (
            <span className={styles.codeLine} key={`${index}-${line}`}>
              <span className={styles.lineNumber} aria-hidden="true">
                {index + 1}
              </span>
              <span>{highlightLine(line)}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}