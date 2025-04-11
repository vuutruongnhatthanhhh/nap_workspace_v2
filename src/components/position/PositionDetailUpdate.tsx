"use client";

import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  updatePositionAPI,
  deletePositionAPI,
  Position,
} from "@/services/positionService";
import { useDetailUpdateForm } from "@/hooks/useDetailUpdateForm";
import { useDelete } from "@/hooks/useDelete";

interface PositionDetailDialogProps {
  position: Position;
  onClose: () => void;
  onPositionUpdated: () => void;
}

export default function PositionDetailUpdate({
  position,
  onClose,
  onPositionUpdated,
}: PositionDetailDialogProps) {
  const fieldLabels: Record<keyof Position, string> = {
    _id: "ID",
    name: "Chức vụ",
    description: "Mô tả",
  };

  const {
    data: positionData,
    editMode,
    setEditMode,
    loading,
    handleSave,
    handleFieldChange,
  } = useDetailUpdateForm<Position>(
    position,
    updatePositionAPI,
    () => onPositionUpdated(),
    ["name"],
    fieldLabels
  );

  const handleDelete = useDelete<Position>(positionData._id!, {
    onDeleteAPI: deletePositionAPI,
    onSuccess: () => {
      onPositionUpdated();
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30" />
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Thông tin chức vụ</DialogTitle>
            <div className="flex gap-2 mt-1">
              <Pencil
                className="w-5 h-5 cursor-pointer"
                onClick={() => setEditMode(true)}
              />
              <Trash2
                className="w-5 h-5 cursor-pointer text-red-500"
                onClick={handleDelete}
              />
            </div>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 mt-4 flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-2 w-full text-sm break-words whitespace-normal">
              {["name", "description"].map((key) => {
                const value = positionData[key as "name" | "description"];

                return (
                  <div key={key} className="break-words">
                    <strong className="text-foreground">
                      {fieldLabels[key as keyof Position] || key}:
                    </strong>
                    {editMode ? (
                      <Input
                        className="mt-1"
                        value={value ?? ""}
                        onChange={(e) =>
                          handleFieldChange(
                            key as "name" | "description",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      ` ${value ?? ""}`
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {editMode && (
            <Button className="mt-4" onClick={handleSave} disabled={loading}>
              {loading && (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
              )}
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
