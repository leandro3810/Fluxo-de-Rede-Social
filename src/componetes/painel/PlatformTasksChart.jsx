import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const platformColors = {
  instagram: "#e1306c",
  tiktok: "#69c9d0",
  x: "#94a3b8",
  facebook: "#1877f2",
  linkedin: "#0a66c2",
  youtube: "#ff0000",
};

const platformLabels = {
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export default function PlatformTasksChart({ bots, tasks }) {
  const data = useMemo(() => {
    const botsByPlatform = {};
    bots.forEach(b => {
      if (!botsByPlatform[b.platform]) botsByPlatform[b.platform] = [];
      botsByPlatform[b.platform].push(b.id);
    });

    return Object.entries(botsByPlatform).map(([platform, botIds]) => ({
      plataforma: platformLabels[platform] || platform,
      platform,
      tarefas: tasks.filter(t => botIds.includes(t.bot_id)).length,
      concluidas: tasks.filter(t => botIds.includes(t.bot_id) && t.status === "completed").length,
    }));
  }, [bots, tasks]);

  const placeholder = [
    { plataforma: "Instagram", tarefas: 24, concluidas: 18, platform: "instagram" },
    { plataforma: "TikTok", tarefas: 15, concluidas: 12, platform: "tiktok" },
    { plataforma: "X", tarefas: 9, concluidas: 7, platform: "x" },
  ];

  const chartData = data.length > 0 ? data : placeholder;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-white font-semibold text-sm mb-1">Tarefas por Plataforma</h3>
      <p className="text-white/40 text-xs mb-4">Total criadas vs. concluídas por plataforma</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="plataforma" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0f0f14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff", fontSize: 12 }}
            labelStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
          <Bar dataKey="tarefas" name="Total" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={platformColors[entry.platform] || "#8b5cf6"} fillOpacity={0.6} />
            ))}
          </Bar>
          <Bar dataKey="concluidas" name="Concluídas" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={platformColors[entry.platform] || "#8b5cf6"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
