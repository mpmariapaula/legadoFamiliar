import { useState } from "react";
import type { Person, Memory } from "@/src/types";
import { formatDate, formatYear } from "@/src/utils/date";

export function MemoriasPage({ memories, people }: { memories: Memory[]; people: Person[] }) {
  const [selected, setSelected] = useState<Memory | null>(null);

  return (
    <div className="page-enter max-w-7xl mx-auto px-6 py-12">
      <div className="ornament mb-10">
        <h1 className="font-serif text-4xl text-brown-dark px-4">Memórias da Família</h1>
      </div>
      <p className="text-center font-serif text-brown-mid italic text-lg mb-12">
        "As histórias que nos contaram e as que vivemos juntos"
      </p>

      {selected ? (
        <div className="page-enter max-w-2xl mx-auto">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-caramel font-sans text-sm mb-8 hover:text-terracotta transition-colors"
          >
            ← Voltar às memórias
          </button>
          <div className="book-page rounded-sm">
            <div className="relative z-10">
              <p className="text-caramel font-sans text-xs uppercase tracking-widest mb-2">{selected.date}</p>
              <h2 className="font-serif text-3xl text-brown-dark mb-2">{selected.title}</h2>
              {selected.location && (
                <p className="text-brown-mid font-sans text-sm italic mb-6">{selected.location}</p>
              )}
              <div className="ornament mb-6"><span /></div>
              <p className="font-sans text-brown-dark leading-[1.9] text-base whitespace-pre-line">{selected.content}</p>
              <div className="ornament mt-8 mb-4"><span /></div>
              {selected.author && (
                <p className="text-right text-caramel italic font-serif text-sm">— {selected.author}</p>
              )}
              {selected.personIds.length > 0 && (
                <div className="mt-4 pt-4 border-t border-beige">
                  <p className="text-xs text-brown-mid font-sans">
                    Pessoas: {selected.personIds.map(id => people.find(p => p.id === id)?.name).filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map(m => (
            <button
              key={m.id}
              className="book-page rounded-sm text-left hover:shadow-lg transition-shadow group"
              onClick={() => setSelected(m)}
            >
              <div className="relative z-10">
                <p className="text-caramel font-sans text-xs uppercase tracking-widest mb-2">{m.date}</p>
                <h3 className="font-serif text-xl text-brown-dark mb-3 group-hover:text-terracotta transition-colors">
                  {m.title}
                </h3>
                <p className="text-brown-mid text-sm font-sans leading-relaxed line-clamp-4">
                  {m.content.split("\n")[0]}
                </p>
                {m.author && (
                  <p className="text-xs text-caramel italic font-sans mt-4">— {m.author}</p>
                )}
                <p className="text-xs text-terracotta font-sans mt-3 uppercase tracking-wide group-hover:underline">
                  Ler história completa →
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
