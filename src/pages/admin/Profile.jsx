import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Logo from "/asset/logo.png";
import PhoneInput from "react-phone-input-2";

export const ProfileEditDialog = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    contactNo: "",
    email: "",
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-0 bg-white text-black overflow-hidden">
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <div className="h-24 bg-gradient-to-r from-[#8AAA08] to-[#15CA5280]" />

        <div className="px-6">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="flex items-center justify-between -mt-10 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                  <img
                    src={Logo || ""}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md bg-white hover:bg-gray-50"
                    onClick={handleImageClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {formData.fullName || "Admin"}
                </h2>
                <p className="text-gray-600">Admin</p>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">Full Name</Label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Your Full Name"
                  className="mt-2 bg-gray-100 h-[48px] border rounded-lg border-black focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">
                  Contact Number
                </Label>
                <div className="mt-2 focus-within:shadow focus-within:shadow-gray-300 rounded-lg">
                  <PhoneInput
                    country="in"
                    value={formData.contactNo}
                    onChange={(value) =>
                      setFormData({ ...formData, contactNo: value })
                    }
                    inputStyle={{
                      width: "100%",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: "white",
                      border: "1px solid black",
                      paddingLeft: "48px",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: "none",
                    }}
                    buttonStyle={{
                      border: "none",
                      backgroundColor: "transparent",
                      borderRadius: "12px 0 0 12px",
                      boxShadow: "none",
                      padding: "4px",
                    }}
                    dropdownStyle={{
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                    }}
                    containerStyle={{
                      width: "100%",
                    }}
                    inputProps={{
                      name: "phone",
                      required: true,
                      placeholder: "Mobile WhatsApp Number",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-800 font-medium">
                  Email Address
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Your Email Address"
                  className="mt-2 bg-gray-100 border-black border h-[48px] focus:bg-white"
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
                >
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
