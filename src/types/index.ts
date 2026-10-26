export type Page = "home" | "nossa-historia" | "pessoas" | "arvore" | "fotografias" | "memorias" | "acontecimentos" | "admin";
export type AdminSection = "dashboard" | "pessoas" | "relacionamentos" | "memorias" | "eventos";

export interface Person {
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

export interface Relationship {
  id: number;
  personId: number;
  relatedPersonId: number;
  type: string;
}

export interface Photo {
  id: number;
  title: string;
  description?: string;
  photoUrl: string;
  date?: string;
  location?: string;
  albumId?: number;
  personIds: number[];
}

export interface Memory {
  id: number;
  title: string;
  content: string;
  date?: string;
  location?: string;
  author?: string;
  personIds: number[];
}

export interface FamilyEvent {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  personIds: number[];
}
