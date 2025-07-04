import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Camera, Copy } from "lucide-react";
import Logo from "/asset/logo.png";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export const MessageCounterDialog = ({ isOpen, onClose }) => {
  // Example: extract the current value from "504/10000"
  const cycleValue = 2600; // Replace with dynamic value if needed
  const cycleMax = 10000;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-0 bg-white text-black overflow-hidden">
        <DialogTitle className="h-16 bg-gradient-to-r p-4 from-[#8AAA08] to-[#15CA5280]">
          Message Counter
        </DialogTitle>
        <DialogDescription className="hidden" />

        <div className="px-6">
          <form>
            {/* Stats Section */}
            <div className="flex justify-around gap-16">
              <div className="flex items-center flex-col gap-2 text-center">
                <div className="font-bold">Today</div>
                <span className="text-[#FF6411] text-xl font-bold">2</span>
              </div>
              <div className="flex items-center flex-col gap-2 text-center">
                <div className="font-bold">This Cycle</div>
                <span className="text-[#FF6411] text-xl font-bold">
                  {cycleValue}/{cycleMax}
                </span>
              </div>
            </div>
            <div className="mx-14">
              <Slider
                className={"my-3 h-10 "}
                value={[cycleValue]}
                max={cycleMax}
                step={1}
                // disabled
              />
            </div>
            {/* List Items Section */}
            <div className="flex flex-col gap-3 my-6 mx-14">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm">OTP</span>
                <span className="text-sm font-bold">1000</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm">New ID Request</span>
                <span className="text-sm font-bold">1000</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm">New ID Update</span>
                <span className="text-sm font-bold">1000</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm">Deposit Request</span>
                <span className="text-sm font-bold">1000</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm">Deposit Update</span>
                <span className="text-sm font-bold">1000</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm">Withdrawal Request</span>
                <span className="text-sm font-bold">1000</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm">Withdrawal Update</span>
                <span className="text-sm font-bold">1000</span>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
