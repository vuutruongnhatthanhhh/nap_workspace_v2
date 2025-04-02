"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";

type BarChartProps = {
  title: string;
  data: { name: string; value: number }[];
};

export default function BarChart({ title, data }: BarChartProps) {
  const { theme } = useTheme();
  const axisColor = theme === "dark" ? "#fff" : "#555";

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card className="w-full max-w-2xl mb-4">
      <CardContent className="">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-300 mb-10">
          Tổng: {data.reduce((acc, item) => acc + item.value, 0)}
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ReBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            {isDesktop && <XAxis dataKey="name" stroke={axisColor} />}
            {isDesktop && <YAxis stroke={axisColor} />}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { name, value } = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-[#1f2937] p-2 rounded shadow text-sm text-black dark:text-white">
                      <p className="font-semibold">{name}</p>
                      <p>Số lượng: {value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="value"
                position="insideTop"
                fill="#fff"
                fontSize={15}
              />
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
