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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const DepositRejectDialog = ({ gameId, onStatusUpdated, buttonLogo }) => {
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // manage dialog open state

  const handleReject = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/deposit/admin/status/${gameId}`,
        {
          status: "Rejected",
          remark,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        onStatusUpdated(res.data.updated);
        setOpen(false); // ✅ close the dialog
        setRemark(""); // optional: clear remark field
      }
    } catch (err) {
      console.error("❌ Rejection failed:", err);
      if (err.response && err.response.status === 403) {
        toast.warning("You are not authorized to perform this action");
        return;
      }
      toast.error(err?.response?.data?.message || "Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonLogo}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject wallet deposit?</DialogTitle>
          <DialogDescription>
            Add a reason for rejecting this wallet deposit. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Enter rejection reason..."
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          rows={4}
        />

        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={loading || !remark.trim()}
          >
            {loading ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositRejectDialog;
