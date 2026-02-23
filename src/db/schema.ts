import {
  date,
  integer,
  numeric,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const tarefas = pgTable(
  "tarefas",
  {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    custo: numeric("custo", { precision: 10, scale: 2 }).notNull(),
    dataLimite: date("data_limite").notNull(),
    ordem: integer("ordem").notNull(),
  },
  (t) => ({
    nomeUnique: uniqueIndex("tarefas_nome_unique").on(t.nome),
  }),
);
