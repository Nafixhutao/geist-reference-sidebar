import type { RegionCountry } from "@/lib/region";

const regionCountryNames: Record<RegionCountry, string> = {
  singapore: "Singapore",
  indonesia: "Indonesia",
};

type RegionFlagProps = {
  country: RegionCountry;
  className?: string;
};

const FLAG_RED = "#dd2e44";

function IndonesiaFlag() {
  return (
    <svg viewBox="0 0 21 14" className="h-full w-full" aria-hidden="true">
      <rect width="21" height="7" fill={FLAG_RED} />
      <rect y="7" width="21" height="7" fill="#ffffff" />
    </svg>
  );
}

function SingaporeFlag() {
  // Endpoints of the crescent: two overlapping circles on the top-left.
  // The five stars sit on a small circle to the right of the crescent.
  const stars = [
    [9.9, 1.9],
    [8.4, 3.0],
    [9.0, 4.8],
    [10.85, 4.8],
    [11.4, 3.0],
  ] as const;

  return (
    <svg viewBox="0 0 21 14" className="h-full w-full" aria-hidden="true">
      <rect width="21" height="7" fill={FLAG_RED} />
      <rect y="7" width="21" height="7" fill="#ffffff" />
      <circle cx="4.5" cy="3.5" r="2.4" fill="#ffffff" />
      <circle cx="5.5" cy="3.5" r="1.75" fill={FLAG_RED} />
      {stars.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.72" fill="#ffffff" />
      ))}
    </svg>
  );
}

export function RegionFlag({ country, className }: RegionFlagProps) {
  const isSingapore = country === "singapore";

  return (
    <span
      aria-label={`${regionCountryNames[country]} flag`}
      role="img"
      className={`inline-block h-3.5 w-[21px] shrink-0 overflow-hidden rounded-[3px] border border-white/15 ${className ?? ""}`}
    >
      {isSingapore ? <SingaporeFlag /> : <IndonesiaFlag />}
    </span>
  );
}

export function regionCountryName(country: RegionCountry) {
  return regionCountryNames[country];
}

/** Flag plus the region name with a full country · region tooltip. */
export function RegionLabel({
  country,
  region,
  className,
}: {
  country: RegionCountry;
  region: string;
  className?: string;
}) {
  return (
    <>
      <RegionFlag country={country} />
      <span className={`truncate ${className ?? ""}`} title={`${regionCountryNames[country]} · ${region}`}>
        {region}
      </span>
    </>
  );
}
