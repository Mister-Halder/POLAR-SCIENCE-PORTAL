import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronRight,
  Compass,
  Expand,
  Mic,
  MicOff,
  Minimize2,
  RefreshCw,
  Send,
  Settings2,
  ShieldCheck,
  Ship,
  SidebarClose,
  SidebarOpen,
  Snowflake,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { polarAI } from "../ai-service";
import { TOPIC_CATEGORIES } from "../polar-knowledge";
import type { AISettings, ChatMessage } from "../types";
import { ChatMessageItem } from "./chat-message";
import { ChatSettingsDialog } from "./chat-settings-dialog";

const STORAGE_KEY_MESSAGES = "moes_polaris_chat_messages_v1";
const STORAGE_KEY_SETTINGS = "moes_polaris_chat_settings_v1";

const INITIAL_GREETING: ChatMessage = {
  id: "greeting-1",
  role: "assistant",
  content: `### 🧊 Welcome to Polaris AI!
I am your interactive scientific guide for the **India Polar Science Portal**, operated by the **National Centre for Polar and Ocean Research (NCPOR)** under the **Ministry of Earth Sciences (MoES)**.

Here is what I can help you with:
- 🏔️ **Research Stations**: Details, history, and live roles of **Maitri**, **Bharati**, **Himadri (Arctic)**, and **HIMANSH (Himalayas)**.
- 🚢 **Expeditions**: Voyage logs, leaders, and scientific highlights from **44+ Antarctic campaigns (ISEA)**, Arctic operations, and the **57°E Southern Ocean transect**.
- 📊 **Data Repository**: How to search, cite with DOIs, and download from **1,286+ datasets** (Glaciology, Atmosphere, Oceanography, Biology).
- 🎓 **Learning & Quizzes**: Interactive lessons on ice cores, monsoon teleconnections, and the **Indian Antarctic Act 2022**.
- 📤 **Researcher Services**: Data submission protocols and 24-month embargo policies.

What would you like to explore today?`,
  timestamp: Date.now(),
  actions: [
    { id: "init-stations", title: "View Stations", to: "/expeditions", label: "Research Stations", icon: "station" },
    { id: "init-repo", title: "Search Datasets", to: "/repository", label: "1,286+ Datasets", icon: "dataset" },
    { id: "init-learn", title: "Learning Quizzes", to: "/learning", label: "Learning Modules", icon: "learning" },
  ],
  suggestedQuestions: [
    "What are India's 4 active polar research stations?",
    "How is the Arctic connected to the Indian monsoon?",
    "What was discovered during the 44th Antarctic Expedition?",
    "How do I search and download research datasets?",
  ],
};

const DEFAULT_SETTINGS: AISettings = {
  apiKey: "",
  model: "gemini-2.5-flash",
  soundEnabled: true,
  ttsEnabled: false,
  autoOpenOnFirstVisit: false,
  dockedMode: false,
};

