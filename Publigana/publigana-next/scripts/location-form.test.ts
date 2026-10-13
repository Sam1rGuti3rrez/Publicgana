import assert from "node:assert/strict";
import { test } from "node:test";
import { changeRegistrationDepartment } from "../app/lib/location-form";

test("changing department clears the selected municipality and its locality", () => {
  const updated = changeRegistrationDepartment(
    {
      name: "Persona",
      departmentCode: "05",
      municipalityCode: "05001",
      locality: "Vereda El Retiro",
    },
    "11",
  );

  assert.deepEqual(updated, {
    name: "Persona",
    departmentCode: "11",
    municipalityCode: "",
    locality: "",
  });
});
