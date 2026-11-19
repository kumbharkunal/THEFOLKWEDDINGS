import Image from "next/image";
import elephant from "@/assets/brand/logo-elephant.png";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Wordmark } from "@/components/ui/Wordmark";
import { ScrollTextLink } from "@/components/ui/ScrollButton";
import { footer, nav, services, socials, studio, ui } from "@/content/site";
import { waLink, waMessages } from "@/lib/whatsapp";
import { BackToTop } from "./BackToTop";
import { FooterWordmark } from "./FooterWordmark";

/** Set when the static page is built. */
const YEAR = new Date().getFullYear();

const columnTitle = "font-mono text-caption text-fg-soft";
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * Footer: navigation, services and the official social marks with text labels, the service area,
 * a back-to-top control, the logo's elephant and the studio name set huge and fitted exactly to
 * the page width.
 */
export function Footer() {
  const connect = [
    { key: "instagram", label: "Instagram", href: socials.instagram.url, icon: <BrandIcon brand="instagram" size={20} /> },
    { key: "threads", label: "Threads", href: socials.threads.url, icon: <BrandIcon brand="threads" size={20} /> },
    { key: "whatsapp", label: "WhatsApp", href: waLink(waMessages.general), icon: <BrandIcon brand="whatsapp" size={20} /> },
  ];

  return (
    <footer id="site-footer" aria-labelledby="footer-title" className="relative border-t border-line">
      <h2 id="footer-title" className="sr-only">
        {footer.srHeading}
      </h2>
      <div className="container-page pt-20 pb-8 md:pt-28">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          <nav aria-label={footer.navLabel} className="lg:col-span-3">
            <h3 className={columnTitle}>{footer.navigationTitle}</h3>
            <ul className="mt-5 space-y-1">
              {nav.links.map((link) => (
                <li key={link.id}>
                  <ScrollTextLink to={link.id} label={link.label} className="inline-flex min-h-11 items-center text-body-lg" />
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h3 className={columnTitle}>{footer.servicesTitle}</h3>
            <ul className="mt-5 space-y-3 text-body-lg">
              {services.items.map((service) => (
                <li key={service.id}>{service.title}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={columnTitle}>{footer.connectTitle}</h3>
            <ul className="mt-5 space-y-1">
              {connect.map((item) => (
                <li key={item.key}>
                  <a href={item.href} {...external} className="inline-flex min-h-11 items-center gap-3 text-body-lg">
                    {item.icon}
                    <span className="link-draw">{item.label}</span>
                    <span className="sr-only"> {ui.newTab}</span>
                  </a>
                </li>
              ))}
              {studio.phone ? (
                <li>
                  <a
                    href={`tel:${studio.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex min-h-11 items-center text-body-lg"
                  >
                    <span className="link-draw">{studio.phone}</span>
                  </a>
                </li>
              ) : null}
              {studio.email ? (
                <li>
                  <a href={`mailto:${studio.email}`} className="inline-flex min-h-11 items-center text-body-lg">
                    <span className="link-draw">{studio.email}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2 lg:justify-self-end">
            <BackToTop label={footer.backToTop} />
          </div>
        </div>

        <p className="mt-16 max-w-[48ch] text-body text-fg-soft">{studio.serviceArea}</p>
        {studio.address ? <p className="mt-2 max-w-[48ch] text-body text-fg-soft">{studio.address}</p> : null}

        <div className="mt-16 md:mt-24">
          <Image
            src={elephant}
            alt=""
            sizes="(min-width: 768px) 11rem, 7rem"
            className="mx-auto h-auto w-28 md:w-44"
          />
          <FooterWordmark>
            <Wordmark />
          </FooterWordmark>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 text-sm text-fg-soft sm:flex-row sm:justify-between">
          <p>{footer.rights(YEAR)}</p>
          {studio.developerCredit ? (
            <p>
              {studio.developerCredit.url ? (
                <a href={studio.developerCredit.url} {...external} className="link-draw">
                  {footer.credit(studio.developerCredit.name)}
                  <span className="sr-only"> {ui.newTab}</span>
                </a>
              ) : (
                footer.credit(studio.developerCredit.name)
              )}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
