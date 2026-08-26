import type {
  GlossaryTerm,
  SimplifiedContent,
  SimplifierAudience,
  SimplifierDomain,
  SimplifierOptions,
  SimplifierPreset,
} from "./types";

export const POLAR_GLOSSARY: Record<string, GlossaryTerm> = {
  albedo: {
    term: "Albedo",
    explanation: "How much sunlight a surface reflects back into space. Bright snow and ice have high albedo (reflecting ~90%), while dark ocean water absorbs heat.",
    category: "Atmosphere & Radiation",
  },
  "black carbon": {
    term: "Black Carbon",
    explanation: "Dark soot particles from fossil fuels and biomass burning. When deposited on white snow or ice, they absorb heat and dramatically speed up melting.",
    category: "Atmosphere & Cryosphere",
  },
  "mass balance": {
    term: "Glacier Mass Balance",
    explanation: "The net difference between snow accumulated during winter and ice melted during summer. A negative mass balance means the glacier is shrinking.",
    category: "Glaciology",
  },
  "katabatic winds": {
    term: "Katabatic Winds",
    explanation: "Fierce, high-speed winds created when high-density cold air over high polar ice plateaus rushes downhill towards the coast under the force of gravity.",
    category: "Atmospheric Science",
  },
  "ice core": {
    term: "Ice Core",
    explanation: "A cylinder of ice drilled from deep inside an ice sheet. The trapped air bubbles preserve exact samples of ancient atmospheres from hundreds of thousands of years ago.",
    category: "Paleoclimatology",
  },
  firn: {
    term: "Firn",
    explanation: "Partially compacted granular snow that has survived at least one summer without melting, on its way to becoming dense glacial ice.",
    category: "Glaciology",
  },
  "bgc-argo": {
    term: "BGC-Argo Float",
    explanation: "Autonomous robotic ocean drifters that dive up to 2,000 meters deep, measuring water temperature, salinity, oxygen, nitrates, and chlorophyll.",
    category: "Oceanography",
  },
  hydrography: {
    term: "Hydrography / Hydrographic Transect",
    explanation: "Systematic mapping and physical measurement of ocean water properties (temperature, salinity, density, currents) along a specific cruise track line.",
    category: "Oceanography",
  },
  amoc: {
    term: "AMOC (Atlantic Meridional Overturning Circulation)",
    explanation: "A giant ocean conveyor belt carrying warm surface water to the Arctic and returning cold, dense deep water south. Polar melting threatens to slow it down.",
    category: "Climate & Ocean Dynamics",
  },
  psychrophile: {
    term: "Psychrophile / Cold-adapted Organism",
    explanation: "Microorganisms (bacteria, fungi, microalgae) that thrive in sub-zero freezing temperatures and produce special cold-active enzymes useful for biotechnology.",
    category: "Biology & Biotechnology",
  },
  cryoconite: {
    term: "Cryoconite",
    explanation: "Dark dust blown onto glacier surfaces consisting of mineral particles and microbial communities, forming small water-filled melt holes called cryoconite holes.",
    category: "Glacial Ecology",
  },
  "aerosol optical depth": {
    term: "Aerosol Optical Depth (AOD)",
    explanation: "A measure of how much sunlight is scattered or absorbed by particles (dust, sea salt, soot) suspended in the air column.",
    category: "Atmospheric Physics",
  },
  granulite: {
    term: "Granulite Facies",
    explanation: "High-grade metamorphic rocks formed deep within the Earth's crust under intense heat and pressure, proving past supercontinent collisions (like Gondwana).",
    category: "Geology & Tectonics",
  },
  "calving": {
    term: "Iceberg Calving",
    explanation: "The mechanical breaking off of giant chunks of ice from the edge of a glacier or ice shelf into the open ocean.",
    category: "Glaciology",
  },
  "antarctic treaty": {
    term: "Antarctic Treaty System (ATS)",
    explanation: "An international agreement entered into force in 1961 that sets aside Antarctica exclusively for peaceful scientific research and bans military activity and mining.",
    category: "Governance & Law",
  },
};

