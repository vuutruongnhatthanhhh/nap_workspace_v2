"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SITE_CONFIG } from "@/constants/site";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

type HeaderProps = {
  search: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  bgColor?: string;
  showThemeToggle?: boolean;
};

export default function Header({
  search,
  onSearchChange,
  showSearch = true,
  bgColor = "bg-transparent",
  showThemeToggle = true,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);
  return (
    <div
      className={`p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        <Image src="/nap-logo.png" alt="Logo" width={50} height={50} />
        <h1 className="text-xl font-light italic tracking-widest drop-shadow-sm font-serif text-white">
          {SITE_CONFIG.companyName}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <Input
            type="text"
            placeholder="Tìm kiếm ứng dụng..."
            className="w-[300px] sm:w-[360px] !bg-white/90 text-black placeholder:text-gray-500"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        )}
        {showThemeToggle && isMounted && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80">☀️</span>
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => {
                setIsDark(checked);
                setTheme(checked ? "dark" : "light");
              }}
            />
            <span className="text-xs text-white/80">🌙</span>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-10 h-10 relative rounded-xl overflow-hidden border-2 border-white/80 shadow-md cursor-pointer">
              <Image
                src="/avatar-user.jpg"
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white text-black shadow-lg"
          >
            <DropdownMenuLabel>Vưu Trường Nhật Thanh</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Thông tin cá nhân")}>
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Đăng xuất")}>
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
