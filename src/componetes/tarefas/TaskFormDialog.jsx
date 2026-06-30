import React, { useState } from "react";
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
import { useTaskForm } from "@/hooks/useTaskForm";

const taskTypes = [
  { value: "post", label: "📝 Publicar" },
  { value: "like", label: "❤️ Curtir" },
  { value: "follow", label: "➕ Seguir" },
  { value: "unfollow", label: "➖ Deixar de seguir" },
  { value: "comment", label: "💬 Comentar" },
  { value: "repost", label: "🔄 Repostar" },
  { value: "dm", label: "✉️ Mensagem" },
  { value: "story", label: "📱 Story" },
];

const priorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

const repeats = [
  { value: "none", label: "Uma vez" },
  { value: "daily", label: "Diário" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensal" },
];

export default function TaskFormDialog({ open, onOpenChange, task, bots, onSave }) {
  const [saving, setSaving] = useState(false);
  const { form, prepareData } = useTaskForm({ task, bots, open });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;

  const fieldClass = "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20";
  const errClass = "text-red-500 text-[10px] mt-0.5";

  const onSubmit = async (values) => {
    setSaving(true);
    await onSave(prepareData(values));
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f14] border-white/[0.08] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{task ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Título</Label>
            <Input {...register("title")} placeholder="Nome da tarefa" className={`${fieldClass} ${errors.title ? "border-red-500" : ""}`} />
            {errors.title && <p className={errClass}>{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Robô</Label>
              <Select value={watch("bot_id")} onValueChange={(v) => setValue("bot_id", v, { shouldValidate: true })}>
                <SelectTrigger className={`${fieldClass} ${errors.bot_id ? "border-red-500" : ""}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
                  {bots.map(b => (
                    <SelectItem key={b.id} value={b.id} className="text-white/80 focus:bg-white/[0.05] focus:text-white">{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bot_id && <p className={errClass}>{errors.bot_id.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Tipo</Label>
              <Select value={watch("type")} onValueChange={(v) => setValue("type", v, { shouldValidate: true })}>
                <SelectTrigger className={fieldClass}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
                  {taskTypes.map(t => (
                    <SelectItem key={t.value} value={t.value} className="text-white/80 focus:bg-white/[0.05] focus:text-white">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Prioridade</Label>
              <Select value={watch("priority")} onValueChange={(v) => setValue("priority", v)}>
                <SelectTrigger className={fieldClass}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
                  {priorities.map(p => (
                    <SelectItem key={p.value} value={p.value} className="text-white/80 focus:bg-white/[0.05] focus:text-white">{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Repetição</Label>
              <Select value={watch("repeat")} onValueChange={(v) => setValue("repeat", v)}>
                <SelectTrigger className={fieldClass}><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
                  {repeats.map(r => (
                    <SelectItem key={r.value} value={r.value} className="text-white/80 focus:bg-white/[0.05] focus:text-white">{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Agendar para</Label>
              <Input type="datetime-local" {...register("schedule_date")} className={fieldClass} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Máx. execuções</Label>
              <Input type="number" min={1} {...register("max_executions")} className={fieldClass} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">URL alvo</Label>
            <Input {...register("target_url")} placeholder="https://..." className={fieldClass} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Conteúdo</Label>
            <Textarea {...register("content")} placeholder="Texto do post, comentário, etc..." className={`${fieldClass} h-20 resize-none`} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Tags (separadas por vírgula)</Label>
            <Input {...register("tags")} placeholder="marketing, vendas, engajamento" className={fieldClass} />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white hover:bg-white/[0.05]">Cancelar</Button>
            <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white">
              {saving ? "Salvando..." : task ? "Atualizar" : "Criar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
