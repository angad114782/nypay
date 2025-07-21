import { useState, useEffect } from "react";

export const useTableFilter = ({ data, initialColumn = "profileName" }) => {
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState(initialColumn);
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);

  // Internal data state - this is the single source of truth
  const [internalData, setInternalData] = useState(data || []);

  // Update internal data when external data changes
  useEffect(() => {
    setInternalData(data || []);
  }, [data]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [entries, search, searchColumn, status, dateRange]);

  const filteredData = internalData?.filter((item) => {
    const matchesColumn = item[searchColumn]
      ?.toString()
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = status === "all" ? true : item.status === status;

    const from = dateRange.from ? new Date(dateRange.from) : null;
    const to = dateRange.to ? new Date(dateRange.to) : null;
    const matchesDate =
      (!from || new Date(item.createdAt || item.entryDate) >= from) &&
      (!to || new Date(item.createdAt || item.entryDate) <= to);

    return matchesColumn && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil((filteredData?.length || 0) / entries);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleReset = () => {
    setSearch("");
    setSearchColumn(initialColumn);
    setStatus("all");
    setDateRange({ from: null, to: null });
    setEntries(10);
    setCurrentPage(1);
  };

  // Data manipulation methods
  const updateItem = (id, updates) => {
    setInternalData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id) => {
    setInternalData((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = (newItem) => {
    setInternalData((prev) => [...prev, newItem]);
  };

  const refreshData = (newData) => {
    setInternalData(newData || []);
  };

  return {
    // Filter states
    entries,
    setEntries,
    search,
    setSearch,
    searchColumn,
    setSearchColumn,
    status,
    setStatus,
    dateRange,
    setDateRange,

    // Pagination states
    currentPage,
    setCurrentPage,
    goToPage,
    totalPages,

    // Data states
    allData: internalData,
    filteredData,
    paginatedData,

    // Utility functions
    handleReset,
    updateItem,
    removeItem,
    addItem,
    refreshData,
  };
};
