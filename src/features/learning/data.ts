export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LessonSection {
  heading: string;
  body: string;
  takeaways?: string[];
}

export interface LearningModule {
  slug: string;
  title: string;
  level: "Foundation" | "Intermediate" | "Advanced";
  audience: string;
  minutes: number;
  summary: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

export const modules: LearningModule[] = [
  {
    slug: "why-india-studies-the-poles",
    title: "Why India studies the poles",
    level: "Foundation",
    audience: "School students (classes 8-12), general public",
    minutes: 18,
    summary:
      "India has run continuous polar research since 1981. This module explains the scientific and policy reasons a tropical country maintains stations at both ends of the Earth, and how polar change reaches the Indian monsoon and coastline.",
    sections: [
      {
        heading: "A tropical nation with polar stakes",
        body: "India's first Antarctic expedition sailed in 1981, and the country acceded to the Antarctic Treaty in 1983, gaining Consultative Party status the same year. Today the Ministry of Earth Sciences operates Maitri and Bharati in Antarctica, Himadri in the Arctic and HIMANSH in the Himalaya. The motivation is not exploration for its own sake: the polar regions regulate sea level, ocean circulation and atmospheric chemistry that directly shape Indian weather, fisheries and coastal risk.",
        takeaways: [
          "1981: first Indian Scientific Expedition to Antarctica",
          "1983: Antarctic Treaty accession and Consultative Party status",
          "2022: the Indian Antarctic Act gives domestic legal force to Treaty obligations",
        ],
      },
      {
        heading: "The monsoon connection",
        body: "Snow and sea-ice extent in the Northern Hemisphere alters the land-sea temperature contrast that drives the Indian summer monsoon. Reduced Arctic sea ice modifies the polar jet stream, which can shift mid-latitude circulation and the position of monsoon troughs. Measurements from Himadri contribute to a network that helps quantify these teleconnections rather than infer them from models alone.",
      },
      {
        heading: "Sea level and the Indian coastline",
        body: "India has roughly 7,500 km of coastline and dense low-lying population centres. Most of the water that will raise that coastline this century is currently stored as ice in Antarctica and Greenland. Ice-sheet mass balance measurements — GNSS bedrock uplift, firn cores, surface energy balance — reduce the uncertainty in sea-level projections used for Indian coastal planning.",
        takeaways: [
          "Antarctica holds ice equivalent to about 58 m of global sea-level rise",
          "Regional sea-level change differs from the global mean because of ocean dynamics and gravity effects",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "In which year did India launch its first scientific expedition to Antarctica?",
        options: ["1971", "1981", "1989", "2008"],
        answerIndex: 1,
        explanation:
          "The first Indian Scientific Expedition to Antarctica departed in 1981, led by Dr. S. Z. Qasim.",
      },
      {
        id: "q2",
        prompt: "Which Indian station is located in the Arctic?",
        options: ["Maitri", "Bharati", "Himadri", "HIMANSH"],
        answerIndex: 2,
        explanation:
          "Himadri, at Ny-Ålesund in Svalbard, has been India's Arctic research base since 2008.",
      },
      {
        id: "q3",
        prompt: "Why does Arctic sea-ice loss matter for the Indian monsoon?",
        options: [
          "It changes the Earth's orbit",
          "It alters land-sea temperature contrast and jet-stream behaviour",
          "It directly adds rainfall over India",
          "It has no plausible physical link",
        ],
        answerIndex: 1,
        explanation:
          "Sea-ice loss changes hemispheric temperature gradients and jet-stream waviness, which can shift monsoon circulation patterns.",
      },
    ],
  },
  {
    slug: "reading-an-ice-core",
    title: "Reading an ice core",
    level: "Intermediate",
    audience: "Undergraduate students, science teachers",
    minutes: 25,
    summary:
      "How a cylinder of compressed snow becomes a dated climate record: layer counting, stable-isotope thermometry, chemistry of dust and black carbon, and the assumptions that limit interpretation.",
    sections: [
      {
        heading: "From snow to firn to ice",
        body: "Fresh polar snow has a density near 100 kg/m³. Under its own weight it compacts into firn and then, typically between 50 m and 120 m depth depending on accumulation and temperature, into ice with sealed air bubbles. The depth at which bubbles close off sets a gas-age/ice-age difference that must be accounted for when comparing trapped greenhouse gases against the surrounding ice chemistry.",
      },
      {
        heading: "Dating the record",
        body: "Where annual accumulation is high enough, seasonal cycles in δ18O, sodium or dust give countable annual layers. Deeper or lower-accumulation sites rely on flow modelling, volcanic sulphate tie points from known eruptions, and cosmogenic isotopes. Indian core PC-44/03 from the Sør Rondane foothills was dated by annual layer counting to roughly 1815 CE, anchored against the sulphate spike from the Tambora eruption.",
        takeaways: [
          "High accumulation sites: annual layer counting",
          "Volcanic sulphate spikes provide absolute tie points",
          "Uncertainty grows with depth and decreasing layer thickness",
        ],
      },
      {
        heading: "Isotopes as a thermometer",
        body: "The ratio of 18O to 16O in precipitation depends on the temperature history of the air mass. Colder condensation yields isotopically lighter snow. Calibrating δ18O to temperature requires local precipitation-weighted relationships, because changes in moisture source or seasonality can mimic a temperature signal.",
      },
      {
        heading: "Black carbon and human fingerprints",
        body: "Refractory black carbon in polar snow records combustion sources thousands of kilometres away. In the Indian Ocean sector, rising concentrations after the mid-20th century track industrial and biomass-burning emissions. Because black carbon darkens snow, it also feeds back on melt through reduced albedo.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "What causes a gas-age/ice-age difference in an ice core?",
        options: [
          "Air bubbles close off well below the surface, so trapped gas is younger than the ice",
          "Gas diffuses upward faster than ice flows",
          "Measurement instruments lag behind",
          "Isotopes decay at different rates",
        ],
        answerIndex: 0,
        explanation:
          "Air circulates in the porous firn until bubble close-off, so the trapped gas is younger than the surrounding ice at the same depth.",
      },
      {
        id: "q2",
        prompt: "Which signal provides an absolute dating tie point in an ice core?",
        options: [
          "Mean annual density",
          "Volcanic sulphate spikes from known eruptions",
          "Core diameter",
          "Drill fluid residue",
        ],
        answerIndex: 1,
        explanation:
          "Well-dated eruptions such as Tambora (1815) leave a sulphate spike usable as an absolute chronological anchor.",
      },
      {
        id: "q3",
        prompt: "A more negative δ18O value in snow generally indicates:",
        options: ["Warmer condensation temperature", "Colder condensation temperature", "Higher wind speed", "More dust"],
        answerIndex: 1,
        explanation:
          "Heavier isotopes rain out preferentially, so colder condensation leaves precipitation isotopically lighter (more negative).",
      },
    ],
  },
  {
    slug: "sea-ice-and-the-southern-ocean",
    title: "Sea ice and the Southern Ocean carbon sink",
    level: "Advanced",
    audience: "Postgraduate researchers, data users",
    minutes: 32,
    summary:
      "The Southern Ocean absorbs a disproportionate share of anthropogenic carbon and heat. This module covers frontal structure, the seasonal sea-ice cycle, and how India's 57°E repeat section constrains carbon inventory change.",
    sections: [
      {
        heading: "Frontal structure along a meridional line",
        body: "Moving south along 57°E, underway thermosalinograph data reveal sharp gradients marking the Subtropical Front, Subantarctic Front and Polar Front. These fronts separate water masses with distinct nutrient and carbon signatures, and their meridional positions shift interannually with the Southern Annular Mode. Identifying front positions is a prerequisite for comparing repeat occupations, since a front that has migrated by two degrees can otherwise be misread as a property change.",
        takeaways: [
          "Frontal position must be diagnosed before comparing repeat sections",
          "The Southern Annular Mode is a leading driver of interannual frontal shifts",
        ],
      },
      {
        heading: "The seasonal ice machine",
        body: "Antarctic sea-ice extent swings from roughly 3 million km² in February to about 18 million km² in September. Brine rejection during freezing densifies surface water and contributes to Antarctic Bottom Water formation; summer melt caps the surface with fresh, stratified water that constrains nutrient supply and gas exchange. Both phases matter for carbon uptake, in opposite directions.",
      },
      {
        heading: "Quantifying carbon inventory change",
        body: "Comparing dissolved inorganic carbon from repeat occupations requires correcting for natural variability, water-mass mixing and measurement offsets. The extended multiple linear regression family of methods separates the anthropogenic component from natural DIC. Certified reference material must be run on every cruise leg for the inter-cruise offsets to be resolvable at the 2 µmol/kg level needed for decadal comparison.",
        takeaways: [
          "Run certified reference material every leg",
          "Separate anthropogenic from natural DIC before attributing change",
        ],
      },
      {
        heading: "Where BGC-Argo changes the picture",
        body: "Ship sections give high accuracy but poor temporal coverage, and almost none in winter. Biogeochemical Argo floats with pH and oxygen sensors fill the seasonal gap at lower accuracy. The productive approach is joint: use ship data to calibrate and validate float sensors, and use floats to extend the seasonal cycle where ships cannot go.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Approximately what is the September maximum of Antarctic sea-ice extent?",
        options: ["6 million km²", "10 million km²", "18 million km²", "30 million km²"],
        answerIndex: 2,
        explanation:
          "Antarctic sea-ice extent peaks near 18 million km² in September and falls to roughly 3 million km² in February.",
      },
      {
        id: "q2",
        prompt: "Why must frontal positions be diagnosed before comparing repeat hydrographic sections?",
        options: [
          "Fronts affect ship speed",
          "Meridional front migration can be mistaken for a property change",
          "Fronts invalidate salinity sensors",
          "Fronts only matter for biology",
        ],
        answerIndex: 1,
        explanation:
          "If a front has shifted between occupations, sampling the same latitude samples a different water mass — an apparent change that is really displacement.",
      },
      {
        id: "q3",
        prompt: "What is the main advantage of BGC-Argo floats over ship sections in the Southern Ocean?",
        options: [
          "Higher absolute accuracy",
          "Full-depth bottle chemistry",
          "Seasonal and winter coverage",
          "Direct sediment sampling",
        ],
        answerIndex: 2,
        explanation:
          "Floats profile year-round, including winter when ships are largely absent, at the cost of lower sensor accuracy.",
      },
    ],
  },
];

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}
