import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  running: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels = {
  active: "Ativo",
  paused: "Pausado",
  error: "Erro",
  scheduled: "Agendado",
  running: "Executando",
  completed: "Concluído",
  failed: "Falhou",
  success: "Sucesso",
  warning: "Aviso",
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export default function StatusBadge({ status, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium text-[11px] tracking-wide uppercase border",
        statusStyles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", 
        status === "active" || status === "completed" || status === "success" ? "bg-emerald-400" :
        status === "running" ? "bg-violet-400 animate-pulse" :
        status === "paused" || status === "warning" ? "bg-amber-400" :
        status === "error" || status === "failed" || status === "urgent" ? "bg-red-400" :
        "bg-blue-400"
      )} />
      {statusLabels[status] || status}
    </Badge>
  );
}
