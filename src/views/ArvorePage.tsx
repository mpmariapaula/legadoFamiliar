import type { Person, Relationship } from "@/src/types";
import { formatDate, formatYear, lifespan } from "@/src/utils/date";

export function ArvorePage({ people, relationships, onOpenPerson }: {
  people: Person[]; relationships: Relationship[]; onOpenPerson: (p: Person) => void;
}) {
  const generations = [...new Set(people.map(p => p.generation))].sort();

  function getChildren(parentId: number): Person[] {
    return relationships
      .filter(r => r.personId === parentId && (r.type === "filho" || r.type === "filha"))
      .map(r => people.find(p => p.id === r.relatedPersonId))
      .filter(Boolean) as Person[];
  }

  function getSpouse(personId: number): Person | undefined {
    const rel = relationships.find(r => r.personId === personId && (r.type === "esposo" || r.type === "esposa"));
    return rel ? people.find(p => p.id === rel.relatedPersonId) : undefined;
  }

  return (
    <div className="page-enter max-w-7xl mx-auto px-6 py-12">
      <div className="ornament mb-8">
        <h1 className="font-serif text-4xl text-brown-dark px-4">Árvore Familiar</h1>
      </div>
      <p className="text-center text-brown-mid font-sans text-sm mb-12">
        Clique em um familiar para ver seu perfil completo
      </p>

      <div className="overflow-x-auto pb-8">
        {generations.map((gen, gi) => {
          const genPeople = people.filter(p => p.generation === gen);
          const processedIds = new Set<number>();
          const couples: Array<{ main: Person; spouse?: Person }> = [];

          genPeople.forEach(p => {
            if (processedIds.has(p.id)) return;
            processedIds.add(p.id);
            const spouse = getSpouse(p.id);
            if (spouse && !processedIds.has(spouse.id)) {
              processedIds.add(spouse.id);
              couples.push({ main: p, spouse });
            } else {
              couples.push({ main: p });
            }
          });

          return (
            <div key={gen} className="mb-12">
              <div className="text-center mb-6">
                <span className="inline-block bg-caramel text-cream font-sans text-xs uppercase tracking-widest px-4 py-1 rounded-full">
                  {gen}ª Geração
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {couples.map(({ main, spouse }, ci) => {
                  const children = getChildren(main.id);
                  return (
                    <div key={ci} className="flex flex-col items-center">
                      {/* Couple */}
                      <div className="flex items-center gap-2">
                        <TreeNode person={main} onClick={() => onOpenPerson(main)} />
                        {spouse && (
                          <>
                            <span className="text-caramel text-lg">♥</span>
                            <TreeNode person={spouse} onClick={() => onOpenPerson(spouse)} />
                          </>
                        )}
                      </div>
                      {/* Children connector */}
                      {children.length > 0 && gi < generations.length - 1 && (
                        <div className="flex flex-col items-center mt-2">
                          <div className="w-px h-6 bg-caramel/50" />
                          <div className="text-caramel/30 text-xs">▼</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center gap-8 text-xs font-sans text-brown-mid">
        <span className="flex items-center gap-1"><span className="text-caramel">♥</span> Cônjuges</span>
        <span className="flex items-center gap-1"><span className="badge-alive text-white rounded px-1">Vivo(a)</span></span>
        <span className="flex items-center gap-1"><span className="badge-deceased text-white rounded px-1">In memoriam</span></span>
      </div>
    </div>
  );
}

function TreeNode({ person, onClick }: { person: Person; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card-frame p-3 w-32 flex flex-col items-center gap-1.5 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-beige bg-beige">
        {person.photoUrl ? (
          <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">👤</div>
        )}
      </div>
      <span className="font-serif text-xs text-brown-dark text-center leading-tight">{person.name}</span>
      <span className="text-[10px] text-caramel font-sans">{lifespan(person)}</span>
      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${person.isAlive ? "badge-alive" : "badge-deceased"}`}>
        {person.isAlive ? "Vivo" : "In mem."}
      </span>
    </button>
  );
}
