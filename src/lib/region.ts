export type RegionCountry = "singapore" | "indonesia";

export const REGION_COUNTRY_NAMES: Record<RegionCountry, string> = {
  singapore: "Singapore",
  indonesia: "Indonesia",
};

export function regionCountryName(country: RegionCountry) {
  return REGION_COUNTRY_NAMES[country];
}
