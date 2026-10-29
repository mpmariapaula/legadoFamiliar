import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Person, Relationship, Photo, Memory, FamilyEvent, AdminSection } from "@/src/types";
import { formatDate, formatYear, lifespan } from "@/src/utils/date";
import { PersonForm, RelationshipForm, MemoryForm, EventForm } from "@/src/components/admin/Forms";
import { salvarPessoa } from "@/src/lib/supabase";
import { supabase } from "@/src/lib/supabase";

export function AdminPage({
  people, relationships, photos, memories, events,
  setPeople, setRelationships, setMemories, setEvents
}: {
  people: Person[]; relationships: Relationship[]; photos: Photo[]; memories: Memory[]; events: FamilyEvent[];
  setPeople: Dispatch<SetStateAction<Person[]>>;
  setRelationships: Dispatch<SetStateAction<Relationship[]>>;
  setMemories: Dispatch<SetStateAction<Memory[]>>;
  setEvents: Dispatch<SetStateAction<FamilyEvent[]>>;
}) {
  const [section, setSection] = useState<AdminSection>("dashboard");
  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [showRelForm, setShowRelForm] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [confirm, setConfirm] = useState<{ type: string; id: number } | null>(null);

  const generations = [...new Set(people.map(p => p.generation))].length;

  function deletePerson(id: number) {
    setPeople(prev => prev.filter(p => p.id !== id));
    setRelationships(prev => prev.filter(r => r.personId !== id && r.relatedPersonId !== id));
    setConfirm(null);
  }

  function deleteMemory(id: number) {
    setMemories(prev => prev.filter(m => m.id !== id));
    setConfirm(null);
  }

  function deleteEvent(id: number) {
    setEvents(prev => prev.filter(e => e.id !== id));
    setConfirm(null);
  }

  const SECTIONS: { key: AdminSection; label: string }[] = [
    { key: "dashboard", label: "Painel" },
    { key: "pessoas", label: "Pessoas" },
    { key: "relacionamentos", label: "Relacionamentos" },
    { key: "memorias", label: "Memórias" },
    { key: "eventos", label: "Acontecimentos" },
    { key: "fotografias", label: "Fotografias" },
  ];

  return (
    <div className="page-enter max-w-7xl mx-auto px-6 py-12">
      <div className="ornament mb-8 flex items-center justify-between">
        <h1 className="font-serif text-4xl text-brown-dark px-4">
          Administração
        </h1>
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(74,44,32,0.6)" }}>
          <div className="card-frame p-8 max-w-sm w-full mx-4 page-enter text-center">
            <p className="font-serif text-brown-dark text-xl mb-2">Tem certeza?</p>
            <p className="text-brown-mid font-sans text-sm mb-6">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  if (confirm.type === "person") deletePerson(confirm.id);
                  if (confirm.type === "memory") deleteMemory(confirm.id);
                  if (confirm.type === "event") deleteEvent(confirm.id);
                }}
                className="px-6 py-2 bg-red-700 text-white font-sans text-sm rounded-sm hover:bg-red-800 transition-colors"
              >
                Excluir
              </button>
              <button
                onClick={() => setConfirm(null)}
                className="px-6 py-2 border border-beige text-brown-mid font-sans text-sm rounded-sm hover:border-caramel transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-48 shrink-0">
          <div className="card-frame overflow-hidden">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`block w-full text-left px-4 py-3 font-sans text-sm border-b border-beige last:border-0 transition-colors ${
                  section === s.key
                    ? "bg-brown-dark text-cream"
                    : "text-brown-mid hover:bg-parchment"
                }`}
              >
                {s.label}
              </button>
              ))}

              <button
                type="button"
                onClick={sair}
                className="block w-full text-left px-4 py-3 font-sans text-sm text-red-700 hover:bg-parchment transition-colors mt-4 border-t border-beige"
              >
                Sair
              </button>

          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Dashboard */}
          {section === "dashboard" && (
            <div>
              <h2 className="font-serif text-2xl text-brown-dark mb-6">Visão Geral</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Pessoas", value: people.length, color: "bg-brown-dark" },
                  { label: "Gerações", value: generations, color: "bg-brown-mid" },
                  { label: "Fotografias", value: photos.length, color: "bg-caramel" },
                  { label: "Relacionamentos", value: relationships.length, color: "bg-terracotta" },
                  { label: "Memórias", value: memories.length, color: "bg-sage" },
                  { label: "Acontecimentos", value: events.length, color: "bg-caramel" },
                  { label: "Fotografias", value: photos.length, color: "bg-caramel" },
                ].map(s => (
                  <div key={s.label} className={`${s.color} text-cream rounded-sm p-5`}>
                    <div className="font-serif text-4xl">{s.value}</div>
                    <div className="font-sans text-xs uppercase tracking-widest mt-1 opacity-80">{s.label}</div>
                  </div>
                ))}
              </div>

              <h3 className="font-serif text-xl text-brown-dark mb-4">Últimas pessoas cadastradas</h3>
              <div className="card-frame overflow-hidden mb-6">
                <table className="admin-table w-full">
                  <thead>
                    <tr><th>Nome</th><th>Geração</th><th>Situação</th></tr>
                  </thead>
                  <tbody>
                    {people.slice(-5).reverse().map(p => (
                      <tr key={p.id}>
                        <td className="font-serif text-brown-dark">{p.fullName}</td>
                        <td className="text-caramel">{p.generation}ª</td>
                        <td>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.isAlive ? "badge-alive" : "badge-deceased"}`}>
                            {p.isAlive ? "Vivo(a)" : "In memoriam"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pessoas */}
          {section === "pessoas" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-brown-dark">Pessoas</h2>
                <button
                  onClick={() => { setEditPerson(null); setShowPersonForm(true); }}
                  className="px-4 py-2 bg-terracotta text-cream font-sans text-sm uppercase tracking-wide rounded-sm hover:bg-caramel transition-colors"
                >
                  + Adicionar pessoa
                </button>
              </div>

              {showPersonForm && (
                <PersonForm
                  initial={editPerson}
                  onSave={async (data) => {
                    try {
                      const pessoaSalva = await salvarPessoa(
                        data,
                        editPerson?.id
                      );

                      if (editPerson) {
                        setPeople(prev =>
                          prev.map(p =>
                            p.id === editPerson.id ? pessoaSalva : p
                          )
                        );
                      } else {
                        setPeople(prev => [...prev, pessoaSalva]);
                      }

                      setShowPersonForm(false);
                      setEditPerson(null);
                    } catch (erro) {
                      console.error("Erro ao salvar pessoa:", erro);
                      alert(
                        erro instanceof Error
                          ? erro.message
                          : "Não foi possível salvar a pessoa."
                      );
                    }
                  }}
                  onCancel={() => { setShowPersonForm(false); setEditPerson(null); }}
                />
              )}

              <div className="card-frame overflow-hidden overflow-x-auto">
                <table className="admin-table w-full">
                  <thead>
                    <tr><th>Nome</th><th>Geração</th><th>Profissão</th><th>Situação</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {people.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            {p.photoUrl && <img src={p.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover object-top" />}
                            <span className="font-serif text-brown-dark">{p.fullName}</span>
                          </div>
                        </td>
                        <td className="text-caramel">{p.generation}ª</td>
                        <td className="text-brown-mid">{p.profession || "—"}</td>
                        <td>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.isAlive ? "badge-alive" : "badge-deceased"}`}>
                            {p.isAlive ? "Vivo(a)" : "In memoriam"}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setEditPerson(p); setShowPersonForm(true); }}
                              className="text-xs text-caramel hover:text-terracotta font-sans"
                            >Editar</button>
                            <button
                              onClick={() => setConfirm({ type: "person", id: p.id })}
                              className="text-xs text-red-600 hover:text-red-800 font-sans"
                            >Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Relacionamentos */}
          {section === "relacionamentos" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-brown-dark">Relacionamentos</h2>
                <button
                  onClick={() => setShowRelForm(true)}
                  className="px-4 py-2 bg-terracotta text-cream font-sans text-sm uppercase tracking-wide rounded-sm hover:bg-caramel transition-colors"
                >
                  + Adicionar relação
                </button>
              </div>

              {showRelForm && (
                <RelationshipForm
                  people={people}
                  onSave={(data) => {
                    const newId = Math.max(0, ...relationships.map(r => r.id)) + 1;
                    setRelationships(prev => [...prev, { id: newId, ...data }]);
                    setShowRelForm(false);
                  }}
                  onCancel={() => setShowRelForm(false)}
                />
              )}

              <div className="card-frame overflow-hidden overflow-x-auto">
                <table className="admin-table w-full">
                  <thead>
                    <tr><th>Pessoa</th><th>Relação</th><th>Com quem</th><th>Ação</th></tr>
                  </thead>
                  <tbody>
                    {relationships.map(r => {
                      const person = people.find(p => p.id === r.personId);
                      const related = people.find(p => p.id === r.relatedPersonId);
                      return (
                        <tr key={r.id}>
                          <td className="font-serif text-brown-dark">{person?.name || "—"}</td>
                          <td className="text-caramel italic">{r.type}</td>
                          <td className="font-serif text-brown-dark">{related?.name || "—"}</td>
                          <td>
                            <button
                              onClick={() => setRelationships(prev => prev.filter(x => x.id !== r.id))}
                              className="text-xs text-red-600 hover:text-red-800 font-sans"
                            >Excluir</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Memórias */}
          {section === "memorias" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-brown-dark">Memórias</h2>
                <button
                  onClick={() => setShowMemoryForm(true)}
                  className="px-4 py-2 bg-terracotta text-cream font-sans text-sm uppercase tracking-wide rounded-sm hover:bg-caramel transition-colors"
                >
                  + Adicionar memória
                </button>
              </div>

              {showMemoryForm && (
                <MemoryForm
                  people={people}
                  onSave={(data) => {
                    const newId = Math.max(0, ...memories.map(m => m.id)) + 1;
                    setMemories(prev => [...prev, { id: newId, ...data }]);
                    setShowMemoryForm(false);
                  }}
                  onCancel={() => setShowMemoryForm(false)}
                />
              )}

              <div className="card-frame overflow-hidden">
                <table className="admin-table w-full">
                  <thead>
                    <tr><th>Título</th><th>Data</th><th>Autor</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {memories.map(m => (
                      <tr key={m.id}>
                        <td className="font-serif text-brown-dark">{m.title}</td>
                        <td className="text-caramel">{m.date || "—"}</td>
                        <td className="text-brown-mid">{m.author || "—"}</td>
                        <td>
                          <button
                            onClick={() => setConfirm({ type: "memory", id: m.id })}
                            className="text-xs text-red-600 hover:text-red-800 font-sans"
                          >Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Acontecimentos */}
          {section === "eventos" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-brown-dark">Acontecimentos</h2>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="px-4 py-2 bg-terracotta text-cream font-sans text-sm uppercase tracking-wide rounded-sm hover:bg-caramel transition-colors"
                >
                  + Adicionar acontecimento
                </button>
              </div>

              {showEventForm && (
                <EventForm
                  people={people}
                  onSave={(data) => {
                    const newId = Math.max(0, ...events.map(e => e.id)) + 1;
                    setEvents(prev => [...prev, { id: newId, ...data }]);
                    setShowEventForm(false);
                  }}
                  onCancel={() => setShowEventForm(false)}
                />
              )}

              <div className="card-frame overflow-hidden">
                <table className="admin-table w-full">
                  <thead>
                    <tr><th>Título</th><th>Data</th><th>Local</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {[...events].sort((a, b) => a.eventDate.localeCompare(b.eventDate)).map(e => (
                      <tr key={e.id}>
                        <td className="font-serif text-brown-dark">{e.title}</td>
                        <td className="text-caramel">{formatYear(e.eventDate)}</td>
                        <td className="text-brown-mid">{e.location || "—"}</td>
                        <td>
                          <button
                            onClick={() => setConfirm({ type: "event", id: e.id })}
                            className="text-xs text-red-600 hover:text-red-800 font-sans"
                          >Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div>
            <h2 className="font-serif text-2xl text-brown-dark">Fotografias</h2>
            <div className="card-frame overflow-hidden">
              <table className="admin-table w-full">
                <thead>
                  <tr><th>Título</th><th>Data</th><th>Autor</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {photos.map(p => (
                    <tr key={p.id}>
                      <td className="font-serif text-brown-dark">{p.title}</td>
                      <td className="text-caramel">{p.date || "—"}</td>
                      <td className="text-brown-mid">{p.author || "—"}</td>
                      <td>
                        <button
                          onClick={() => setConfirm({ type: "photo", id: p.id })}
                          className="text-xs text-red-600 hover:text-red-800 font-sans"
                        >Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
