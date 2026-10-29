
export const tabelaLegado = {
  pessoas: "pessoas",
  relacionamentos: "parentescos",
  fotografias: "fotografias",
  memorias: "memorias",
  acontecimentos: "acontecimentos",
} as const;

export function dataValida(data?: string): string | null {
  if (!data) return null;

  const resultado = new Date(data);
  if (Number.isNaN(resultado.getTime())) return null;

  return data;
}
