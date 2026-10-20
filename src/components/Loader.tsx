import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  /** Вызывается, когда счётчик достиг 100 и анимация прощания завершена. */
  onDone: () => void;
}

/**
 * Прелоадер: чёрный экран, гигантский счётчик с плавным ходом
 * и исчезновение снизу вверх.
 */
export function Loader({ onDone }: LoaderProps) {
  const [count, setCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: 100,
      duration: 1.9,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(state.v)),
      onComplete: () => {
        const el = rootRef.current;
        if (!el) {
          onDone();
          return;
        }
        gsap.to(el, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power3.inOut',
          delay: 0.25,
          onComplete: onDone,
        });
      },
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const digits = String(count).padStart(3, '0').split('');

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[70] flex flex-col justify-between bg-[#060608] px-6 py-8 md:px-12"
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-neutral-500">
        <span>ANIME ATLAS</span>
        <span className="font-jp text-[13px] tracking-[0.5em] text-neutral-400">アニメ・アトラス</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="max-w-xs pb-6 text-[11px] uppercase leading-relaxed tracking-[0.3em] text-neutral-500">
          Японская анимация
          <br />
          Каталог · Таймлайн · Студии
          <br />
          MMXXVI
        </div>
        <div
          aria-label={`Загрузка ${count} процентов`}
          className="font-display flex items-start text-[22vw] font-light leading-none text-white md:text-[16rem]"
        >
          {digits.map((d, i) => (
            <span key={i} className="reveal-mask">
              <span
                className="inline-block will-change-transform"
                style={{ transform: `translateY(${(9 - Number(d)) * 0.06}em)` }}
              >
                {d}
              </span>
            </span>
          ))}
          <span className="text-volt ml-2 mt-[0.35em] text-[0.12em]">%</span>
        </div>
      </div>
    </div>
  );
}
