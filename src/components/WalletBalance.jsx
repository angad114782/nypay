import React from 'react';

function WalletBalance({ title, bal, onClick, padBal }) {
  return (
    <button
      className="bgt-black w-full rounded-full flex items-center p-1 ps-6"
      onClick={onClick}
    >
      <img src="/wallet.svg" alt="" className="relative -top-0.5 me-3" />

      {title && (
        <p className="font-medium text-white">{title}</p>
      )}

      {bal && (
        <div
          className={`font-semibold text-sm ${padBal ? padBal : 'py-[10px]'} px-4 bgt-grey1 ct-black rounded-full ms-auto`}
        >
          {bal}
        </div>
      )}
    </button>
  );
}

export default WalletBalance;
