import type { Person } from "../types";

export function formatYear(dateStr?: string) {
  if (!dateStr) return "";
  return dateStr.slice(0, 4);
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!m) return y;
  const months = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
  return `${d ? d + " " : ""}${months[parseInt(m) - 1]} ${y}`;
}

export function lifespan(p: Person) {
  if (!p.birthDate && !p.deathDate) return "";
  if (p.birthDate && !p.deathDate) return formatYear(p.birthDate) + (p.isAlive ? "" : " – ?");
  return `${formatYear(p.birthDate)} – ${formatYear(p.deathDate)}`;
}
