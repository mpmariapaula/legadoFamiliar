import type { Person } from "@/src/types";
import { lifespan } from "@/src/utils/date";

export function PersonCard({ person, onClick }: { person: Person; onClick: () => void }) {
  return (
    <button
      className="person-card card-frame text-left w-full overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative h-48 bg-beige overflow-hidden">
        {person.photoUrl ? (
          <img
            src={person.photoUrl}
            alt={person.fullName}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">👤</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-sans font-bold tracking-wide ${person.isAlive ? "badge-alive" : "badge-deceased"}`}>
            {person.isAlive ? "Vivo(a)" : "In memoriam"}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-brown-dark/60 to-transparent" />
      </div>
      <div className="p-4">
        <div className="text-xs text-caramel font-sans font-bold uppercase tracking-widest mb-1">
          {person.generation}ª Geração
        </div>
        <h3 className="font-serif text-lg text-brown-dark leading-tight">{person.fullName}</h3>
        {person.nickname && (
          <p className="text-sm text-brown-mid italic font-sans">"{person.nickname}"</p>
        )}
        <p className="text-xs text-caramel font-sans mt-1">{lifespan(person)}</p>
        {person.profession && (
          <p className="text-xs text-brown-mid font-sans mt-1">{person.profession}</p>
        )}
      </div>
    </button>
  );
}
