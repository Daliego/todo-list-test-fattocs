import { useQuery } from "@tanstack/react-query";
import type { Tarefa } from "@/models/tarefa";

export const TAREFAS_QUERY_KEY = ["tarefas"] as const;

export function useTarefasQuery() {
  return useQuery<Tarefa[]>({
    queryKey: TAREFAS_QUERY_KEY,
    queryFn: async () => {
      const fetchResponse = await fetch("/api/tarefas", { cache: "no-store" });

      const response = (await fetchResponse.json()) as Tarefa[];

      return response;
    },
  });
}
