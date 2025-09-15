import { useState } from "react";
import { Menu, X } from "lucide-react";

const SidebarAdmin = ({ activeTab, handleTabChange }) => {
  const [open, setOpen] = useState(false);

  const isActive = (tab) =>
    activeTab === tab
      ? "bg-[#a159ff54] font-semibold text-white"
      : "hover:bg-[#a159ff2c] text-white";

  return (
    <div className="w-full md:w-1/4 p-4">
      {/* Mobile Toggle */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <h2 className="text-xl font-semibold text-white">Admin Menu</h2>
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div className={`${open ? "block" : "hidden"} md:block`}>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleTabChange("dashboard")}
              className={`w-full text-left px-4 py-2 rounded ${isActive("dashboard")}`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange("profil")}
              className={`w-full text-left px-4 py-2 rounded ${isActive("profil")}`}
            >
              My Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange("karya")}
              className={`w-full text-left px-4 py-2 rounded ${isActive("karya")}`}
            >
              My Artwork
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange("favorit")}
              className={`w-full text-left px-4 py-2 rounded ${isActive("favorit")}`}
            >
              Favorites
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange("riwayat")}
              className={`w-full text-left px-4 py-2 rounded ${isActive("riwayat")}`}
            >
              History
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabChange("setting")}
              className={`w-full text-left px-4 py-2 rounded ${isActive("setting")}`}
            >
              Settings
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarAdmin;
