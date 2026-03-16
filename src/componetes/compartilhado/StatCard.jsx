import React from "react";
import { cn } from "@/lib/utils";

export default function StatCard({ label, value, icon: Icon, trend, accentColor = "violet" }) {
  const colors = {
    violet: "from-violet-500/20 to-violet-600/5 text-violet-400",
    emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-400",
    blue: "from-blue-500/20 to-blue-600/5 text-blue-400",
    amber: "from-amber-500/20 to-amber-600/5 text-amber-400",
    red: "from-red-500/20 to-red-600/5 text-red-400",
    pink: "from-pink-500/20 to-pink-600/5 text-pink-400",
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]">
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br opacity-30 blur-2xl -translate-y-6 translate-x-6 group-hover:opacity-50 transition-opacity", colors[accentColor])} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[13px] text-white/40 font-medium tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-white mt-1.5 tracking-tight">{value}</p>
          {trend && (
            <p className={cn("text-xs mt-2 font-medium", trend > 0 ? "text-emerald-400" : "text-red-400")}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% este mês
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-2.5 rounded-xl bg-gradient-to-br", colors[accentColor])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
