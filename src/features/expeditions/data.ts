export type ExpeditionRegion = "Antarctic" | "Arctic" | "Southern Ocean" | "Himalaya";

export interface ExpeditionMember {
  name: string;
  role: string;
  institution: string;
}

export interface Expedition {
  slug: string;
  code: string;
  title: string;
  region: ExpeditionRegion;
  season: string;
  startDate: string;
  endDate: string;
  status: "completed" | "ongoing" | "planned";
  vessel: string;
  basecamp: string;
  lat: number;
  lon: number;
  participants: number;
  summary: string;
  objectives: string[];
  highlights: string[];
  datasetIds: string[];
  team: ExpeditionMember[];
}

export const expeditions: Expedition[] = [
  {
    slug: "isea-44-maitri-bharati-traverse",
    code: "ISEA-44",
    title: "44th Indian Scientific Expedition to Antarctica",
    region: "Antarctic",
    season: "2024-25",
    startDate: "2024-11-06",
    endDate: "2025-03-28",
    status: "completed",
    vessel: "MV Vasiliy Golovnin",
    basecamp: "Maitri & Bharati stations",
    lat: -70.7667,
    lon: 11.7333,
    participants: 96,
    summary:
      "The 44th Indian Scientific Expedition to Antarctica combined station logistics at Maitri and Bharati with an inland traverse across the Sør Rondane foothills, focusing on ice-sheet mass balance, atmospheric boundary-layer profiling and blue-ice meteorite prospecting.",
    objectives: [
      "Re-occupy the 12 GNSS bedrock benchmarks along the Schirmacher Oasis to Sør Rondane traverse line",
      "Install two automatic weather stations with radiation flux booms at 780 m and 1,410 m elevation",
      "Retrieve a 68 m firn core for stable-isotope and black-carbon stratigraphy",
      "Complete katabatic wind profiling with tethered sondes during three storm events",
    ],
    highlights: [
      "First continuous 5-month surface energy balance record from the Maitri automatic weather station cluster",
      "Firn core PC-44/03 recovered to 68.4 m with 96% core quality, dated to approximately 1815 CE",
      "Nine meteorite fragments recovered from a blue-ice field south of Gruber Mountains",
    ],
    datasetIds: ["ds-maitri-awx-2024", "ds-firn-core-pc4403", "ds-gnss-bedrock-uplift"],
    team: [
      { name: "Dr. Meenakshi Rawat", role: "Expedition Leader", institution: "NCPOR, Goa" },
      { name: "Debashis Halder", role: "Glaciology Lead", institution: "NCPOR, Goa" },
      {
        name: "Dr. Kavya Iyer",
        role: "Atmospheric Sciences",
        institution: "IITM Pune",
      },
      { name: "Lt Cdr Rohan Bhatt", role: "Logistics & Safety", institution: "Indian Navy" },
    ],
  },
  {
    slug: "iarc-2025-himadri-summer",
    code: "IARC-2025",
    title: "Indian Arctic Summer Campaign at Himadri, Ny-Ålesund",
    region: "Arctic",
    season: "2025",
    startDate: "2025-05-18",
    endDate: "2025-09-02",
    status: "ongoing",
    vessel: "Shore-based (Kongsfjorden small craft)",
    basecamp: "Himadri Station, Ny-Ålesund, Svalbard",
    lat: 78.9231,
    lon: 11.9226,
    participants: 24,
    summary:
      "A four-month Arctic summer campaign operating from Himadri Station, tracking Kongsfjorden glacier-fjord coupling, aerosol long-range transport into the high Arctic, and microbial community shifts in meltwater plumes.",
    objectives: [
      "Maintain the IndARC-style moored CTD chain across the Kongsfjorden transect",
      "Quantify black carbon and mineral dust deposition on Vestre Broggerbreen",
      "Sample glacial meltwater plumes for 16S rRNA microbial diversity",
      "Operate the Himadri aethalometer and nephelometer suite without data gaps",
    ],
    highlights: [
      "Fjord surface freshening of 0.42 PSU recorded during the July melt pulse",
      "Cryoconite microbial assemblage sequencing identified 34 previously unrecorded ASVs for the site",
      "Continuous equivalent black carbon record achieved 98.7% temporal coverage",
    ],
    datasetIds: ["ds-kongsfjorden-ctd", "ds-himadri-bc-aerosol", "ds-cryoconite-16s"],
    team: [
      { name: "Dr. Sanjana Pillai", role: "Campaign Coordinator", institution: "NCPOR, Goa" },
      { name: "Dr. Yusuf Khan", role: "Aerosol Chemistry", institution: "PRL Ahmedabad" },
      { name: "Dr. Tenzing Norbu", role: "Cryosphere Microbiology", institution: "NCPOR, Goa" },
    ],
  },
  {
    slug: "sose-11-southern-ocean",
    code: "SOSE-11",
    title: "11th Southern Ocean Scientific Expedition",
    region: "Southern Ocean",
    season: "2025-26",
    startDate: "2025-12-04",
    endDate: "2026-02-20",
    status: "planned",
    vessel: "ORV Sagar Nidhi",
    basecamp: "Ship-based, 40°S to 60°S along 57°E",
    lat: -52.5,
    lon: 57.0,
    participants: 42,
    summary:
      "A ship-based hydrographic and biogeochemical transect from Port Louis to the Antarctic marginal ice zone, resolving frontal structure, carbon uptake and mesozooplankton distribution along the 57°E meridional line.",
    objectives: [
      "Complete 28 full-depth CTD-rosette stations with dissolved inorganic carbon sampling",
      "Deploy 6 Argo floats and 2 biogeochemical Argo floats in the Antarctic Circumpolar Current",
      "Map the Subtropical, Subantarctic and Polar Fronts using underway thermosalinograph data",
      "Conduct multi-net mesozooplankton hauls at every second station",
    ],
    highlights: [
      "Transect designed to repeat the 2019 occupation for decadal carbon-inventory comparison",
      "First Indian deployment plan for paired BGC-Argo floats south of the Polar Front",
    ],
    datasetIds: ["ds-southern-ocean-ctd-57e", "ds-argo-deployments"],
    team: [
      { name: "Dr. Nandita Bose", role: "Chief Scientist", institution: "NCPOR, Goa" },
      { name: "Dr. Harish Menon", role: "Ocean Biogeochemistry", institution: "NIO Goa" },
      { name: "Dr. Farida Sheikh", role: "Physical Oceanography", institution: "INCOIS Hyderabad" },
    ],
  },
  {
    slug: "hicryo-2024-chandra-basin",
    code: "HICRYO-2024",
    title: "Himalayan Cryosphere Field Campaign, Chandra Basin",
    region: "Himalaya",
    season: "2024",
    startDate: "2024-06-11",
    endDate: "2024-10-04",
    status: "completed",
    vessel: "Land-based (HIMANSH high-altitude station)",
    basecamp: "HIMANSH, Spiti Valley, Himachal Pradesh",
    lat: 32.4167,
    lon: 77.6167,
    participants: 18,
    summary:
      "Third-pole complement to India's polar programme: mass-balance stake network measurements, debris-cover thermal mapping and glacio-hydrological discharge gauging across the Chandra basin from the HIMANSH research station.",
    objectives: [
      "Re-measure 112 ablation stakes across Sutri Dhaka, Batal and Bara Shigri glaciers",
      "Fly UAV photogrammetry lines for a 0.15 m DEM of the Sutri Dhaka tongue",
      "Gauge proglacial discharge and suspended sediment at 15-minute intervals",
    ],
    highlights: [
      "Sutri Dhaka glacier recorded a mean specific mass balance of -1.18 m w.e. for the 2023-24 year",
      "UAV survey covered 11.4 km² with 3.2 cm ground sampling distance",
    ],
    datasetIds: ["ds-chandra-mass-balance", "ds-sutri-dhaka-dem"],
    team: [
      { name: "Dr. Ishaan Verma", role: "Field Lead", institution: "NCPOR, Goa" },
      { name: "Dr. Aruna Devi", role: "Glacio-hydrology", institution: "WIHG Dehradun" },
    ],
  },
];

