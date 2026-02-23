import * as z from "zod";

export const tarefaFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  costInCents: z.string().min(1, "Custo é obrigatório"),
  deadline: z.string().min(1, "Data-limite é obrigatória"),
});

export type TarefaFormSchema = z.infer<typeof tarefaFormSchema>;
