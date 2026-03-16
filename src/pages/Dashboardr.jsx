import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import BotOverviewCards from "@/components/dashboard/BotOverviewCards";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: bots = [], isLoading: lb } = useQuery({
    queryKey: ["bots"],
    queryFn: () => base44.entities.Bot.list("-created_date"),
  });
  const { data: tasks = [], isLoading: lt } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date"),
  });
  const { data: logs = [], isLoading: ll } = useQuery({
    queryKey: ["logs"],
    queryFn: () => base44.entities.TaskLog.list("-created_date", 50),
  });

  const isLoading = lb || lt || ll;

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
        <h1 className="text-2xl font-bold text-white tracking-tight">Painel</h1>
        <p className="text-white/40 text-sm mt-1">Visão geral dos seus robôs e tarefas</p>
      </div>

      <DashboardStats bots={bots} tasks={tasks} logs={logs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BotOverviewCards bots={bots} tasks={tasks} />
        <RecentActivity logs={logs} bots={bots} tasks={tasks} />
      </div>
    </div>
  );
}
