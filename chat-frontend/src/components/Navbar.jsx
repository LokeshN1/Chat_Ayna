import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";

function Navbar() {
  const { logout } = useContext(AuthContext); // Assuming there's a logout function in AuthContext

  return (
    <nav className="w-full bg-gray-800 p-4 flex justify-between items-center shadow-lg border-b border-gray-700">
      {/* Website Name */}
      <h1 className="text-2xl font-bold text-white">Chat-Ayna</h1>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;