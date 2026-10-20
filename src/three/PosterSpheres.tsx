import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { useTexture, OrbitControls } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import * as THREE from 'three';

const POSTER_SET: { key: string; title: string; year: string; genre: string; src: string }[] = [
  { key: 'cyber', title: 'Неоновый город', year: '1988 → сейчас', genre: 'Киберпанк', src: '/assets/poster-cyber.png' },
  { key: 'fantasy', title: 'Золотая долина', year: 'Эпический жанр', genre: 'Фэнтези', src: '/assets/poster-fantasy.png' },
  { key: 'slice', title: 'Апрельская дорога', year: 'Повседневность', genre: 'Иёсикэй', src: '/assets/poster-slice.png' },
  { key: 'mecha', title: 'Ангар №7', year: 'Жанр меха', genre: 'Меха', src: '/assets/poster-mecha.png' },
  { key: 'dark', title: 'Лес тысячи фонарей', year: 'Тёмное фэнтези', genre: 'Мистика', src: '/assets/poster-dark.png' },
  { key: 'sport', title: 'Последняя подача', year: 'Спорт', genre: 'Спортивное', src: '/assets/poster-sport.png' },
];

/* ------------------------------------------------------------------ */
/* Стеклянная сфера с текстурой-постером за оболочкой                 */
/* ------------------------------------------------------------------ */
interface SphereProps {
  src: string;
  label: string;
  position: [number, number, number];
  onSelect: (label: string) => void;
  onHover: (hovering: boolean) => void;
}

function PosterSphere({ src, label, position, onSelect, onHover }: SphereProps) {
  const texture = useTexture(src);
  const group = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const target = useRef(1);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((state, delta) => {
    if (!group.current) return;
    target.current = hovered ? 1.22 : 1;
    const cur = group.current.scale.x;
    const next = THREE.MathUtils.damp(cur, target.current, 6, delta);
    group.current.scale.setScalar(next);
    const t = state.clock.elapsedTime;
    group.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.12;
    // Пульс стекла
    if (shellRef.current) {
      const mat = shellRef.current.material as THREE.MeshPhysicalMaterial;
      mat.roughness = 0.06 + (Math.sin(t * 1.4) * 0.5 + 0.5) * 0.05;
    }
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(true);
  };
  const handleOut = () => {
    setHovered(false);
    onHover(false);
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(label);
  };

  return (
    <group ref={group} position={position}>
      {/* Внутренняя текстурированная сфера */}
      <mesh>
        <sphereGeometry args={[0.86, 48, 48]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Стеклянная оболочка с водяным искажением */}
      <mesh
        ref={shellRef}
        scale={1.12}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.86, 64, 64]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0.06}
          thickness={1.1}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.08}
          attenuationColor="#cfeaff"
          attenuationDistance={6}
          envMapIntensity={1.8}
          transparent
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Сцена                                                               */
/* ------------------------------------------------------------------ */
function SpheresScene({
  onSelect,
  onHover,
}: {
  onSelect: (label: string) => void;
  onHover: (h: boolean) => void;
}) {
  const { gl, scene } = useThree();
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // Окружение для отражений стекла — без сети
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 1.6;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 4]} intensity={220} color="#ff4560" />
      <pointLight position={[-5, -2, 3]} intensity={160} color="#35d0ff" />
      <pointLight position={[0, 3, 6]} intensity={200} color="#ffffff" />

      {POSTER_SET.map((p, i) => {
        const angle = (i / POSTER_SET.length) * Math.PI * 1.35 - Math.PI * 0.65;
        const x = Math.cos(angle) * 3.4;
        const z = Math.sin(angle) * 1.6 - 0.4;
        const y = (i % 2 === 0 ? 0.5 : -0.45) + Math.sin(i * 2.1) * 0.2;
        return (
          <PosterSphere
            key={p.key}
            src={p.src}
            label={p.title}
            position={[x, y, z]}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}

      <OrbitControls
        enabled={!reduced}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.55}
        autoRotate={!reduced}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
      />
      <fog attach="fog" args={['#060608', 8, 16]} />
    </>
  );
}

export interface SphereMeta {
  title: string;
  year: string;
  genre: string;
}

/**
 * Галерея сфер: постеры за каплями стекла.
 * Клик по сфере открывает DOM-карточку; перетаскивание вращает сцену.
 */
export function PosterSpheres() {
  const [active, setActive] = useState<SphereMeta | null>(null);
  const [hovering, setHovering] = useState(false);

  const handleSelect = (label: string) => {
    const meta = POSTER_SET.find((p) => p.title === label) ?? POSTER_SET[0];
    setActive({ title: meta.title, year: meta.year, genre: meta.genre });
  };

  return (
    <div className="relative h-[70vh] w-full md:h-[80vh]" data-cursor="hover">
      {/* Подложка-постер до первого кадра */}
      <img
        src="/assets/street-vertical.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        style={{
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
        }}
      />
      <ErrorBoundary>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 7.4], fov: 46 }}
          gl={{ antialias: true, alpha: true }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Suspense fallback={null}>
            <SpheresScene onSelect={handleSelect} onHover={setHovering} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Подсказка */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-500">
          {hovering ? 'клик — подробнее' : 'тяните, чтобы вращать'}
        </p>
      </div>

      {/* Карточка выбранной сферы */}
      {active && (
        <div
          className="absolute left-1/2 top-8 w-[min(320px,85vw)] -translate-x-1/2 border border-white/15 bg-[#0a0a0d]/90 p-6 backdrop-blur-md"
          role="dialog"
          aria-label={`Карточка: ${active.title}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.35em] text-volt">{active.genre}</span>
            <button
              onClick={() => setActive(null)}
              aria-label="Закрыть карточку"
              className="flex h-8 w-8 items-center justify-center border border-white/20 text-neutral-400 transition-colors hover:border-neon hover:text-white"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
          <h3 className="font-display text-3xl font-light text-white">{active.title}</h3>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-neutral-500">{active.year}</p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            Фрагмент жанра за стеклом: каждая сфера — портал в собственную графику эпохи. Выберите
            жанр в атласе ниже, чтобы найти свои тайтлы.
          </p>
        </div>
      )}
    </div>
  );
}
