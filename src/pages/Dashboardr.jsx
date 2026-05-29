import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/Api/base44Client";
import { Bot, CheckCircle2, Loader2, ListChecks, PlayCircle } from "lucide-react";

const MAX_LOGS_TO_FETCH = 10;
const MAX_LOGS_TO_DISPLAY = 5;

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-white/50">{label}</p>
      <Icon className="w-4 h-4 text-violet-300" />
    </div>
    <p className="text-2xl font-bold text-white mt-2">{value}</p>
  </div>
);

export default function Dashboardr() {
  const { data: bots = [], isLoading: isLoadingBots } = useQuery({
    queryKey: ["bots"],
    queryFn: () => base44.entities.Bot.list("-created_date"),
  });

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date"),
  });

  const { data: logs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ["logs"],
    queryFn: () => base44.entities.TaskLog.list("-created_date", MAX_LOGS_TO_FETCH),
  });

  const isLoading = isLoadingBots || isLoadingTasks || isLoadingLogs;
  const activeBots = bots.filter((bot) => bot.status === "active").length;
  const runningTasks = tasks.filter((task) => task.status === "running").length;
  const doneTasks = tasks.filter((task) => task.status === "completed").length;
  const successfulLogs = logs.filter((log) => log.status === "success").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-white/45 mt-1">Visão geral dos seus bots, tarefas e atividade.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Bots ativos" value={activeBots} icon={Bot} />
        <StatCard label="Tarefas totais" value={tasks.length} icon={ListChecks} />
        <StatCard label="Em execução" value={runningTasks} icon={PlayCircle} />
        <StatCard label="Concluídas" value={doneTasks} icon={CheckCircle2} />
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Atividade recente</h2>
          <span className="text-sm text-emerald-300">{successfulLogs} logs de sucesso</span>
        </div>

        {logs.length === 0 ? (
          <p className="text-sm text-white/40">Nenhuma atividade recente encontrada.</p>
        ) : (
          <ul className="space-y-3">
            {logs.slice(0, MAX_LOGS_TO_DISPLAY).map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/90">{log.message || "Execução de tarefa"}</p>
                  <p className="text-xs text-white/40">{new Date(log.created_date).toLocaleString("pt-BR")}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-md border ${
                    log.status === "success"
                      ? "text-emerald-300 border-emerald-400/30 bg-emerald-500/10"
                      : "text-rose-300 border-rose-400/30 bg-rose-500/10"
                  }`}
                >
                  {log.status || "desconhecido"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
