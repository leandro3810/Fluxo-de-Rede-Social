import React from "react";
import PlatformIcon, { getPlatformConfig } from "@/components/shared/PlatformIcon";
import StatusBadge from "@/components/shared/StatusBadge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight } from "lucide-react";

export default function BotOverviewCards({ bots, tasks }) {
  if (bots.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <p className="text-white/30 text-sm">Nenhum robô criado ainda</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
      <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm tracking-wide">Seus Robôs</h3>
        <Link to={createPageUrl("Bots")} className="text-violet-400 text-xs font-medium hover:text-violet-300 transition-colors flex items-center gap-1">
          Ver todos <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {bots.slice(0, 5).map((bot) => {
          const botTasks = tasks.filter(t => t.bot_id === bot.id);
          const config = getPlatformConfig(bot.platform);
          return (
            <div key={bot.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <PlatformIcon platform={bot.platform} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm font-semibold truncate">{bot.name}</p>
                <p className="text-white/30 text-xs mt-0.5">
                  {config.label} • @{bot.account_username || "—"} • {botTasks.length} tarefas
                </p>
              </div>
              <StatusBadge status={bot.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
