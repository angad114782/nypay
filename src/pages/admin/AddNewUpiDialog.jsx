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
import { Lock, PaperclipIcon, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const AddNewUpiDialog = ({ onAdd }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [teamManagementData, setTeamManagementData] = useState({
    upiHolderName: "",
    upiId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("upiName", teamManagementData.upiHolderName);
      formData.append("upiId", teamManagementData.upiId);
      if (image) formData.append("qrImage", image);

      await axios.post(
        `${import.meta.env.VITE_URL}/api/admin/upi/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("UPI added successfully");
      onAdd(); // ✅ Refetch UPI list
      setOpen(false); // ✅ Close dialog
      // Reset form
      setTeamManagementData({ upiHolderName: "", upiId: "" });
      setImage(null);
      fileInputRef.current.value = "";
      setOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.warning("You are not authorized to perform this action");
        return;
      }
      console.error("❌ UPI Add Error:", error);
      toast.error("❌ Failed to add UPI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white">
        Add New UPI Details
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
            <h2 className="text-2xl font-bold text-white">
              Add New UPI Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">UPI Name</Label>
                <Input
                  type="text"
                  name="upiHolderName"
                  value={teamManagementData.upiHolderName}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      upiHolderName: e.target.value,
                    })
                  }
                  placeholder="Enter UPI name"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">UPI ID</Label>
                <Input
                  type="text"
                  name="upiId"
                  value={teamManagementData.upiId}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      upiId: e.target.value,
                    })
                  }
                  placeholder="Enter UPI ID"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-800 font-medium mb-2 block">
                  Upload UPI QR Code Image
                </Label>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 text-black hover:bg-gray-200 border items-center justify-start border-gray-300 flex-1"
                  >
                    <PaperclipIcon className="mr-2" />
                    {image ? image.name : "Upload Image"}
                  </Button>

                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-2 hover:text-red-500"
                      onClick={() => {
                        setImage(null);
                        fileInputRef.current.value = "";
                      }}
                      title="Remove Image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setImage(file);
                  }}
                />

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith("image/")) {
                      setImage(file);
                    }
                  }}
                  className="mt-2 border-2 border-dashed border-gray-300 p-4 rounded-md text-center text-sm text-gray-500 hover:border-blue-400 transition-colors cursor-pointer"
                >
                  Drag & drop an image here
                </div>
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
