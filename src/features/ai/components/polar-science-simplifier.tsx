import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileDown,
  FileText,
  Globe,
  History,
  Layers,
  Lightbulb,
  MessageSquare,
  Newspaper,
  Printer,
  RefreshCw,
  Share2,
  Ship,
  Sparkles,
  Target,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { expeditions } from "@/features/expeditions/data";
import { datasets } from "@/features/repository/data";
import {
  POLAR_GLOSSARY,
  PolarScienceSimplifierService,
  SIMPLIFIER_PRESETS,
} from "../simplifier-service";
import type {
  GlossaryTerm,
  SimplifiedContent,
  SimplifierAudience,
  SimplifierDomain,
  SimplifierPreset,
} from "../types";

const DOMAIN_INFO: Record<SimplifierDomain, { label: string; icon: string; badge: string }> = {
  antarctica: { label: "Antarctica", icon: "❄️", badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  arctic: { label: "Arctic Ocean", icon: "🧊", badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
  himalayas: { label: "Himalayas / Third Pole", icon: "🏔️", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  "southern-ocean": { label: "Southern Ocean", icon: "🌊", badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
  atmosphere: { label: "Atmosphere & Aerosols", icon: "🌤️", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  biology: { label: "Polar Biology & Enzymes", icon: "🔬", badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  glaciology: { label: "Glaciology & Ice Sheets", icon: "🏔️", badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
  geology: { label: "Geology & Gondwana", icon: "🪨", badge: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20" },
  policy: { label: "Policy & Antarctic Act", icon: "⚖️", badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
};

const AUDIENCE_OPTIONS: { id: SimplifierAudience; label: string; desc: string }[] = [
  { id: "high-school", label: "High School & General Public", desc: "Clear analogies, everyday language, no complex math" },
  { id: "classroom", label: "Student Classroom (Grades 8–12)", desc: "Engaging, curriculum-friendly with clear takeaways" },
  { id: "policy-makers", label: "Policy & Outreach Planners", desc: "Focuses on planetary significance, agreements, and climate targets" },
  { id: "media-press", label: "Press & Science Communicators", desc: "Newsroom angle, high-impact storytelling and quotes" },
];

const FOCUS_CHIPS = [
  "Emphasize Global Climate Impact",
  "Highlight Expedition Technology",
  "Explain Marine Ecosystem & Wildlife",
  "Focus on Ice Loss & Sea Level Rise",
  "Detail Atmospheric Teleconnections",
  "Spotlight Indian Station Observations",
];

interface PolarScienceSimplifierProps {
  initialText?: string;
  initialDomain?: SimplifierDomain;
  initialSourceTitle?: string;
  initialSourceType?: string;
  onOpenAssistantChat?: (topic: string) => void;
}

export function PolarScienceSimplifier({
  initialText,
  initialDomain,
  initialSourceTitle,
  initialSourceType,
  onOpenAssistantChat,
}: PolarScienceSimplifierProps) {
  const [input, setInput] = useState<string>(initialText || SIMPLIFIER_PRESETS[0].scientificInput);
  const [domain, setDomain] = useState<SimplifierDomain>(initialDomain || "arctic");
  const [audience, setAudience] = useState<SimplifierAudience>("high-school");
  const [customFocus, setCustomFocus] = useState<string>("");
  const [sourceTitle, setSourceTitle] = useState<string>(initialSourceTitle || "IndARC Arctic Fjord Time-Series Observations");
  const [sourceType, setSourceType] = useState<string>(initialSourceType || "Research Paper");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [result, setResult] = useState<SimplifiedContent | null>(null);
  const [activeTab, setActiveTab] = useState<string>("report");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState<SimplifiedContent[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const inputId = useId();

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("polar-simplifier-history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Update input if initialText changes (e.g. from route params)
  useEffect(() => {
    if (initialText) {
      setInput(initialText);
      if (initialDomain) setDomain(initialDomain);
      if (initialSourceTitle) setSourceTitle(initialSourceTitle);
      if (initialSourceType) setSourceType(initialSourceType);
    }
  }, [initialText, initialDomain, initialSourceTitle, initialSourceType]);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  const handlePresetSelect = (preset: SimplifierPreset) => {
    setInput(preset.scientificInput);
    setDomain(preset.domain);
    setSourceTitle(preset.title);
    setSourceType(preset.sourceType);
    toast.info(`Loaded sample: ${preset.title}`);
  };

  const handleDatasetSelect = (datasetId: string) => {
    const ds = datasets.find((d) => d.id === datasetId);
    if (!ds) return;
    const text = `Dataset Title: ${ds.title}\nTheme: ${ds.theme}\nRegion: ${ds.region}\nPI: ${ds.pi} (${ds.institution})\nDOI: https://doi.org/${ds.doi}\n\nAbstract & Field Context:\n${ds.abstract}\n\nKey Parameters: ${ds.keywords.join(", ")}.`;
    setInput(text);
    setSourceTitle(ds.title);
    setSourceType("Data Repository Record");
    setDomain(ds.region.toLowerCase().includes("arctic") ? "arctic" : ds.region.toLowerCase().includes("himalaya") ? "himalayas" : ds.region.toLowerCase().includes("ocean") ? "southern-ocean" : "antarctica");
    toast.info(`Loaded dataset: ${ds.title}`);
  };

  const handleExpeditionSelect = (expeditionSlug: string) => {
    const exp = expeditions.find((e) => e.slug === expeditionSlug);
    if (!exp) return;
    const text = `Expedition Campaign: ${exp.title} (${exp.code})\nRegion: ${exp.region}\nDates: ${exp.dates}\nLeader: ${exp.leader} (${exp.institution})\nVessel / Platform: ${exp.vessel}\n\nSummary & Scientific Objectives:\n${exp.summary}\n\nKey Milestones:\n${exp.highlights.map((h) => `- ${h}`).join("\n")}`;
    setInput(text);
    setSourceTitle(exp.title);
    setSourceType("Expedition Report");
    setDomain(exp.region === "Arctic" ? "arctic" : exp.region === "Himalaya" ? "himalayas" : exp.region === "Southern Ocean" ? "southern-ocean" : "antarctica");
    toast.info(`Loaded expedition: ${exp.title}`);
  };

  const handleSimplify = async () => {
    if (!input.trim()) {
      toast.error("Please enter or select scientific material to simplify.");
      return;
    }

    setIsGenerating(true);
    setResult(null);

    // Multi-stage progress feedback
    setGenerationStep("1/4: Analyzing scientific data, measurements, and research methodology...");
    await new Promise((r) => setTimeout(r, 450));

    setGenerationStep("2/4: Translating technical jargon into accessible language & analogies...");
    await new Promise((r) => setTimeout(r, 450));

    setGenerationStep("3/4: Synthesizing key takeaways and planetary significance...");
    await new Promise((r) => setTimeout(r, 400));

    setGenerationStep("4/4: Formatting social media post and hashtags...");

    try {
      const simplifier = PolarScienceSimplifierService.getInstance();
      const output = await simplifier.simplifyScientificContent(input, {
        audience,
        domain,
        customFocus: customFocus || undefined,
        sourceTitle,
        sourceType,
      });

      setResult(output);

      // Save to history
      const updatedHistory = [output, ...history.filter((h) => h.id !== output.id)].slice(0, 15);
      setHistory(updatedHistory);
      localStorage.setItem("polar-simplifier-history", JSON.stringify(updatedHistory));

      toast.success("Scientific content simplified successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Simplification error: " + (err.message || "Please check your network or try again."));
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadText = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Downloaded ${filename}`);
  };

  const handleSpeak = (textToSpeak: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("polar-simplifier-history");
    toast.info("History cleared.");
  };

  return (
    <div className="space-y-8">
      {/* Quick Domain Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
            Domain:
          </span>
          {(Object.keys(DOMAIN_INFO) as SimplifierDomain[]).map((dKey) => {
            const d = DOMAIN_INFO[dKey];
            const isSelected = domain === dKey;
            return (
              <button
                key={dKey}
                type="button"
                onClick={() => setDomain(dKey)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-muted/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{d.icon}</span>
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Presets dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <BookOpen className="size-3.5 text-accent" />
                <span>Load Sample Paper</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Authentic Polar Research Samples
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SIMPLIFIER_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="cursor-pointer flex flex-col items-start py-2"
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="text-sm">{DOMAIN_INFO[preset.domain]?.icon || "🔬"}</span>
                    <span className="font-medium text-xs truncate flex-1">{preset.title}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {preset.tag} · {preset.sourceType}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* History drawer */}
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <History className="size-3.5" />
                <span>History ({history.length})</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[360px] sm:w-[480px]">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base font-display">Simplification History</SheetTitle>
                  {history.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive text-xs h-7">
                      <Trash2 className="size-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                <SheetDescription className="text-xs">
                  Review previously generated polar outreach articles and social posts.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    <History className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                    No saved simplifications yet.
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setResult(item);
                        setHistoryOpen(false);
                      }}
                      className="cursor-pointer rounded-lg border border-border bg-card p-3 hover:border-accent hover:bg-secondary/40 transition-all text-left"
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {item.domain ? DOMAIN_INFO[item.domain]?.label : "Polar Science"}
                        </Badge>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-semibold text-xs text-foreground line-clamp-2">{item.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{item.simpleWords}</p>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Scientific Input & Customization Panel */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-border/90 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-display font-semibold flex items-center gap-2">
                    <FileText className="size-4 text-accent" />
                    <span>Scientific Input Material</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Paste raw notes, research abstract, expedition log, or dataset details
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput("")}
                    className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick source selector buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 text-xs justify-between w-full font-normal">
                      <span className="truncate flex items-center gap-1.5">
                        <Layers className="size-3.5 text-accent shrink-0" />
                        <span>Insert from Portal Dataset</span>
                      </span>
                      <ChevronDown className="size-3 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 max-h-64 overflow-y-auto">
                    <DropdownMenuLabel className="text-xs">Select a Dataset</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {datasets.map((d) => (
                      <DropdownMenuItem
                        key={d.id}
                        onClick={() => handleDatasetSelect(d.id)}
                        className="cursor-pointer text-xs"
                      >
                        <div className="truncate">
                          <p className="font-medium truncate">{d.title}</p>
                          <p className="text-[10px] text-muted-foreground">{d.theme} · {d.region}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 text-xs justify-between w-full font-normal">
                      <span className="truncate flex items-center gap-1.5">
                        <Ship className="size-3.5 text-accent shrink-0" />
                        <span>Insert from Expedition</span>
                      </span>
                      <ChevronDown className="size-3 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 max-h-64 overflow-y-auto">
                    <DropdownMenuLabel className="text-xs">Select an Expedition</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {expeditions.map((e) => (
                      <DropdownMenuItem
                        key={e.slug}
                        onClick={() => handleExpeditionSelect(e.slug)}
                        className="cursor-pointer text-xs"
                      >
                        <div className="truncate">
                          <p className="font-medium truncate">{e.title}</p>
                          <p className="text-[10px] text-muted-foreground">{e.region} · {e.code}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <Label htmlFor={inputId} className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span>Source Text / Notes:</span>
                  <span className="text-[11px] font-normal text-muted-foreground font-mono">
                    {wordCount} words · {charCount} chars
                  </span>
                </Label>
                <Textarea
                  id={inputId}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste complex scientific material, expedition observations, or paper abstract here..."
                  rows={10}
                  className="text-xs font-mono leading-relaxed resize-y min-h-[220px] bg-background"
                />
              </div>

              {/* Audience & Tone Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Target className="size-3.5 text-accent" />
                  <span>Target Audience & Tone</span>
                </Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as SimplifierAudience)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id} className="text-xs">
                        <div className="py-0.5">
                          <p className="font-medium">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Focus Chips */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Lightbulb className="size-3.5 text-accent" />
                  <span>Optional Focus / Angle</span>
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {FOCUS_CHIPS.map((chip) => {
                    const isSelected = customFocus === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setCustomFocus(isSelected ? "" : chip)}
                        className={`text-[11px] rounded-md px-2 py-1 transition-all border ${
                          isSelected
                            ? "bg-accent/20 border-accent text-accent-foreground font-medium"
                            : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Simplify Action Button */}
              <Button
                type="button"
                onClick={handleSimplify}
                disabled={isGenerating || !input.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 font-semibold gap-2 shadow-md"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Simplifying Science...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 text-accent animate-pulse" />
                    <span>Transform & Simplify Content</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Output Showcase & Multi-format Views */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Generation Indicator */}
          {isGenerating && (
            <Card className="border-accent/40 bg-accent/5 p-6 text-center animate-pulse shadow-sm">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="size-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                  <Sparkles className="size-5 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-sm text-foreground">
                    Polar Science AI Neural Simplifier
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm">{generationStep}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Results Container */}
          {!isGenerating && result && (
            <div className="space-y-4">
              {/* Output Tab Switcher & Action Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-card border border-border rounded-xl p-2 shadow-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList className="grid grid-cols-4 w-full sm:w-auto h-8 text-xs">
                    <TabsTrigger value="report" className="text-xs px-2.5">
                      <FileText className="size-3.5 mr-1" />
                      Report
                    </TabsTrigger>
                    <TabsTrigger value="social" className="text-xs px-2.5">
                      <Share2 className="size-3.5 mr-1" />
                      Social
                    </TabsTrigger>
                    <TabsTrigger value="reader" className="text-xs px-2.5">
                      <BookOpen className="size-3.5 mr-1" />
                      Reader
                    </TabsTrigger>
                    <TabsTrigger value="markdown" className="text-xs px-2.5">
                      <Newspaper className="size-3.5 mr-1" />
                      Markdown
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-1.5 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSpeak(`${result.title}. ${result.simpleWords}. Why it matters: ${result.whyItMatters}`)}
                    className="h-8 text-xs gap-1"
                    title={isSpeaking ? "Stop Reading" : "Read aloud (Text-to-Speech)"}
                  >
                    {isSpeaking ? <VolumeX className="size-3.5 text-destructive" /> : <Volume2 className="size-3.5" />}
                    <span className="hidden sm:inline">{isSpeaking ? "Stop" : "Listen"}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.rawText, "full")}
                    className="h-8 text-xs gap-1"
                  >
                    {copiedSection === "full" ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                    <span className="hidden sm:inline">Copy All</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                        <Download className="size-3.5" />
                        <span>Export</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => downloadText(result.rawText, `${result.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`)}
                        className="text-xs cursor-pointer"
                      >
                        <FileDown className="size-3.5 mr-2" />
                        Download as Markdown (.md)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => downloadText(result.rawText, `${result.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`)}
                        className="text-xs cursor-pointer"
                      >
                        <FileText className="size-3.5 mr-2" />
                        Download as Plain Text (.txt)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.print()} className="text-xs cursor-pointer">
                        <Printer className="size-3.5 mr-2" />
                        Print / Save to PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {onOpenAssistantChat && (
                    <Button
                      size="sm"
                      onClick={() => onOpenAssistantChat(`Tell me more about: ${result.title}`)}
                      className="h-8 text-xs bg-accent text-accent-foreground hover:bg-accent/90 gap-1 font-medium"
                    >
                      <MessageSquare className="size-3.5" />
                      <span>Ask AI</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* TAB 1: Structured Report View */}
              {activeTab === "report" && (
                <div className="space-y-4">
                  {/* Section 1: Catchy Title Card */}
                  <Card className="border-border overflow-hidden shadow-sm">
                    <div className="polar-gradient px-5 py-4 text-primary-foreground flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/75">
                            Catchy Title
                          </span>
                          {result.domain && (
                            <Badge className="bg-accent/30 text-primary-foreground border-accent/40 text-[10px] py-0">
                              {DOMAIN_INFO[result.domain]?.label}
                            </Badge>
                          )}
                        </div>
                        <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug">
                          {result.title}
                        </h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(result.title, "title")}
                        className="text-primary-foreground hover:bg-primary-foreground/20 shrink-0"
                        title="Copy Title"
                      >
                        {copiedSection === "title" ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
                      </Button>
                    </div>
                  </Card>

                  {/* Section 2: In Simple Words */}
                  <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground text-xs font-bold">
                          📖
                        </span>
                        <div>
                          <CardTitle className="text-sm font-display font-semibold">
                            In Simple Words
                          </CardTitle>
                          <CardDescription className="text-[11px]">
                            Clear explanation tailored for {result.audience.replace("-", " ")}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.simpleWords, "simpleWords")}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                      >
                        {copiedSection === "simpleWords" ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                        Copy
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-1">
                      {result.simpleWords.split("\n\n").map((p, idx) => (
                        <p key={idx} className="text-sm leading-relaxed text-foreground/90">
                          {p}
                        </p>
                      ))}

                      {/* Highlighted Glossary Chips */}
                      {result.glossary && result.glossary.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border">
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                            Key Scientific Terms Explained:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {result.glossary.map((g) => (
                              <Popover key={g.term}>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1 rounded-md bg-secondary/80 hover:bg-secondary px-2 py-0.5 text-xs text-secondary-foreground font-medium border border-border/80 transition-colors"
                                  >
                                    <span>🔍</span>
                                    <span>{g.term}</span>
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-72 p-3 text-xs space-y-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-bold text-foreground">{g.term}</p>
                                    {g.category && (
                                      <Badge variant="outline" className="text-[9px] py-0">
                                        {g.category}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground leading-relaxed">{g.explanation}</p>
                                </PopoverContent>
                              </Popover>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Section 3: Key Takeaways */}
                  <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground text-xs font-bold">
                          🎯
                        </span>
                        <div>
                          <CardTitle className="text-sm font-display font-semibold">
                            Key Takeaways
                          </CardTitle>
                          <CardDescription className="text-[11px]">
                            Core facts, numbers, and research findings
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.keyTakeaways.map((t) => `• ${t}`).join("\n"), "takeaways")}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                      >
                        {copiedSection === "takeaways" ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                        Copy
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-1">
                      <ul className="space-y-2.5">
                        {result.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent text-[11px] font-bold mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed text-foreground/90">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Section 4: Why It Matters */}
                  <Card className="border-border bg-card shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-success/20 text-success text-xs font-bold">
                          🌍
                        </span>
                        <div>
                          <CardTitle className="text-sm font-display font-semibold">
                            Why It Matters
                          </CardTitle>
                          <CardDescription className="text-[11px]">
                            Planetary impact, climate connections, and societal value
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.whyItMatters, "whyItMatters")}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                      >
                        {copiedSection === "whyItMatters" ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                        Copy
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-1">
                      <p className="text-sm leading-relaxed text-foreground/90 bg-muted/30 p-3.5 rounded-lg border border-border/60">
                        {result.whyItMatters}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Section 5 & 6: Social Media Post & Hashtags Preview Card */}
                  <Card className="border-border shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-accent/20 text-accent text-xs font-bold">
                          📱
                        </span>
                        <div>
                          <CardTitle className="text-sm font-display font-semibold">
                            Social Media Outreach & Hashtags
                          </CardTitle>
                          <CardDescription className="text-[11px]">
                            Ready to share on X, LinkedIn, Instagram & Facebook
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${result.socialPost}\n\n${result.hashtags.join(" ")}`, "social")}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                      >
                        {copiedSection === "social" ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                        Copy Post
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-1">
                      <div className="rounded-lg border border-border bg-muted/40 p-4">
                        <p className="text-xs sm:text-sm leading-relaxed font-sans text-foreground whitespace-pre-wrap">
                          {result.socialPost}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                          {result.hashtags.map((h, i) => (
                            <span
                              key={i}
                              onClick={() => copyToClipboard(h, `tag-${i}`)}
                              className="inline-block text-[11px] font-mono text-accent hover:underline cursor-pointer bg-accent/10 rounded px-1.5 py-0.5"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 2: Social Media Studio */}
              {activeTab === "social" && (
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-display">Social Media Broadcast Studio</CardTitle>
                    <CardDescription className="text-xs">
                      Preview and copy formatted social posts with platform character counts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Mock Social Card */}
                    <div className="max-w-md mx-auto rounded-xl border border-border bg-card shadow-lg p-4 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-full polar-gradient flex items-center justify-center text-primary-foreground font-bold text-xs">
                          PS
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight">India Polar Science Portal</p>
                          <p className="text-[10px] text-muted-foreground">@PolarPortal_IN · NCPOR MoES</p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                        {result.socialPost}
                      </p>

                      <div className="flex flex-wrap gap-1 text-[11px] font-mono text-accent">
                        {result.hashtags.map((h, i) => (
                          <span key={i}>{h}</span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Characters: {result.socialPost.length + result.hashtags.join(" ").length + 2}</span>
                        <Badge
                          variant={
                            result.socialPost.length + result.hashtags.join(" ").length < 280
                              ? "outline"
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {result.socialPost.length + result.hashtags.join(" ").length < 280
                            ? "Fits X/Twitter (< 280 chars)"
                            : "Standard Post"}
                        </Badge>
                      </div>
                    </div>

                    {/* Copy action grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(result.socialPost, "studio-post")}
                        className="text-xs"
                      >
                        <Copy className="size-3.5 mr-1.5" />
                        Copy Post Body
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(result.hashtags.join(" "), "studio-tags")}
                        className="text-xs"
                      >
                        <Copy className="size-3.5 mr-1.5" />
                        Copy Hashtags
                      </Button>
                      <Button
                        onClick={() =>
                          copyToClipboard(`${result.socialPost}\n\n${result.hashtags.join(" ")}`, "studio-all")
                        }
                        className="text-xs bg-primary text-primary-foreground"
                      >
                        <Copy className="size-3.5 mr-1.5" />
                        Copy Full Broadcast
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* TAB 3: Interactive Editorial Reader */}
              {activeTab === "reader" && (
                <Card className="border-border shadow-sm bg-card">
                  <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Editorial Article Preview
                        </span>
                        <h2 className="font-display text-2xl font-bold mt-1 text-foreground">
                          {result.title}
                        </h2>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpeak(`${result.title}. ${result.simpleWords}`)}
                        className="h-8 text-xs"
                      >
                        <Volume2 className="size-3.5 mr-1" />
                        Listen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6 max-w-2xl mx-auto">
                    <div className="prose prose-sm dark:prose-invert space-y-4">
                      {result.simpleWords.split("\n\n").map((p, i) => (
                        <p key={i} className="text-base leading-relaxed text-foreground/90 font-serif">
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                      <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        Key Scientific Highlights
                      </h4>
                      <ul className="space-y-2">
                        {result.keyTakeaways.map((t, idx) => (
                          <li key={idx} className="text-xs leading-relaxed flex items-start gap-2">
                            <span className="text-accent font-bold">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-success/30 bg-success/5 p-4 space-y-1.5">
                      <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-success">
                        Planetary Significance
                      </h4>
                      <p className="text-xs leading-relaxed text-foreground/90">{result.whyItMatters}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* TAB 4: Raw Markdown / Press Kit */}
              {activeTab === "markdown" && (
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-display">Markdown Outreach Kit</CardTitle>
                      <CardDescription className="text-xs">
                        Raw formatted markdown ready for publishing or newsletter syndication
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.rawText, "raw-copy")}
                      className="h-8 text-xs"
                    >
                      <Copy className="size-3.5 mr-1" />
                      Copy Markdown
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 rounded-lg bg-muted/60 border border-border text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-[500px]">
                      {result.rawText}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Empty State / Intro Showcase */}
          {!isGenerating && !result && (
            <Card className="border-dashed border-2 border-border/80 bg-muted/20 p-8 text-center shadow-none">
              <div className="max-w-md mx-auto space-y-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl polar-gradient text-primary-foreground shadow-md">
                  <Sparkles className="size-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Ready to Simplify Polar Science
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Paste any research paper excerpt, expedition observation log, or dataset description on the left.
                    Click <strong className="text-foreground font-semibold">Transform & Simplify</strong> to generate a catchy title, plain-language explanation, key takeaways, planetary significance, and social media posts.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect(SIMPLIFIER_PRESETS[0])}
                    className="text-xs h-8"
                  >
                    Try Arctic IndARC Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect(SIMPLIFIER_PRESETS[1])}
                    className="text-xs h-8"
                  >
                    Try Antarctic Ice Core Sample
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
