import type { Person, FamilyEvent } from "@/src/types";
import { formatDate, formatYear } from "@/src/utils/date";

export function AcontecimentosPage({ events, people }: { events: FamilyEvent[]; people: Person[] }) {
  const sorted = [...events].sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-12">
      <div className="ornament mb-10">
        <h1 className="font-serif text-4xl text-brown-dark px-4">Nossa História</h1>
      </div>
      <p className="text-center font-serif text-brown-mid italic text-lg mb-14">
        Uma linha do tempo de acontecimentos marcantes
      </p>

      <div className="relative">
        <div className="absolute left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-caramel to-transparent" />

        <div className="space-y-8">
          {sorted.map((e, i) => (
            <div key={e.id} className="relative flex gap-6 items-start page-enter" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Year */}
              <div className="w-14 shrink-0 text-right">
                <span className="font-serif text-caramel text-lg">{formatYear(e.eventDate)}</span>
              </div>

              {/* Dot */}
              <div className="relative flex items-start justify-center w-4 shrink-0 mt-1.5">
                <div className="timeline-dot" />
              </div>

              {/* Content */}
              <div className="flex-1 card-frame p-4 mb-2">
                <h3 className="font-serif text-brown-dark text-lg">{e.title}</h3>
                {e.description && (
                  <p className="text-brown-mid font-sans text-sm mt-1 leading-relaxed">{e.description}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-2 text-xs font-sans text-caramel">
                  {e.location && <span>📍 {e.location}</span>}
                  {e.personIds.length > 0 && (
                    <span>
                      {e.personIds.map(id => people.find(p => p.id === id)?.name).filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
