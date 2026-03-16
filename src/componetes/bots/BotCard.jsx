import React from "react";
import PlatformIcon, { getPlatformConfig } from "@/components/shared/PlatformIcon";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Pencil, Trash2, BarChart3, Copy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const purposeLabels = {
  engagement: "Engajamento",
  growth: "Crescimento",
  content: "Conteúdo",
  analytics: "Análise",
  support: "Suporte",
  other: "Outro"
};

export default function BotCard({ bot, tasksCount, onToggle, onEdit, onDelete, onClone, onPermissions }) {
  const config = getPlatformConfig(bot.platform);

  return (
    <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300">
      <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", config.color, "blur-3xl -z-10")} style={{ opacity: 0.03 }} />
      
      <div className="flex items-start gap-4">
        <PlatformIcon platform={bot.platform} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold truncate">{bot.name}</h3>
            <StatusBadge status={bot.status} />
          </div>
          <p className="text-white/30 text-xs mt-1">
            {config.label} • @{bot.account_username || "sem conta"}
          </p>
          {bot.description && (
            <p className="text-white/40 text-xs mt-2 line-clamp-2">{bot.description}</p>
          )}
          {bot.purpose && (
            <div className="mt-2">
              <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[10px]">
                {purposeLabels[bot.purpose]}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-white/30" />
          <span className="text-white/50 text-xs">{tasksCount} tarefas</span>
        </div>
        <div className="text-white/50 text-xs">
          {bot.total_tasks_executed || 0} executadas
        </div>
        <div className="text-white/50 text-xs">
          {bot.success_rate || 0}% sucesso
        </div>
        
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
            onClick={() => onToggle(bot)}
          >
            {bot.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white/40 hover:text-blue-400 hover:bg-blue-500/10"
            onClick={() => onClone(bot)}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white/40 hover:text-purple-400 hover:bg-purple-500/10"
            onClick={() => onPermissions(bot)}
          >
            <Users className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
            onClick={() => onEdit(bot)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10"
            onClick={() => onDelete(bot)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
