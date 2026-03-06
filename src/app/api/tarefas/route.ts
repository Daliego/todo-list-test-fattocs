import { NextResponse } from "next/server";
import {
  createTask,
  listTasks,
  ServiceError,
} from "@/app/api/tarefas/services/tarefas.service";
import { tarefaFormSchema } from "@/app/lib/validations";

export async function GET() {
  const rows = await listTasks();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = tarefaFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const result = await createTask({
      ...parsed.data,
      costInCents: Number(parsed.data.costInCents),
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("error", err);

    if (err instanceof ServiceError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "Erro ao criar a tarefa" },
      { status: 500 },
    );
  }
}
