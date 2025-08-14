import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const EditGameIdDialog = ({
  gameId,
  initialUsername = "",
  initialPassword = "",
  onUpdated = () => {},
  buttonLogo, // optional custom trigger button
}) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // keep form values in sync if props change
  useEffect(() => {
    if (open) return; // don't override while editing
    setUsername(initialUsername);
    setPassword(initialPassword);
  }, [initialUsername, initialPassword, open]);

  const isDirty = useMemo(() => {
    return (
      username.trim() !== (initialUsername || "").trim() ||
      password !== (initialPassword || "")
    );
  }, [username, password, initialUsername, initialPassword]);

  const handleSave = async () => {
    if (!username.trim() || !password) {
      toast.error("Username and password are required");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/game/update/${gameId}`,
        { username: username.trim(), password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // controller returns { success, message, gameId: updated }
      const updated = res.data?.gameId || res.data?.updated;
      toast.success("Credentials updated");

      // let parent update local state (e.g., table row)
      onUpdated?.(updated);

      setOpen(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to update credentials.";
      toast.error(msg);
      console.error("❌ Edit credentials failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonLogo ? (
          buttonLogo
        ) : (
          <Button variant="outline" size="sm" className="gap-1">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Credentials</DialogTitle>
          <DialogDescription>
            Update the username and password for this Game ID.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={loading || !isDirty || !username.trim() || !password}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGameIdDialog;
