import { BsHexagonFill } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { FaHome, FaLandmark, FaQuestionCircle, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdNotifications, MdPassword, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import MenuItem from "../components/MenuItem";
import { RiProfileFill } from "react-icons/ri";
import logonew from "/asset/latest logo.svg";
import axios from "axios";
import { useAuth } from "@/utils/AuthContext";
import { useContext, useState } from "react";
import { GlobalContext } from "@/utils/globalData";
import { User2 } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { userProfile } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You're already logged out");
        setLogoutLoading(false);
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
      setIsLoggedIn(false);
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
      alert("Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <div className="sidebar-container">
        <div
          className={`sidebar h-full bgt-blue2 text-[15px] text-white ${
            isOpen ? "open" : "closed"
          }`}
        >
          <button
            className="absolute -right-4 bgt-blue2 w-[61px] h-[61px] rounded-full flex items-center justify-end z-10"
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="me-2"
              width="7"
              height="10"
              viewBox="0 0 7 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.166707 5L5.16671 -5.09966e-08L6.33337 1.16667L2.50004 5L6.33337 8.83333L5.16671 10L0.166707 5Z"
                fill="white"
              />
            </svg>
          </button>

          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-8 py-7">
              <div>
                <img
                  src={logonew}
                  alt=""
                  className="img-fluid size-32"
                  loading="lazy"
                />

                {/* Profile Info */}
                <div className="mt-6 flex items-center justify-between gap-2">
                  <div className="p-1.5">
                    {isLoggedIn ? (
                      userProfile?.profilePic ? (
                        <img
                          src={`${import.meta.env.VITE_URL}/${
                            userProfile?.profilePic
                          }`}
                          alt=""
                          className="img-fluid h-[37px] w-[37px] rounded-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="bg-gray-300 rounded-full w-[37px] h-[37px] flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                      )
                    ) : (
                      <svg
                        width="37"
                        height="37"
                        viewBox="0 0 37 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.3333 8.29167C10.3333 6.12573 11.1937 4.04851 12.7253 2.51696C14.2568 0.985414 16.3341 0.125 18.5 0.125C20.6659 0.125 22.7432 0.985414 24.2747 2.51696C25.8063 4.04851 26.6667 6.12573 26.6667 8.29167C26.6667 10.4576 25.8063 12.5348 24.2747 14.0664C22.7432 15.5979 20.6659 16.4583 18.5 16.4583C16.3341 16.4583 14.2568 15.5979 12.7253 14.0664C11.1937 12.5348 10.3333 10.4576 10.3333 8.29167ZM10.3333 20.5417C7.62592 20.5417 5.02939 21.6172 3.11495 23.5316C1.20052 25.4461 0.125 28.0426 0.125 30.75C0.125 32.3745 0.770311 33.9324 1.91897 35.081C3.06763 36.2297 4.62555 36.875 6.25 36.875H30.75C32.3745 36.875 33.9324 36.2297 35.081 35.081C36.2297 33.9324 36.875 32.3745 36.875 30.75C36.875 28.0426 35.7995 25.4461 33.885 23.5316C31.9706 21.6172 29.3741 20.5417 26.6667 20.5417H10.3333Z"
                          fill="white"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="text-right flex-1">
                    <p className="font-bold ct-lime leading-4 text-white py-1 border-b border-gray-300">
                      {isLoggedIn
                        ? userProfile?.name || "Loading..."
                        : "Dummy User"}
                    </p>
                    <p className="text-white font-medium py-1">
                      {isLoggedIn
                        ? userProfile?.phone || "Loading..."
                        : "Dummy Number"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex flex-col space-y-5 px-8 flex-1 overflow-y-auto">
              <MenuItem
                icon={<FaHome />}
                label="Home"
                onClick={() => {
                  navigate("/");
                  setIsOpen(false);
                }}
              />
              <MenuItem
                icon={<RiProfileFill />}
                label="My Profile"
                onClick={() => {
                  navigate("/my-profile");
                  setIsOpen(false);
                }}
              />
              {isLoggedIn && (
                <MenuItem
                  icon={<MdPassword />}
                  label="Change Password"
                  onClick={() => {
                    navigate("/change-password");
                    setIsOpen(false);
                  }}
                />
              )}
              <MenuItem
                icon={<BsHexagonFill />}
                label="Rules"
                onClick={() => {
                  navigate("/rules");
                  setIsOpen(false);
                }}
              />
              <MenuItem
                icon={<MdNotifications />}
                label="Notification"
                onClick={() => navigate("/notification")}
              />
              <MenuItem
                icon={<FaLandmark />}
                label="Banking"
                onClick={() => {
                  navigate("/banking");
                  setIsOpen(false);
                }}
              />
              <MenuItem icon={<FaQuestionCircle />} label="Help" />
            </nav>

            {/* Footer */}
            <div className="mt-auto">
              <div className="border-b border-gray-300 px-8 pb-3">
                <p className="mb-2">Join us Now</p>
                <div className="flex gap-4 text-white text-xl mb-3 px-2">
                  <a href="" target="_blank">
                    <img
                      src="asset/ig.svg"
                      alt=""
                      className="img-fluid"
                      loading="lazy"
                    />
                  </a>
                  <a href="" target="_blank">
                    <img
                      src="asset/tg.svg"
                      alt=""
                      className="img-fluid"
                      loading="lazy"
                    />
                  </a>
                </div>
              </div>

              <button
                className={`flex items-center justify-center pb-14 gap-2 text-white font-bold p-4 w-full transition-all duration-200 ${
                  logoutLoading
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:opacity-90 active:scale-95"
                }`}
                onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <FiLogOut className="w-[19px] h-[19px]" />
                    <span>{isLoggedIn ? "Log Out" : "Log In"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
