import React from "react";
import { FaSearch } from "react-icons/fa";
import CustomSelect from "./CustomSelect";

const dropdownOptions = ["All Site", "Asia Type", "D247 Type", "Diamond Type", "Diamond99 Type", "King Type", "Lotusbook Type", "Lotusexch Type", "Radhe Type"];

const SearchBar = ({ placeholder, onSearchChange, selected, onSelect, select = false }) => {
  return (
    <div className="flex items-center bgt-blue2 p-2 rounded-[10px] w-full  space-x-2 mb-2">
      <div className="flex items-center bg-gray-300 rounded-[10px] px-3 h-[45px] flex-grow min-w-0">
        <FaSearch className="ct-black5 mr-2 w-[18px] h-[18px]" />
        <input type="text" placeholder={placeholder} className="bg-transparent outline-none text-sm text-gray-700 w-full" onChange={(e) => onSearchChange && onSearchChange(e.target.value)} />
      </div>

      {select && <CustomSelect options={dropdownOptions} selected={selected} onSelect={onSelect} />}
    </div>
  );
};

export default SearchBar;
