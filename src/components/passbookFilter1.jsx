import React, { useState } from "react";
import PassbookSelectDropdown from "./PassbookSelectDropdown";
import DatePicker from "./DatePicker";
import IOSDatePicker from "./IOSDatePicker/IOSDatePicker.jsx";
import { format } from "date-fns";

const PassbookFilter1 = ({ onClose, goNext }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [txntype, setTxntype] = useState("All");
  const [status, setStatus] = useState("All");

  const handleConfirm = (values) => {
    setSelectedDate(values);
    setShowPicker(false);
  };

  const handleSubmit = () => {
    goNext({
      date: selectedDate,
      txntype,
      status,
    });
  };

  return (
    <>
      <div className="bgt-blue3 text-white font-medium text-[15px] rounded-2xl shadow-md w-full relative max-w-3xl" >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-1 bgt-blue2 px-3 py-3 relative t-shadow3 rounded-t-2xl">
          <h3 className="text-center text-white font-medium">Filter</h3>
          <button className="absolute top-1/2 right-3 -translate-y-1/2" onClick={onClose}>
            {/* Close Icon */}
            <svg width="25" height="25" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.61396 0.101318C14.6015 0.101318 18.6329 4.13281 18.6329 9.12031C18.6329 14.1078 14.6015 18.1393 9.61396 18.1393C4.62646 18.1393 0.594971 14.1078 0.594971 9.12031C0.594971 4.13281 4.62646 0.101318 9.61396 0.101318ZM12.8518 4.61081L9.61396 7.84863L6.37614 4.61081L5.10446 5.88249L8.34228 9.12031L5.10446 12.3581L6.37614 13.6298L9.61396 10.392L12.8518 13.6298L14.1235 12.3581L10.8856 9.12031L14.1235 5.88249L12.8518 4.61081Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* From Date */}
          <div>
            <label className="block text-sm mb-1">From</label>
            <button className="flex items-center bg-gray-300 rounded-[10px] h-[45px] px-3 py-2 ct-black w-full" onClick={() => setShowPicker(true)}>
              <span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17 2H15V1C15 0.734784 14.8946 0.48043 14.7071 0.292893C14.5196 0.105357 14.2652 0 14 0C13.7348 0 13.4804 0.105357 13.2929 0.292893C13.1054 0.48043 13 0.734784 13 1V2H7V1C7 0.734784 6.89464 0.48043 6.70711 0.292893C6.51957 0.105357 6.26522 0 6 0C5.73478 0 5.48043 0.105357 5.29289 0.292893C5.10536 0.48043 5 0.734784 5 1V2H3C2.20435 2 1.44129 2.31607 0.87868 2.87868C0.316071 3.44129 0 4.20435 0 5V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V5C20 4.20435 19.6839 3.44129 19.1213 2.87868C18.5587 2.31607 17.7956 2 17 2ZM18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V10H18V17ZM18 8H2V5C2 4.73478 2.10536 4.48043 2.29289 4.29289C2.48043 4.10536 2.73478 4 3 4H5V5C5 5.26522 5.10536 5.51957 5.29289 5.70711C5.48043 5.89464 5.73478 6 6 6C6.26522 6 6.51957 5.89464 6.70711 5.70711C6.89464 5.51957 7 5.26522 7 5V4H13V5C13 5.26522 13.1054 5.51957 13.2929 5.70711C13.4804 5.89464 13.7348 6 14 6C14.2652 6 14.5196 5.89464 14.7071 5.70711C14.8946 5.51957 15 5.26522 15 5V4H17C17.2652 4 17.5196 4.10536 17.7071 4.29289C17.8946 4.48043 18 4.73478 18 5V8Z"
                    fill="#4B4646"
                  />
                </svg>
              </span>
              <input
                type="text"
                className="bg-transparent w-full text-sm outline-none px-3 ct-black5"
                readOnly
                placeholder="Select a date"
                value={selectedDate ? format(selectedDate, "dd MMMM yyyy, hh:mm a") : ""}
              />
            </button>
          </div>

          {/* Select Dropdowns */}
          <PassbookSelectDropdown label="Transaction Type" options={["All", "Deposit to Wallet", "Withdraw from Wallet", "Deposit to ID"]} value={txntype} onChange={setTxntype} />

          <PassbookSelectDropdown label="Status" options={["All", "Pending", "Approved", "Rejected", "Cancelled"]} value={status} onChange={setStatus} />
          {/* <PassbookSelectDropdown label="IDs" options={["All", "ID1", "ID2", "ID3"]} /> */}

          {/* Submit Button */}
          <button className="bgt-blue2 rounded-[10px] px-6 py-2.5 w-full t-shadow5 mt-5 mb-1" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {/* iOS Date Picker */}
      {showPicker && <IOSDatePicker onClose={() => setShowPicker(false)} onConfirm={handleConfirm} />}
    </>
  );
};

export default PassbookFilter1;