export const stations = [
  {
    id: "dakshin",
    name: "Dakshin Gangotri",
    region: "Antarctic" as ExpeditionRegion,
    lat: -70.08,
    lon: 12.0,
    established: 1983,
    capacity: 0,
    description: "India's first scientific base station in Antarctica. It was decommissioned in 1990 after being buried in ice, marking the beginning of India's polar journey.",
  },
  {
    id: "maitri",
    name: "Maitri",
    region: "Antarctic" as ExpeditionRegion,
    lat: -70.7667,
    lon: 11.7333,
    established: 1989,
    capacity: 25,
    description:
      "India's second Antarctic station, sited on the Schirmacher Oasis in Queen Maud Land. Year-round operations covering geology, atmospheric sciences and medicine.",
  },
  {
    id: "bharati",
    name: "Bharati",
    region: "Antarctic" as ExpeditionRegion,
    lat: -69.4075,
    lon: 76.1875,
    established: 2012,
    capacity: 47,
    description:
      "Modular station on Larsemann Hills, East Antarctica, purpose-built for oceanographic and coastal geoscience research in the Prydz Bay sector.",
  },
  {
    id: "himadri",
    name: "Himadri",
    region: "Arctic" as ExpeditionRegion,
    lat: 78.9231,
    lon: 11.9226,
    established: 2008,
    capacity: 8,
    description:
      "India's Arctic research base at Ny-Ålesund, Svalbard, focused on atmospheric aerosols, fjord dynamics and Arctic-monsoon teleconnections.",
  },
  {
    id: "himansh",
    name: "HIMANSH",
    region: "Himalaya" as ExpeditionRegion,
    lat: 32.4167,
    lon: 77.6167,
    established: 2016,
    capacity: 15,
    description:
      "High-altitude research station at 4,080 m in Spiti Valley supporting glaciological monitoring of the Chandra basin.",
  },
  {
    id: "indarc",
    name: "IndARC mooring",
    region: "Arctic" as ExpeditionRegion,
    lat: 79.0,
    lon: 12.2,
    established: 2014,
    capacity: 0,
    description:
      "India's multi-sensor sub-surface mooring in Kongsfjorden, recording temperature, salinity and current profiles through the polar night.",
  },
  {
    id: "sagar-nidhi-line",
    name: "57°E Southern Ocean line",
    region: "Southern Ocean" as ExpeditionRegion,
    lat: -52.5,
    lon: 57.0,
    established: 2004,
    capacity: 0,
    description:
      "Repeat meridional hydrographic section occupied by ORV Sagar Nidhi and ORV Sagar Kanya since 2004.",
  },
];

export function getExpedition(slug: string) {
  return expeditions.find((e) => e.slug === slug);
}
