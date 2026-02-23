import { db } from "@/db";
import { tarefas } from "@/db/schema";
import { and, eq, ne, sql } from "drizzle-orm";

function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}
export class ServiceError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ServiceError";
    this.status = status;
  }
}

export async function listTasks() {
  return db.select().from(tarefas).orderBy(tarefas.ordem);
}

export async function createTask(data: {
  name: string;
  costInCents: number;
  deadline: string;
}) {
  // Nome não pode duplicar
  const existing = await db
    .select({ id: tarefas.id })
    .from(tarefas)
    .where(eq(tarefas.nome, data.name))
    .limit(1);

  if (existing.length > 0) {
    throw new ServiceError("Já existe uma tarefa com esse nome.", 409);
  }

  // Ordem = último + 1
  const maxRows = await db
    .select({ max: sql<number | null>`max(${tarefas.ordem})` })
    .from(tarefas);

  const nextOrder = (maxRows?.[0]?.max ?? 0) + 1;

  const inserted = await db
    .insert(tarefas)
    .values({
      nome: data.name,
      custo: centsToDecimal(data.costInCents),
      dataLimite: data.deadline,
      ordem: nextOrder,
    })
    .returning({ id: tarefas.id });

  return { id: inserted[0]?.id };
}

export async function updateTask(
  id: number,
  data: { name: string; costInCents: number; deadline: string },
) {
  // Nome não pode duplicar (exceto a própria)
  const duplicate = await db
    .select({ id: tarefas.id })
    .from(tarefas)
    .where(and(eq(tarefas.nome, data.name), ne(tarefas.id, id)))
    .limit(1);

  if (duplicate.length > 0) {
    throw new ServiceError("Já existe uma tarefa com esse nome.", 409);
  }

  await db
    .update(tarefas)
    .set({
      nome: data.name,
      custo: centsToDecimal(data.costInCents),
      dataLimite: data.deadline,
    })
    .where(eq(tarefas.id, id));
}

export async function deleteTask(id: number) {
  await db.delete(tarefas).where(eq(tarefas.id, id));
}

export async function reorderTasks(ids: number[]) {
  if (ids.length === 0) return;

  // Single UPDATE with CASE/WHEN — 1, mesmo que fique uma query extra bigger
  const caseClauses = ids
    .map((id, i) => sql`WHEN ${id}::integer THEN ${i + 1}::integer`)
    .reduce((acc, clause) => sql`${acc} ${clause}`);

  await db.execute(
    sql`UPDATE tarefas SET ordem = CASE id ${caseClauses} END WHERE id IN ${ids}`,
  );
}
