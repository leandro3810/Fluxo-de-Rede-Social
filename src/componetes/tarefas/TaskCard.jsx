import React from "react";
import StatusBadge from "@/components/shared/StatusBadge";
import PlatformIcon from "@/components/shared/PlatformIcon";
import { Button } from "@/components/ui/button";
import { Play, Pause, Pencil, Trash2, Clock, RefreshCw, ArrowRight } from "lucide-react";
import moment from "moment";

const typeLabels = {
  post: "📝 Publicar",
  like: "❤️ Curtir",
  follow: "➕ Seguir",
  unfollow: "➖ Deixar de seguir",
  comment: "💬 Comentar",
  repost: "🔄 Repostar",
  dm: "✉️ Mensagem",
  story: "📱 Story",
};

const repeatLabels = {
  none: "Uma vez",
  daily: "Diário",
  weekly: "Semanal",
  monthly: "Mensal",
};

export default function TaskCard({ task, bot, onToggle, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300">
      <div className="flex items-start gap-3">
        {bot && <PlatformIcon platform={bot.platform} size="sm" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold text-sm truncate">{task.title}</h3>
            <StatusBadge status={task.status} />
            <StatusBadge status={task.priority} />
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-white/40 text-xs">{typeLabels[task.type] || task.type}</span>
            {bot && <span className="text-white/30 text-xs">{bot.name}</span>}
          </div>
        </div>
      </div>

      {task.content && (
        <p className="text-white/30 text-xs mt-3 line-clamp-2 pl-10">{task.content}</p>
      )}

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.06] flex-wrap">
        {task.schedule_date && (
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <Clock className="w-3 h-3" />
            {moment(task.schedule_date).format("DD/MM/YY HH:mm")}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <RefreshCw className="w-3 h-3" />
          {repeatLabels[task.repeat] || "Uma vez"}
        </div>
        <div className="text-white/40 text-xs">
          {task.executions_count || 0}/{task.max_executions || 1} exec.
        </div>

        {task.tags?.length > 0 && (
          <div className="flex gap-1">
            {task.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40 text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
            onClick={() => onToggle(task)}
          >
            {task.status === "running" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
            onClick={() => onEdit(task)}
          >
            <Pencil className="w-3 h-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-white/40 hover:text-red-400 hover:bg-red-500/10"
            onClick={() => onDelete(task)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
