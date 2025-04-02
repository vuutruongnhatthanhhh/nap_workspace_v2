import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1"];

type PieChartProps = {
  title: string;
  data: { name: string; value: number }[];
};

export default function PieChart({ title, data }: PieChartProps) {
  return (
    <Card className="w-full max-w-2xl mb-4">
      <CardContent>
        <h2 className="text-lg font-semibold  text-gray-800 dark:text-white">
          {title}
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-300 mb-10">
          Tổng: {data.reduce((acc, item) => acc + item.value, 0)}
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <RePieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
