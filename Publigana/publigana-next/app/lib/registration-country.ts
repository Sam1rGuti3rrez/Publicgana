export function parseColombianResidencyDeclaration(
  countryCode: unknown,
  residencyConfirmed: unknown,
): "CO" | null {
  if (
    typeof countryCode !== "string" ||
    countryCode.trim().toUpperCase() !== "CO" ||
    residencyConfirmed !== true
  ) {
    return null;
  }

  return "CO";
}
