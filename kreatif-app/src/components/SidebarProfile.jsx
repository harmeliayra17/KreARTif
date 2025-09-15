import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const SidebarProfil = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const active = (path) =>
    location.pathname === path ? "font-bold text-blue-400" : "text-white";

  return (
    <div className="w-full md:w-1/4 p-4">

      {/* Toggle untuk mobile */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <h2 className="text-xl font-semibold text-white">Menu</h2>
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar menu */}
      <div className={`${open ? "block" : "hidden"} md:block bg-[#2e2e2e] md:bg-transparent rounded-lg p-4 shadow-lg`}>
        <ul className="space-y-4">
          <li>
            <Link to="/profil" onClick={() => setOpen(false)} className={`${active("/profil")} block`}>
              Profil
            </Link>
          </li>
          <li>
            <Link to="/favorit" onClick={() => setOpen(false)} className={`${active("/favorit")} block`}>
              Favorit
            </Link>
          </li>
          <li>
            <Link to="/riwayat" onClick={() => setOpen(false)} className={`${active("/riwayat")} block`}>
              Riwayat
            </Link>
          </li>
          <li>
            <Link to="/upload" onClick={() => setOpen(false)} className={`${active("/upload")} block`}>
              Upload Karya
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarProfil;
