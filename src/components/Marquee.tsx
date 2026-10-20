import type { ReactNode } from 'react';
import { StarIcon } from './StarIcon';

interface MarqueeProps {
  items: string[];
  className?: string;
  duration?: number;
  separator?: ReactNode;
  /** Скрыть визуально, но оставить для скринридеров — нет; полностью декоративный. */
  ariaHidden?: boolean;
}

/**
 * Бесконечная бегущая строка. Дублирует контент в два ряда и сдвигает
 * на половину ширины — бесшовный цикл.
 */
export function Marquee({ items, className = '', duration = 28, separator, ariaHidden = true }: MarqueeProps) {
  const sep = separator ?? <StarIcon className="mx-6 shrink-0 text-neutral-600" />;
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center whitespace-nowrap">
          <span>{item}</span>
          {sep}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex w-max will-change-transform"
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
