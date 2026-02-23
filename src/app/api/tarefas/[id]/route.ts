import { NextResponse } from "next/server";
import { tarefaFormSchema } from "@/app/lib/validations";
import {
  updateTask,
  deleteTask,
  ServiceError,
} from "@/app/api/tarefas/services/tarefas.service";

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const taskId = Number(id);
  if (!Number.isFinite(taskId))
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });

  const body = await req.json();
  const parsed = tarefaFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await updateTask(taskId, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ServiceError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    throw err;
  }
}

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const taskId = Number(id);
  if (!Number.isFinite(taskId))
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });

  await deleteTask(taskId);
  return NextResponse.json({ ok: true });
}
