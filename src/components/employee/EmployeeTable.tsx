"use client";

import Image from "next/image";
import { Employee } from "@/services/employeeService";

interface EmployeeTableProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  onSelectEmployee,
}: EmployeeTableProps) {
  return (
    <table className="w-full table-fixed text-sm min-w-[500px]">
      <thead>
        <tr className="text-left border-b border-gray-200 dark:border-white/10">
          <th className="py-2 px-2 w-[80px]"></th>
          <th className="py-2 px-2 w-1/3">Họ tên</th>
          <th className="py-2 px-2 w-1/3">Chức vụ</th>
          <th className="py-2 px-2 w-1/3">Phòng ban</th>
        </tr>
      </thead>
      <tbody>
        {employees.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="text-center text-muted-foreground py-6 italic"
            >
              Không tìm thấy nhân sự
            </td>
          </tr>
        ) : (
          employees.map((emp) => (
            <tr
              key={emp._id}
              onClick={() => onSelectEmployee(emp)}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              <td className="py-2 px-2">
                <Image
                  src={emp.avatar}
                  alt={emp.name}
                  width={50}
                  height={50}
                  className="w-[45px] h-[45px] object-cover rounded-md border"
                />
              </td>
              <td className="py-2 px-2 break-words">{emp.name}</td>
              <td className="py-2 px-2 break-words">{emp.position}</td>
              <td className="py-2 px-2 break-words">{emp.department}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
