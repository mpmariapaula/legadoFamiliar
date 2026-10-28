import { useMemo } from "react";
import type { Person, Photo, Memory, FamilyEvent, Page } from "@/src/types";
import { PersonCard } from "@/src/components/PersonCard";
import { formatDate, formatYear, lifespan } from "@/src/utils/date";
import Image from "next/image";

export function HomePage({
  people, photos, memories, events, onNavigate, onOpenPerson
}: {
  people: Person[]; photos: Photo[]; memories: Memory[]; events: FamilyEvent[];
  onNavigate: (p: Page) => void; onOpenPerson: (p: Person) => void;
}) {
  const generations = useMemo(() => [...new Set(people.map(p => p.generation))].length, [people]);
  const recent = people.slice(-3);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4A2C20 0%, #795548 50%, #A67C52 100%)" }}
      >
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1' fill='%23F8F1E7' fill-opacity='0.4'/%3E%3C/svg%3E\")"
          }}
        />
        {/* Photo collage bg */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/image.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-brown-dark/40" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-caramel font-sans text-sm uppercase tracking-[0.3em] mb-4">
            ✦ Uma história para sempre ✦
          </p>
          <h1 className="font-serif text-6xl md:text-8xl text-cream mb-4 leading-none">
            Família<br />
            <span className="italic text-beige"> Pereira Maia</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-cream/80 italic mb-10">
            "Uma história construída por muitas gerações."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("nossa-historia")}
              className="px-8 py-3 bg-terracotta text-cream font-sans font-bold text-sm uppercase tracking-widest hover:bg-caramel transition-colors rounded-sm"
            >
              Explorar nossa história
            </button>
            <button
              onClick={() => onNavigate("admin")}
              className="px-8 py-3 border border-cream/40 text-cream font-sans text-sm uppercase tracking-widest hover:bg-cream/10 transition-colors rounded-sm"
            >
              Adicionar familiar
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50">
          <span className="text-xs font-sans uppercase tracking-widest">Rolar</span>
          <div className="w-px h-8 bg-cream/30" />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-parchment border-y border-beige">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: generations, label: "Gerações" },
              { value: people.length, label: "Pessoas" },
              { value: photos.length, label: "Fotografias" },
              { value: memories.length, label: "Memórias" },
            ].map(s => (
              <div key={s.label}>
                <div className="font-serif text-5xl text-brown-dark">{s.value}</div>
                <div className="text-caramel font-sans text-xs uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent members */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="ornament mb-10">
          <h2 className="font-serif text-3xl text-brown-dark whitespace-nowrap px-4">Membros da Família</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {recent.map(p => (
            <PersonCard key={p.id} person={p} onClick={() => onOpenPerson(p)} />
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={() => onNavigate("pessoas")}
            className="px-6 py-2.5 border border-caramel text-caramel font-sans text-sm uppercase tracking-widest hover:bg-caramel hover:text-cream transition-colors rounded-sm"
          >
            Ver todos os familiares
          </button>
        </div>
      </div>

      {/* Recent memories teaser */}
      <div className="bg-parchment border-y border-beige py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="ornament mb-10">
            <h2 className="font-serif text-3xl text-brown-dark whitespace-nowrap px-4">Memórias da Família</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {memories.map(m => (
              <div key={m.id} className="book-page rounded-sm cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("memorias")}>
                <div className="relative z-10">
                  <h3 className="font-serif text-lg text-brown-dark mb-2">{m.title}</h3>
                  {m.date && <p className="text-caramel text-xs font-sans uppercase tracking-wide mb-3">{m.date}</p>}
                  <p className="text-brown-mid text-sm font-sans leading-relaxed line-clamp-3">
                    {m.content.split("\n")[0]}
                  </p>
                  {m.author && (
                    <p className="text-xs text-caramel italic font-sans mt-4">— {m.author}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline teaser */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="ornament mb-10">
          <h2 className="font-serif text-3xl text-brown-dark whitespace-nowrap px-4">Nossa História</h2>
        </div>
        <div className="relative pl-8 border-l-2 border-beige space-y-6">
          {events.slice(0, 5).map((e, i) => (
            <div key={e.id} className="relative">
              <div className="timeline-dot absolute -left-[calc(1rem+5px)] top-1" />
              <span className="font-serif text-caramel text-xl">{formatYear(e.eventDate)}</span>
              <h3 className="font-sans text-brown-dark font-bold text-sm mt-0.5">{e.title}</h3>
              {e.description && (
                <p className="text-brown-mid text-xs font-sans mt-1">{e.description}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 pl-8">
          <button
            onClick={() => onNavigate("nossa-historia")}
            className="px-6 py-2.5 border border-caramel text-caramel font-sans text-sm uppercase tracking-widest hover:bg-caramel hover:text-cream transition-colors rounded-sm"
          >
            Ver linha do tempo completa
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-brown-dark text-cream/60 text-center py-10 font-sans text-xs tracking-wide">
        <p className="font-serif text-cream/80 text-base mb-2 italic">
          "Aqui estão as pessoas que vieram antes de nós, as histórias que viveram e o legado que deixaram."
        </p>
        {/* <p className="mt-2">Legado da Família · {new Date().getFullYear()}</p> */}
        <p className="mt-2">Legado Pereira Maia </p>

      </footer>
    </div>
  );
}
