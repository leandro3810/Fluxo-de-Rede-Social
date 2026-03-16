import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BotPermissionsDialog({ open, onOpenChange, bot, onSave }) {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bot) {
      setEmails(bot.allowed_users || []);
    } else {
      setEmails([]);
    }
  }, [bot, open]);

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (email) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ allowed_users: emails });
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f14] border-white/[0.08] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            Gerenciar Permissões
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-white/60 text-xs">Usuários com Acesso</Label>
            <p className="text-white/40 text-xs">
              Defina quais usuários podem visualizar e editar este robô
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
              placeholder="email@exemplo.com"
              className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20"
            />
            <Button
              onClick={handleAddEmail}
              disabled={!newEmail}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {emails.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-sm">
                Nenhum usuário adicionado. O robô é acessível a todos.
              </div>
            ) : (
              emails.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                >
                  <span className="text-white/70 text-sm truncate">{email}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => handleRemoveEmail(email)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white hover:bg-white/[0.05]">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {saving ? "Salvando..." : "Salvar Permissões"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
