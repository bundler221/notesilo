import React from "react";
import { FiChevronLeft, FiUser, FiInfo, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import SharingLog from "./SharingLog";

export default function RightSidebar({
  rightOpen,
  setRightOpen,
  username,
  showSharingLog,
  toggleSharingLog,
  handleLogout,
  token,
}) {
  return (
    <div
      className={`rightbar fixed top-0 right-0 h-full bg-gray-900 text-white p-4 transition-transform duration-300 ease-in-out ${
        rightOpen ? "translate-x-0" : "translate-x-full"
      } w-64 z-50`}
    >
      <div className="flex items-center justify-start mb-4 space-x-2">
        <button
          onClick={() => setRightOpen(false)}
          className="rightham p-1 text-2xl bg-gray-700 hover:bg-gray-600 rounded-md transition"
        >
          <FiChevronLeft className="rotate-180" />
        </button>
        <h2 className="text-xl font-bold">Profile</h2>
      </div>

      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-3xl">
          <FiUser />
        </div>
        <p className="font-semibold">{`@`+username}</p>
      </div>

      <ul className="space-y-3">
        <li
          onClick={() => setRightOpen(false)}
          className="flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition"
        >
          <FiInfo className="mr-2" />
          <Link to="/user-guide" className="text-gray-100 hover:underline">
            User Guide
          </Link>
        </li>

        <li
          onClick={() => setRightOpen(false)}
          className="flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition"
        >
          <FiInfo className="mr-2" />
          <Link to="/about-us" className="text-gray-100 hover:underline">
            About Us
          </Link>
        </li>

        <li
          onClick={toggleSharingLog}
          className="flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition"
        >
          <FiInfo className="mr-2" />
          {showSharingLog ? "Hide Sharing" : "Manage"}
        </li>
      </ul>

      {showSharingLog && <SharingLog token={token} onClose={toggleSharingLog} />}

      <div className="absolute bottom-6 left-0 w-full px-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full justify-center p-2 bg-red-600 hover:bg-red-500 rounded transition"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}
