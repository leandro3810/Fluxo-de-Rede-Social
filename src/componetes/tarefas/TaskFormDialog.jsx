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

const emptyTask = {
  title: "", bot_id: "", type: "post", priority: "medium",
  content: "", target_url: "", schedule_date: "",
  repeat: "none", max_executions: 1, tags: []
};

export default function TaskFormDialog({ open, onOpenChange, task, bots, onSave }) {
  const [form, setForm] = useState(emptyTask);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        bot_id: task.bot_id,
        type: task.type,
        priority: task.priority || "medium",
        content: task.content || "",
        target_url: task.target_url || "",
        schedule_date: task.schedule_date ? task.schedule_date.slice(0, 16) : "",
        repeat: task.repeat || "none",
        max_executions: task.max_executions || 1,
        tags: task.tags || [],
      });
      setTagsInput((task.tags || []).join(", "));
    } else {
      setForm({ ...emptyTask, bot_id: bots[0]?.id || "" });
      setTagsInput("");
    }
  }, [task, open, bots]);

  const handleSave = async () => {
    setSaving(true);
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    await onSave({ ...form, tags });
    setSaving(false);
    onOpenChange(false);
  };

  const fieldClass = "bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f14] border-white/[0.08] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{task ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Título</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nome da tarefa" className={fieldClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Robô</Label>
              <Select value={form.bot_id} onValueChange={(v) => setForm({ ...form, bot_id: v })}>
                <SelectTrigger className={fieldClass}><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
                  {bots.map(b => (
                    <SelectItem key={b.id} value={b.id} className="text-white/80 focus:bg-white/[0.05] focus:text-white">{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
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
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
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
              <Select value={form.repeat} onValueChange={(v) => setForm({ ...form, repeat: v })}>
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
              <Input type="datetime-local" value={form.schedule_date} onChange={(e) => setForm({ ...form, schedule_date: e.target.value })} className={fieldClass} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Máx. execuções</Label>
              <Input type="number" min={1} value={form.max_executions} onChange={(e) => setForm({ ...form, max_executions: parseInt(e.target.value) || 1 })} className={fieldClass} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">URL alvo</Label>
            <Input value={form.target_url} onChange={(e) => setForm({ ...form, target_url: e.target.value })} placeholder="https://..." className={fieldClass} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Conteúdo</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Texto do post, comentário, etc..." className={`${fieldClass} h-20 resize-none`} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs">Tags (separadas por vírgula)</Label>
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="marketing, vendas, engajamento" className={fieldClass} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white hover:bg-white/[0.05]">Cancelar</Button>
          <Button onClick={handleSave} disabled={!form.title || !form.bot_id || saving} className="bg-violet-600 hover:bg-violet-700 text-white">
            {saving ? "Salvando..." : task ? "Atualizar" : "Criar Tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
