"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/fighters/", label: "Peleadores" },
  { href: "/fights/", label: "Peleas" },
  { href: "/events/", label: "Eventos" },
  { href: "/predictor/", label: "Predictor" },
  { href: "/analyst/", label: "IA" },
  { href: "/models/", label: "Modelos" },
];

export default function Nav() {
  const path = (usePathname() || "/").replace(/\/$/, "") || "/";
  const active = (h: string) => {
    const t = h.replace(/\/$/, "") || "/";
    if (t === "/") return path === "/";
    const singular = t.replace(/s$/, "");
    return path === t || path === singular;
  };
  return (
    <header className="sticky top-0 z-20 border-b-2 border-ufc bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3">
        <Link href="/" aria-label="UFC Fight IQ - inicio"><Logo /></Link>
        <nav aria-label="Principal" className="flex flex-wrap gap-1 text-sm font-bold uppercase tracking-wide">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}
              className={`px-3 py-1.5 ${active(l.href) ? "bg-ufc text-white" : "text-zinc-300 hover:text-white"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
