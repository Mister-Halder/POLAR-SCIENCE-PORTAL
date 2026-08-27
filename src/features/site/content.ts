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
  { to: "/research", label: "Research Library" },
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
    title: "Summertime evaporation over two lakes in the Schirmacher Oasis, East Antarctica",
    authors: "Shevnina, E., Vihma, T., Potes, M., Naakka, T.",
    journal: "Hydrology and Earth System Sciences",
    year: 2026,
    doi: "10.5194/hess-30-4721-2026",
  },
  {
    title: "Carbon uptake and biogeochemical change in the Southern Ocean, south of Tasmania",
    authors: "Pardo, P. C., Tilbrook, B., van Ooijen, J., et al.",
    journal: "Biogeosciences",
    year: 2017,
    doi: "10.5194/bg-14-5217-2017",
  },
  {
    title: "Variability in black carbon mass concentration in surface snow at Svalbard",
    authors: "Bertò, M., Barbaro, E., Kirchgeorg, T., et al.",
    journal: "Atmospheric Chemistry and Physics",
    year: 2021,
    doi: "10.5194/acp-21-12479-2021",
  },
  {
    title: "Reanalysis of the longest mass balance series in Himalaya using a nonlinear model: Chhota Shigri Glacier (India)",
    authors: "Munda, A., Azam, M. F., Wagnon, P., et al.",
    journal: "The Cryosphere",
    year: 2024,
    doi: "10.5194/tc-18-5653-2024",
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

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  journal: string;
  region: string;
  theme: string;
  authors: string[];
  keywords: string[];
  year: number;
  openAccess: boolean;
  paperUrl?: string;
  pdfUrl?: string;
}

