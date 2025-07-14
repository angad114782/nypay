import { useState, useEffect } from "react";

export const useTableFilter = ({ data, initialColumn = "profileName" }) => {
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState(initialColumn);
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [entries, search, searchColumn]);

  const filteredData = data.filter((item) => {
    const matchesColumn = item[searchColumn]
      ?.toString()
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status === "all" ? true : item.status === status;
    const from = dateRange.from ? new Date(dateRange.from) : null;
    const to = dateRange.to ? new Date(dateRange.to) : null;
    const matchesDate =
      (!from || new Date(item.entryDate) >= from) &&
      (!to || new Date(item.entryDate) <= to);
    return matchesColumn && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / entries);
  const paginatedData = filteredData.slice(
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
  };

  return {
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
    currentPage,
    setCurrentPage,
    goToPage,
    handleReset,
    paginatedData,
    filteredData,
    totalPages,
  };
};
