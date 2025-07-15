import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const PasswordChangeDialog = ({ isOpen, onClose }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("❌ All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_URL}/api/auth/change-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("✅ Password changed successfully");
      onClose();
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
      toast.error("❌ Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-0 bg-white text-black overflow-hidden">
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />

        <div className="h-24 bg-gradient-to-r from-[#8AAA08] to-[#15CA5280]" />

        <div className="px-6">
          <div className="flex items-center justify-center -mt-12 mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Change Password
            </h2>
            <p className="text-gray-600">Please enter your password details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">
                  Current Password
                </Label>
                <Input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  className="mt-2 bg-gray-100 border border-black focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">
                  New Password
                </Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  className="mt-2 bg-gray-100 border border-black focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  className="mt-2 bg-gray-100 border border-black focus:bg-white"
                />
              </div>
            </div>

            <DialogFooter className="pb-6 px-0">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
