import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  const sendVerificationOtp = async () =>{
    try{
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp")

      if(data.success){
        navigate('/email-verify')
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }

    }catch(error){
      toast.error(error.message);
    }
  }

  const logout = async ()=>
    {
      try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/logout')

        data.success && setIsLoggedin(false)
        data.success && setUserData(false)
        navigate('/')
      } catch (error) {
        toast.error(error)
      }
    }
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);
  return (
    <div className="w-full flex items-center justify-between p-4 sm:p-6 sm:px-24 absolute top-0 bg-F7EDF0">
  {/* Left: Logo */}
  <img
    src={assets.logo}
    alt="Logo"
    className="w-16 h-16 flex justify-center items-center rounded-sm"
  />

  {/* Show Navigation Links Only If Logged In */}
  {userData && (
    <div className="flex-grow flex justify-center">
      <ul className="flex font-semibold text-gray-500">
        <li
          className={`md:px-4 md:py-2 cursor-pointer ${
            location.pathname === "/" ? "text-[#F4AFAB]" : "hover:text-[#f9d4d2]"
          }`}
          onClick={() => navigate("/")}
        >
          About
        </li>
        <li
          className={`md:px-4 md:py-2 cursor-pointer ${
            location.pathname === "/basics" ? "text-[#F4AFAB]" : "hover:text-[#f9d4d2]"
          }`}
          onClick={() => navigate("/basics")}
        >
          Basics
        </li>
        <li
          className={`md:px-4 md:py-2 cursor-pointer ${
            location.pathname === "/chart" ? "text-[#F4AFAB]" : "hover:text-[#f9d4d2]"
          }`}
          onClick={() => navigate("/chart")}
        >
          Chart
        </li>
        <li
          className={`md:px-4 md:py-2 cursor-pointer ${
            location.pathname === "/row-counter" ?"text-[#F4AFAB]" : "hover:text-[#f9d4d2]"
          }`}
          onClick={() => navigate("/row-counter")}
        >
          Row Counter
        </li>
        <li
          className={`md:px-4 md:py-2 cursor-pointer ${
            location.pathname === "/yarn-calc" ? "text-[#F4AFAB]" : "hover:text-[#f9d4d2]"
          }`}
          onClick={() => navigate("/yarn-calc")}
        >
          Yarn Calculator
        </li>
        <li
          className={`md:px-4 md:py-2 cursor-pointer ${
            location.pathname === "/explore-patterns" ? "text-[#F4AFAB]" : "hover:text-[#f9d4d2]"
          }`}
          onClick={() => navigate("/explore-patterns")}
        >
          Explore Patterns
        </li>
        <li
          className={`md:px-4 md:py-2 cursor-pointer ${
            location.pathname === "/pattern-visualize" ? "text-[#F4AFAB]" : "hover:text-[#f9d4d2]"
          }`}
          onClick={() => navigate("/pattern-visualize")}
        >
          Create Patterns
        </li>
        <li
          className={`md:px-4 md:py-2 cursor-pointer ${
            location.pathname === "/view-patterns" ? "text-[#F4AFAB]" : "hover:text-[#f9d4d2]"
          }`}
          onClick={() => navigate("/view-patterns")}
        >
          View Patterns
        </li>
      </ul>
    </div>
  )}

  {/* Right: Profile Dropdown */}
  {userData ? (
    <div className="relative group">
      <div className="w-10 h-10 flex justify-center items-center rounded-full bg-[#F4AFAB] text-white cursor-pointer">
        {userData.name[0].toUpperCase()}
      </div>

      {/* Dropdown */}
      <div
        className="absolute hidden group-hover:block right-0 mt-2 w-48  divide-y  rounded-lg shadow-lg bg-[#f8bebb] divide-[#F7EDF0]"
      >
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <p className="font-semibold">{userData.name}</p>
          <p className="text-gray-500 truncate">
            {userData.email}
          </p>
        </div>
        <ul className="py-2">
          {!userData.isAccountVerified && (
            <li>
              <button
                onClick={sendVerificationOtp}
                className="block w-full text-left px-4 py-2 text-sm text-[#F7EDF0] hover:bg-[#f6c6d4]"
              >
                Verify Email
              </button>
            </li>
          )}
          <li>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-[#F7EDF0] hover:bg-[#f6c6d4] "
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
    >
      Login <img src={assets.arrow_icon} alt="" />
    </button>
  )}
</div>

  );
};

export default Navbar;
