import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WithdrawalApproveDialog = ({
  buttonLogo,
  gameId,
  onStatusUpdated,
  handleStatusUpdate,

  loading = false,
}) => {
  const [open, setOpen] = useState(false);
  const [utr, setUtr] = useState("");

  const handleApprove = async () => {
    try {
      await handleStatusUpdate(gameId, "Approved", "Approved successfully");

      // 🔑 Ensure table updates instantly
      if (onStatusUpdated) {
        await onStatusUpdated();
      }

      setOpen(false);
      setUtr("");
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{buttonLogo}</div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Withdrawal</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <label className="text-sm font-medium">UTR Number</label>
          <Input
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="Enter UTR number (dummy for now)"
          />
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleApprove}
            disabled={!utr.trim() || loading} // require utr input
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalApproveDialog;
