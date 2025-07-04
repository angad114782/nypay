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
import logo1 from "/asset/Arrow 1.png";
import {
  Camera,
  Copy,
  CreditCard,
  Hash,
  IndianRupee,
  KeyRound,
  MapPin,
  MessageSquare,
  ShieldPlus,
  SquarePen,
  Trash2Icon,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { FaCentercode } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import latestLogo from "/asset/Group.png";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeamManagementDialog } from "./TeamManagementDialog";
import CopyButton from "@/components/CopyButton";
// import { DatePicker } from "@/components/ui/datepicker"; // If you have a shadcn/ui DatePicker

// const COLUMN_OPTIONS = [
//   { label: "Profile Name", value: "profileName" },
//   { label: "User Name", value: "userName" },
//   { label: "Amount", value: "amount" },
//   { label: "UTR", value: "utr" },
// ];

// const STATUS_OPTIONS = [
//   { label: "All", value: "all" },
//   { label: "Completed", value: "Completed" },
//   { label: "Pending", value: "Pending" },
//   { label: "Failed", value: "Failed" },
//   { label: "Rejected", value: "Rejected" },
// ];
const data = [
  {
    id: 1,
    profileName: "Profile A",
    userName: "User A",
    amount: "100.00",
    paymentType: "Credit Card",
    utr: "UTR123456",
    entryDate: "2023-10-01",
    status: "Completed",
    remark: "Payment received",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 2,
    profileName: "Profile B",

    userName: "User B",
    amount: "200.00",
    paymentType: "Bank Transfer",
    utr: "UTR654321",
    entryDate: "2023-10-02",
    status: "Pending",
    remark: "Awaiting confirmation",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 3,
    profileName: "Profile C",
    userName: "User C",

    amount: "300.00",
    paymentType: "PayPal",
    utr: "UTR789012",
    entryDate: "2023-10-03",
    status: "Failed",
    remark: "Payment failed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 4,
    profileName: "Profile D",
    userName: "User D",
    amount: "400.00",
    paymentType: "Debit Card",
    utr: "UTR345678",
    entryDate: "2023-10-04",
    status: "Completed",
    remark: "Payment successful",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 5,
    profileName: "Profile E",
    userName: "User E",
    amount: "500.00",
    paymentType: "Cash",
    utr: "UTR901234",
    entryDate: "2023-10-05",
    status: "Pending",
    remark: "Payment in process",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 6,
    profileName: "Profile F",
    userName: "User F",
    amount: "600.00",
    paymentType: "Cheque",
    utr: "UTR567890",
    entryDate: "2023-10-06",
    status: "Completed",
    remark: "Cheque cleared",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 7,
    profileName: "Profile G",
    userName: "User G",
    amount: "700.00",
    paymentType: "Wire Transfer",
    utr: "UTR234567",
    entryDate: "2023-10-07",
    status: "Failed",
    remark: "Wire transfer failed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 8,
    profileName: "Profile H",
    userName: "User H",
    amount: "800.00",
    paymentType: "Cryptocurrency",
    utr: "UTR890123",
    entryDate: "2023-10-08",
    status: "Completed",
    remark: "Crypto payment received",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 9,
    profileName: "Profile I",
    userName: "User I",
    amount: "900.00",
    paymentType: "Mobile Payment",
    utr: "UTR345678",
    entryDate: "2023-10-09",
    status: "Pending",
    remark: "Mobile payment in process",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 10,
    profileName: "Profile J",
    userName: "User J",
    amount: "1000.00",
    paymentType: "Gift Card",
    utr: "UTR123456",
    entryDate: "2025-10-13",
    status: "Completed",
    remark: "Gift card redeemed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
  {
    id: 11,
    profileName: "Profile K",
    userName: "User K",
    amount: "1100.00",
    paymentType: "Bank Deposit",
    utr: "UTR654321",
    entryDate: "2025-10-12",
    status: "Failed",
    remark: "Bank deposit failed",
    image: "https://via.placeholder.com/50",
    action: "View",
    parentIp: " 2131231231",
  },
];
const TeamManagement = () => {
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState("profileName");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  //   // Enhanced filter logic
  //   const filteredData = data?.filter((item) => {
  //     const matchesColumn = item[searchColumn]
  //       ?.toString()
  //       .toLowerCase()
  //       .includes(search.toLowerCase());
  //     const matchesStatus = status === "all" ? true : item.status === status;
  //     const from = dateRange.from ? new Date(dateRange.from) : null;
  //     const to = dateRange.to ? new Date(dateRange.to) : null;
  //     const matchesDate =
  //       (!from || new Date(item.entryDate) >= from) &&
  //       (!to || new Date(item.entryDate) <= to);
  //     return matchesColumn && matchesStatus && matchesDate;
  //   });

  // Pagination logic
  const totalPages = Math.ceil(data.length / entries);
  const paginatedData = data.slice(
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

  return (
    <>
      <div className="lg:text-2xl text-lg mb-5 ">Team User Management</div>
      <div className="flex justify-between items-center mb-5">
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
        <TeamManagementDialog />
      </div>
      <Table className="hidden lg:table w-full">
        <TableCaption>A list of your request list.</TableCaption>
        <TableHeader className="bg-[#8AAA08]">
          <TableRow>
            <TableHead className="w-[100px] rounded-tl-lg">S.No</TableHead>
            <TableHead>Profile Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead className={"text-center"}>User Role</TableHead>
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
                    textToCopy={`Username - ${item.userName}\nProfile Name - ${item.profileName}`}
                    title="Copy User Name, Profile Name"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.profileName}
                  <CopyButton
                    textToCopy={item.profileName}
                    title="Copy Profile Name"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.userName}
                  <CopyButton
                    textToCopy={item.userName}
                    title="Copy User Name"
                  />
                </div>
              </TableCell>
              <TableCell className="text-center align-middle">
                <div className="flex gap-1 items-center justify-center">
                  <Badge className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition">
                    Admin
                  </Badge>
                  <Badge className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition">
                    Manager
                  </Badge>
                  <Badge className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold hover:bg-yellow-200 transition">
                    Auditor
                  </Badge>
                </div>
              </TableCell>

              <TableCell className="text-center align-middle">
                <div className="flex gap-1 items-center justify-center">
                  <button className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition">
                    Modify Roles
                  </button>
                  <button className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition">
                    Delete User
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
          {Math.min(currentPage * entries, data.length)} of {data.length}{" "}
          entries
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

export default TeamManagement;

// Card component for mobile view
const TransactionCard = ({ transaction }) => {
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
    <div className="bg-[#F3D5F4] rounded-2xl shadow-md border border-gray-200 overflow-hidden  mb-4">
      {/* Header */}
      <div className="flex bg-[#8AAA08]    items-center justify-between p-2 ">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#D00FD3] rounded-full flex items-center justify-center dark:text-white text-white font-semibold">
            <img src={latestLogo} alt="" />
            {/* {transaction.userName?.charAt(0)} */}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-sm dark:text-white text-white font-bold">
                {transaction.profileName}
              </h3>
              <CopyButton
                textToCopy={transaction.profileName}
                title="Copy Profile Name"
              />
            </div>
            <div className="flex items-center gap-1">
              <h3 className="text-sm dark:text-white text-white font-bold">
                {transaction.userName}
              </h3>
              <CopyButton
                textToCopy={transaction.userName}
                title="Copy User Name"
              />
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-1">
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full mx-auto text-xs font-medium ${getStatusColor(
              transaction.status
            )}`}
          >
            {transaction.status}
          </div>
          <div className="text-sm  dark:text-white text-white">
            {transaction.entryDate}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-2 p-2 ">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-black " />
            <span className="text-sm text-black ">Username</span>
          </div>

          <span className="text-sm  ml-auto">{transaction.paymentType}</span>
          <CopyButton
            textToCopy={transaction.paymentType}
            title="Copy Payment Type"
          />
          <button
            // onClick={() => handleCopy(transaction.paymentType)}
            title="Copy IFSC Code"
            className="ml-1 p-1 hover:bg-gray-200 rounded"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-black " />
            <span className="text-sm text-black ">Password</span>
          </div>

          <span className="text-sm  ml-auto">{transaction.utr}</span>
          <CopyButton textToCopy={transaction.utr} title="Copy UTR" />
          <button
            // onClick={() => handleCopy(transaction.utr)}
            title="Copy UTR"
            className="ml-1 p-1 hover:bg-gray-200 rounded"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2">
            <ShieldPlus className="w-4 h-4 text-black " />
            <span className="text-sm text-black ">Role Assign</span>
          </div>
          <span className="text-sm  ml-auto">
            <div className="grid grid-cols-2 gap-3 ">
              <div className="flex items-center gap-1">
                <Checkbox className={"text-black border-black"} id="admin" />
                <Label htmlFor="admin">Admin</Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox className={"text-black border-black"} id="deposit" />
                <Label htmlFor="deposit">Depsoit</Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox className={"text-black border-black"} id="manager" />
                <Label htmlFor="manager">Manager</Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  className={"text-black border-black"}
                  id="withdrawal"
                />
                <Label htmlFor="withdrawal">Withdrawal</Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox className={"text-black border-black"} id="auditor" />
                <Label htmlFor="auditor">Auditor</Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox className={"text-black border-black"} id="createID" />
                <Label htmlFor="createID">Create ID</Label>
              </div>
            </div>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-2 p-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Trash2Icon className="h-6 w-6 text-red-500" />

          <Copy className={"h-6 w-6"} />
        </div>
        <div className="flex  gap-2">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full text-[10px] font-light">
            Approve
          </button>
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1  rounded-full text-[10px] font-light">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
