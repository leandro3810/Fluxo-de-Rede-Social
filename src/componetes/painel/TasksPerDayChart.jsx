import React, { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function TasksPerDayChart({ tasks, logs }) {
  const data = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const key = format(date, "yyyy-MM-dd");
      const dayTasks = tasks.filter(t =>
        t.created_date && t.created_date.startsWith(key)
      ).length;
      const daySuccess = logs.filter(l =>
        l.created_date && l.created_date.startsWith(key) && l.status === "success"
      ).length;
      const dayFailed = logs.filter(l =>
        l.created_date && l.created_date.startsWith(key) && l.status === "failed"
      ).length;
      return {
        dia: format(date, "dd/MM", { locale: ptBR }),
        tarefas: dayTasks,
        sucesso: daySuccess,
        falha: dayFailed,
      };
    });
    return days;
  }, [tasks, logs]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-white font-semibold text-sm mb-1">Tarefas por Dia</h3>
      <p className="text-white/40 text-xs mb-4">Últimos 7 dias — criadas, concluídas e com falha</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gTarefas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gSucesso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gFalha" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="dia" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0f0f14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff", fontSize: 12 }}
            labelStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
          <Area type="monotone" dataKey="tarefas" name="Tarefas" stroke="#8b5cf6" fill="url(#gTarefas)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="sucesso" name="Sucesso" stroke="#10b981" fill="url(#gSucesso)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="falha" name="Falha" stroke="#ef4444" fill="url(#gFalha)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
