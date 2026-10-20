import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/SectionHeading';
import { GenerativePoster } from '@/components/GenerativePoster';
import { ASSET_POSTERS, animes, genreCounts, decades } from '@/data/animes';
import type { Anime } from '@/types';

gsap.registerPlugin(ScrollTrigger);

type SortMode = 'rating' | 'year' | 'popularity';

/* ------------------------------------------------------------------ */
/* Карточка тайтла                                                     */
/* ------------------------------------------------------------------ */
function AnimeCard({ anime, index }: { anime: Anime; index: number }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: (index % 4) * 0.06,
          scrollTrigger: { trigger: el, start: 'top 92%' },
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="group relative flex flex-col border border-white/10 bg-[#0a0a0d] transition-colors duration-300 hover:border-white/25"
      data-cursor="hover"
    >
      {/* Обложка */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="relative block aspect-[3/4] w-full overflow-hidden text-left"
      >
        {anime.poster ? (
          <img
            src={ASSET_POSTERS[anime.poster]}
            alt={`Арт: ${anime.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <GenerativePoster
            color={anime.color}
            seed={anime.id}
            title={anime.title}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.045]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent opacity-80" />

        {/* Рейтинг */}
        <div className="absolute right-3 top-3 border border-white/20 bg-[#060608]/80 px-2.5 py-1 font-display text-lg text-white backdrop-blur-sm">
          {anime.rating.toFixed(1)}
        </div>

        {/* Жанры */}
        <div className="absolute left-3 top-3 flex max-w-[70%] flex-wrap gap-1.5">
          {anime.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="border border-white/15 bg-[#060608]/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-neutral-300 backdrop-blur-sm"
            >
              {g}
            </span>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-2xl font-light leading-tight text-white">
            {anime.title}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            {anime.studio} · {anime.year}
          </p>
        </div>
      </button>

      {/* Подпись под обложкой */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <p className="text-sm italic leading-snug text-neutral-400">«{anime.tagline}»</p>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-neutral-500">
          <span>
            {anime.kind} · {anime.episodes === 1 ? 'фильм' : `${anime.episodes} эп.`}
          </span>
          <span className={anime.status === 'Онгоинг' ? 'text-volt' : ''}>{anime.status}</span>
        </div>
      </div>

      {/* Развёрнутый синопсис */}
      {open && (
        <div className="border-t border-white/10 p-4">
          <p className="text-sm leading-relaxed text-neutral-300">{anime.synopsis}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {anime.genres.map((g) => (
              <span
                key={g}
                className="border border-white/15 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400"
              >
                {g}
              </span>
            ))}
          </div>
          <p className="font-jp mt-3 text-xs text-neutral-500">{anime.original}</p>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Каталог с фильтрами                                                 */
/* ------------------------------------------------------------------ */
const PAGE_SIZE = 24;

export function Catalog() {
  const [genre, setGenre] = useState<string>('all');
  const [decade, setDecade] = useState<number | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('rating');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE_SIZE);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = [...animes];
    if (genre !== 'all') list = list.filter((a) => a.genres.includes(genre));
    if (decade !== 'all') list = list.filter((a) => Math.floor(a.year / 10) * 10 === decade);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.studio.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q)),
      );
    }
    switch (sort) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'year':
        list.sort((a, b) => b.year - a.year);
        break;
      case 'popularity':
        list.sort((a, b) => b.popularity - a.popularity);
        break;
    }
    return list;
  }, [genre, decade, sort, query]);

  useEffect(() => {
    setShown(PAGE_SIZE);
  }, [genre, decade, sort, query]);

  const visible = filtered.slice(0, shown);

  return (
    <section id="catalog" className="relative bg-[#060608] py-28 md:py-36" aria-label="Каталог аниме">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          index="01"
          jp="目録"
          title="Каталог тайтлов"
          lead="Более сотни ключевых работ японской анимации: от «Акиры» до «Дандадана». Фильтруйте по жанру, десятилетию и названию — и открывайте карточки за карточкой."
        />

        {/* Панель фильтров */}
        <div className="mb-10 space-y-5 border border-white/10 bg-[#0a0a0d]/70 p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Поиск */}
            <label className="relative block w-full max-w-sm">
              <span className="sr-only">Поиск по названию, студии или жанру</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск: название, студия, жанр…"
                className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-neon focus:outline-none"
              />
            </label>

            {/* Сортировка */}
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Сортировка">
              {(
                [
                  ['rating', 'По рейтингу'],
                  ['year', 'По году'],
                  ['popularity', 'По популярности'],
                ] as [SortMode, string][]
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => setSort(mode)}
                  aria-pressed={sort === mode}
                  className={`border px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                    sort === mode
                      ? 'border-neon bg-neon text-[#060608]'
                      : 'border-white/15 text-neutral-400 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Жанры */}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Фильтр по жанру">
            <button
              onClick={() => setGenre('all')}
              aria-pressed={genre === 'all'}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                genre === 'all'
                  ? 'bg-white text-[#060608]'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              Все жанры
            </button>
            {genreCounts.slice(0, 14).map((g) => (
              <button
                key={g.name}
                onClick={() => setGenre(g.name)}
                aria-pressed={genre === g.name}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  genre === g.name
                    ? 'bg-neon text-[#060608]'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {g.name} <span className="opacity-60">{g.count}</span>
              </button>
            ))}
          </div>

          {/* Десятилетия */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Фильтр по десятилетию">
            <span className="mr-2 text-[10px] uppercase tracking-[0.25em] text-neutral-600">
              Эпоха:
            </span>
            <button
              onClick={() => setDecade('all')}
              aria-pressed={decade === 'all'}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                decade === 'all' ? 'bg-white text-[#060608]' : 'text-neutral-500 hover:text-white'
              }`}
            >
              Все
            </button>
            {decades.map((d) => (
              <button
                key={d}
                onClick={() => setDecade(d)}
                aria-pressed={decade === d}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  decade === d ? 'bg-volt text-[#060608]' : 'text-neutral-500 hover:text-white'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Счётчик результата */}
        <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-neutral-500" aria-live="polite">
          Найдено: <span className="text-white">{filtered.length}</span> тайтлов
        </p>

        {/* Сетка */}
        {visible.length > 0 ? (
          <div ref={listRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((a, i) => (
              <AnimeCard key={a.id} anime={a} index={i} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 p-14 text-center">
            <p className="font-display text-3xl font-light text-neutral-400">
              Ничего не найдено
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              Попробуйте сбросить фильтры или изменить запрос.
            </p>
            <button
              onClick={() => {
                setGenre('all');
                setDecade('all');
                setQuery('');
              }}
              className="mt-6 border border-white/25 px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-white transition-colors hover:border-neon hover:text-neon"
            >
              Сбросить фильтры
            </button>
          </div>
        )}

        {/* Кнопка «ещё» */}
        {shown < filtered.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShown((s) => s + PAGE_SIZE)}
              className="group relative overflow-hidden border border-white/25 px-10 py-4 text-[12px] uppercase tracking-[0.3em] text-white transition-colors hover:text-[#060608]"
            >
              <span className="absolute inset-0 -translate-y-full bg-volt transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">
                Показать ещё ({filtered.length - shown} осталось)
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
