import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search, Grid3x3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import BotCard from "@/components/bots/BotCard";
import BotFormDialog from "@/components/bots/BotFormDialog";
import BotPermissionsDialog from "@/components/bots/BotPermissionsDialog";
import { toast } from "sonner";

export default function Bots() {
  const [showForm, setShowForm] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [permissionsBot, setPermissionsBot] = useState(null);
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const qc = useQueryClient();

  const { data: bots = [], isLoading } = useQuery({
    queryKey: ["bots"],
    queryFn: () => base44.entities.Bot.list("-created_date"),
  });
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list(),
  });

  const createMut = useMutation({
    mutationFn: (data) => base44.entities.Bot.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Bot.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Bot.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });

  const handleSave = async (formData) => {
    if (editingBot) {
      await updateMut.mutateAsync({ id: editingBot.id, data: formData });
    } else {
      await createMut.mutateAsync(formData);
    }
  };

  const handleToggle = async (bot) => {
    const newStatus = bot.status === "active" ? "paused" : "active";
    await updateMut.mutateAsync({ id: bot.id, data: { status: newStatus } });
  };

  const handleClone = async (bot) => {
    const clonedData = {
      name: `${bot.name} (Cópia)`,
      platform: bot.platform,
      description: bot.description,
      account_username: bot.account_username,
      purpose: bot.purpose,
      tags: bot.tags,
      status: "paused"
    };
    await createMut.mutateAsync(clonedData);
    toast.success("Robô clonado com sucesso!");
  };

  const handleSavePermissions = async (data) => {
    await updateMut.mutateAsync({ id: permissionsBot.id, data });
    toast.success("Permissões atualizadas!");
  };

  const filteredBots = bots.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.platform.toLowerCase().includes(search.toLowerCase())
  );

  const groupedBots = () => {
    if (groupBy === "none") return { "Todos": filteredBots };
    
    const groups = {};
    filteredBots.forEach(bot => {
      const key = groupBy === "platform" ? bot.platform : (bot.purpose || "other");
      if (!groups[key]) groups[key] = [];
      groups[key].push(bot);
    });
    return groups;
  };

  const groups = groupedBots();

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
          <h1 className="text-2xl font-bold text-white tracking-tight">Robôs</h1>
          <p className="text-white/40 text-sm mt-1">{bots.length} robôs cadastrados</p>
        </div>
        <Button onClick={() => { setEditingBot(null); setShowForm(true); }} className="bg-violet-600 hover:bg-violet-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Novo Robô
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar robôs..."
            className="pl-9 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
          />
        </div>
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="w-[180px] bg-white/[0.05] border-white/[0.08] text-white">
            <Grid3x3 className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
            <SelectItem value="none" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Sem agrupamento</SelectItem>
            <SelectItem value="platform" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Por Plataforma</SelectItem>
            <SelectItem value="purpose" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Por Finalidade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredBots.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <p className="text-white/30 text-sm">Nenhum robô encontrado</p>
          <Button onClick={() => { setEditingBot(null); setShowForm(true); }} variant="ghost" className="text-violet-400 hover:text-violet-300 mt-4">
            <Plus className="w-4 h-4 mr-2" /> Criar primeiro robô
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groups).map(([groupName, groupBots]) => (
            <div key={groupName}>
              {groupBy !== "none" && (
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold text-white capitalize">
                    {groupName === "engagement" ? "Engajamento" :
                     groupName === "growth" ? "Crescimento" :
                     groupName === "content" ? "Conteúdo" :
                     groupName === "analytics" ? "Análise" :
                     groupName === "support" ? "Suporte" :
                     groupName === "instagram" ? "Instagram" :
                     groupName === "tiktok" ? "TikTok" :
                     groupName === "x" ? "X (Twitter)" :
                     groupName === "facebook" ? "Facebook" :
                     groupName === "linkedin" ? "LinkedIn" :
                     groupName === "youtube" ? "YouTube" :
                     groupName}
                  </h2>
                  <Badge variant="outline" className="bg-white/[0.05] text-white/50 border-white/[0.08]">
                    {groupBots.length}
                  </Badge>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupBots.map(bot => (
                  <BotCard
                    key={bot.id}
                    bot={bot}
                    tasksCount={tasks.filter(t => t.bot_id === bot.id).length}
                    onToggle={handleToggle}
                    onClone={handleClone}
                    onPermissions={(b) => { setPermissionsBot(b); setShowPermissions(true); }}
                    onEdit={(b) => { setEditingBot(b); setShowForm(true); }}
                    onDelete={(b) => deleteMut.mutate(b.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <BotFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        bot={editingBot}
        onSave={handleSave}
      />

      <BotPermissionsDialog
        open={showPermissions}
        onOpenChange={setShowPermissions}
        bot={permissionsBot}
        onSave={handleSavePermissions}
      />
    </div>
  );
}
