"use client";

interface ToastCustomProps {
  message: string;
  bg: string;
}

export default function ToastCustom({ message, bg }: ToastCustomProps) {
  return (
    <div className={`text-white px-4 py-2 rounded shadow-md ${bg}`}>
      {message}
    </div>
  );
}
