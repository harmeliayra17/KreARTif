// components/Toast.jsx
import React from "react";

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white
      ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      <div className="flex justify-between items-center gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="text-white font-bold">×</button>
      </div>
    </div>
  );
};

export default Toast;
