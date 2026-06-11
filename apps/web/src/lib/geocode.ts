export type GeoPoint = {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
};

/** Normalise UK postcodes for lookup. */
function normalisePostcode(postcode: string): string {
  return postcode.trim().toUpperCase().replace(/\s+/g, " ");
}

/**
 * Resolve coordinates from a UK postcode (postcodes.io) or city/country (Nominatim).
 * Returns null when lookup fails; callers should still save text location.
 */
export async function geocodeLocation(input: {
  postcode?: string | null;
  city?: string | null;
  country?: string | null;
}): Promise<GeoPoint | null> {
  const postcode = input.postcode?.trim();
  if (postcode) {
    const uk = await geocodeUkPostcode(postcode);
    if (uk) return uk;
  }

  const city = input.city?.trim();
  const country = input.country?.trim() || "United Kingdom";
  if (city) {
    return geocodeNominatim(`${city}, ${country}`);
  }

  return null;
}

async function geocodeUkPostcode(postcode: string): Promise<GeoPoint | null> {
  try {
    const encoded = encodeURIComponent(normalisePostcode(postcode));
    const res = await fetch(`https://api.postcodes.io/postcodes/${encoded}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      result?: {
        latitude: number;
        longitude: number;
        admin_district?: string;
        country?: string;
      };
    };
    if (!data.result) return null;
    return {
      latitude: data.result.latitude,
      longitude: data.result.longitude,
      city: data.result.admin_district,
      country: data.result.country,
    };
  } catch {
    return null;
  }
}

async function geocodeNominatim(query: string): Promise<GeoPoint | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    const res = await fetch(url, {
      headers: { "User-Agent": "FreelanceNearMe/3.0" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { lat: string; lon: string }[];
    if (!rows[0]) return null;
    return {
      latitude: Number(rows[0].lat),
      longitude: Number(rows[0].lon),
    };
  } catch {
    return null;
  }
}

/** Haversine distance in miles (fallback when earthdistance raw SQL is not used). */
export function distanceMiles(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatDistanceMiles(miles: number): string {
  if (miles < 1) return "Less than 1 mile away";
  return `${Math.round(miles)} miles away`;
}
