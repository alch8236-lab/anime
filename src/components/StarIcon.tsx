interface StarIconProps {
  className?: string;
  color?: string;
  size?: number;
}

/** Маленькая SVG-звезда-разделитель в духе аниме-типографики. */
export function StarIcon({ className = '', color = 'currentColor', size = 9 }: StarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" />
    </svg>
  );
}

/** Декоративная сакура-конфетти SVG (лепесток). */
export function PetalIcon({ className = '', size = 12 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path
        d="M6 0 C9 2 11 5 10 8 C9 10.5 7 12 6 12 C5 12 3 10.5 2 8 C1 5 3 2 6 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}
