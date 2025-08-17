export function formatDate(dateString?: string) {
  if (!dateString) return null;
  try {
    const [Y, M, D] = dateString.split("-").map((n) => parseInt(n, 10));
    const date = new Date(Y, (M ?? 1) - 1, D ?? 1);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
