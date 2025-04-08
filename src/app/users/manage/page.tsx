"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, CalendarIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import PasswordInput from "@/components/PasswordInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CustomCalendar from "@/components/Calendar";
import ToastCustom from "@/components/Toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

dayjs.extend(customParseFormat);

interface Employee {
  _id?: string;
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
  permissions: string[]; // ex: ["create_employee", "update_employee"]
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

export default function EmployeeManagement() {
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [birthDateInput, setBirthDateInput] = useState("");
  const [birthDateError, setBirthDateError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [newEmployee, setNewEmployee] = useState<Employee>({
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
  });

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
    password: "",
    probationDate: "",
    officialDate: "",
    contractType: "",
    seniority: "",
    insurance: "",
    status: "",
    permissions: [],
  };

  const checkPasswordStrength = (password: string): string | null => {
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!/[a-z]/.test(password)) return "Mật khẩu phải chứa chữ thường";
    if (!/[A-Z]/.test(password)) return "Mật khẩu phải chứa chữ hoa";
    if (!/\d/.test(password)) return "Mật khẩu phải chứa số";
    if (!/[!@#$%^&*()_\-+=\[{\]};:'"\\|,.<>/?`~]/.test(password))
      return "Mật khẩu phải chứa ký tự đặc biệt";
    return null;
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) {
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    }
  };

  const handleUpdateField = (field: keyof Employee, value: string) => {
    if (!selectedEmployee) return;
    setSelectedEmployee({ ...selectedEmployee, [field]: value });
  };

  const handleSaveEdit = () => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp._id === selectedEmployee?._id ? selectedEmployee! : emp
      )
    );
    setEditMode(false);
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handleAddEmployee = async () => {
    const { name, email, password, gender, birthDate, phone, insurance } =
      newEmployee;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const passwordError = checkPasswordStrength(password);

    const isPhoneValid = /^[0-9]{8,11}$/.test(phone);

    if (!name || !email || !password || !gender || !birthDate || !phone) {
      toast.custom((t) => (
        <ToastCustom
          message="❌ Vui lòng điền đầy đủ các trường bắt buộc có dấu *"
          bg="bg-red-500"
        />
      ));
      return;
    }

    if (!isEmailValid) {
      toast.custom((t) => (
        <ToastCustom message="❌ Email không đúng định dạng" bg="bg-red-500" />
      ));
      return;
    }

    if (passwordError) {
      toast.custom(() => (
        <ToastCustom message={"❌ " + passwordError} bg="bg-red-500" />
      ));
      return;
    }

    if (!isPhoneValid) {
      toast.custom(() => (
        <ToastCustom message="❌ Số điện thoại không hợp lệ" bg="bg-red-500" />
      ));
      return;
    }

    try {
      const res = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error: ${res.status} - ${text}`);
      }

      const created: Employee = await res.json();
      fetchEmployees();
      setNewEmployee(defaultEmployee);
      toast.custom((t) => (
        <ToastCustom message="Thêm nhân sự thành công 🎉" bg="bg-green-500" />
      ));
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Lỗi khi thêm nhân sự:", error);
      toast.custom((t) => (
        <ToastCustom message="Lỗi khi thêm nhân sự 😢" bg="bg-red-500" />
      ));
    }
  };

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("/api/employee");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error("Dữ liệu không hợp lệ:", data);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    <div className="max-w-5xl mx-auto mb-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        Quản lý nhân sự 🧑
      </h1>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <Input
          placeholder="Tìm kiếm theo tên..."
          className="w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* add user */}
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
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
                    setNewEmployee({
                      ...newEmployee,
                      department: e.target.value,
                    })
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
                  onChange={(date) => {
                    setNewEmployee({ ...newEmployee, birthDate: date });
                  }}
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
                  value={newEmployee.email || ""}
                  onChange={(e) => {
                    const email = e.target.value;
                    setNewEmployee({ ...newEmployee, email });

                    // Regex kiểm tra định dạng email
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
                      permissions: e.target.value
                        .split(",")
                        .map((p) => p.trim()),
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
                    setNewEmployee({
                      ...newEmployee,
                      contractType: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Thâm niên</Label>
                <Input
                  value={newEmployee.seniority || ""}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      seniority: e.target.value,
                    })
                  }
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
                    <SelectValue placeholder="Chọn bảo hiểm" />
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
              <Button onClick={handleAddEmployee}>Lưu</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* table */}
      <Card>
        <CardContent className="overflow-x-auto">
          <table className="w-full table-fixed text-sm min-w-[500px]">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-white/10">
                <th className="py-2 px-2 w-[80px]"></th>
                {/* <th className="py-2 px-2 w-1/3">Mã</th> */}
                <th className="py-2 px-2 w-1/3">Họ tên</th>
                <th className="py-2 px-2 w-1/3">Chức vụ</th>
                <th className="py-2 px-2 w-1/3">Phòng ban</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-muted-foreground py-6 italic"
                  >
                    Không tìm thấy nhân sự
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <Dialog key={emp._id}>
                    <DialogTrigger asChild>
                      <tr
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setEditMode(false);
                        }}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition"
                      >
                        <td className="py-2 px-2">
                          <Image
                            src={emp.avatar}
                            alt={emp.name}
                            width={50}
                            height={50}
                            className="rounded-md border object-cover"
                          />
                        </td>
                        {/* <td className="py-2 px-2 break-words">{emp.id}</td> */}
                        <td className="py-2 px-2 break-words">{emp.name}</td>
                        <td className="py-2 px-2 break-words">
                          {emp.position}
                        </td>
                        <td className="py-2 px-2 break-words">
                          {emp.department}
                        </td>
                      </tr>
                    </DialogTrigger>

                    {/* detail user  */}
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
                            onClick={() => handleDelete(emp.id)}
                          />
                        </div>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4 mt-4 flex-1 overflow-y-auto pr-2">
                        <Image
                          src={emp.avatar}
                          alt={emp.name}
                          width={200}
                          height={200}
                          className="border object-cover rounded-md"
                        />
                        <div className="grid grid-cols-1 gap-2 w-full text-sm break-words whitespace-normal">
                          {Object.entries(selectedEmployee || {}).map(
                            ([key, value]) => (
                              <p key={key} className="break-words">
                                <strong>
                                  {fieldLabels[key as keyof Employee] || key}:
                                </strong>
                                {editMode ? (
                                  <Input
                                    className="mt-1"
                                    value={value as string}
                                    onChange={(e) =>
                                      handleUpdateField(
                                        key as keyof Employee,
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  ` ${value}`
                                )}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                      {editMode && (
                        <Button className="mt-4" onClick={handleSaveEdit}>
                          Lưu thay đổi
                        </Button>
                      )}
                    </DialogContent>
                  </Dialog>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={cn(
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "",
                        "cursor-pointer"
                      )}
                    />
                  </PaginationItem>

                  {renderPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-1 text-muted-foreground select-none">
                          ...
                        </span>
                      ) : (
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(Number(page))}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={cn(
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "",
                        "cursor-pointer"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
