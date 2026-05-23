export function formatNoteDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
