import { NextResponse } from "next/server";
import { reorderTasks } from "@/app/api/tarefas/services/tarefas.service";

export async function POST(req: Request) {
  const body = (await req.json()) as { ids?: number[] };

  if (!body?.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json(
      { message: "Lista de IDs inválida." },
      { status: 400 },
    );
  }

  const ids = body.ids.map(Number);
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    return NextResponse.json(
      { message: "IDs duplicados na reordenação." },
      { status: 400 },
    );
  }

  await reorderTasks(ids);
  return NextResponse.json({ ok: true });
}
