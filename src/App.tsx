"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Page, Person } from "@/src/types";
import { INIT_PEOPLE, INIT_RELATIONSHIPS, INIT_PHOTOS, INIT_MEMORIES, INIT_EVENTS } from "@/src/data/initialData";
import { Navbar } from "@/src/components/Navbar";
import { PersonModal } from "@/src/components/PersonModal";
import { HomePage } from "@/src/views/HomePage";
import { PessoasPage } from "@/src/views/PessoasPage";
import { ArvorePage } from "@/src/views/ArvorePage";
import { FotografiasPage } from "@/src/views/FotografiasPage";
import { MemoriasPage } from "@/src/views/MemoriasPage";
import { AcontecimentosPage } from "@/src/views/AcontecimentosPage";
import { NossaHistoriaPage } from "@/src/views/NossaHistoriaPage";
import { AdminPage } from "@/src/views/admin/AdminPage";

const PAGE_PATHS: Record<Page, string> = {
  home: "/",
  "nossa-historia": "/nossa-historia",
  pessoas: "/pessoas",
  arvore: "/arvore",
  fotografias: "/fotografias",
  memorias: "/memorias",
  acontecimentos: "/acontecimentos",
  admin: "/admin",
};

function pageFromPath(pathname: string): Page {
  const match = (Object.entries(PAGE_PATHS) as [Page, string][]).find(([, path]) => path === pathname);
  return match?.[0] ?? "home";
}

export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const page = pageFromPath(pathname);
  const [people, setPeople] = useState<Person[]>(INIT_PEOPLE);
  const [relationships, setRelationships] = useState(INIT_RELATIONSHIPS);
  const [photos] = useState(INIT_PHOTOS);
  const [memories, setMemories] = useState(INIT_MEMORIES);
  const [events, setEvents] = useState(INIT_EVENTS);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  function navigate(nextPage: Page) {
    const nextPath = PAGE_PATHS[nextPage];
    if (nextPath !== pathname) router.push(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openPerson(person: Person) { setSelectedPerson(person); }
  function navigateToPerson(id: number) {
    const person = people.find(item => item.id === id);
    if (person) setSelectedPerson(person);
  }

  return (
    <div className="min-h-full" style={{ backgroundColor: "#F8F1E7" }}>
      <Navbar current={page} onNavigate={navigate} />
      {page === "home" && <HomePage people={people} photos={photos} memories={memories} events={events} onNavigate={navigate} onOpenPerson={openPerson} />}
      {page === "nossa-historia" && <NossaHistoriaPage events={events} people={people} />}
      {page === "pessoas" && <PessoasPage people={people} onOpenPerson={openPerson} />}
      {page === "arvore" && <ArvorePage people={people} relationships={relationships} onOpenPerson={openPerson} />}
      {page === "fotografias" && <FotografiasPage photos={photos} people={people} />}
      {page === "memorias" && <MemoriasPage memories={memories} people={people} />}
      {page === "acontecimentos" && <AcontecimentosPage events={events} people={people} />}
      {page === "admin" && <AdminPage people={people} relationships={relationships} photos={photos} memories={memories} events={events} setPeople={setPeople} setRelationships={setRelationships} setMemories={setMemories} setEvents={setEvents} />}
      {selectedPerson && <PersonModal person={selectedPerson} people={people} relationships={relationships} photos={photos} memories={memories} events={events} onClose={() => setSelectedPerson(null)} onNavigate={navigateToPerson} />}
    </div>
  );
}
