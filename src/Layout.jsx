import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  ListChecks,
  ScrollText,
  Menu,
  X,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Robôs", icon: Bot, page: "Bots" },
  { name: "Tarefas", icon: ListChecks, page: "Tasks" },
  { name: "Logs", icon: ScrollText, page: "Logs" },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <style>{`
        :root {
          --background: 0 0% 3%;
          --foreground: 0 0% 98%;
        }
        body { background-color: #08080c; }
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
      `}</style>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#08080c]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">SocialBots</span>
        </div>
        <Button variant="ghost" size="icon" className="text-white/60" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-full w-[240px] bg-[#0c0c12]/95 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col transition-transform duration-300",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">SocialBots</h1>
            <p className="text-[10px] text-white/30 font-medium tracking-widest uppercase">Automação</p>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map(item => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5", isActive && "text-violet-400")} />
                {item.name}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/10">
          <p className="text-xs text-white/50 leading-relaxed">
            Sistema de automação para redes sociais. Gerencie robôs e tarefas.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn("lg:ml-[240px] pt-14 lg:pt-0 min-h-screen")}>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
