import React, { useContext } from "react";
import { storeContext } from "../../Context/Context";

import { TiHomeOutline } from "react-icons/ti";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineReceiptLong, MdLogout } from "react-icons/md";
import { BiHelpCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../Service/Redux/Slice/AddToCartItemSlice";
import { setUserData } from "../../Service/Redux/Slice/UserDataSlice";
import { axiosInstance } from "../../Api/axiosInstance";

export default function ProfileDropdown() {
  const { setIsDropdownMenu, setIsOverlay } = useContext(storeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/user/logout", {});
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUserData(""));
        dispatch(logoutUser());
        setUserProfilePopup(false);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  

  return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-22 right-10 bg-white w-[300px] p-4 rounded-[10px] shadow-2xl border border-gray-200 `}
      >
        <button onClick={() => {navigate('/restaurants'); setIsDropdownMenu(false); setIsOverlay(false)}}  className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <TiHomeOutline className="text-2xl" /> Home
        </button>
        <button onClick={() => {navigate('/profile'); setIsDropdownMenu(false); setIsOverlay(false)}} className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <RiAccountPinBoxLine className="text-2xl" /> Profile
        </button>
        <button onClick={() => { setIsDropdownMenu(false); setIsOverlay(false)}} className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <IoNotificationsOutline className="text-2xl" /> Notification
        </button>
        <button onClick={() => {navigate('/order'); setIsDropdownMenu(false); setIsOverlay(false)}}  className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <MdOutlineReceiptLong className="text-2xl" /> Order
        </button>
        <button onClick={() => { setIsDropdownMenu(false); setIsOverlay(false)}} className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <BiHelpCircle className="text-2xl" /> Help Center
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold"
        >
          <MdLogout className="text-2xl" /> Logout
        </button>
      </div>
  );
}
