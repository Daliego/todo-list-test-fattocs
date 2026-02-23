import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAREFAS_QUERY_KEY } from "./use-tarefas-query";
import type { Tarefa } from "@/models/tarefa";
import { toast } from "sonner";

export function useReordenarTarefas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderedTasks: Tarefa[]) => {
      const res = await fetch("/api/tarefas/reordenar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: orderedTasks.map((t) => t.id) }),
      });

      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        toast.error(error.message ?? "Erro ao reordenar tarefas");
        return;
      }

      return res.json();
    },
    onMutate: async (orderedTasks) => {
      // Cancela queries pendentes para não sobrescrever o update otimista
      await queryClient.cancelQueries({ queryKey: TAREFAS_QUERY_KEY });

      // Salva o snapshot atual para rollback
      const previous = queryClient.getQueryData<Tarefa[]>(TAREFAS_QUERY_KEY);

      // Atualiza o cache imediatamente com a nova ordem
      queryClient.setQueryData<Tarefa[]>(TAREFAS_QUERY_KEY, orderedTasks);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Rollback: restaura o estado anterior se a mutation falhar
      if (context?.previous) {
        queryClient.setQueryData(TAREFAS_QUERY_KEY, context.previous);
      }
    },

    onSettled: (_data, error) => {
      // Só invalida (refetch) se houve erro, para garantir consistência
      if (error) {
        queryClient.invalidateQueries({ queryKey: TAREFAS_QUERY_KEY });
      }
    },
  });
}
