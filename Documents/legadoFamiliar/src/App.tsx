import { useState, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

type Page = "home" | "nossa-historia" | "pessoas" | "arvore" | "fotografias" | "memorias" | "acontecimentos" | "admin";
type AdminSection = "dashboard" | "pessoas" | "relacionamentos" | "memorias" | "eventos";

interface Person {
  id: number;
  name: string;
  fullName: string;
  nickname?: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  biography?: string;
  profession?: string;
  residence?: string;
  generation: number;
  isAlive: boolean;
  photoUrl?: string;
  notes?: string;
}

interface Relationship {
  id: number;
  personId: number;
  relatedPersonId: number;
  type: string;
}

interface Photo {
  id: number;
  title: string;
  description?: string;
  photoUrl: string;
  date?: string;
  location?: string;
  albumId?: number;
  personIds: number[];
}

interface Memory {
  id: number;
  title: string;
  content: string;
  date?: string;
  location?: string;
  author?: string;
  personIds: number[];
}

interface FamilyEvent {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  personIds: number[];
}

// ─── Sample Data ────────────────────────────────────────────────────────────

const INIT_PEOPLE: Person[] = [
  {
    id: 1, name: "Antônio", fullName: "Antônio Carlos Silva",
    birthDate: "1920-03-15", birthPlace: "São Paulo, SP",
    deathDate: "2005-11-20", deathPlace: "São Paulo, SP",
    biography: "Patriarca da família Silva. Nascido em tempos difíceis, construiu sua vida com muito trabalho e dedicação. Foi agricultor e depois comerciante, sempre colocando a família em primeiro lugar. Homem de poucas palavras mas gestos imensos, era o pilar que sustentava todos ao redor.",
    profession: "Comerciante", residence: "São Paulo, SP",
    generation: 1, isAlive: false,
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 2, name: "Maria", fullName: "Maria das Graças Santos Silva",
    nickname: "Dona Maria",
    birthDate: "1922-06-08", birthPlace: "Campinas, SP",
    deathDate: "2010-04-30", deathPlace: "São Paulo, SP",
    biography: "Matriarca da família, conhecida por sua sabedoria e hospitalidade. Seu lar era sempre aberto a todos. Excelente cozinheira e contadora de histórias, mantinha viva a memória da família. Seus olhos tinham o brilho de quem viveu muito e amou ainda mais.",
    profession: "Dona de casa", residence: "São Paulo, SP",
    generation: 1, isAlive: false,
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 3, name: "João", fullName: "João Antônio Silva",
    birthDate: "1945-09-12", birthPlace: "São Paulo, SP",
    deathDate: "2020-02-14",
    biography: "Primogênito do casal Antônio e Maria. Seguiu os passos do pai no comércio e expandiu os negócios da família. Casou-se com Luísa em 1968 e tiveram três filhos. Homem generoso e trabalhador, era o elo entre as gerações mais velhas e as mais novas.",
    profession: "Empresário", residence: "São Paulo, SP",
    generation: 2, isAlive: false,
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 4, name: "Ana", fullName: "Ana Maria Silva Ferreira",
    birthDate: "1948-12-25", birthPlace: "São Paulo, SP",
    biography: "Segunda filha do casal. Formou-se em pedagogia e dedicou sua vida à educação. Professora por mais de 40 anos, tocou a vida de centenas de crianças. Ainda hoje, seus antigos alunos a procuram com carinho.",
    profession: "Professora aposentada", residence: "Campinas, SP",
    generation: 2, isAlive: true,
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 5, name: "José", fullName: "José Roberto Silva",
    nickname: "Zé",
    birthDate: "1950-07-04", birthPlace: "São Paulo, SP",
    deathDate: "1998-08-15",
    biography: "O caçula da família. Artista e músico talentoso, José tocava violão e compunha canções que emocionavam a todos. Faleceu precocemente, mas sua música e seu riso permanecem vivos na memória de quem o conheceu.",
    profession: "Músico", residence: "Rio de Janeiro, RJ",
    generation: 2, isAlive: false,
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 6, name: "Carlos", fullName: "Carlos Eduardo Silva",
    birthDate: "1970-05-20", birthPlace: "São Paulo, SP",
    biography: "Filho de João, formou-se em engenharia civil. Trabalha em grandes projetos de infraestrutura pelo Brasil. Carrega o espírito empreendedor do avô Antônio, mas com a visão das novas gerações.",
    profession: "Engenheiro Civil", residence: "Brasília, DF",
    generation: 3, isAlive: true,
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 7, name: "Fernanda", fullName: "Fernanda Silva Costa",
    birthDate: "1972-11-08", birthPlace: "São Paulo, SP",
    biography: "Filha de João, médica pediatra, mãe de dois filhos. Vive em São Paulo onde trabalha em hospital público. Herdou a generosidade da avó Maria e a determinação do avô Antônio.",
    profession: "Médica Pediatra", residence: "São Paulo, SP",
    generation: 3, isAlive: true,
    photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: 8, name: "Pedro", fullName: "Pedro Henrique Ferreira",
    birthDate: "1975-03-30", birthPlace: "Campinas, SP",
    biography: "Filho de Ana, advogado especializado em direito de família. Apaixonado por história, foi quem iniciou o projeto de documentar o Legado da Família, para que as próximas gerações conheçam suas raízes.",
    profession: "Advogado", residence: "Campinas, SP",
    generation: 3, isAlive: true,
    photoUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&auto=format",
  },
];

const INIT_RELATIONSHIPS: Relationship[] = [
  { id: 1, personId: 1, relatedPersonId: 2, type: "esposo" },
  { id: 2, personId: 2, relatedPersonId: 1, type: "esposa" },
  { id: 3, personId: 1, relatedPersonId: 3, type: "filho" },
  { id: 4, personId: 3, relatedPersonId: 1, type: "pai" },
  { id: 5, personId: 3, relatedPersonId: 2, type: "mãe" },
  { id: 6, personId: 1, relatedPersonId: 4, type: "filha" },
  { id: 7, personId: 4, relatedPersonId: 1, type: "pai" },
  { id: 8, personId: 4, relatedPersonId: 2, type: "mãe" },
  { id: 9, personId: 1, relatedPersonId: 5, type: "filho" },
  { id: 10, personId: 5, relatedPersonId: 1, type: "pai" },
  { id: 11, personId: 5, relatedPersonId: 2, type: "mãe" },
  { id: 12, personId: 2, relatedPersonId: 3, type: "filho" },
  { id: 13, personId: 2, relatedPersonId: 4, type: "filha" },
  { id: 14, personId: 2, relatedPersonId: 5, type: "filho" },
  { id: 15, personId: 3, relatedPersonId: 6, type: "filho" },
  { id: 16, personId: 6, relatedPersonId: 3, type: "pai" },
  { id: 17, personId: 3, relatedPersonId: 7, type: "filha" },
  { id: 18, personId: 7, relatedPersonId: 3, type: "pai" },
  { id: 19, personId: 4, relatedPersonId: 8, type: "filho" },
  { id: 20, personId: 8, relatedPersonId: 4, type: "mãe" },
  { id: 21, personId: 3, relatedPersonId: 4, type: "irmã" },
  { id: 22, personId: 4, relatedPersonId: 3, type: "irmão" },
];

const INIT_PHOTOS: Photo[] = [
  {
    id: 1, title: "Casamento de Antônio e Maria",
    description: "O grande dia — 15 de outubro de 1942, na Igreja do Carmo, São Paulo.",
    photoUrl: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=800&h=600&fit=crop&auto=format",
    date: "1942-10-15", location: "São Paulo, SP", albumId: 1, personIds: [1, 2],
  },
  {
    id: 2, title: "Família reunida no Natal de 1960",
    photoUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop&auto=format",
    date: "1960-12-25", location: "São Paulo, SP", albumId: 2, personIds: [1, 2, 3, 4, 5],
  },
  {
    id: 3, title: "Antônio em seu comércio",
    photoUrl: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&h=600&fit=crop&auto=format",
    date: "1955-06-01", location: "São Paulo, SP", albumId: 3, personIds: [1],
  },
  {
    id: 4, title: "Maria e os filhos pequenos",
    photoUrl: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&h=600&fit=crop&auto=format",
    date: "1958-03-20", location: "São Paulo, SP", albumId: 2, personIds: [2, 3, 4, 5],
  },
  {
    id: 5, title: "Fernanda na formatura de medicina",
    photoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&auto=format",
    date: "1997-12-10", location: "São Paulo, SP", albumId: 4, personIds: [7],
  },
  {
    id: 6, title: "Pedro e a pesquisa do legado familiar",
    photoUrl: "https://images.unsplash.com/photo-1542216515-4e6a586c1ca0?w=800&h=600&fit=crop&auto=format",
    date: "2025-01-20", location: "Campinas, SP", albumId: 4, personIds: [8],
  },
];

const INIT_MEMORIES: Memory[] = [
  {
    id: 1, title: "Como os avós se conheceram",
    content: "Era uma tarde de domingo de 1940 quando Antônio viu Maria pela primeira vez na festa de São João da Vila Madalena. Ele ficou tão encantado que pediu permissão ao pai dela para dançar. \"Seus olhos brilhavam como estrelas\", ele costumava dizer.\n\nDois anos depois, estavam casados na Igreja do Carmo, rodeados pela família e amigos. Maria sempre contava que soube desde aquela primeira dança que ele era o homem certo. \"Era gentil, trabalhador e tinha um sorriso que aquecia o coração.\" Antônio chegou a percorrer mais de 30 km de bicicleta todo domingo para visitá-la antes do casamento.",
    date: "1940", location: "São Paulo, SP",
    author: "Pedro Henrique Ferreira", personIds: [1, 2],
  },
  {
    id: 2, title: "A história da nossa primeira casa",
    content: "Em 1943, com muito sacrifício e a ajuda de amigos e familiares, Antônio e Maria construíram a primeira casa da família no bairro da Lapa. Era pequena, apenas dois quartos, mas cheia de amor e esperança.\n\nAs paredes foram levantadas nos fins de semana por amigos que se revezavam carregando tijolos. Maria preparava marmitas para todos. \"Naquela casa nasceram nossos sonhos e nossos filhos\", dizia ela com orgulho. A casa ainda existe até hoje, habitada por parentes distantes, como um monumento silencioso ao esforço de nossos antepassados.",
    date: "1943", location: "Lapa, São Paulo, SP",
    author: "Ana Maria Silva Ferreira", personIds: [1, 2],
  },
  {
    id: 3, title: "Os domingos em família",
    content: "Todo domingo sem falta, a família se reunia na casa de Dona Maria. O almoço era sempre farto — arroz, feijão, frango assado e aquela macarronada que ela fazia com tanto carinho. As crianças brincavam no quintal enquanto os adultos conversavam na varanda.\n\nJosé sempre trazia o violão e as tardes terminavam em cantoria. \"Esses domingos eram a cola que mantinha a família unida\", recorda Ana. Mesmo depois que os filhos casaram e foram morar em outras cidades, a tradição do almoço dominical durou décadas.",
    date: "1950–1990", location: "São Paulo, SP",
    author: "Carlos Eduardo Silva", personIds: [1, 2, 3, 4, 5],
  },
];

const INIT_EVENTS: FamilyEvent[] = [
  { id: 1,  title: "Nascimento de Antônio Carlos Silva", description: "Nascimento do patriarca da família Silva em São Paulo.", eventDate: "1920-03-15", location: "São Paulo, SP", personIds: [1] },
  { id: 2,  title: "Nascimento de Maria das Graças", eventDate: "1922-06-08", location: "Campinas, SP", personIds: [2] },
  { id: 3,  title: "Casamento de Antônio e Maria", description: "O casal se casou na Igreja do Carmo em uma cerimônia emocionante, cercados de família e amigos.", eventDate: "1942-10-15", location: "São Paulo, SP", personIds: [1, 2] },
  { id: 4,  title: "Construção da primeira casa", description: "Com muito esforço e ajuda de amigos, a família construiu sua primeira casa na Lapa.", eventDate: "1943-05-01", location: "Lapa, São Paulo, SP", personIds: [1, 2] },
  { id: 5,  title: "Nascimento de João Antônio", eventDate: "1945-09-12", location: "São Paulo, SP", personIds: [3] },
  { id: 6,  title: "Nascimento de Ana Maria", eventDate: "1948-12-25", location: "São Paulo, SP", personIds: [4] },
  { id: 7,  title: "Nascimento de José Roberto", eventDate: "1950-07-04", location: "São Paulo, SP", personIds: [5] },
  { id: 8,  title: "Bodas de Prata de Antônio e Maria", description: "Grande encontro da família para celebrar 25 anos de amor.", eventDate: "1967-10-15", location: "São Paulo, SP", personIds: [1, 2, 3, 4, 5] },
  { id: 9,  title: "Nascimento de Carlos Eduardo", eventDate: "1970-05-20", location: "São Paulo, SP", personIds: [6] },
  { id: 10, title: "Nascimento de Fernanda", eventDate: "1972-11-08", location: "São Paulo, SP", personIds: [7] },
  { id: 11, title: "Nascimento de Pedro Henrique", eventDate: "1975-03-30", location: "Campinas, SP", personIds: [8] },
  { id: 12, title: "Formatura de Fernanda em Medicina", description: "Fernanda se forma médica pediatra — orgulho de toda a família.", eventDate: "1997-12-10", location: "São Paulo, SP", personIds: [7] },
  { id: 13, title: "Falecimento de José Roberto", description: "O músico da família partiu prematuramente, mas sua música permanece em nossos corações.", eventDate: "1998-08-15", location: "Rio de Janeiro, RJ", personIds: [5] },
  { id: 14, title: "Falecimento de Antônio Carlos", description: "O patriarca nos deixou aos 85 anos, depois de uma vida plena e dedicada à família.", eventDate: "2005-11-20", location: "São Paulo, SP", personIds: [1] },
  { id: 15, title: "Falecimento de Maria das Graças", description: "A matriarca, aos 87 anos, partiu deixando um legado de amor e tradição inestimável.", eventDate: "2010-04-30", location: "São Paulo, SP", personIds: [2] },
  { id: 16, title: "Criação do Legado da Família", description: "Pedro inicia o projeto de documentar a história da família para as futuras gerações.", eventDate: "2026-01-01", location: "Campinas, SP", personIds: [8] },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatYear(dateStr?: string) {
  if (!dateStr) return "";
  return dateStr.slice(0, 4);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!m) return y;
  const months = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
  return `${d ? d + " " : ""}${months[parseInt(m) - 1]} ${y}`;
}

function lifespan(p: Person) {
  if (!p.birthDate && !p.deathDate) return "";
  if (p.birthDate && !p.deathDate) return formatYear(p.birthDate) + (p.isAlive ? "" : " – ?");
  return `${formatYear(p.birthDate)} – ${formatYear(p.deathDate)}`;
}

// ─── PersonCard ────────────────────────────────────────────────────────────

function PersonCard({ person, onClick }: { person: Person; onClick: () => void }) {
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

// ─── PersonModal ───────────────────────────────────────────────────────────

function PersonModal({
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

// ─── Navbar ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Início", page: "home" },
  { label: "Nossa História", page: "nossa-historia" },
  { label: "Pessoas", page: "pessoas" },
  { label: "Árvore Familiar", page: "arvore" },
  { label: "Fotografias", page: "fotografias" },
  { label: "Memórias", page: "memorias" },
  { label: "Acontecimentos", page: "acontecimentos" },
  { label: "Administração", page: "admin" },
];

function Navbar({ current, onNavigate }: { current: Page; onNavigate: (p: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-brown-dark text-cream shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <button
            onClick={() => onNavigate("home")}
            className="font-serif text-xl tracking-wide hover:text-caramel transition-colors"
          >
            Legado da Família
          </button>

          {/* Desktop nav */}
          <div className="nav-desktop items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-colors rounded-sm ${
                  current === item.page
                    ? "bg-terracotta text-cream"
                    : "text-cream/70 hover:text-cream hover:bg-cream/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn flex-col gap-1 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-cream transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-cream transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-cream transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="bg-brown-mid border-t border-cream/10">
          {NAV_ITEMS.map(item => (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setMenuOpen(false); }}
              className={`block w-full text-left px-6 py-3 text-sm font-sans transition-colors ${
                current === item.page ? "bg-terracotta text-cream" : "text-cream/80 hover:bg-cream/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HomePage ──────────────────────────────────────────────────────────────

function HomePage({
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
          <img
            src="https://images.unsplash.com/photo-1542216515-4e6a586c1ca0?w=1400&h=900&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-brown-dark/40" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-caramel font-sans text-sm uppercase tracking-[0.3em] mb-4">
            ✦ Uma história para sempre ✦
          </p>
          <h1 className="font-serif text-6xl md:text-8xl text-cream mb-4 leading-none">
            Legado da<br />
            <span className="italic text-beige">Família</span>
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
        <p className="mt-2">Legado da Família · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

// ─── PessoasPage ───────────────────────────────────────────────────────────

function PessoasPage({ people, onOpenPerson }: { people: Person[]; onOpenPerson: (p: Person) => void }) {
  const [query, setQuery] = useState("");
  const [filterGen, setFilterGen] = useState<number | null>(null);

  const generations = [...new Set(people.map(p => p.generation))].sort();

  const filtered = people.filter(p => {
    const q = query.toLowerCase();
    const matchQ = !q || p.fullName.toLowerCase().includes(q) ||
      (p.nickname || "").toLowerCase().includes(q) ||
      (p.profession || "").toLowerCase().includes(q) ||
      (p.residence || "").toLowerCase().includes(q);
    const matchG = filterGen === null || p.generation === filterGen;
    return matchQ && matchG;
  });

  return (
    <div className="page-enter max-w-7xl mx-auto px-6 py-12">
      <div className="ornament mb-8">
        <h1 className="font-serif text-4xl text-brown-dark px-4">Pessoas da Família</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Pesquisar por nome, profissão, cidade…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 border border-beige bg-parchment px-4 py-2.5 text-sm font-sans text-brown-dark placeholder:text-brown-mid/40 rounded-sm outline-none focus:border-caramel transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterGen(null)}
            className={`px-4 py-2 text-xs font-sans uppercase tracking-wide rounded-sm transition-colors ${filterGen === null ? "bg-brown-dark text-cream" : "border border-beige text-brown-mid hover:border-caramel"}`}
          >
            Todos
          </button>
          {generations.map(g => (
            <button
              key={g}
              onClick={() => setFilterGen(g)}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-wide rounded-sm transition-colors ${filterGen === g ? "bg-terracotta text-cream" : "border border-beige text-brown-mid hover:border-caramel"}`}
            >
              {g}ª Geração
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-brown-mid font-sans">
          <p className="font-serif text-2xl mb-2">Nenhum familiar encontrado</p>
          <p className="text-sm">Tente outros termos de pesquisa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <PersonCard key={p.id} person={p} onClick={() => onOpenPerson(p)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ArvorePage ────────────────────────────────────────────────────────────

function ArvorePage({ people, relationships, onOpenPerson }: {
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

// ─── FotografiasPage ───────────────────────────────────────────────────────

function FotografiasPage({ photos, people }: { photos: Photo[]; people: Person[] }) {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  return (
    <div className="page-enter max-w-7xl mx-auto px-6 py-12">
      <div className="ornament mb-10">
        <h1 className="font-serif text-4xl text-brown-dark px-4">Galeria da Família</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map(ph => (
          <button
            key={ph.id}
            className="photo-card text-left group relative overflow-hidden rounded-sm photo-frame"
            onClick={() => setLightbox(ph)}
          >
            <div className="aspect-[4/3] overflow-hidden bg-beige">
              <img
                src={ph.photoUrl}
                alt={ph.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="photo-overlay absolute inset-0 bg-brown-dark/60 flex flex-col justify-end p-4 opacity-0">
              <h3 className="font-serif text-cream text-lg">{ph.title}</h3>
              {ph.date && <p className="text-cream/70 text-xs font-sans">{formatDate(ph.date)}</p>}
              {ph.location && <p className="text-cream/70 text-xs font-sans">{ph.location}</p>}
            </div>
            <div className="p-3 bg-parchment">
              <h3 className="font-serif text-brown-dark text-sm leading-tight">{ph.title}</h3>
              {ph.date && <p className="text-caramel text-xs font-sans mt-0.5">{formatDate(ph.date)}</p>}
              {ph.personIds.length > 0 && (
                <p className="text-xs text-brown-mid font-sans mt-1">
                  {ph.personIds.map(id => people.find(p => p.id === id)?.name).filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(74,44,32,0.9)", backdropFilter: "blur(4px)" }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full page-enter" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-cream/60 hover:text-cream text-3xl font-light"
            >
              ×
            </button>
            <div className="photo-frame overflow-hidden rounded-sm">
              <img src={lightbox.photoUrl} alt={lightbox.title} className="w-full max-h-[70vh] object-contain bg-brown-dark" />
            </div>
            <div className="bg-parchment p-4 rounded-sm mt-2">
              <h3 className="font-serif text-brown-dark text-xl">{lightbox.title}</h3>
              {lightbox.description && <p className="text-brown-mid font-sans text-sm mt-1">{lightbox.description}</p>}
              <div className="flex gap-6 mt-2 text-xs font-sans text-caramel">
                {lightbox.date && <span>{formatDate(lightbox.date)}</span>}
                {lightbox.location && <span>{lightbox.location}</span>}
              </div>
              {lightbox.personIds.length > 0 && (
                <p className="text-xs text-brown-mid font-sans mt-1">
                  Pessoas: {lightbox.personIds.map(id => people.find(p => p.id === id)?.name).filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MemoriasPage ──────────────────────────────────────────────────────────

function MemoriasPage({ memories, people }: { memories: Memory[]; people: Person[] }) {
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

// ─── AcontecimentosPage ────────────────────────────────────────────────────

function AcontecimentosPage({ events, people }: { events: FamilyEvent[]; people: Person[] }) {
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

// ─── NossaHistoriaPage (alias) ─────────────────────────────────────────────

function NossaHistoriaPage({ events, people }: { events: FamilyEvent[]; people: Person[] }) {
  return <AcontecimentosPage events={events} people={people} />;
}

// ─── AdminPage ─────────────────────────────────────────────────────────────

function AdminPage({
  people, relationships, photos, memories, events,
  setPeople, setRelationships, setMemories, setEvents
}: {
  people: Person[]; relationships: Relationship[]; photos: Photo[]; memories: Memory[]; events: FamilyEvent[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  setRelationships: React.Dispatch<React.SetStateAction<Relationship[]>>;
  setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  setEvents: React.Dispatch<React.SetStateAction<FamilyEvent[]>>;
}) {
  const [section, setSection] = useState<AdminSection>("dashboard");
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
  ];

  return (
    <div className="page-enter max-w-7xl mx-auto px-6 py-12">
      <div className="ornament mb-8">
        <h1 className="font-serif text-4xl text-brown-dark px-4">Administração</h1>
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
            {SECTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`block w-full text-left px-4 py-3 font-sans text-sm border-b border-beige last:border-0 transition-colors ${section === s.key ? "bg-brown-dark text-cream" : "text-brown-mid hover:bg-parchment"}`}
              >
                {s.label}
              </button>
            ))}
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
                  onSave={(data) => {
                    if (editPerson) {
                      setPeople(prev => prev.map(p => p.id === editPerson.id ? { ...p, ...data } : p));
                    } else {
                      const newId = Math.max(0, ...people.map(p => p.id)) + 1;
                      setPeople(prev => [...prev, { id: newId, ...data }]);
                    }
                    setShowPersonForm(false);
                    setEditPerson(null);
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
        </div>
      </div>
    </div>
  );
}

// ─── Forms ─────────────────────────────────────────────────────────────────

function PersonForm({
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

function RelationshipForm({
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

function MemoryForm({
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

function EventForm({
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

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [people, setPeople] = useState<Person[]>(INIT_PEOPLE);
  const [relationships, setRelationships] = useState<Relationship[]>(INIT_RELATIONSHIPS);
  const [photos] = useState<Photo[]>(INIT_PHOTOS);
  const [memories, setMemories] = useState<Memory[]>(INIT_MEMORIES);
  const [events, setEvents] = useState<FamilyEvent[]>(INIT_EVENTS);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  function navigate(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openPerson(p: Person) {
    setSelectedPerson(p);
  }

  function navigateToPerson(id: number) {
    const p = people.find(x => x.id === id);
    if (p) setSelectedPerson(p);
  }

  return (
    <div className="min-h-full" style={{ backgroundColor: "#F8F1E7" }}>
      <Navbar current={page} onNavigate={navigate} />

      {page === "home" && (
        <HomePage
          people={people} photos={photos} memories={memories} events={events}
          onNavigate={navigate} onOpenPerson={openPerson}
        />
      )}
      {page === "nossa-historia" && <NossaHistoriaPage events={events} people={people} />}
      {page === "pessoas" && <PessoasPage people={people} onOpenPerson={openPerson} />}
      {page === "arvore" && <ArvorePage people={people} relationships={relationships} onOpenPerson={openPerson} />}
      {page === "fotografias" && <FotografiasPage photos={photos} people={people} />}
      {page === "memorias" && <MemoriasPage memories={memories} people={people} />}
      {page === "acontecimentos" && <AcontecimentosPage events={events} people={people} />}
      {page === "admin" && (
        <AdminPage
          people={people} relationships={relationships} photos={photos} memories={memories} events={events}
          setPeople={setPeople} setRelationships={setRelationships}
          setMemories={setMemories} setEvents={setEvents}
        />
      )}

      {selectedPerson && (
        <PersonModal
          person={selectedPerson}
          people={people}
          relationships={relationships}
          photos={photos}
          memories={memories}
          events={events}
          onClose={() => setSelectedPerson(null)}
          onNavigate={navigateToPerson}
        />
      )}
    </div>
  );
}
