import { useState } from "react";
import type { Person, Relationship, Memory, FamilyEvent } from "@/src/types";

export function PersonForm({
  initial, onSave, onCancel
}: {
  initial: Person | null;
  onSave: (data: Omit<Person, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<Person, "id">>({
    name: initial?.name || "",
    fullName: initial?.fullName || "",
    nickname: initial?.nickname || "",
    birthDate: initial?.birthDate || "",
    birthPlace: initial?.birthPlace || "",
    deathDate: initial?.deathDate || "",
    deathPlace: initial?.deathPlace || "",
    biography: initial?.biography || "",
    profession: initial?.profession || "",
    residence: initial?.residence || "",
    generation: initial?.generation || 1,
    isAlive: initial?.isAlive ?? true,
    photoUrl: initial?.photoUrl || "",
    notes: initial?.notes || "",
  });

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div>
      <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={4}
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[key] as string | number}
          onChange={e => setForm(f => ({ ...f, [key]: type === "number" ? +e.target.value : e.target.value }))}
          className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel transition-colors"
        />
      )}
    </div>
  );

  return (
    <div className="card-frame p-6 mb-6 page-enter">
      <h3 className="font-serif text-xl text-brown-dark mb-4">{initial ? "Editar pessoa" : "Adicionar pessoa"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Nome", "name")}
        {field("Nome completo", "fullName")}
        {field("Apelido", "nickname")}
        {field("Geração", "generation", "number")}
        {field("Data de nascimento", "birthDate", "date")}
        {field("Local de nascimento", "birthPlace")}
        {field("Data de falecimento", "deathDate", "date")}
        {field("Local de falecimento", "deathPlace")}
        {field("Profissão", "profession")}
        {field("Cidade", "residence")}
        {field("URL da foto", "photoUrl")}
        <div>
          <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">Situação</label>
          <select
            value={form.isAlive ? "alive" : "deceased"}
            onChange={e => setForm(f => ({ ...f, isAlive: e.target.value === "alive" }))}
            className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel"
          >
            <option value="alive">Vivo(a)</option>
            <option value="deceased">Falecido(a)</option>
          </select>
        </div>
      </div>
      <div className="mt-4">{field("Biografia", "biography", "textarea")}</div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onSave(form)}
          className="px-6 py-2 bg-terracotta text-cream font-sans text-sm uppercase tracking-wide rounded-sm hover:bg-caramel transition-colors"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-beige text-brown-mid font-sans text-sm rounded-sm hover:border-caramel transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function RelationshipForm({
  people, onSave, onCancel
}: {
  people: Person[];
  onSave: (data: Omit<Relationship, "id">) => void;
  onCancel: () => void;
}) {
  const TYPES = ["pai", "mãe", "filho", "filha", "avô", "avó", "neto", "neta", "irmão", "irmã", "tio", "tia", "sobrinho", "sobrinha", "primo", "prima", "esposo", "esposa", "companheiro", "companheira"];
  const [form, setForm] = useState({ personId: people[0]?.id || 0, relatedPersonId: people[1]?.id || 0, type: "filho" });

  return (
    <div className="card-frame p-6 mb-6 page-enter">
      <h3 className="font-serif text-xl text-brown-dark mb-4">Adicionar relacionamento</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">Pessoa</label>
          <select
            value={form.personId}
            onChange={e => setForm(f => ({ ...f, personId: +e.target.value }))}
            className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel"
          >
            {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">Relação</label>
          <select
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel"
          >
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">De / Para</label>
          <select
            value={form.relatedPersonId}
            onChange={e => setForm(f => ({ ...f, relatedPersonId: +e.target.value }))}
            className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel"
          >
            {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => onSave(form)} className="px-6 py-2 bg-terracotta text-cream font-sans text-sm uppercase tracking-wide rounded-sm hover:bg-caramel transition-colors">Salvar</button>
        <button onClick={onCancel} className="px-6 py-2 border border-beige text-brown-mid font-sans text-sm rounded-sm hover:border-caramel transition-colors">Cancelar</button>
      </div>
    </div>
  );
}

export function MemoryForm({
  people, onSave, onCancel
}: {
  people: Person[];
  onSave: (data: Omit<Memory, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<Memory, "id">>({
    title: "", content: "", date: "", location: "", author: "", personIds: [],
  });

  function togglePerson(id: number) {
    setForm(f => ({
      ...f,
      personIds: f.personIds.includes(id) ? f.personIds.filter(x => x !== id) : [...f.personIds, id],
    }));
  }

  return (
    <div className="card-frame p-6 mb-6 page-enter">
      <h3 className="font-serif text-xl text-brown-dark mb-4">Adicionar memória</h3>
      <div className="space-y-4">
        {[
          { label: "Título", key: "title" },
          { label: "Data / Período", key: "date" },
          { label: "Local", key: "location" },
          { label: "Autor", key: "author" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">{f.label}</label>
            <input
              type="text"
              value={(form as Record<string, unknown>)[f.key] as string}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">Texto da memória</label>
          <textarea
            rows={6}
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-2">Pessoas relacionadas</label>
          <div className="flex flex-wrap gap-2">
            {people.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePerson(p.id)}
                className={`px-3 py-1 text-xs font-sans rounded-sm transition-colors ${form.personIds.includes(p.id) ? "bg-terracotta text-cream" : "border border-beige text-brown-mid hover:border-caramel"}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => onSave(form)} className="px-6 py-2 bg-terracotta text-cream font-sans text-sm uppercase tracking-wide rounded-sm hover:bg-caramel transition-colors">Salvar</button>
        <button onClick={onCancel} className="px-6 py-2 border border-beige text-brown-mid font-sans text-sm rounded-sm hover:border-caramel transition-colors">Cancelar</button>
      </div>
    </div>
  );
}

export function EventForm({
  people, onSave, onCancel
}: {
  people: Person[];
  onSave: (data: Omit<FamilyEvent, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<FamilyEvent, "id">>({
    title: "", description: "", eventDate: "", location: "", personIds: [],
  });

  function togglePerson(id: number) {
    setForm(f => ({
      ...f,
      personIds: f.personIds.includes(id) ? f.personIds.filter(x => x !== id) : [...f.personIds, id],
    }));
  }

  return (
    <div className="card-frame p-6 mb-6 page-enter">
      <h3 className="font-serif text-xl text-brown-dark mb-4">Adicionar acontecimento</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: "Título", key: "title", type: "text" },
          { label: "Data", key: "eventDate", type: "date" },
          { label: "Local", key: "location", type: "text" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">{f.label}</label>
            <input
              type={f.type}
              value={(form as Record<string, unknown>)[f.key] as string}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel"
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1">Descrição</label>
        <textarea
          rows={3}
          value={form.description || ""}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full border border-beige bg-parchment px-3 py-2 text-sm font-sans text-brown-dark rounded-sm outline-none focus:border-caramel resize-none"
        />
      </div>
      <div className="mt-4">
        <label className="block text-xs font-sans uppercase tracking-wide text-caramel mb-2">Pessoas relacionadas</label>
        <div className="flex flex-wrap gap-2">
          {people.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => togglePerson(p.id)}
              className={`px-3 py-1 text-xs font-sans rounded-sm transition-colors ${form.personIds.includes(p.id) ? "bg-terracotta text-cream" : "border border-beige text-brown-mid hover:border-caramel"}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => onSave(form)} className="px-6 py-2 bg-terracotta text-cream font-sans text-sm uppercase tracking-wide rounded-sm hover:bg-caramel transition-colors">Salvar</button>
        <button onClick={onCancel} className="px-6 py-2 border border-beige text-brown-mid font-sans text-sm rounded-sm hover:border-caramel transition-colors">Cancelar</button>
      </div>
    </div>
  );
}
