"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useSubtags } from "@/hooks/use-subtags";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function SubtagsPage() {
  const { subtags, isLoading, createSubtag, updateSubtag, deleteSubtag } = useSubtags();

  const [newSubtagName, setNewSubtagName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subtagToDelete, setSubtagToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleCreate = async () => {
    if (!newSubtagName.trim()) return;

    setIsCreating(true);
    try {
      await createSubtag({ name: newSubtagName.trim() });
      setNewSubtagName("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      await updateSubtag(editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSubtagToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subtagToDelete) return;

    try {
      await deleteSubtag(subtagToDelete.id);
      setDeleteDialogOpen(false);
      setSubtagToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Gestión de Subtags
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Crea y administra los subtags para tus platos
          </p>
        </div>
        <Link href="/admin/menu">
          <Button variant="outline">Volver a Platos</Button>
        </Link>
      </div>

      {/* Crear nuevo subtag */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Agregar Nuevo Subtag</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Nombre del subtag (ej: Vegetariano, Picante, Sin Gluten)"
            value={newSubtagName}
            onChange={(e) => setNewSubtagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="flex-1"
          />
          <Button onClick={handleCreate} disabled={isCreating || !newSubtagName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      {/* Lista de subtags */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Subtags Existentes ({subtags.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2 text-muted-foreground">Cargando...</p>
          </div>
        ) : subtags.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay subtags creados aún.</p>
            <p className="text-sm">Agrega el primer subtag usando el formulario de arriba.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subtags.map((subtag) => (
              <div
                key={subtag.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              >
                {editingId === subtag.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveEdit}
                      disabled={!editingName.trim()}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge variant="secondary" className="text-sm">
                      {subtag.name}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartEdit(subtag.id, subtag.name)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(subtag.id, subtag.name)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar subtag?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el subtag <strong>&quot;{subtagToDelete?.name}&quot;</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer. Los platos que tengan este subtag lo perderán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

