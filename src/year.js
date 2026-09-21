export function initYear(doc = document, now = new Date()) {
  const year = doc.getElementById('year');
  if (!year) return null;

  year.textContent = String(now.getFullYear());

  return year.textContent;
}
