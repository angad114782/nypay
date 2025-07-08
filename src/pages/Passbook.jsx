import React, { useState } from "react";
import PassbookCard from "../components/PassbookCard";
import BackWithLogo from "../components/BackWithLogo";
import logo from "/asset/event.jpg";
import { FaFilter } from "react-icons/fa";
import Footer from "../sections/Footer";
import PassBookFilter from "../sections/PassBookFilter";
import { isAfter, isEqual, isSameMinute, parse } from "date-fns";

const passbookData = [
  {
    url: "http://radheyexchange.xyz",
    amount: 500,
    txntype: "Deposit to Wallet",
    dateTime: "01 June 2025, 12:22 PM",
    status: "Approved",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 500,
    txntype: "Withdraw from Wallet",
    dateTime: "02 June 2025, 12:22 PM",
    status: "Pending",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 500,
    txntype: "Deposit to ID",
    dateTime: "28 May 2025, 01:22 PM",
    status: "Rejected",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 500,
    txntype: "Deposit to Wallet",
    dateTime: "01 June 2025, 12:22 PM",
    status: "Cancelled",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 750,
    txntype: "Withdraw from ID",
    dateTime: "17 June 2025, 03:45 PM",
    status: "Approved",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 300,
    txntype: "Deposit to Wallet",
    dateTime: "12 June 2025, 09:15 AM",
    status: "Pending",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 1200,
    txntype: "Withdraw from Wallet",
    dateTime: "08 June 2025, 06:10 PM",
    status: "Rejected",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 950,
    txntype: "Deposit to ID",
    dateTime: "25 May 2025, 10:00 AM",
    status: "Approved",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 300,
    txntype: "Deposit to Wallet",
    dateTime: "12 June 2025, 09:15 AM",
    status: "Pending",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 1200,
    txntype: "Withdraw from Wallet",
    dateTime: "08 June 2025, 06:10 PM",
    status: "Rejected",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 950,
    txntype: "Deposit to ID",
    dateTime: "25 May 2025, 10:00 AM",
    status: "Approved",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 300,
    txntype: "Deposit to Wallet",
    dateTime: "12 June 2025, 09:15 AM",
    status: "Pending",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 1200,
    txntype: "Withdraw from Wallet",
    dateTime: "08 June 2025, 06:10 PM",
    status: "Rejected",
  },
  {
    url: "http://radheyexchange.xyz",
    amount: 950,
    txntype: "Deposit to ID",
    dateTime: "25 May 2025, 10:00 AM",
    status: "Approved",
  },
];

function Passbook() {
  const [showFilter, setShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState(passbookData);
  const handleFilter = ({ date, txntype, status }) => {
    const filtered = passbookData.filter((item) => {
      const itemDate = parse(
        item.dateTime,
        "dd MMMM yyyy, hh:mm a",
        new Date()
      );
      const filterDate = date ? new Date(date) : null;

      const matchesDate = filterDate
        ? isAfter(itemDate, filterDate) || isSameMinute(itemDate, filterDate)
        : true;
      const matchesTxnType = txntype === "All" || item.txntype === txntype;
      const matchesStatus = status === "All" || item.status === status;

      return matchesDate && matchesTxnType && matchesStatus;
    });

    setFilteredData(filtered);
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
              onClick={() => {
                setShowFilter(true);
              }}
            >
              <FaFilter className="text-xs" />
              Filter
            </button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 gap-3">
          {filteredData.map((item, index) => (
            <PassbookCard
              key={index}
              url={item.url}
              amount={item.amount}
              dateTime={item.dateTime}
              status={item.status}
              txntype={item.txntype}
              image={logo}
            />
          ))}
          {filteredData.length === 0 && (
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
