import { useEffect, useState } from 'react';
import { scrollToId } from '@/hooks/useLenis';

interface NavItem {
  id: string;
  label: string;
  jp: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'catalog', label: 'Каталог', jp: '目録' },
  { id: 'gallery3d', label: 'Галерея', jp: '画廊' },
  { id: 'characters', label: 'Герои', jp: '英雄' },
  { id: 'timeline', label: 'История', jp: '歴史' },
  { id: 'genres', label: 'Жанры', jp: 'genre' },
  { id: 'studios', label: 'Студии', jp: '画室' },
  { id: 'quotes', label: 'Цитаты', jp: '言葉' },
  { id: 'quiz', label: 'Квиз', jp: '試験' },
];

/**
 * Навигация: прячется при скролле вниз, возвращается при скролле вверх.
 * На мобильных — компактная нижняя панель якорей.
 */
export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY && y > 320 && !menuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      {/* Десктоп-навигация */}
      <header
        className={`fixed inset-x-0 top-0 z-50 hidden transition-all duration-300 md:block ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'bg-[#060608]/85 backdrop-blur-md' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-4">
          <button
            onClick={() => go('hero')}
            className="group flex items-baseline gap-3"
            aria-label="Наверх, к началу"
          >
            <span className="font-display text-xl font-medium tracking-wide text-white">
              ANIME ATLAS
            </span>
            <span className="font-jp text-xs tracking-[0.4em] text-neutral-500 transition-colors group-hover:text-volt">
              アトラス
            </span>
          </button>

          <nav className="flex items-center gap-7" aria-label="Основная навигация">
            {NAV_ITEMS.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="group relative text-[11px] uppercase tracking-[0.28em] text-neutral-400 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-neon transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <button
              onClick={() => go('quiz')}
              className="border border-white/25 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white transition-all hover:border-neon hover:bg-neon hover:text-[#060608]"
            >
              Квиз
            </button>
          </nav>
        </div>
      </header>

      {/* Мобильная навигация */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 md:hidden ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled || menuOpen ? 'bg-[#060608]/90 backdrop-blur-md' : 'bg-transparent'}`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={() => go('hero')}
            className="font-display text-lg font-medium tracking-wide text-white"
          >
            ANIME ATLAS
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-white/20"
          >
            <span
              className={`h-px w-5 bg-white transition-transform duration-300 ${
                menuOpen ? 'translate-y-[3.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-5 bg-white transition-transform duration-300 ${
                menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>

        {menuOpen && (
          <nav
            className="border-t border-white/10 px-5 pb-6 pt-2"
            aria-label="Мобильная навигация"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="flex w-full items-baseline justify-between border-b border-white/5 py-3.5 text-left"
              >
                <span className="text-sm uppercase tracking-[0.25em] text-white">{item.label}</span>
                <span className="font-jp text-xs text-neutral-500">{item.jp}</span>
              </button>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
