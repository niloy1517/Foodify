import React, { useContext } from "react";
import { storeContext } from "../../Context/Context";

import { TiHomeOutline } from "react-icons/ti";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineReceiptLong, MdLogout } from "react-icons/md";
import { BiHelpCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { logoutUser } from "../../Service/Redux/Slice/AddToCartItemSlice";
import { setUserData } from "../../Service/Redux/Slice/UserDataSlice";

export default function ProfileDropdown() {
  const { userProfilePopup, setUserProfilePopup } = useContext(storeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

console.log(userProfilePopup) 

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/logout", {}, { withCredentials: true });
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
      onClick={() => setUserProfilePopup(false)}
      className="fixed inset-0 bg-black/60 z-20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 right-0 bg-white w-[300px] p-4"
      >
        <button className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <TiHomeOutline className="text-2xl" /> Home
        </button>
        <button onClick={() => {navigate('/profile'); setUserProfilePopup(false)}} className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <RiAccountPinBoxLine className="text-2xl" /> Profile
        </button>
        <button className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <IoNotificationsOutline className="text-2xl" /> Notification
        </button>
        <button onClick={() => {navigate('/order'); setUserProfilePopup(false)}}  className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <MdOutlineReceiptLong className="text-2xl" /> Order
        </button>
        <button className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold">
          <BiHelpCircle className="text-2xl" /> Help Center
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-3 hover:bg-orange-100 rounded font-semibold"
        >
          <MdLogout className="text-2xl" /> Logout
        </button>
      </div>
    </div>
  );
}
