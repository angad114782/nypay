import React from "react";

export default function ExCard({logo, logoName, onclickID, username, onclickdesposit, onclickwithdraw}) {
  return (
    <div className="bgt-black2 rounded-xl py-3 px-2 min-w-[175px] text-white shadow-md space-y-3 text-[10px] font-light">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img src={`/asset/${logo}`} alt="logo" className="w-[37px] h-[37px]" />
          <div>
            <p className="">{logoName}</p>
          </div>
        </div>
        <button onClick={onclickID}>
          <img src="/asset/exlink.png" className="img-fluid" />
        </button>
      </div>

      {/* Username */}
      <div className="flex items-center gap-2 px-2">
        <img src="/asset/user.png" className="img-fluid" />
        <span className="">{username}</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-3">
        <button className="flex-1 bgt-black3 rounded-lg py-3 flex flex-col items-center gap-2" onClick={onclickdesposit} >
          <img src="/asset/out.png" alt="Deposit" className="img-fluid" />
          <span className="">Deposit</span>
        </button>
        <button className="flex-1 bgt-black3 rounded-lg py-3 flex flex-col items-center gap-1" onClick={onclickwithdraw} >
          <img src="/asset/in.png" alt="Withdraw" className="img-fluid" />
          <span className="">Withdraw</span>
        </button>
      </div>
    </div>
  );
}
