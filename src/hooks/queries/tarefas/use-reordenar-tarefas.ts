import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tarefa } from "@/models/tarefa";
import { TAREFAS_QUERY_KEY } from "./use-tarefas-query";

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
      await queryClient.cancelQueries({ queryKey: TAREFAS_QUERY_KEY });

      const previous = queryClient.getQueryData<Tarefa[]>(TAREFAS_QUERY_KEY);

      queryClient.setQueryData<Tarefa[]>(TAREFAS_QUERY_KEY, orderedTasks);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TAREFAS_QUERY_KEY, context.previous);
      }
    },

    onSettled: (_data, error) => {
      if (error) {
        queryClient.invalidateQueries({ queryKey: TAREFAS_QUERY_KEY });
      }
    },
  });
}
