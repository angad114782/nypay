import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

export default function PassbookSelectDropdown({ label, options = [], value, onChange }) {
  return (
    <div className="w-full">
      <label className="block text-sm mb-1">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full bg-gray-300 ct-black5 text-sm py-2 px-3 rounded-[10px] flex justify-between items-center h-[45px]">
            {value}
            <FaChevronDown className="text-xs" />
          </Listbox.Button>
          <Listbox.Options className="absolute bottom-full mb-2 w-full z-50 rounded-xl bgt-blue3 shadow-lg text-white text-sm overflow-y-auto p-2 t-shadow6">
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${active ? "bgt-blue2 rounded-lg" : ""}`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