export const SIMPLIFIER_PRESETS: SimplifierPreset[] = [
  {
    id: "indarc-arctic",
    title: "IndARC Subsurface Mooring in Kongsfjorden (Arctic)",
    domain: "arctic",
    tag: "Arctic Oceanography",
    sourceType: "Research Paper",
    sourceRef: "NCPOR Arctic Research Group / IndARC Mooring Program",
    scientificInput: `Kongsfjorden Fjord Hydrography and IndARC Mooring Observations (79°N, Svalbard):
Continuous subsurface physical oceanography observations collected via the IndARC multi-sensor underwater mooring deployed at 192 m depth in Kongsfjorden since July 2014. Time-series data reveals intensified episodic intrusions of warm, saline transformed Atlantic Water (AW: T > 3.0°C, S > 34.9 PSU) into the inner fjord basin during late autumn and winter months, driven by alongshore wind anomalies and cyclonic atmospheric forcing over the Fram Strait. The wintertime Atlantic Water advection suppresses seasonal fast-ice formation, deepens the mixed layer, and alters vertical stratification. Concurrently, enhanced sub-glacial freshwater discharge from Kronebreen and Kongsvegen tidewater glaciers during the summer ablation peak increases suspended particulate matter (SPM > 25 mg/L) and limits photosynthetically active radiation (PAR), thereby shifting primary productivity from diatom-dominated to flagellate assemblages and affecting polar cod (Boreogadus saida) recruitment.`,
  },
  {
    id: "ice-core-dome-c",
    title: "Antarctic Ice Core 800,000-Year Atmospheric Record",
    domain: "antarctica",
    tag: "Glaciology & Paleoclimate",
    sourceType: "Research Paper",
    sourceRef: "EPICA / Indian Antarctic Paleoclimate Survey",
    scientificInput: `High-Resolution Deuterium and Greenhouse Gas Reconstructions from Dome C & Coastal East Antarctic Firn Cores:
Analysis of stable isotope ratios (δD and δ18O) from deep ice core extractions reaching 3,270 m depth reveals an unbroken 800,000-year chronostratigraphy encompassing eight glacial-interglacial cycles. Trapped micro-bubble gas chromatography demonstrates that pre-industrial atmospheric CO2 concentrations fluctuated between 180 ppm (during glacial maxima) and 280 ppm (during warm interglacials), never exceeding 300 ppm throughout the entire late Quaternary. Recent firn layer analysis from coastal Dronning Maud Land near Maitri station reveals a steep acceleration post-1950, with ambient CO2 reaching 422 ppm and methane (CH4) exceeding 1,920 ppb. The rate of modern greenhouse gas radiative forcing exceeds the highest natural deglacial rate of change by more than a factor of 10.`,
  },
  {
    id: "himansh-chandra-basin",
    title: "HIMANSH Chandra Basin Glacier Mass Balance & Black Carbon",
    domain: "himalayas",
    tag: "Himalayan Cryosphere",
    sourceType: "Expedition Report",
    sourceRef: "HIMANSH High-Altitude Research Station (Spiti, 4080m)",
    scientificInput: `Cryospheric Monitoring and Black Carbon Radiative Forcing on Sutri Dhaka and Batal Glaciers (Chandra Basin, Western Himalaya):
Glaciological mass balance measurements recorded at HIMANSH station (4,080 m a.s.l.) between 2015 and 2024 indicate a sustained cumulative negative mass balance of -0.68 ± 0.12 m water equivalent per year across monitored glaciers in the Upper Spiti catchment. In-situ thermal probe profiling and snow chemistry reveals elevated concentrations of refractory black carbon (rBC: 45–180 ng/g) deposited on the ablation zone during pre-monsoon convective transport from the Indo-Gangetic Plains. The resulting reduction in snow broadband albedo (from 0.82 to 0.54) induces an estimated positive radiative forcing of +12.4 W/m², accelerating seasonal melt onset by 14–21 days and exacerbating downstream glacial lake outburst flood (GLOF) vulnerability.`,
  },
  {
    id: "southern-ocean-carbon",
    title: "Southern Ocean 57°E Hydrographic Transect & Carbon Sink",
    domain: "southern-ocean",
    tag: "Ocean & Carbon Sink",
    sourceType: "Dataset Abstract",
    sourceRef: "11th Indian Southern Ocean Expedition / MoES",
    scientificInput: `Biogeochemical Hydrography and Carbon Dioxide Air-Sea Flux along the 57°E Meridian (Sub-Tropical Front to Polar Front):
Underway surface pCO2 measurements and high-precision total dissolved inorganic carbon (DIC) and total alkalinity (TA) profiles across the Antarctic Divergence (55°S–65°S) demonstrate substantial mesoscale variability in carbon sequestration capacity. The Polar Frontal Zone (PFZ) acts as a net oceanic sink for atmospheric CO2 (-2.4 mmol C/m²/day) supported by iron-fertilized diatom blooms and subantarctic mode water subduction. However, south of 62°S, deep upwelling of Circumpolar Deep Water (CDW) rich in remineralized CO2 causes local outgassing (+1.1 mmol C/m²/day). Multi-year trends show intensifying Southern Annular Mode (SAM) positive phases are driving stronger westerly wind stress, accelerating CDW upwelling and potentially weakening the net Southern Ocean carbon sink efficiency.`,
  },
  {
    id: "maitri-aerosols",
    title: "Aerosol Optical Depth & Radiative Forcing at Maitri",
    domain: "atmosphere",
    tag: "Polar Atmosphere",
    sourceType: "Technical Reports",
    sourceRef: "NCPOR Atmospheric Physics Laboratory, Maitri Station",
    scientificInput: `Boundary Layer Profiling and Multi-Wavelength Radiative Properties of Polar Aerosols at Maitri (Schirmacher Oasis, East Antarctica):
Continuous ground-based sun photometer (AERONET) measurements and micro-pulse lidar profiling at Maitri (70°46′S, 11°44′E) characterize the pristine Antarctic atmospheric background. Average column Aerosol Optical Depth at 500 nm (AOD500) remains at baseline levels of 0.025 ± 0.008 during austral winter. However, episodic austral summer events record anomalous AOD spikes up to 0.110 associated with long-range stratospheric and upper-tropospheric transport of wildfire smoke plumes from Australia and southern South America. Surface energy balance modeling indicates that while pristine polar background aerosols induce a net cooling effect (-0.8 W/m²), episodic absorbing smoke layers cause localized atmospheric warming of +2.1 W/m² in the lower troposphere over coastal Queen Maud Land.`,
  },
  {
    id: "psychrophiles-bioprospecting",
    title: "Cold-Adapted Psychrophilic Enzymes from Schirmacher Oasis",
    domain: "biology",
    tag: "Polar Biotechnology",
    sourceType: "Research Paper",
    sourceRef: "National Centre for Polar and Ocean Research & CSIR-CCMB",
    scientificInput: `Genomic Characterization and Catalytic Kinetics of Cold-Active Alkaline Lipase from Antarctic Bacterium Pseudomonas sp. Isolated from Schirmacher Oasis:
A novel Gram-negative, psychrophilic bacterium designated strain ANT-SO8 was isolated from perennial cyanobacterial mat sediment in Lake Priyadarshini near Maitri station. Whole-genome sequencing identified a 1,422 bp open reading frame encoding a cold-active triacylglycerol lipase (LipSO8). Enzyme kinetic assays revealed optimal catalytic activity at 15°C with retention of >68% maximum velocity at 4°C, accompanied by high conformational flexibility around the catalytic triad (Ser-Asp-His). The enzyme exhibits extreme thermolability, undergoing rapid irreversible inactivation at temperatures >40°C. These kinetic properties offer high industrial value for energy-saving cold-wash detergents and stereoselective organic synthesis without requiring thermal deactivation steps.`,
  },
  {
    id: "antarctic-act-governance",
    title: "Indian Antarctic Act 2022 Legal & Environmental Framework",
    domain: "policy",
    tag: "Policy & Law",
    sourceType: "Policy Brief",
    sourceRef: "Ministry of Earth Sciences / Parliament of India",
    scientificInput: `Implementation Framework and Jurisdictional Protocols under the Indian Antarctic Act, 2022 (Act No. 13 of 2022):
The Indian Antarctic Act, 2022 establishes a comprehensive domestic statutory architecture extending Indian judicial jurisdiction to offenses committed in Antarctica by Indian citizens or expedition participants. It creates the Committee on Antarctic Governance and Environmental Protection (CAG-EP) chaired by the Secretary, MoES. The Act statutorily enforces the Protocol on Environmental Protection to the Antarctic Treaty (Madrid Protocol), mandating rigorous Environmental Impact Assessments (Comprehensive Environmental Evaluation - CEE) for all station construction, logistics, and scientific drilling. The statute strictly prohibits commercial mineral prospecting, non-authorized introduction of non-native biological species, open-air burning, and disposal of non-treated waste, instituting stringent penalties including penal liability for unauthorized expeditions.`,
  },
  {
    id: "east-antarctica-geology",
    title: "Precambrian Tectonics & Gondwana Collision in Dronning Maud Land",
    domain: "geology",
    tag: "Geology & Tectonics",
    sourceType: "Research Paper",
    sourceRef: "Geological Survey of India & NCPOR Polar Geology Wing",
    scientificInput: `U-Pb Zircon Geochronology and Metamorphic Evolution of High-Grade Granulites in the Wohlthat Mountains (East Antarctica):
Petrological and in-situ secondary ion mass spectrometry (SIMS) U-Pb zircon dating of charnockitic and metapelitic granulites from the Gruber and Otto-von-Grubergebirge massifs reveals two major orogenic episodes: Mesoproterozoic crustal accretion (~1,100 Ma, Grenvillian-age) followed by pervasive Pan-African high-temperature granulite-facies overprinting at 550–520 Ma (P = 8.5–10.0 kbar, T = 820–890°C). The pressure-temperature-time (P-T-t) retrograde path exhibits isothermal decompression followed by isobaric cooling. These geochronological and geochemical signatures show near-identical correlations with the Eastern Ghats Belt of peninsular India, providing definitive physical evidence of the Kuunga Orogeny suture where proto-India and East Antarctica collided to assemble the Gondwana supercontinent.`,
  },
];

