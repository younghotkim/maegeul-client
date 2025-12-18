import React from "react";
import { Link } from "react-router-dom"; // react-router-dom for navigation
import { Iconify } from "../dashboardComponents/iconify"; // Iconify import for icons
import mainLogo from "../logo/main_logo.png"; // Logo image

interface ModalProps {
  isOpen: boolean;
  message: React.ReactNode; // Accept any valid React node as the message
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null; // If modal is not open, don't render anything

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center font-medium font-plus-jakarta-sans relative">
        {/* Main Logo at the top */}
        <img
          src={mainLogo}
          className="w-24 h-24 mx-auto mb-4"
          alt="Main Logo"
        />

        {/* Message Section */}
        <div className="text-xl font-bold mb-6">{message}</div>

        {/* Buttons Section */}
        <div className="flex justify-center space-x-4 mt-6">
          <Link
            to="/mainlogin"
            className="px-6 py-3 border border-indigo-600 rounded-lg text-indigo-600 text-sm font-bold hover:bg-indigo-100 hover:shadow-lg"
          >
            로그인
          </Link>
          <Link
            to="/mainsignup"
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-500 hover:shadow-lg"
          >
            회원가입
          </Link>
        </div>

        {/* Close button in the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <Iconify icon="ic:round-close" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};

export default Modal;
