"use client";

import dayjs from "dayjs";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export default function CustomCalendar({
  value,
  onChange,
}: {
  value?: string;
  onChange: (date: string) => void;
}) {
  const [show, setShow] = useState(false);
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full">
      <input
        readOnly
        value={value ? dayjs(value).format("DD/MM/YYYY") : ""}
        onClick={() => {
          setShow(true);
          setTimeout(() => hiddenDateInputRef.current?.showPicker?.(), 0);
        }}
        placeholder="dd/mm/yyyy"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        )}
      />

      <input
        type="date"
        ref={hiddenDateInputRef}
        value={value || ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw);
          setShow(false);
        }}
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
        style={{ width: 0, height: 0 }}
      />
    </div>
  );
}
