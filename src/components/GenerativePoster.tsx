import { useEffect, useRef } from 'react';

interface GenerativePosterProps {
  /** HSL-строка без hsl(), например "350 100% 58%" */
  color: string;
  seed: string;
  title: string;
  className?: string;
}

/**
 * Генеративный постер-коллаж для карточек без фото-ассета.
 * Canvas рисует: радиальный свет, «нитки» линий, градуированный шум и
 * первый иероглиф заголовка крупной вёрсткой.
 */
export function GenerativePoster({ color, seed, title, className = '' }: GenerativePosterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 480;
    const H = 640;
    canvas.width = W;
    canvas.height = H;

    // Детерминированный генератор из seed
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const rand = () => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      h |= 0;
      return ((h >>> 0) % 10000) / 10000;
    };

    // Базовый фон
    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, W, H);

    // Радиальная подсветка акцентом
    const [hh, ss, ll] = color.split(' ').map((v) => parseFloat(v));
    const cx = W * (0.3 + rand() * 0.4);
    const cy = H * (0.25 + rand() * 0.4);
    const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, W * 0.95);
    glow.addColorStop(0, `hsla(${hh}, ${ss}%, ${Math.min(ll + 12, 75)}%, 0.5)`);
    glow.addColorStop(0.45, `hsla(${hh}, ${ss}%, ${ll}%, 0.14)`);
    glow.addColorStop(1, 'hsla(240, 6%, 3%, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Лучи-нити
    ctx.save();
    ctx.translate(cx, cy);
    const rays = 26 + Math.floor(rand() * 18);
    for (let i = 0; i < rays; i++) {
      const ang = (i / rays) * Math.PI * 2 + rand() * 0.18;
      const len = W * (0.35 + rand() * 0.8);
      ctx.strokeStyle = `hsla(${hh}, ${ss}%, ${ll}%, ${0.05 + rand() * 0.16})`;
      ctx.lineWidth = 0.5 + rand() * 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
      ctx.stroke();
    }
    ctx.restore();

    // Контуры гор/городской графики силуэтом
    ctx.save();
    ctx.globalAlpha = 0.5;
    const layers = 3;
    for (let l = 0; l < layers; l++) {
      const baseY = H * (0.62 + l * 0.1);
      ctx.fillStyle = `hsla(240, 8%, ${6 + l * 4}%, ${0.55 + l * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, baseY);
      const steps = 14 + Math.floor(rand() * 10);
      for (let s = 0; s <= steps; s++) {
        const x = (s / steps) * W;
        const peak = baseY - (rand() * H * 0.16) / (l + 1);
        ctx.lineTo(x, peak);
        ctx.lineTo(x + W / steps / 2, baseY - rand() * 12);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Звёзды/огни
    for (let i = 0; i < 90; i++) {
      const x = rand() * W;
      const y = rand() * H * 0.66;
      const r = rand() * 1.7 + 0.3;
      ctx.fillStyle = rand() > 0.82 ? `hsla(${hh}, ${ss}%, 70%, 0.9)` : 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Крупный первый иероглиф/буква
    ctx.save();
    ctx.font = `700 ${Math.floor(W * 0.62)}px "Zen Old Mincho", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `hsla(${hh}, ${ss}%, ${Math.min(ll + 18, 82)}%, 0.13)`;
    ctx.fillText(title.slice(0, 1), W * 0.5, H * 0.34);
    ctx.restore();

    // Виньетка
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }, [color, seed, title]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full object-cover ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Монограмма-аватар для персонажа без фото: инициал на акцентном поле.
 */
export function MonogramAvatar({
  name,
  color,
  size = 96,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      className="flex shrink-0 select-none items-center justify-center rounded-full border"
      style={{
        width: size,
        height: size,
        borderColor: `hsla(${color}, 0.6)`,
        background: `radial-gradient(circle at 30% 30%, hsla(${color}, 0.35), hsla(${color}, 0.08) 70%)`,
      }}
      aria-hidden="true"
    >
      <span
        className="font-display font-medium"
        style={{ fontSize: size * 0.44, color: `hsl(${color})` }}
      >
        {initial}
      </span>
    </div>
  );
}
