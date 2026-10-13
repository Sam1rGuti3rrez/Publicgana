import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const endpoint =
  "https://www.datos.gov.co/resource/gdxc-w37w.json" +
  "?$select=cod_mpio,nom_mpio,cod_dpto,dpto" +
  "&$where=tipo_municipio%3D%27Municipio%27" +
  "&$order=cod_mpio&$limit=2000";
const outputPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../data/divipola-municipalities.json",
);

const response = await fetch(endpoint, {
  headers: { Accept: "application/json" },
});

if (!response.ok) {
  throw new Error(`DIVIPOLA source returned HTTP ${response.status}`);
}

const sourceRows = await response.json();

if (!Array.isArray(sourceRows) || sourceRows.length === 0) {
  throw new Error("DIVIPOLA source returned no municipality records");
}

const countResponse = await fetch(
  "https://www.datos.gov.co/resource/gdxc-w37w.json" +
    "?$select=count(*)&$where=tipo_municipio%3D%27Municipio%27",
  { headers: { Accept: "application/json" } },
);

if (!countResponse.ok) {
  throw new Error(`DIVIPOLA count request returned HTTP ${countResponse.status}`);
}

const countRows = await countResponse.json();
const expectedCount = Number(countRows?.[0]?.count);

if (!Number.isInteger(expectedCount) || expectedCount !== sourceRows.length) {
  throw new Error(
    `DIVIPOLA source returned ${sourceRows.length} records; expected ${expectedCount}`,
  );
}

const records = sourceRows.map((row) => {
  if (
    typeof row.cod_mpio !== "string" ||
    !/^\d{5}$/.test(row.cod_mpio) ||
    typeof row.nom_mpio !== "string" ||
    !row.nom_mpio.trim() ||
    typeof row.cod_dpto !== "string" ||
    !/^\d{2}$/.test(row.cod_dpto) ||
    typeof row.dpto !== "string" ||
    !row.dpto.trim()
  ) {
    throw new Error("DIVIPOLA source contains an invalid municipality record");
  }

  return {
    code: row.cod_mpio,
    name: row.nom_mpio.trim(),
    departmentCode: row.cod_dpto,
    department: row.dpto.trim(),
  };
});

const codes = new Set(records.map(({ code }) => code));

if (codes.size !== records.length) {
  throw new Error("DIVIPOLA source contains duplicate municipality codes");
}

records.sort((a, b) => a.code.localeCompare(b.code));
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
console.info(`Updated DIVIPOLA catalog with ${records.length} municipalities.`);
