"use client";

import Header from "@/components/layout/Header";

export default function SimplePage() {
  return (
    <>
      <Header
        search=""
        onSearchChange={() => {}}
        showSearch={false}
        bgColor="bg-[#111827] dark:border-white border-b border-transparent"
      />
      <section className="flex items-center justify-center h-full text-center p-6 ">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Chào mừng quay lại 👋✨
        </h1>
      </section>
    </>
  );
}
