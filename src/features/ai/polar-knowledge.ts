import { site, headlineStats, researchThemes, timeline, notices, publications } from "@/features/site/content";
import { expeditions, stations } from "@/features/expeditions/data";
import { datasets } from "@/features/repository/data";
import { modules } from "@/features/learning/data";
import type { ActionCard, TopicCategory } from "./types";

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  title: string;
  category: "stations" | "expeditions" | "repository" | "learning" | "media" | "about" | "policy" | "navigation" | "science" | "wildlife" | "climate";
  summary: string;
  detailedContent: string;
  actions: ActionCard[];
  relatedQuestions: string[];
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    name: "Research Stations",
    icon: "🏔️",
    prompts: [
      "What are India's research stations in Antarctica?",
      "Tell me about Himadri station in the Arctic",
      "What is HIMANSH station in the Himalayas?",
      "What was Dakshin Gangotri and where was it located?",
    ],
  },
  {
    name: "Expeditions & Science",
    icon: "🚢",
    prompts: [
      "What was the 44th Indian Antarctic Expedition (ISEA-44)?",
      "Tell me about Arctic research at Kongsfjorden",
      "How is the Indian monsoon connected to polar ice?",
      "What is the 57°E Southern Ocean hydrography line?",
    ],
  },
  {
    name: "Polar & Climate Physics",
    icon: "🌌",
    prompts: [
      "What are katabatic winds and how do they form?",
      "Explain the aurora australis and borealis",
      "How does ozone depletion happen over Antarctica?",
      "What is the AMOC and how does polar melting affect it?",
    ],
  },
  {
    name: "Polar Ecology & Geology",
    icon: "🐧",
    prompts: [
      "How do penguins and seals survive polar freezing?",
      "What did Antarctica look like during Gondwana?",
      "What are subglacial lakes like Lake Vostok?",
      "How does permafrost thawing trigger methane feedbacks?",
    ],
  },
  {
    name: "Data & Repositories",
    icon: "📊",
    prompts: [
      "How do I search and download datasets?",
      "How can researchers upload and submit data?",
      "What is the data embargo policy?",
      "What atmospheric and glaciology datasets are available?",
    ],
  },
  {
    name: "Law & Governance",
    icon: "⚖️",
    prompts: [
      "Explain the Indian Antarctic Act 2022",
      "What is the Antarctic Treaty System and Madrid Protocol?",
      "Can tourists visit Antarctica legally?",
      "Who operates the Polar Science Portal?",
    ],
  },
];

