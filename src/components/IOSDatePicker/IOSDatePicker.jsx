import React, { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import Wheel from "./Wheel";
import "./IOSDatePicker.css";
import useScrollLock from "../../utils/useScrollLock";

function IOSDatePicker({ onClose, onConfirm }) {
  const dayCount = 60; // How many past days you want to show
  const dateList = Array.from({ length: dayCount }, (_, i) => subDays(new Date(), i));

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const formatDay = (i) => format(dateList[i], "eee dd LLL");

  useScrollLock(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center px-3">
      <div className="w-full bgt-blue3 text-white rounded-[10px] overflow-hidden max-w-3xl">
        {/* Header */}
        <div className="flex justify-end gap-6 px-5 py-4 text-[15px] font-medium bgt-blue2 t-shadow3 rounded-t-2xl">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              const selectedDate = new Date(dateList[selectedDayIndex]);
              selectedDate.setHours(selectedHour);
              selectedDate.setMinutes(selectedMinute);

              console.log("Confirmed Date:", selectedDate);
              onConfirm(selectedDate);
            }}
          >
            Done
          </button>
        </div>

        {/* Picker Wheels */}
        <div className="h-[180px] flex w-full">
          <div style={{ width: "50%", height: 180 }}>
            <Wheel loop length={dayCount} width={140} perspective="right" setValue={formatDay} onSelect={(index) => setSelectedDayIndex(index)} />
          </div>
          <div style={{ width: "25%", height: 180 }}>
            <Wheel loop length={24} width={23} onSelect={(index) => setSelectedHour(index)} />
          </div>
          <div style={{ width: "25%", height: 180 }}>
            <Wheel loop length={60} width={23} perspective="left" onSelect={(index) => setSelectedMinute(index)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IOSDatePicker;
