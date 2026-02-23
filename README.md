# Monolito TodoList — Teste Fattocs

Essa aplicação foi construída como **teste de conhecimento** para a empresa [Fattocs](https://www.fattocs.com/).

É uma **todolist** que demonstra meus conhecimentos na realização de um CRUD simples com interação com banco de dados em uma única tabela.

---

## Funcionalidades

- **Listar** tarefas ordenadas por campo `ordem`
- **Incluir** nova tarefa com nome, custo (R$) e data-limite
- **Editar** tarefa existente
- **Excluir** tarefa com confirmação
- **Reordenar** tarefas via drag-and-drop (persistido no banco)
- **Destaque visual** para tarefas com custo ≥ R$ 1.000,00
- **Validação de nome único** (impede duplicatas)
- **Somatório** dos custos no rodapé da tabela

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Banco de dados | PostgreSQL 17 (via Docker) |
| ORM | Drizzle ORM |
| UI | React 19 + shadcn/ui (Radix) |
| Estilo | Tailwind CSS 4 |
| Formulários | react-hook-form + Zod |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Data Fetching | TanStack Query (React Query) |
| Gerenciador de Pacotes | pnpm |

---

## Arquitetura de Pastas

```
monolito-todolist/
├── docker-compose.yml
├── drizzle.config.ts
├── src/
│   ├── app/
│   │   ├── api/tarefas/
│   │   │   ├── route.ts                # GET + POST
│   │   │   ├── [id]/route.ts           # PUT + DELETE
│   │   │   ├── reordenar/route.ts      # POST (reordenar)
│   │   │   └── services/
│   │   │       └── tarefas.service.ts  # Regras de negócio
│   │   ├── components/
│   │   │   ├── sortable-row.tsx
│   │   │   ├── tarefa-dialog.tsx
│   │   │   ├── excluir-tarefa-dialog.tsx
│   │   │   └── input-custo-centavos.tsx
│   │   ├── lib/seeds.ts                # Seed de dados fake
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/ui/                  # shadcn/ui
│   ├── db/
│   │   ├── schema.ts                   # Tabela `tarefas`
│   │   ├── index.ts                    # Conexão PostgreSQL
│   │   ├── migrate.ts
│   │   └── seed.ts                     # Runner de seeds
│   ├── hooks/queries/tarefas/          # React Query hooks
│   ├── models/tarefa.ts                # Tipos do domínio
│   └── styles/globals.css
├── drizzle/                            # Migrations
└── public/
```

---

## Como Rodar

### Pré-requisitos

- Node.js ≥ 18
- pnpm
- Docker (para o PostgreSQL)

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/daliego/todo-list-test-fattocs.git
cd monolito-todolist

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Suba o banco de dados
pnpm db:start

# 5. Crie as tabelas
pnpm db:push

# 6. (Opcional) Popule com dados de teste
pnpm db:seed

# 7. Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em **http://localhost:3000**.

### Scripts Disponíveis

| Script | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm db:start` | Sobe o container PostgreSQL |
| `pnpm db:stop` | Para o container |
| `pnpm db:push` | Cria/atualiza tabelas no banco |
| `pnpm db:seed` | Popula o banco com dados fake |
| `pnpm db:setup` | Push + seed em sequência |
| `pnpm db:reset` | Recria o banco do zero |
| `pnpm db:studio` | Abre o Drizzle Studio |

---

## Schema do Banco

Tabela única `tarefas`:

| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | `serial` | Primary Key |
| `nome` | `varchar(255)` | NOT NULL, UNIQUE |
| `custo` | `numeric(10,2)` | NOT NULL |
| `data_limite` | `date` | NOT NULL |
| `ordem` | `integer` | NOT NULL |

---

## API Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/tarefas` | Lista todas as tarefas |
| `POST` | `/api/tarefas` | Cria uma nova tarefa |
| `PUT` | `/api/tarefas/:id` | Atualiza uma tarefa |
| `DELETE` | `/api/tarefas/:id` | Exclui uma tarefa |
| `POST` | `/api/tarefas/reordenar` | Reordena as tarefas |
