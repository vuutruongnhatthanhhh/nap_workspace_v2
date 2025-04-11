import { useCallback, useEffect, useMemo, useState } from "react";

export function useListManager<T>(
  fetchData: () => Promise<T[]>,
  getSearchText: (item: T) => string
) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      getSearchText(item).toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [items, debouncedSearch]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / itemsPerPage);
  }, [filteredItems]);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredItems, currentPage]);

  const fetchItems = useCallback(async () => {
    try {
      const data = await fetchData();
      setItems(data);
    } catch (err) {
      console.error("Lỗi khi fetch:", err);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  return {
    search,
    setSearch,
    items,
    filteredItems,
    paginatedItems,
    selectedItem,
    setSelectedItem,
    editMode,
    setEditMode,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchItems,
  };
}
