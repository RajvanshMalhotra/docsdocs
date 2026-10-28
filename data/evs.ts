export interface Trim {
  name: string;
  wheels: string;
  /** EPA combined range in miles */
  epa: number;
  note?: string;
}

export interface EV {
  id: "m3" | "r1t" | "bolt";
  name: string;
  year: string;
  /** Share of mild-weather range kept at or below 32°F (Recurrent winter study) */
  r32: number;
  /** Index of the longest-range trim on standard wheels */
  best: number;
  facts: [label: string, value: string][];
  trims: Trim[];
}

export const EVS: EV[] = [
  {
    id: "m3",
    name: "Tesla Model 3",
    year: "2026",
    r32: 0.87,
    best: 2,
    facts: [
      ["Body", "Sedan, 5 seats"],
      ["Battery (est.)", "≈62 kWh Standard; ≈75–82 kWh Premium, Performance"],
      ["Heat pump", "Yes, standard"],
      ["Freezing retention", "87% (Recurrent)"],
      ["Without heat pump", "79% (pre-2021 cars)"],
      ["DC fast charge", "175 kW peak Standard; 250 kW Premium, Performance"],
      ["Charging network", "Tesla Supercharger (NACS)"],
      ["0–60 mph", "5.8 s Standard to 2.9 s Performance"],
      ["MSRP", "$38,380 Standard; $48,880 Premium RWD; $56,380 Performance"],
      ["EPA range span", "303–363 mi"],
    ],
    trims: [
      { name: "Standard RWD", wheels: '18"', epa: 321 },
      { name: "Standard RWD", wheels: '19"', epa: 303 },
      { name: "Premium RWD", wheels: '18"', epa: 363 },
      { name: "Premium RWD", wheels: '19"', epa: 343 },
      { name: "Premium AWD", wheels: '18"', epa: 346 },
      { name: "Premium AWD", wheels: '19"', epa: 332 },
      { name: "Performance AWD", wheels: '20"', epa: 309 },
    ],
  },
  {
    id: "r1t",
    name: "Rivian R1T",
    year: "2026",
    r32: 0.81,
    best: 2,
    facts: [
      ["Body", "Pickup, 5 seats"],
      ["Battery (est.)", "≈92.5 kWh Standard; ≈105–109 kWh Large; ≈140 kWh Max"],
      ["Heat pump", "Gen 2 (2025+); study cars mostly Gen 1"],
      ["Freezing retention", "81% (Recurrent)"],
      ["DC fast charge", "≈200–220 kW peak"],
      ["Charging network", "NACS port, Supercharger access"],
      ["MSRP", "$70,990 Dual Standard; $77,990 Dual Large; $84,990 Dual Max"],
      ["EPA range span", "258–420 mi"],
    ],
    trims: [
      { name: "Dual Standard", wheels: '21"', epa: 270, note: "CarMax lists 258 mi; may be discontinued for 2026" },
      { name: "Dual Large", wheels: '21"', epa: 329 },
      { name: "Dual Max", wheels: '21"', epa: 420 },
      { name: "Tri Max", wheels: '21"', epa: 371, note: "Some listings show 370 mi" },
    ],
  },
  {
    id: "bolt",
    name: "Chevy Bolt",
    year: "2027",
    r32: 0.69,
    best: 0,
    facts: [
      ["Body", "Compact hatchback, 5 seats"],
      ["Battery", "65 kWh LFP"],
      ["Efficiency", "28 kWh/100 mi (EPA)"],
      ["Freezing retention", "69% (prior-gen Bolt, Recurrent)"],
      ["DC fast charge", "150 kW peak, 10–80% in ~25 min"],
      ["Onboard AC charger", "11.5 kW"],
      ["Highway range (EPA)", "232 mi"],
      ["Real-world test", "290 mi (Edmunds)"],
      ["Starting price", "$28,995 incl. destination"],
    ],
    trims: [
      { name: "LT", wheels: '17"', epa: 262 },
      { name: "RS", wheels: '19"', epa: 262 },
    ],
  },
];

export const SOURCES: { label: string; href: string }[] = [
  { label: "Recurrent winter range study", href: "https://www.recurrentauto.com/research/winter-ev-range-loss" },
  { label: "InsideEVs on heat-pump data", href: "https://insideevs.com/news/747374/ev-range-loss-cold-heat-pump-data/" },
  { label: "KBB on Recurrent study", href: "https://www.kbb.com/car-news/study-the-average-ev-keeps-80-of-its-range-in-the-cold" },
  { label: "Edmunds 2026 Model 3", href: "https://www.edmunds.com/tesla/model-3/2026" },
  { label: "KBB 2026 Model 3 prices and specs", href: "https://www.kbb.com/tesla/model_3" },
  { label: "InsideEVs DE Model 3 charging data", href: "https://insideevs.de/features/744463/tesla-model3-modellübersicht-daten-preise/" },
  { label: "EVChargingStations 2026 R1T packs", href: "https://evchargingstations.com/chargingnews/2026-rivian-r1s-r1t-no-base/" },
  { label: "Recharged R1T charging test", href: "https://recharged.com/articles/rivian-r1t-charging-speed-test" },
  { label: "CarMax 2026 R1T", href: "https://www.carmax.com/research/rivian/r1t/2026" },
  { label: "The Charge Port R1T", href: "https://thechargeport.com/ev/rivian-r1t" },
  { label: "Electrek 2027 Bolt", href: "https://electrek.co/2026/05/08/chevy-bolt-ev-delivers-nearly-300-miles-real-world-range-for-30k/" },
  { label: "Edmunds Bolt range test", href: "https://www.edmunds.com/car-news/2027-chevy-bolt-ev-range-tested-video.html" },
];
