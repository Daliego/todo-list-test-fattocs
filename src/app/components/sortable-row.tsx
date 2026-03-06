"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Tarefa } from "@/models/tarefa";

const fmtBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const fmtDateBR = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

// O warning aqui é somente do eslint, nao precisa se preocupar
type SortableRowProps = {
  tarefa: Tarefa;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function SortableRow({
  tarefa,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tarefa.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cost = Number(tarefa.custo);
  const highlight = cost >= 1000;

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={
        highlight ? "bg-yellow-100/70 dark:bg-yellow-900/20" : undefined
      }
    >
      <TableCell className="w-10">
        <button
          type="button"
          className="inline-flex cursor-grab items-center justify-center rounded-md p-1 hover:bg-muted"
          aria-label="Arrastar para reordenar"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>

      <TableCell>{tarefa.id}</TableCell>
      <TableCell className="font-medium">{tarefa.nome}</TableCell>
      <TableCell>{fmtBRL.format(cost)}</TableCell>
      <TableCell>{fmtDateBR(String(tarefa.dataLimite))}</TableCell>
      <TableCell>{tarefa.ordem}</TableCell>

      <TableCell className="text-right">
        <div className="inline-flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Subir"
            className="cursor-pointer"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Descer"
            className="cursor-pointer"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            aria-label="Editar"
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={onDelete}
            aria-label="Excluir"
            className="cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
