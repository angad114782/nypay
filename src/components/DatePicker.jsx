import React, { useState, useRef, useEffect } from "react";
import { format, addDays } from "date-fns";
import { FixedSizeList as List } from "react-window";
import "./css/DatePicker.css";

// === Global Config ===
const ITEM_HEIGHT = 40;
const SELECTION_OFFSET = 90; 

const daysInYear = (year) => (new Date(year, 1, 29).getMonth() === 1 ? 366 : 365);
const generateDateList = () => {
  const startDate = new Date("2025-01-01");
  const totalDays = daysInYear(2025);
  return Array.from({ length: totalDays }, (_, i) => format(addDays(startDate, i), "EEE dd MMM"));
};

const hourList = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const minuteList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

function DatePicker({ onClose, onConfirm }) {
  const dateList = generateDateList();
  const [day, setDay] = useState(dateList[0]);
  const [hour, setHour] = useState(hourList[9]);
  const [minute, setMinute] = useState(minuteList[30]);

  const refHour = useRef();
  const refMinute = useRef();

  const scrollToSelected = (ref, list, value) => {
    const index = list.indexOf(value);
    if (ref.current && index !== -1) {
      ref.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: "auto" });
    }
  };

  useEffect(() => {
    scrollToSelected(refHour, hourList, hour);
    scrollToSelected(refMinute, minuteList, minute);
  }, []);

  useEffect(() => {
  // Extract actual date (e.g., "Tue 14 Jan") to full Date format for logging
  const parsedDate = new Date(`2025 ${day.split(" ")[1]} ${day.split(" ")[2]} ${hour}:${minute}`);

  console.log("Selected DateTime:", {
    day,
    hour,
    minute,
    fullDateTimeString: `${day} ${hour}:${minute}`,
    jsDateObject: parsedDate
  });
}, [day, hour, minute]);


  const handleScroll = (ref, list, setter) => {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const index = Math.round((scrollTop + SELECTION_OFFSET - ITEM_HEIGHT / 2) / ITEM_HEIGHT);
    const value = list[index];
    if (value) setter(value);
  };

  const Row = ({ data, index, style }) => {
    const item = data[index];
    const isActive = item === day;
    return (
      <div
        style={style}
        className={`h-10 z-12 flex items-center justify-center snap-center transition-transform ${
          isActive ? "text-red-600 scale-110" : "text-gray-300"
        }`}
      >
        {item}
      </div>
    );
  };

  const handleDayScroll = ({ scrollOffset }) => {
    const index = Math.round((scrollOffset + SELECTION_OFFSET - ITEM_HEIGHT / 2) / ITEM_HEIGHT);
    const value = dateList[index];
    if (value && value !== day) {
      setDay(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center px-3">
      <div className="w-full bg-blue-600 text-white rounded-t-xl overflow-hidden">
        <div className="flex justify-between px-4 py-3 text-sm font-medium bg-blue-700">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onConfirm({ day, hour, minute })}>Done</button>
        </div>

        <div className="relative flex h-[150px] overflow-hidden perspective-1000 px-5">
          {/* Highlight overlay */}
          <div
            className="absolute w-9/10 left-1/2 top-1/2 -translate-1/2 h-[40px] z-10 pointer-events-none bgt-blue2 rounded-[10px]"
          />

          {/* Day Picker */}
          <div className="z-20 w-2/4 h-full">
            <List
              height={150}
              itemCount={dateList.length}
              itemSize={ITEM_HEIGHT}
              width="100%"
              itemData={dateList}
              onScroll={handleDayScroll}
            >
              {({ index, style, data }) => <Row index={index} style={style} data={data} />}
            </List>
          </div>

          {/* Hour Picker */}
          <div
            ref={refHour}
            className="w-1/4 h-full overflow-y-scroll snap-y snap-mandatory text-center picker-column z-20"
            onScroll={() => handleScroll(refHour, hourList, setHour)}
          >
            {hourList.map((item, idx) => (
              <div
                key={idx}
                className={`h-10 flex items-center justify-center snap-center transition-transform ${
                  item === hour ? "text-red-600 scale-110" : "text-gray-300"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Minute Picker */}
          <div
            ref={refMinute}
            className="w-1/4 h-full overflow-y-scroll snap-y snap-mandatory text-center picker-column z-20"
            onScroll={() => handleScroll(refMinute, minuteList, setMinute)}
          >
            {minuteList.map((item, idx) => (
              <div
                key={idx}
                className={`h-10 flex items-center justify-center snap-center transition-transform ${
                  item === minute ? "text-red-600 scale-110" : "text-gray-300"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatePicker;
