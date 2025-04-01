import Header from "@/components/layout/Header";
import ToolMenu from "@/components/layout/ToolMenu";
import Footer from "@/components/layout/Footer";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#111827]">
      <Header search="" showSearch={false} bgColor="bg-[#111827]" />
      <ToolMenu />
      <main className="flex-1 pl-12 pt-6">{children}</main>
      <Footer />
    </div>
  );
}
