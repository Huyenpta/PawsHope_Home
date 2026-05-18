/** Hiển thị ô bảng admin từ giá trị API (snake_case JDBC map). */
export function formatCell(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