export const POLAR_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  // --- RESEARCH STATIONS ---
  {
    id: "station-maitri",
    keywords: ["maitri", "antarctica station", "schirmacher oasis", "queen maud land", "1989 station", "capacity 25", "second station", "lake priyadarshini"],
    title: "Maitri Research Station (Antarctica)",
    category: "stations",
    summary: "Commissioned in 1989 on the ice-free rocky Schirmacher Oasis in Queen Maud Land, Maitri is India's second Antarctic station and operates year-round with accommodation for 25 personnel.",
    detailedContent: `### 🏔️ Maitri Research Station (Antarctica)
- **Location**: Schirmacher Oasis, Queen Maud Land, East Antarctica (-70.7667° S, 11.7333° E)
- **Commissioned**: 1989 (India's 2nd Antarctic base)
- **Operating Capacity**: 25 researchers & winter-over team (year-round operations)
- **Key Scientific Focus**:
  1. **Atmospheric Physics**: Continuous surface energy balance, katabatic wind profiling, solar radiation flux, and ozone depletion monitoring.
  2. **Solid Earth Geophysics & Magnetism**: Seismological recording, GPS crustal deformation, and geomagnetic pulsations.
  3. **Polar Biology**: Limnological studies of freshwater lakes (Lake Priyadarshini) and microbial diversity in cold extremes.
  4. **Medicine & Human Physiology**: Cold-adaptation and isolation studies on overwintering expeditioners.
- **Support Facilities**: Clean laboratory modules, automatic weather stations, satellite telemetry, and Priyadarshini Lake water treatment.`,
    actions: [
      { id: "expeditions-page", title: "View Antarctic Expeditions", to: "/expeditions", label: "Browse Expeditions", icon: "expedition", badge: "44 Expeditions" },
      { id: "maitri-dataset", title: "Maitri Weather & Energy Dataset", to: "/repository/ds-maitri-awx-2024", label: "Open Dataset v2.1", icon: "dataset", badge: "NetCDF-4" },
    ],
    relatedQuestions: [
      "What is the difference between Maitri and Bharati stations?",
      "What weather data does Maitri produce?",
      "Where does Maitri get fresh water?",
    ],
  },
  {
    id: "station-bharati",
    keywords: ["bharati", "larsemann hills", "prydz bay", "2012 station", "modern station", "east antarctica", "capacity 47", "isro ground station"],
    title: "Bharati Research Station (Antarctica)",
    category: "stations",
    summary: "Commissioned in 2012 at Larsemann Hills in East Antarctica, Bharati is a state-of-the-art energy-efficient station housing 47 personnel for oceanographic, atmospheric, and satellite ground tracking science.",
    detailedContent: `### 🏢 Bharati Research Station (East Antarctica)
- **Location**: Larsemann Hills, Prydz Bay sector, East Antarctica (-69.4075° S, 76.1875° E)
- **Commissioned**: March 2012 (India's 3rd and most modern Antarctic base)
- **Operating Capacity**: 47 personnel during summer; 24 winter-over team
- **Key Architecture & Technology**:
  - Built with 134 modular prefabricated steel and composite containers wrapped in an insulated aerodynamic shell.
  - Minimizes environmental footprint with combined heat and power (CHP) units and biological wastewater recycling.
- **Scientific Priorities**:
  1. **Oceanography & Coastal Geoscience**: Prydz Bay ocean dynamics, sea-ice physics, and biogeochemistry.
  2. **Satellite Ground Station**: Receives high-resolution Earth observation telemetry for ISRO (NRSC).
  3. **Paleoclimate & Geomorphology**: Glacial history from lake and marine sediment cores.`,
    actions: [
      { id: "expeditions-bharati", title: "ISEA-44 Traverse & Science", to: "/expeditions/isea-44-maitri-bharati-traverse", label: "ISEA-44 Expedition Details", icon: "expedition", badge: "Antarctic" },
      { id: "explore-globe", title: "Explore on 3D Globe", to: "/", label: "View on Globe", icon: "globe" },
    ],
    relatedQuestions: [
      "How far is Bharati from Maitri?",
      "What satellite data does Bharati download for ISRO?",
      "What are the living conditions at Bharati?",
    ],
  },
  {
    id: "station-dakshin-gangotri",
    keywords: ["dakshin gangotri", "first station", "1983", "buried in ice", "historic station", "dr sz qasim", "ice shelf"],
    title: "Dakshin Gangotri (Historical First Station)",
    category: "stations",
    summary: "India's first scientific base in Antarctica, established on the Princess Astrid Ice Shelf in 1983 during the 3rd expedition. It operated until 1988 before being submerged by snow and decommissioned as a heritage/transit marker.",
    detailedContent: `### ❄️ Dakshin Gangotri (Historic First Antarctic Base)
- **Established**: 1983–84 on the ice shelf in Queen Maud Land (-70.08° S, 12.00° E).
- **Historic Significance**: Marked India's permanent scientific presence in Antarctica, leading to Consultative Party status in the Antarctic Treaty System.
- **Decommissioning**: In 1988–89, accumulating ice and firn burial led to the construction of Maitri on solid rock. Dakshin Gangotri is now preserved as a historic site and fuel storage depot.`,
    actions: [
      { id: "about-history", title: "Program History & Timeline", to: "/about", label: "View Timeline Since 1981", icon: "about" },
    ],
    relatedQuestions: [
      "When did India join the Antarctic Treaty?",
      "Who led the first Indian Antarctic expedition?",
    ],
  },
  {
    id: "station-himadri",
    keywords: ["himadri", "arctic station", "svalbard", "ny-alesund", "2008 station", "norway", "kongsfjorden", "capacity 8"],
    title: "Himadri Research Station (Arctic, Svalbard)",
    category: "stations",
    summary: "Established in 2008 at Ny-Ålesund, Svalbard, Norway, Himadri is India's dedicated Arctic research station investigating atmospheric aerosols, glacier-fjord dynamics, and teleconnections with the Indian monsoon.",
    detailedContent: `### 🌐 Himadri Station (Ny-Ålesund, Svalbard, Arctic)
- **Location**: Ny-Ålesund, Spitsbergen, Svalbard (78.9231° N, 11.9226° E) — the northernmost civil research settlement in the world.
- **Inaugurated**: 1 July 2008
- **Capacity**: 8 scientists during campaign seasons (operates spring, summer, and autumn).
- **Core Research Programs**:
  1. **Arctic-Monsoon Teleconnections**: Investigating how rapid Arctic sea-ice retreat and polar jet-stream shifts influence the timing and strength of the Indian summer monsoon.
  2. **Atmospheric Aerosols & Black Carbon**: Real-time continuous sampling with aethalometers, tracking long-range transport of South Asian and Eurasian pollutants.
  3. **Kongsfjorden Glacier-Fjord Dynamics**: Monitoring glacier retreat (Vestre Brøggerbreen, Kronebreen) and freshwater influx into the high Arctic marine system.
  4. **Cryoconite & Cold-Adapted Biology**: Microbial ecology and genomic adaptations in cryoconite holes.`,
    actions: [
      { id: "iarc-expedition", title: "Arctic Campaign Details (IARC-2025)", to: "/expeditions/iarc-2025-himadri-summer", label: "IARC-2025 Campaign", icon: "expedition", badge: "Arctic" },
      { id: "himadri-data", title: "Kongsfjorden CTD & Black Carbon Dataset", to: "/repository/ds-himadri-bc-aerosol", label: "View Aerosol Data", icon: "dataset" },
    ],
    relatedQuestions: [
      "How is the Arctic connected to Indian weather?",
      "What is IndARC mooring in Svalbard?",
      "Can Indian university students do research at Himadri?",
    ],
  },
  {
    id: "station-himansh",
    keywords: ["himansh", "himalayan station", "third pole", "spiti valley", "himachal pradesh", "chandra basin", "4080m", "2016 station", "sutri dhaka"],
    title: "HIMANSH High-Altitude Research Station (Himalayas)",
    category: "stations",
    summary: "Established in 2016 at 4,080 meters altitude in Spiti Valley, Himachal Pradesh, HIMANSH is India's premier third-pole research facility for monitoring Himalayan glaciers and glacio-hydrology.",
    detailedContent: `### 🏔️ HIMANSH Station (Spiti Valley, Himalayas — Third Pole)
- **Location**: Sutri Dhaka, Chandra Basin, Spiti Valley, Himachal Pradesh (32.4167° N, 77.6167° E) at 4,080 m above sea level.
- **Inaugurated**: 2016 by NCPOR / Ministry of Earth Sciences
- **Capacity**: 15 researchers and glaciology field teams.
- **Scientific Significance**:
  - The Himalayas are known as the **"Third Pole"**, storing the largest volume of ice outside the Polar regions and feeding major South Asian river systems (Indus, Ganges, Brahmaputra).
  - HIMANSH provides a permanent base for in-situ mass-balance measurements on benchmark glaciers (Sutri Dhaka, Batal, Bara Shigri, Samudra Tapu).
  - Uses automatic weather stations, proglacial discharge flumes, sub-surface ice radar, and UAV photogrammetry (3D DEM mapping).`,
    actions: [
      { id: "himex-expedition", title: "Himalayan Cryosphere Campaign", to: "/expeditions/himex-2024-chandra-basin", label: "HIMEX Campaign Info", icon: "expedition", badge: "Himalaya" },
      { id: "chandra-data", title: "Chandra Basin Glaciology Dataset", to: "/repository/ds-chandra-mass-balance", label: "Glacier Mass Balance Data", icon: "dataset" },
    ],
    relatedQuestions: [
      "Why is the Himalaya called the Third Pole?",
      "What is glacier mass balance?",
      "Which rivers depend on Himalayan glaciers?",
    ],
  },
  {
    id: "station-indarc",
    keywords: ["indarc", "mooring", "kongsfjorden", "underwater observatory", "sub-surface", "polar night", "salinity", "temperature", "2014"],
    title: "IndARC Sub-Surface Moored Observatory (Arctic)",
    category: "stations",
    summary: "Deployed in 2014 in Kongsfjorden, Svalbard, IndARC is India's multi-sensor underwater moored observatory that records seawater temperature, salinity, and currents year-round through the dark polar winter.",
    detailedContent: `### 🌊 IndARC Underwater Observatory
- **Location**: Kongsfjorden, Svalbard (79.0° N, 12.2° E) at ~192 m water depth.
- **Commissioned**: July 2014
- **How it works**: A submerged mooring line anchored to the fjord seabed equipped with CTD sensors (conductivity-temperature-depth), ADCP current profilers, and nutrient sensors.
- **Why it matters**: Before IndARC, measurements were only taken in the Arctic summer. IndARC captures the critical winter influx of warm Atlantic water into the fjord during the 24-hour polar night.`,
    actions: [
      { id: "repository-ocean", title: "Search Oceanography Datasets", to: "/repository?theme=Oceanography", label: "Browse Ocean Datasets", icon: "dataset" },
    ],
    relatedQuestions: [
      "What does CTD mean in oceanography?",
      "How does Atlantic water reach the Arctic?",
    ],
  },

  // --- POLAR PHYSICS, CLIMATE & ATMOSPHERE ---
  {
    id: "science-katabatic-winds",
    keywords: ["katabatic winds", "gravity wind", "antarctic wind", "blizzard", "slope wind", "inversion", "maitri wind", "polar wind"],
    title: "Katabatic Winds: Antarctica's Fierce Gravity Winds",
    category: "science",
    summary: "Katabatic winds are high-density, gravity-driven drainage winds that form when air cools intensely over the high Antarctic ice plateau and plunges down steep coastal slopes at speeds exceeding 200 km/h.",
    detailedContent: `### 💨 Katabatic Winds: Mechanics and Impact
- **Physical Mechanism**:
  1. Radiative cooling over the high Antarctic ice sheet (2,000–4,000 m elevation) creates a shallow, extremely dense layer of sub-zero air with a strong thermal inversion.
  2. Under the pull of gravity, this dense cold air cascades down sloping glacier valleys toward the coast.
  3. Valley constriction creates a funneling Venturi effect, accelerating wind speeds into hurricane force (>200 km/h).
- **Scientific Significance**:
  - Drives massive offshore sea-ice formation, creating coastal **polynyas** (open water areas) where intense brine rejection forms **Antarctic Bottom Water (AABW)**.
  - Continuous katabatic boundary-layer measurements at **Maitri** provide real-time surface energy balance calibrations for global climate models.`,
    actions: [
      { id: "maitri-awx", title: "Maitri Radiation & Wind Data", to: "/repository/ds-maitri-awx-2024", label: "Maitri AWS Dataset", icon: "dataset" },
      { id: "exp-isea44", title: "Katabatic Studies during ISEA-44", to: "/expeditions/isea-44-maitri-bharati-traverse", label: "ISEA-44 Traverse", icon: "expedition" },
    ],
    relatedQuestions: [
      "How fast can katabatic winds blow?",
      "What is a coastal polynya?",
      "How do researchers survive katabatic storms at Maitri?",
    ],
  },
  {
    id: "science-aurora",
    keywords: ["aurora", "aurora australis", "aurora borealis", "southern lights", "northern lights", "solar wind", "magnetosphere", "geomagnetic storm"],
    title: "Aurora Australis & Borealis: Polar Lights Physics",
    category: "science",
    summary: "Auroras are luminous upper-atmospheric phenomena caused when charged solar wind particles collide with oxygen and nitrogen atoms along Earth's converging geomagnetic field lines in polar regions.",
    detailedContent: `### 🌌 The Science of Polar Auroras
- **The Process**:
  1. Coronal mass ejections and solar winds emit high-energy electrons and protons toward Earth.
  2. Earth's **magnetosphere** funnels these particles along magnetic field lines into the polar ovals (Arctic and Antarctic).
  3. Charged particles collide with atmospheric gas molecules at 80–500 km altitudes, exciting them to higher energy states. When decaying back to ground state, they emit light photons.
- **Color Signatures**:
  - 🟢 **Green (557.7 nm)**: Atomic oxygen at ~100–150 km (most common).
  - 🔴 **Red (630.0 nm)**: High-altitude atomic oxygen at >200 km.
  - 🟣 **Blue/Purple**: Ionized molecular nitrogen at lower altitudes.
- **Research at Indian Bases**:
  - Maitri and Bharati operate riometers, fluxgate magnetometers, and all-sky cameras to track space weather impacts on satellite GPS communications.`,
    actions: [
      { id: "globe-aurora", title: "View Polar Stations on Globe", to: "/", label: "Interactive 3D Globe", icon: "globe" },
      { id: "media-aurora", title: "Polar Photo & Media Gallery", to: "/media", label: "Explore Media", icon: "media" },
    ],
    relatedQuestions: [
      "What is the difference between Aurora Borealis and Aurora Australis?",
      "Can geomagnetic storms disrupt electrical grids?",
    ],
  },
  {
    id: "science-ozone-hole",
    keywords: ["ozone hole", "cfc", "polar stratospheric clouds", "psc", "montreal protocol", "dobson units", "stratosphere", "chlorine", "recovery"],
    title: "The Antarctic Ozone Hole & Polar Stratospheric Chemistry",
    category: "science",
    summary: "The Antarctic ozone hole forms annually in the austral spring (September–October) due to catalytic destruction of ozone by chlorine radicals on the surfaces of icy Polar Stratospheric Clouds within the isolated polar vortex.",
    detailedContent: `### 🛡️ The Antarctic Ozone Hole: Physics & Recovery
- **Why Antarctica?**:
  - The Antarctic continent is circled by a strong, stable **Polar Vortex** that prevents warm air mixing and plunges stratospheric temperatures below -78°C.
  - These extreme temperatures trigger **Polar Stratospheric Clouds (PSCs)** (Type I nitric acid trihydrate and Type II water ice).
  - Inactive chlorine reservoirs ($HCl, ClONO_2$) react heterogeneously on PSC crystal surfaces into reactive $Cl_2$. When spring sunlight arrives in September, UV photolysis releases free chlorine radicals ($Cl^\bullet$) that destroy up to 70% of local ozone.
- **Montreal Protocol & Healing**:
  - Thanks to the phase-out of CFCs under the 1987 Montreal Protocol, the ozone layer is gradually healing and is projected to return to 1980 levels by ~2066 over Antarctica.
- **Indian Contributions**: Continuous ozonesonde balloon launches and Brewer spectrophotometer measurements from **Maitri Station** have tracked the hole's boundary since the 1980s.`,
    actions: [
      { id: "repo-atmo", title: "Atmospheric Science Datasets", to: "/repository?theme=Atmospheric%20Science", label: "Atmospheric Datasets", icon: "dataset" },
      { id: "learn-poles", title: "Why India Studies the Poles", to: "/learning/why-india-studies-the-poles", label: "Start Learning Module", icon: "learning" },
    ],
    relatedQuestions: [
      "How is ozone thickness measured in Dobson Units (DU)?",
      "Why doesn't the Arctic develop as severe an ozone hole as Antarctica?",
    ],
  },
  {
    id: "science-amoc",
    keywords: ["amoc", "atlantic meridional overturning circulation", "thermohaline", "ocean conveyor", "salinity", "gulf stream", "tipping point", "freshening"],
    title: "AMOC & The Polar Ocean Conveyor Belt",
    category: "science",
    summary: "The Atlantic Meridional Overturning Circulation (AMOC) is the global ocean conveyor system driven by temperature and salinity gradients, which transports tropical warmth northward and deep cold water southward.",
    detailedContent: `### 🌊 AMOC, Thermohaline Circulation & Polar Melt
- **How AMOC Works**:
  1. Warm, saline tropical water flows northward via the Gulf Stream and North Atlantic Current.
  2. In the subpolar North Atlantic and Greenland-Norwegian seas, the water loses heat to the atmosphere, becomes extremely dense, and sinks (North Atlantic Deep Water — NADW).
  3. This deep water travels south toward the Southern Ocean, creating the global thermohaline conveyor belt.
- **Threat from Polar Melting**:
  - Rapid melting of the Greenland Ice Sheet and Arctic sea ice discharges massive volumes of low-density fresh water into the sinking zones.
  - This surface freshening impedes deep convection, weakening the AMOC.
- **Global & Indian Climate Impacts**:
  - A weakened AMOC can alter global precipitation belts, shift the Intertropical Convergence Zone (ITCZ) southward, and destabilize the Indian summer monsoon system.`,
    actions: [
      { id: "learning-monsoon", title: "Arctic Amplification & Monsoon Lesson", to: "/learning/arctic-amplification-and-the-monsoon", label: "Explore AMOC & Monsoon", icon: "learning" },
      { id: "repo-ocean", title: "Southern Ocean 57°E Hydrography", to: "/repository/ds-southern-ocean-57e", label: "Ocean Datasets", icon: "dataset" },
    ],
    relatedQuestions: [
      "What would happen if the AMOC collapsed?",
      "How does Southern Ocean deep water formation compare to the North Atlantic?",
    ],
  },

  // --- POLAR ECOLOGY, WILDLIFE & GEOLOGY ---
  {
    id: "wildlife-polar-adaptations",
    keywords: ["wildlife", "penguins", "seals", "polar bears", "krill", "blubber", "antifreeze glycoproteins", "emperor penguin", "weddell seal", "tardigrade", "moss"],
    title: "Polar Wildlife & Extreme Biochemical Adaptations",
    category: "wildlife",
    summary: "Polar organisms survive extreme sub-zero temperatures, intense salinity, and months of total darkness through unique evolutionary adaptations including antifreeze glycoproteins, countercurrent heat exchangers, and thick blubber layers.",
    detailedContent: `### 🐧 Polar Fauna & Biological Adaptations
1. **Antarctic Fauna**:
   - **Emperor & Adélie Penguins**: Countercurrent vascular heat exchangers in feet and nasal passages; multi-layered plumage insulating down to -60°C; huddled colonies sharing metabolic heat.
   - **Weddell & Leopard Seals**: Massive blubber layers (up to 10 cm); oxygen-binding myoglobin in muscles enabling dives beyond 600 meters for 80 minutes.
   - **Antarctic Krill (*Euphausia superba*)**: The keystone species with a collective biomass exceeding 400 million tonnes, feeding whales, seals, and seabirds.
   - **Notothenioid Icefish**: Produce **Antifreeze Glycoproteins (AFGPs)** that bind to nascent ice crystal faces in blood to prevent freezing at -1.9°C.
2. **Arctic Fauna**:
   - **Polar Bears (*Ursus maritimus*)**: Hollow translucent hair channeling UV light to black heat-absorbing skin; high-fat sea-ice hunting.
   - **Microbial Extremophiles**: Cryoconite communities on glaciers producing cold-active enzymes (proteases, lipases) with industrial bioprospecting potential studied by Indian researchers at Himadri.`,
    actions: [
      { id: "media-gallery", title: "Polar Wildlife Photo Gallery", to: "/media", label: "View Wildlife Media", icon: "media" },
      { id: "bio-datasets", title: "Polar Biology Datasets", to: "/repository?theme=Biology%20%26%20Ecology", label: "Biology Datasets", icon: "dataset" },
    ],
    relatedQuestions: [
      "Why don't penguin feet freeze on ice?",
      "Are there polar bears in Antarctica?",
      "What are cold-adapted enzymes used for in biotechnology?",
    ],
  },
  {
    id: "geology-gondwana-antarctica",
    keywords: ["gondwana", "transantarctic mountains", "fossil", "plate tectonics", "gamburtsev", "subglacial lake", "lake vostok", "meteorite", "geology"],
    title: "Antarctic Geology, Gondwana & Subglacial Secrets",
    category: "science",
    summary: "200 million years ago, Antarctica sat at the center of the Gondwana supercontinent connected to India, Australia, and Africa, boasting lush temperate rainforests and dinosaurs.",
    detailedContent: `### 🌍 Antarctica's Deep Geologic History & Subglacial Lakes
- **Gondwana Connection (India–Antarctica Link)**:
  - Eastern Antarctica (Enderby Land, Larsemann Hills where **Bharati Station** sits) and the Eastern Ghats of India were once directly contiguous within the Gondwana supercontinent.
  - Paleomagnetic and granulite-facies metamorphic rock matches prove India separated from East Antarctica ~130 million years ago.
- **Fossil Evidence**:
  - Glossopteris flora and dinosaur fossils (*Cryolophosaurus*) discovered in the Transantarctic Mountains prove Antarctica was once ice-free and temperate.
- **Subglacial Lakes & Mountains**:
  - Hidden beneath 3–4 km of ice lie over 400 subglacial lakes (such as **Lake Vostok** and Lake Mercer) kept liquid by geothermal heat and immense overburden pressure.
  - The **Gamburtsev Subglacial Mountains** are a ghost mountain range the size of the European Alps entirely buried under the East Antarctic Ice Sheet.
- **Meteorite Blue-Ice Traps**:
  - Ice sheet flow pushes meteorites against mountain barriers, where wind ablation exposes ancient space rocks (Indian teams have recovered hundreds of meteorites during Antarctic traverses).`,
    actions: [
      { id: "geo-datasets", title: "Geology & Geophysics Datasets", to: "/repository?theme=Geology%20%26%20Geophysics", label: "Geological Datasets", icon: "dataset" },
      { id: "isea44-exp", title: "Blue-Ice Meteorite Recovery in ISEA-44", to: "/expeditions/isea-44-maitri-bharati-traverse", label: "ISEA-44 Expedition", icon: "expedition" },
    ],
    relatedQuestions: [
      "How did India and Antarctica separate?",
      "Is there life inside subglacial lakes under the ice?",
      "Why is Antarctica the best place on Earth to find meteorites?",
    ],
  },
  {
    id: "climate-permafrost-thaw",
    keywords: ["permafrost", "methane", "feedback loop", "arctic amplification", "greenhouse gas", "thawing permafrost", "carbon cycle"],
    title: "Permafrost Thaw & Methane Climate Feedbacks",
    category: "climate",
    summary: "Permafrost holds an estimated 1,500 billion tonnes of organic carbon — nearly double the amount currently in Earth's atmosphere — which risks releasing potent methane as the Arctic warms.",
    detailedContent: `### 🌡️ Permafrost Thaw & The Climate Feedback Loop
- **What is Permafrost?**: Ground (soil, sediment, or rock with organic ice) that remains frozen at or below 0°C for at least two consecutive years.
- **The Methane Time Bomb**:
  1. As Arctic temperatures rise at 3-4x the global rate (Arctic Amplification), the active layer deepens and ancient permafrost thaws.
  2. Anaerobic microbial decomposition of thawed organic matter in thermokarst lakes releases **methane ($CH_4$)**, which has a global warming potential 28–36x greater than $CO_2$ over 100 years.
  3. Increased warming causes further thaw, generating a self-reinforcing **positive feedback loop**.
- **Infrastructure Risk**: Coastal erosion, foundation collapse, and damage to Arctic research settlements across Svalbard and Siberia.`,
    actions: [
      { id: "learn-arctic", title: "Arctic Amplification & Monsoon Module", to: "/learning/arctic-amplification-and-the-monsoon", label: "Take Arctic Lesson", icon: "learning" },
      { id: "himadri-page", title: "Himadri Arctic Research", to: "/expeditions/iarc-2025-himadri-summer", label: "View Arctic Science", icon: "expedition" },
    ],
    relatedQuestions: [
      "How much carbon is trapped in Arctic permafrost?",
      "What is a thermokarst lake?",
    ],
  },

  // --- EXPEDITIONS ---
  {
    id: "expedition-isea-44",
    keywords: ["isea-44", "44th expedition", "antarctic expedition", "vasiliy golovnin", "dr meenakshi rawat", "firn core", "meteorite", "sor rondane"],
    title: "44th Indian Scientific Expedition to Antarctica (ISEA-44)",
    category: "expeditions",
    summary: "Conducted in 2024–25 with 96 participants aboard MV Vasiliy Golovnin, ISEA-44 successfully retrieved a 68m firn core, recovered 9 blue-ice meteorites, and re-occupied 12 GNSS bedrock uplift benchmarks.",
    detailedContent: `### 🚢 44th Indian Scientific Expedition to Antarctica (ISEA-44)
- **Season**: Austral Summer 2024–25 (Departed Nov 2024, returned March 2025)
- **Vessel**: MV Vasiliy Golovnin
- **Expedition Leader**: Dr. Meenakshi Rawat (NCPOR, Goa)
- **Team**: 96 scientists, engineers, logistics experts, and Indian Navy personnel
- **Major Highlights & Discoveries**:
  1. **68.4 m Firn Core (PC-44/03)**: Recovered with 96% quality from the inland plateau, reaching back to approximately 1815 CE (Tambora eruption era).
  2. **Meteorite Prospecting**: 9 meteorite fragments collected from blue-ice fields south of the Gruber Mountains.
  3. **Automatic Weather Station Cluster**: 5-month uninterrupted record of four-component radiation and boundary-layer winds at Maitri.
  4. **GNSS Bedrock Uplift**: Re-occupied 12 geodetic markers to measure glacial isostatic adjustment.`,
    actions: [
      { id: "isea44-detail", title: "Full ISEA-44 Expedition Page", to: "/expeditions/isea-44-maitri-bharati-traverse", label: "View Expedition Record", icon: "expedition" },
      { id: "firn-core-data", title: "Firn Core PC-44/03 Dataset", to: "/repository/ds-firn-core-pc4403", label: "Open Firn Core Data", icon: "dataset", badge: "Glaciology" },
    ],
    relatedQuestions: [
      "How do scientists find meteorites in Antarctica?",
      "Who can participate in Indian Antarctic expeditions?",
      "What is firn coring?",
    ],
  },
  {
    id: "expedition-soe-12",
    keywords: ["soe-12", "southern ocean", "57e", "orv sagar nidhi", "dr nivedita bose", "carbon sink", "hydrography", "argo floats"],
    title: "12th Southern Ocean Expedition (SOE-12)",
    category: "expeditions",
    summary: "Conducted aboard ORV Sagar Nidhi across the 57°E repeat hydrographic section from Mauritius to the Antarctic coast, measuring ocean carbon absorption and biogeochemical changes.",
    detailedContent: `### 🌊 12th Southern Ocean Expedition (SOE-12)
- **Vessel**: ORV Sagar Nidhi (MoES research ship)
- **Transect**: Repeat 57°E meridional section (from 40°S Subtropical Front to 66°S Antarctic Divergence)
- **Lead Scientist**: Dr. Nivedita Bose (NCPOR, Goa)
- **Key Findings**:
  - The Southern Ocean accounts for over 40% of the global ocean uptake of anthropogenic CO₂.
  - SOE-12 deployed 6 BGC-Argo profiling floats with pH and nitrate sensors.
  - Documented deep-water freshening and carbon-inventory trends over a 20-year baseline.`,
    actions: [
      { id: "soe-expedition", title: "SOE-12 Expedition Profile", to: "/expeditions/soe-12-57e-repeat-hydrography", label: "SOE-12 Details", icon: "expedition" },
      { id: "soe-dataset", title: "57°E Southern Ocean Hydrography v3.0", to: "/repository/ds-southern-ocean-57e", label: "Download CTD & Carbon Data", icon: "dataset" },
    ],
    relatedQuestions: [
      "Why is the Southern Ocean important for global climate?",
      "What is an Argo float?",
    ],
  },

  // --- DATA REPOSITORY & DOWNLOADS ---
  {
    id: "repository-guide",
    keywords: ["repository", "datasets", "download data", "how to search", "doi", "netcdf", "csv", "geotiff", "access level", "license"],
    title: "Data Repository & Download Guidelines",
    category: "repository",
    summary: "The Polar Science Data Repository hosts 1,286+ quality-controlled datasets across 5 scientific themes. Metadata is 100% public, and open datasets can be downloaded immediately with full DOI citations.",
    detailedContent: `### 📊 Polar Data Repository Overview
- **Total Cataloged Datasets**: 1,286 curated records
- **Scientific Themes**:
  1. **Glaciology**: Mass balance, ice velocity, firn cores, snow depth.
  2. **Atmospheric Science**: Aerosols, black carbon, radiation flux, AWS meteorology, ozonesondes.
  3. **Oceanography**: CTD casts, bottle salinity, dissolved inorganic carbon, ADCP currents.
  4. **Biology & Ecology**: 16S rRNA sequences, zooplankton counts, microbial enzymes.
  5. **Geology & Geophysics**: Aeromagnetic surveys, GNSS geodesy, bedrock mineralogy.
- **Access Tiers**:
  - 🟢 **Open**: Immediate download under CC BY 4.0 (requires simple citation of DOI).
  - 🟡 **Registered**: Requires signing in with a Researcher or Student account.
  - 🔴 **Restricted / Embargoed**: Under the standard 24-month field embargo; researchers can submit an access request through the portal.`,
    actions: [
      { id: "browse-repository", title: "Search Knowledge Repository", to: "/repository", label: "Open Data Repository", icon: "dataset" },
      { id: "upload-data", title: "Submit / Upload Research Data", to: "/repository/upload", label: "Researcher Upload Portal", icon: "upload" },
    ],
    relatedQuestions: [
      "How do I cite a dataset in my paper?",
      "What is the maximum data embargo period?",
      "What file formats are accepted for upload?",
    ],
  },
  {
    id: "repository-upload-policy",
    keywords: ["upload", "submission", "embargo", "data policy", "submit dataset", "metadata", "netcdf", "geotiff", "24 months"],
    title: "Data Submission & Embargo Policy",
    category: "repository",
    summary: "All MoES-funded polar research teams must deposit raw and processed data within 12 months of campaign return. An embargo of up to 24 months protects initial publication rights.",
    detailedContent: `### 📤 Data Deposit & Sharing Policy
- **Mandate**: Every expeditioner funded by MoES / NCPOR must submit datasets, field logs, and calibration metadata to the national repository.
- **Embargo Rules**:
  - Metadata and abstract are published immediately upon submission.
  - Raw/processed data files may be embargoed for up to **24 months** from the end of the field season to allow PIs time to publish peer-reviewed papers.
- **Accepted Formats**:
  - Time series & Gridded: NetCDF-4 (CF-compliant), CSV, Parquet.
  - Geospatial & Imagery: GeoTIFF, GeoJSON, Shapefile.
  - Geophysics: SEGY, LAS.
  - Genomics: FASTA, FASTQ, BAM with NCBI/ENA accession cross-references.`,
    actions: [
      { id: "upload-form", title: "Start Data Upload", to: "/repository/upload", label: "Go to Upload Form", icon: "upload" },
    ],
    relatedQuestions: [
      "Can foreign collaborators upload data?",
      "How is a DOI assigned to my dataset?",
    ],
  },

  // --- LEARNING & OUTREACH ---
  {
    id: "learning-modules",
    keywords: ["learning", "modules", "quiz", "students", "education", "ice core", "monsoon", "antarctic treaty", "certificate"],
    title: "Interactive Learning Modules & Quizzes",
    category: "learning",
    summary: "5 interactive, gamified learning modules created for school students, undergraduates, and teachers covering polar physics, ice cores, monsoon connections, and the Antarctic Treaty.",
    detailedContent: `### 🎓 Interactive Learning Catalog
1. **Why India studies the poles** (Foundation · 18 min)
   - Teleconnections with the Indian monsoon, sea-level rise risks along India's 7,500 km coastline, and historical expedition milestones.
2. **Reading an ice core** (Intermediate · 25 min)
   - Firn compaction, stable isotope thermometry ($\delta^{18}\text{O} / \delta\text{D}$), volcanic ash horizons (tephrochronology), and black carbon layers.
3. **Arctic amplification & the monsoon** (Intermediate · 20 min)
   - Albedo feedback loops, jet-stream waviness, Rossby waves, and precipitation shifts over the Indian subcontinent.
4. **The Southern Ocean carbon engine** (Advanced · 30 min)
   - Subantarctic Mode Water, biological carbon pump, ocean acidification, and Antarctic Bottom Water formation.
5. **The Antarctic Treaty & Indian law** (Foundation · 15 min)
   - Peace, science, nuclear bans, Protocol on Environmental Protection (Madrid Protocol), and the **Indian Antarctic Act 2022**.`,
    actions: [
      { id: "open-learning", title: "Explore Learning Modules", to: "/learning", label: "Browse All Modules & Quizzes", icon: "learning" },
      { id: "take-ice-core-module", title: "Lesson: Reading an Ice Core", to: "/learning/reading-an-ice-core", label: "Start Ice Core Lesson", icon: "learning" },
    ],
    relatedQuestions: [
      "Do I get a score or certificate for completing quizzes?",
      "What is Arctic amplification?",
      "How do isotopes reveal past temperature in ice cores?",
    ],
  },

  // --- POLICY & GOVERNANCE ---
  {
    id: "policy-antarctic-act",
    keywords: ["indian antarctic act 2022", "treaty", "law", "permit", "penalty", "madrid protocol", "environmental clearance"],
    title: "The Indian Antarctic Act 2022 & Governance",
    category: "policy",
    summary: "Enacted in 2022, the Indian Antarctic Act gives domestic legal force to India's commitments under the Antarctic Treaty and the Madrid Protocol on Environmental Protection.",
    detailedContent: `### ⚖️ The Indian Antarctic Act 2022
- **Enacted**: August 2022 by the Parliament of India.
- **Significance**: First comprehensive domestic legislation in India specifically governing activities in Antarctica.
- **Key Provisions**:
  1. **Permit Requirement**: Prohibits any Indian citizen, vessel, aircraft, or expedition from entering Antarctica without a formal permit issued by the Committee on Antarctic Governance and Environmental Protection.
  2. **Environmental Protection**: Strict ban on introducing non-native species, open burning of waste, commercial mineral extraction, or harming wildlife (penguins, seals, petrels).
  3. **Jurisdiction & Legal Penalties**: Establishes designated courts in India to prosecute environmental violations, unauthorized entry, or unlawful waste discharge in the Treaty area south of 60°S latitude.`,
    actions: [
      { id: "about-page", title: "About MoES & Governance", to: "/about", label: "Read About Mandate", icon: "about" },
    ],
    relatedQuestions: [
      "Can tourists travel to Antarctica under Indian law?",
      "What is the Madrid Protocol?",
      "Is mining allowed in Antarctica?",
    ],
  },

  // --- ORGANIZATION & CONTACT ---
  {
    id: "about-ncpor-moes",
    keywords: ["ncpor", "moes", "ministry of earth sciences", "goa", "headquarters", "nodal agency", "contact", "desk"],
    title: "NCPOR & Ministry of Earth Sciences (MoES)",
    category: "about",
    summary: "The National Centre for Polar and Ocean Research (NCPOR) located in Vasco da Gama, Goa, is India's autonomous nodal agency under the Ministry of Earth Sciences governing all polar activities.",
    detailedContent: `### 🏛️ Ministry of Earth Sciences & NCPOR Goa
- **Ministry**: Ministry of Earth Sciences (MoES), Government of India, New Delhi.
- **Nodal Agency**: National Centre for Polar and Ocean Research (NCPOR), Headland Sada, Vasco da Gama, Goa 403804.
- **Established**: 1998 (originally NCAOR, renamed NCPOR in 2018).
- **Core Desks & Inquiries**:
  - **Polar Data Centre**: \`polardata@ncpor.res.in\` (DOI queries, metadata, format standards)
  - **Expedition Logistics Office**: \`expeditions@ncpor.res.in\` (Berth allocations, medical screenings, proposal calls)
  - **Media & Outreach Desk**: \`+91 832 252 5501\` (Filming permissions, photo archives, educational kits)`,
    actions: [
      { id: "contact-desk", title: "Contact Desks & Inquiries", to: "/contact", label: "Go to Contact Page", icon: "contact" },
      { id: "about-mandate", title: "About the Polar Programme", to: "/about", label: "About Page", icon: "about" },
    ],
    relatedQuestions: [
      "How do I submit a research proposal for the next expedition?",
      "Where is NCPOR located in India?",
    ],
  },
];
