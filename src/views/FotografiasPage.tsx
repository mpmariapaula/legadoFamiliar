"use client";

import { useState } from "react";
import type { Person, Photo } from "@/src/types";
import { formatDate, formatYear } from "@/src/utils/date";

export function FotografiasPage({ photos, people }: { photos: Photo[]; people: Person[] }) {
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
