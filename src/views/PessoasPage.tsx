"use client";


import type { Person } from "@/src/types";
import { PersonCard } from "@/src/components/PersonCard";
import { formatDate, formatYear, lifespan } from "@/src/utils/date";
import { useState } from "react";

export function PessoasPage({ people, onOpenPerson }: { people: Person[]; onOpenPerson: (p: Person) => void }) {
  const [query, setQuery] = useState("");
  const [filterGen, setFilterGen] = useState<number | null>(null);

  const generations = [...new Set(people.map(p => p.generation))].sort();

  const filtered = people.filter(p => {
    const q = query.toLowerCase();
    const matchQ = !q || p.fullName.toLowerCase().includes(q) ||
      (p.nickname || "").toLowerCase().includes(q) ||
      (p.profession || "").toLowerCase().includes(q) ||
      (p.residence || "").toLowerCase().includes(q);
    const matchG = filterGen === null || p.generation === filterGen;
    return matchQ && matchG;
  });

  return (
    <div className="page-enter max-w-7xl mx-auto px-6 py-12">
      <div className="ornament mb-8">
        <h1 className="font-serif text-4xl text-brown-dark px-4">Pessoas da Família</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Pesquisar por nome, profissão, cidade…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 border border-beige bg-parchment px-4 py-2.5 text-sm font-sans text-brown-dark placeholder:text-brown-mid/40 rounded-sm outline-none focus:border-caramel transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterGen(null)}
            className={`px-4 py-2 text-xs font-sans uppercase tracking-wide rounded-sm transition-colors ${filterGen === null ? "bg-brown-dark text-cream" : "border border-beige text-brown-mid hover:border-caramel"}`}
          >
            Todos
          </button>
          {generations.map(g => (
            <button
              key={g}
              onClick={() => setFilterGen(g)}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-wide rounded-sm transition-colors ${filterGen === g ? "bg-terracotta text-cream" : "border border-beige text-brown-mid hover:border-caramel"}`}
            >
              {g}ª Geração
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-brown-mid font-sans">
          <p className="font-serif text-2xl mb-2">Nenhum familiar encontrado</p>
          <p className="text-sm">Tente outros termos de pesquisa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <PersonCard key={p.id} person={p} onClick={() => onOpenPerson(p)} />
          ))}
        </div>
      )}
    </div>
  );
}
