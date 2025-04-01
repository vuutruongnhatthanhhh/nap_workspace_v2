"use client";

import { SITE_CONFIG } from "@/constants/site";
import { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-[#111827] text-center text-white text-sm  py-4 border-t border-transparent dark:border-white/20">
      {SITE_CONFIG.copyright}
    </footer>
  );
}
