"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ExcluirTarefaDialog } from "@/app/components/excluir-tarefa-dialog";
import { SortableRow } from "@/app/components/sortable-row";
import { TarefaDialog } from "@/app/components/tarefa-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReordenarTarefas, useTarefasQuery } from "@/hooks/queries/tarefas";
import type { Tarefa } from "@/models/tarefa";

const fmtBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Page() {
  const { data: tarefas = [], isLoading } = useTarefasQuery();
  const reorderMutation = useReordenarTarefas();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tarefa | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Tarefa | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = tarefas.findIndex((t) => t.id === active.id);
    const to = tarefas.findIndex((t) => t.id === over.id);
    if (from < 0 || to < 0) return;

    const next = arrayMove(tarefas, from, to);
    await reorderMutation.mutateAsync(next);
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= tarefas.length) return;

    const next = arrayMove(tarefas, index, target);
    await reorderMutation.mutateAsync(next);
  }

  const total = tarefas.reduce((acc, t) => {
    return acc + Number(t.custo);
  }, 0);

  const AddTarefaButton = () => (
    <Button
      onClick={() => {
        setIsEditing(false);
        setSelectedTask(null);
        setDialogOpen(true);
      }}
    >
      Adicionar nova
    </Button>
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">
            Você tem {tarefas.length} tarefa(s) hoje
          </h1>
        </div>

        <div>
          <Button
            onClick={() => {
              setIsEditing(false);
              setSelectedTask(null);
              setDialogOpen(true);
            }}
          >
            Adicionar nova
          </Button>
        </div>
      </div>

      <div className="rounded-xl border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tarefas.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" />
                    <TableHead>Id</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Custo (R$)</TableHead>
                    <TableHead>Data-limite</TableHead>
                    <TableHead>Ordem de Apresentação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          Carregando...
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : tarefas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Nenhuma tarefa cadastrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tarefas.map((tarefa, index) => (
                      <SortableRow
                        key={tarefa.id}
                        tarefa={tarefa}
                        isFirst={index === 0}
                        isLast={index === tarefas.length - 1}
                        onMoveUp={() => handleMove(index, "up")}
                        onMoveDown={() => handleMove(index, "down")}
                        onEdit={() => {
                          setIsEditing(true);
                          setSelectedTask(tarefa);
                          setDialogOpen(true);
                        }}
                        onDelete={() => {
                          setTaskToDelete(tarefa);
                          setDeleteOpen(true);
                        }}
                      />
                    ))
                  )}
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <AddTarefaButton />
                    </TableCell>
                  </TableRow>
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5} className="font-medium">
                      Somatório dos custos
                    </TableCell>
                    <TableCell colSpan={2} className="text-right font-medium">
                      {fmtBRL.format(total)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <TarefaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={isEditing}
        task={selectedTask}
      />

      <ExcluirTarefaDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        taskId={taskToDelete?.id}
        name={taskToDelete?.nome}
      />
    </div>
  );
}
