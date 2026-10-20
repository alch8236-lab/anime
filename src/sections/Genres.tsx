import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/SectionHeading';
import { StarIcon } from '@/components/StarIcon';
import { genres } from '@/data/genres';

gsap.registerPlugin(ScrollTrigger);

/**
 * Атлас жанров: сетка карточек с японскими названиями.
 * Карточка раскрывается по клику: описание, настроение и входные тайтлы.
 */
export function Genres() {
  const [open, setOpen] = useState<string | null>('shonen');
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-genre-card]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: (i % 3) * 0.07,
            scrollTrigger: { trigger: card, start: 'top 94%' },
          },
        );
      });
    }, grid);
    return () => ctx.revert();
  }, []);

  return (
    <section id="genres" className="relative bg-[#060608] py-28 md:py-36" aria-label="Атлас жанров">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          index="05"
          jp="ジャンル"
          title="Атлас жанров"
          lead="Двадцать шесть грамматик рассказа: от сёнэн-адреналина до иёсикэй-тишины. Каждая карточка — настроение, описание и три тайтла для первого погружения."
        />

        <div ref={gridRef} className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">
          {genres.map((g) => {
            const isOpen = open === g.id;
            return (
              <button
                key={g.id}
                data-genre-card
                onClick={() => setOpen(isOpen ? null : g.id)}
                aria-expanded={isOpen}
                className={`group relative bg-[#07070a] p-7 text-left transition-colors duration-300 ${
                  isOpen ? 'bg-[#0c0c10]' : 'hover:bg-[#0a0a0e]'
                }`}
                data-cursor="hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-jp text-2xl text-white/25 transition-colors group-hover:text-neon">
                      {g.jp}
                    </span>
                    <h3 className="font-display mt-3 text-3xl font-light text-white">{g.name}</h3>
                  </div>
                  <span
                    className={`mt-1 text-neutral-500 transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-neon' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <StarIcon size={14} />
                  </span>
                </div>

                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-volt">{g.mood}</p>

                {isOpen ? (
                  <div className="mt-5">
                    <p className="text-sm leading-relaxed text-neutral-300">{g.description}</p>
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                        Начните с:
                      </p>
                      <ul className="space-y-1.5">
                        {g.starter.map((s) => (
                          <li key={s} className="flex items-center gap-2 text-sm text-neutral-200">
                            <span className="h-1 w-1 bg-neon" aria-hidden="true" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                    {g.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
