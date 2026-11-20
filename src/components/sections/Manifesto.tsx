import Image from "next/image";
import elephant from "@/assets/brand/logo-elephant.png";
import { RevealImage } from "@/components/ui/RevealImage";
import { photos } from "@/content/images";
import { manifesto } from "@/content/site";
import { ManifestoMotion } from "./ManifestoMotion";

/**
 * The name. The logo's elephant as a large ornament with a reading of the name in mono, a
 * paragraph that develops word by word as you scroll, the studio's own promise (real moments, raw
 * emotions, artistic frames) beside a floating print, and where its stories happen, with each
 * city's position read like an EXIF location. The notes present the name and the emblem as a
 * reading, never as their origin.
 *
 * Large screens: the right column spans both grid rows, and the second row's auto/1fr split keeps
 * the places list tucked under the left column's print. Small screens read top to bottom: the
 * name, the paragraph, the promise, the places.
 */
export function Manifesto() {
  const { credo, places } = manifesto;

  return (
    <section id="name" aria-labelledby="name-title" className="relative">
      <ManifestoMotion>
        <div className="container-page section-y grid grid-cols-4 gap-x-4 md:grid-cols-6 md:gap-x-5 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6">
          <div className="col-span-4 md:col-span-6 lg:col-span-5 lg:row-start-1">
            <h2 id="name-title" className="font-normal">
              <span data-ornament className="block w-[min(78%,24rem)] lg:w-[min(100%,26rem)]">
                <Image
                  src={elephant}
                  alt=""
                  sizes="(min-width: 1024px) 26rem, (min-width: 768px) 24rem, 78vw"
                  className="h-auto w-full"
                />
              </span>
              <span data-ornament-note data-reveal className="mt-6 block space-y-1 font-mono text-caption text-fg-soft">
                {manifesto.notes.map((note) => (
                  <span key={note.term} className="block">
                    {note.term} · {note.meaning}
                  </span>
                ))}
              </span>
            </h2>
            <RevealImage
              photo={photos.detailPaithani}
              sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 62vw"
              ratio="1 / 1"
              parallax={10}
              className="mt-14 w-[62%] md:w-[48%] lg:mt-24 lg:w-[70%]"
            />
          </div>

          <div className="col-span-4 mt-14 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:pt-[16vh]">
            <p data-manifesto className="relative max-w-[24ch] font-display text-lead font-light text-fg">
              <span data-split>
                {manifesto.paragraph.map((run, index) =>
                  run.term ? <i key={index}>{run.text}</i> : <span key={index}>{run.text}</span>,
                )}
              </span>
            </p>

            <div className="mt-16 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:items-start md:gap-10 lg:mt-24">
              <ul className="space-y-9">
                {credo.map((item, index) => (
                  <li key={item.title} data-reveal="up" className="border-t border-line pt-5">
                    <p aria-hidden="true" className="font-mono text-caption text-fg-soft">
                      {manifesto.frameLabel(index + 1)}
                    </p>
                    <h3 className="mt-3 font-display text-h3 font-light">{item.title}</h3>
                    <p className="mt-2 max-w-[34ch] text-body text-fg-soft">{item.text}</p>
                  </li>
                ))}
              </ul>
              <RevealImage
                photo={photos.storyMehendi}
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 46vw"
                parallax={18}
                className="ml-auto w-[46%] md:w-[88%] lg:mr-[6%] lg:w-[80%]"
              />
            </div>
          </div>

          <div className="col-span-4 mt-20 md:col-span-6 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:mt-20 lg:self-start lg:pr-[6%]">
            <h3 data-reveal="up" className="font-display text-h3 font-light">
              {places.title}
            </h3>
            <ul className="mt-6 border-b border-line">
              {places.items.map((place) => (
                <li
                  key={place.name}
                  data-reveal="up"
                  className="flex items-baseline justify-between gap-6 border-t border-line py-3.5"
                >
                  <span className="font-display text-[clamp(1.375rem,1.15rem+0.7vw,1.875rem)] leading-tight font-light">
                    {place.name}
                    {place.note ? (
                      <span className="ml-3 font-mono text-caption whitespace-nowrap text-fg-soft">{place.note}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-mono text-caption text-fg-soft">{place.position}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ManifestoMotion>
    </section>
  );
}
