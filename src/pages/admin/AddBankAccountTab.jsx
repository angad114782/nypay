import { useState } from "react";
import { AddAccountBankTabList } from "./AccountSetting";
import { AddNewBankDialog } from "./AddNewBankDialog";

const data = [
  {
    bankName: "Bank of America",
    accountNumber: "1234567890",
    holderName: "John Doe",
    ifscCode: "BOFAUS3N",
    accountHolderName: "John Doe",
    createdAt: "2023-10-01",
  },
  {
    bankName: "Chase Bank",
    accountNumber: "0987654321",
    holderName: "Jane Smith",
    ifscCode: "CHASUS33",
    accountHolderName: "Jane Smith",
    createdAt: "2023-10-02",
  },
  {
    bankName: "Wells Fargo",
    accountNumber: "1122334455",
    holderName: "Alice Johnson",
    ifscCode: "WFBIUS6S",
    accountHolderName: "Alice Johnson",
    createdAt: "2023-10-03",
  },
  {
    bankName: "Citibank",
    accountNumber: "5566778899",
    holderName: "Bob Brown",
    ifscCode: "CITIUS33",
    accountHolderName: "Bob Brown",
    createdAt: "2023-10-04",
  },
  {
    bankName: "PNC Bank",
    accountNumber: "2233445566",
    holderName: "Charlie Davis",
    ifscCode: "PNCCUS33",
    accountHolderName: "Charlie Davis",
    createdAt: "2023-10-05",
  },
  {
    bankName: "Capital One",
    accountNumber: "3344556677",
    holderName: "Diana Prince",
    ifscCode: "CAPLUS33",
    accountHolderName: "Diana Prince",
    createdAt: "2023-10-06",
  },
  {
    bankName: "TD Bank",
    accountNumber: "4455667788",
    holderName: "Ethan Hunt",
    ifscCode: "TDUS33N",
    accountHolderName: "Ethan Hunt",
    createdAt: "2023-10-07",
  },
  {
    bankName: "US Bank",
    accountNumber: "55667788990",
    holderName: "Fiona Gallagher",
    ifscCode: "USBKUS33",
    accountHolderName: "Fiona Gallagher",
    createdAt: "2023-10-08",
  },
];

const AddAccountBankTab = ({ onClose }) => {
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);

  const handleSelect = (id) => {
    setSelectedAccountNumber(id);
    // Optional: send `id` to backend here
    console.log("Selected Account Number:", id);
  };
  return (
    <>
      <div>
        <div className="flex justify-between  flex-col">
          <AddNewBankDialog />
          <button
            onClick={onClose}
            className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white"
          >
            Done
          </button>
        </div>

        <AddAccountBankTabList
          data={data}
          selectedAccountNumber={selectedAccountNumber}
          onSelect={handleSelect}
        />
      </div>
    </>
  );
};

export default AddAccountBankTab;
