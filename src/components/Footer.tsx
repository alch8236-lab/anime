import { Marquee } from './Marquee';
import { scrollToId } from '@/hooks/useLenis';
import { randomQuote } from '@/data/quotes';

/**
 * Футер: бегущая строка, гигантский логотип, якорные ссылки
 * и случайная цитата финала.
 */
export function Footer() {
  const quote = randomQuote();

  return (
    <footer className="relative border-t border-white/10 bg-[#060608]" aria-label="Подвал сайта">
      <Marquee
        duration={26}
        items={['物語は続く', 'SEE YOU, SPACE COWBOY', 'アニメ・アトラス', 'ИСТОРИЯ ПРОДОЛЖАЕТСЯ']}
        className="border-b border-white/10 py-5 text-[12px] uppercase tracking-[0.35em] text-neutral-600"
      />

      <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-4xl font-light leading-tight text-white md:text-5xl">
              ANIME ATLAS
              <span className="text-neon">.</span>
            </p>
            <p className="font-jp mt-2 text-sm tracking-[0.5em] text-neutral-500">
              アニメ・アトラス
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-400">
              Независимый атлас японской анимации: каталог, история, студии, герои и цитаты.
              Собрано вручную, оживлено WebGL и любовью к жанру.
            </p>
          </div>

          <nav aria-label="Разделы">
            <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-neutral-600">Разделы</p>
            <ul className="space-y-3">
              {[
                ['catalog', 'Каталог тайтлов'],
                ['gallery3d', '3D-галерея'],
                ['characters', 'Герои и злодеи'],
                ['timeline', 'Сто лет движения'],
                ['genres', 'Атлас жанров'],
                ['studios', 'Мастерские мира'],
                ['quotes', 'Стена цитат'],
                ['quiz', 'Квиз героя'],
              ].map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToId(id)}
                    className="text-sm text-neutral-400 transition-colors hover:text-neon"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-neutral-600">
              Цитата на выход
            </p>
            <blockquote className="border-l-2 border-volt pl-4">
              <p className="font-display text-xl font-light italic text-white">«{quote.text}»</p>
              <footer className="mt-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                {quote.author} · {quote.anime}
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-[11px] uppercase tracking-[0.25em] text-neutral-600 md:flex-row md:items-center">
          <p>MMXXVI · ANIME ATLAS · Все произведения принадлежат их правообладателям</p>
          <button
            onClick={() => scrollToId('hero')}
            className="group flex items-center gap-2 text-neutral-400 transition-colors hover:text-white"
          >
            Наверх
            <span className="transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
