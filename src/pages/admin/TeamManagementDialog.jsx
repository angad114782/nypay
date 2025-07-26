import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldPlus } from "lucide-react";

export const TeamManagementDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false); // Add dialog state
  const [teamManagementData, setTeamManagementData] = useState({
    profileName: "",
    userId: "",
    password: "",
    roles: {
      admin: false,
      deposit: false,
      manager: false,
      withdrawal: false,
      auditor: false,
      createID: false,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role) => {
    setTeamManagementData((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: !prev.roles[role],
      },
    }));
  };

  // Reset form when dialog closes
  const resetForm = () => {
    setTeamManagementData({
      profileName: "",
      userId: "",
      password: "",
      roles: {
        admin: false,
        deposit: false,
        manager: false,
        withdrawal: false,
        auditor: false,
        createID: false,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      profileName: teamManagementData.profileName,
      userId: teamManagementData.userId,
      password: teamManagementData.password,
      roles: Object.keys(teamManagementData.roles).filter(
        (role) => teamManagementData.roles[role]
      ),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/user-management/team`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("User added successfully!");
      setOpen(false); // Close the dialog
      resetForm(); // Reset the form
      if (onSuccess) onSuccess(); // optionally trigger refetch
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm(); // Reset form when dialog is closed
        }
      }}
    >
      <DialogTrigger className="bg-[#FAB906] text-black cursor-pointer lg:px-6 px-3 h-6 lg:h-full rounded-lg hover:bg-[#fab940]">
        Add User
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white text-black p-0 overflow-hidden">
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <div className="h-24 bg-gradient-to-r relative from-[#8AAA08] -z-20 to-[#15CA5280]" />

        <div className="px-6">
          <div className="flex items-center justify-center -mt-12 mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="text-center absolute top-3 left-3 mb-8">
            <h2 className="text-2xl font-bold text-white">Add New Team User</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">
                  Profile Name
                </Label>
                <Input
                  type="text"
                  value={teamManagementData.profileName}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      profileName: e.target.value,
                    })
                  }
                  placeholder="Enter team member name"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">User ID</Label>
                <Input
                  type="text"
                  value={teamManagementData.userId}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      userId: e.target.value,
                    })
                  }
                  placeholder="Enter required user ID"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">
                  Create Password
                </Label>
                <Input
                  type="password"
                  value={teamManagementData.password}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter password"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                  required
                />
              </div>

              {/* Roles */}
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-2">
                  <ShieldPlus className="w-4 h-4 text-black" />
                  <span className="text-sm text-black">Role Assign</span>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-auto">
                  {Object.entries(teamManagementData.roles).map(
                    ([role, value]) => (
                      <div key={role} className="flex items-center gap-1">
                        <Checkbox
                          checked={value}
                          onCheckedChange={() => handleRoleChange(role)}
                          className="text-black border-black"
                          id={role}
                        />
                        <Label htmlFor={role} className="capitalize">
                          {role === "createID" ? "Create ID" : role}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pb-6 px-0">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
