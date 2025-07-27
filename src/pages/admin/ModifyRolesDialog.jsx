// frontend/src/components/ModifyRolesDialog.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ShieldPlus } from "lucide-react";

export function ModifyRolesDialog({ user, onSuccess, buttonLogo }) {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const possibleRoles = [
    "Admin",
    "Deposit",
    "Manager",
    "Withdrawal",
    "Auditor",
    "CreateID",
  ];

  useEffect(() => {
    setRoles(user.roles);
  }, [user.roles]);

  const toggleRole = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async () => {
    try {
      const id =
        typeof user.userId === "object" ? user.userId._id : user.userId;

      await axios.patch(
        `${import.meta.env.VITE_URL}/api/user-management/team/${id}/roles`,
        { roles },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Roles updated successfully");
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update roles");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonLogo}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Roles for {user.profileName}</DialogTitle>
          <DialogDescription>Select the roles to assign</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {possibleRoles.map((role) => (
            <div key={role} className="flex items-center gap-2">
              <Checkbox
                checked={roles.includes(role)}
                onCheckedChange={() => toggleRole(role)}
                id={role}
              />
              <Label htmlFor={role}>{role}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
