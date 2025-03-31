"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/constants/site";
import Header from "@/components/layout/Header";

const categories = [
  "Tất cả",
  "Quản trị nguồn nhân lực",
  "Marketing - Bán hàng",
  "Tiện ích",
];

const apps = [
  {
    name: "Nhân sự",
    icon: "/apps/user-icon.webp",
    category: "Quản trị nguồn nhân lực",
  },
  {
    name: "Công cụ",
    icon: "/apps/tool-icon.png",
    category: "Tiện ích",
  },
  {
    name: "Giao hàng",
    icon: "/apps/truck-icon.webp",
    category: "Marketing - Bán hàng",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredApps = apps.filter((app) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || app.category === selectedCategory;
    const matchesSearch = app.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main
      className="min-h-screen flex flex-col bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/bg-home.jpg')" }}
    >
      {/* Header */}
      <Header
        search={search}
        onSearchChange={setSearch}
        showThemeToggle={false}
      />
      {/* Filter Tabs */}
      <div className="hidden sm:flex flex-wrap gap-2 justify-center mb-10 px-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full border border-white/30 backdrop-blur-sm text-sm transition-all
          ${
            isSelected
              ? "bg-white text-black font-semibold"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* App Grid */}
      <div className="flex-1 px-6 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-center space-y-1 hover:scale-105 transition-transform duration-200 hover:bg-white/10 rounded-xl p-2 cursor-pointer"
              >
                <div className="w-20 h-20 relative mb-2">
                  <Image
                    src={app.icon}
                    alt={app.name}
                    fill
                    className="object-contain rounded-2xl"
                  />
                </div>
                <div className="text-sm font-medium leading-tight px-1 text-white">
                  {app.name}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-white/70 italic">
              Không có ứng dụng nào phù hợp 😢
            </div>
          )}
        </div>
      </div>

      <footer className="text-center text-sm py-4 opacity-70">
        {SITE_CONFIG.copyright}
      </footer>
    </main>
  );
}
