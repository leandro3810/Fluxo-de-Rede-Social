import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, Bot, Loader2, Sparkles } from "lucide-react";
import MessageBubble from "@/components/agent/MessageBubble";

export default function Agent() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeConversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(activeConversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [activeConversation?.id]);

  const loadConversations = async () => {
    setLoadingConvs(true);
    const convs = await base44.agents.listConversations({ agent_name: "content_agent" });
    setConversations(convs || []);
    setLoadingConvs(false);
  };

  const handleNewConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: "content_agent",
      metadata: { name: `Conversa ${new Date().toLocaleDateString("pt-BR")}` }
    });
    setConversations(prev => [conv, ...prev]);
    setActiveConversation(conv);
    setMessages([]);
  };

  const handleSelectConversation = async (conv) => {
    const full = await base44.agents.getConversation(conv.id);
    setActiveConversation(full);
    setMessages(full.messages || []);
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    let conv = activeConversation;
    if (!conv) {
      conv = await base44.agents.createConversation({
        agent_name: "content_agent",
        metadata: { name: `Conversa ${new Date().toLocaleDateString("pt-BR")}` }
      });
      setConversations(prev => [conv, ...prev]);
      setActiveConversation(conv);
    }
    const text = input;
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conv, { role: "user", content: text });
    setSending(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)] flex gap-4">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <Button
            onClick={handleNewConversation}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Conversa
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingConvs ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-white/30 text-xs text-center py-8">Nenhuma conversa ainda</p>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                  activeConversation?.id === conv.id
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                <span className="truncate block">{conv.metadata?.name || "Conversa"}</span>
                <span className="text-xs text-white/30">
                  {new Date(conv.created_date).toLocaleDateString("pt-BR")}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Agente de Conteúdo</h2>
            <p className="text-white/40 text-xs">Cria e agenda posts automaticamente</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!activeConversation && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Bot className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Agente de Conteúdo</h3>
                <p className="text-white/40 text-sm mt-1 max-w-sm">
                  Peça para criar posts, stories e agendar conteúdo para seus robôs em qualquer plataforma.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Crie um post para o Instagram amanhã às 18h",
                  "Agende uma story no TikTok para hoje",
                  "Quais robôs estão ativos?"
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-xs hover:text-white hover:border-violet-500/40 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {sending && (
            <div className="flex gap-2 items-center text-white/30 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" /> Agente processando...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Peça para criar ou agendar conteúdo..."
              className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
              disabled={sending}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
