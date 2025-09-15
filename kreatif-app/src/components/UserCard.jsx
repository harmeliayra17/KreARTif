// src/components/UserCard.jsx

import React from "react";

const UserCard = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center w-40">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-16 h-16 rounded-full object-cover mb-2"
      />
      <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
    </div>
  );
};

export default UserCard;
