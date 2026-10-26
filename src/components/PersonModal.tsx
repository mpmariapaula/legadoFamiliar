import type { Person, Relationship, Photo, Memory, FamilyEvent } from "@/src/types";
import { formatDate, formatYear, lifespan } from "@/src/utils/date";

export function PersonModal({
  person, people, relationships, photos, memories, events, onClose, onNavigate
}: {
  person: Person; people: Person[]; relationships: Relationship[];
  photos: Photo[]; memories: Memory[]; events: FamilyEvent[];
  onClose: () => void; onNavigate: (id: number) => void;
}) {
  const related = relationships
    .filter(r => r.personId === person.id)
    .map(r => ({ ...r, relatedPerson: people.find(p => p.id === r.relatedPersonId) }))
    .filter(r => r.relatedPerson);

  const personPhotos = photos.filter(ph => ph.personIds.includes(person.id));
  const personMemories = memories.filter(m => m.personIds.includes(person.id));
  const personEvents = events.filter(e => e.personIds.includes(person.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto"
      style={{ background: "rgba(74,44,32,0.6)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card-frame w-full max-w-3xl mb-8 overflow-hidden page-enter">
        {/* Header */}
        <div className="relative h-64 bg-beige">
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt={person.fullName}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">👤</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 via-brown-dark/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brown-dark/50 text-cream flex items-center justify-center hover:bg-brown-dark transition-colors text-xl font-bold"
          >
            ×
          </button>
          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-caramel text-xs font-sans uppercase tracking-widest mb-1">
              {person.generation}ª Geração
            </p>
            <h2 className="font-serif text-3xl text-cream">{person.fullName}</h2>
            {person.nickname && (
              <p className="text-cream/70 italic font-sans text-sm">"{person.nickname}"</p>
            )}
            <p className="text-cream/80 font-sans text-sm mt-1">{lifespan(person)}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Vitals */}
          <div className="grid grid-cols-2 gap-4 text-sm font-sans">
            {person.birthDate && (
              <div>
                <span className="text-caramel text-xs uppercase tracking-wide font-bold">Nascimento</span>
                <p className="text-brown-dark">{formatDate(person.birthDate)}</p>
                {person.birthPlace && <p className="text-brown-mid text-xs">{person.birthPlace}</p>}
              </div>
            )}
            {person.deathDate && (
              <div>
                <span className="text-caramel text-xs uppercase tracking-wide font-bold">Falecimento</span>
                <p className="text-brown-dark">{formatDate(person.deathDate)}</p>
                {person.deathPlace && <p className="text-brown-mid text-xs">{person.deathPlace}</p>}
              </div>
            )}
            {person.profession && (
              <div>
                <span className="text-caramel text-xs uppercase tracking-wide font-bold">Profissão</span>
                <p className="text-brown-dark">{person.profession}</p>
              </div>
            )}
            {person.residence && (
              <div>
                <span className="text-caramel text-xs uppercase tracking-wide font-bold">Residência</span>
                <p className="text-brown-dark">{person.residence}</p>
              </div>
            )}
          </div>

          {/* Biography */}
          {person.biography && (
            <div>
              <div className="ornament mb-3">
                <span className="font-serif text-sm text-caramel italic">Sobre {person.name}</span>
              </div>
              <p className="text-brown-mid font-sans leading-relaxed text-sm whitespace-pre-line">
                {person.biography}
              </p>
            </div>
          )}

          {/* Family */}
          {related.length > 0 && (
            <div>
              <div className="ornament mb-3">
                <span className="font-serif text-sm text-caramel italic">Família</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {related.map(r => (
                  <button
                    key={r.id}
                    onClick={() => r.relatedPerson && onNavigate(r.relatedPerson.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-parchment border border-beige rounded hover:border-caramel transition-colors"
                  >
                    {r.relatedPerson?.photoUrl && (
                      <img src={r.relatedPerson.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover object-top" />
                    )}
                    <span className="text-xs font-sans text-brown-dark">{r.relatedPerson?.name}</span>
                    <span className="text-xs text-caramel italic">({r.type})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          {personPhotos.length > 0 && (
            <div>
              <div className="ornament mb-3">
                <span className="font-serif text-sm text-caramel italic">Fotografias</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {personPhotos.map(ph => (
                  <div key={ph.id} className="photo-frame aspect-square overflow-hidden rounded-sm">
                    <img src={ph.photoUrl} alt={ph.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memories */}
          {personMemories.length > 0 && (
            <div>
              <div className="ornament mb-3">
                <span className="font-serif text-sm text-caramel italic">Memórias</span>
              </div>
              <div className="space-y-2">
                {personMemories.map(m => (
                  <div key={m.id} className="book-page rounded-sm">
                    <h4 className="font-serif text-brown-dark text-sm font-semibold relative z-10">{m.title}</h4>
                    {m.date && <p className="text-xs text-caramel font-sans relative z-10">{m.date}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {personEvents.length > 0 && (
            <div>
              <div className="ornament mb-3">
                <span className="font-serif text-sm text-caramel italic">Acontecimentos</span>
              </div>
              <div className="space-y-1">
                {personEvents.map(e => (
                  <div key={e.id} className="flex gap-3 text-sm font-sans py-1">
                    <span className="text-caramel font-bold shrink-0">{formatYear(e.eventDate)}</span>
                    <span className="text-brown-dark">{e.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
