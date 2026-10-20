import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/SectionHeading';
import { MonogramAvatar } from '@/components/GenerativePoster';
import { characters } from '@/data/characters';
import type { Character } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const ROLE_COLOR: Record<Character['role'], string> = {
  Протагонист: 'text-neon border-neon/50',
  Антагонист: 'text-volt border-volt/50',
  Дейтерагонист: 'text-white border-white/40',
  'Со второго плана': 'text-neutral-300 border-white/20',
};

/* ------------------------------------------------------------------ */
/* Развёрнутая карточка героя                                          */
/* ------------------------------------------------------------------ */
function CharacterPanel({ character, onClose }: { character: Character; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-label={`Профиль: ${character.name}`}
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-white/15 bg-[#0a0a0d]/95 backdrop-blur-lg md:left-auto md:right-8 md:top-1/2 md:bottom-auto md:w-[420px] md:-translate-y-1/2 md:border md:p-0"
    >
      <div className="max-h-[70vh] overflow-y-auto p-6 md:max-h-[80vh] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-jp text-xs tracking-[0.4em] text-neutral-500">{character.original}</p>
            <h3 className="font-display mt-2 text-4xl font-light text-white">{character.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть профиль"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 text-neutral-400 transition-colors hover:border-neon hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className={`border px-3 py-1 text-[10px] uppercase tracking-[0.25em] ${ROLE_COLOR[character.role]}`}>
            {character.role}
          </span>
          <span className="border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            {character.archetype}
          </span>
          <span className="border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            {character.anime}
          </span>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-neutral-300">{character.description}</p>

        <div className="mt-6">
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-neutral-500">Черты</p>
          <div className="flex flex-wrap gap-1.5">
            {character.traits.map((t) => (
              <span key={t} className="bg-white/5 px-2.5 py-1 text-[11px] text-neutral-300">
                {t}
              </span>
            ))}
          </div>
        </div>

        <blockquote className="mt-7 border-l-2 border-neon pl-4">
          <p className="font-display text-xl font-light italic text-white">«{character.quote}»</p>
        </blockquote>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Секция героев                                                       */
/* ------------------------------------------------------------------ */
export function Characters() {
  const [active, setActive] = useState<Character | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Горизонтальная прокрутка галереи, привязанная к вертикальному скроллу
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      if (reduced) return;
      const amount = track.scrollWidth - window.innerWidth + 96;
      if (amount <= 0) return;
      const tween = gsap.to(track, {
        x: -amount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${amount}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="characters" ref={sectionRef} className="relative overflow-hidden bg-[#060608] py-28 md:py-0" aria-label="Галерея персонажей">
      <div className="mx-auto max-w-[1500px] px-6 pt-0 md:px-12 md:pt-28">
        <SectionHeading
          index="03"
          jp="英雄"
          title="Герои и злодеи"
          lead="От Спайка до Фрирен: сорок с лишним портретов, каждый — с архетипом, чертами характера и фирменной репликой. Нажмите на карточку, чтобы раскрыть досье."
        />
      </div>

      <div className="pb-16 md:pb-28">
        <div
          ref={trackRef}
          className="flex w-max gap-4 px-6 md:px-12"
        >
          {characters.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className="group relative flex w-[270px] shrink-0 flex-col border border-white/10 bg-[#0a0a0d] p-5 text-left transition-colors duration-300 hover:border-white/30 md:w-[300px]"
              data-cursor="hover"
              aria-label={`Открыть профиль: ${c.name}`}
            >
              <div className="mb-5 flex items-center justify-between">
                <MonogramAvatar name={c.name} color={c.color} size={64} />
                <span className="font-display text-4xl font-light text-white/10 transition-colors group-hover:text-white/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display text-2xl font-light leading-tight text-white">
                {c.name}
              </h3>
              <p className="font-jp mt-1 text-[11px] tracking-[0.25em] text-neutral-500">
                {c.original}
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                {c.anime}
              </p>
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-neutral-400">
                {c.description}
              </p>
              <span
                className={`mt-5 inline-block w-max border px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] ${ROLE_COLOR[c.role]}`}
              >
                {c.role}
              </span>
            </button>
          ))}

          {/* Финальная карточка-заглушка */}
          <div className="flex w-[270px] shrink-0 flex-col items-start justify-center border border-dashed border-white/15 p-8 md:w-[300px]">
            <p className="font-display text-3xl font-light text-neutral-500">И ещё тысячи…</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              В атласе — самые обсуждаемые герои эпохи. Полный пантеон — в квизе ниже.
            </p>
          </div>
        </div>
      </div>

      {active && <CharacterPanel character={active} onClose={() => setActive(null)} />}
    </section>
  );
}
