import { Button } from "@/components/ui/button";
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
import { Lock } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const AddNewBankDialog = () => {
  const [teamManagementData, setTeamManagementData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const [loading, setLoading] = useState(false);

  // const handleRoleChange = (role) => {
  //   setTeamManagementData((prev) => ({
  //     ...prev,
  //     roles: {
  //       ...prev.roles,
  //       [role]: !prev.roles[role],
  //     },
  //   }));
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

  const response = await axios.post(
  `${import.meta.env.VITE_URL}/api/admin/bank/add`,
  {
    bankName: teamManagementData.bankName,
    accountHolder: teamManagementData.accountHolderName, // ✅ match backend field
    accountNumber: teamManagementData.accountNumber,
    ifscCode: teamManagementData.ifscCode,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


    toast.success("Bank added successfully");
    // console.log("✔ Response:", response.data);
  } catch (err) {
    console.error("❌ Error:", err);
    toast.error(err?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog>
      <DialogTrigger className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white">
        Add New Bank Details
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white text-black p-0 overflow-hidden">
        <DialogTitle className={"hidden"}></DialogTitle>
        <DialogDescription className={"hidden"}></DialogDescription>
        <div className="h-24 bg-gradient-to-r relative from-[#8AAA08] -z-20 to-[#15CA5280]" />
        <div className="px-6">
          {/* Lock Icon */}
          <div className="flex items-center justify-center -mt-12 mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center absolute top-3 left-3 mb-8">
            <h2 className="text-2xl font-bold text-white">Bank Account</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">
                  Account Holder Name
                </Label>
                <Input
                  type="text"
                  name="accountHolderName"
                  value={teamManagementData.accountHolderName}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      accountHolderName: e.target.value,
                    })
                  }
                  placeholder="Enter Account Holder Name"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">
                  Account Number
                </Label>
                <Input
                  type="text"
                  name="upiId"
                  value={teamManagementData.accountNumber}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      accountNumber: e.target.value,
                    })
                  }
                  placeholder="Enter Bank Account Number"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>
              <div>
                <Label className="text-gray-800 font-medium">IFSC Code</Label>
                <Input
                  type="text"
                  name="ifscCode"
                  value={teamManagementData.ifscCode}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      ifscCode: e.target.value,
                    })
                  }
                  placeholder="Enter Bank IFSC Code"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>
              <div>
                <Label className="text-gray-800 font-medium">Bank Name</Label>
                <Input
                  type="text"
                  name="upiId"
                  value={teamManagementData.bankName}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      bankName: e.target.value,
                    })
                  }
                  placeholder="Enter Bank Name"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>
            </div>
            <DialogFooter className="pb-6 px-0">
              <div className="flex gap-3 w-full">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
