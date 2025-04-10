import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/PasswordInput";
import CustomCalendar from "@/components/Calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState } from "react";
import ToastCustom from "@/components/Toast";
import { toast } from "sonner";
import FieldInput from "./FieldInput";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  probationDate: string;
  officialDate: string;
  contractType: string;
  seniority: string;
  insurance: string;
  status: string;
  password: string;
  permissions: string[];
}

interface Props {
  newEmployee: Employee;
  setNewEmployee: React.Dispatch<React.SetStateAction<Employee>>;
  onSubmit: () => void;
  loading: boolean;
}

export default function AddEmployeeForm({
  newEmployee,
  setNewEmployee,
  onSubmit,
  loading,
}: Props) {
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const checkPasswordStrength = (password: string): string | null => {
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!/[a-z]/.test(password)) return "Mật khẩu phải chứa chữ thường";
    if (!/[A-Z]/.test(password)) return "Mật khẩu phải chứa chữ hoa";
    if (!/\d/.test(password)) return "Mật khẩu phải chứa số";
    if (!/[!@#$%^&*()_\-+=\[{\]};:'\"\\|,.<>/?`~]/.test(password))
      return "Mật khẩu phải chứa ký tự đặc biệt";
    return null;
  };

  const handleChange = useCallback(
    <K extends keyof Employee>(field: K, value: Employee[K]) => {
      setNewEmployee((prev) => ({ ...prev, [field]: value }));
    },
    [setNewEmployee]
  );

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      <FieldInput
        label="Mã nhân viên"
        value={newEmployee.id}
        onChange={(val) => handleChange("id", val)}
      />

      <FieldInput
        label="Họ tên"
        required
        value={newEmployee.name}
        onChange={(val) => handleChange("name", val)}
      />

      <FieldInput
        label="Chức vụ"
        required
        value={newEmployee.position}
        onChange={(val) => handleChange("position", val)}
      />

      <FieldInput
        label="Phòng ban"
        value={newEmployee.department}
        onChange={(val) => handleChange("department", val)}
      />

      <div>
        <Label className="mb-2">
          Giới tính <span className="text-red-600">*</span>
        </Label>
        <Select
          value={newEmployee.gender}
          onValueChange={(value) => handleChange("gender", value)}
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
        <Label className="mb-2">
          Ngày sinh <span className="text-red-600">*</span>
        </Label>
        <CustomCalendar
          value={newEmployee.birthDate}
          onChange={(date) => handleChange("birthDate", date)}
        />
      </div>

      <FieldInput
        label="Điện thoại"
        required
        value={newEmployee.phone}
        onChange={(val) => {
          if (/^\d*$/.test(val)) {
            handleChange("phone", val);
          }
        }}
      />

      <div>
        <Label className="mb-2">
          Email <span className="text-red-600">*</span>
        </Label>
        <Input
          value={newEmployee.email || ""}
          onChange={(e) => {
            const email = e.target.value;
            handleChange("email", email);
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
            handleChange("password", pass);
            const error = checkPasswordStrength(pass);
            setPasswordError(error);
          }}
        />
        {passwordError && (
          <p className="text-sm text-red-500 mt-1">{passwordError}</p>
        )}
      </div>

      <FieldInput
        label="Quyền truy cập (phân cách bằng dấu phẩy)"
        value={newEmployee.permissions?.join(", ") || ""}
        onChange={(val) =>
          handleChange(
            "permissions",
            val.split(",").map((p) => p.trim())
          )
        }
      />

      <div>
        <Label className="mb-2">Ngày thử việc</Label>
        <CustomCalendar
          value={newEmployee.probationDate}
          onChange={(date) => handleChange("probationDate", date)}
        />
      </div>

      <div>
        <Label className="mb-2">Ngày chính thức</Label>
        <CustomCalendar
          value={newEmployee.officialDate}
          onChange={(date) => handleChange("officialDate", date)}
        />
      </div>

      <FieldInput
        label="Loại hợp đồng"
        value={newEmployee.contractType}
        onChange={(val) => handleChange("contractType", val)}
      />

      <FieldInput
        label="Thâm niên"
        value={newEmployee.seniority}
        onChange={(val) => handleChange("seniority", val)}
      />

      <div>
        <Label className="mb-2">Bảo hiểm</Label>
        <Select
          value={newEmployee.insurance || ""}
          onValueChange={(value) => handleChange("insurance", value)}
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

      <FieldInput
        label="Trạng thái"
        required
        value={newEmployee.status}
        onChange={(val) => handleChange("status", val)}
      />

      <div className="shrink-0 mt-4">
        <Button onClick={onSubmit} disabled={loading}>
          {loading && (
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
          )}
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
}
