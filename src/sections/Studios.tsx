import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/SectionHeading';
import { studios, industryFacts } from '@/data/studios';

gsap.registerPlugin(ScrollTrigger);

/**
 * Картотека студий: карточки с историей, основателями и знаковыми работами.
 * Активная карточка подсвечивается акцентным цветом студии.
 */
export function Studios() {
  const [active, setActive] = useState<string>('ghibli');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-studio-row]').forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: -26 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: { trigger: row, start: 'top 92%' },
          },
        );
      });
    }, list);
    return () => ctx.revert();
  }, []);

  const activeStudio = studios.find((s) => s.id === active) ?? studios[0];

  return (
    <section id="studios" className="relative bg-[#08080b] py-28 md:py-36" aria-label="Картотека студий">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          index="06"
          jp="画室"
          title="Мастерские мира"
          lead="Двадцать студий, сформировавших язык анимации: от вечного Toei до свободной Science SARU. Выберите карточку — справа раскроется её профиль."
          accent="volt"
        />

        {/* Факты индустрии */}
        <div className="mb-16 grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
          {industryFacts.map((f) => (
            <div key={f.label} className="bg-[#08080b] px-5 py-6">
              <div className="font-display text-3xl font-light text-white md:text-4xl">{f.value}</div>
              <div className="mt-2 text-[10px] uppercase leading-relaxed tracking-[0.22em] text-neutral-500">
                {f.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Список студий */}
          <div ref={listRef} className="border-t border-white/10">
            {studios.map((s) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  data-studio-row
                  onClick={() => setActive(s.id)}
                  aria-pressed={isActive}
                  className={`group flex w-full items-baseline justify-between gap-6 border-b border-white/10 py-5 text-left transition-colors ${
                    isActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                  }`}
                  data-cursor="hover"
                >
                  <div className="flex items-baseline gap-5 pl-2 md:gap-8">
                    <span className="font-display text-sm text-neutral-600">
                      {s.founded}
                    </span>
                    <span
                      className={`font-display text-2xl font-light transition-colors md:text-4xl ${
                        isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'
                      }`}
                    >
                      {s.name}
                    </span>
                  </div>
                  <span className="shrink-0 pr-2 text-[10px] uppercase tracking-[0.25em] text-neutral-600">
                    {s.city.split('(')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Профиль активной студии */}
          <aside
            key={activeStudio.id}
            className="h-max border border-white/15 bg-[#0a0a0d] p-7 lg:sticky lg:top-24"
            aria-label={`Профиль студии ${activeStudio.name}`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-4xl font-light text-white">{activeStudio.name}</h3>
              <span
                className="font-display text-2xl"
                style={{ color: `hsl(${activeStudio.color})` }}
                aria-hidden="true"
              >
                *
              </span>
            </div>
            <dl className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Основана</dt>
                <dd className="text-white">{activeStudio.founded}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Город</dt>
                <dd className="text-right text-white">{activeStudio.city}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Основатели</dt>
                <dd className="text-right text-white">{activeStudio.founders}</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-neutral-300">{activeStudio.description}</p>
            <p className="mt-4 border-l-2 pl-3 text-sm leading-relaxed text-neutral-400" style={{ borderColor: `hsl(${activeStudio.color})` }}>
              {activeStudio.style}
            </p>
            <div className="mt-6">
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                Знаковые работы
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeStudio.famous.map((f) => (
                  <span key={f} className="border border-white/15 px-2.5 py-1 text-[11px] text-neutral-300">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
