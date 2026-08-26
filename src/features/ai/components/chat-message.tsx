import { Link } from "@tanstack/react-router";
import {
  Bot,
  Check,
  Copy,
  ExternalLink,
  GraduationCap,
  Globe2,
  HelpCircle,
  Info,
  Mail,
  Share2,
  Ship,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Upload,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActionCard, ChatMessage } from "../types";

interface ChatMessageProps {
  message: ChatMessage;
  onFollowUpClick?: (question: string) => void;
  onNavigate?: () => void;
}

function getActionIcon(icon?: string) {
  switch (icon) {
    case "station":
    case "expedition":
      return <Ship className="size-3.5" />;
    case "dataset":
      return <Info className="size-3.5" />;
    case "learning":
      return <GraduationCap className="size-3.5" />;
    case "globe":
      return <Globe2 className="size-3.5" />;
    case "upload":
      return <Upload className="size-3.5" />;
    case "contact":
      return <Mail className="size-3.5" />;
    default:
      return <ExternalLink className="size-3.5" />;
  }
}

/**
 * Lightweight formatting for markdown headers, lists, code, bold, links
 */
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-4 list-disc marker:text-accent">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      elements.push(<div key={`br-${index}`} className="h-1.5" />);
      return;
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={`h3-${index}`} className="mt-3 mb-1.5 font-display text-sm font-bold text-foreground flex items-center gap-1.5">
          {formatInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={`h2-${index}`} className="mt-3.5 mb-1.5 font-display text-base font-bold text-foreground">
          {formatInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(
        <li key={`li-${index}`} className="text-xs leading-relaxed text-foreground/90">
          {formatInline(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      flushList();
      const dotIndex = trimmed.indexOf(". ");
      elements.push(
        <div key={`num-${index}`} className="my-1.5 flex items-start gap-2 text-xs leading-relaxed text-foreground/90">
          <span className="font-semibold text-accent shrink-0">{trimmed.slice(0, dotIndex + 1)}</span>
          <div>{formatInline(trimmed.slice(dotIndex + 2))}</div>
        </div>
      );
      return;
    }

    // Regular line
    flushList();
    elements.push(
      <p key={`p-${index}`} className="text-xs leading-relaxed text-foreground/90">
        {formatInline(line)}
      </p>
    );
  });

  flushList();
  return elements;
}

/**
 * Parses bold, inline code, and link markdown
 */
function formatInline(text: string): React.ReactNode[] {
  // Regex to match **bold**, `code`, and [text](link)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for bold **text**
    const boldMatch = remaining.match(/^([^*]*)\*\*([^*]+)\*\*(.*)$/);
    // Check for inline code `code`
    const codeMatch = remaining.match(/^([^`]*)\`([^`]+)\`(.*)$/);
    // Check for links [text](url)
    const linkMatch = remaining.match(/^([^[]*)\[([^\]]+)\]\(([^)]+)\)(.*)$/);

    // Find earliest match index
    const boldIdx = boldMatch ? boldMatch[1].length : Infinity;
    const codeIdx = codeMatch ? codeMatch[1].length : Infinity;
    const linkIdx = linkMatch ? linkMatch[1].length : Infinity;

    if (boldIdx === Infinity && codeIdx === Infinity && linkIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIdx <= codeIdx && boldIdx <= linkIdx && boldMatch) {
      if (boldMatch[1]) parts.push(boldMatch[1]);
      parts.push(
        <strong key={`b-${key++}`} className="font-semibold text-foreground">
          {boldMatch[2]}
        </strong>
      );
      remaining = boldMatch[3];
    } else if (codeIdx <= boldIdx && codeIdx <= linkIdx && codeMatch) {
      if (codeMatch[1]) parts.push(codeMatch[1]);
      parts.push(
        <code key={`c-${key++}`} className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-accent-foreground/90 border border-border/50">
          {codeMatch[2]}
        </code>
      );
      remaining = codeMatch[3];
    } else if (linkMatch) {
      if (linkMatch[1]) parts.push(linkMatch[1]);
      const href = linkMatch[3];
      const isInternal = href.startsWith("/");
      if (isInternal) {
        parts.push(
          <Link
            key={`l-${key++}`}
            to={href}
            className="text-accent underline underline-offset-2 hover:text-accent/80 font-medium"
          >
            {linkMatch[2]}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={`l-${key++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:text-accent/80 font-medium"
          >
            {linkMatch[2]}
          </a>
        );
      }
      remaining = linkMatch[4];
    }
  }

  return parts;
}

