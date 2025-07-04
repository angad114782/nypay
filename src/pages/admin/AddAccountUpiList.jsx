import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import UPILogo from "/asset/NY Meta Logo (8) 1.svg";
const AddAccountUpiList = ({ data, selectedUpiId, onSelect }) => {
  return (
    <div>
      {data.map((item, index) => (
        <AddAccountUpiCard
          key={index}
          data={item}
          isSelected={selectedUpiId === item.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default AddAccountUpiList;

const AddAccountUpiCard = ({ data, isSelected, onSelect }) => {
  return (
    <div className="flex rounded-lg shadow-md items-center bg-[#C7CDD9] gap-2 px-3 text-black mb-4 justify-between">
      <div className="flex items-center gap-2">
        <img src={UPILogo} className="size-14" alt="upi logo" />
        <div>
          <h3 className="text-[14px] font-light leading-[22px]">{data.name}</h3>
          <p className="text-[10px] font-light">{data.id}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="radio"
          name="selectedUpi"
          checked={isSelected}
          onChange={() => onSelect(data.id)}
          className="accent-[#0C42A8] h-6 w-6"
        />
        <BiEdit className="h-6 w-6" />
        <RiDeleteBin6Line className="text-[#FF0000] h-6 w-6" />
      </div>
    </div>
  );
};
