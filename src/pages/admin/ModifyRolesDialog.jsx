import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function ModifyRolesDialog({ user, onSuccess, buttonLogo }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");

  const possibleRoles = [
    "admin",
    "deposit",
    "manager",
    "withdrawal",
    "auditor",
    "createID",
  ];

  useEffect(() => {
    // Handle case when user.role is a string or undefined
    setRole(user?.role || "");
  }, [user]);

  const handleSubmit = async () => {
    try {
      const id = user._id;

      await axios.patch(
        `${import.meta.env.VITE_URL}/api/user-management/team/${id}/roles`,
        { role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Role updated successfully");
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonLogo}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Role for {user.name || user.profileName}</DialogTitle>
          <DialogDescription>Select a single role to assign</DialogDescription>
        </DialogHeader>

        {/* ✅ Radio Button Group */}
        <div className="grid grid-cols-2 gap-3 ml-auto py-4">
          {possibleRoles.map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value)}
                className="accent-[#8AAA08]" // Tailwind accent color
              />
              {r === "createID" ? "Create ID" : r.charAt(0).toUpperCase() + r.slice(1)}
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!role}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
