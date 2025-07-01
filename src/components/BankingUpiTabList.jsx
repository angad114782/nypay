import { BiEdit } from "react-icons/bi";
import UPILogo from "/asset/NY Meta Logo (8) 1.svg";
import { FiDelete } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
const BankingUpiTabList = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <BankingUpiTabCard key={index} data={item} />
      ))}
    </div>
  );
};

export default BankingUpiTabList;

const BankingUpiTabCard = ({ data }) => {
  return (
    <div className="flex rounded-lg shadow-md items-center bg-[#0C42A8] gap-2 px-3 text-white mb-4 justify-between">
      <div className="flex items-center gap-2">
        <img src={UPILogo} className="size-12" alt="upi logo" />
        <div>
          <h3 className="text-[12px] font-light leading-[22px]">{data.name}</h3>
          <p className="text-[8px] font-extralight">{data.id}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {/* Edit Button */}
        <BiEdit />
        {/* Delete Button */}
        <RiDeleteBin6Line className="text-[#FF0000]" />
      </div>
    </div>
  );
};
