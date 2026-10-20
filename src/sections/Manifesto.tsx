import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Marquee } from '@/components/Marquee';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO_LINES = [
  'Аниме — это не жанр.',
  'Это грамматика визуального рассказа,',
  'выкованная в Японии сто лет подряд',
  'и выученная сейчас всем миром.',
];

/**
 * Манифест: огромный текст, раскрывающийся пословно при скролле,
 * с бегущей строкой-разделителем сверху и снизу.
 */
export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-manifest-line]').forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0.12 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: line,
              start: 'top 82%',
              end: 'top 42%',
              scrub: true,
            },
          },
        );
      });
      gsap.fromTo(
        '[data-manifest-img]',
        { yPercent: 12 },
        {
          yPercent: -12,
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifest" ref={rootRef} className="relative bg-[#060608] py-28 md:py-40" aria-label="Манифест">
      <Marquee
        duration={30}
        items={['物語', 'ANIME', 'アニメーション', 'ATLAS', '日本', 'ИСТОРИЯ']}
        className="border-b border-white/10 pb-5 text-[12px] uppercase tracking-[0.35em] text-neutral-600"
      />

      <div className="mx-auto mt-20 grid max-w-[1500px] gap-14 px-6 md:grid-cols-[1fr_380px] md:px-12">
        <div>
          <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-volt">Манифест — 宣言</p>
          {MANIFESTO_LINES.map((line, i) => (
            <p
              key={i}
              data-manifest-line
              className={`font-display text-[9vw] font-light leading-[1.05] md:text-6xl ${
                i === MANIFESTO_LINES.length - 1 ? 'text-white' : 'text-neutral-300'
              }`}
            >
              {line}
            </p>
          ))}
          <p className="mt-10 max-w-xl text-base leading-relaxed text-neutral-400">
            Каждая секция этого атласа — отдельная глава: каталог тайтлов, 3D-галерея жанров,
            портреты героев, хронология от 1917 года до сегодня, картотека студий и стена цитат,
            ставших языком фандома. Листайте — история продолжается.
          </p>
        </div>

        <div className="relative min-h-[420px] overflow-hidden border border-white/10">
          <img
            data-manifest-img
            src="/anime/assets/street-vertical.png"
            alt="Аниме-арт: ночная японская улочка с фонарями"
            className="absolute inset-0 h-[124%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent" />
          <div className="writing-vertical absolute bottom-6 right-5 font-jp text-sm tracking-[0.5em] text-white/80">
            夜の路地
          </div>
        </div>
      </div>

      <Marquee
        duration={34}
        items={['СТО ЛЕТ АНИМАЦИИ', '百周年', '1917 → 2026', 'FROM JAPAN TO THE WORLD']}
        className="mt-24 border-t border-white/10 pt-5 text-[12px] uppercase tracking-[0.35em] text-neutral-600"
      />
    </section>
  );
}
