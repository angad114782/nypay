import axios from "axios";
import CopyButton from "@/components/CopyButton";
import { Switch } from "@/components/ui/switch";
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
import {
  Copy,
  CreditCard,
  MapPin,
  MessageSquare,
  Trash2,
  User2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import TableFilterBar from "./TableFilters";
import WithdrawLogo from "/asset/Group 48095823.png";
import { useTableFilter } from "@/hooks/AdminTableFilterHook";
import Pagination from "./Pagination";
import { toast } from "sonner";
import RejectDialog from "./RejectDialog";

const COLUMN_OPTIONS = [
  { label: "Profile Name", value: "profileName" },
  { label: "User Name", value: "userName" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Approved", value: "Approved" },
  { label: "Pending", value: "Pending" },
  { label: "Rejected", value: "Rejected" },
];

const CreateIdTable = ({ data, fetchData }) => {
  console.log(data, "data");
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
  } = useTableFilter({ data, initialColumn: "userName" });

  // Modal states
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkText, setRemarkText] = useState("");
  const [selectedId, setSelectedId] = useState("");
  // useEffect(() => {
  //   refreshData();
  // }, []);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  const submitRejection = async () => {
    if (!rejectRemark.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    await handleStatusUpdate(rejectingId, "Rejected", rejectRemark);
    setRejectRemark("");
    setRejectingId(null);
    setShowRejectModal(false);
  };

  const handleBlockToggleFn = async (id, isBlocked) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/game/block-toggle/${id}`,
        { isBlocked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the item through the hook
      updateItem(id, { isBlocked: res.data.updated.isBlocked });
      toast.success(`ID ${isBlocked ? "blocked" : "unblocked"} successfully`);
      // Optionally refresh from server
      await fetchData();
    } catch (error) {
      const msg =
        err?.response?.data?.message || "Failed to update blocked/unblock.";
      toast.error(msg);
    }
  };

  // const handleStatusUpdate = async (id, newStatus) => {
  //   try {
  //     const res = await axios.patch(
  //       `${import.meta.env.VITE_URL}/api/game/status/${id}`,
  //       { status: newStatus },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     updateItem(id, { status: res.data.updated.status });
  //     toast.success(`ID creation ${newStatus} successfully`);
  //     // Optionally refresh from server
  //     await fetchData();
  //   } catch (err) {
  //     const msg = err?.response?.data?.message || "Failed to update status.";
  //     toast.error(msg);
  //   }
  // };
  const handleStatusUpdate = async (id, newStatus, remark = "") => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/game/status/${id}`,
        { status: newStatus, remark },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      updateItem(id, {
        status: res.data.deposit.status,
        remark: res.data.deposit.remark,
      });
      console.log("✅ Authenticated User:", req.user);
      toast.success(`ID creation ${newStatus} successfully`);
      await fetchData();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status.";
      toast.error(msg);
    }
  };

  const handleRemarkSubmit = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/game/remark/${selectedId}`,
        { remark: remarkText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the item through the hook
      updateItem(selectedId, { remark: res.data.updated.remark });

      // Reset modal state
      setShowRemarkModal(false);
      setRemarkText("");
      setSelectedId("");

      // Optionally refresh from server
      await fetchData();
    } catch (error) {
      console.error("❌ Remark update failed:", error);
    }
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
          "Password",
          "Panel",
          "Date Created",
          "Block Status",
          "Status",
          "Remark",
          "Parent IP",
        ],
      ],
      body: filteredData.map((item, idx) => [
        idx + 1,
        item.profileName,
        item.userName,
        item.password,
        item.panel,
        item.createdAt,
        item.isBlocked ? "Blocked" : "Unblocked",
        item.status,
        item.remark,
        item.parentIp,
      ]),
    });
    doc.save("create-id-table.pdf");
  };

  // Excel Download handler
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item, idx) => ({
        "S.No": idx + 1,
        "Profile Name": item.profileName,
        "User Name": item.userName,
        Password: item.password,
        Panel: item.panel,
        "Date Created": item.createdAt,
        "Block Status": item.isBlocked ? "Blocked" : "Unblocked",
        Status: item.status,
        Remark: item.remark,
        "Parent IP": item.parentIp,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "create-id-table.xlsx");
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

      {/* Desktop Table */}
      <Table className="hidden lg:table w-full">
        <TableCaption>A list of your request list.</TableCaption>
        <TableHeader className="bg-[#8AAA08]">
          <TableRow>
            <TableHead className="w-[100px] rounded-tl-lg">S.No</TableHead>
            <TableHead>Profile Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Panel</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead>Block/Unblock</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-right rounded-tr-lg">
              Parent IP
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="w-[100px]">
                <div className="flex items-center gap-1">
                  {(currentPage - 1) * entries + index + 1}
                  <CopyButton
                    textToCopy={`Username - ${item.userName}\nPassword - ${item.password}`}
                    title="Copy User Name, Password"
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
                  {item.password}
                  <CopyButton
                    textToCopy={item.password}
                    title="Copy Password"
                  />
                </div>
              </TableCell>

              <TableCell>{item.panel}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.remark}</TableCell>

              <TableCell className="text-center align-middle">
                <div className="flex items-center justify-center gap-1">
                  <Switch
                    checked={item.isBlocked}
                    onCheckedChange={(val) => handleBlockToggleFn(item.id, val)}
                  />
                </div>
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

                  <RejectDialog
                    buttonLogo={
                      <button
                        disabled={item.status !== "Pending"} // Fixed: Use item.status instead of status
                        className="px-2 py-1 disabled:bg-gray-100 disabled:text-gray-700 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition"
                      >
                        Reject
                      </button>
                    }
                    gameId={item.id}
                    onStatusUpdated={fetchData}
                  />
                </div>
              </TableCell>

              <TableCell className="text-right">{item.parentIp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile Cards */}
      <div className="lg:hidden block">
        {paginatedData?.map((item) => (
          <TransactionCard
            key={item.id}
            fetchData={fetchData}
            transaction={item}
            handleBlockToggleFn={handleBlockToggleFn}
            handleStatusUpdate={handleStatusUpdate}
            onRemarkClick={() => {
              setSelectedId(item.id);
              setRemarkText(item.remark || "");
              setShowRemarkModal(true);
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />

      {/* Remark Modal */}
      {showRemarkModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px]">
            <h3 className="text-lg font-semibold mb-2">Update Remark</h3>
            <textarea
              className="w-full border p-2 mb-4 rounded"
              rows={3}
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="Enter your remark..."
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
                onClick={() => {
                  setShowRemarkModal(false);
                  setRemarkText("");
                  setSelectedId("");
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                onClick={handleRemarkSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateIdTable;

export const TransactionCard = ({
  transaction,
  fetchData,
  handleBlockToggleFn,
  handleStatusUpdate,
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-300 rounded-2xl shadow-md border border-gray-200 mb-4 overflow-hidden">
      {/* Header */}
      <div className="flex bg-[#8AAA08] items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <img src={WithdrawLogo} alt="Logo" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-sm text-white font-bold">
                {transaction.profileName}
              </h3>
              <CopyButton
                textToCopy={transaction.profileName}
                title="Copy Profile Name"
              />
            </div>
            <p className="text-sm text-white">{transaction.userName}</p>
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
          <div className="text-sm text-white">{transaction.createdAt}</div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="flex items-center p-2 gap-2">
        <User2 className="w-4 h-4 text-black" />
        <span className="text-sm">Username</span>
        <span className="ml-auto text-sm font-bold">
          {transaction.userName}
        </span>
        <CopyButton textToCopy={transaction.userName} title="Copy User Name" />
      </div>

      <div className="flex items-center p-2 gap-2">
        <CreditCard className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Password</span>
        <span className="ml-auto text-sm text-black">
          {transaction.password}
        </span>
        <CopyButton textToCopy={transaction.password} title="Copy Password" />
      </div>

      <div className="flex items-center p-2 gap-2">
        <CreditCard className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Panel</span>
        <span className="ml-auto text-sm text-black">{transaction.panel}</span>
      </div>

      <div className="flex items-center p-2 gap-2">
        <MapPin className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Parent IP</span>
        <span className="ml-auto text-sm">{transaction.parentIp}</span>
      </div>

      <div className="flex p-2 gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm text-black">Remark:</span>
        </div>
        <span className="text-sm">{transaction.remark || "No remark"}</span>
      </div>

      <div className="flex items-center p-2 gap-2">
        <span className="ml-auto text-sm flex items-center gap-2">
          <span className="text-black">Block/Unblock</span>
          <Switch
            checked={transaction.isBlocked}
            onCheckedChange={(val) => handleBlockToggleFn(transaction.id, val)}
          />
        </span>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center gap-2 p-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Trash2 className="h-6 w-6 text-red-500 cursor-pointer" />
          <Copy className="h-6 w-6 cursor-pointer" />
        </div>
        <div className="flex gap-2">
          <button
            className="bg-green-500 disabled:text-gray-700 disabled:bg-gray-100 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs transition"
            onClick={() =>
              handleStatusUpdate(
                transaction.id,
                "Approved",
                "Approved successfully"
              )
            }
            disabled={transaction.status !== "Pending"}
          >
            Approve
          </button>
          <RejectDialog
            buttonLogo={
              <button
                disabled={transaction.status !== "Pending"}
                className="bg-red-500 disabled:text-gray-700 disabled:bg-gray-100 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs transition"
              >
                Reject
              </button>
            }
            gameId={transaction.id}
            onStatusUpdated={fetchData}
          />
          {/* <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs transition"
            onClick={() => handleStatusUpdate(transaction.id, "Rejected")}
          >
            Reject
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs transition"
            onClick={onRemarkClick}
          >
            Remark
          </button> */}
        </div>
      </div>
    </div>
  );
};
