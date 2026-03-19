import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function BotSuccessBarChart({ bots }) {
  const data = bots
    .filter(b => b.total_tasks_executed > 0)
    .sort((a, b) => (b.success_rate || 0) - (a.success_rate || 0))
    .slice(0, 6)
    .map(b => ({
      nome: b.name.length > 12 ? b.name.slice(0, 12) + "…" : b.name,
      taxa: b.success_rate || 0,
    }));

  const placeholder = [
    { nome: "Bot Insta", taxa: 94 },
    { nome: "Bot TikTok", taxa: 87 },
    { nome: "Bot X", taxa: 72 },
  ];

  const chartData = data.length > 0 ? data : placeholder;

  const getColor = (taxa) => {
    if (taxa >= 80) return "#10b981";
    if (taxa >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-white font-semibold text-sm mb-1">Ranking de Performance</h3>
      <p className="text-white/40 text-xs mb-4">Taxa de sucesso por robô (top 6)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="nome" width={75} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0f0f14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff", fontSize: 12 }}
            formatter={(v) => [`${v}%`, "Taxa de Sucesso"]}
          />
          <Bar dataKey="taxa" name="Sucesso" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={getColor(entry.taxa)} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
