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
