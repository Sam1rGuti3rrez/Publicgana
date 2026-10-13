import assert from "node:assert/strict";
import { test } from "node:test";
import { Prisma } from "../app/generated/prisma/client";
import { POST } from "../app/api/leads/route";
import {
  handleLeadPost,
  type LeadRepository,
} from "../app/lib/lead-registration";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const duplicateEmailMessage =
  "Este correo electrónico ya está registrado. Usa otro correo.";

const validPayload = {
  nombre: "Persona de prueba",
  correo: "persona@example.test",
  tipoUsuario: "usuario",
  countryCode: "CO",
  residencyConfirmed: true,
  departmentCode: "05",
  municipalityCode: "05001",
  locality: undefined,
};

function createRepository(
  overrides: {
    findUnique?: LeadRepository["leads"]["findUnique"];
    create?: LeadRepository["leads"]["create"];
  } = {},
) {
  const calls = { findUnique: 0, create: 0 };
  const repository: LeadRepository = {
    leads: {
      findUnique: async (...args) => {
        calls.findUnique += 1;
        return overrides.findUnique
          ? overrides.findUnique(...args)
          : null;
      },
      create: async (...args) => {
        calls.create += 1;
        if (overrides.create) {
          return overrides.create(...args);
        }
        return {
          ...args[0].data,
          tipo_usuario: args[0].data.tipo_usuario,
        };
      },
    },
  };

  return { repository, calls };
}

function requestWith(payload: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function post(
  request: Request,
  repository: LeadRepository,
) {
  return handleLeadPost(
    request,
    corsHeaders,
    duplicateEmailMessage,
    () => repository,
  );
}

test("creates a lead with a confirmed Colombian residence declaration", async () => {
  let savedData: unknown;
  const { repository, calls } = createRepository({
    create: async ({ data }) => {
      savedData = data;
      return {
        id: data.id,
        nombre: data.nombre,
        correo: data.correo,
        ciudad: data.ciudad,
        tipo_usuario: data.tipo_usuario,
      };
    },
  });

  const response = await post(requestWith(validPayload), repository);
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.equal(result.correo, validPayload.correo);
  assert.equal(
    (savedData as { countryCode: string }).countryCode,
    "CO",
  );
  assert.equal(
    (savedData as { municipalityCode: string }).municipalityCode,
    "05001",
  );
  assert.equal((savedData as { ciudad: string }).ciudad, "MEDELLÍN");
  assert.deepEqual(calls, { findUnique: 1, create: 1 });
});

test("accepts Bogotá D. C. with its official district code and department", async () => {
  const { repository, calls } = createRepository();
  const response = await post(
    requestWith({
      ...validPayload,
      departmentCode: "11",
      municipalityCode: "11001",
    }),
    repository,
  );

  assert.equal(response.status, 201);
  assert.deepEqual(calls, { findUnique: 1, create: 1 });
});

test("accepts Buenos Aires, Cauca using its official municipality code", async () => {
  let savedName = "";
  const { repository } = createRepository({
    create: async ({ data }) => {
      savedName = data.ciudad;
      return {
        id: data.id,
        nombre: data.nombre,
        correo: data.correo,
        ciudad: data.ciudad,
        tipo_usuario: data.tipo_usuario,
      };
    },
  });
  const response = await post(
    requestWith({
      ...validPayload,
      correo: "buenosaires@example.test",
      departmentCode: "19",
      municipalityCode: "19110",
      ciudad: "Buenos Aires",
    }),
    repository,
  );

  assert.equal(response.status, 201);
  assert.equal(savedName, "BUENOS AIRES");
});

test("accepts municipality name variations without changing the official location code", async () => {
  const { repository } = createRepository();
  const response = await post(
    requestWith({
      ...validPayload,
      ciudad: "medellin",
    }),
    repository,
  );

  assert.equal(response.status, 201);
});

test("accepts and persists an optional locality without using it as the municipality", async () => {
  let savedLocality: string | null | undefined;
  const { repository } = createRepository({
    create: async ({ data }) => {
      savedLocality = data.locality;
      return {
        id: data.id,
        nombre: data.nombre,
        correo: data.correo,
        ciudad: data.ciudad,
        tipo_usuario: data.tipo_usuario,
      };
    },
  });
  const response = await post(
    requestWith({ ...validPayload, locality: "  Vereda El Retiro  " }),
    repository,
  );

  assert.equal(response.status, 201);
  assert.equal(savedLocality, "Vereda El Retiro");
});

test("accepts an empty optional locality and stores it as null", async () => {
  let savedLocality: string | null | undefined;
  const { repository } = createRepository({
    create: async ({ data }) => {
      savedLocality = data.locality;
      return {
        id: data.id,
        nombre: data.nombre,
        correo: data.correo,
        ciudad: data.ciudad,
        tipo_usuario: data.tipo_usuario,
      };
    },
  });
  const response = await post(
    requestWith({ ...validPayload, locality: "   " }),
    repository,
  );

  assert.equal(response.status, 201);
  assert.equal(savedLocality, null);
});

for (const [name, declaration] of [
  ["Honduras", { countryCode: "HN", residencyConfirmed: true }],
  ["no residence", { countryCode: undefined, residencyConfirmed: true }],
  ["unconfirmed residence", { countryCode: "CO", residencyConfirmed: false }],
  [
    "a locality name without a valid municipality",
    { municipalityCode: undefined, departmentCode: undefined, locality: "Bogotá" },
  ],
  [
    "a Colombian-looking locality with a foreign country",
    { countryCode: "HN", locality: "Bogotá" },
  ],
  ["invalid municipality code", { municipalityCode: "99999" }],
  ["missing department", { departmentCode: undefined }],
  ["mismatched department", { departmentCode: "11" }],
  [
    "Buenos Aires, Argentina while claiming Colombia",
    {
      departmentCode: undefined,
      municipalityCode: undefined,
      ciudad: "Buenos Aires, Argentina",
    },
  ],
  [
    "Buenos Aires, Argentina with a Colombian municipality code",
    {
      departmentCode: "19",
      municipalityCode: "19110",
      ciudad: "Buenos Aires, Argentina",
    },
  ],
  ["a foreign city paired with a valid Colombian code", { ciudad: "Córdoba, Argentina" }],
  ["a non-text locality", { locality: { name: "Bogotá" } }],
  ["an oversized locality", { locality: "x".repeat(151) }],
] as const) {
  test(`rejects a lead with ${name} before querying or inserting`, async () => {
    const { repository, calls } = createRepository();
    const response = await post(
      requestWith({ ...validPayload, ...declaration }),
      repository,
    );

    assert.equal(response.status, 400);
    assert.match(
      (await response.json()).message,
      /Colombia|municipio colombiano|localidad/,
    );
    assert.deepEqual(calls, { findUnique: 0, create: 0 });
  });
}

test("rejects malformed JSON without querying or inserting", async () => {
  const { repository, calls } = createRepository();
  const response = await post(
    new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"countryCode":',
    }),
    repository,
  );

  assert.equal(response.status, 400);
  assert.deepEqual(calls, { findUnique: 0, create: 0 });
});

