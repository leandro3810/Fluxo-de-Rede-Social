import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import PlatformIcon from "../shared/PlatformIcon";

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X (Twitter)" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
];

const purposes = [
  { value: "engagement", label: "Engajamento" },
  { value: "growth", label: "Crescimento" },
  { value: "content", label: "Conteúdo" },
  { value: "analytics", label: "Análise" },
  { value: "support", label: "Suporte" },
  { value: "other", label: "Outro" },
];

const emptyBot = { name: "", platform: "instagram", description: "", account_username: "", purpose: "engagement", tags: [] };

export default function BotFormDialog({ open, onOpenChange, bot, onSave }) {
  const [form, setForm] = useState(emptyBot);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bot) {
      setForm({ 
        name: bot.name, 
        platform: bot.platform, 
        description: bot.description || "", 
        account_username: bot.account_username || "",
        purpose: bot.purpose || "engagement",
        tags: bot.tags || []
      });
    } else {
      setForm(emptyBot);
    }
  }, [bot, open]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f14] border-white/[0.08] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{bot ? "Editar Robô" : "Novo Robô"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={form.platform} size="lg" />
            <div className="flex-1 space-y-1.5">
              <Label className="text-white/60 text-xs">Nome</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Bot Instagram Marketing"
                className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Plataforma</Label>
            <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
              <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
                {platforms.map(p => (
                  <SelectItem key={p.value} value={p.value} className="text-white/80 focus:bg-white/[0.05] focus:text-white">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Usuário da conta</Label>
            <Input
              value={form.account_username}
              onChange={(e) => setForm({ ...form, account_username: e.target.value })}
              placeholder="@usuario"
              className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Finalidade</Label>
            <Select value={form.purpose} onValueChange={(v) => setForm({ ...form, purpose: v })}>
              <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
                {purposes.map(p => (
                  <SelectItem key={p.value} value={p.value} className="text-white/80 focus:bg-white/[0.05] focus:text-white">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Descrição</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva o que este robô faz..."
              className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20 h-20 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white hover:bg-white/[0.05]">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.name || saving}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {saving ? "Salvando..." : bot ? "Atualizar" : "Criar Robô"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
