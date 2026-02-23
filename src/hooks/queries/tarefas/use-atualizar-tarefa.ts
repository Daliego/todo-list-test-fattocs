import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAREFAS_QUERY_KEY } from "./use-tarefas-query";
import { toast } from "sonner";

type UpdateTaskPayload = {
  id: number;
  name: string;
  costInCents: string;
  deadline: string;
};

export function useAtualizarTarefa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateTaskPayload) => {
      const res = await fetch(`/api/tarefas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        toast.error(error.message ?? "Erro ao atualizar tarefa");
        return;
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAREFAS_QUERY_KEY });
    },
  });
}
