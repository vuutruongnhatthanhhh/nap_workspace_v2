import { toast } from "sonner";
import ToastCustom from "@/components/Toast";

interface UseDeleteConfirmOptions<T> {
  onDeleteAPI: (id: string) => Promise<any>;
  onSuccess: () => void;
}

export function useDelete<T>(id: string, options: UseDeleteConfirmOptions<T>) {
  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        await options.onDeleteAPI(id);
        toast.custom(() => (
          <ToastCustom message="🎉 Xóa thành công!" bg="bg-green-500" />
        ));
        options.onSuccess();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        toast.custom(() => (
          <ToastCustom message="❌ Lỗi khi xóa dữ liệu" bg="bg-red-500" />
        ));
      }
    }
  };

  return handleDelete;
}
