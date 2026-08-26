import { POLAR_KNOWLEDGE_ENTRIES, type KnowledgeEntry } from "./polar-knowledge";
import { expeditions, stations, type Expedition, type ExpeditionRegion } from "@/features/expeditions/data";
import { datasets, type Dataset } from "@/features/repository/data";
import { modules, type LearningModule } from "@/features/learning/data";
import { site, headlineStats, notices, publications, timeline } from "@/features/site/content";
import type { ActionCard, ChatMessage } from "./types";

const SYSTEM_GROUNDING_PROMPT = `
You are Polaris AI, an intelligent, authoritative, and inspiring AI science assistant for the India Polar Science Portal, operated by the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences (MoES), Government of India.

Your capabilities:
1. You can answer ANY question on Polar Science, Earth & Planetary Climate, Cryosphere, Oceanography, Atmospheric Physics, Glaciology, Paleoclimatology, Space Weather, Polar Biology & Wildlife, Geopolitics, and History with rigorous scientific accuracy, clarity, and depth.
2. You have comprehensive master knowledge of India's Polar Science Programme:
   - Stations: Maitri (Antarctica, 1989), Bharati (Antarctica, 2012), Himadri (Arctic/Svalbard, 2008), HIMANSH (Himalayas/Spiti, 4080m, 2016). Plus Dakshin Gangotri (historic 1st station, 1983-1988), IndARC (Kongsfjorden underwater mooring, 2014), and 57°E Southern Ocean hydrography line.
   - Expeditions: 44+ Antarctic Expeditions (ISEA), Arctic Campaigns (IARC), Southern Ocean Expeditions (SOE), Himalayan Field Campaigns (HIMEX).
   - Data Repository: 1,286+ curated datasets under Glaciology, Atmospheric Science, Oceanography, Biology, Geology with DOIs and 24-month field embargo rules.
   - Law: The Indian Antarctic Act 2022 and Antarctic Treaty System.
   - Learning: Interactive modules on ice cores, monsoon teleconnections, and Southern Ocean carbon.
3. If a user asks general, scientific, or global polar questions (e.g. permafrost thaw, AMOC, katabatic winds, auroras, penguins, Milankovitch cycles, ozone layer), give a full, structured, expert explanation using Markdown (headings, bullet points, bold text). When relevant, naturally mention how Indian polar science or portal datasets relate to it.
4. Keep tone professional, engaging, clear, and scientifically authoritative.
`;

export class PolarAIService {
  private static instance: PolarAIService;

  public static getInstance(): PolarAIService {
    if (!PolarAIService.instance) {
      PolarAIService.instance = new PolarAIService();
    }
    return PolarAIService.instance;
  }

  /**
   * Main query processor:
   * 1. Checks for Gemini API Key
   * 2. Checks Free Live AI LLM Engine (Pollinations / Cloud LLM)
   * 3. Falls back to Encyclopedic Local Knowledge Synthesizer
   */
  public async generateResponse(
    query: string,
    history: ChatMessage[],
    customApiKey?: string
  ): Promise<{
    content: string;
    actions: ActionCard[];
    citations: string[];
    suggestedQuestions: string[];
  }> {
    const trimmed = query.trim();
    const apiKey = customApiKey || (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) || "";

    // TIER 1: User-configured Gemini API Key
    if (apiKey && apiKey.length > 20) {
      try {
        const geminiResult = await this.queryGeminiAPI(trimmed, history, apiKey);
        if (geminiResult) {
          const matchedActions = this.extractRelevantActions(trimmed, geminiResult);
          const followUps = this.generateFollowUps(trimmed, geminiResult);
          return {
            content: geminiResult,
            actions: matchedActions,
            citations: ["Google Gemini 2.5 Flash", "MoES / NCPOR India Polar Science Portal"],
            suggestedQuestions: followUps,
          };
        }
      } catch (err) {
        console.warn("Gemini API call failed, trying secondary live AI engine:", err);
      }
    }

    // TIER 2: Free Open Live Generative AI Engine (Answers ANY question on the internet/science)
    try {
      const liveAIResult = await this.queryLiveAIEngine(trimmed, history);
      if (liveAIResult && liveAIResult.trim().length > 30) {
        const matchedActions = this.extractRelevantActions(trimmed, liveAIResult);
        const followUps = this.generateFollowUps(trimmed, liveAIResult);
        return {
          content: liveAIResult,
          actions: matchedActions,
          citations: ["Polaris AI Neural Engine", "NCPOR / MoES Knowledge Base"],
          suggestedQuestions: followUps,
        };
      }
    } catch (err) {
      console.warn("Live AI Engine offline, using Encyclopedic Local Knowledge Synthesizer:", err);
    }

    // TIER 3: Encyclopedic Local Knowledge Synthesizer (Offline & fallback)
    return this.queryNativeKnowledgeEngine(trimmed.toLowerCase(), trimmed);
  }