export function ChatMessageItem({ message, onFollowUpClick, onNavigate }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      toast.error("Speech synthesis is not supported in this browser");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown tokens for clearer audio reading
    const cleanText = message.content
      .replace(/[*#`_]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .slice(0, 1500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3 text-xs",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="relative flex size-7 shrink-0 items-center justify-center rounded-full polar-gradient text-primary-foreground shadow-sm ring-1 ring-accent/30 mt-0.5">
          <Bot className="size-3.5" />
          <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-success ring-1 ring-background" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[88%] rounded-xl p-3.5 shadow-sm transition-all sm:max-w-[82%]",
          isAssistant
            ? "bg-card border border-border/80 text-card-foreground"
            : "bg-primary text-primary-foreground font-normal"
        )}
      >
        {isAssistant ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-border/40">
              <span className="font-display text-[11px] font-semibold tracking-wide text-foreground/80 flex items-center gap-1.5">
                <Sparkles className="size-3 text-accent" />
                Polaris AI
              </span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div className="prose prose-xs max-w-none text-xs">
              {renderMarkdown(message.content)}
            </div>

            {/* Action Cards */}
            {message.actions && message.actions.length > 0 && (
              <div className="mt-3.5 pt-2.5 border-t border-border/60">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <ExternalLink className="size-3 text-accent" />
                  Direct Portal Navigation
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {message.actions.map((act) => (
                    <Button
                      key={act.id}
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2.5 bg-secondary/40 hover:bg-secondary border-accent/30 text-secondary-foreground gap-1.5 shadow-2xs"
                      onClick={onNavigate}
                    >
                      <Link to={act.to}>
                        {getActionIcon(act.icon)}
                        <span className="font-medium">{act.label}</span>
                        {act.badge && (
                          <Badge variant="secondary" className="px-1 py-0 text-[9px] h-3.5 bg-accent/20 text-foreground font-normal">
                            {act.badge}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground/70">Sources:</span>
                {message.citations.map((cite, idx) => (
                  <span key={idx} className="rounded bg-muted/60 px-1.5 py-0.5 text-[9px] border border-border/40">
                    {cite}
                  </span>
                ))}
              </div>
            )}

            {/* Assistant Message Actions Toolbar */}
            <div className="mt-3 pt-1.5 flex items-center justify-between text-[11px] text-muted-foreground opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-muted-foreground hover:text-foreground"
                  onClick={copyToClipboard}
                  title="Copy response"
                >
                  {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("size-6 text-muted-foreground hover:text-foreground", isPlayingAudio && "text-accent")}
                  onClick={toggleSpeech}
                  title={isPlayingAudio ? "Stop reading" : "Read response aloud"}
                >
                  {isPlayingAudio ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("size-6 text-muted-foreground hover:text-foreground", feedback === "up" && "text-success bg-success/10")}
                  onClick={() => {
                    setFeedback("up");
                    toast.success("Thank you for the feedback!");
                  }}
                  title="Helpful"
                >
                  <ThumbsUp className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("size-6 text-muted-foreground hover:text-foreground", feedback === "down" && "text-destructive bg-destructive/10")}
                  onClick={() => {
                    setFeedback("down");
                    toast.info("Feedback noted. We will improve this answer.");
                  }}
                  title="Not helpful"
                >
                  <ThumbsDown className="size-3" />
                </Button>
              </div>
            </div>

            {/* Follow-up Prompts */}
            {message.suggestedQuestions && message.suggestedQuestions.length > 0 && onFollowUpClick && (
              <div className="mt-3 pt-2 border-t border-border/50">
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                  <HelpCircle className="size-3 text-accent" />
                  Suggested Follow-ups:
                </p>
                <div className="flex flex-wrap gap-1">
                  {message.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onFollowUpClick(q)}
                      className="text-left text-[11px] px-2 py-1 rounded-md bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-colors border border-border/40 hover:border-accent/50 cursor-pointer"
                    >
                      {q} &rarr;
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs leading-relaxed">{message.content}</p>
            <div className="mt-1 text-right text-[10px] text-primary-foreground/70">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-2xs mt-0.5 border border-border">
          <User className="size-3.5" />
        </div>
      )}
    </div>
  );
}
