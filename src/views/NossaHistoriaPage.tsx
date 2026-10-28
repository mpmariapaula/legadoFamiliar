import type { Person, FamilyEvent } from "@/src/types";
import { AcontecimentosPage } from "@/src/views/AcontecimentosPage";

export function NossaHistoriaPage({ events, people }: { events: FamilyEvent[]; people: Person[] }) {
  return <AcontecimentosPage events={events} people={people} />;
}
