"use client";

import { Position } from "@/services/positionService";

interface PositionTableProps {
  positions: Position[];
  onSelectPosition: (position: Position) => void;
}

export default function PositionTable({
  positions,
  onSelectPosition,
}: PositionTableProps) {
  return (
    <table className="w-full table-fixed text-sm min-w-[500px]">
      <thead>
        <tr className="text-left border-b border-gray-200 dark:border-white/10">
          <th className="py-2 px-2 w-1/3">Chức vụ</th>
          <th className="py-2 px-2 w-1/3">Mô tả</th>
        </tr>
      </thead>
      <tbody>
        {positions.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="text-center text-muted-foreground py-6 italic"
            >
              Không tìm thấy chức vụ
            </td>
          </tr>
        ) : (
          positions.map((po) => (
            <tr
              key={po._id}
              onClick={() => onSelectPosition(po)}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              <td className="py-2 px-2 break-words">{po.name}</td>
              <td className="py-2 px-2 break-words">{po.description}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
