export function toTrimmedString(value) {
  return String(value || "").trim();
}

export function toNumberOrZero(value) {
  return Number(value || 0);
}
