import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../app/api/auth/register/route";
import { parseColombianResidencyDeclaration } from "../app/lib/registration-country";

test("accepts only an explicit Colombian residence declaration", () => {
  assert.equal(parseColombianResidencyDeclaration("CO", true), "CO");
  assert.equal(parseColombianResidencyDeclaration(" co ", true), "CO");
  assert.equal(parseColombianResidencyDeclaration("US", true), null);
  assert.equal(parseColombianResidencyDeclaration(undefined, true), null);
  assert.equal(parseColombianResidencyDeclaration("CO", false), null);
  assert.equal(parseColombianResidencyDeclaration("CO", undefined), null);
});

for (const rol of ["promotor", "negocio"]) {
  test(`API rejects a foreign or incomplete country declaration for ${rol}`, async () => {
    const payload = {
      rol,
      countryCode: "US",
      residencyConfirmed: true,
    };

    const response = await POST(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: "Debes confirmar que resides en Colombia para registrarte",
    });
  });

  test(`API accepts the Colombian declaration for ${rol} and continues validation`, async () => {
    const payload = {
      rol,
      countryCode: "CO",
      residencyConfirmed: true,
      nombres: "Prueba",
      apellidos: "Prueba",
      nombreEmpresa: "Prueba",
      nit: "900123456",
      correo: "prueba@example.test",
      telefono: "3001234567",
      contrasena: "corta",
      departmentCode: "05",
      municipalityCode: "05001",
      locality: "Vereda El Retiro",
    };

    const response = await POST(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: "La contraseña debe tener al menos 8 caracteres",
    });
  });
}

test("API rejects missing and manipulated country fields before persistence", async () => {
  const requests = [
    { countryCode: undefined, residencyConfirmed: true },
    { countryCode: "CO", residencyConfirmed: false },
    { countryCode: "CO " + "US", residencyConfirmed: true },
    {
      countryCode: "CO",
      residencyConfirmed: true,
      municipalityCode: "99999",
      departmentCode: "05",
    },
    {
      countryCode: "CO",
      residencyConfirmed: true,
      municipalityCode: "05001",
      departmentCode: "11",
    },
    {
      countryCode: "CO",
      residencyConfirmed: true,
      municipalityCode: "05001",
      departmentCode: "05",
      locality: { name: "Bogotá" },
    },
  ];

  for (const declaration of requests) {
    const response = await POST(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: "promotor", ...declaration }),
      }),
    );

    assert.equal(response.status, 400);
  }
});
