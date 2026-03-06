import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TAREFAS_QUERY_KEY } from "./use-tarefas-query";

export function useExcluirTarefa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/tarefas/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        toast.error(error.message ?? "Erro ao excluir tarefa");
        return;
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAREFAS_QUERY_KEY });
    },
  });
}
