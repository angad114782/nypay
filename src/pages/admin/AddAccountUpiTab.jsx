import { useState } from "react";
import AddAccountUpiList from "./AddAccountUpiList";
import { AddNewUpiDialog } from "./AddNewUpiDialog";

const data = [
  {
    name: "John Doe",
    id: "john.doe@upi",
  },
  {
    name: "Jane Smith",
    id: "jane.smith@upi",
  },
  // Add more sample data as needed
  {
    name: "Alice Johnson",
    id: "alice.johnson@upi",
  },
  {
    name: "Bob Brown",
    id: "bob.brown@upi",
  },
  {
    name: "Charlie Davis",
    id: "charlie.davis@upi",
  },
  {
    name: "Diana Prince",
    id: "diana.prince@upi",
  },
  {
    name: "Ethan Hunt",
    id: "ethan.hunt@upi",
  },
  {
    name: "Fiona Gallagher",
    id: "fiona.gallagher@upi",
  },
  {
    name: "George Costanza",
    id: "george.costanza@upi",
  },
  {
    name: "Hannah Montana",
    id: "hannah.montana@upi",
  },
  {
    name: "Ian Malcolm",
    id: "ian.malcolm@upi",
  },
  {
    name: "Jack Sparrow",
    id: "jack.sparrow@upi",
  },
  {
    name: "Katherine Johnson",
    id: "katherine.johnson@upi",
  },
  {
    name: "Liam Neeson",
    id: "liam.neeson@upi",
  },
  {
    name: "Mia Wallace",
    id: "mia.wallace@upi",
  },
  {
    name: "Noah Centineo",
    id: "noah.centineo@upi",
  },
];

const AddAccountUpiTab = ({ onClose }) => {
  // const [showAddUpiModal, setShowAddUpiModal] = useState(false);
  const [selectedUpiId, setSelectedUpiId] = useState(null);

  const handleSelect = (id) => {
    setSelectedUpiId(id);
    // Optional: send `id` to backend here
    console.log("Selected UPI ID:", id);
  };

  return (
    <>
      <div>
        <div className="flex justify-between flex-col">
          <AddNewUpiDialog />
          <button
            onClick={onClose}
            className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white"
          >
            Done
          </button>
        </div>

        <AddAccountUpiList
          data={data}
          selectedUpiId={selectedUpiId}
          onSelect={handleSelect}
        />
      </div>
    </>
  );
};

export default AddAccountUpiTab;
