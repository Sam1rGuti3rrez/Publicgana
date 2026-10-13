import catalog from "@/data/divipola-municipalities.json";

export type ColombianMunicipality = {
  code: string;
  name: string;
  departmentCode: string;
  department: string;
};

export type ColombianDepartment = {
  code: string;
  name: string;
};

const municipalities = catalog as ColombianMunicipality[];
const municipalitiesByCode = new Map(
  municipalities.map((municipality) => [municipality.code, municipality]),
);
const departments = Array.from(
  new Map(
    municipalities.map((municipality) => [
      municipality.departmentCode,
      { code: municipality.departmentCode, name: municipality.department },
    ]),
  ).values(),
).sort((a, b) => a.name.localeCompare(b.name, "es"));

export function getColombianMunicipalities(): ColombianMunicipality[] {
  return municipalities;
}

export function getColombianDepartments(): ColombianDepartment[] {
  return departments;
}

export function getColombianMunicipality(
  code: unknown,
  departmentCode: unknown,
): ColombianMunicipality | null {
  if (
    typeof code !== "string" ||
    !/^\d{5}$/.test(code) ||
    typeof departmentCode !== "string" ||
    !/^\d{2}$/.test(departmentCode)
  ) {
    return null;
  }

  const municipality = municipalitiesByCode.get(code);

  if (
    !municipality ||
    departmentCode !== municipality.departmentCode
  ) {
    return null;
  }

  return municipality;
}

export function municipalityNameMatches(
  name: unknown,
  municipality: ColombianMunicipality,
): boolean {
  if (typeof name !== "string" || !name.trim()) {
    return false;
  }

  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  return normalize(name) === normalize(municipality.name);
}
