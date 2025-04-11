"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PositionAdd from "@/components/position/PositionAdd";
import PositionDetailUpdate from "@/components/position/PositionDetailUpdate";
import PositionTable from "@/components/position/PositionTable";
import PaginationCustom from "@/components/PaginationCustom";
import { fetchPositionsAPI, Position } from "@/services/positionService";
import { useListManager } from "@/hooks/useListManager";
export default function PositionManagement() {
  const {
    search,
    setSearch,
    selectedItem: selectedPosition,
    setSelectedItem: setSelectedPosition,
    editMode,
    setEditMode,
    paginatedItems: paginatedPositions,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchItems: fetchPositions,
  } = useListManager<Position>(fetchPositionsAPI, (po) => po.name);

  return (
    <div className="max-w-5xl mx-auto mb-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        Chức vụ 💼
      </h1>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <Input
          placeholder="Tìm kiếm theo chức vụ..."
          className="w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* add Position */}
        <PositionAdd onPositionAdded={fetchPositions} />
      </div>

      <Card>
        <CardContent className="overflow-x-auto">
          {/* list Position */}
          <PositionTable
            positions={paginatedPositions}
            onSelectPosition={(po) => {
              setSelectedPosition(po);
              setEditMode(false);
            }}
          />

          {/* detail, update Position */}
          {selectedPosition && (
            <PositionDetailUpdate
              position={selectedPosition}
              onClose={() => setSelectedPosition(null)}
              onPositionUpdated={fetchPositions}
            />
          )}
          {/* pagination */}
          {totalPages > 1 && (
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
