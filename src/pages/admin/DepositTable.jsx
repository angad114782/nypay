import axios from "axios";
import { toast } from "sonner"; // or your preferred toast library
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Copy, CreditCard, Hash, MapPin, MessageSquare } from "lucide-react";
import React from "react";
import * as XLSX from "xlsx";
import Pagination from "./Pagination";
import ScreenshotProof from "./ScreenshotProof";
import TableFilterBar from "./TableFilters";
import logo1 from "/asset/Arrow 1.png";
import logo from "/asset/gpay.png";
import { useTableFilter } from "@/hooks/AdminTableFilterHook";
import { Badge } from "@/components/ui/badge";
import RejectDialog from "./RejectDialog";
import DepositRejectDialog from "./DepositRejectDialog";

const COLUMN_OPTIONS = [
  { label: "Profile Name", value: "profileName" },
  // { label: "User Name", value: "userName" },
  { label: "Amount", value: "amount" },
  { label: "UTR", value: "utr" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const DepositTable = ({ data, fetchDeposits }) => {
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
    goToPage,
    handleReset,
    paginatedData,
    filteredData,
    totalPages,
    updateItem,
    refreshData,
  } = useTableFilter({ data, initialColumn: "profileName" });

  // const token = localStorage.getItem("token");
  const handleStatusUpdate = async (id, newStatus, remark = "") => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/deposit/admin/status/${id}`,
        { status: newStatus, remark },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      updateItem(id, {
        status: res.data.updated.status,
        remark: res.data.updated.remark,
      });
      toast.success(`Status updated successfully`);
      await fetchDeposits();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status.";
      toast.error(msg);
    }
  };
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/deposit/admin/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Deposit ${newStatus}`); // e.g. “Withdrawal Completed”
      fetchDeposits(); // or refetch data
      console.log(res, "updateStatus");
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Unable to update status.");
    }
  };

  const updateRemark = async (id) => {
    const remark = prompt("Enter remark for this withdrawal:");
    if (remark == null) return; // user cancelled
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/api/deposit/admin/remark/${id}`,
        { remark },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Remark saved");
      fetchDeposits();
    } catch (err) {
      console.error("Remark update failed", err);
      toast.error("Unable to save remark.");
    }
  };
  // const handleAction = async (depositId, type) => {
  //   try {
  //     let url = "";
  //     let data = {};

  //     if (type === "approve") {
  //       url = `${import.meta.env.VITE_URL}/api/deposit/admin/status/${depositId}`;
  //       data = { status: "approved" };
  //     } else if (type === "reject") {
  //       url = `${import.meta.env.VITE_URL}/api/deposit/admin/status/${depositId}`;
  //       data = { status: "rejected" }; // make sure lowercase matches backend check
  //     } else if (type === "remark") {
  //       const remark = prompt("Enter remark:");
  //       if (!remark) return;
  //       url = `${import.meta.env.VITE_URL}/api/deposit/admin/remark/${depositId}`;
  //       data = { remark };
  //     }

  //     const res = await axios.patch(url, data, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     toast.success(res.data.message || `${type}d successfully`);
  //     window.location.reload();
  //   } catch (err) {
  //     toast.error("❌ " + (err.response?.data?.message || "Something went wrong"));
  //   }
  // };

  // React.useEffect(() => {
  //   setCurrentPage(1);
  // }, [entries, search, searchColumn]);
  // PDF Download handler
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "S.No",
          "Profile Name",
          // "User Name",
          "Amount",
          "Payment Type",
          "UTR",
          "Entry Date",
          "Status",
          "Remark",
          "Parent IP",
        ],
      ],
      body: filteredData.map((item, idx) => [
        idx + 1,
        item.profileName,
        // item.userName,
        item.amount,
        item.paymentType,
        item.utr,
        item.entryDate,
        item.status,
        item.remark,
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
        // "User Name": item.userName,
        Amount: item.amount,
        "Payment Type": item.paymentType,
        UTR: item.utr,
        "Entry Date": item.entryDate,
        Status: item.status,
        Remark: item.remark,
        "Parent IP": item.parentIp,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "table.xlsx");
  };

  return (
    <>
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
            {/* <TableHead>User Name</TableHead> */}
            <TableHead>Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>UTR</TableHead>
            <TableHead>Entry Date</TableHead>
            <TableHead className={"text-center"}>Status</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead>Image</TableHead>
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
                    textToCopy={`Username - ${item.userName}\nAmount - ${item.amount}\nUTR - ${item.utr}`}
                    title="Copy User Name, Amount, UTR"
                  />
                </div>
              </TableCell>
              <TableCell>{item.profileName}</TableCell>
              {/* <TableCell>
                <div className="flex items-center gap-1">
                  {item.userName}
                  <CopyButton
                    textToCopy={item.userName}
                    title="Copy User Name"
                  />
                </div>
              </TableCell> */}
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.amount}
                  <CopyButton textToCopy={item.amount} title="Copy Amount" />
                </div>
              </TableCell>
              <TableCell>{item.paymentType}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.utr}
                  <CopyButton textToCopy={item.utr} title="Copy UTR" />
                </div>
              </TableCell>
              <TableCell>{item.entryDate}</TableCell>
              <TableCell className={"align-middle text-center"}>
                <Badge variant={"outline"}>{item.status.toUpperCase()}</Badge>
              </TableCell>
              <TableCell>{item.remark}</TableCell>
              <TableCell>
                <ScreenshotProof
                  url={`${import.meta.env.VITE_URL}${item.screenshotUrl}`}
                  utr={item.utr}
                />
              </TableCell>
              <TableCell className="text-center align-middle">
                <div className="flex gap-1 items-center justify-center">
                  <button
                    className="px-2 py-1 disabled:bg-gray-100 disabled:text-gray-700 rounded bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition"
                    // onClick={() => handleStatusUpdate(item.id, "Approved")}
                    onClick={() =>
                      handleStatusUpdate(
                        item.id,
                        "Approved",
                        "Approved successfully"
                      )
                    }
                    disabled={item.status !== "Pending"}
                  >
                    Approve
                  </button>
                  <DepositRejectDialog
                    buttonLogo={
                      <button
                        disabled={item.status !== "Pending"}
                        className="px-2 py-1  disabled:bg-gray-100 disabled:text-gray-700 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition"
                      >
                        Reject
                      </button>
                    }
                    gameId={item.id}
                    // status={item.status !== "Pending"}
                    onStatusUpdated={fetchDeposits}
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">{item.parentIp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="lg:hidden block">
        {paginatedData.map((item) => (
          <TransactionCard
            key={item.id}
            transaction={item}
            updateStatus={updateStatus}
            updateRemark={updateRemark}
          />
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

export default DepositTable;

// Card component for mobile view
export const TransactionCard = ({
  transaction,
  fetchDeposits,
  handleStatusUpdate,
}) => {
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
    <div className="bg-[#d1d6d6] rounded-2xl shadow-md border border-gray-200 overflow-hidden  mb-4">
      {/* Header */}
      <div className="flex bg-[#8AAA08]    items-center justify-between p-2 ">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center dark:text-white text-white font-semibold">
            <img src={logo1} alt="" />
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
            {/* <p className="text-sm dark:text-white text-white">
              {transaction.userName}
            </p> */}
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

      {/* Amount */}
      {/* <div className="p-2">
        <div className=" text-gray-900">{transaction.amount}</div>
      </div> */}
      <div className="flex items-center p-2 gap-2 ">
        {/* <IndianRupee className="w-4 h-4" /> */}
        <span className=" text-sm  text-black ">Amount</span>
        <span className=" ml-auto text-sm font-bold  text-black">
          {transaction.amount}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-3 p-2 ">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-black " />
          <span className="text-sm text-black ">Payment Type</span>
          <span className="text-sm  ml-auto">{transaction.paymentType}</span>
        </div>

        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-black " />
          <span className="text-sm text-black ">UTR</span>
          <span className="text-sm ml-auto font-bold flex items-center gap-1">
            {transaction.utr}
            <CopyButton textToCopy={transaction.utr} title="Copy UTR" />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-black " />
          <span className="text-sm text-black ">Parent IP</span>
          <span className="text-sm  ml-auto">{transaction.parentIp}</span>
        </div>
      </div>

      {/* Status and Remarks */}
      <div className="flex p-2 gap-2 ">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm text-black">Remark :</span>
        </div>

        <span className="text-sm ">{transaction.remark}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-2 p-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <ScreenshotProof
            url={`${import.meta.env.VITE_URL}${transaction.screenshotUrl}`}
            utr={transaction.utr}
          />

          <Copy className={"h-6 w-6"} />
        </div>
        <div className="flex  gap-2">
          <button
            onClick={() =>
              handleStatusUpdate(
                transaction.id,
                "Approved",
                "Approved successfully"
              )
            }
            disabled={transaction.status !== "Pending"}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs"
          >
            Approve
          </button>
          <DepositRejectDialog
            buttonLogo={
              <button
                disabled={transaction.status !== "Pending"}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs"
              >
                Reject
              </button>
            }
            gameId={transaction.id}
            onStatusUpdated={fetchDeposits}
          />
        </div>
      </div>
    </div>
  );
};
