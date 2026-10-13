import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "../app/api/municipios/route";
import {
  getColombianMunicipality,
  getColombianMunicipalities,
} from "../app/lib/colombian-municipalities";

test("the DIVIPOLA selector serves a complete, unique municipality catalogue", async () => {
  const response = await GET();
  const catalog = await response.json();
  const municipalities = catalog.municipalities;
  const codes = municipalities.map(
    (municipality: { code: string }) => municipality.code,
  );

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(catalog.departments));
  assert.ok(Array.isArray(catalog.municipalities));
  assert.equal(catalog.departments.length, 33);
  assert.equal(municipalities.length, 1103);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.ok(
    catalog.departments.every(
      (department: { code?: unknown; name?: unknown }) =>
        typeof department.code === "string" &&
        typeof department.name === "string",
    ),
  );
  assert.ok(
    municipalities.every(
      (municipality: {
        code?: unknown;
        name?: unknown;
        departmentCode?: unknown;
        department?: unknown;
      }) =>
        typeof municipality.code === "string" &&
        typeof municipality.name === "string" &&
        typeof municipality.departmentCode === "string" &&
        typeof municipality.department === "string",
    ),
  );
  assert.equal(new Set(codes).size, municipalities.length);
  assert.deepEqual(getColombianMunicipality("05001", "05"), {
    code: "05001",
    name: "MEDELLÍN",
    departmentCode: "05",
    department: "ANTIOQUIA",
  });
  assert.deepEqual(getColombianMunicipality("11001", "11"), {
    code: "11001",
    name: "BOGOTÁ, D.C.",
    departmentCode: "11",
    department: "BOGOTÁ, D.C.",
  });
  assert.deepEqual(getColombianMunicipality("19110", "19"), {
    code: "19110",
    name: "BUENOS AIRES",
    departmentCode: "19",
    department: "CAUCA",
  });
  assert.equal(getColombianMunicipality("99999", "99"), null);
  assert.equal(getColombianMunicipality("0500", "05"), null);
  assert.equal(getColombianMunicipality("05001", "11"), null);
  assert.equal(getColombianMunicipality("05001", undefined), null);
  assert.equal(getColombianMunicipalities().length, municipalities.length);
});
