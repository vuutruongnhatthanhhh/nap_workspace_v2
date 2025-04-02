"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

type ToolMenuProps = {
  menuItems?: MenuItem[];
  title: string;
};

const defaultMenuItems: MenuItem[] = [
  {
    name: "Hướng dẫn sử dụng",
    icon: <span>📘</span>,
    path: "https://docs.google.com/document/d/174Cbg_bkDmW3XoVaVvDTCkolSV5l5U2fkopDdgqUD1M/edit?tab=t.0#heading=h.mhsrb090a00c",
  },
];

export default function ToolMenu({
  menuItems = defaultMenuItems,
  title,
}: ToolMenuProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative border-b border-transparent dark:border-white/20">
      {/* menu desktop */}
      <div className="hidden lg:flex items-center gap-6 bg-[#111827] text-white px-6 py-4">
        {menuItems.map((item, index) => {
          const isExternal = item.path.startsWith("http");

          return isExternal ? (
            <a
              key={index}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </a>
          ) : (
            <Link
              key={index}
              href={item.path}
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* menu mobile */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#111827] text-white z-30 p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">{title}</span>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          {menuItems.map((item, index) => {
            const isExternal = item.path.startsWith("http");

            return isExternal ? (
              <a
                key={index}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-2 hover:text-blue-400 transition"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ) : (
              <Link
                key={index}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-2 hover:text-blue-400 transition"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* open menu in mobile */}
      {!isSidebarOpen && (
        <div className="absolute top-2 left-2 z-40 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
