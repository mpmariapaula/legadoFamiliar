
import { createClient } from "@supabase/supabase-js";
import type { Person } from "@/src/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function buscarPessoas(): Promise<Person[]> {
  const { data, error } = await supabase
    .from("pessoas")
    .select("*")
    .order("id_legado", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar pessoas: ${error.message}`);
  }

  return (data ?? [])
    .filter((pessoa) => pessoa.id_legado !== null)
    .map((pessoa) => ({
      id: pessoa.id_legado,
      name: pessoa.nome,
      fullName: pessoa.nome_completo ?? pessoa.nome,
      nickname: pessoa.apelido ?? undefined,
      birthDate: pessoa.data_nascimento ?? undefined,
      birthPlace: pessoa.local_nascimento ?? undefined,
      deathDate: pessoa.data_falecimento ?? undefined,
      deathPlace: pessoa.local_falecimento ?? undefined,
      biography: pessoa.biografia ?? undefined,
      profession: pessoa.profissao ?? undefined,
      residence: pessoa.residencia ?? undefined,
      generation: pessoa.geracao ?? 1,
      isAlive: pessoa.pessoa_viva,
      photoUrl: pessoa.foto_url ?? undefined,
      notes: pessoa.observacoes ?? undefined,
    }));
}

export async function salvarPessoa(
  pessoa: Omit<Person, "id">,
  id?: number
): Promise<Person> {
  const registro = {
    nome: pessoa.name,
    nome_completo: pessoa.fullName || pessoa.name,
    apelido: pessoa.nickname || null,
    data_nascimento: pessoa.birthDate || null,
    local_nascimento: pessoa.birthPlace || null,
    data_falecimento: pessoa.deathDate || null,
    local_falecimento: pessoa.deathPlace || null,
    biografia: pessoa.biography || null,
    profissao: pessoa.profession || null,
    residencia: pessoa.residence || null,
    geracao: pessoa.generation,
    pessoa_viva: pessoa.isAlive,
    foto_url: pessoa.photoUrl || null,
    observacoes: pessoa.notes || null,
  };

  const consulta = supabase.from("pessoas");

  const resultado = id === undefined
    ? await consulta.insert({
        ...registro,
        id_legado: Math.max(0, ...[]) + 1,
      }).select("*").single()
    : await consulta.update(registro)
        .eq("id_legado", id)
        .select("*")
        .single();

  if (resultado.error) {
    throw new Error(`Erro ao salvar pessoa: ${resultado.error.message}`);
  }

  const p = resultado.data;

  return {
    id: p.id_legado,
    name: p.nome,
    fullName: p.nome_completo ?? p.nome,
    nickname: p.apelido ?? undefined,
    birthDate: p.data_nascimento ?? undefined,
    birthPlace: p.local_nascimento ?? undefined,
    deathDate: p.data_falecimento ?? undefined,
    deathPlace: p.local_falecimento ?? undefined,
    biography: p.biografia ?? undefined,
    profession: p.profissao ?? undefined,
    residence: p.residencia ?? undefined,
    generation: p.geracao ?? 1,
    isAlive: p.pessoa_viva,
    photoUrl: p.foto_url ?? undefined,
    notes: p.observacoes ?? undefined,
  };
}
