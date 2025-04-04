"use client";

import { useState } from "react";
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
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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
}

const fieldLabels: Record<keyof Employee, string> = {
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
};

export default function EmployeeManagement() {
  const [search, setSearch] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "IT12345",
      name: "Nguyễn Văn A",
      position: "Nhân viên kinh doanh",
      department: "Phòng Kinh doanh",
      avatar: "/avatar-user.jpg",
      gender: "Nam",
      birthDate: "1995-08-15",
      phone: "0912345678",
      email: "vana@example.com",
      probationDate: "2023-01-01",
      officialDate: "2023-04-01",
      contractType: "HĐLĐ 1 năm",
      seniority: "1 năm",
      insurance: "Có",
      status: "Đang làm việc",
    },
    {
      id: "IT12346",
      name: "Nguyễn Văn A",
      position: "Nhân viên kinh doanh",
      department: "Phòng Kinh doanh",
      avatar: "/avatar-user.jpg",
      gender: "Nam",
      birthDate: "1995-08-15",
      phone: "0912345678",
      email: "vana@example.com",
      probationDate: "2023-01-01",
      officialDate: "2023-04-01",
      contractType: "HĐLĐ 1 năm",
      seniority: "1 năm",
      insurance: "Có",
      status: "Đang làm việc",
    },
    {
      id: "IT12347",
      name: "Vưu Trường Nhật Thanh",
      position: "Nhân viên kinh doanh",
      department: "Phòng Kinh doanh",
      avatar: "/avatar-user.jpg",
      gender: "Nam",
      birthDate: "1995-08-15",
      phone: "0912345678",
      email: "vana@example.com",
      probationDate: "2023-01-01",
      officialDate: "2023-04-01",
      contractType: "HĐLĐ 1 năm",
      seniority: "1 năm",
      insurance: "Có",
      status: "Đang làm việc",
    },
  ]);

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
  });

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const handleUpdateField = (field: keyof Employee, value: string) => {
    if (!selectedEmployee) return;
    setSelectedEmployee({ ...selectedEmployee, [field]: value });
  };

  const handleSaveEdit = () => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee?.id ? selectedEmployee! : emp
      )
    );
    setEditMode(false);
  };

  const handleAddEmployee = async () => {
    try {
      const res = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (!res.ok) {
        const text = await res.text(); // xem lỗi gì
        throw new Error(`API Error: ${res.status} - ${text}`);
      }

      const created: Employee = await res.json();

      // setEmployees((prev) => [...prev, created]);
      setNewEmployee({
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
      });
      toast.custom((t) => (
        <div className="bg-green-500 text-white px-4 py-2 rounded shadow-md">
          Thêm nhân sự thành công 🎉
        </div>
      ));
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Lỗi khi thêm nhân sự:", error);
      toast.error("Lỗi khi thêm nhân sự 😢");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mb-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        Quản lý nhân sự 🧑
      </h1>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <Input
          placeholder="Tìm kiếm nhân sự..."
          className="w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* add user */}
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button>+ Thêm nhân sự</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="mb-6">Thêm nhân sự</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
                <Label className="mb-2">Họ tên</Label>
                <Input
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Chức vụ</Label>
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
                <Label className="mb-2">Giới tính</Label>
                <Input
                  value={newEmployee.gender || ""}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, gender: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Ngày sinh</Label>
                <Input
                  type="date"
                  value={newEmployee.birthDate || ""}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      birthDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Điện thoại</Label>
                <Input
                  value={newEmployee.phone || ""}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Email</Label>
                <Input
                  value={newEmployee.email || ""}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Ngày thử việc</Label>
                <Input
                  type="date"
                  value={newEmployee.probationDate || ""}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      probationDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Ngày chính thức</Label>
                <Input
                  type="date"
                  value={newEmployee.officialDate || ""}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      officialDate: e.target.value,
                    })
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
                <Input
                  value={newEmployee.insurance || ""}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      insurance: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Trạng thái</Label>
                <Input
                  value={newEmployee.status || ""}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, status: e.target.value })
                  }
                />
              </div>
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
                <th className="py-2 px-2 w-1/3">Mã</th>
                <th className="py-2 px-2 w-1/3">Họ tên</th>
                <th className="py-2 px-2 w-1/3">Chức vụ</th>
                <th className="py-2 px-2 w-1/3">Phòng ban</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <Dialog key={emp.id}>
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
                      <td className="py-2 px-2 break-words">{emp.id}</td>
                      <td className="py-2 px-2 break-words">{emp.name}</td>
                      <td className="py-2 px-2 break-words">{emp.position}</td>
                      <td className="py-2 px-2 break-words">
                        {emp.department}
                      </td>
                    </tr>
                  </DialogTrigger>

                  {/* detail user  */}
                  <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex justify-between items-start pr-10">
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
                      </div>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 mt-4">
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
                      {editMode && (
                        <Button className="mt-4" onClick={handleSaveEdit}>
                          Lưu thay đổi
                        </Button>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
