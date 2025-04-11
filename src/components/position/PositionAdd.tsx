"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAddForm } from "@/hooks/useAddForm";
import { addPositionAPI, Position } from "@/services/positionService";

interface PositionAddDialogProps {
  onPositionAdded: () => void;
}

const defaultPosition: Position = {
  name: "",
  description: "",
};

function PositionAdd({ onPositionAdded }: PositionAddDialogProps) {
  // name is required field
  const {
    open,
    setOpen,
    data: positionData,
    setData: setPositionData,
    loading,
    handleSubmit,
  } = useAddForm<Position>(defaultPosition, addPositionAPI, onPositionAdded, [
    "name",
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Thêm chức vụ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="mb-6">Thêm chức vụ</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div>
            <Label className="mb-2">
              Chức vụ <span className="text-red-600">*</span>
            </Label>
            <Input
              maxLength={50}
              value={positionData.name}
              onChange={(e) =>
                setPositionData({ ...positionData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-2">Mô tả</Label>
            <Input
              maxLength={200}
              value={positionData.description}
              onChange={(e) =>
                setPositionData({
                  ...positionData,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="shrink-0 mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && (
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
            )}
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PositionAdd;