  /**
   * Free Live Generative AI Engine (Pollinations AI) with full MoES grounding
   */
  private async queryLiveAIEngine(query: string, history: ChatMessage[]): Promise<string | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 second timeout

    try {
      const recentHistory = history.slice(-4).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      const payload = {
        messages: [
          { role: "system", content: SYSTEM_GROUNDING_PROMPT },
          ...recentHistory,
          { role: "user", content: query },
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
        if (text && text.trim().length > 20) {
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
   * Google Gemini API connector
   */
  private async queryGeminiAPI(
    query: string,
    history: ChatMessage[],
    apiKey: string
  ): Promise<string | null> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const formattedHistory = history.slice(-6).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const body = {
      contents: [
        ...formattedHistory,
        {
          role: "user",
          parts: [{ text: query }],
        },
      ],
      systemInstruction: {
        parts: [{ text: SYSTEM_GROUNDING_PROMPT }],
      },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200,
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
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  }

  /**
   * Encyclopedic Local Knowledge Synthesizer (Offline & fallback)
   */
  private queryNativeKnowledgeEngine(
    trimmed: string,
    rawQuery: string
  ): {
    content: string;
    actions: ActionCard[];
    citations: string[];
    suggestedQuestions: string[];
  } {
    // 1. Direct match with knowledge entries
    for (const entry of POLAR_KNOWLEDGE_ENTRIES) {
      const match = entry.keywords.some((k) => trimmed.includes(k.toLowerCase()));
      if (match) {
        return {
          content: entry.detailedContent,
          actions: entry.actions,
          citations: ["MoES Polar Science Repository", "NCPOR Goa Operations Register"],
          suggestedQuestions: entry.relatedQuestions,
        };
      }
    }

    // 2. Search datasets
    const matchedDatasets = datasets.filter((d) =>
      d.title.toLowerCase().includes(trimmed) ||
      d.theme.toLowerCase().includes(trimmed) ||
      d.region.toLowerCase().includes(trimmed) ||
      d.keywords.some((k) => k.toLowerCase().includes(trimmed)) ||
      d.pi.toLowerCase().includes(trimmed)
    );

    if (matchedDatasets.length > 0) {
      const top = matchedDatasets.slice(0, 3);
      let content = `### 📊 Found ${matchedDatasets.length} Matching Datasets in the National Repository\n\n`;
      top.forEach((d, idx) => {
        content += `**${idx + 1}. [${d.title}](/repository/${d.id})**\n`;
        content += `- **Theme**: \`${d.theme}\` · **Region**: ${d.region}\n`;
        content += `- **Principal Investigator (PI)**: ${d.pi} (${d.institution})\n`;
        content += `- **DOI**: \`${d.doi}\` · **Access**: \`${d.access.toUpperCase()}\`\n`;
        content += `- **Abstract**: ${d.abstract.slice(0, 160)}...\n\n`;
      });

      const actions: ActionCard[] = top.map((d) => ({
        id: `ds-${d.id}`,
        title: d.title,
        to: `/repository/${d.id}`,
        label: `View Dataset (${d.theme})`,
        icon: "dataset",
        badge: d.access === "open" ? "Open Access" : "Registered",
      }));

      actions.push({
        id: "repo-all",
        title: "Search All Datasets",
        to: "/repository",
        label: "Open Full Repository Search",
        icon: "dataset",
      });

      return {
        content,
        actions,
        citations: ["NCPOR Polar Data Repository", "Metadata Index"],
        suggestedQuestions: [
          "How do I request access to restricted datasets?",
          "How can researchers upload new research data?",
          "What software opens NetCDF-4 files?",
        ],
      };
    }

    // 3. Fallback Dynamic Science Synthesizer
    const matchedActions = this.extractRelevantActions(rawQuery, "");
    return {
      content: `### 🧭 Polaris AI: Polar Science & Climate Insights

Polar research combines atmospheric science, oceanography, glaciology, geology, and biology to understand Earth's past climate and future stability:

- 🏔️ **Active Indian Bases**: **Maitri** (Schirmacher Oasis, 1989), **Bharati** (Larsemann Hills, 2012), **Himadri** (Ny-Ålesund, Arctic, 2008), and **HIMANSH** (Spiti, 4080m, 2016).
- 🌊 **Southern Ocean & Fjord Dynamics**: ORV Sagar Nidhi measuring carbon sink inventories along 57°E; IndARC moored underwater in Kongsfjorden.
- 🧊 **Ice Sheet & Glacier Physics**: Firn coring, ice radar, katabatic boundary-layer profiling, and mass balance monitoring.
- 📊 **Open Data Access**: 1,286+ quality-controlled datasets published with DOIs under CC BY 4.0.
- ⚖️ **Legal Protections**: The **Indian Antarctic Act 2022** and the international Antarctic Treaty System.

You can ask me any question about polar physics, expeditions, datasets, wildlife, space weather, or environmental laws!`,
      actions: matchedActions.length > 0 ? matchedActions : [
        { id: "act-stations", title: "Browse Expeditions", to: "/expeditions", label: "Expeditions & Bases", icon: "expedition" },
        { id: "act-repo", title: "Search Data Repository", to: "/repository", label: "1,286+ Datasets", icon: "dataset" },
        { id: "act-learn", title: "Learning & Quizzes", to: "/learning", label: "Interactive Modules", icon: "learning" },
      ],
      citations: ["National Centre for Polar and Ocean Research (NCPOR)", "Ministry of Earth Sciences, Govt. of India"],
      suggestedQuestions: [
        "What are India's 4 active research stations?",
        "What are katabatic winds and how do they form?",
        "How is the Arctic connected to the Indian monsoon?",
        "What was discovered during the 44th Antarctic Expedition?",
      ],
    };
  }

  /**
   * Helper to extract relevant action cards by analyzing user query AND AI response
   */
  private extractRelevantActions(query: string, responseText: string): ActionCard[] {
    const combined = `${query} ${responseText}`.toLowerCase();
    const cards: ActionCard[] = [];

    // Stations
    if (combined.includes("maitri") || combined.includes("bharati") || combined.includes("himadri") || combined.includes("himansh") || combined.includes("station")) {
      cards.push({ id: "card-exp", title: "Browse Expeditions & Bases", to: "/expeditions", label: "Stations & Expeditions", icon: "expedition" });
      cards.push({ id: "card-globe", title: "View on 3D Globe", to: "/", label: "Interactive Globe", icon: "globe" });
    }

    // Expeditions
    if (combined.includes("isea-44") || combined.includes("44th") || combined.includes("vasiliy")) {
      cards.push({ id: "card-isea44", title: "44th Antarctic Expedition", to: "/expeditions/isea-44-maitri-bharati-traverse", label: "ISEA-44 Record", icon: "expedition", badge: "Antarctic" });
    }
    if (combined.includes("iarc") || combined.includes("ny-alesund") || combined.includes("svalbard") || combined.includes("kongsfjorden")) {
      cards.push({ id: "card-iarc", title: "Arctic Expedition at Himadri", to: "/expeditions/iarc-2025-himadri-summer", label: "IARC-2025 Campaign", icon: "expedition", badge: "Arctic" });
    }
    if (combined.includes("soe-12") || combined.includes("57°e") || combined.includes("57e") || combined.includes("southern ocean")) {
      cards.push({ id: "card-soe", title: "Southern Ocean Expedition", to: "/expeditions/soe-12-57e-repeat-hydrography", label: "SOE-12 Hydrography", icon: "expedition", badge: "Southern Ocean" });
    }
    if (combined.includes("himex") || combined.includes("chandra") || combined.includes("sutri dhaka") || combined.includes("spiti")) {
      cards.push({ id: "card-himex", title: "Himalayan Cryosphere Campaign", to: "/expeditions/himex-2024-chandra-basin", label: "HIMEX Campaign", icon: "expedition", badge: "Himalaya" });
    }

    // Datasets
    if (combined.includes("data") || combined.includes("repo") || combined.includes("download") || combined.includes("netcdf") || combined.includes("doi") || combined.includes("ctd") || combined.includes("aws")) {
      cards.push({ id: "card-repo", title: "Search Data Repository", to: "/repository", label: "1,286+ Datasets", icon: "dataset" });
    }

    // Upload
    if (combined.includes("upload") || combined.includes("submit") || combined.includes("deposit") || combined.includes("embargo")) {
      cards.push({ id: "card-upload", title: "Upload Research Data", to: "/repository/upload", label: "Researcher Upload", icon: "upload" });
    }

    // Learning
    if (combined.includes("learn") || combined.includes("quiz") || combined.includes("student") || combined.includes("ice core") || combined.includes("monsoon") || combined.includes("module")) {
      cards.push({ id: "card-learn", title: "Learning & Quizzes", to: "/learning", label: "Interactive Modules", icon: "learning" });
    }

    // Media
    if (combined.includes("media") || combined.includes("photo") || combined.includes("video") || combined.includes("film") || combined.includes("gallery")) {
      cards.push({ id: "card-media", title: "Media Gallery", to: "/media", label: "Photos & Media", icon: "media" });
    }

    // Contact
    if (combined.includes("contact") || combined.includes("email") || combined.includes("desk") || combined.includes("proposal") || combined.includes("berth")) {
      cards.push({ id: "card-contact", title: "Contact Desks", to: "/contact", label: "Contact NCPOR", icon: "contact" });
    }

    // Deduplicate by ID
    const unique = new Map<string, ActionCard>();
    cards.forEach((c) => unique.set(c.id, c));
    return Array.from(unique.values()).slice(0, 4);
  }

  private generateFollowUps(query: string, responseText: string): string[] {
    const combined = `${query} ${responseText}`.toLowerCase();

    if (combined.includes("station") || combined.includes("maitri") || combined.includes("bharati")) {
      return [
        "What scientific research is conducted at Bharati Station?",
        "How is Himadri station in the Arctic operated?",
        "What datasets were recorded at Maitri station?",
      ];
    }
    if (combined.includes("ice core") || combined.includes("firn") || combined.includes("glacio")) {
      return [
        "How do stable isotopes indicate past global temperature?",
        "What is the oldest ice core ever retrieved?",
        "What were the findings of the 68m firn core in ISEA-44?",
      ];
    }
    if (combined.includes("amoc") || combined.includes("monsoon") || combined.includes("ocean")) {
      return [
        "How does Arctic sea-ice loss affect Indian monsoon rainfall?",
        "What is the role of the Southern Ocean in absorbing carbon?",
        "What does the IndARC underwater mooring measure in Svalbard?",
      ];
    }
    if (combined.includes("wildlife") || combined.includes("penguin") || combined.includes("seal")) {
      return [
        "How do antifreeze glycoproteins work in polar fish?",
        "What is the role of Antarctic krill in the marine food web?",
        "What environmental protections exist under the Indian Antarctic Act 2022?",
      ];
    }

    return [
      "Tell me about India's research stations in Antarctica",
      "What are katabatic winds and how do they form?",
      "How do I search and download research datasets?",
      "Explain the Indian Antarctic Act 2022",
    ];
  }
}

export const polarAI = PolarAIService.getInstance();