export const researchPapers: ResearchPaper[] = [
  {
    id: "rp-001",
    title: "Summertime evaporation over two lakes in the Schirmacher Oasis, East Antarctica",
    abstract:
      "Continuous eddy covariance and meteorological observations over inland lakes in the Schirmacher Oasis quantify the surface energy balance, turbulent heat fluxes, and evaporation dynamics during the Antarctic summer.",
    journal: "Hydrology and Earth System Sciences",
    region: "Antarctica",
    theme: "Cryosphere & ice-sheet dynamics",
    authors: ["Shevnina, E.", "Vihma, T.", "Potes, M.", "Naakka, T."],
    keywords: ["Schirmacher Oasis", "Surface Energy Balance", "Evaporation", "East Antarctica", "Maitri Station"],
    year: 2026,
    openAccess: true,
    paperUrl: "https://doi.org/10.5194/hess-30-4721-2026",
    pdfUrl: "https://hess.copernicus.org/articles/30/4721/2026/hess-30-4721-2026.pdf",
  },
  {
    id: "rp-002",
    title: "Carbon uptake and biogeochemical change in the Southern Ocean, south of Tasmania",
    abstract:
      "Repeat hydrography across the Southern Ocean provides decadal quantification of anthropogenic carbon accumulation, ocean acidification, and circulation-driven storage in Subantarctic and polar water masses.",
    journal: "Biogeosciences",
    region: "Southern Ocean",
    theme: "Southern Ocean & fjord systems",
    authors: ["Pardo, P. C.", "Tilbrook, B.", "van Ooijen, J.", "et al."],
    keywords: ["Southern Ocean", "Anthropogenic Carbon", "Repeat Hydrography", "Ocean Acidification", "Carbon Sink"],
    year: 2017,
    openAccess: true,
    paperUrl: "https://doi.org/10.5194/bg-14-5217-2017",
    pdfUrl: "https://bg.copernicus.org/articles/14/5217/2017/bg-14-5217-2017.pdf",
  },
  {
    id: "rp-003",
    title: "Variability in black carbon mass concentration in surface snow at Svalbard",
    abstract:
      "High-resolution measurements of refractory black carbon and dust in snow across Svalbard glaciers quantify deposition patterns, atmospheric scavenging, and albedo reduction impacts in the European Arctic.",
    journal: "Atmospheric Chemistry and Physics",
    region: "Arctic",
    theme: "Polar atmosphere & aerosols",
    authors: ["Bertò, M.", "Barbaro, E.", "Kirchgeorg, T.", "et al."],
    keywords: ["Black Carbon", "Svalbard", "Aerosol Deposition", "Himadri", "Arctic Albedo"],
    year: 2021,
    openAccess: true,
    paperUrl: "https://doi.org/10.5194/acp-21-12479-2021",
    pdfUrl: "https://acp.copernicus.org/articles/21/12479/2021/acp-21-12479-2021.pdf",
  },
  {
    id: "rp-004",
    title: "Reanalysis of the longest mass balance series in Himalaya using a nonlinear model: Chhota Shigri Glacier (India)",
    abstract:
      "Glaciological observations and modeling from the Chandra basin in the Western Himalaya reconstruct multi-decadal glacier mass balance, equilibrium-line altitude variations, and climate sensitivity.",
    journal: "The Cryosphere",
    region: "Himalayas",
    theme: "Cryosphere & ice-sheet dynamics",
    authors: ["Munda, A.", "Azam, M. F.", "Wagnon, P.", "et al."],
    keywords: ["Chandra Basin", "Chhota Shigri", "HIMANSH", "Glacier Mass Balance", "Western Himalaya"],
    year: 2024,
    openAccess: true,
    paperUrl: "https://doi.org/10.5194/tc-18-5653-2024",
    pdfUrl: "https://tc.copernicus.org/articles/18/5653/2024/tc-18-5653-2024.pdf",
  },
  {
    id: "rp-005",
    title: "Structure of micrometazoan assemblages in the Larsemann Hills, Antarctica",
    abstract:
      "Ecological and molecular analysis of microbial and microscopic fauna inhabiting soil and aquatic habitats in the Larsemann Hills provides insights into biodiversity, colonisation, and environmental adaptations near Bharati Station.",
    journal: "Polar Biology",
    region: "Antarctica",
    theme: "Polar biology & ecosystems",
    authors: ["Velasco-Castrillón, A.", "Gibson, J. A. E.", "Stevens, M. I."],
    keywords: ["Larsemann Hills", "Microbial Diversity", "Polar Ecosystems", "Bharati Station", "Antarctica"],
    year: 2019,
    openAccess: false,
    paperUrl: "https://doi.org/10.1007/s00300-019-02557-6",
  },
  {
    id: "rp-006",
    title: "A geophysically constrained crustal element map of East Antarctica between Enderby Land and Princess Elizabeth Land",
    abstract:
      "Integration of airborne gravity, magnetic surveys, and bedrock topography models delineates tectonic provinces, Precambrian cratonic basements, and suture zones across Princess Elizabeth Land.",
    journal: "Precambrian Research",
    region: "Antarctica",
    theme: "Geology & solid-earth geophysics",
    authors: ["Ferraccioli, F.", "Armadillo, E.", "Jordan, T.", "et al."],
    keywords: ["Princess Elizabeth Land", "Crustal Architecture", "Aeromagnetic Geophysics", "East Antarctica", "Tectonics"],
    year: 2009,
    openAccess: false,
    paperUrl: "https://doi.org/10.1016/j.precamres.2008.10.006",
  },
  {
    id: "rp-007",
    title: "India in Antarctica: perspectives, programmes and achievements",
    abstract:
      "A comprehensive review of the evolution of the Indian Antarctic Programme, scientific station infrastructure, consultative status in the Antarctic Treaty System, and legal and policy frameworks.",
    journal: "Polar Record",
    region: "Antarctica",
    theme: "Policy, law & capacity building",
    authors: ["Pandey, P. C.", "Chaturvedi, S."],
    keywords: ["Indian Antarctic Act", "Antarctic Treaty System", "Polar Governance", "NCPOR", "Maitri"],
    year: 1994,
    openAccess: false,
    paperUrl: "https://doi.org/10.1017/S0032247400012201",
  },
  {
    id: "rp-008",
    title: "First year of practical experiences of the new Arctic AWIPEV-COSYNA cabled Underwater Observatory in Kongsfjorden, Spitsbergen",
    abstract:
      "In situ multi-sensor underwater observatory observations in Kongsfjorden, Svalbard provide long-term continuous hydrographic time-series capturing Atlantic Water inflow episodes and fjord dynamics.",
    journal: "Ocean Science",
    region: "Arctic",
    theme: "Southern Ocean & fjord systems",
    authors: ["Fischer, P.", "Schwanitz, M.", "Brand, M.", "et al."],
    keywords: ["Kongsfjorden", "IndARC", "Arctic Hydrography", "Underwater Observatory", "Svalbard"],
    year: 2017,
    openAccess: true,
    paperUrl: "https://doi.org/10.5194/os-13-259-2017",
    pdfUrl: "https://os.copernicus.org/articles/13/259/2017/os-13-259-2017.pdf",
  },
];

