import React from "react";
import { useNavigate } from "react-router-dom";

function BackWithLogo() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-6">
      <button onClick={() => navigate("/")}>
        <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.541708 9.5L9.29171 0.75L11.3334 2.79167L4.62504 9.5L11.3334 16.2083L9.29171 18.25L0.541708 9.5Z" fill="black" />
        </svg>
      </button>
      <img src="asset/ny-pay.svg" alt="NY-Pay Logo" className="mt-4" />
    </div>
  );
}

export default BackWithLogo;
