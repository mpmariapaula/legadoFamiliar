import { useState } from "react";
import type { Page } from "@/src/types";

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

export function Navbar({ current, onNavigate }: { current: Page; onNavigate: (p: Page) => void }) {
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
