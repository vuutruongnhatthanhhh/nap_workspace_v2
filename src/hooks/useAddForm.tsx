import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import ToastCustom from "@/components/Toast";

export function useAddForm<T>(
  defaultValue: T,
  addAPI: (data: T) => Promise<any>,
  onAdded: () => void,
  requiredFields?: (keyof T)[]
) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (requiredFields && requiredFields.length > 0) {
      const isEmptyRequired = requiredFields.some((field) => {
        const value = (data as Record<string, any>)[field as string];
        return !value || (typeof value === "string" && value.trim() === "");
      });

      if (isEmptyRequired) {
        toast.custom(() => (
          <ToastCustom
            message="❌ Vui lòng điền đầy đủ các trường bắt buộc có dấu *"
            bg="bg-red-500"
          />
        ));
        return;
      }
    }

    setLoading(true);
    try {
      await addAPI(data);
      onAdded();
      setData(defaultValue);
      toast.custom(() => (
        <ToastCustom message="🎉 Thêm mới thành công!" bg="bg-green-500" />
      ));
      setOpen(false);
    } catch (error) {
      console.log("Lỗi khi thêm:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    open,
    setOpen,
    data,
    setData,
    loading,
    setLoading,
    handleSubmit,
  };
}
