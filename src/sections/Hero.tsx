import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { HeroScene } from '@/three/HeroScene';
import { Marquee } from '@/components/Marquee';
import { StarIcon } from '@/components/StarIcon';
import { catalogStats } from '@/data/animes';
import { scrollToId } from '@/hooks/useLenis';

/* ------------------------------------------------------------------ */
/* Плавающий арт, рождающийся по клику                                */
/* ------------------------------------------------------------------ */
interface FloatingArt {
  id: number;
  x: number;
  y: number;
  rot: number;
  src: string;
  w: number;
  kind: 'char' | 'poster';
}

const CHAR_POOL = [
  '/assets/char-sword.png',
  '/assets/char-pilot.png',
  '/assets/char-witch.png',
  '/assets/char-mascot.png',
  '/assets/char-idol.png',
];

const POSTER_POOL = [
  '/assets/poster-cyber.png',
  '/assets/poster-fantasy.png',
  '/assets/poster-slice.png',
  '/assets/poster-mecha.png',
  '/assets/poster-dark.png',
  '/assets/poster-sport.png',
];

let artCounter = 0;

/**
 * Hero: чёрный вуаль, гигантская типографика, WebGL-сцена с меха-бюстом.
 * Клик в любое место рождает плавающий арт с физикой дрейфа.
 */
export function Hero() {
  const [arts, setArts] = useState<FloatingArt[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Появление заголовка после лоадера
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-line]',
        { yPercent: 115, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 1.2, ease: 'power4.out', stagger: 0.12, delay: 0.15 },
      );
      gsap.fromTo(
        '[data-hero-fade]',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.1, delay: 0.7 },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const spawnArt = useCallback(
    (e: React.MouseEvent) => {
      if (reduced) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const kind: FloatingArt['kind'] = Math.random() > 0.55 ? 'char' : 'poster';
      const pool = kind === 'char' ? CHAR_POOL : POSTER_POOL;
      const art: FloatingArt = {
        id: artCounter++,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        rot: (Math.random() - 0.5) * 22,
        src: pool[Math.floor(Math.random() * pool.length)],
        w: kind === 'char' ? 110 + Math.random() * 80 : 74 + Math.random() * 50,
        kind,
      };
      setArts((prev) => [...prev.slice(-11), art]);
      window.setTimeout(() => {
        setArts((prev) => prev.filter((a) => a.id !== art.id));
      }, 7500);
    },
    [reduced],
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      onClick={spawnArt}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
      aria-label="Главный экран"
    >
      <HeroScene />

      {/* Плавающие арты */}
      <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
        {arts.map((a) => (
          <img
            key={a.id}
            src={a.src}
            alt=""
            className="animate-float-drift absolute opacity-90 drop-shadow-[0_18px_32px_rgba(0,0,0,0.65)]"
            style={{
              left: a.x - a.w / 2,
              top: a.y - (a.kind === 'char' ? a.w * 1.4 : a.w * 1.4) / 2,
              width: a.w,
              height: a.kind === 'char' ? a.w * 1.4 : a.w * 1.4,
              objectFit: a.kind === 'char' ? 'contain' : 'cover',
              ['--rot' as string]: `${a.rot}deg`,
              ['--drift-duration' as string]: `${7 + Math.random() * 4}s`,
              ['--dx1' as string]: `${(Math.random() - 0.5) * 60}px`,
              ['--dy1' as string]: `${-20 - Math.random() * 30}px`,
              ['--dx2' as string]: `${(Math.random() - 0.5) * 50}px`,
              ['--dy2' as string]: `${(Math.random() - 0.5) * 40}px`,
              ['--dx3' as string]: `${(Math.random() - 0.5) * 40}px`,
              ['--dy3' as string]: `${20 + Math.random() * 30}px`,
            }}
          />
        ))}
      </div>

      {/* Вертикальные японские надписи по краям */}
      <div
        data-hero-fade
        className="writing-vertical absolute right-6 top-1/2 z-[4] hidden -translate-y-1/2 font-jp text-sm tracking-[0.6em] text-neutral-600 lg:block"
        aria-hidden="true"
      >
        日本のアニメーション
      </div>
      <div
        data-hero-fade
        className="writing-vertical absolute left-6 top-1/2 z-[4] hidden -translate-y-1/2 font-jp text-sm tracking-[0.6em] text-neutral-600 lg:block"
        aria-hidden="true"
      >
        物語は続く
      </div>

      {/* Центральная типографика */}
      <div className="relative z-[6] mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-6 pt-24 md:px-12">
        <p data-hero-fade className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-neutral-400">
          <StarIcon className="text-volt" />
          Атлас японской анимации
          <span className="font-jp tracking-[0.5em]">アニメ</span>
        </p>

        <h1
          ref={titleRef}
          className="font-display font-light leading-[0.9] text-white"
          aria-label="Anime Atlas"
        >
          <span className="reveal-mask block">
            <span data-hero-line className="block text-[16.5vw] will-change-transform md:text-[11rem]">
              ANIME
            </span>
          </span>
          <span className="reveal-mask block">
            <span
              data-hero-line
              className="block text-[16.5vw] will-change-transform md:ml-[9rem] md:text-[11rem]"
            >
              ATLAS<span className="text-neon">.</span>
            </span>
          </span>
        </h1>

        <div data-hero-fade className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base leading-relaxed text-neutral-300 md:text-lg">
            От первых короткометражек 1917 года до блокбастеров, которые собирают мировые
            кинотеатры. Каталог, история, студии, герои и цитаты — в одном чёрном пространстве.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                scrollToId('catalog');
              }}
              className="group relative overflow-hidden border border-white/30 px-8 py-4 text-[12px] uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:text-[#060608]"
            >
              <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative">Открыть каталог</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                scrollToId('gallery3d');
              }}
              className="px-2 py-4 text-[12px] uppercase tracking-[0.3em] text-neutral-400 transition-colors hover:text-volt"
            >
              3D-галерея →
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div
          data-hero-fade
          className="mt-14 grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4"
        >
          {[
            { v: String(catalogStats.titles), l: 'тайтлов в атласе' },
            { v: `${catalogStats.episodes.toLocaleString('ru-RU')}+`, l: 'эпизодов учтено' },
            { v: String(catalogStats.studios), l: 'студий в картотеке' },
            { v: catalogStats.avgRating, l: 'средняя оценка атласа' },
          ].map((s) => (
            <div key={s.l} className="bg-[#07070a]/90 px-5 py-4">
              <div className="font-display text-3xl font-light text-white">{s.v}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Бегущая строка-приглашение */}
      <div className="relative z-[6] mt-10 border-t border-white/10 py-4">
        <Marquee
          duration={24}
          items={[
            'Кликните в любое место',
            '物語は続く',
            'Собрано с любовью к аниме',
            'アニメ・アトラス',
            'Клик рождает арт',
            'История японской анимации',
          ]}
          className="text-[13px] uppercase tracking-[0.3em] text-neutral-500"
        />
      </div>
    </section>
  );
}
