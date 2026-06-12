/** www.bmkrs.com URLs — marketing site deep links from the app. */

const studioBase = process.env.NEXT_PUBLIC_BMKRS_STUDIO_URL?.trim() ?? "https://www.bmkrs.com";

export const marketingUrls = {
  studio: studioBase,
  work: `${studioBase}/work`,
  services: `${studioBase}/services`,
  motion: `${studioBase}/motion`,
  network: `${studioBase}/network`,
  journal: `${studioBase}/journal`,
  about: `${studioBase}/about`,
  contact: `${studioBase}/contact`,
  contactHire: `${studioBase}/contact?reason=hire`,
} as const;
