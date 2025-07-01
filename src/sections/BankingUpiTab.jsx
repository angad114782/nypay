import { useState } from "react";
import AddUpi from "../components/AddUpi";
import BankingUpiTabList from "../components/BankingUpiTabList";

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

const BankingUpiTab = () => {
  const [showAddUpiModal, setShowAddUpiModal] = useState(false);
  return (
    <>
      <div>
        <button
          onClick={() => setShowAddUpiModal(true)}
          className="bg-[#0C42A8] mx-auto w-full py-2 rounded-lg mb-4 text-white"
        >
          Add New UPI Details
        </button>
        <BankingUpiTabList data={data} />
      </div>
      {showAddUpiModal && <AddUpi onClose={() => setShowAddUpiModal(false)} />}
    </>
  );
};

export default BankingUpiTab;