test("rejects an existing lead email without creating a duplicate", async () => {
  const { repository, calls } = createRepository({
    findUnique: async () => ({ id: "existing-lead" }),
  });

  const response = await post(requestWith(validPayload), repository);

  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, duplicateEmailMessage);
  assert.deepEqual(calls, { findUnique: 1, create: 0 });
});

test("maps a database unique constraint race to HTTP 409", async () => {
  const uniqueError = new Prisma.PrismaClientKnownRequestError(
    "Unique constraint failed",
    {
      code: "P2002",
      clientVersion: "7.10.0",
      meta: { target: ["correo"] },
    },
  );
  const { repository } = createRepository({
    create: async () => {
      throw uniqueError;
    },
  });

  const response = await post(requestWith(validPayload), repository);

  assert.equal(response.status, 409);
  assert.equal((await response.json()).message, duplicateEmailMessage);
});

test("returns a generic server error when the database fails", async (context) => {
  context.mock.method(console, "error", () => {});
  const { repository, calls } = createRepository({
    findUnique: async () => {
      throw new Error("private database detail");
    },
  });

  const response = await post(requestWith(validPayload), repository);

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    message: "Error interno del servidor",
  });
  assert.deepEqual(calls, { findUnique: 1, create: 0 });
});

test("an HTTP request with a Honduran code cannot bypass server validation", async () => {
  const response = await POST(
    new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPayload,
        countryCode: "HN",
      }),
    }),
  );

  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /resides actualmente en Colombia/);
});

test("an HTTP request cannot pair a valid municipality with a different department", async () => {
  const response = await POST(
    requestWith({
      ...validPayload,
      departmentCode: "11",
    }),
  );

  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /departamento y un municipio/);
});
