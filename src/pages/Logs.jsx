import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Filter, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import PlatformIcon from "@/components/shared/PlatformIcon";
import moment from "moment";

export default function Logs() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: logs = [], isLoading: ll } = useQuery({
    queryKey: ["logs"],
    queryFn: () => base44.entities.TaskLog.list("-created_date", 100),
  });
  const { data: bots = [] } = useQuery({
    queryKey: ["bots"],
    queryFn: () => base44.entities.Bot.list(),
  });
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list(),
  });

  const botsMap = Object.fromEntries(bots.map(b => [b.id, b]));
  const tasksMap = Object.fromEntries(tasks.map(t => [t.id, t]));

  const filtered = logs.filter(l => {
    const matchSearch = l.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (ll) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Logs de Execução</h1>
        <p className="text-white/40 text-sm mt-1">Histórico de todas as execuções</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar logs..." className="pl-9 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white w-36">
            <Filter className="w-3 h-3 mr-2 text-white/30" /><SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a24] border-white/[0.08]">
            <SelectItem value="all" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Todos</SelectItem>
            <SelectItem value="success" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Sucesso</SelectItem>
            <SelectItem value="failed" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Falha</SelectItem>
            <SelectItem value="warning" className="text-white/80 focus:bg-white/[0.05] focus:text-white">Aviso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <p className="text-white/30 text-sm">Nenhum log encontrado</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((log) => {
              const bot = botsMap[log.bot_id];
              const task = tasksMap[log.task_id];
              return (
                <div key={log.id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  {bot && <PlatformIcon platform={bot.platform} size="sm" />}
                  {!bot && <div className="w-7 h-7 rounded-xl bg-white/[0.05] flex items-center justify-center text-xs text-white/30">?</div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white/80 text-sm font-medium">{log.message}</p>
                      <StatusBadge status={log.status} />
                    </div>
                    {log.details && <p className="text-white/30 text-xs mt-1">{log.details}</p>}
                    <div className="flex items-center gap-3 mt-1.5 text-white/30 text-xs">
                      {bot && <span>{bot.name}</span>}
                      {task && <span>• {task.title}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {moment(log.created_date).format("DD/MM/YY HH:mm:ss")}
                      </span>
                      {log.execution_time_ms && <span>• {log.execution_time_ms}ms</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
