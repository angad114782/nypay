import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FaWhatsapp, FaLink } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Link, Link2 } from "lucide-react";

/**
 * Combined Contact Setting (Helpline) component
 *
 * - Single combined list (whatsapp + url) stored in `items`
 * - Both tabs ("whatsapp" and "url") show the same combined list
 * - Single radio controls which item is active (isActive true)
 * - Add dialogs open on top of the main dialog and add into the combined list
 * - Edit functionality uses the same dialogs but pre-populated with existing values
 * - Only "value" (phone or url) is shown in each row (no names/titles)
 */

const ContactSetting = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("whatsapp");

  // combined list: { _id, type: 'whatsapp'|'url', value, isActive, createdAt }
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // control add dialogs
  const [openAddWhatsapp, setOpenAddWhatsapp] = useState(false);
  const [openAddUrl, setOpenAddUrl] = useState(false);

  // edit state - store the item being edited
  const [editingItem, setEditingItem] = useState(null);

  // load dummy combined data
  const fetchItems = () => {
    setLoading(true);
    setTimeout(() => {
      const initial = [
        {
          _id: "1",
          type: "whatsapp",
          value: "+91 9876543210",
          isActive: true,
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          _id: "2",
          type: "url",
          value: "https://example.com/contact",
          isActive: false,
          createdAt: "2024-01-12T09:15:00Z",
        },
        {
          _id: "3",
          type: "whatsapp",
          value: "+91 9123456780",
          isActive: false,
          createdAt: "2024-01-10T14:20:00Z",
        },
        {
          _id: "4",
          type: "url",
          value: "https://support.example.com",
          isActive: false,
          createdAt: "2024-01-08T11:05:00Z",
        },
        {
          _id: "5",
          type: "whatsapp",
          value: "+91 9988776655",
          isActive: false,
          createdAt: "2024-01-05T16:45:00Z",
        },
        {
          _id: "6",
          type: "url",
          value: "https://help.example.com",
          isActive: false,
          createdAt: "2024-01-02T13:30:00Z",
        },
        {
          _id: "7",
          type: "whatsapp",
          value: "+91 8877665544",
          isActive: false,
          createdAt: "2023-12-30T10:00:00Z",
        },
        {
          _id: "8",
          type: "url",
          value: "https://faq.example.com",
          isActive: false,
          createdAt: "2023-12-28T09:45:00Z",
        },
        {
          _id: "9",
          type: "whatsapp",
          value: "+91 7766554433",
          isActive: false,
          createdAt: "2023-12-25T15:20:00Z",
        },
        {
          _id: "10",
          type: "url",
          value: "https://contactus.example.com",
          isActive: false,
          createdAt: "2023-12-22T12:10:00Z",
        },
        {
          _id: "11",
          type: "whatsapp",
          value: "+91 6655443322",
          isActive: false,
          createdAt: "2023-12-20T14:55:00Z",
        },
        {
          _id: "12",
          type: "url",
          value: "https://livechat.example.com",
          isActive: false,
          createdAt: "2023-12-18T11:35:00Z",
        },
        {
          _id: "13",
          type: "whatsapp",
          value: "+91 5544332211",
          isActive: false,
          createdAt: "2023-12-15T10:25:00Z",
        },
        {
          _id: "14",
          type: "url",
          value: "https://supportchat.example.com",
          isActive: false,
          createdAt: "2023-12-12T09:15:00Z",
        },
        {
          _id: "15",
          type: "whatsapp",
          value: "+91 4433221100",
          isActive: false,
          createdAt: "2023-12-10T14:05:00Z",
        },
        {
          _id: "16",
          type: "url",
          value: "https://customerservice.example.com",
          isActive: false,
          createdAt: "2023-12-08T11:55:00Z",
        },
      ];
      setItems(initial);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    if (isOpen) fetchItems();
  }, [isOpen]);

  // set a single item active (turn off others)
  const setActiveItem = (id) => {
    setItems((prev) => prev.map((it) => ({ ...it, isActive: it._id === id })));
    toast.success("Activated");
    // TODO: call backend to persist active item
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((it) => it._id !== id));
    toast.success("Deleted");
    // TODO: call backend delete
  };

  // Handle edit button click
  const handleEdit = (item) => {
    setEditingItem(item);
    if (item.type === "whatsapp") {
      setOpenAddWhatsapp(true);
    } else {
      setOpenAddUrl(true);
    }
  };

  // Called when either add dialog returns a new item (for adding)
  const handleAddItem = (newItem) => {
    const item = {
      _id: `${Date.now()}`,
      type: newItem.type,
      value: newItem.value,
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [item, ...prev]);
  };

  // Called when editing an existing item
  const handleEditItem = (updatedValue) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === editingItem._id ? { ...item, value: updatedValue } : item
      )
    );
    setEditingItem(null);
  };

  // Reset editing state when dialogs close
  const handleWhatsappDialogClose = (open) => {
    setOpenAddWhatsapp(open);
    if (!open) {
      setEditingItem(null);
    }
  };

  const handleUrlDialogClose = (open) => {
    setOpenAddUrl(open);
    if (!open) {
      setEditingItem(null);
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent
        overlayClassName={"w-full"}
        className="bg-white max-h-[90vh] overflow-hidden p-0 overflow-x-hidden"
      >
        <DialogHeader className={"hidden"}>
          <DialogTitle>Helpline</DialogTitle>
          <DialogDescription className={"hidden"}></DialogDescription>
        </DialogHeader>
        <div className="flex p-2 flex-col h-[80vh]">
          {/* Tabs header - small underline width to avoid mobile overflow */}
          <div className="flex justify-center space-x-1 h-[51px] font-medium text-[15px] text-white border-b">
            <button
              className="flex-1 transition bgt-blue2 uppercase rounded-e-[5px] relative py-3"
              onClick={() => setActiveTab("whatsapp")}
              aria-pressed={activeTab === "whatsapp"}
            >
              WHATSAPP
              {activeTab === "whatsapp" && (
                <div className="w-20 h-1.5 bg-[var(--theme-grey5)] absolute rounded-t-[5px] bottom-0 left-1/2 -translate-x-1/2" />
              )}
            </button>

            <button
              className="flex-1 transition bgt-blue2 uppercase rounded-s-[5px] relative py-3"
              onClick={() => setActiveTab("url")}
              aria-pressed={activeTab === "url"}
            >
              URL
              {activeTab === "url" && (
                <div className="w-20 h-1.5 bg-[var(--theme-grey5)] absolute rounded-t-[5px] bottom-0 left-1/2 -translate-x-1/2" />
              )}
            </button>
          </div>

          {/* content list (same combined list displayed on both tabs) */}
          <div className="flex-1 overflow-y-auto py-4 px-2">
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center text-gray-600 py-6">No items</div>
            ) : (
              items.map((it) => (
                <div
                  key={it._id}
                  className="flex rounded-lg shadow-md items-center py-2 bg-[#C7CDD9] gap-2 px-3 text-black mb-4 justify-between"
                >
                  {/* left side: icon + text. IMPORTANT: give min-w-0 so this can shrink on small screens */}
                  <div className="flex items-center gap-2 min-w-0">
                    {it.type === "whatsapp" ? (
                      <FaWhatsapp className="h-8 w-8 text-green-600" />
                    ) : (
                      <FaLink className="h-8 w-8 text-blue-600" />
                    )}

                    {/* text block must also be allowed to shrink: min-w-0 */}
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-light leading-[22px]">
                        {it.type === "whatsapp" ? "WhatsApp" : "URL"}
                      </h3>

                      {/* break-words or break-all so long urls don't push layout */}
                      <p className="text-[12px] font-light break-words break-all overflow-hidden text-ellipsis">
                        {it.value}
                      </p>
                    </div>
                  </div>

                  {/* right side: controls */}
                  <div className="flex gap-2 items-center flex-shrink-0">
                    <input
                      type="radio"
                      name="selectedHelpline"
                      checked={it.isActive}
                      onChange={() => setActiveItem(it._id)}
                      className="accent-[#0C42A8] h-6 w-6"
                    />
                    <BiEdit
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => handleEdit(it)}
                    />
                    <RiDeleteBin6Line
                      onClick={() => handleDelete(it._id)}
                      className="text-[#FF0000] h-6 w-6 cursor-pointer"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* bottom buttons */}
          <div className="px-2 space-y-2">
            <Button
              onClick={() =>
                activeTab === "whatsapp"
                  ? setOpenAddWhatsapp(true)
                  : setOpenAddUrl(true)
              }
              className="w-full bg-[#0C42A8]"
            >
              {activeTab === "whatsapp" ? <FaWhatsapp /> : <FaLink />}
              Add New {activeTab === "whatsapp" ? "WhatsApp" : "URL"}
            </Button>
            <Button onClick={onClose} className="w-full bg-[#0C42A8]">
              Done
            </Button>
          </div>
        </div>

        {/* Add/Edit dialogs controlled by parent (open on top of main dialog) */}
        <AddNewWhatsappDialog
          open={openAddWhatsapp}
          onOpenChange={handleWhatsappDialogClose}
          onSuccess={(payload) => {
            if (editingItem) {
              handleEditItem(payload);
              toast.success("WhatsApp updated");
            } else {
              handleAddItem({ type: "whatsapp", value: payload });
              toast.success("WhatsApp added");
            }
          }}
          editingItem={editingItem}
          isEditing={!!editingItem}
        />
        <AddNewUrlDialog
          open={openAddUrl}
          onOpenChange={handleUrlDialogClose}
          onSuccess={(payload) => {
            if (editingItem) {
              handleEditItem(payload);
              toast.success("URL updated");
            } else {
              handleAddItem({ type: "url", value: payload });
              toast.success("URL added");
            }
          }}
          editingItem={editingItem}
          isEditing={!!editingItem}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactSetting;

/* ---------------------------
   Add/Edit dialogs (controlled)
   --------------------------- */

const AddNewWhatsappDialog = ({
  open,
  onOpenChange,
  onSuccess,
  editingItem,
  isEditing,
}) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Pre-populate with existing value if editing
      setPhone(isEditing && editingItem ? editingItem.value : "");
      setLoading(false);
    }
  }, [open, isEditing, editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }
    setLoading(true);

    // simulate API
    setTimeout(() => {
      onSuccess(phone.trim());
      setLoading(false);
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white text-black p-0 overflow-hidden">
        <DialogHeader className={"hidden"}>
          <DialogTitle className={"hidden"}>Helpline</DialogTitle>
          <DialogDescription className={"hidden"}></DialogDescription>
        </DialogHeader>
        <div className="h-24 bg-gradient-to-r from-[#25D366] to-[#128C7E]" />
        <div className="px-6">
          <div className="flex items-center justify-center -mt-12 mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="text-center absolute top-3 left-3 mb-8">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Edit WhatsApp" : "WhatsApp"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>
            </div>

            <DialogFooter className="pb-6 px-0">
              <div className="flex gap-3 w-full">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="flex-1 bg-gray-600 text-white hover:bg-gray-700"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  disabled={loading}
                >
                  {loading
                    ? isEditing
                      ? "Updating..."
                      : "Submitting..."
                    : isEditing
                    ? "Update"
                    : "Submit"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddNewUrlDialog = ({
  open,
  onOpenChange,
  onSuccess,
  editingItem,
  isEditing,
}) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Pre-populate with existing value if editing
      setUrl(isEditing && editingItem ? editingItem.value : "");
      setLoading(false);
    }
  }, [open, isEditing, editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter URL");
      return;
    }
    setLoading(true);

    // simulate API
    setTimeout(() => {
      onSuccess(url.trim());
      setLoading(false);
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white text-black p-0 overflow-hidden">
        <DialogHeader className={"hidden"}>
          <DialogTitle className={"hidden"}>Helpline</DialogTitle>
          <DialogDescription className={"hidden"}></DialogDescription>
        </DialogHeader>
        <div className="h-24 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]" />
        <div className="px-6">
          <div className="flex items-center justify-center -mt-12 mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-50 flex items-center justify-center">
                <Link className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="text-center absolute top-3 left-3 mb-8">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Edit URL" : "URL"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">URL</Label>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>
            </div>

            <DialogFooter className="pb-6 px-0">
              <div className="flex gap-3 w-full">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="flex-1 bg-gray-600 text-white hover:bg-gray-700"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading
                    ? isEditing
                      ? "Updating..."
                      : "Submitting..."
                    : isEditing
                    ? "Update"
                    : "Submit"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
