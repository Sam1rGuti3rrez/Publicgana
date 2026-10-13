export type RegistrationLocationFields = {
  departmentCode: string;
  municipalityCode: string;
  locality: string;
};

export function changeRegistrationDepartment<T extends RegistrationLocationFields>(
  formData: T,
  departmentCode: string,
): T {
  return {
    ...formData,
    departmentCode,
    municipalityCode: "",
    locality: "",
  };
}
