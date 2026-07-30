export const AIRBNB_URL = 'https://www.airbnb.com/rooms/17991288';
export const CONTACT_EMAIL = 'info@amaliapanoramahouse.com';
export const COORDS = { lat: 34.6716, lon: 32.8749 };
export const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${COORDS.lat},${COORDS.lon}&z=14&output=embed`;
export const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lon}`;

export function buildAirbnbSearchUrl({
  checkIn,
  checkOut,
  guests,
}: {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  const params = new URLSearchParams();
  if (checkIn) params.set('check_in', checkIn);
  if (checkOut) params.set('check_out', checkOut);
  if (guests && guests > 0) params.set('adults', String(guests));
  const query = params.toString();
  return query ? `${AIRBNB_URL}?${query}` : AIRBNB_URL;
}
