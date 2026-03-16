import React from "react";
import StatusBadge from "@/components/shared/StatusBadge";
import PlatformIcon from "@/components/shared/PlatformIcon";
import moment from "moment";

export default function RecentActivity({ logs, bots, tasks }) {
  const botsMap = Object.fromEntries(bots.map(b => [b.id, b]));
  const tasksMap = Object.fromEntries(tasks.map(t => [t.id, t]));

  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 8);

  if (recentLogs.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <p className="text-white/30 text-sm">Nenhuma atividade recente</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
      <div className="p-5 border-b border-white/[0.06]">
        <h3 className="text-white font-semibold text-sm tracking-wide">Atividade Recente</h3>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {recentLogs.map((log) => {
          const bot = botsMap[log.bot_id];
          const task = tasksMap[log.task_id];
          return (
            <div key={log.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
              <PlatformIcon platform={bot?.platform} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-medium truncate">{log.message}</p>
                <p className="text-white/30 text-xs mt-0.5">
                  {bot?.name} {task ? `• ${task.title}` : ""} • {moment(log.created_date).fromNow()}
                </p>
              </div>
              <StatusBadge status={log.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
