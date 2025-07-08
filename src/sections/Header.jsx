import React, { useState, useEffect, useContext } from "react";
import Button1 from "../components/Button1";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import WalletBalance from "../components/WalletBalance";
import logonew from "/asset/Bookiehub Site.svg";
import { useAuth } from "../utils/AuthContext";
import { GlobalContext } from "../utils/globalData";

function Header() {
  const { walletBalance, setWalletBalance } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const { isLoggedIn, setIsLoggedIn } = useAuth();

  return (
    <div className="h-[56px]  relative">
      {/* Fixed header container with full width */}
      <div className="fixed top-0 left-0 w-full bg-white z-[99]">
        {/* Inner container with max-width and centered */}
        <div className="max-w-3xl mx-auto flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(true)}>
              <svg
                width="26"
                height="22"
                viewBox="0 0 26 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.2496 18.7V21.2996H0.900024V18.7H25.2496ZM25.4996 9.70001V12.2996H0.900024V9.70001H25.4996ZM25.4996 0.700012V3.29962H0.900024V0.700012H25.4996Z"
                  fill="#17191C"
                  stroke="black"
                />
              </svg>
            </button>
            <button>
              <img
                src={logonew}
                alt="logo"
                className="img-fluid mt-2 size-32"
                loading="lazy"
              />
            </button>
          </div>

          {!isLoggedIn ? (
            <div className="flex items-center gap-1">
              <Button1
                bg="bgt-black"
                color="text-white"
                text="Register"
                onclick={() => navigate("/register")}
              />
              <Button1
                bg="bgt-grey1"
                color="ct-black"
                text="Login"
                onclick={() => navigate("/login")}
              />
            </div>
          ) : (
            <div>
              <WalletBalance
                padBal="py-[4px]"
                bal={walletBalance}
                onClick={() => navigate("/wallet")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (not fixed, outside header) */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default Header;
