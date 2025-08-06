import CopyButton from "@/components/CopyButton";
import { Badge } from "@/components/ui/badge";
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
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Copy, CreditCard, Hash, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Pagination from "./Pagination";
import TableFilterBar from "./TableFilters";
import WithdrawalRejectDialog from "./WithdrawalRejectDialog";
import WithdrawLogo from "/asset/Group 48095823.png";
import { getStatusColor } from "@/utils/RolesBadgeColor";

const COLUMN_OPTIONS = [
  { label: "Profile Name", value: "profileName" },
  // { label: "User Name", value: "userName" },
  { label: "Amount", value: "amount" },
  { label: "Payment Type", value: "withdrawMethod" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const WithdrawTable = ({ data, fetchWithdraws }) => {
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
        // item.userName,
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
        // "User Name": item.userName,
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
  // 1) Helpers at top of WithdrawTable
  const handleStatusUpdate = async (id, newStatus, remark = "") => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/withdraw/admin/status/${id}`,
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
      await fetchWithdraws();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.warning("You are not authorized to perform this action");
        return;
      }
      const msg = err?.response?.data?.message || "Failed to update status.";
      toast.error(msg);
    }
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
            {/* <TableHead>User Name</TableHead> */}
            <TableHead>Wallet Bal.</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Entry Date</TableHead>
            <TableHead className={"text-center"}>Status</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead>Withdraw Date</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-right rounded-tr-lg">
              Parent IP
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.map((item, index) => (
            <TableRow key={item.id}>
              {/* S.No with copy all */}
              <TableCell className="w-[100px]">
                <div className="flex items-center gap-1">
                  {(currentPage - 1) * entries + index + 1}
                  <CopyButton
                    textToCopy={
                      item.withdrawMethod === "bank"
                        ? `ProfileName - ${item.userName}\nAmount - ${item.amount}\nName: ${item.selectedAccount.accountHolder}\nAccount: ${item.selectedAccount.accountNumber}\nIFSC: ${item.selectedAccount.ifscCode}\nBank: ${item.selectedAccount.bankName}`
                        : item.withdrawMethod === "upi"
                        ? `ProfileName - ${item.userName}\nAmount - ${item.amount}\nUPI Id: ${item.selectedAccount.upiId}\nUPI Name: ${item.selectedAccount.upiName}`
                        : "No payment details"
                    }
                    title={
                      item.withdrawMethod === "bank"
                        ? "Copy Bank All Details"
                        : item.withdrawMethod === "upi"
                        ? "Copy UPI All Details"
                        : "Copy Details"
                    }
                  />
                </div>
              </TableCell>
              <TableCell>{item.userName}</TableCell>
              {/* <TableCell>
                <div className="flex items-center gap-1">
                  {item.userName}
                  <CopyButton
                    textToCopy={item.userName}
                    title="Copy username"
                  />
                </div>
              </TableCell> */}
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.wallet}
                  <CopyButton
                    textToCopy={item.wallet}
                    title="Copy amount Number"
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
              <TableCell>{item.withdrawMethod}</TableCell>
              <TableCell>
                {item.withdrawMethod === "bank" ? (
                  <>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between gap-1">
                        {item.selectedAccount.accountHolder}
                        <CopyButton
                          textToCopy={item.selectedAccount.accountHolder}
                          title="Copy name"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        {item.selectedAccount.accountNumber}
                        <CopyButton
                          textToCopy={item.selectedAccount.accountNumber}
                          title="Copy Account Number"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        {item.selectedAccount.ifscCode}
                        <CopyButton
                          textToCopy={item.selectedAccount.ifscCode}
                          title="Copy IFSC Code"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        {item.selectedAccount.bankName}
                        <CopyButton
                          textToCopy={item.selectedAccount.bankName}
                          title="Copy Bank Name"
                        />
                      </div>
                      <div className="justify-center items-center flex bg-gray-200 rounded-sm ">
                        <CopyButton
                          textToCopy={`Name: ${item.selectedAccount.accountHolder}\nAccount: ${item.selectedAccount.accountNumber}\nIFSC: ${item.selectedAccount.ifscCode}\nBank: ${item.selectedAccount.bankName}`}
                          title="Copy Bank All Details"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between gap-1">
                        {item.selectedAccount.upiId}
                        <CopyButton
                          textToCopy={item.selectedAccount.upiId}
                          title="Copy upi id"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        {item.selectedAccount.upiName}
                        <CopyButton
                          textToCopy={item.selectedAccount.upiName}
                          title="Copy upi name"
                        />
                      </div>

                      <div className="justify-center items-center flex bg-gray-200 rounded-sm ">
                        <CopyButton
                          textToCopy={`UpiId: ${item.selectedAccount.upiId}\nUpiName: ${item.selectedAccount.upiName}`}
                          title="Copy UPI All Details"
                        />
                      </div>
                    </div>
                  </>
                )}
              </TableCell>
              <TableCell>{item.entryDate}</TableCell>
              <TableCell className={"align-middle text-center"}>
                <Badge
                  className={`${getStatusColor(
                    item.status
                  )} border-none min-w-full `}
                  variant={"outline"}
                >
                  {item.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{item.remark}</TableCell>
              <TableCell>
                {item.withdrawDate || "N/A"}
                {/* {new Date(
                  item.selectedAccount.createdAt || "N/A"
                ).toLocaleString()} */}
              </TableCell>
              <TableCell className="text-center align-middle">
                <div className="flex gap-1 items-center justify-center">
                  {/* <button
                    onClick={() => updateStatus(item.id, "approved")}
                    className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, "rejected")}
                    className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateRemark(item.id)}
                    className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold hover:bg-yellow-200 transition"
                  >
                    Remark
                  </button> */}
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
                  <WithdrawalRejectDialog
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
                    onStatusUpdated={fetchWithdraws}
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">{item.parentIp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="lg:hidden block">
        {paginatedData?.map((item) => (
          <TransactionCard
            key={item.id}
            transaction={item}
            handleStatusUpdate={handleStatusUpdate}
            fetchWithdraws={fetchWithdraws}
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

export default WithdrawTable;

export const TransactionCard = ({
  transaction,
  fetchWithdraws,
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
            {/* <p className="text-sm dark:text-white text-white">
              {transaction.userName}
            </p> */}
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
          {transaction.withdrawMethod}
        </span>
      </div>

      {/* Bank Details */}
      {transaction.withdrawMethod === "bank" ? (
        <div className=" flex justify-between  m-2  ">
          <div className="flex items-start gap-2 mb-1">
            <Hash className="w-4 h-4 text-black" />
            <span className="text-sm  text-black">Bank Details</span>
          </div>
          <div className="space-y-1  ">
            <div className="flex items-center ">
              {/* <span className="text-sm text-gray-600">Name:</span> */}
              <span className="text-sm text-black text-right ml-auto">
                {transaction.selectedAccount.accountHolder}
              </span>
              <CopyButton
                textToCopy={transaction.selectedAccount.accountHolder}
                title="Copy Account Holder name"
              />
            </div>
            <div className="flex items-center gap-1">
              {/* <span className="text-sm text-gray-600">Account:</span> */}
              <span className="text-sm text-black ml-auto">
                {transaction.selectedAccount.accountNumber}
              </span>
              <CopyButton
                textToCopy={transaction.selectedAccount.accountNumber}
                title="Copy Account Number"
              />
            </div>
            <div className="flex items-center gap-1">
              {/* <span className="text-sm text-gray-600">IFSC:</span> */}
              <span className="text-sm text-black ml-auto">
                {transaction.selectedAccount.ifscCode}
              </span>
              <CopyButton
                textToCopy={transaction.selectedAccount.ifscCode}
                title="Copy IFSC Code"
              />
            </div>
            <div className="flex items-center gap-1">
              {/* <span className="text-sm text-gray-600">Bank:</span> */}
              <span className="text-sm text-black ml-auto">
                {transaction.selectedAccount.bankName}
              </span>
              <CopyButton
                textToCopy={transaction.selectedAccount.bankName}
                title="Copy Bank Name"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className=" flex justify-between  m-2  ">
          <div className="flex items-start gap-2 mb-1">
            <Hash className="w-4 h-4 text-black" />
            <span className="text-sm  text-black">UPI Details</span>
          </div>
          <div className="space-y-1  ">
            <div className="flex items-center ">
              {/* <span className="text-sm text-gray-600">Name:</span> */}
              <span className="text-sm text-black text-right ml-auto">
                {transaction.selectedAccount.upiId}
              </span>
              <CopyButton
                textToCopy={transaction.selectedAccount.upiId}
                title="Copy upi id"
              />
            </div>
            <div className="flex items-center gap-1">
              {/* <span className="text-sm text-gray-600">Account:</span> */}
              <span className="text-sm text-black ml-auto">
                {transaction.selectedAccount.upiName}
              </span>
              <CopyButton
                textToCopy={transaction.selectedAccount.upiName}
                title="Copy upi name"
              />
            </div>
          </div>
        </div>
      )}

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
          <CopyButton
            textToCopy={`ProfileName - ${transaction.profileName}\nAmount - ${transaction.amount}\nDetails - Name: ${transaction.selectedAccount.accountHolder}, Account: ${transaction.selectedAccount.accountNumber}, IFSC: ${transaction.selectedAccount.IFSCCode}, Bank: ${transaction.selectedAccount.bankName}`}
            title="Copy User Name, Amount, Details"
            className="h-6 w-6"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              handleStatusUpdate(
                transaction.id,
                "Approved",
                "Approved successfully"
              )
            }
            disabled={transaction.status !== "Pending"}
            className="bg-green-500 disabled:bg-gray-100 disabled:text-gray-700 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs"
          >
            Approve
          </button>
          <WithdrawalRejectDialog
            buttonLogo={
              <button
                disabled={transaction.status !== "Pending"}
                className="bg-red-500 hover:bg-red-600  disabled:bg-gray-100 disabled:text-gray-700 text-white px-3 py-1 rounded-full text-xs"
              >
                Reject
              </button>
            }
            gameId={transaction.id}
            onStatusUpdated={fetchWithdraws}
          />
        </div>
      </div>
    </div>
  );
};
