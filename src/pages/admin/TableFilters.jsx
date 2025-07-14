import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./DateRangePicker";
import {
  FileText,
  FileSpreadsheet,
  Search,
  Filter,
  RotateCcw,
  Download,
} from "lucide-react";

const TableFilters = ({
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
  handleLoad,
  handleReset,
  handleDownloadPDF,
  handleDownloadExcel,
  columnOptions,
  statusOptions,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
      {/* Main Layout - Better Responsive Structure */}
      <div className="flex flex-col gap-3">
        {/* Top Row - Entries and Export Actions (Mobile) */}
        <div className="flex  flex-row items-center justify-between gap-2 lg:hidden">
          {/* Show entries */}
          <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
            <span>Show</span>
            <Select
              value={entries.toString()}
              onValueChange={(val) => setEntries(Number(val))}
            >
              <SelectTrigger className="w-16 h-8 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50, 100].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>entries</span>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadPDF}
              className="p-1.5 h-8 w-8 text-red-600 hover:bg-red-50"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadExcel}
              className="p-1.5 h-8 w-8 text-green-600 hover:bg-green-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Single Row Layout */}
        <div className="hidden lg:flex lg:items-center gap-3">
          {/* Left Section - Entries */}
          <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
            <span>Show</span>
            <Select
              value={entries.toString()}
              onValueChange={(val) => setEntries(Number(val))}
            >
              <SelectTrigger className="w-16 h-8 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50, 100].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>entries</span>
          </div>

          {/* Middle Section - Filters */}
          <div className="flex items-center gap-2 flex-1 min-w-[150px]">
            {/* Date Range */}
            <div className="flex-shrink-0">
              <DateRangePicker
                initialDateFrom={dateRange.from}
                initialDateTo={dateRange.to}
                onUpdate={({ range }) => {
                  setDateRange({
                    from: range?.from || null,
                    to: range?.to || null,
                  });
                }}
                align="start"
                locale="en-GB"
                showCompare={false}
              />
            </div>

            {/* Status Filter */}
            <div className="flex-shrink-0">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-32 h-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <div className="flex items-center gap-1.5">
                    <Filter className="h-3 w-3 text-gray-400" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Section */}
            <div className="flex gap-2 flex-1 min-w-0">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  className="pl-8 h-8  border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                  placeholder={`Search ${
                    columnOptions.find((c) => c.value === searchColumn)
                      ?.label || "..."
                  }`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={searchColumn} onValueChange={setSearchColumn}>
                <SelectTrigger className="w-40 h-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <SelectValue placeholder="In" />
                </SelectTrigger>
                <SelectContent>
                  {columnOptions.map((col) => (
                    <SelectItem key={col.value} value={col.value}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleLoad}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm font-medium h-8"
            >
              <Download className="h-3 w-3 mr-1" />
              Load
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-50 px-3 py-1.5 text-sm h-8"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
            <div className="flex items-center gap-1 ml-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadPDF}
                className="p-1.5 h-8 w-8 text-red-600 hover:bg-red-50"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadExcel}
                className="p-1.5 h-8 w-8 text-green-600 hover:bg-green-50"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Filters */}
        <div className="lg:hidden space-y-2">
          {/* Date Range */}
          <div className="w-full">
            <DateRangePicker
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              onUpdate={({ range }) => {
                setDateRange({
                  from: range?.from || null,
                  to: range?.to || null,
                });
              }}
              align="start"
              locale="en-GB"
              showCompare={false}
            />
          </div>

          {/* Status and Search Row */}
          <div className="flex gap-2">
            <div className="w-1/3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full h-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <div className="flex items-center gap-1.5">
                    <Filter className="h-3 w-3 text-gray-400" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  className="pl-8 h-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                  placeholder={`Search ${
                    columnOptions.find((c) => c.value === searchColumn)
                      ?.label || "..."
                  }`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={searchColumn} onValueChange={setSearchColumn}>
                <SelectTrigger className="w-20 h-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <SelectValue placeholder="In" />
                </SelectTrigger>
                <SelectContent>
                  {columnOptions.map((col) => (
                    <SelectItem key={col.value} value={col.value}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleLoad}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm font-medium h-8 flex-1"
            >
              <Download className="h-3 w-3 mr-1" />
              Load
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-50 px-3 py-1.5 text-sm h-8 flex-1"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableFilters;
