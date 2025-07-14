import CopyButton from "@/components/CopyButton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableFilter } from "@/hooks/AdminTableFilterHook";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Copy, CreditCard, Hash, MapPin, MessageSquare } from "lucide-react";
import React from "react";
import * as XLSX from "xlsx";
import Pagination from "./Pagination";
import TableFilterBar from "./TableFilters";
import WithdrawLogo from "/asset/Group 48095823.png";

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
  const {
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
  } = useTableFilter({ data, initialColumn: "userName" });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [entries, search, searchColumn]);

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
      {/*  */}
      <TableFilterBar
        entries={entries}
        setEntries={setEntries}
        search={search}
        setSearch={setSearch}
        searchColumn={searchColumn}
        setSearchColumn={setSearchColumn}
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleLoad={() => window.location.reload()}
        handleReset={handleReset}
        handleDownloadPDF={handleDownloadPDF}
        handleDownloadExcel={handleDownloadExcel}
        columnOptions={COLUMN_OPTIONS}
        statusOptions={STATUS_OPTIONS}
      />

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />
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
