"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomCalendar from "@/components/Calendar";
import PasswordInput from "@/components/PasswordInput";
import ToastCustom from "@/components/Toast";
import { toast } from "sonner";
import { addEmployeeAPI, Employee } from "@/services/employeeService";
import {
  checkPasswordStrength,
  isEmailValidOrNot,
  isPhoneValidOrNot,
} from "@/utils/validation";
import { useAddForm } from "@/hooks/useAddForm";

interface EmployeeAddDialogProps {
  onEmployeeAdded: () => void;
}

const defaultEmployee: Employee = {
  id: "",
  name: "",
  position: "",
  department: "",
  avatar: "/avatar-user.jpg",
  gender: "",
  birthDate: "",
  phone: "",
  email: "",
  probationDate: "",
  officialDate: "",
  contractType: "",
  seniority: "",
  insurance: "",
  status: "",
  password: "",
  permissions: [],
};

function EmployeeAdd({ onEmployeeAdded }: EmployeeAddDialogProps) {
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    open,
    setOpen,
    data: newEmployee,
    setData: setNewEmployee,
    loading,
    handleSubmit,
  } = useAddForm<Employee>(
    defaultEmployee,
    async (data) => {
      const {
        name,
        email,
        password,
        gender,
        birthDate,
        phone,
        position,
        status,
      } = data;

      // Validate
      if (!isEmailValidOrNot(email)) {
        toast.custom(() => (
          <ToastCustom
            message="❌ Email không đúng định dạng"
            bg="bg-red-500"
          />
        ));
        throw new Error("Invalid email");
      }

      const pwdError = checkPasswordStrength(password);
      if (pwdError) {
        toast.custom(() => (
          <ToastCustom message={`❌ ${pwdError}`} bg="bg-red-500" />
        ));
        throw new Error("Weak password");
      }

      if (!isPhoneValidOrNot(phone)) {
        toast.custom(() => (
          <ToastCustom
            message="❌ Số điện thoại không hợp lệ"
            bg="bg-red-500"
          />
        ));
        throw new Error("Invalid phone");
      }

      return addEmployeeAPI(data);
    },
    () => {
      onEmployeeAdded();
    },
    [
      // required fields
      "name",
      "email",
      "password",
      "gender",
      "birthDate",
      "phone",
      "position",
      "status",
    ]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Thêm nhân sự</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="mb-6">Thêm nhân sự</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div>
            <Label className="mb-2">Mã nhân viên</Label>
            <Input
              maxLength={10}
              value={newEmployee.id}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, id: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-2">
              Họ tên<span className="text-red-600">*</span>
            </Label>
            <Input
              maxLength={70}
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-2">
              Chức vụ<span className="text-red-600">*</span>
            </Label>
            <Input
              value={newEmployee.position}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, position: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-2">Phòng ban</Label>
            <Input
              value={newEmployee.department}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, department: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-2">
              Giới tính <span className="text-red-600">*</span>
            </Label>
            <Select
              value={newEmployee.gender}
              onValueChange={(value) =>
                setNewEmployee({ ...newEmployee, gender: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Ngày sinh <span className="text-red-600">*</span>
            </label>
            <CustomCalendar
              value={newEmployee.birthDate}
              onChange={(date) =>
                setNewEmployee({ ...newEmployee, birthDate: date })
              }
            />
          </div>
          <div>
            <Label className="mb-2">
              Điện thoại <span className="text-red-600">*</span>
            </Label>
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={11}
              value={newEmployee.phone || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setNewEmployee({ ...newEmployee, phone: value });
                }
              }}
            />
          </div>
          <div>
            <Label className="mb-2">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              maxLength={70}
              value={newEmployee.email || ""}
              onChange={(e) => {
                const email = e.target.value;
                setNewEmployee({ ...newEmployee, email });
                const isValid = isEmailValidOrNot(email);
                setEmailError(!isValid && email.length > 0);
              }}
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">
                Email không hợp lệ. Vui lòng nhập đúng định dạng.
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2">
              Mật khẩu <span className="text-red-600">*</span>
            </Label>
            <PasswordInput
              value={newEmployee.password || ""}
              onChange={(e) => {
                const pass = e.target.value;
                setNewEmployee({ ...newEmployee, password: pass });
                const error = checkPasswordStrength(pass);
                setPasswordError(error);
              }}
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>
          <div>
            <Label className="mb-2">
              Quyền truy cập (phân cách bằng dấu phẩy)
            </Label>
            <Input
              placeholder="create_employee,update_employee"
              value={newEmployee.permissions?.join(", ") || ""}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  permissions: e.target.value.split(",").map((p) => p.trim()),
                })
              }
            />
          </div>
          <div>
            <Label className="mb-2">Ngày thử việc</Label>
            <CustomCalendar
              value={newEmployee.probationDate}
              onChange={(date) =>
                setNewEmployee({ ...newEmployee, probationDate: date })
              }
            />
          </div>
          <div>
            <Label className="mb-2">Ngày chính thức</Label>
            <CustomCalendar
              value={newEmployee.officialDate}
              onChange={(date) =>
                setNewEmployee({ ...newEmployee, officialDate: date })
              }
            />
          </div>
          <div>
            <Label className="mb-2">Loại hợp đồng</Label>
            <Input
              value={newEmployee.contractType || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, contractType: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-2">Thâm niên</Label>
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              value={newEmployee.seniority || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setNewEmployee({ ...newEmployee, seniority: value });
                }
              }}
            />
          </div>
          <div>
            <Label className="mb-2">Bảo hiểm</Label>
            <Select
              value={newEmployee.insurance || ""}
              onValueChange={(value) =>
                setNewEmployee({ ...newEmployee, insurance: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Có">Có</SelectItem>
                <SelectItem value="Không">Không</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">
              Trạng thái <span className="text-red-600">*</span>
            </Label>
            <Input
              value={newEmployee.status || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, status: e.target.value })
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

export default EmployeeAdd;
