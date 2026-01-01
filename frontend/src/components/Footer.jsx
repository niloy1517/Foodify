import { SiIfood } from "react-icons/si";


const Footer = () => {
  return (
    <footer className=" px-10 py-14 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <h2 className="flex items-center gap-1.5 text-orange-600 text-3xl font-bold mb-3"><SiIfood /> foodify</h2>
          <p className="text-[20px] font-semibold text-gray-700 ">
            Your favorite foods delivered fast — fresh & hot.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 font-medium text-gray-700 text-[18px]">
            <li className="hover:text-orange-600 cursor-pointer">About Us</li>
            <li className="hover:text-orange-600 cursor-pointer">Careers</li>
            <li className="hover:text-orange-600 cursor-pointer">Press</li>
            <li className="hover:text-orange-600 cursor-pointer">Blog</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Help & Support</h3>
          <ul className="space-y-2 font-medium text-gray-700 text-[18px]">
            <li className="hover:text-orange-600 cursor-pointer">Customer Support</li>
            <li className="hover:text-orange-600 cursor-pointer">FAQs</li>
            <li className="hover:text-orange-600 cursor-pointer">Refund Policy</li>
            <li className="hover:text-orange-600 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Download App */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Download App</h3>
          <div className="flex flex-col gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Play_Store_badge_EN.svg"
              className="w-36 cursor-pointer"
              alt="google-play"
            />
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              className="w-36 cursor-pointer"
              alt="app-store"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200 my-10" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2025 Foodify. All rights reserved.</p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <p className="hover:text-white cursor-pointer">Terms</p>
          <p className="hover:text-white cursor-pointer">Privacy</p>
          <p className="hover:text-white cursor-pointer">Cookies</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
