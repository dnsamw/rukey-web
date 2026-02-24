type GeoResult = {
  lat: number
  lng: number
  displayName: string
} | null

export async function geocodeAddress(address: string): Promise<GeoResult> {
  try {
    const encoded = encodeURIComponent(address)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      {
        headers: {
          // Nominatim requires a User-Agent
          'User-Agent': 'CleanProFacilityServices/1.0',
        },
        // Cache geocode results for 24 hours
        next: { revalidate: 86400 },
      }
    )

    const data = await res.json()

    if (!data.length) return null

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    }
  } catch {
    return null
  }
}