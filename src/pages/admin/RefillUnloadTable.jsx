import axios from "axios";
import { toast } from "sonner";

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
import { useEffect } from "react";
import * as XLSX from "xlsx";
import Pagination from "./Pagination";
import TableFilterBar from "./TableFilters";
import logonew from "/asset/new.png";
import RefillIdRejectDialog from "./RefillIdRejectDialog";

const COLUMN_OPTIONS = [
  { label: "Profile Name", value: "profileName" },
  { label: "User Name", value: "userName" },
  { label: "Amount", value: "amount" },
  { label: "Website", value: "website" },
  { label: "Payment Type", value: "paymentType" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];
// const handleAction = async (id, actionType) => {
//   try {
//     const baseURL = import.meta.env.VITE_URL;
//     const token = localStorage.getItem("token"); // adjust if you're using sessionStorage or context

//     const res = await axios.patch(
//       `${baseURL}/api/panel-deposit/${id}/status`,
//       { status: actionType },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     toast.success(`${actionType} successfully!`);
//     fetchData(); // 👈 refetch updated data
//   } catch (err) {
//     console.error("Action Error:", err.response?.data || err.message);
//     toast.error(
//       err.response?.data?.error || "Action failed. Please try again."
//     );
//   }
// };

const RefillUnloadTable = ({ data, type, fetchData }) => {
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
  } = useTableFilter({ data, initialColumn: "userName" });

  // useEffect(() => {
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
          "User Name",
          "Amount",
          "Payment Type",
          "Website",
          "Entry Date",
          "Status",
          "Remark",
          "Parent IP",
        ],
      ],
      body: filteredData.map((item, idx) => [
        idx + 1,
        item.profileName,
        item.userName,
        item.amount,
        item.paymentType,
        item.website,
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
        "User Name": item.userName,
        Amount: item.amount,
        "Payment Type": item.paymentType,
        Website: item.website,
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
  const handleStatusUpdate = async (id, newStatus, remark = "") => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/panel-deposit/${id}/status`,
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
      await fetchData();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status.";
      toast.error(msg);
    }
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
            <TableHead>User Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Entry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remark</TableHead>
            {type === "unload" && <TableHead>Withdraw Date</TableHead>}
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
                    textToCopy={`Username - ${item.userName}\nAmount - ${item.amount}\nWebsite - ${item.website}`}
                    title="Copy User Name, Amount, UTR"
                  />
                </div>
              </TableCell>
              <TableCell>{item.profileName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.userName}
                  <CopyButton
                    textToCopy={item.userName}
                    title="Copy User Name"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.amount}
                  <CopyButton textToCopy={item.amount} title="Copy Amount" />
                </div>
              </TableCell>
              <TableCell>{item.paymentType}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.website}
                  <CopyButton textToCopy={item.website} title="Copy website" />
                </div>
              </TableCell>
              <TableCell>{item.entryDate}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.remark}</TableCell>
              {type === "unload" && <TableCell>{item.withdrawDate}</TableCell>}
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
                  <RefillIdRejectDialog
                    buttonLogo={
                      <button
                        disabled={item.status !== "Pending"}
                        className="px-2 py-1  disabled:bg-gray-100 disabled:text-gray-700 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition"
                      >
                        Reject
                      </button>
                    }
                    id={item.id}
                    // status={item.status !== "Pending"}
                    onStatusUpdated={fetchData}
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
            handleStatusUpdate={handleStatusUpdate}
            type={type}
            fetchData={fetchData}
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

export default RefillUnloadTable;

// Card component for mobile view
export const TransactionCard = ({
  transaction,
  type,
  handleStatusUpdate,
  fetchData,
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
    <div className="bg-purple-200 rounded-2xl shadow-md border border-gray-200 overflow-hidden  mb-4">
      {/* Header */}
      <div className="flex bg-[#8AAA08]    items-center justify-between p-2 ">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 ${
              type === "unload" ? "bg-[#4F6DE4]" : "bg-[#FB680F]"
            } rounded-full flex items-center justify-center dark:text-white text-white font-semibold`}
          >
            <img src={logonew} alt="" />
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
            <p className="text-sm dark:text-white text-white">
              {transaction.userName}
            </p>
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

      <div className="flex items-center p-2 gap-2">
        <span className="text-sm">Amount</span>
        <span className="ml-auto text-sm font-bold ">{transaction.amount}</span>
        <CopyButton textToCopy={transaction.amount} title="Copy Amount" />
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-3 p-2 ">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-black" />
          <span className="text-sm text-black">Payment Type</span>
          <span className="text-sm  ml-auto">{transaction.paymentType}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-black" />
            <span className="text-sm ml-auto text-black">Website</span>
          </div>

          <span className="text-sm  ml-auto">{transaction.website}</span>
          <CopyButton textToCopy={transaction.website} title="Copy Website" />
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-black" />
          <span className="text-sm text-black">Parent IP</span>
          <span className="text-sm  ml-auto">{transaction.parentIp}</span>
        </div>
        {type === "unload" && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-black" />
            <span className="text-sm text-black">Withdrawal Date</span>
            <span className="text-sm  ml-auto">{transaction.withdrawDate}</span>
          </div>
        )}
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
          <RefillIdRejectDialog
            buttonLogo={
              <button
                disabled={transaction.status !== "Pending"}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs"
              >
                Reject
              </button>
            }
            id={transaction.id}
            onStatusUpdated={fetchData}
          />
        </div>
      </div>
    </div>
  );
};
