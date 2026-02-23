import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAREFAS_QUERY_KEY } from "./use-tarefas-query";
import { toast } from "sonner";

type CreateTaskPayload = {
  name: string;
  costInCents: string;
  deadline: string;
};

export function useCriarTarefa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const res = await fetch("/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json() as { message: string };
        toast.error(error.message ?? "Erro ao criar tarefa");
        return;
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAREFAS_QUERY_KEY });
    },
  });
}
