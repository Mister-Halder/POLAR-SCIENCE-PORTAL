export interface MediaItem {
  id: string;
  kind: "photo" | "video" | "audio" | "document";
  title: string;
  credit: string;
  captured: string;
  location: string;
  expeditionCode: string;
  description: string;
  tags: string[];
  durationSeconds?: number;
  pages?: number;
  license: string;
  /** Deterministic gradient seed so the demo tile art is stable across SSR and hydration. */
  hue: number;
}

export const mediaItems: MediaItem[] = [
  {
    id: "md-001",
    kind: "photo",
    title: "Katabatic drift over the Schirmacher Oasis",
    credit: "Photo: Dr. Kavya Iyer / NCPOR",
    captured: "2025-01-18",
    location: "Maitri station, Antarctica",
    expeditionCode: "ISEA-44",
    description:
      "Late-afternoon drift snow streaming off the ice sheet edge during a 24 m/s katabatic event, photographed from the Maitri automatic weather station mast.",
    tags: ["katabatic", "Maitri", "weather"],
    license: "CC BY 4.0",
    hue: 214,
  },
  {
    id: "md-002",
    kind: "photo",
    title: "Firn core section PC-44/03 under raking light",
    credit: "Photo: Debashis Halder / NCPOR",
    captured: "2025-01-11",
    location: "Sør Rondane foothills, Antarctica",
    expeditionCode: "ISEA-44",
    description:
      "A 1 m section of firn core photographed on a light table, with visible melt layers used as summer markers during annual layer counting.",
    tags: ["ice core", "glaciology", "stratigraphy"],
    license: "CC BY 4.0",
    hue: 198,
  },
  {
    id: "md-003",
    kind: "video",
    title: "Deploying the Kongsfjorden CTD rosette",
    credit: "Video: IARC-2025 field team / NCPOR",
    captured: "2025-06-27",
    location: "Kongsfjorden, Svalbard",
    expeditionCode: "IARC-2025",
    description:
      "Small-boat CTD deployment at inner-fjord station K3, showing the winch procedure and surface meltwater layer sampling near the Kronebreen calving front.",
    tags: ["CTD", "Arctic", "fieldwork"],
    durationSeconds: 214,
    license: "CC BY-NC 4.0",
    hue: 190,
  },
  {
    id: "md-004",
    kind: "audio",
    title: "Glacier calving acoustics, Kronebreen front",
    credit: "Recording: Dr. Sanjana Pillai / NCPOR",
    captured: "2025-07-14",
    location: "Kronebreen, Svalbard",
    expeditionCode: "IARC-2025",
    description:
      "Hydrophone recording of submarine melt and calving events, captured 400 m from the terminus over a 12-minute window during peak melt.",
    tags: ["acoustics", "calving", "hydrophone"],
    durationSeconds: 726,
    license: "CC BY 4.0",
    hue: 172,
  },
  {
    id: "md-005",
    kind: "photo",
    title: "Ablation stake survey on Sutri Dhaka",
    credit: "Photo: Dr. Ishaan Verma / NCPOR",
    captured: "2024-09-14",
    location: "Chandra basin, Himachal Pradesh",
    expeditionCode: "HICRYO-2024",
    description:
      "Field team recording stake emergence on the debris-covered tongue of Sutri Dhaka glacier during the end-of-ablation-season survey.",
    tags: ["mass balance", "Himalaya", "HIMANSH"],
    license: "CC BY 4.0",
    hue: 40,
  },
  {
    id: "md-006",
    kind: "document",
    title: "ISEA-44 preliminary science report",
    credit: "NCPOR, Ministry of Earth Sciences",
    captured: "2025-05-30",
    location: "Goa, India",
    expeditionCode: "ISEA-44",
    description:
      "Preliminary cruise and station report summarising instrument deployments, sample inventories and data-submission status for the 44th Antarctic expedition.",
    tags: ["report", "documentation", "ISEA-44"],
    pages: 84,
    license: "Government Open Data Licence — India",
    hue: 228,
  },
  {
    id: "md-007",
    kind: "photo",
    title: "Aurora australis above Bharati station",
    credit: "Photo: Lt Cdr Rohan Bhatt / Indian Navy",
    captured: "2025-03-09",
    location: "Larsemann Hills, Antarctica",
    expeditionCode: "ISEA-44",
    description:
      "Thirty-second exposure of aurora australis over the modular container architecture of Bharati station at the start of the polar night transition.",
    tags: ["aurora", "Bharati", "night sky"],
    license: "CC BY 4.0",
    hue: 158,
  },
  {
    id: "md-008",
    kind: "video",
    title: "UAV photogrammetry flight lines, Sutri Dhaka",
    credit: "Video: Dr. Aruna Devi / WIHG",
    captured: "2024-09-15",
    location: "Chandra basin, Himachal Pradesh",
    expeditionCode: "HICRYO-2024",
    description:
      "Time-compressed footage of a mapping flight over the glacier tongue, annotated with ground control point positions used for the 0.15 m DEM.",
    tags: ["UAV", "DEM", "survey"],
    durationSeconds: 168,
    license: "CC BY 4.0",
    hue: 96,
  },
  {
    id: "md-009",
    kind: "photo",
    title: "Cryoconite holes on Vestre Broggerbreen",
    credit: "Photo: Dr. Tenzing Norbu / NCPOR",
    captured: "2025-08-02",
    location: "Brøggerhalvøya, Svalbard",
    expeditionCode: "IARC-2025",
    description:
      "Water-filled cryoconite holes with dark sediment floors, each a self-contained microbial habitat sampled for 16S rRNA amplicon sequencing.",
    tags: ["microbiology", "cryoconite", "Arctic"],
    license: "CC BY-NC 4.0",
    hue: 148,
  },
];

export const mediaKinds = ["photo", "video", "audio", "document"] as const;
