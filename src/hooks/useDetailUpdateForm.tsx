import { useState } from "react";
import { toast } from "sonner";
import ToastCustom from "@/components/Toast";

export function useDetailUpdateForm<T>(
  initialData: T,
  updateAPI: (data: T) => Promise<T>,
  onUpdated: (data: T) => void,
  requiredFields: (keyof T)[],
  fieldLabels?: Record<keyof T, string>
) {
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field: keyof T, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleSave = async () => {
    const emptyField = requiredFields.find((field) => {
      const val = data[field];
      return !val || (typeof val === "string" && val.trim() === "");
    });

    if (emptyField) {
      const label = fieldLabels?.[emptyField] || (emptyField as string); // ưu tiên label
      toast.custom(() => (
        <ToastCustom
          message={`❌ ${label} không được để trống`}
          bg="bg-red-500"
        />
      ));
      return;
    }

    setLoading(true);
    try {
      const updated = await updateAPI(data);
      setData(updated);
      onUpdated(updated);
      toast.custom(() => (
        <ToastCustom message="🎉 Cập nhật thành công!" bg="bg-green-500" />
      ));
      setEditMode(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.custom(() => (
        <ToastCustom message="❌ Lỗi khi cập nhật dữ liệu" bg="bg-red-500" />
      ));
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    setData,
    editMode,
    setEditMode,
    loading,
    handleSave,
    handleFieldChange,
  };
}
