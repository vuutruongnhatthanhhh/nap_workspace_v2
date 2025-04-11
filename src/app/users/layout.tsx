import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import {
  CircleHelp,
  LayoutDashboard,
  User,
  Badge,
  Building,
} from "lucide-react";

const userMenu = [
  {
    name: "Hướng dẫn sử dụng",
    icon: <CircleHelp size={20} />,
    path: "https://docs.google.com/document/d/1pTr4hdQMyu0bGy5VSUcMEaNZBfdCbI8jRLz7uGo7_GM/edit?usp=sharing",
  },
  { name: "Tổng quan", icon: <LayoutDashboard size={20} />, path: "/users" },
  {
    name: "Quản lý nhân sự",
    icon: <User size={20} />,
    path: "/users/manage",
  },
  {
    name: "Chức vụ",
    icon: <Badge size={20} />,
    path: "/users/position",
  },
  {
    name: "Phòng ban",
    icon: <Building size={20} />,
    path: "/users/department",
  },
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#111827]">
      <Header search="" showSearch={false} bgColor="bg-[#111827]" />
      <Menu title="Nhân sự" menuItems={userMenu} />
      <main className="flex-1 pl-0 md:pl-16 pt-6">{children}</main>
      <Footer />
    </div>
  );
}