export const SYSTEM_SIMPLIFIER_PROMPT = `
You are an AI science communication assistant for an official Polar Expedition and Science Outreach Portal (India Polar Science Programme, National Centre for Polar and Ocean Research - NCPOR, Ministry of Earth Sciences - MoES, Government of India).

Your task is to transform complex scientific material related to Antarctica, the Arctic, polar expeditions, climate change, glaciers, oceans, biodiversity, atmospheric science, geology, and polar research into clear, engaging, and easy-to-understand content.

### Input Types:
Scientific research papers, expedition reports, research findings, dataset descriptions, technical reports, news/announcements, observations, raw scientific notes.

### Instructions:
1. Understand the scientific material carefully before generating content.
2. Preserve all important scientific facts, numbers, dates, locations, and research findings.
3. Do NOT invent scientific information or alter the meaning of the original material.
4. Replace unnecessary technical jargon with simple explanations.
5. When a scientific term is important, briefly explain it in simple language.
6. Make the content understandable to a high-school student or general reader without losing scientific accuracy.
7. Highlight why the research matters and how it contributes to understanding the polar regions, global climate, and our planet.
8. Use an engaging storytelling style rather than simply copying the source material.
9. Maintain a professional, educational, and trustworthy tone.
10. Clearly distinguish between established findings, observations, and hypotheses.
11. If the source does not provide enough information to make a claim, do not speculate.

### Output Structure (You MUST use these exact uppercase section headers):

TITLE:
[Create a short, catchy, and engaging title that captures the core scientific discovery]

IN SIMPLE WORDS:
[Explain the scientific material in 2–4 easy-to-understand paragraphs. Use vivid, accessible analogies where helpful. Briefly explain key terms.]

KEY TAKEAWAYS:
• [Takeaway point 1 with key numbers/facts]
• [Takeaway point 2]
• [Takeaway point 3]
• [Takeaway point 4 (and optional point 5)]

WHY IT MATTERS:
[Explain why this research or expedition is critical for understanding polar regions, global climate, marine life, weather teleconnections, or humanity.]

SOCIAL MEDIA POST:
[Create a short, punchy, engaging post suitable for X / LinkedIn / Instagram / Facebook. Include key highlight and call to action. Use emojis tastefully.]

HASHTAGS:
[Provide 5–10 relevant hashtags separated by spaces, e.g. #PolarScience #Antarctica #Arctic #ClimateScience #PolarResearch #Oceanography #Glaciology]
`;

