import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Частицы: дрейфующие огни неона                                     */
/* ------------------------------------------------------------------ */
function NeonParticles({ count = 420 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const palette = [
      new THREE.Color('#ff3355'),
      new THREE.Color('#35d0ff'),
      new THREE.Color('#a9d92e'),
      new THREE.Color('#ffffff'),
    ];
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) + Math.sin(t * 0.6 + i) * 0.0016;
      pos.setY(i, y > 7 ? -7 : y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Меха-бюст: сгенерированная GLB-модель                               */
/* ------------------------------------------------------------------ */
function MechaBust() {
  const { scene } = useGLTF('/anime/assets/mecha-bust-low.glb');
  const group = useRef<THREE.Group>(null);

  const cloned = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.metalness !== undefined) {
            mat.metalness = Math.min(mat.metalness ?? 0.4, 0.82);
            mat.roughness = Math.max(mat.roughness ?? 0.35, 0.22);
            mat.envMapIntensity = 1.5;
          }
        }
      }
    });
    return s;
  }, [scene]);

  // Авто-поворот + параллакс от указателя
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.24;
    const px = state.pointer.x;
    const py = state.pointer.y;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, py * 0.14, 0.05);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, px * 0.7, 0.05);
  });

  return (
    <group ref={group} position={[4.1, 0.2, 1.8]}>
      <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.9}>
        <primitive object={cloned} scale={1.9} />
      </Float>
      {/* Кольцо-орбита */}
      <mesh rotation={[Math.PI / 2.15, 0.3, 0]}>
        <torusGeometry args={[2.6, 0.008, 8, 128]} />
        <meshBasicMaterial color="#ff3355" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, -0.4, 0.2]}>
        <torusGeometry args={[3.1, 0.005, 8, 128]} />
        <meshBasicMaterial color="#35d0ff" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Сцена                                                               */
/* ------------------------------------------------------------------ */
function SceneContents() {
  const { camera, gl, scene } = useThree();
  const scroll = useRef(0);

  // Окружение для металла: без envMap металлический материал чёрный
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 1.15;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    scroll.current = THREE.MathUtils.lerp(scroll.current, p, 0.06);
    camera.position.y = 0.4 - scroll.current * 2.2;
    camera.position.z = 8.4 - scroll.current * 1.4;
    camera.lookAt(2.6, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <spotLight position={[-6, 6, 6]} angle={0.5} penumbra={0.9} intensity={1400} color="#ff4560" />
      <pointLight position={[6, -3, 4]} intensity={420} color="#35d0ff" />
      <pointLight position={[0, 5, -5]} intensity={260} color="#a9d92e" />
      <pointLight position={[4, 2, 6]} intensity={320} color="#ffffff" />
      <NeonParticles />
      <Suspense fallback={null}>
        <MechaBust />
      </Suspense>
      <fog attach="fog" args={['#060608', 13, 30]} />
    </>
  );
}

/**
 * Hero-сцена: WebGL-фон с меха-бюстом, неоновыми частицами и параллаксом.
 * За канвасом — статичный постер (city art), видимый до первого кадра
 * и при отказе WebGL.
 */
export function HeroScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Постер под канвасом: никогда не чёрный экран */}
      <img
        src="/anime/assets/hero-city.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
        }}
      />
      <div className="absolute inset-0 bg-[#060608]/55" />
      <ErrorBoundary>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.4, 8.4], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <SceneContents />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

useGLTF.preload('/anime/assets/mecha-bust-low.glb');
