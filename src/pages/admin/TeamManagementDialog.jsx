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
import { Lock, ShieldPlus, AlertCircle } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export const TeamManagementDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [teamManagementData, setTeamManagementData] = useState({
    profileName: "",
    userId: "",
    mobile: "",
    password: "",
    selectedRole: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Add state for field-specific errors

  // Reset form when dialog closes
  const resetForm = () => {
    setTeamManagementData({
      profileName: "",
      userId: "",
      mobile: "",
      password: "",
      selectedRole: "", // ✅ correct key
    });
    setErrors({}); // Clear errors when resetting form
  };

  const handleInputChange = (field, value) => {
    setTeamManagementData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
  const newErrors = {};

  if (!teamManagementData.profileName.trim()) {
    newErrors.profileName = "Profile name is required";
  }

  // ⬇️ Removed: "User ID is required" check

  if (!teamManagementData.password.trim()) {
    newErrors.password = "Password is required";
  } else if (teamManagementData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  if (!teamManagementData.selectedRole) {
    newErrors.roles = "Please select a role";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    setErrors({}); // Clear any previous errors

    const role = teamManagementData.selectedRole; // ✅ keep it exact


    const payload = {
      profileName: teamManagementData.profileName.trim(),
      userId: teamManagementData.userId.trim(),
      mobile: teamManagementData.mobile, // Send the full phone number with country code
      password: teamManagementData.password,
      role,
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

      toast.success("Team user added successfully!");
      setOpen(false);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response.status === 403) {
        toast.error("You are not authorized to perform this action");
        return;
      }
      console.error(err);

      // Handle different types of errors
      if (err.response) {
        const { status, data } = err.response;

        // Handle specific error cases
        if (status === 404 && data.message?.includes("User not found")) {
          setErrors({ userId: "User ID not found in the system" });
          toast.error("Invalid User ID - User not found in the system");
        } else if (status === 400 && data.message?.includes("already exists")) {
          setErrors({ userId: "Team user already exists with this User ID" });
          toast.error("Team user already exists with this User ID");
        } else if (
          status === 400 &&
          data.message?.includes("Invalid user ID format")
        ) {
          setErrors({ userId: "Invalid User ID format" });
          toast.error("Invalid User ID format");
        } else if (status === 400 && data.message?.includes("Invalid roles")) {
          setErrors({ roles: "Some selected roles are invalid" });
          toast.error(data.message);
        } else if (data.details && Array.isArray(data.details)) {
          // Handle validation errors with details
          toast.error(`Validation Error: ${data.details.join(", ")}`);
        } else {
          toast.error(data.message || "Error adding user");
        }
      } else if (err.request) {
        toast.error("Network error - Please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
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
          resetForm();
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
                    handleInputChange("profileName", e.target.value)
                  }
                  placeholder="Enter team member name"
                  className={`mt-2 bg-gray-100 border-0 focus:bg-white ${
                    errors.profileName ? "border border-red-500" : ""
                  }`}
                  required
                />
                {errors.profileName && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.profileName}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-800 font-medium">Email ID</Label>
                <Input
                  type="text"
                  value={teamManagementData.userId}
                  onChange={(e) => handleInputChange("userId", e.target.value)}
                  placeholder="Enter required Email ID"
                  className={`mt-2 bg-gray-100 border-0 focus:bg-white ${
                    errors.userId ? "border border-red-500" : ""
                  }`}
                />
                {errors.userId && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.userId}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-800 font-medium">
                  Mobile Number
                </Label>
                {/* PhoneInput Component */}
                <PhoneInput
                  country={"in"}
                  value={teamManagementData.mobile}
                  onChange={(value) => handleInputChange("mobile", value)}
                  inputClass={`!w-full !bg-gray-100 !border-0 !focus:bg-white !shadow-none !h-10 !rounded-md ${
                    errors.mobile ? "border border-red-500" : ""
                  }`}
                  containerClass="mt-2"
                  inputProps={{
                    name: "mobile",
                    required: true,
                    placeholder: "Enter 10-digit mobile number",
                    disabled: loading,
                  }}
                  disabled={loading}
                />
                {errors.mobile && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.mobile}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-800 font-medium">
                  Create Password
                </Label>
                <Input
                  type="password"
                  value={teamManagementData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter password (min 6 characters)"
                  className={`mt-2 bg-gray-100 border-0 focus:bg-white ${
                    errors.password ? "border border-red-500" : ""
                  }`}
                  required
                />
                {errors.password && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Roles */}
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-2">
                  <ShieldPlus className="w-4 h-4 text-black" />
                  <span className="text-sm text-black">Role Assign</span>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-auto">
                  {[
                    "admin",
                    "deposit",
                    "manager",
                    "withdrawal",
                    "auditor",
                    "createID",
                  ].map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={teamManagementData.selectedRole === role}
                        onChange={(e) =>
                          handleInputChange("selectedRole", e.target.value)
                        }
                      />
                      {role === "createID" ? "Create ID" : role}
                    </label>
                  ))}
                </div>
              </div>
              {errors.roles && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.roles}
                </div>
              )}
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
