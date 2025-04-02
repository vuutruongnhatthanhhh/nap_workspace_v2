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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

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

export default function EmployeeManagement() {
  const [search, setSearch] = useState("");
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
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    avatar: "/avatar-user.jpg",
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

  const handleAddEmployee = () => {
    const newEmp: Employee = {
      id: `IT${Math.floor(Math.random() * 100000)}`,
      gender: "Chưa cập nhật",
      birthDate: "",
      phone: "",
      email: "",
      probationDate: "",
      officialDate: "",
      contractType: "",
      seniority: "",
      insurance: "",
      status: "",
      ...newEmployee,
    };
    setEmployees((prev) => [...prev, newEmp]);
    setNewEmployee({
      name: "",
      position: "",
      department: "",
      avatar: "/avatar-user.jpg",
    });
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

        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Thêm nhân sự</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm nhân sự mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Họ tên</Label>
                <Input
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Chức vụ</Label>
                <Input
                  value={newEmployee.position}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, position: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Phòng ban</Label>
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
              <Button onClick={handleAddEmployee}>Lưu</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                  <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex justify-between items-start gap-4">
                        <DialogTitle>Thông tin nhân sự</DialogTitle>
                        <div className="flex gap-2">
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
                        width={120}
                        height={120}
                        className="border object-cover rounded-md"
                      />
                      <div className="grid grid-cols-1 gap-2 w-full text-sm break-words whitespace-normal">
                        {Object.entries(selectedEmployee || {}).map(
                          ([key, value]) => (
                            <p key={key} className="break-words">
                              <strong>
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (s) => s.toUpperCase())}
                                :
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
