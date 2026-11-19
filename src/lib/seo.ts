import type { ProfessionalService, WithContext } from "schema-dts";
import { seo, socials, studio, trust } from "@/content/site";
import { siteUrl } from "@/lib/env";

/**
 * Structured data for the studio. Only facts from the studio's own public profiles: no rating, no
 * review count and no price range (none is shown anywhere). A review platform is linked only when
 * the studio chooses to cite one.
 */
export function studioJsonLd(): WithContext<ProfessionalService> {
  const sameAs: string[] = [socials.instagram.url, socials.threads.url];
  if (trust.show && trust.url) sameAs.push(trust.url);

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#studio`,
    name: studio.name,
    ...(studio.alternateName ? { alternateName: studio.alternateName } : {}),
    url: `${siteUrl}/`,
    description: seo.description,
    image: `${siteUrl}/opengraph-image`,
    logo: `${siteUrl}/icon/512`,
    sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: seo.locality,
      addressRegion: seo.region,
      addressCountry: "IN",
      ...(studio.address ? { streetAddress: studio.address } : {}),
    },
    areaServed: seo.areaServed.map((place) =>
      place.type === "City" ? { "@type": "City" as const, name: place.name } : { "@type": "State" as const, name: place.name },
    ),
    knowsAbout: [...seo.knowsAbout],
    ...(studio.phone ? { telephone: studio.phone } : {}),
    ...(studio.email ? { email: studio.email } : {}),
    ...(studio.ownerName ? { founder: { "@type": "Person", name: studio.ownerName } } : {}),
  };
}

/** Serialised for a <script type="application/ld+json">, with "<" escaped against injection. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
