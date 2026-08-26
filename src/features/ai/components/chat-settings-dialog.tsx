import { useState } from "react";
import { Key, RotateCcw, ShieldCheck, Sparkles, Volume2, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AISettings } from "../types";

interface ChatSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AISettings;
  onSaveSettings: (settings: AISettings) => void;
  onClearHistory: () => void;
}

export function ChatSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSaveSettings,
  onClearHistory,
}: ChatSettingsDialogProps) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [ttsEnabled, setTtsEnabled] = useState(settings.ttsEnabled);
  const [dockedMode, setDockedMode] = useState(settings.dockedMode);

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      apiKey: apiKey.trim(),
      soundEnabled,
      ttsEnabled,
      dockedMode,
    });
    toast.success("AI preferences saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg">
            <Sparkles className="size-5 text-accent" />
            Polaris AI Settings & Grounding
          </DialogTitle>
          <DialogDescription className="text-xs">
            Configure AI reasoning models, voice synthesis, and local knowledge base preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2 text-xs">
          {/* Dual Engine Info Banner */}
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-accent-foreground/90 space-y-1">
            <p className="font-semibold flex items-center gap-1.5 text-xs text-foreground">
              <ShieldCheck className="size-4 text-accent" />
              Built-in Domain Knowledge Active
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Polaris AI is pre-loaded with verified data from the Ministry of Earth Sciences, NCPOR station logs, 1,286+ dataset registries, and expedition archives.
            </p>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-xs font-semibold flex items-center gap-1.5">
              <Key className="size-3.5 text-muted-foreground" />
              Optional Google Gemini API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs font-mono h-8"
            />
            <p className="text-[11px] text-muted-foreground">
              Supplying a key enables real-time Gemini 2.5 Flash reasoning. Leaving it empty uses the instant built-in Polar Knowledge Engine.
            </p>
          </div>

          {/* Docked Right Sidebar Toggle */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="space-y-0.5">
              <Label htmlFor="docked-mode" className="text-xs font-medium cursor-pointer">
                Docked Right Sidebar Mode
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Keep the chat panel pinned alongside portal content on wide screens.
              </p>
            </div>
            <Switch
              id="docked-mode"
              checked={dockedMode}
              onCheckedChange={setDockedMode}
            />
          </div>

          {/* Sound & Voice Options */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="sound-toggle" className="text-xs font-medium cursor-pointer">
                Sound Effects
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Play subtle ice-crystal chimes on incoming AI replies.
              </p>
            </div>
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>

          {/* Reset History */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div>
              <p className="font-semibold text-xs text-foreground">Conversation History</p>
              <p className="text-[11px] text-muted-foreground">Clear cached chat transcripts from this browser.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 h-7"
              onClick={() => {
                onClearHistory();
                onOpenChange(false);
              }}
            >
              <RotateCcw className="size-3 mr-1.5" />
              Clear History
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="text-xs bg-primary text-primary-foreground">
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
