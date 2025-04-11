"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomCalendar from "@/components/Calendar";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import ToastCustom from "@/components/Toast";
import { toast } from "sonner";
import {
  updateEmployeeAPI,
  deleteEmployeeAPI,
  Employee,
} from "@/services/employeeService";
import { isEmailValidOrNot, isPhoneValidOrNot } from "@/utils/validation";
import { useDelete } from "@/hooks/useDelete";

interface EmployeeDetailDialogProps {
  employee: Employee;
  onClose: () => void;
  onEmployeeUpdated: () => void;
}

const fieldLabels: Record<keyof Employee, string> = {
  _id: "ID",
  id: "Mã nhân viên",
  name: "Họ tên",
  position: "Chức vụ",
  department: "Phòng ban",
  avatar: "Ảnh đại diện",
  gender: "Giới tính",
  birthDate: "Ngày sinh",
  phone: "Điện thoại",
  email: "Email",
  probationDate: "Ngày thử việc",
  officialDate: "Ngày chính thức",
  contractType: "Loại HĐ",
  seniority: "Thâm niên",
  insurance: "Bảo hiểm",
  status: "Trạng thái",
  password: "Mật khẩu",
  permissions: "Quyền truy cập",
};

const visibleFields: (keyof Employee)[] = [
  "id",
  "name",
  "position",
  "department",
  "gender",
  "birthDate",
  "phone",
  "email",
  "probationDate",
  "officialDate",
  "contractType",
  "seniority",
  "insurance",
  "status",
  "permissions",
];

export default function EmployeeDetailUpdate({
  employee,
  onClose,
  onEmployeeUpdated,
}: EmployeeDetailDialogProps) {
  const [editMode, setEditMode] = useState(false);
  const [employeeData, setEmployeeData] = useState<Employee>(employee);
  const [tempAvatarFile, setTempAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setEmployeeData(employee);
  }, [employee]);

  const handleUpdateField = (field: keyof Employee, value: string) => {
    setEmployeeData({ ...employeeData, [field]: value });
  };

  const handleSaveEdit = async () => {
    const requiredFields: { [key: string]: string } = {
      "Họ tên": employeeData.name,
      "Chức vụ": employeeData.position,
      "Giới tính": employeeData.gender,
      "Ngày sinh": employeeData.birthDate,
      "Điện thoại": employeeData.phone,
      Email: employeeData.email,
      "Trạng thái": employeeData.status,
    };

    for (const [label, value] of Object.entries(requiredFields)) {
      if (!value.trim()) {
        toast.custom(() => (
          <ToastCustom
            message={`❌ ${label} không được để trống`}
            bg="bg-red-500"
          />
        ));
        return;
      }
    }

    const isEmailValid = isEmailValidOrNot(employeeData.email);
    if (!isEmailValid) {
      toast.custom(() => (
        <ToastCustom message="❌ Email không đúng định dạng" bg="bg-red-500" />
      ));
      return;
    }

    const isPhoneValid = isPhoneValidOrNot(employeeData.phone);
    if (!isPhoneValid) {
      toast.custom(() => (
        <ToastCustom message="❌ Số điện thoại không hợp lệ" bg="bg-red-500" />
      ));
      return;
    }

    setLoadingUpdate(true);
    try {
      const updated = await updateEmployeeAPI(employeeData, tempAvatarFile);
      setEmployeeData(updated);
      onEmployeeUpdated();
      toast.custom(() => (
        <ToastCustom message="Cập nhật thành công 🎉" bg="bg-green-500" />
      ));
      setEditMode(false);
      setTempAvatarFile(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân sự:", error);
      toast.custom(() => (
        <ToastCustom message="Lỗi khi cập nhật nhân sự 😢" bg="bg-red-500" />
      ));
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = useDelete<Employee>(employeeData._id!, {
    onDeleteAPI: deleteEmployeeAPI,
    onSuccess: () => {
      onEmployeeUpdated();
      onClose();
    },
  });

  useEffect(() => {
    if (tempAvatarFile) {
      const objectUrl = URL.createObjectURL(tempAvatarFile);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [tempAvatarFile]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30" />
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Thông tin nhân sự</DialogTitle>
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
            <div
              className={`relative group ${
                editMode ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={
                editMode ? () => fileInputRef.current?.click() : undefined
              }
            >
              <Image
                src={previewUrl || employeeData.avatar || "/avatar-user.jpg"}
                alt={employeeData.name}
                width={150}
                height={150}
                className="w-[150px] h-[150px] border object-cover rounded-md"
              />
              {editMode && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 text-white flex items-center justify-center text-sm rounded-md transition">
                  Thay ảnh
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setTempAvatarFile(file);
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 w-full text-sm break-words whitespace-normal">
              {visibleFields.map((key) => {
                const rawValue = employeeData[key];
                const isDateField = [
                  "birthDate",
                  "probationDate",
                  "officialDate",
                ].includes(key);
                const isGenderField = key === "gender";
                const isInsuranceField = (k: keyof Employee) =>
                  k === "insurance";
                const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
                const displayValue =
                  isDateField && value
                    ? dayjs(value).format("DD-MM-YYYY")
                    : value;
                return (
                  <div key={key} className="break-words">
                    <strong className="text-foreground">
                      {fieldLabels[key] || key}:
                    </strong>
                    {editMode ? (
                      isDateField ? (
                        <CustomCalendar
                          value={value ?? ""}
                          onChange={(date) => handleUpdateField(key, date)}
                        />
                      ) : isGenderField ? (
                        <Select
                          value={value ?? ""}
                          onValueChange={(val) => handleUpdateField(key, val)}
                        >
                          <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nam">Nam</SelectItem>
                            <SelectItem value="Nữ">Nữ</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : isInsuranceField(key) ? (
                        <Select
                          value={value ?? ""}
                          onValueChange={(val) => handleUpdateField(key, val)}
                        >
                          <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Có">Có</SelectItem>
                            <SelectItem value="Không">Không</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          className="mt-1"
                          value={value ?? ""}
                          onChange={(e) =>
                            handleUpdateField(key, e.target.value)
                          }
                        />
                      )
                    ) : (
                      ` ${displayValue ?? ""}`
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {editMode && (
            <Button
              className="mt-4"
              onClick={handleSaveEdit}
              disabled={loadingUpdate}
            >
              {loadingUpdate && (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
              )}
              {loadingUpdate ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
