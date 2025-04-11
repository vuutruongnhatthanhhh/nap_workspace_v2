export interface Position {
  _id?: string;
  name: string;
  description?: string;
}

export async function fetchPositionsAPI(): Promise<Position[]> {
  try {
    const res = await fetch("/api/position");
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    return data;
  } catch (error) {
    console.error("Lỗi gọi API:", error);
    throw error;
  }
}

export async function addPositionAPI(newPosition: Position): Promise<Position> {
  try {
    const res = await fetch("/api/position", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPosition),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API Error: ${res.status} - ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi thêm chức vụ:", error);
    throw error;
  }
}

export async function updatePositionAPI(position: Position): Promise<Position> {
  try {
    const res = await fetch(`/api/position/${position._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...position }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API Error: ${res.status} - ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật chức vụ:", error);
    throw error;
  }
}

export async function deletePositionAPI(positionId: string): Promise<void> {
  try {
    const res = await fetch(`/api/position/${positionId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API Error: ${res.status} - ${text}`);
    }
  } catch (error) {
    console.error("Lỗi khi xóa chức vụ:", error);
    throw error;
  }
}
