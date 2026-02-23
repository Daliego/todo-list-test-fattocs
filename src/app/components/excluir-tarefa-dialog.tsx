"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExcluirTarefa } from "@/hooks/queries/tarefas";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  taskId?: number;
  name?: string;
};

export function ExcluirTarefaDialog({
  open,
  onOpenChange,
  taskId,
  name,
}: Props) {
  const deleteMutation = useExcluirTarefa();
  const loading = deleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
        </DialogHeader>

        <p className="text-sm">
          Tem certeza que deseja excluir a tarefa{" "}
          <span className="font-medium">{name ?? ""}</span>?
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Não
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={async () => {
              if (!taskId) return;
              await deleteMutation.mutateAsync(taskId);
              onOpenChange(false);
            }}
          >
            Sim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
