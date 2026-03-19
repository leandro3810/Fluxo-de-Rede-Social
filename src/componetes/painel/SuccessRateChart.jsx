import React from "react";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Legend
} from "recharts";

export default function SuccessRateChart({ bots }) {
  const data = bots
    .filter(b => b.total_tasks_executed > 0)
    .slice(0, 5)
    .map((b, i) => ({
      name: b.name.length > 16 ? b.name.slice(0, 16) + "…" : b.name,
      value: b.success_rate || 0,
      fill: ["#8b5cf6", "#7c3aed", "#a78bfa", "#6d28d9", "#c4b5fd"][i],
    }));

  const placeholder = [
    { name: "Bot A", value: 92, fill: "#8b5cf6" },
    { name: "Bot B", value: 78, fill: "#7c3aed" },
    { name: "Bot C", value: 85, fill: "#a78bfa" },
  ];

  const chartData = data.length > 0 ? data : placeholder;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-white font-semibold text-sm mb-1">Taxa de Sucesso por Robô</h3>
      <p className="text-white/40 text-xs mb-4">Percentual de execuções bem-sucedidas</p>
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={chartData}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            minAngle={15}
            background={{ fill: "rgba(255,255,255,0.03)" }}
            clockWise
            dataKey="value"
            label={{ position: "insideStart", fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{ background: "#0f0f14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff" }}
            formatter={(v) => [`${v}%`, "Sucesso"]}
          />
          <Legend
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
