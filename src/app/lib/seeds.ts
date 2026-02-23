import { faker } from "@faker-js/faker/locale/pt_BR";
import { db } from "@/db";
import { tarefas } from "@/db/schema";

export async function seedTarefas({ count }: { count: number }) {
  const rows = Array.from({ length: count }, (_, i) => ({
    nome: faker.lorem.sentence({ min: 2, max: 5 }).replace(/\.$/, ""),
    custo: faker.finance.amount({ min: 10, max: 5000, dec: 2 }),
    dataLimite: faker.date.soon({ days: 90 }).toISOString().split("T")[0]!,
    ordem: i + 1,
  }));

  await db.insert(tarefas).values(rows);

  console.log(`  ✅ Inseridas ${rows.length} tarefas`);
}
