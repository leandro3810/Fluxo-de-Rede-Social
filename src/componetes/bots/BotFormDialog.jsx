import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import PlatformIcon from "../compartilhado/Platformlcon";
import { toast } from "sonner";

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "threads", label: "Threads" },
  { value: "x", label: "X (Twitter)" },
  { value: "bluesky", label: "Bluesky" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
];

const purposes = [
  { value: "engagement", label: "Engajamento" },
  { value: "growth", label: "Crescimento" },
  { value: "content", label: "Conteúdo" },
  { value: "analytics", label: "Análise" },
  { value: "support", label: "Suporte" },
  { value: "other", label: "Outro" },
];

const botSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  platform: z.string(),
  description: z.string().optional(),
  account_username: z.string().min(1, "Usuário é obrigatório"),
  purpose: z.string(),
});

export default function BotFormDialog({ open, onOpenChange, bot, onSave }) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(botSchema),
    defaultValues: {
      name: "",
      platform: "instagram",
      description: "",
      account_username: "",
      purpose: "engagement",
    }
  });

  const platform = watch("platform");

  useEffect(() => {
    if (bot && open) {
      reset({
        name: bot.name,
        platform: bot.platform,
        description: bot.description || "",
        account_username: bot.account_username || "",
        purpose: bot.purpose || "engagement",
      });
    } else if (open) {
      reset({
        name: "",
        platform: "instagram",
        description: "",
        account_username: "",
        purpose: "engagement",
      });
    }
  }, [bot, open, reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await onSave(data);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao salvar o robô. Tente novamente.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f14] border-white/[0.08] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{bot ? "Editar Robô" : "Novo Robô"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={platform} size="lg" />
            <div className="flex-1 space-y-1.5">
              <Label className="text-white/60 text-xs">Nome</Label>
              <Input
                {...register("name")}
                placeholder="Ex: Bot Instagram Marketing"
                className={`bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <span className="text-red-500 text-[10px]">{errors.name.message}</span>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Plataforma</Label>
            <Select 
              value={platform} 
              onValueChange={(v) => setValue("platform", v)}
            >
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
              {...register("account_username")}
              placeholder="@usuario"
              className={`bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20 ${errors.account_username ? 'border-red-500' : ''}`}
            />
            {errors.account_username && <span className="text-red-500 text-[10px]">{errors.account_username.message}</span>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Finalidade</Label>
            <Select 
              value={watch("purpose")} 
              onValueChange={(v) => setValue("purpose", v)}
            >
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
              {...register("description")}
              placeholder="Descreva o que este robô faz..."
              className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20 h-20 resize-none"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white hover:bg-white/[0.05]">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {saving ? "Salvando..." : bot ? "Atualizar" : "Criar Robô"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
