"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import EmployeeAdd from "@/components/employee/EmployeeAdd";
import EmployeeDetailUpdate from "@/components/employee/EmployeeDetailUpdate";
import EmployeeTable from "@/components/employee/EmployeeTable";
import PaginationCustom from "@/components/PaginationCustom";
import { fetchEmployeesAPI, Employee } from "@/services/employeeService";
import { useListManager } from "@/hooks/useListManager";

export default function EmployeeManagement() {
  const {
    search,
    setSearch,
    selectedItem: selectedEmployee,
    setSelectedItem: setSelectedEmployee,
    editMode,
    setEditMode,
    paginatedItems: paginatedEmployees,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchItems: fetchEmployees,
  } = useListManager<Employee>(fetchEmployeesAPI, (emp) => emp.name);

  const [tempAvatarFile, setTempAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

        {/* add Employee */}
        <EmployeeAdd onEmployeeAdded={fetchEmployees} />
      </div>

      <Card>
        <CardContent className="overflow-x-auto">
          {/* list Employee */}
          <EmployeeTable
            employees={paginatedEmployees}
            onSelectEmployee={(emp) => {
              setSelectedEmployee(emp);
              setEditMode(false);
              setTempAvatarFile(null);
              setPreviewUrl(null);
            }}
          />

          {/* detail, update Employee */}
          {selectedEmployee && (
            <EmployeeDetailUpdate
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
              onEmployeeUpdated={fetchEmployees}
            />
          )}
          {/* pagination */}
          {totalPages > 1 && (
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
