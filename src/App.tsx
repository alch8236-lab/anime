import { useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { Loader } from '@/components/Loader';
import { CustomCursor } from '@/components/CustomCursor';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/Hero';
import { Manifesto } from '@/sections/Manifesto';
import { Catalog } from '@/sections/Catalog';
import { Gallery3D } from '@/sections/Gallery3D';
import { Characters } from '@/sections/Characters';
import { Timeline } from '@/sections/Timeline';
import { Genres } from '@/sections/Genres';
import { Studios } from '@/sections/Studios';
import { QuotesWall } from '@/sections/QuotesWall';
import { QuizSection } from '@/sections/QuizSection';

/**
 * ANIME ATLAS — иммерсивный портал о японской анимации.
 * Структура: лоадер → hero с WebGL → манифест → каталог → 3D-галерея →
 * герои → таймлайн → жанры → студии → цитаты → квиз → футер.
 */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <div className="noise-overlay min-h-[100dvh] bg-[#060608] text-white antialiased">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <CustomCursor />
      <Nav />

      <main>
        <Hero />
        <Manifesto />
        <Catalog />
        <Gallery3D />
        <Characters />
        <Timeline />
        <Genres />
        <Studios />
        <QuotesWall />
        <QuizSection />
      </main>

      <Footer />
    </div>
  );
}
