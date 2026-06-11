/** www.bmkrs.com URLs — marketing site deep links from the app. */

const studioBase = process.env.NEXT_PUBLIC_BMKRS_STUDIO_URL?.trim() ?? "https://www.bmkrs.com";

export const marketingUrls = {
  studio: studioBase,
  network: `${studioBase}/network`,
  contact: `${studioBase}/contact`,
  contactHire: `${studioBase}/contact?reason=hire`,
  motion: `${studioBase}/motion`,
  services: `${studioBase}/services`,
} as const;
