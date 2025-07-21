// components/DrawerPanel.js
import React from "react";

function DrawerPanel({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center ">
      <div className="bgt-blue3 text-white font-medium text-[15px] rounded-t-2xl shadow-md w-full max-w-lg relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 bgt-blue2 px-3 py-3 relative t-shadow3">
          <h3 className="text-center text-white font-medium">{title}</h3>
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={onClose}
          >
            <svg width="25" height="25" viewBox="0 0 19 19" fill="none">
              <path
                d="M9.61 0.1C14.6 0.1 18.63 4.13 18.63 9.12C18.63 14.11 14.6 18.14 9.61 18.14C4.63 18.14 0.59 14.11 0.59 9.12C0.59 4.13 4.63 0.1 9.61 0.1ZM12.85 4.61L9.61 7.85L6.38 4.61L5.1 5.88L8.34 9.12L5.1 12.36L6.38 13.63L9.61 10.39L12.85 13.63L14.12 12.36L10.89 9.12L14.12 5.88L12.85 4.61Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default DrawerPanel;
