import React from "react";

function Banner() {
  return (
    <div className="relative">
      <img src="/asset/banner.png" alt="" className="min-w-full" />
      <div className="absolute top-2/5 left-5 text-white">
        <p className="text-xl">
          No. 1 Payment Platform <br></br>Free Sign up
        </p>
        <button className="flex items-center gap-2 mt-1.5">
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.989848 8H12.7344L9.13828 12.36C8.78787 12.784 8.84528 13.415 9.26498 13.768C9.68566 14.122 10.3093 14.064 10.6597 13.64L15.6089 7.64C15.6475 7.593 15.6663 7.538 15.695 7.486C15.7188 7.444 15.7475 7.408 15.7653 7.362C15.8099 7.247 15.8366 7.126 15.8366 7.004C15.8366 7.003 15.8376 7.001 15.8376 7C15.8376 6.999 15.8366 6.997 15.8366 6.996C15.8366 6.874 15.8099 6.753 15.7653 6.638C15.7475 6.592 15.7188 6.556 15.695 6.514C15.6663 6.462 15.6475 6.407 15.6089 6.36L10.6597 0.36C10.4627 0.123 10.1816 0 9.89848 0C9.67477 0 9.45008 0.076 9.26498 0.232C8.84528 0.585 8.78787 1.216 9.13828 1.64L12.7344 6H0.989848C0.443452 6 0 6.448 0 7C0 7.552 0.443452 8 0.989848 8"
              fill="white"
              fillOpacity="0.5"
            />
          </svg>
          <span className="text-[15px] font-semibold text-white/50">Bet Now</span>
        </button>
      </div>
    </div>
  );
}

export default Banner;
