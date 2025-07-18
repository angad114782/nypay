// src/components/AddOrEditPanelDialog.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, SquarePen, Trash2 } from "lucide-react";

export default function AddOrEditPanelDialog({ fetchPanels, panel }) {
  const isEdit = Boolean(panel);
  const [form, setForm] = useState({
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
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (isEdit) {
      setForm({
        profileName: panel.profileName || "",
        userId: panel.userId || "",
        password: "",
        roles: {
          admin: panel.roles?.includes("admin"),
          deposit: panel.roles?.includes("deposit"),
          manager: panel.roles?.includes("manager"),
          withdrawal: panel.roles?.includes("withdrawal"),
          auditor: panel.roles?.includes("auditor"),
          createID: panel.roles?.includes("createID"),
        },
      });
      setImage(null);
    }
  }, [panel, isEdit]);

  function handleRoleToggle(role) {
    setForm((f) => ({ ...f, roles: { ...f.roles, [role]: !f.roles[role] } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("profileName", form.profileName);
    payload.append("userId", form.userId);
    if (!isEdit || form.password) payload.append("password", form.password);
    payload.append(
      "roles",
      JSON.stringify(Object.keys(form.roles).filter((r) => form.roles[r]))
    );
    if (image) payload.append("logo", image);

    try {
      const urlBase = `${import.meta.env.VITE_URL}/api/panels/panel`;
      const tokenHeader = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };

      if (isEdit) {
        await axios.put(`${urlBase}/${panel._id}`, payload, tokenHeader);
        toast.success("Panel updated successfully!");
      } else {
        await axios.post(urlBase, payload, {
          ...tokenHeader,
          headers: {
            ...tokenHeader.headers,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Panel created successfully!");
      }
      fetchPanels();
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? "Update failed." : "Creation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      {
        <DialogTrigger
          className={`${
            !isEdit &&
            "bg-[#FAB906] text-black cursor-pointer lg:px-6 px-3 lg:py-2 lg:h-full rounded-lg hover:bg-[#fab940]"
          }`}
        >
          {isEdit ? <SquarePen /> : "Add New Panel"}
        </DialogTrigger>
      }

      <DialogContent
        // overlayClassName={"w-full"}
        className="sm:max-w-[400px] bg-white text-black p-0 overflow-hidden"
      >
        <DialogTitle className={"hidden"}></DialogTitle>
        <div className="h-24 bg-gradient-to-r relative from-[#8AAA08] -z-20 to-[#15CA5280]" />
        <div className="">
          <div className="flex items-center justify-center -mt-12 mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="text-center absolute top-3 left-3 mb-8">
            <h2 className="text-2xl font-bold text-white">
              {isEdit ? "Edit Panel/Platform" : "Add New Panel/Platform"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-8 px-6">
            <div>
              <Label className="text-gray-800 font-medium">Panel Name</Label>
              <Input
                type="text"
                value={form.profileName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, profileName: e.target.value }))
                }
                placeholder="Enter Panel Name"
                className="mt-2 bg-gray-100 border-0 focus:bg-white"
              />
            </div>

            <div>
              <Label className="text-gray-800 font-medium">Panel Link</Label>
              <Input
                type="text"
                value={form.userId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, userId: e.target.value }))
                }
                placeholder="Enter Panel Link"
                className="mt-2 bg-gray-100 border-0 focus:bg-white"
              />
            </div>

            <div>
              <Label className="text-gray-800 font-medium">
                {isEdit ? "New Password (optional)" : "Password"}
              </Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                placeholder={isEdit ? "•••••• (leave blank to keep)" : ""}
                className="mt-2 bg-gray-100 border-0 focus:bg-white"
              />
            </div>

            <div>
              <Label className="text-gray-800 font-medium">Roles</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(form.roles).map((role) => (
                  <label key={role} className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={form.roles[role]}
                      onChange={() => handleRoleToggle(role)}
                    />
                    <span className="text-sm capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-800 font-medium mb-2 block">
                Panel Logo
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-100 text-black hover:bg-gray-200 border border-gray-300 flex-1 justify-start"
                >
                  {image ? image.name : "Upload Image"}
                </Button>
                {image && (
                  <Button
                    variant="ghost"
                    onClick={() => setImage(null)}
                    className="p-2 hover:text-red-500"
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
                onChange={(e) =>
                  e.target.files[0] && setImage(e.target.files[0])
                }
              />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file?.type.startsWith("image/")) setImage(file);
                }}
                className="mt-2 border-2 border-dashed border-gray-300 p-4 rounded-md text-center text-sm text-gray-500 hover:border-blue-400 transition-colors cursor-pointer"
              >
                Drag & drop an image here
              </div>
            </div>

            <DialogFooter className="pb-6 px-0">
              <div className="flex gap-3 w-full px-6">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading
                      ? isEdit
                        ? "Updating..."
                        : "Submitting..."
                      : isEdit
                      ? "Update"
                      : "Submit"}
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
