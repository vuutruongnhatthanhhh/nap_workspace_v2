"use client";

import BarChart from "@/components/BarChart";
import PieChart from "@/components/PieChart";

const barChartData = [
  { name: "Nhân sự", value: 12 },
  { name: "Kinh doanh", value: 15 },
  { name: "IT", value: 3 },
  { name: "Cơ khí", value: 10 },
];

const pieChartData = [
  { name: "Nam", value: 40 },
  { name: "Nữ", value: 30 },
];

const pieChartData2 = [
  { name: "Chính thức", value: 40 },
  { name: "Thử việc", value: 3 },
  { name: "Thực tập", value: 1 },
];

export default function DashboardUser() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-10">
        Tổng quan nhân sự 📈
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center place-items-center">
        <BarChart title="Nhân viên theo phòng ban" data={barChartData} />

        <PieChart title="Loại hợp đồng" data={pieChartData2} />
        <PieChart title="Tỷ lệ giới tính" data={pieChartData} />
      </div>
    </div>
  );
}
