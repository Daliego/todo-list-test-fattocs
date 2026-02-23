import { tarefas } from "@/db/schema";

export type Tarefa = typeof tarefas.$inferSelect;

export type NovaTarefa = typeof tarefas.$inferInsert;
