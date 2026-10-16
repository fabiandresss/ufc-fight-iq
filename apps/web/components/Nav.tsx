"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/predictor/", label: "Fight Predictor" },
  { href: "/fighters/", label: "Fighters" },
  { href: "/models/", label: "Modelos" },
  { href: "/analyst/", label: "AI Analyst" },
  { href: "/events/", label: "Eventos" },
];

export default function Nav() {
  const path = usePathname() || "/";
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href.replace(/\/$/, "")));
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <span className="text-lg font-bold tracking-tight">
          UFC <span className="text-accent">Fight IQ</span>
        </span>
        <nav aria-label="Principal" className="flex flex-wrap gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active(l.href) ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 ${active(l.href) ? "bg-line text-white" : "text-slate-400 hover:text-white"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="bg-accent/10 py-1 text-center text-xs text-accent">
        Datos MOCK ficticios: ninguna cifra, peleador o predicción es real. No es consejo de apuestas.
      </div>
    </header>
  );
}
