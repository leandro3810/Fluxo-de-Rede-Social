import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFormDialog from "@/components/tasks/TaskFormDialog";

export default function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const qc = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date"),
  });
  const { data: bots = [] } = useQuery({
    queryKey: ["bots"],
    queryFn: () => base44.entities.Bot.list(),
  });

  const botsMap = Object.fromEntries(bots.map(b => [b.id, b]));

  const createMut = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleSave = async (formData) => {
    if (editingTask) {
      await updateMut.mutateAsync({ id: editingTask.id, data: formData });
    } else {
      await createMut.mutateAsync(formData);
    }
  };

  const handleToggle = async (task) => {
    const newStatus = task.status === "running" ? "paused" : "running";
    await updateMut.mutateAsync({ id: task.id, data: { status: newStatus } });
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchType = typeFilter === "all" || t.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const selectClass = "bg-white/[0.05] border-white/[0.08] text-white w-36";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tarefas</h1>
          <p className="text-white/40 text-sm mt-1">{tasks.length} tarefas no total</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setShowForm(true); }} className="bg-violet-600 hover:bg-violet-700 text-white" disabled={bots.length === 0}>
          <Plus className="w-4 h-4 mr-2" /> Nova Tarefa
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar tarefas..." className="pl-9 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className={selectClass}><Filter className="w-3 h-3 mr-2 text-white/30" /><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
            <SelectItem value="all" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Todos status</SelectItem>
            <SelectItem value="scheduled" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Agendado</SelectItem>
            <SelectItem value="running" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Executando</SelectItem>
            <SelectItem value="completed" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Concluído</SelectItem>
            <SelectItem value="failed" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Falhou</SelectItem>
            <SelectItem value="paused" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Pausado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
            <SelectItem value="all" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Todos tipos</SelectItem>
            <SelectItem value="post" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Publicar</SelectItem>
            <SelectItem value="like" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Curtir</SelectItem>
            <SelectItem value="follow" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Seguir</SelectItem>
            <SelectItem value="comment" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Comentar</SelectItem>
            <SelectItem value="unfollow" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Deixar de seguir</SelectItem>
            <SelectItem value="repost" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Repostar</SelectItem>
            <SelectItem value="dm" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Mensagem</SelectItem>
            <SelectItem value="story" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Story</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {bots.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <p className="text-white/30 text-sm">Crie um robô primeiro para poder adicionar tarefas</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <p className="text-white/30 text-sm">Nenhuma tarefa encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              bot={botsMap[task.bot_id]}
              onToggle={handleToggle}
              onEdit={(t) => { setEditingTask(t); setShowForm(true); }}
              onDelete={(t) => deleteMut.mutate(t.id)}
            />
          ))}
        </div>
      )}

      <TaskFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        task={editingTask}
        bots={bots}
        onSave={handleSave}
      />
    </div>
  );
}
