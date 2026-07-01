"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Radio, Search, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredFavorites } from "@/components/FavoriteButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live" },
  { href: "/sports", label: "Sports" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [favorites, setFavorites] = useState(0);

  useEffect(() => {
    const sync = () => setFavorites(getStoredFavorites().length);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("muhenga-favorites-change", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("muhenga-favorites-change", sync as EventListener);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/65 backdrop-blur-2xl">
      <nav className="section-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#00C853] text-black shadow-[0_0_30px_rgba(0,200,83,0.35)]">
            <Trophy className="h-5 w-5" />
          </span>
          <span className="truncate text-base font-black uppercase tracking-tight sm:text-lg">Muhenga Sport</span>
        </Link>

        <div className="hidden items-center rounded-[8px] border border-white/10 bg-white/5 p-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[6px] px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
                  active ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/live"
            className="hidden h-10 items-center gap-2 rounded-[8px] border border-red-500/20 bg-red-500/10 px-3 text-xs font-black uppercase tracking-wide text-red-200 sm:flex"
          >
            <Radio className="h-4 w-4" />
            Live
          </Link>
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/5 text-white/70 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/favorites"
            aria-label="Favorites"
            className="relative flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/5 text-white/70 hover:text-white"
          >
            <Heart className="h-4 w-4" />
            {favorites > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#00C853] px-1 text-[10px] font-black text-black">
                {favorites}
              </span>
            )}
          </Link>
        </div>
      </nav>
      <div className="section-shell flex gap-2 overflow-x-auto pb-3 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase ${
              pathname === link.href ? "border-[#00C853] bg-[#00C853] text-black" : "border-white/10 bg-white/5 text-white/70"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
