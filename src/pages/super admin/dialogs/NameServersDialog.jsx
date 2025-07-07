import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "/asset/forgot-password-icon-27 1.svg";
const WhatsappApiDialog = () => {
  const [server1, setserver1] = useState("");
  const [server2, setserver2] = useState("");
  return (
    <Dialog>
      <DialogTrigger className="h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-sm text-white px-3 rounded-lg">
        Manage
      </DialogTrigger>
      <DialogContent className={"p-0 overflow-hidden bg-white text-black"}>
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <div className="h-16 bg-gradient-to-r from-[#8AAA08] to-[#15CA5280]" />

        <div className="flex justify-center">
          <img src={logo} alt="" />
        </div>
        <div className="p-4 flex flex-col gap-4">
          <Label>Name Servers</Label>
          <Input
            className={"border border-black"}
            type={"text"}
            placeholder="Enter Server 1"
            value={server1}
            onChange={(e) => setserver1(e.target.value)}
          />
          <Input
            className={"border border-black"}
            type={"text"}
            placeholder="Enter Server 2"
            value={server2}
            onChange={(e) => setserver2(e.target.value)}
          />
        </div>
        <DialogFooter className="p-4">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              //   onClick={onClose}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsappApiDialog;
