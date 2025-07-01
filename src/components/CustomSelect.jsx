import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";

const CustomSelect = ({ options = [], onSelect }) => {
  const [selected, setSelected] = useState(options[0]);
  const [open, setOpen] = useState(false);
  const spanRef = useRef(null);
  const [width, setWidth] = useState(0);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    if (onSelect) onSelect(option);
  };

  // Measure the width of the selected option text
  useEffect(() => {
    if (spanRef.current) {
      const calculatedWidth = spanRef.current.offsetWidth + 40; // padding + icon
      setWidth(calculatedWidth);
    }
  }, [selected]);

  return (
    <div className="relative text-sm font-medium text-nowrap" style={{ width: `${width}px` }}>
      {/* Hidden span for measuring width */}
      <span ref={spanRef} className="invisible absolute whitespace-nowrap text-sm font-medium">
        {selected}
      </span>

      <button onClick={() => setOpen(!open)} className="text-white flex items-center justify-between w-full">
        <span className="truncate">{selected}</span>
        <IoIosArrowDown className={`ml-2 transform transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="absolute top-full mt-6 right-0 bgt-blue3 text-white rounded-[10px] shadow-lg z-50 min-w-full p-1.5">
          {options.map((option) => (
            <li key={option} onClick={() => handleSelect(option)} className={`p-2 cursor-pointer flex justify-between items-center ${selected === option ? "bgt-blue2 rounded-[10px]" : ""}`}>
              {option}
              {selected === option && <IoMdCheckmark className="text-white text-base" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
