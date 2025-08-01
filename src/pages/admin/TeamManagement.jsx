import CopyButton from "@/components/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";
import {
  Copy,
  KeyRound,
  ShieldPlus,
  SquarePen,
  Trash2Icon,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TeamManagementDialog } from "./TeamManagementDialog";
import latestLogo from "/asset/Group.png";
import { ModifyRolesDialog } from "./ModifyRolesDialog";
import { getBadgeClasses } from "@/utils/RolesBadgeColor";

const TeamManagement = () => {
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamUsers, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination logic
  const totalPages = Math.ceil(teamUsers.length / entries);
  const paginatedData = teamUsers.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  // Handle page change
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Reset to first page when entries/search/searchColumn changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entries]);

  const fetchTeamUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/user-management/team`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("✅ Team Users Response:", res.data);
      setTeamUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to fetch team users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userIdToDelete, profileName) => {
    try {
      setLoading(true);

      await axios.delete(
        `${
          import.meta.env.VITE_URL
        }/api/user-management/team/${userIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(`User ${profileName} deleted successfully`);

      // Remove the deleted user from the state
      setTeamUsers((prev) =>
        prev.filter((user) => {
          const currentUserId =
            typeof user.userId === "object" ? user.userId._id : user.userId;
          return currentUserId !== userIdToDelete;
        })
      );

      // If current page becomes empty after deletion, go to previous page
      const remainingUsers = teamUsers.filter((user) => {
        const currentUserId =
          typeof user.userId === "object" ? user.userId._id : user.userId;
        return currentUserId !== userIdToDelete;
      });
      const newTotalPages = Math.ceil(remainingUsers.length / entries);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      fetchTeamUsers(); // Refresh the user list
    } catch (err) {
      console.error("Failed to delete user", err);
      toast.error(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamUsers();
  }, []);

  return (
    <>
      <div className="lg:text-2xl text-lg mb-5">Team User Management</div>
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
        <TeamManagementDialog onSuccess={fetchTeamUsers} />
      </div>

      {loading && (
        <div className="text-center py-4">
          <span className="text-gray-500">Loading...</span>
        </div>
      )}

      <Table className="hidden lg:table w-full">
        <TableCaption>A list of your team users.</TableCaption>
        <TableHeader className="bg-[#8AAA08]">
          <TableRow>
            <TableHead className="w-[100px] rounded-tl-lg">S.No</TableHead>
            <TableHead>Profile Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Mobile No.</TableHead>
            <TableHead className={"text-center"}>User Role</TableHead>
            <TableHead className="text-center rounded-tr-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => (
            <TableRow key={item._id || item.userId}>
              {/* S.No with copy all */}
              <TableCell className="w-[100px]">
                <div className="flex items-center gap-1">
                  {(currentPage - 1) * entries + index + 1}
                  <CopyButton
                    textToCopy={`Username - ${
                      typeof item.userId === "object"
                        ? item.userId.name
                        : item.userId
                    }\nProfile Name - ${item.profileName}`}
                    title="Copy User Name, Profile Name"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.name}
                  <CopyButton
                    textToCopy={item.name}
                    title="Copy Profile Name"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.email}
                  <CopyButton textToCopy={item.email} title="Copy User Name" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.phone}
                  <CopyButton
                    textToCopy={item.phone}
                    title="Copy Mobile Number"
                  />
                </div>
              </TableCell>

              <TableCell className="text-center align-middle">
                <div className="flex gap-1 items-center justify-center flex-wrap">
                  {[item.role]?.map((role, idx) => {
                    const { bg, text } = getBadgeClasses(role);
                    return (
                      <Badge
                        key={idx}
                        className={`${bg} ${text} px-3 py-1 rounded-full text-xs font-medium shadow-sm`}
                      >
                        {role}
                      </Badge>
                    );
                  })}
                </div>
              </TableCell>

              <TableCell className="text-center align-middle">
                <div className="flex gap-1 items-center justify-center">
                  <ModifyRolesDialog
                    buttonLogo={
                      <button className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200 transition">
                        Modify Roles
                      </button>
                    }
                    user={item}
                    onSuccess={fetchTeamUsers}
                  />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition"
                        disabled={loading}
                      >
                        Delete User
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the user "{item.profileName}" (
                          {typeof item.userId === "object"
                            ? item.userId.name
                            : item.userId}
                          ) and remove all their data from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDelete(
                              item._id,
                              item.name || item.profileName
                            )
                          }
                          className="bg-red-600 hover:bg-red-700"
                          disabled={loading}
                        >
                          {loading ? "Deleting..." : "Delete User"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="lg:hidden block">
        {paginatedData.map((item) => (
          <TransactionCard
            key={item._id || item.userId}
            transaction={item}
            onDelete={handleDelete}
            loading={loading}
            fetchTeamUsers={fetchTeamUsers}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          {teamUsers.length === 0
            ? "No entries to display"
            : `Showing ${(currentPage - 1) * entries + 1} to ${Math.min(
                currentPage * entries,
                teamUsers.length
              )} of ${teamUsers.length} entries`}
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
const TransactionCard = ({
  transaction,
  onDelete,
  loading,
  fetchTeamUsers,
}) => {
  return (
    <div className="bg-[#F3D5F4] rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-4">
      {/* Header */}
      <div className="flex bg-[#8AAA08] items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#D00FD3] rounded-full flex items-center justify-center dark:text-white text-white font-semibold">
            <img src={latestLogo} alt="" />
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
                {typeof transaction.userId === "object"
                  ? transaction.userId.name
                  : transaction.userId}
              </h3>
              <CopyButton
                textToCopy={
                  typeof transaction.userId === "object"
                    ? transaction.userId.name
                    : transaction.userId
                }
                title="Copy User Name"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm dark:text-white text-white">
            {transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-2 p-2">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-black" />
            <span className="text-sm text-black">Username</span>
          </div>
          <span className="text-sm ml-auto">
            {typeof transaction.userId === "object"
              ? transaction.userId.name
              : transaction.userId}
          </span>
          <CopyButton
            textToCopy={
              typeof transaction.userId === "object"
                ? transaction.userId.name
                : transaction.userId
            }
            title="Copy Username"
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-black" />
            <span className="text-sm text-black">Mobile</span>
          </div>
          <span className="text-sm ml-auto">{transaction.mobile}</span>
          <CopyButton textToCopy={transaction.mobile} title="Copy Mobile" />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-black" />
            <span className="text-sm text-black">Password</span>
          </div>
          <span className="text-sm ml-auto">••••••••</span>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2">
            <ShieldPlus className="w-4 h-4 text-black" />
            <span className="text-sm text-black">Roles</span>
          </div>
          <div className="ml-auto">
            {/* <div className="flex flex-wrap gap-1">
              {transaction.roles?.map((role, idx) => {
                const { bg, text } = getBadgeClasses(role);
                return (
                  <Badge
                    key={idx}
                    className={`${bg} ${text} px-3 py-1 rounded-full text-xs font-medium shadow-sm`}
                  >
                    {role}
                  </Badge>
                );
              })}
            </div> */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-2 p-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Copy className={"h-6 w-6"} />
        </div>
        <div className="flex gap-2">
          <ModifyRolesDialog
            buttonLogo={
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full text-[10px] font-light">
                Modify Roles
              </button>
            }
            user={transaction}
            onSuccess={fetchTeamUsers}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full text-[10px] font-light">
                Delete User
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  user "{transaction.profileName}" (
                  {typeof transaction.userId === "object"
                    ? transaction.userId.name
                    : transaction.userId}
                  ) and remove all their data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    onDelete(
                      typeof transaction.userId === "object"
                        ? transaction.userId._id
                        : transaction.userId,
                      transaction.profileName
                    )
                  }
                  className="bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete User"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
