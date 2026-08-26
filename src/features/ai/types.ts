export type MessageRole = "user" | "assistant" | "system";

export interface ActionCard {
  id: string;
  title: string;
  description?: string;
  to: string;
  label: string;
  icon?: "station" | "expedition" | "dataset" | "learning" | "media" | "about" | "contact" | "globe" | "upload" | "external";
  badge?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  actions?: ActionCard[];
  citations?: string[];
  suggestedQuestions?: string[];
  isStreaming?: boolean;
}

export interface AISettings {
  apiKey: string;
  model: string;
  soundEnabled: boolean;
  ttsEnabled: boolean;
  autoOpenOnFirstVisit: boolean;
  dockedMode: boolean; // docked right sidebar vs overlay drawer
}

export interface TopicCategory {
  name: string;
  icon: string;
  prompts: string[];
}

export type SimplifierAudience = "high-school" | "general-public" | "policy-makers" | "classroom" | "media-press";

export type SimplifierDomain =
  | "antarctica"
  | "arctic"
  | "southern-ocean"
  | "himalayas"
  | "atmosphere"
  | "biology"
  | "glaciology"
  | "geology"
  | "policy";

export interface GlossaryTerm {
  term: string;
  explanation: string;
  category?: string;
}

export interface SimplifiedContent {
  id: string;
  title: string;
  simpleWords: string;
  keyTakeaways: string[];
  whyItMatters: string;
  socialPost: string;
  hashtags: string[];
  glossary?: GlossaryTerm[];
  rawText: string;
  sourceType?: string;
  sourceTitle?: string;
  domain?: SimplifierDomain;
  audience: SimplifierAudience;
  createdAt: number;
}

export interface SimplifierPreset {
  id: string;
  title: string;
  domain: SimplifierDomain;
  tag: string;
  sourceType: "Research Paper" | "Expedition Report" | "Dataset Abstract" | "Field Notes" | "Policy Brief";
  scientificInput: string;
  sourceRef?: string;
}

export interface SimplifierOptions {
  audience?: SimplifierAudience;
  domain?: SimplifierDomain;
  customFocus?: string;
  sourceTitle?: string;
  sourceType?: string;
}
