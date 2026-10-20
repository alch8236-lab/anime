import { SectionHeading } from '@/components/SectionHeading';
import { PosterSpheres } from '@/three/PosterSpheres';

/**
 * Секция 3D-галереи: постеры жанров за каплями стекла.
 * Перетаскивание вращает сцену, клик по сфере открывает карточку.
 */
export function Gallery3D() {
  return (
    <section id="gallery3d" className="relative overflow-hidden bg-[#08080b] py-28 md:py-36" aria-label="3D-галерея">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          index="02"
          jp="画廊"
          title="Галерея сфер"
          lead="Шесть жанровых миров за стеклянными каплями. Вращайте сцену перетаскиванием, наведите курсор на сферу и кликните, чтобы заглянуть внутрь."
          accent="volt"
        />
      </div>
      <PosterSpheres />
    </section>
  );
}
