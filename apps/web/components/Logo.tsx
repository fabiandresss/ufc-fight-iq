/** Logo de marca para el proyecto (diseño propio inspirado en el estilo UFC; no es el logotipo oficial). */
export default function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 190 56" className={className} role="img" aria-label="UFC Fight IQ">
      <rect width="92" height="56" fill="#d20a0a" />
      <text x="46" y="42" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="40" fill="#fff" letterSpacing="1">
        UFC
      </text>
      <text x="102" y="30" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="26" fill="#fff" letterSpacing="1">
        FIGHT
      </text>
      <text x="102" y="52" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="22" fill="#d20a0a" letterSpacing="6">
        IQ
      </text>
    </svg>
  );
}
