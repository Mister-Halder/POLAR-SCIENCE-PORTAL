export interface MediaItem {
  id: string;
  kind: "photo";
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
  /** Optional URL to a real image for photos and video thumbnails */
  imageUrl?: string;
  /** Optional URL to download or view the actual asset (e.g. PDF document) */
  downloadUrl?: string;
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
    imageUrl: "https://currentaffairs.adda247.com/wp-content/uploads/multisite/sites/5/2025/12/16164902/India-Plans-New-Antarctic-Station-Maitri-II-Completion-Target-2032.webp",
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
    imageUrl: "https://th.bing.com/th/id/R.3feab85d1652da9643100c54be4a325a?rik=QmneN8%2fz7FVFjA&riu=http%3a%2f%2fgeo2.unibe.ch%2fwp%2fwp-content%2fuploads%2f2018%2f02%2fAntarctica04_NakiAkcar.jpg&ehk=o12LLW%2b95suavu7gxqW7ZbOEzrI5BL0OyY5CZVWA8w0%3d&risl=&pid=ImgRaw&r=0",
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
    imageUrl: "https://tse1.mm.bing.net/th/id/OIP.pCoRGWqvZS3K0J-65f0zwgHaE0?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
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
    imageUrl: "https://thumbs.dreamstime.com/b/hill-icebergs-hill-icebergs-larsemann-hills-prydz-bay-antarctica-366490525.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/08_Ny_Alesund_prn.JPG/500px-08_Ny_Alesund_prn.JPG",
  },
  {
    id: "md-010",
    kind: "photo",
    title: "Emperor Penguins near Dakshin Gangotri",
    credit: "Photo: Dr. Sanjana Pillai / NCPOR",
    captured: "2025-11-20",
    location: "Princess Astrid Coast, Antarctica",
    expeditionCode: "ISEA-45",
    description: "A small colony of Emperor penguins observed during a coastal traverse near the historic Dakshin Gangotri station site.",
    tags: ["wildlife", "penguins", "biology"],
    license: "CC BY 4.0",
    hue: 200,
    imageUrl: "https://travelhost.com/.image/MjU6MDAwMDAwMDAwMTI3NTg0/princesscruises-antarctica-lead-ads-032426.jpg?profile=share16-9",
  },


];

export const mediaKinds = ["photo"] as const;
