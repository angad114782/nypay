import React, { useEffect, useState } from "react";
import axios from "axios";
import PassbookCard from "../components/PassbookCard";
import BackWithLogo from "../components/BackWithLogo";
import logo from "/asset/event.jpg";
import { FaFilter } from "react-icons/fa";
import Footer from "../sections/Footer";
import PassBookFilter from "../sections/PassBookFilter";
import { parse, format } from "date-fns";
import { toast } from "sonner";

function Passbook() {
  const [showFilter, setShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Initial Fetch
  const fetchPassbook = async (filters = {}) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/passbook/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        }
      );

      const formattedData = res.data.data.map((item) => ({
        amount: item.amount,
        txntype: item.description,
        status: "Approved", // Optional: Add status field to Passbook model if needed
        url: "https://radheyexchange.xyz",
        dateTime: format(new Date(item.createdAt), "dd MMMM yyyy, hh:mm a"),
      }));

      setFilteredData(formattedData);
    } catch (err) {
      console.error("Passbook Fetch Error:", err);
      toast.error("Failed to fetch passbook");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassbook();
  }, []);

  console.log(filteredData, "filteredData");
  // ✅ On Filter Apply
  const handleFilter = ({ date, txntype, status }) => {
    const filters = {};
    if (date) filters.fromDate = date;
    if (txntype !== "All") filters.type = txntype;
    // Status filtering only if Passbook model supports it

    fetchPassbook(filters);
    setShowFilter(false);
  };

  return (
    <>
      <div className="pb-2">
        <div className="sticky top-0 pt-2 bg-white z-50">
          <div className="px-4">
            <BackWithLogo />
          </div>

          <div className="bgt-blue2 h-15 flex items-center justify-between px-4 text-white text-[15px]">
            <h1 className="font-semibold">Transactions</h1>
            <button
              className="flex items-center gap-2"
              onClick={() => setShowFilter(true)}
            >
              <FaFilter className="text-xs" />
              Filter
            </button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 gap-3">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <PassbookCard
                key={index}
                url={item.url}
                amount={item.amount}
                dateTime={item.dateTime}
                status={item.status}
                txntype={item.txntype}
                image={logo}
              />
            ))
          ) : (
            <p className="text-center text-sm text-gray-400 py-8">
              No matching results.
            </p>
          )}
        </div>
      </div>
      <Footer />
      {showFilter && (
        <PassBookFilter
          onClose={() => setShowFilter(false)}
          goNext={handleFilter}
        />
      )}
    </>
  );
}

export default Passbook;
