import React from "react";
import StatCard from "@/components/shared/StatCard";
import { Bot, ListChecks, Zap, TrendingUp } from "lucide-react";

export default function DashboardStats({ bots, tasks, logs }) {
  const activeBots = bots.filter(b => b.status === "active").length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const runningTasks = tasks.filter(t => t.status === "running").length;
  const successLogs = logs.filter(l => l.status === "success").length;
  const successRate = logs.length > 0 ? Math.round((successLogs / logs.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Robôs Ativos"
        value={activeBots}
        icon={Bot}
        accentColor="violet"
        trend={12}
      />
      <StatCard
        label="Tarefas Agendadas"
        value={tasks.filter(t => t.status === "scheduled").length}
        icon={ListChecks}
        accentColor="blue"
      />
      <StatCard
        label="Em Execução"
        value={runningTasks}
        icon={Zap}
        accentColor="amber"
      />
      <StatCard
        label="Taxa de Sucesso"
        value={`${successRate}%`}
        icon={TrendingUp}
        accentColor="emerald"
        trend={5}
      />
    </div>
  );
}
