/**
 * BrandTile — logo-style tile with the brand's initial.
 * Drawn in code (no external logos), pink family only; the shade varies
 * deterministically by brand name so the same brand always looks the same.
 */
const SHADES = [
  "from-pink-400 via-brand-500 to-rose-500",
  "from-rose-400 via-rose-500 to-pink-600",
  "from-fuchsia-400 via-pink-500 to-rose-500",
  "from-pink-500 via-rose-500 to-rose-600",
  "from-brand-400 via-pink-500 to-fuchsia-500",
];

export default function BrandTile({
  brand,
  size = "md",
  className = "",
}: {
  brand: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  let hash = 0;
  for (let i = 0; i < brand.length; i++) hash = (hash * 31 + brand.charCodeAt(i)) % 997;
  const shade = SHADES[hash % SHADES.length];
  const sizes = {
    sm: "h-9 w-9 rounded-xl text-sm",
    md: "h-12 w-12 rounded-2xl text-lg",
    lg: "h-16 w-16 rounded-2xl text-2xl",
    xl: "h-20 w-20 rounded-3xl text-3xl md:h-24 md:w-24 md:text-4xl",
  } as const;
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br font-display font-extrabold text-white shadow-glow ${shade} ${sizes[size]} ${className}`}
    >
      {brand.charAt(0).toUpperCase()}
    </span>
  );
}
