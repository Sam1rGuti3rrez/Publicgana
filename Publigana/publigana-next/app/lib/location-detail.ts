export const LOCATION_DETAIL_MAX_LENGTH = 150;

export type OptionalLocationDetail =
  | { valid: true; value: string | null }
  | { valid: false };

export function parseOptionalLocationDetail(
  value: unknown,
): OptionalLocationDetail {
  if (value === undefined || value === null) {
    return { valid: true, value: null };
  }

  if (typeof value !== "string") {
    return { valid: false };
  }

  const trimmed = value.trim();

  if (
    trimmed.length > LOCATION_DETAIL_MAX_LENGTH ||
    /[\u0000-\u001f\u007f]/.test(trimmed)
  ) {
    return { valid: false };
  }

  return { valid: true, value: trimmed || null };
}
