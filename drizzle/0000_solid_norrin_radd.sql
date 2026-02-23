CREATE TABLE "tarefas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"custo" numeric(10, 2) NOT NULL,
	"data_limite" date NOT NULL,
	"ordem" integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "tarefas_nome_unique" ON "tarefas" USING btree ("nome");