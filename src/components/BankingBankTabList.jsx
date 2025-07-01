import { BiEdit } from "react-icons/bi";
import { FaLandmark } from "react-icons/fa";

import { FiDelete } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
const BankingBankTabList = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <BankingBankTabCard key={index} data={item} />
      ))}
    </div>
  );
};

export default BankingBankTabList;

const BankingBankTabCard = ({ data }) => {
  return (
    <div className="flex flex-col rounded-lg shadow-md bg-[#0C42A8] gap-2 py-2  px-4 text-white mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaLandmark className="h-6 w-6" />
          <div>
            <h3 className="text-[12px] font-light leading-[22px]">
              {data.bankName}
            </h3>
            <p className="text-[8px] font-extralight">Default</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Edit Button */}
          <BiEdit />
          {/* Delete Button */}
          <RiDeleteBin6Line className="text-[#FF0000]" />
        </div>
      </div>
      <div className="flex flex-col gap-1 py-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-light min-w-[120px]">Account Holder Name</span>
          <span className="font-medium text-right break-all">
            {data.accountHolderName.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-light min-w-[120px]">Account Number</span>
          <span className="font-medium text-right break-all">
            {data.accountNumber}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-light min-w-[120px]">IFSC Code</span>
          <span className="font-medium text-right break-all">
            {data.ifscCode}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-light min-w-[120px]">Account Added On</span>
          <span className="font-medium text-right break-all">
            {data.createdAt}
          </span>
        </div>
      </div>
    </div>
  );
};
