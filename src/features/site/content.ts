export const site = {
  name: "India Polar Science Portal",
  ministry: "Ministry of Earth Sciences, Government of India",
  operator: "National Centre for Polar and Ocean Research (NCPOR), Goa",
  tagline: "India's open window on the Antarctic, the Arctic, the Southern Ocean and the third pole",
  established: 1981,
};

export const primaryNav = [
  { to: "/", label: "Home" },
  { to: "/expeditions", label: "Expeditions" },
  { to: "/repository", label: "Data repository" },
  { to: "/learning", label: "Learning" },
  { to: "/media", label: "Media" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const headlineStats = [
  { label: "Antarctic expeditions since 1981", value: "44" },
  { label: "Research stations operated", value: "4" },
  { label: "Curated datasets published", value: "1,286" },
  { label: "Partner institutions", value: "37" },
];

export const researchThemes = [
  {
    title: "Cryosphere & ice-sheet dynamics",
    description:
      "Mass-balance monitoring, firn and ice coring, GNSS geodesy and remote sensing of ice-sheet change in Queen Maud Land, Svalbard and the Chandra basin.",
  },
  {
    title: "Polar atmosphere & aerosols",
    description:
      "Surface energy balance, boundary-layer profiling, black carbon and aerosol optical properties measured continuously at Maitri and Himadri.",
  },
  {
    title: "Southern Ocean & fjord systems",
    description:
      "Repeat hydrography along 57°E, carbon-inventory change, Argo and BGC-Argo deployments, and glacier-fjord coupling in Kongsfjorden.",
  },
  {
    title: "Polar biology & ecosystems",
    description:
      "Microbial diversity in cryoconite and meltwater, mesozooplankton distribution, and bioprospecting for cold-adapted enzymes.",
  },
  {
    title: "Geology & solid-earth geophysics",
    description:
      "Precambrian crustal evolution of East Antarctica, glacial isostatic adjustment, palaeomagnetism and meteorite recovery from blue-ice fields.",
  },
  {
    title: "Policy, law & capacity building",
    description:
      "Implementing the Indian Antarctic Act 2022, Antarctic Treaty engagement, environmental impact assessment and training the next research cohort.",
  },
];

export const timeline = [
  { year: "1981", event: "First Indian Scientific Expedition to Antarctica departs for Queen Maud Land." },
  { year: "1983", event: "India accedes to the Antarctic Treaty and attains Consultative Party status; Dakshin Gangotri established." },
  { year: "1989", event: "Maitri station commissioned on the Schirmacher Oasis." },
  { year: "1998", event: "NCPOR (then NCAOR) established at Goa as the nodal polar research institution." },
  { year: "2008", event: "Himadri station opens at Ny-Ålesund, beginning sustained Indian Arctic research." },
  { year: "2012", event: "Bharati station commissioned at Larsemann Hills, East Antarctica." },
  { year: "2014", event: "IndARC sub-surface mooring deployed in Kongsfjorden." },
  { year: "2016", event: "HIMANSH high-altitude station established in Spiti Valley for Himalayan cryosphere work." },
  { year: "2022", event: "The Indian Antarctic Act comes into force, codifying Treaty obligations in domestic law." },
  { year: "2025", event: "Polar Science Portal launched as the single open access point for expedition data and outreach." },
];

export const publications = [
  {
    title:
      "Surface energy balance controls on summer melt at the Schirmacher Oasis, East Antarctica",
    authors: "Iyer, K., Sen, A., Rawat, M.",
    journal: "Journal of Glaciology",
    year: 2025,
    doi: "10.1017/jog.2025.0417",
  },
  {
    title: "Decadal change in anthropogenic carbon along the 57°E Southern Ocean section",
    authors: "Bose, N., Menon, H., Sheikh, F.",
    journal: "Deep-Sea Research Part I",
    year: 2025,
    doi: "10.1016/j.dsr.2025.104312",
  },
  {
    title:
      "Refractory black carbon deposition on Svalbard glaciers from South Asian source regions",
    authors: "Khan, Y., Pillai, S., Norbu, T.",
    journal: "Atmospheric Chemistry and Physics",
    year: 2024,
    doi: "10.5194/acp-24-11987-2024",
  },
  {
    title: "Eight-year mass balance of Chandra basin glaciers from a dense stake network",
    authors: "Verma, I., Devi, A.",
    journal: "The Cryosphere",
    year: 2025,
    doi: "10.5194/tc-19-1447-2025",
  },
];

export const notices = [
  {
    date: "2026-08-12",
    title: "Call for proposals: 46th Indian Scientific Expedition to Antarctica",
    body: "Proposals for ISEA-46 station and traverse science are invited from Indian universities and research institutions. Submissions close 30 September 2026.",
    tag: "Call for proposals",
  },
  {
    date: "2026-07-28",
    title: "Southern Ocean 57°E data release, version 3.0",
    body: "The 2023-24 occupation of the 57°E repeat hydrographic section is now published with full-depth CTD, bottle chemistry and gridded fields.",
    tag: "Data release",
  },
  {
    date: "2026-07-02",
    title: "Winter maintenance window for the repository search index",
    body: "Full-text and faceted search will be read-only between 03:00 and 05:00 IST on 10 July 2026 while the index is rebuilt.",
    tag: "Service notice",
  },
];
