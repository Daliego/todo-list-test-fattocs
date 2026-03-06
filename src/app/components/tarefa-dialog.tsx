"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { tarefaFormSchema } from "@/app/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtualizarTarefa, useCriarTarefa } from "@/hooks/queries/tarefas";
import type { Tarefa } from "@/models/tarefa";
import { InputCostCents } from "./input-custo-centavos";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isEditing: boolean;
  task?: Tarefa | null;
};

/** Form input type before Zod transform. */
type TaskFormInput = {
  name: string;
  costInCents: string;
  deadline: string;
};

function decimalToCentsStr(decimal: string) {
  const n = Number(decimal);
  const cents = Math.round(n * 100);
  return String(Math.max(0, cents));
}

export function TarefaDialog({ open, onOpenChange, isEditing, task }: Props) {
  const form = useForm<TaskFormInput>({
    resolver: zodResolver(tarefaFormSchema),
    defaultValues: {
      name: "",
      costInCents: "0",
      deadline: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    if (isEditing && task) {
      form.reset({
        name: task.nome,
        costInCents: decimalToCentsStr(String(task.custo)),
        deadline: String(task.dataLimite),
      });
    } else {
      form.reset({ name: "", costInCents: "0", deadline: "" });
    }
  }, [open, isEditing, task, form]);

  const [apiError, setApiError] = React.useState<string | null>(null);

  const createMutation = useCriarTarefa();
  const updateMutation = useAtualizarTarefa();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: TaskFormInput) {
    setApiError(null);

    // Eu precisei converter novamente para String para nao lançar erro no zod
    const payload = {
      ...values,
      costInCents: String(values.costInCents),
    };

    try {
      if (isEditing && task) {
        await updateMutation.mutateAsync({ id: task.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch (err: unknown) {
      setApiError(
        (err as { message: string }).message ?? "Não foi possível salvar.",
      );
    }
  }

  const title = isEditing ? "Editar tarefa" : "Adicionar tarefa";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome da tarefa</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name?.message ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Custo (R$)</Label>
            <Controller
              control={form.control}
              name="costInCents"
              render={({ field }) => (
                <InputCostCents
                  value={String(field.value)}
                  onChange={field.onChange}
                  placeholder="0,00"
                />
              )}
            />
            {form.formState.errors.costInCents?.message ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.costInCents.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Data-limite</Label>
            <Input id="deadline" type="date" {...form.register("deadline")} />
            {form.formState.errors.deadline?.message ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.deadline.message}
              </p>
            ) : null}
          </div>

          {apiError ? (
            <p className="text-destructive text-sm">{apiError}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
