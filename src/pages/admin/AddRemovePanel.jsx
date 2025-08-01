import ConfirmDialog from "@/components/ConfirmDialog";
import CopyButton from "@/components/CopyButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import axios from "axios";
import { Copy, KeyRound, SquarePen, Trash2Icon, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import AddOrEditPanelDialog from "./AddOrEditPanelDialog";

const AddRemovePanel = () => {
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchPanels = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/panels/admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(res.data.panels);
    } catch (err) {
      console.error("❌ Failed to load Panels", err);
    }
  };
  const deletePanels = async (id, userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/api/panels/panel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Panel ${userId} deleted successfully`);
      fetchPanels();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.warning("You are not authorized to perform this action");
        return;
      }
      console.error("❌ Failed to delete Panels", err);
    }
  };
  const togglePanelStatus = async (id, checked) => {
    // Immediate UI update
    setData((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isActive: checked } : item
      )
    );
    try {
      await axios.patch(
        `${import.meta.env.VITE_URL}/api/panels/panel/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        `Panel ${checked ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.warning("You are not authorized to perform this action");
        return;
      }
      console.error("❌ Failed to toggle Panel status", err);
      // Revert on failure
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: !checked } : item
        )
      );
      toast.error("Unable to change panel status");
    }
  };

  useEffect(() => {
    fetchPanels();
  }, []);

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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [entries]);

  return (
    <>
      <div className="lg:text-2xl text-lg mb-5 ">
        Add Remove Panels/Platform
      </div>
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
        <AddOrEditPanelDialog fetchPanels={fetchPanels} />
      </div>
      <Table className="hidden lg:table w-full">
        <TableCaption>A list of your request list.</TableCaption>
        <TableHeader className="bg-[#8AAA08]">
          <TableRow>
            <TableHead className="w-[100px] rounded-tl-lg">S.No</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Panel Name</TableHead>
            <TableHead>Panel Link</TableHead>
            <TableHead className={"text-center"}>Acivate/Deactivate</TableHead>
            <TableHead className="text-center rounded-tr-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => (
            <TableRow key={item._id}>
              {/* S.No with copy all */}
              <TableCell className="w-[100px]">
                <div className="flex items-center gap-1">
                  {(currentPage - 1) * entries + index + 1}
                  <CopyButton
                    textToCopy={`Panel Name - ${item.profileName}\nPanel Link - ${item.userId}`}
                    title="Copy Panel Name,Panel Link"
                  />
                </div>
              </TableCell>
              {/* <TableCell>{item.profileName}</TableCell> */}
              <TableCell>
                <div className="flex items-center gap-1">
                  <img
                    src={`${import.meta.env.VITE_URL}${item?.logoUrl}`}
                    className="h-10 w-10 rounded-sm"
                    alt=""
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.profileName}
                  <CopyButton
                    textToCopy={item.profileName}
                    title="Copy Panel Name"
                  />
                </div>
              </TableCell>
              <TableCell className="align-middle">
                <div className="flex justify-start items-center gap-1">
                  <a
                    href={
                      item?.userId.startsWith("http")
                        ? item.userId
                        : `https://${item.userId}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer truncate max-w-32"
                    title={item.userId}
                  >
                    {item.userId}
                  </a>
                  <CopyButton
                    textToCopy={item.userId}
                    title="Copy Panel Link"
                  />
                </div>
              </TableCell>
              <TableCell className={"align-middle"}>
                <div className="flex justify-center items-center gap-1">
                  <Switch
                    checked={!item.isActive}
                    onCheckedChange={(val) => togglePanelStatus(item._id, !val)}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center align-middle">
                <div className="flex gap-2 items-center justify-around">
                  {/* <ConfirmDialog
                    onClick={() => deletePanels(item._id, item.userId)}
                    buttonLogo={<Trash2Icon />}
                    title={"Delete Panel"}
                    description={"Are you sure you want to delete this panel?."}
                  /> */}

                  <AddOrEditPanelDialog
                    fetchPanels={fetchPanels}
                    panel={item}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="lg:hidden block">
        {paginatedData.map((item) => (
          <TransactionCard
            key={item._id}
            deletePanels={deletePanels}
            transaction={item}
            fetchPanels={fetchPanels}
            togglePanelStatus={togglePanelStatus}
          />
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

export default AddRemovePanel;

// Card component for mobile view
const TransactionCard = ({
  transaction,
  deletePanels,
  fetchPanels,
  togglePanelStatus,
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-[#F3D5F4] rounded-2xl shadow-md border border-gray-200 overflow-hidden  mb-4">
      {/* Header */}
      <div className="flex bg-[#8AAA08]    items-center justify-between p-2 ">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#D00FD3] rounded-full object-cover flex items-center justify-center dark:text-white text-white font-semibold">
            <img
              src={`${import.meta.env.VITE_URL}${transaction?.logoUrl}`}
              className="rounded-full w-full h-full object-cover"
            />
            {/* {transaction.userName?.charAt(0)} */}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-sm dark:text-white text-white font-bold">
                {transaction.profileName}
              </h3>
              <CopyButton
                textToCopy={transaction.profileName}
                title="Copy Panel Name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-2 p-2 ">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-black " />
            <span className="text-sm text-black ">Panel Name</span>
          </div>

          <span className="text-sm  ml-auto">{transaction.profileName}</span>
          <CopyButton
            textToCopy={transaction.profileName}
            title="Copy Panel Name"
          />
          <button
            onClick={() => handleCopy(transaction.userId)}
            title="Copy IFSC Code"
            className="ml-1 p-1 hover:bg-gray-200 rounded"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-black " />
            <span className="text-sm text-black ">Link</span>
          </div>

          <a
            href={
              transaction.userId.startsWith("http")
                ? transaction.userId
                : `https://${transaction.userId}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm ml-auto text-blue-600 hover:text-blue-800 underline cursor-pointer truncate max-w-32"
            title={transaction.userId}
          >
            {transaction.userId}
          </a>

          <CopyButton textToCopy={transaction.userId} title="Copy Panel Link" />
          <button
            onClick={() => handleCopy(transaction.userId)}
            title="Copy Panel Link"
            className="ml-1 p-1 hover:bg-gray-200 rounded"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-2 p-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <ConfirmDialog
            onClick={() => deletePanels(transaction._id, transaction.userId)}
            buttonLogo={<Trash2Icon />}
            title={"Delete Panel"}
            description={"Are you sure you want to delete this panel?."}
          />
          {/* <ScreenshotProof url={logo} utr={transaction.utr} /> */}
          <AddOrEditPanelDialog fetchPanels={fetchPanels} panel={transaction} />
          {/* <SquarePen className="w-6 h-6" /> */}
          <Copy className={"h-6 w-6"} />
        </div>
        <div className="flex  gap-2">
          <div className="flex items-center justify-center text-xs gap-1">
            Activate/Deactivate
            <Switch
              checked={!transaction.isActive}
              onCheckedChange={(val) => togglePanelStatus(transaction._id, val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
