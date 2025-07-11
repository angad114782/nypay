import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Camera,
  Copy,
  CreditCard,
  Hash,
  IndianRupee,
  MapPin,
  MessageSquare,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WithdrawLogo from "/asset/Group 48095823.png";
import { Input } from "@/components/ui/input";
import ScreenshotProof from "./ScreenshotProof";
import PDFLogo from "/asset/icons8-pdf-48.png";
import ExcelLogo from "/asset/icons8-excel.svg";
import logo from "/asset/gpay.png";
import { DateRangePicker } from "./DateRangePicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/CopyButton";

// import { DatePicker } from "@/components/ui/datepicker"; // If you have a shadcn/ui DatePicker

const COLUMN_OPTIONS = [
  { label: "Profile Name", value: "profileName" },
  { label: "User Name", value: "userName" },
  { label: "Amount", value: "amount" },
  { label: "Payment Type", value: "paymentType" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Rejected", value: "Rejected" },
];

const WithdrawTable = ({ data }) => {
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState("profileName");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Enhanced filter logic
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

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entries);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  // Handle page change
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Reset to first page when entries/search/searchColumn changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [entries, search, searchColumn]);

  // Load handler (example: reload data or refetch)
  const handleLoad = () => {
    window.location.reload(); // or trigger your data fetch logic
  };

  // Reset handler
  const handleReset = () => {
    setSearch("");
    setSearchColumn("profileName");
    setStatus("all");
    setDateRange({ from: null, to: null });
    setEntries(10);
  };

  // PDF Download handler
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "S.No",
          "Profile Name",
          "User Name",
          "Amount",
          "Payment Type",
          "Details",
          "Entry Date",
          "Status",
          "Remark",
          "Withdraw Date",
          "Parent IP",
        ],
      ],
      body: filteredData.map((item, idx) => [
        idx + 1,
        item.profileName,
        item.userName,
        item.amount,
        item.paymentType,
        `Name: ${item.details.name}, Account: ${item.details.accountNumber}, IFSC: ${item.details.IFSCCode}, Bank: ${item.details.bankName}`,
        item.entryDate,
        item.status,
        item.remark,
        item.withdrawDate,
        item.parentIp,
      ]),
    });
    doc.save("table.pdf");
  };

  // Excel Download handler
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item, idx) => ({
        "S.No": idx + 1,
        "Profile Name": item.profileName,
        "User Name": item.userName,
        Amount: item.amount,
        "Payment Type": item.paymentType,
        Details: `Name: ${item.details.name}, Account: ${item.details.accountNumber}, IFSC: ${item.details.IFSCCode}, Bank: ${item.details.bankName}`,
        "Entry Date": item.entryDate,
        Status: item.status,
        Remark: item.remark,
        "Withdraw Date": item.withdrawDate,
        "Parent IP": item.parentIp,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "table.xlsx");
  };

  return (
    <>
      <div className="flex flex-col  gap-2 md:flex-row md:items-center md:justify-between mb-4">
        {/* Show entries dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-gray-700">Show</span>
          <Select
            value={entries.toString()}
            onValueChange={(val) => setEntries(Number(val))}
          >
            <SelectTrigger className="min-w-[80px]">
              <SelectValue placeholder="Entries" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50, 100].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
        {/* Filter controls and action buttons */}
        <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-4 md:flex-1 md:ml-6">
          {/* Filter fields */}
          <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-4 md:flex-1">
            {/* Search input */}
            <div className="w-full md:w-auto">
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
            {/* Column select */}

            {/* Status select */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="min-w-[150px] border-1 border-black rounded-full dark:bg-orange-400 bg-orange-400 text-white  w-full md:w-auto">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* DateRangePicker */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                type="text"
                className="border-1 border-black rounded-full  px-2 py-1 text-sm w-[550px] md:w-auto"
                placeholder={`Search ${
                  COLUMN_OPTIONS.find((c) => c.value === searchColumn)?.label ||
                  ""
                }`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={searchColumn} onValueChange={setSearchColumn}>
                <SelectTrigger className="min-w-[100px] border-1 bg-orange-400  dark:bg-orange-400 border-black text-white rounded-full  w-full md:w-auto">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {COLUMN_OPTIONS.map((col) => (
                    <SelectItem key={col.value} value={col.value}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-2 md:mt-0 flex-shrink-0">
            <Button
              className="px-3  text-white rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-100"
              onClick={handleLoad}
            >
              Load
            </Button>
            <Button
              className="px-3   text-white rounded-lg text-sm font-medium bg-red-600 hover:bg-red-100"
              onClick={handleReset}
            >
              Reset
            </Button>

            <img
              src={PDFLogo}
              alt=""
              className="h-10 cursor-pointer"
              onClick={handleDownloadPDF}
            />
            <img
              src={ExcelLogo}
              alt=""
              className="h-10 cursor-pointer"
              onClick={handleDownloadExcel}
            />
          </div>
        </div>
      </div>

      <Table className="hidden lg:table w-full">
        <TableCaption>A list of your request list.</TableCaption>
        <TableHeader className="bg-[#8AAA08]">
          <TableRow>
            <TableHead className="w-[100px] rounded-tl-lg">S.No</TableHead>
            <TableHead>Profile Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Entry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead>Withdraw Date</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-right rounded-tr-lg">
              Parent IP
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => (
            <TableRow key={item.id}>
              {/* S.No with copy all */}
              <TableCell className="w-[100px]">
                <div className="flex items-center gap-1">
                  {(currentPage - 1) * entries + index + 1}
                  <CopyButton
                    textToCopy={`Username - ${item.userName}\nAmount - ${item.amount}\nDetails - Name: ${item.details.name}, Account: ${item.details.accountNumber}, IFSC: ${item.details.IFSCCode}, Bank: ${item.details.bankName}`}
                    title="Copy User Name, Amount, Details"
                  />
                </div>
              </TableCell>
              <TableCell>{item.profileName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.userName}
                  <CopyButton
                    textToCopy={item.userName}
                    title="Copy username"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.amount}
                  <CopyButton
                    textToCopy={item.amount}
                    title="Copy amount Number"
                  />
                </div>
              </TableCell>
              <TableCell>{item.paymentType}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-1">
                    {item.details.name}
                    <CopyButton
                      textToCopy={item.details.name}
                      title="Copy name"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {item.details.accountNumber}
                    <CopyButton
                      textToCopy={item.details.accountNumber}
                      title="Copy Account Number"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {item.details.IFSCCode}
                    <CopyButton
                      textToCopy={item.details.IFSCCode}
                      title="Copy IFSC Code"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {item.details.bankName}
                    <CopyButton
                      textToCopy={item.details.bankName}
                      title="Copy Bank Name"
                    />
                  </div>
                  <div className="justify-center items-center flex bg-gray-200 rounded-sm ">
                    <CopyButton
                      textToCopy={`Name: ${item.details.name}\nAccount: ${item.details.accountNumber}\nIFSC: ${item.details.IFSCCode}\nBank: ${item.details.bankName}`}
                      title="Copy Bank All Details"
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.entryDate}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.remark}</TableCell>
              <TableCell>
                {item.withdrawDate || "N/A"}
                {/* <ScreenshotProof url={logo} utr={item.utr} /> */}
              </TableCell>
              <TableCell className="text-center align-middle">
                <div className="flex gap-1 items-center justify-center">
                  <button className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition">
                    Approve
                  </button>
                  <button className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition">
                    Reject
                  </button>
                  <button className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold hover:bg-yellow-200 transition">
                    Remark
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-right">{item.parentIp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="lg:hidden block">
        {paginatedData.map((item) => (
          <TransactionCard key={item.id} transaction={item} />
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * entries + 1} to{" "}
          {Math.min(currentPage * entries, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border text-sm disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-2 py-1 rounded border text-sm ${
                currentPage === i + 1
                  ? "bg-[#8AAA08] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default WithdrawTable;

export const TransactionCard = ({ transaction }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-[#ffb3b3] rounded-2xl shadow-md border border-gray-200 mb-4 overflow-hidden">
      {/* Header */}
      <div className="flex bg-[#8AAA08] items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center dark:text-white text-white font-semibold">
            {/* {transaction.userName?.charAt(0)} */}
            <img src={WithdrawLogo} alt="" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-sm dark:text-white text-white font-bold">
                {transaction.profileName}
              </h3>
              <CopyButton
                textToCopy={transaction.profileName}
                title="Copy profile name"
              />
            </div>
            <p className="text-sm dark:text-white text-white">
              {transaction.userName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              transaction.status
            )}`}
          >
            {transaction.status}
          </div>
          <div className="text-sm text-white">{transaction.entryDate}</div>
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-center p-2 gap-2">
        {/* <IndianRupee className="w-4 h-4" /> */}
        <span className="text-sm">Amount</span>
        <span className="ml-auto text-sm font-bold ">{transaction.amount}</span>
        <CopyButton
          textToCopy={transaction.amount}
          title="Copy Account Number"
        />
      </div>

      {/* Payment Type */}
      <div className="flex items-center p-2 gap-2">
        <CreditCard className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Payment Type</span>
        <span className="ml-auto text-sm text-black">
          {transaction.paymentType}
        </span>
      </div>

      {/* Bank Details */}
      <div className=" flex justify-between  m-2  ">
        <div className="flex items-start gap-2 mb-1">
          <Hash className="w-4 h-4 text-black" />
          <span className="text-sm  text-black">Bank Details</span>
        </div>
        <div className="space-y-1  ">
          <div className="flex items-center ">
            {/* <span className="text-sm text-gray-600">Name:</span> */}
            <span className="text-sm text-black text-right ml-auto">
              {transaction.details.name}
            </span>
            <CopyButton
              textToCopy={transaction.details.name}
              title="Copy Account Holder name"
            />
          </div>
          <div className="flex items-center gap-1">
            {/* <span className="text-sm text-gray-600">Account:</span> */}
            <span className="text-sm text-black ml-auto">
              {transaction.details.accountNumber}
            </span>
            <CopyButton
              textToCopy={transaction.details.accountNumber}
              title="Copy Account Number"
            />
          </div>
          <div className="flex items-center gap-1">
            {/* <span className="text-sm text-gray-600">IFSC:</span> */}
            <span className="text-sm text-black ml-auto">
              {transaction.details.IFSCCode}
            </span>
            <CopyButton
              textToCopy={transaction.details.IFSCCode}
              title="Copy IFSC Code"
            />
          </div>
          <div className="flex items-center gap-1">
            {/* <span className="text-sm text-gray-600">Bank:</span> */}
            <span className="text-sm text-black ml-auto">
              {transaction.details.bankName}
            </span>
            <CopyButton
              textToCopy={transaction.details.bankName}
              title="Copy Bank Name"
            />
          </div>
        </div>
      </div>

      {/* Parent IP */}
      <div className="flex items-center p-2 gap-2">
        <MapPin className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Parent IP</span>
        <span className="ml-auto text-sm ">{transaction.parentIp}</span>
      </div>

      {/* Withdraw Date */}
      <div className="flex items-center p-2 gap-2">
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm text-black">Withdraw Date</span>
        <span className="ml-auto text-sm ">{transaction.withdrawDate}</span>
      </div>

      {/* Status and Remarks */}
      <div className="flex p-2 gap-2 ">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm text-black">Remark :</span>
        </div>

        <span className="text-sm ">{transaction.remark}</span>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center gap-2 p-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {/* Placeholder for Screenshot/UTR actions */}
          <Copy className="h-6 w-6" />
        </div>
        <div className="flex gap-2">
          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs">
            Approve
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs">
            Reject
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs">
            Remark
          </button>
        </div>
      </div>
    </div>
  );
};