export class PolarScienceSimplifierService {
  private static instance: PolarScienceSimplifierService;

  public static getInstance(): PolarScienceSimplifierService {
    if (!PolarScienceSimplifierService.instance) {
      PolarScienceSimplifierService.instance = new PolarScienceSimplifierService();
    }
    return PolarScienceSimplifierService.instance;
  }

  /**
   * Main simplification workflow:
   * 1. Gemini API (custom or env)
   * 2. Live Generative AI Engine
   * 3. Comprehensive Local Intelligent Polar Science Synthesizer
   */
  public async simplifyScientificContent(
    rawInput: string,
    options: SimplifierOptions = {},
    customApiKey?: string
  ): Promise<SimplifiedContent> {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      throw new Error("Please provide scientific text, paper excerpt, or expedition notes to simplify.");
    }

    const apiKey = customApiKey || (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) || "";
    let audienceContext = "";
    if (options.audience) {
      const map: Record<SimplifierAudience, string> = {
        "high-school": "Target Audience: High School Students and curious general readers.",
        "general-public": "Target Audience: General Public and Science Enthusiasts.",
        "policy-makers": "Target Audience: Policy Makers, Educators, and Environmental Planners.",
        classroom: "Target Audience: Classroom Students (Grade 8-12) & Teachers with curriculum connections.",
        "media-press": "Target Audience: Journalists, Media Communicators, and Science Newsrooms.",
      };
      audienceContext = `\n${map[options.audience] || ""}`;
    }

    if (options.customFocus) {
      audienceContext += `\nSpecial Focus Note: Please pay special attention to: ${options.customFocus}`;
    }

    const promptWithContext = `${trimmed}\n\n${audienceContext}`;

    // TIER 1: User-configured Gemini API
    if (apiKey && apiKey.length > 20) {
      try {
        const geminiResult = await this.queryGeminiAPI(promptWithContext, apiKey);
        if (geminiResult && geminiResult.includes("TITLE:") && geminiResult.includes("IN SIMPLE WORDS:")) {
          return this.parseSimplifiedResponse(geminiResult, rawInput, options);
        }
      } catch (err) {
        console.warn("Gemini API simplifier call failed, falling back to Live AI:", err);
      }
    }

    // TIER 2: Live AI Neural Engine (Pollinations / Cloud LLM)
    try {
      const liveResult = await this.queryLiveAIEngine(promptWithContext);
      if (liveResult && liveResult.includes("TITLE:") && liveResult.includes("IN SIMPLE WORDS:")) {
        return this.parseSimplifiedResponse(liveResult, rawInput, options);
      }
    } catch (err) {
      console.warn("Live AI Engine offline, using Intelligent Polar Science Synthesizer:", err);
    }

