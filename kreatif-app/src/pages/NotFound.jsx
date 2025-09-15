import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center text-white font-[Montserrat] text-center px-4"
    style={{ backgroundImage: "url('/bg-latest.png')" }}>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found</p>
      <p className="text-md text-gray-300 mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-[#91315F] hover:bg-[#aa3d6f] text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
