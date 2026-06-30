import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  bot_id: z.string().min(1, "Selecione um robô"),
  type: z.string().min(1, "Selecione o tipo de tarefa"),
  priority: z.string().default("medium"),
  content: z.string().optional(),
  target_url: z.string().optional(),
  schedule_date: z.string().optional(),
  repeat: z.string().default("none"),
  max_executions: z.coerce.number().min(1).default(1),
  tags: z.string().optional(),
});

const defaultValues = {
  title: "",
  bot_id: "",
  type: "post",
  priority: "medium",
  content: "",
  target_url: "",
  schedule_date: "",
  repeat: "none",
  max_executions: 1,
  tags: "",
};

export function useTaskForm({ task, bots, open }) {
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (task) {
      form.reset({
        title: task.title,
        bot_id: task.bot_id,
        type: task.type,
        priority: task.priority || "medium",
        content: task.content || "",
        target_url: task.target_url || "",
        schedule_date: task.schedule_date ? task.schedule_date.slice(0, 16) : "",
        repeat: task.repeat || "none",
        max_executions: task.max_executions || 1,
        tags: (task.tags || []).join(", "),
      });
    } else {
      form.reset({ ...defaultValues, bot_id: bots[0]?.id || "" });
    }
  }, [task, open, bots, form]);

  const prepareData = (values) => ({
    title: values.title,
    bot_id: values.bot_id,
    type: values.type,
    priority: values.priority,
    content: values.content || "",
    target_url: values.target_url || "",
    schedule_date: values.schedule_date || "",
    repeat: values.repeat,
    max_executions: values.max_executions,
    tags: values.tags
      ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
  });

  return { form, prepareData };
}
