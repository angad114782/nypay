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
import { useTableFilter } from "@/hooks/AdminTableFilterHook";
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
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Pagination from "./Pagination";
import TableFilterBar from "./TableFilters";
import WithdrawLogo from "/asset/Group 48095823.png";

const COLUMN_OPTIONS = [
  { label: "Profile Name", value: "profileName" },
  { label: "User Name", value: "userName" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Rejected", value: "Rejected" },
];

const ClientInfoTable = ({ data }) => {
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

  // const [handleBlockToggle, setHandleBlockToggle] = useState(null);
  const [tableData, setTableData] = useState(data);
  // Handle block/unblock toggle
  const handleBlockToggleFn = (id, isBlocked) => {
    // Update the local state to reflect the change
    setTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBlocked } : item))
    );
    // Optionally, call your API here to persist the change
    // Example: await api.updateBlockStatus(id, isBlocked);
    console.log(
      `Toggling block for ID ${id}: ${isBlocked ? "Blocked" : "Unblocked"}`
    );
  };

  // Enhanced filter logic
  useEffect(() => {
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
          "Mobile No.",
          "Created Date",
          "First Deposit",
          "First Bonus",
          "Last Deposit",
          "Last Deposit Date",
          "Last Login Date",
          "Referral Code",
          "Total Deposit",
          "Source",
          "Block/Unblock",
          "Parent IP",
        ],
      ],
      body: filteredData.map((item, idx) => [
        idx + 1,
        item.profileName,
        item.userName,
        item.mobile,
        item.createdAt,
        item.firstDeposit,
        item.firstBonus,
        item.lastDeposit,
        item.lastDepositDate,
        item.lastLoginDate,
        item.referralCode,
        item.totalDeposit,
        item.source,
        item.isBlocked ? "Blocked" : "Unblocked",
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
        Password: item.password,
        UniqueId: item.uniqueId,
        Website: item.website,
        "Date Created": item.createdAt,
        "Block/Unblock": item.isBlocked ? "Blocked" : "Unblocked",
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
            <TableHead className="w-[50px] rounded-tl-lg">S.No</TableHead>
            <TableHead>Profile Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>
              Mobile <br /> Number
            </TableHead>
            <TableHead>
              Created <br /> Date
            </TableHead>
            <TableHead>
              First <br /> Deposit
            </TableHead>
            <TableHead>
              First <br /> Bonus
            </TableHead>
            <TableHead>
              Last <br /> Deposit
            </TableHead>
            <TableHead>
              Last <br /> Deposit <br /> Date
            </TableHead>
            <TableHead>
              Last <br /> Login <br /> Date
            </TableHead>
            <TableHead>
              Referral <br /> Code
            </TableHead>
            <TableHead>
              Total <br /> Deposit
            </TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Block/Unblock</TableHead>
            <TableHead className={"text-center"}>
              Delete <br /> User
            </TableHead>
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
              <TableCell className="w-[50px]">
                <div className="flex items-center gap-1">
                  {(currentPage - 1) * entries + index + 1}
                  <CopyButton
                    textToCopy={`Username - ${item.userName}\nMobile - ${item.mobile}`}
                    title="Copy User Name, Mobile"
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
                  {item.mobile}
                  <CopyButton
                    textToCopy={item.mobile}
                    title="Copy Mobile Number"
                  />
                </div>
              </TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>{item.firstDeposit}</TableCell>

              <TableCell>{item.firstBonus}</TableCell>
              <TableCell>{item.lastDeposit}</TableCell>
              <TableCell>{item.lastDepositDate}</TableCell>
              <TableCell>{item.lastLoginDate}</TableCell>
              <TableCell>{item.referralCode}</TableCell>
              <TableCell>{item.totalDeposit}</TableCell>
              <TableCell>{item.source}</TableCell>

              <TableCell className={"text-center align-middle"}>
                {/* {item.isBlocked} */}
                <div className="flex items-center justify-center gap-1">
                  <Switch
                    checked={item.isBlocked}
                    onCheckedChange={(val) => handleBlockToggleFn(item.id, val)}
                  />
                </div>
              </TableCell>
              <TableCell className={"text-center align-middle"}>
                <div className="flex items-center justify-center gap-1">
                  {<Trash2 className="text-red-500" />}
                </div>
              </TableCell>
              <TableCell className="text-center align-middle">
                <div className="flex gap-1 flex-col items-center justify-center">
                  <button className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition">
                    A/c Statement
                  </button>
                  <button className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition">
                    Deposit Report
                  </button>
                  <button className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold hover:bg-yellow-200 transition">
                    Withdraw Report
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
          <TransactionCard
            key={item.id}
            transaction={item}
            handleBlockToggleFn={handleBlockToggleFn}
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

export default ClientInfoTable;

export const TransactionCard = ({ transaction, handleBlockToggleFn }) => {
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
    <div className="bg-gray-300 rounded-2xl shadow-md border border-gray-200 mb-4 overflow-hidden">
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
                title="Copy Profile Name"
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
          <div className="text-sm text-white">{transaction.createdAt}</div>
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-center p-2 gap-2">
        {/* <IndianRupee className="w-4 h-4" /> */}
        <User2 className="w-4 h-4 text-black" />
        <span className="text-sm">Username</span>
        <span className="ml-auto text-sm font-bold ">
          {transaction.userName}
        </span>
        <CopyButton textToCopy={transaction.userName} title="Copy User Name" />
      </div>

      {/* Payment Type */}
      <div className="flex items-center p-2 gap-2">
        <CreditCard className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Mobile No.</span>
        <span className="ml-auto text-sm text-black">{transaction.mobile}</span>
      </div>

      {/* Payment Type */}
      <div className="flex items-center p-2 gap-2">
        <CreditCard className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Referral</span>
        <span className="ml-auto text-sm text-black">
          {transaction.referralCode}
        </span>
      </div>

      {/* Parent IP */}
      <div className="flex items-center p-2 gap-2">
        <MapPin className="w-4 h-4 text-black" />
        <span className="text-sm text-black">Parent IP</span>
        <span className="ml-auto text-sm ">{transaction.parentIp}</span>
      </div>

      {/* Status and Remarks */}
      <div className="flex p-2 gap-2 ">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm text-black">Remark :</span>
        </div>

        <span className="text-sm ">{transaction.remark}</span>
      </div>
      <div className="flex items-center p-2 gap-2">
        <span className="ml-auto text-sm flex  items-center gap-2 ">
          <span className=" text-black">Block/Unblock</span>
          <Switch
            checked={transaction.isBlocked}
            onCheckedChange={(val) => handleBlockToggleFn(transaction.id, val)}
          />
        </span>
      </div>
      {/* Footer Actions */}
      <div className="flex justify-between items-center gap-2 p-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {/* Placeholder for Screenshot/UTR actions */}
          <Trash2 className="h-6 w-6 text-red-500" />
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
