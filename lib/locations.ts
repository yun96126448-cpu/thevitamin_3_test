export interface LocationData {
  slug: string;
  name: string;
  nameKo: string;
  region: string;
  description: string;
  serviceArea: string;
}

export const LOCATIONS: Record<string, LocationData> = {
  mokpo: {
    slug: "mokpo",
    name: "목포",
    nameKo: "목포",
    region: "전라남도",
    description: "전라남도 목포시에서 제공하는 더비타민 비타민재가복지센터 방문요양 서비스",
    serviceArea: "목포시",
  },
  gwangju: {
    slug: "gwangju",
    name: "광주",
    nameKo: "광주",
    region: "광주광역시",
    description: "광주광역시에서 제공하는 더비타민 비타민재가복지센터 방문요양 서비스",
    serviceArea: "광주광역시",
  },
  jeonnam: {
    slug: "jeonnam",
    name: "전남",
    nameKo: "전라남도",
    region: "전라남도",
    description: "전라남도 전역에서 제공하는 더비타민 비타민재가복지센터 방문요양 서비스",
    serviceArea: "전라남도",
  },
};

export function getLocationBySlug(slug: string): LocationData | null {
  return LOCATIONS[slug.toLowerCase()] || null;
}

export function getAllLocationSlugs(): string[] {
  return Object.keys(LOCATIONS);
}
