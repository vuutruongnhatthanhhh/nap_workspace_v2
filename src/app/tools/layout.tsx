import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import {
  FileArchive,
  FileText,
  ImagePlus,
  FileDiff,
  FileMinus,
  CircleHelp,
} from "lucide-react";

const toolsMenu = [
  {
    name: "Hướng dẫn sử dụng",
    icon: <CircleHelp size={20} />,
    path: "https://docs.google.com/document/d/1BBR5YJnfZ3pK3sKXJyrJQc65NU6FjmVr/edit?usp=sharing&ouid=106444794711582118732&rtpof=true&sd=true",
  },
  { name: "Nén", icon: <FileArchive size={20} />, path: "/tools" },
  {
    name: "Watermark (hình)",
    icon: <ImagePlus size={20} />,
    path: "/tools/watermarkImg",
  },
  {
    name: "Watermark (pdf)",
    icon: <FileText size={20} />,
    path: "/tools/watermarkPdf",
  },
  {
    name: "Gộp file pdf",
    icon: <FileMinus size={20} />,
    path: "/tools/mergePdf",
  },
  {
    name: "So sánh file",
    icon: <FileDiff size={20} />,
    path: "/tools/compareFile",
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
      <Menu menuItems={toolsMenu} title="Công cụ" />
      <main className="flex-1 pl-6 pt-6">{children}</main>
      <Footer />
    </div>
  );
}
