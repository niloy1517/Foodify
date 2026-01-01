import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { IoMdImages } from "react-icons/io";
import { TiArrowUnsorted } from "react-icons/ti";
import { storeContext } from '../Context/Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
  const { SERVER_URL, userProfileData } = useContext(storeContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('+880 ');
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  

  const [dateOfBirth, setDateOfBirth] = useState({
    month: '',
    date: '',
    year: ''
  })

  
  const [image, setImage] = useState({
    image: '',
    imageFile: null
  });

  console.log(image)

  const [openDropdown, setOpenDropdown] = useState(null);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const years = [];
  const days = [];

  for (let y = 1900; y <= new Date().getFullYear(); y++) years.push(y);
  for (let d = 1; d <= 31; d++) days.push(d);

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({
        image: URL.createObjectURL(file),
        imageFile: file
      });
    }
  };

  useEffect(() => {
    if (userProfileData) {
      const { name, email, username, phone, address, dateOfBirth, gender, image } = userProfileData;
      setName(name);
      setEmail(email);
      setUsername(username);
      setPhone(phone);
      setGender(gender);
      setAddress(address);
      if (dateOfBirth) {
        let dob = JSON.parse(dateOfBirth)
        setMonth(dob.month)
        setDate(dob.date)
        setYear(dob.year)
        setDateOfBirth(dob)
      }
      setImage({
        image: image || '',
        imageFile: null
      });
    }
  }, [userProfileData]);



  const handleUpdateUserData = async (e) => {
    e.preventDefault();

    const updateDob = ({...dateOfBirth, month, date, year})
    
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('username', username);
    formData.append('dateOfBirth', JSON.stringify(updateDob))
    formData.append('gender', gender);
    formData.append('address', address);

    if(image.imageFile) {
      formData.append('image', image.imageFile);
    }

    try {
      const response = await axios.put(
        `${SERVER_URL}/api/user/update/profile`,
        formData,
        {
          withCredentials: true,
        }
      );
      
      if(response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Something is wrong please try again')
    }
  };

  // Custom Dropdown Component 
  const CustomDropdown = ({ label, options, value, setValue, id }) => {
    return (
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
          className="w-full h-12 px-3 text-left border border-gray-300 bg-white flex justify-between items-center rounded-[4px] hover:border-orange-500 transition-all"
        >
          <span>{value || label}</span>
          <TiArrowUnsorted className="text-gray-600" />
        </button>

        {openDropdown === id && (
          <div className="absolute z-50 bg-white w-full mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {options.map((opt, index) => (
              <div
                key={index}
                onClick={() => {
                  setValue(opt);
                  setOpenDropdown(null);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-orange-100 ${value === opt ? 'bg-orange-50 text-orange-600 font-medium' : ''
                  }`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-auto p-16 text-gray-700">
      <ToastContainer />
      <h1 className="text-2xl font-medium">Manage Your Account</h1>
      <form onSubmit={handleUpdateUserData}>
        <div className="flex items-center py-6 space-x-20">
          <img
            className="w-40 h-40 rounded-full mr-20 border-2 border-gray-200 object-cover"
            src={image.imageFile ? image.image : `${SERVER_URL}/images/${image.image}` || assets.profile_pic}
            alt="profile"
          />
          <div className="flex space-x-4 relative">
            <input
              className="relative z-10 h-14 w-50 opacity-0 cursor-pointer"
              type="file"
              onChange={uploadImage}
            />
            <p className="absolute top-0 left-0 flex gap-2.5 bg-gray-300 px-12 py-2.5 rounded-[6px] cursor-pointer">
              <IoMdImages className="text-2xl" /> Change
            </p>
          </div>
        </div>

        <div className="flex space-x-40 mt-12">
          {/* Basic Info */}
          <div className="flex flex-col text-[18px]">
            <h1 className="text-[20px] font-medium mb-4">Basic Information</h1>

            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 w-100 h-12 outline-0 px-2 py-2 rounded-[4px] mt-1 mb-6 hover:border-orange-600"
            />

            <label htmlFor="userName">User Name</label>
            <input
              id="userName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 w-100 h-12 outline-0 px-2 py-2 rounded-[4px] mt-1 mb-6 hover:border-orange-600"
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 w-100 h-12 outline-0 px-2 py-2 rounded-[4px] mt-1 mb-6 hover:border-orange-600"
            />

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 w-100 h-12 outline-0 px-2 py-2 rounded-[4px] mt-1 mb-6 hover:border-orange-600"
            />
          </div>

          {/* Personal Info */}
          <div className="flex flex-col text-[18px]">
            <h1 className="text-[20px] font-medium mb-4">Personal Info</h1>

            <label>Date Of Birth</label>
            <div className="flex gap-3 mb-6">
              <div className="flex-1">
                <CustomDropdown label="Month" options={months} value={month} setValue={setMonth} id="month" />
              </div>
              <div className="flex-1">
                <CustomDropdown label="Day" options={days.map(d => d < 10 ? `0${d}` : `${d}`)} value={date} setValue={setDate} id="day" />
              </div>
              <div className="flex-1">
                <CustomDropdown label="Year" options={[...years].reverse()} value={year} setValue={setYear} id="year" />
              </div>
            </div>

            <label htmlFor="gender">Gender</label>
            <select
              onChange={(e) => setGender(e.target.value)}
              value={gender}
              id="gender"
              className="border border-gray-300 w-100 h-12 outline-0 px-2 py-2 rounded-[4px] mt-1 mb-6 hover:border-orange-600"
            >
              <option value="" className="hidden">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>

            <label htmlFor="location">Address</label>
            <input
              id="location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 w-100 h-12 outline-0 px-2 py-2 rounded-[4px] mt-1 mb-6 hover:border-orange-600"
            />

            <button
              type="button"
              className="cursor-pointer bg-gray-600 px-12 py-2 text-white font-medium rounded-[5px] mt-6 hover:border-orange-600"
            >
              Change password
            </button>
          </div>
        </div>

        <input
          type="submit"
          value="Save Change"
          className="flex mr-20 m-auto cursor-pointer bg-orange-600 px-14 py-2 text-white font-medium rounded-[5px] mt-6 hover:border-orange-600"
        />
      </form>
    </div>
  );
};

export default EditProfile;