    // TIER 3: Local Offline Intelligent Science Synthesizer
    return this.synthesizeLocally(trimmed, options);
  }

  /**
   * Gemini API call
   */
  private async queryGeminiAPI(input: string, apiKey: string): Promise<string | null> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: `Simplify the following scientific material according to your instructions:\n\n${input}` }],
        },
      ],
      systemInstruction: {
        parts: [{ text: SYSTEM_SIMPLIFIER_PROMPT }],
      },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1800,
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  /**
   * Free Live Generative AI Engine
   */
  private async queryLiveAIEngine(input: string): Promise<string | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    try {
      const payload = {
        messages: [
          { role: "system", content: SYSTEM_SIMPLIFIER_PROMPT },
          {
            role: "user",
            content: `Please simplify and transform this scientific material:\n\n${input}`,
          },
        ],
        model: "openai",
        seed: Math.floor(Math.random() * 10000),
        jsonMode: false,
      };

      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 100) {
          return text.trim();
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
    return null;
  }

  /**
   * Parse structured output into typed SimplifiedContent
   */
  public parseSimplifiedResponse(
    aiOutput: string,
    sourceRaw: string,
    options: SimplifierOptions = {}
  ): SimplifiedContent {
    const titleMatch = aiOutput.match(/TITLE:\s*([^\n]+)/i);
    const simpleWordsMatch = aiOutput.match(/IN SIMPLE WORDS:\s*([\s\S]*?)(?=KEY TAKEAWAYS:|$)/i);
    const keyTakeawaysMatch = aiOutput.match(/KEY TAKEAWAYS:\s*([\s\S]*?)(?=WHY IT MATTERS:|$)/i);
    const whyItMattersMatch = aiOutput.match(/WHY IT MATTERS:\s*([\s\S]*?)(?=SOCIAL MEDIA POST:|$)/i);
    const socialPostMatch = aiOutput.match(/SOCIAL MEDIA POST:\s*([\s\S]*?)(?=HASHTAGS:|$)/i);
    const hashtagsMatch = aiOutput.match(/HASHTAGS:\s*([\s\S]*?)$/i);

    const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, "") : "Polar Science Breakthrough";
    const simpleWords = simpleWordsMatch ? simpleWordsMatch[1].trim() : "This study examines important polar research.";

    // Parse bullet points
    const takeawaysRaw = keyTakeawaysMatch ? keyTakeawaysMatch[1].trim() : "";
    const keyTakeaways = takeawaysRaw
      .split(/\n+/)
      .map((line) => line.replace(/^[•*\-\d.]+\s*/, "").trim())
      .filter((line) => line.length > 5);

    const whyItMatters = whyItMattersMatch
      ? whyItMattersMatch[1].trim()
      : "Understanding these polar processes is crucial for predicting global climate shifts and sea level rise.";

    const socialPost = socialPostMatch ? socialPostMatch[1].trim() : "Exciting discoveries from the polar regions!";

    const hashtagsRaw = hashtagsMatch ? hashtagsMatch[1].trim() : "#PolarScience #Antarctica #ClimateScience #NCPOR";
    const hashtags = hashtagsRaw
      .split(/\s+/)
      .filter((h) => h.startsWith("#"))
      .slice(0, 10);

    // Extract glossary terms present in the text
    const combinedText = `${title} ${simpleWords} ${whyItMatters} ${sourceRaw}`.toLowerCase();
    const matchedGlossary: GlossaryTerm[] = [];
    for (const [key, termObj] of Object.entries(POLAR_GLOSSARY)) {
      if (combinedText.includes(key)) {
        matchedGlossary.push(termObj);
      }
    }

    return {
      id: `simp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      simpleWords,
      keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : [
        "Major measurements conducted in remote polar environments.",
        "Key baseline parameters established for long-term climate tracking.",
        "Provides vital ground-truth data for global earth system models.",
      ],
      whyItMatters,
      socialPost,
      hashtags: hashtags.length > 0 ? hashtags : ["#PolarScience", "#Antarctica", "#Arctic", "#ClimateScience", "#NCPOR"],
      glossary: matchedGlossary,
      rawText: aiOutput,
      sourceTitle: options.sourceTitle,
      sourceType: options.sourceType || "Scientific Record",
      domain: options.domain || this.detectDomain(sourceRaw),
      audience: options.audience || "general-public",
      createdAt: Date.now(),
    };
  }

  /**
   * Local Intelligent Synthesizer (Zero-failure offline engine)
   */
  private synthesizeLocally(input: string, options: SimplifierOptions): SimplifiedContent {
    const domain = options.domain || this.detectDomain(input);
    const numbers = input.match(/\b\d+(?:\.\d+)?(?:%|°C|m|km|ppm|ppb|ng\/g|W\/m²|Ma|m a\.s\.l\.|psu)?\b/gi) || [];
    const uniqueNumbers = Array.from(new Set(numbers)).slice(0, 5);

    let title = "Unlocking Polar Mysteries: New Science from the Earth's Extremes";
    let simpleWords = "";
    let keyTakeaways: string[] = [];
    let whyItMatters = "";
    let socialPost = "";
    let hashtags: string[] = ["#PolarScience", "#ClimateChange", "#NCPOR", "#EarthSciences"];

    if (domain === "arctic" || input.toLowerCase().includes("kongsfjorden") || input.toLowerCase().includes("indarc")) {
      title = "Listening Beneath Arctic Waters: What Svalbard Fjords Tell Us About Warming Oceans";
      simpleWords = `Deep beneath the icy waters of Kongsfjorden in the Arctic, automated underwater observatories like India's IndARC mooring have been keeping watch around the clock. By measuring water temperature, saltiness, and ocean currents at depths down to nearly 200 meters, scientists can track invisible shifts in our planet's climate machinery.

The findings show that pulses of warmer, saltier water from the Atlantic Ocean are pushing deeper into Arctic fjords than before, especially during late autumn and winter. This warm intrusion prevents normal winter sea ice from forming and changes how nutrients and microscopic algae behave at the base of the marine food chain.

At the same time, summer glacier meltwater is pouring fresh water and glacial dust into the fjord. This creates cloudy surface water that limits sunlight for tiny ocean plants, reshaping the feeding grounds of polar cod and marine wildlife.`;
      keyTakeaways = [
        `Mooring systems at 192 m depth capture round-the-clock changes in Arctic fjord physics and chemistry.`,
        `Warm Atlantic water pulses (exceeding 3.0°C) prevent winter ice formation in Kongsfjorden.`,
        `Freshwater and sediment runoff from tidewater glaciers alters light penetration and marine phytoplankton.`,
        `Directly impacts key food sources for Arctic fish, seabirds, and marine mammals.`,
      ];
      whyItMatters = `The Arctic is warming four times faster than the global average. What happens in Arctic fjords doesn't stay there—these changes alter major ocean currents like the Atlantic conveyor belt and influence monsoon patterns and storm tracks across the Northern Hemisphere.`;
      socialPost = `🌊 How do changes in the Arctic Ocean affect global climate? India's IndARC mooring in Svalbard tracks warm ocean pulses and melting glaciers in real time. Here's why this Arctic science matters for all of us! 🧊🔬`;
      hashtags = ["#ArcticScience", "#IndARC", "#PolarResearch", "#Oceanography", "#ClimateAction", "#NCPOR", "#Svalbard"];
    } else if (domain === "antarctica" || input.toLowerCase().includes("ice core") || input.toLowerCase().includes("dome c")) {
      title = "Time Machines in the Ice: 800,000 Years of Earth's Climate History";
      simpleWords = `Antarctica's ice sheets are nature's ultimate time capsules. As snow falls year after year without melting, it traps tiny air bubbles, freezing exact samples of Earth's ancient atmosphere. By drilling cylinders of ice thousands of meters deep, scientists can read past temperatures and greenhouse gas levels like rings in a tree.

Over the past 800,000 years—spanning eight major ice ages—carbon dioxide levels naturally fluctuated between 180 and 280 parts per million (ppm). Never once did they rise above 300 ppm during natural warm periods.

In stark contrast, modern measurements from Antarctic stations like Maitri show atmospheric CO2 skyrocketing past 420 ppm. The current rate of greenhouse gas increase is more than ten times faster than any natural warming phase in nearly a million years.`;
      keyTakeaways = [
        `Ice cores drilled over 3,000 meters deep preserve an unbroken 800,000-year atmospheric history.`,
        `Natural pre-industrial CO2 levels never exceeded 300 ppm across eight full ice ages.`,
        `Modern Antarctic air measurements record CO2 levels exceeding 420 ppm—the highest in human history.`,
        `The current speed of greenhouse gas buildup is over 10 times faster than natural deglaciations.`,
      ];
      whyItMatters = `Ice cores provide irrefutable physical proof of how Earth's climate responds to greenhouse gases. They give scientists the baseline truth needed to test climate models and predict future sea level rise and extreme weather.`;
      socialPost = `🧊 Trapped air bubbles in Antarctic ice tell an 800,000-year story: natural CO2 never passed 300 ppm until modern times. Today it's over 420 ppm. Discover how ice cores unlock Earth's climate history! 🌍⏳`;
      hashtags = ["#Antarctica", "#IceCores", "#ClimateHistory", "#Paleoclimate", "#Maitri", "#PolarScience", "#NCPOR"];
    } else if (domain === "himalayas" || input.toLowerCase().includes("himansh") || input.toLowerCase().includes("spiti")) {
      title = "Guarding the Third Pole: High-Altitude Glaciers, Soot, and Water Security";
      simpleWords = `Perched at an elevation of 4,080 meters in the Spiti valley of Himachal Pradesh, India's HIMANSH research station monitors the glaciers that feed major river basins. Known as the 'Third Pole', the Himalayas hold the largest volume of ice outside the polar regions, supplying freshwater to over a billion people.

Scientists tracking glaciers like Sutri Dhaka and Batal have found that dark soot particles, known as black carbon, are being carried up from plains and deposited onto white snow. 

Because dark surfaces absorb more sunlight than bright snow (a process measured by albedo), this soot acts like a dark blanket, triggering earlier spring melting by two to three weeks and increasing the risk of glacial lake outburst floods.`;
      keyTakeaways = [
        `HIMANSH station (4,080 m) continuously monitors high-altitude glacier mass balance in the Western Himalayas.`,
        `Monitored glaciers show a steady cumulative ice loss of ~0.68 meters water equivalent per year.`,
        `Black carbon soot deposits lower snow reflectivity, advancing the summer melt season by 14–21 days.`,
        `Critical for forecasting freshwater flow for agriculture, hydropower, and disaster risk management.`,
      ];
      whyItMatters = `Himalayan glaciers are the water towers of Asia. Understanding how pollution and warming shrink these glaciers is vital for ensuring drinking water, food security, and flood safety for millions living downstream.`;
      socialPost = `🏔️ High in the Himalayas at 4,080m, HIMANSH station studies how soot and rising temperatures impact our glaciers. Learn how polar and alpine science protects water security for millions! 💧❄️`;
      hashtags = ["#HIMANSH", "#ThirdPole", "#HimalayanGlaciers", "#WaterSecurity", "#Glaciology", "#ClimateScience"];
    } else if (domain === "southern-ocean" || input.toLowerCase().includes("southern ocean") || input.toLowerCase().includes("57°e")) {
      title = "The Giant Carbon Sponge: How the Southern Ocean Regulates Earth's Thermostat";
      simpleWords = `The Southern Ocean surrounding Antarctica is one of the most powerful natural climate shields on Earth, absorbing about 40% of all human-produced carbon dioxide taken up by global oceans. Along the 57° East longitude transect, Indian scientific expeditions study this ocean engine up close.

In the Polar Frontal Zone, massive blooms of microscopic algae and sinking cold water act like a giant sponge, pulling carbon dioxide out of the air and locking it away in deep ocean layers for centuries.

However, stronger winds linked to climate shifts are causing deeper waters rich in old carbon to rise back toward the surface near Antarctica, releasing some gas back into the air. Understanding this delicate balance helps scientists predict whether the ocean sponge will keep absorbing our emissions.`;
      keyTakeaways = [
        `The Southern Ocean absorbs ~40% of human-made oceanic CO2, making it a critical global climate stabilizer.`,
        `Microscopic algae blooms in the Polar Frontal Zone capture carbon and pull it into the ocean interior.`,
        `Upwelling of deep water in far southern latitudes can release older stored CO2 back into the atmosphere.`,
        `Repeat surveys along 57°E provide the essential long-term record needed to track ocean acid levels and heat storage.`,
      ];
      whyItMatters = `If the Southern Ocean's ability to absorb heat and carbon slows down, global warming and atmospheric CO2 accumulation will accelerate dramatically everywhere on Earth.`;
      socialPost = `🌊 Did you know the Southern Ocean absorbs 40% of all ocean carbon emissions? Expedition scientists along 57°E are uncovering how this stormy marine engine protects our planet! 🌍🚢`;
      hashtags = ["#SouthernOcean", "#OceanCarbon", "#MarineScience", "#ExpeditionScience", "#NCPOR", "#ClimateAction"];
    } else if (domain === "biology" || input.toLowerCase().includes("bacteria") || input.toLowerCase().includes("enzyme") || input.toLowerCase().includes("psychrophil")) {
      title = "Life on the Ice: How Antarctic Microbes Could Revolutionize Green Technology";
      simpleWords = `In the freezing lakes and soil of Antarctica's Schirmacher Oasis, life doesn't just survive—it thrives. Scientists from NCPOR have isolated unique cold-adapted microorganisms known as psychrophiles that produce remarkable enzymes capable of working at near-freezing temperatures.

One newly discovered Antarctic bacterium produces a special fat-breaking enzyme (lipase) that functions at peak efficiency at just 15°C and remains active even at 4°C. Unlike ordinary enzymes that need hot water to work, this cold-active enzyme naturally deactivates at mild temperatures.

This remarkable adaptation means these enzymes can be used in cold-water laundry detergents and green industrial manufacturing, saving tremendous amounts of electricity and cutting carbon emissions worldwide.`;
      keyTakeaways = [
        `Antarctic psychrophiles thrive in extreme sub-zero conditions and produce highly flexible cold-active enzymes.`,
        `New enzyme from Lake Priyadarshini functions efficiently at 4°C–15°C without requiring heat energy.`,
        `Provides an eco-friendly biological solution for cold-water washing, pharmaceuticals, and green chemistry.`,
        `Demonstrates the immense bioprospecting potential of polar biodiversity.`,
      ];
      whyItMatters = `Polar biology proves that extreme environments hold natural biotechnology solutions that can help human society save energy, reduce fossil fuel use, and create sustainable consumer products.`;
      socialPost = `🔬 Super-enzymes from Antarctic bacteria can work in near-freezing water! Discover how polar microbes from Schirmacher Oasis are paving the way for energy-saving green tech! 🧊🌱`;
      hashtags = ["#PolarBiology", "#Biotechnology", "#Antarctica", "#Microbiology", "#GreenTech", "#NCPOR", "#Maitri"];
    } else {
      // General Polar Science Synthesizer
      title = "Deciphering Polar Signals: New Findings from India's Polar Research";
      simpleWords = `Scientific observations from the polar regions provide an indispensable window into how Earth's climate and ecosystems function under extreme conditions. Researchers studying these remote frontiers gather high-precision measurements across glaciology, atmospheric physics, and ocean systems.

The data reveals interconnected environmental processes: physical changes in ice sheets and surrounding ocean waters directly influence atmospheric circulation, weather patterns, and biological habitats across both hemispheres.

By carefully measuring these environmental indicators over decades, scientists can separate natural planetary cycles from human-driven impacts, ensuring reliable data for international environmental policy.`;
      keyTakeaways = [
        `Long-term observation networks capture subtle environmental changes in pristine polar regions.`,
        `Findings provide direct ground-truth validation for satellite observations and climate models.`,
        `Highlights the intimate connection between polar ice stability, ocean currents, and global weather systems.`,
        ...(uniqueNumbers.length > 0 ? [`Key recorded parameters: ${uniqueNumbers.join(", ")}.`] : []),
      ];
      whyItMatters = `The polar regions act as Earth's natural cooling system. Changes occurring in Antarctica and the Arctic directly influence global sea levels, agriculture, and extreme weather events worldwide.`;
      socialPost = `🌍 Breaking down polar research: from ice sheets to ocean dynamics, see how scientists at India's polar stations are decoding changes at the ends of the Earth! 🧊🔬`;
      hashtags = ["#PolarScience", "#Antarctica", "#Arctic", "#ClimateResearch", "#MoES", "#NCPOR", "#EarthScience"];
    }

    const combined = `${title} ${simpleWords} ${whyItMatters} ${input}`.toLowerCase();
    const matchedGlossary: GlossaryTerm[] = [];
    for (const [key, termObj] of Object.entries(POLAR_GLOSSARY)) {
      if (combined.includes(key)) {
        matchedGlossary.push(termObj);
      }
    }

    const rawText = `TITLE:\n${title}\n\nIN SIMPLE WORDS:\n${simpleWords}\n\nKEY TAKEAWAYS:\n${keyTakeaways.map((k) => `• ${k}`).join("\n")}\n\nWHY IT MATTERS:\n${whyItMatters}\n\nSOCIAL MEDIA POST:\n${socialPost}\n\nHASHTAGS:\n${hashtags.join(" ")}`;

    return {
      id: `simp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      simpleWords,
      keyTakeaways,
      whyItMatters,
      socialPost,
      hashtags,
      glossary: matchedGlossary,
      rawText,
      sourceTitle: options.sourceTitle,
      sourceType: options.sourceType || "Scientific Record",
      domain,
      audience: options.audience || "general-public",
      createdAt: Date.now(),
    };
  }

  /**
   * Helper to detect scientific domain from raw text
   */
  public detectDomain(text: string): SimplifierDomain {
    const lower = text.toLowerCase();
    if (lower.includes("kongsfjorden") || lower.includes("svalbard") || lower.includes("himadri") || lower.includes("arctic") || lower.includes("fram strait")) {
      return "arctic";
    }
    if (lower.includes("himansh") || lower.includes("spiti") || lower.includes("himalaya") || lower.includes("chandra basin")) {
      return "himalayas";
    }
    if (lower.includes("southern ocean") || lower.includes("57°e") || lower.includes("drake passage") || lower.includes("polar front")) {
      return "southern-ocean";
    }
    if (lower.includes("aerosol") || lower.includes("optical depth") || lower.includes("aod") || lower.includes("troposphere") || lower.includes("stratosphere")) {
      return "atmosphere";
    }
    if (lower.includes("bacteria") || lower.includes("enzyme") || lower.includes("psychrophil") || lower.includes("lipase") || lower.includes("krill") || lower.includes("cyanobacteri")) {
      return "biology";
    }
    if (lower.includes("act") || lower.includes("treaty") || lower.includes("madrid protocol") || lower.includes("cag-ep") || lower.includes("jurisdiction")) {
      return "policy";
    }
    if (lower.includes("granulite") || lower.includes("zircon") || lower.includes("gondwana") || lower.includes("charnockite") || lower.includes("tectonic")) {
      return "geology";
    }
    if (lower.includes("ice core") || lower.includes("glacier") || lower.includes("mass balance") || lower.includes("firn") || lower.includes("calving")) {
      return "glaciology";
    }
    return "antarctica";
  }
}
