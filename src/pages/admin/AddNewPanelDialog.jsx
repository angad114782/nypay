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

export const AddNewPanelDialog = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare final payload
    const payload = {
      profileName: teamManagementData.profileName,
      userId: teamManagementData.userId,
      password: teamManagementData.password,
      roles: Object.keys(teamManagementData.roles).filter(
        (role) => teamManagementData.roles[role]
      ),
    };

    console.log("Submitting data to backend:", payload);

    // Simulate API
    setTimeout(() => {
      setLoading(false);
      alert("Submitted successfully!");
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-[#FAB906] text-black cursor-pointer lg:px-6 px-3 lg:py-2 lg:h-full rounded-lg hover:bg-[#fab940]">
        Add New Panel
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
            <h2 className="text-2xl font-bold text-white">
              Add New Panel/Platform
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">Panel Name</Label>
                <Input
                  type="text"
                  name="profileName"
                  value={teamManagementData.profileName}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      profileName: e.target.value,
                    })
                  }
                  placeholder="Enter team member name"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">Panel Link</Label>
                <Input
                  type="text"
                  name="teamUserId"
                  value={teamManagementData.userId}
                  onChange={(e) =>
                    setTeamManagementData({
                      ...teamManagementData,
                      userId: e.target.value,
                    })
                  }
                  placeholder="Enter required user ID"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-800 font-medium mb-2 block">
                  Panel Logo
                </Label>

                {/* Trigger Upload Button */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 text-black hover:bg-gray-200 border items-center justify-start border-gray-300 flex-1"
                  >
                    <PaperclipIcon /> {image ? image.name : "Upload Image"}
                  </Button>

                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-2 hover:text-red-500"
                      onClick={() => {
                        setImage(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      title="Remove Image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                {/* Hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                    }
                  }}
                />

                {/* Drag-and-drop area */}
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