export function PolarisChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load persisted history and settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages([INITIAL_GREETING]);
        }
      } else {
        setMessages([INITIAL_GREETING]);
      }
    } catch {
      setMessages([INITIAL_GREETING]);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages.slice(-30)));
      } catch (e) {
        console.error("Failed to save chat history:", e);
      }
    }
  }, [messages]);

  // Listen for global custom events to open the chat (e.g. from header or buttons)
  useEffect(() => {
    const handleOpenEvent = (e: any) => {
      setIsOpen(true);
      const q = e?.detail?.query || e?.detail?.initialPrompt || e?.detail?.prompt;
      if (q) {
        handleSendMessage(q);
      }
    };
    window.addEventListener("open-polaris-ai", handleOpenEvent);

    // Keyboard shortcut: Alt + P or Ctrl + Shift + P
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "p") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-polaris-ai", handleOpenEvent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Speech-to-text recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          setInput(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          toast.error(`Microphone error: ${event.error}`);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info("Listening... Speak your polar science question");
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const playChime = () => {
    if (!settings.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: Date.now(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await polarAI.generateResponse(query, nextMessages, settings.apiKey);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.content,
        timestamp: Date.now(),
        actions: response.actions,
        citations: response.citations,
        suggestedQuestions: response.suggestedQuestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      playChime();

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (error: any) {
      toast.error("Failed to generate response. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I encountered a momentary issue accessing the knowledge base. Please try asking again or check your query.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatHistory = () => {
    setMessages([INITIAL_GREETING]);
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch {}
    toast.success("Conversation history cleared");
  };

  const saveSettings = (newSettings: AISettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
    } catch {}
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Subtle welcome callout bubble */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border/80 bg-background/95 px-3.5 py-1.5 text-xs text-foreground shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80 animate-fade-in">
            <span className="flex size-2 rounded-full bg-accent animate-pulse" />
            <span className="font-medium">Ask Polaris AI</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">Alt+P</span>
          </div>

          <Button
            onClick={() => {
              setIsOpen(true);
              setHasUnread(false);
            }}
            className="group relative size-14 rounded-full polar-gradient p-0 text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-accent/40 active:scale-95"
            aria-label="Open Polaris Polar Science AI Chatbot"
          >
            {/* Pulsing Aurora Aura Ring */}
            <span className="absolute -inset-1 rounded-full bg-accent/25 opacity-75 blur-sm transition group-hover:opacity-100 animate-pulse" />

            <div className="relative flex size-full items-center justify-center">
              <Bot className="size-6 transition-transform duration-300 group-hover:rotate-12" />
              <Snowflake className="absolute -top-1 -right-1 size-4 text-accent animate-spin-slow" />

              {hasUnread && (
                <span className="absolute top-0 right-0 size-3 rounded-full bg-destructive ring-2 ring-background" />
              )}
            </div>
          </Button>
        </div>
      )}

      {/* 2. RIGHT PANEL / SLIDE-OVER DRAWER */}
      {isOpen && (
        <aside
          aria-label="Polaris AI Assistant Panel"
          className={cn(
            "fixed bottom-0 right-0 top-0 z-50 flex flex-col bg-background/98 border-l border-border/80 shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out",
            isExpanded
              ? "w-full md:w-[700px] lg:w-[840px]"
              : "w-full sm:w-[440px] md:w-[460px] lg:w-[480px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-muted/40 backdrop-blur">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl polar-gradient text-primary-foreground shadow-md ring-1 ring-accent/40">
                <Bot className="size-5" />
                <Snowflake className="absolute -bottom-1 -right-1 size-3.5 text-accent animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-bold text-foreground">Polaris AI</h3>
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 bg-accent/15 text-accent-foreground font-normal gap-1">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    MoES Knowledge Base
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  India Polar Science Portal Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Standard width" : "Expand panel"}
              >
                {isExpanded ? <Minimize2 className="size-4" /> : <Expand className="size-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={() => setSettingsOpen(true)}
                title="AI Settings & Grounding"
              >
                <Settings2 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
                title="Close panel (Esc)"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Quick Categories Bar */}
          <div className="border-b border-border/60 bg-background px-3 py-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {TOPIC_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(idx)}
                  className={cn(
                    "flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors border",
                    selectedCategory === idx
                      ? "bg-secondary text-secondary-foreground border-accent/40 shadow-2xs"
                      : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Sub-prompts under active category */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {TOPIC_CATEGORIES[selectedCategory].prompts.slice(0, 3).map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left text-[10px] px-2 py-0.5 rounded bg-muted/60 hover:bg-accent/15 hover:text-foreground text-muted-foreground transition-colors border border-border/40 hover:border-accent/40"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onFollowUpClick={(q) => handleSendMessage(q)}
                onNavigate={() => {
                  // If on mobile, close drawer on navigation
                  if (window.innerWidth < 640) setIsOpen(false);
                }}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground animate-fade-in pl-1">
                <div className="flex size-7 items-center justify-center rounded-full polar-gradient text-primary-foreground">
                  <Bot className="size-3.5 animate-spin-slow" />
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 shadow-2xs">
                  <span className="size-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="size-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="size-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-[11px] ml-1">Searching polar knowledge base...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Controls Box */}
          <div className="border-t border-border/80 bg-card p-3 shadow-lg">
            <div className="relative rounded-xl border border-input bg-background focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about stations, datasets, ice cores, expeditions, policies..."
                className="min-h-[64px] max-h-[140px] resize-none border-0 bg-transparent px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                rows={2}
              />

              <div className="flex items-center justify-between border-t border-border/40 px-2 py-1.5 bg-muted/20">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSpeechRecognition}
                    className={cn(
                      "size-7 transition-colors",
                      isListening
                        ? "bg-destructive text-destructive-foreground animate-pulse hover:bg-destructive/90"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title={isListening ? "Stop listening" : "Voice question input"}
                  >
                    {isListening ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearChatHistory}
                    className="size-7 text-muted-foreground hover:text-destructive"
                    title="Clear chat history"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">
                    <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[9px] border border-border">Enter</kbd> to send
                  </span>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="h-7 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1 shadow-sm"
                  >
                    <span>Send</span>
                    <Send className="size-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span>National Centre for Polar and Ocean Research</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-success" />
                Verified MoES Grounding
              </span>
            </div>
          </div>
        </aside>
      )}

      {/* Settings Dialog */}
      <ChatSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSaveSettings={saveSettings}
        onClearHistory={clearChatHistory}
      />
    </>
  );
}
