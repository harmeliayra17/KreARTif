import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // Untuk ikon toggle
import Nontifikasi from "../pages/Nontifikasi"; // Pastikan path ini benar

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifikasi, setNotifikasi] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal memuat profil.");
        const data = await res.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Gagal mengambil data profil:", err.message);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/notifikasi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Gagal memuat notifikasi");
        const data = await res.json();
        setNotifikasi(data);
      } catch (err) {
        console.error("Gagal mengambil data notifikasi:", err.message);
      }
    };

    if (token) {
      fetchNotifikasi();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const adaNotifikasiBaru = notifikasi.some((n) => n.dibaca === false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-4 flex items-center justify-between bg-cover bg-center border-b border-white/40 font-[Montserrat]"
      style={{ backgroundImage: "url('/bg-navbar.png')" }}
    >
      {/* Logo */}
      <div className="text-2xl font-bold text-white">
        <Link to="/">KreARTif</Link>
      </div>

      {/* Toggle menu (mobile) */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Link navigasi (desktop) */}
      <div className="hidden md:flex space-x-8 text-white font-medium">
        <Link to="/" className="hover:text-[#91315F]">Home</Link>
        <Link to="/gallery" className="hover:text-[#91315F]">Gallery</Link>
        <Link to="/about" className="hover:text-[#91315F]">About</Link>
      </div>

      {/* Aksi kanan (desktop) */}
      <div className="hidden md:flex items-center space-x-4 relative">
        {token ? (
          <>
            <button
              onClick={() => setShowNotif((prev) => !prev)}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src={adaNotifikasiBaru ? "/ic_notification_active.png" : "/ic_notification.png"}
                alt="Notifikasi"
                className="w-6 h-6"
              />
            </button>
            {showNotif && <Nontifikasi />}
            <Link to="/profil">
              <img
                src={userProfile?.profile_picture || "/profile_default.jpeg"}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-gray-300 object-cover cursor-pointer"
              />
            </Link>
          </>
        ) : (
          <Link to="/login" className="bg-[#91315F] text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </Link>
        )}
      </div>

      {/* Menu dropdown untuk mobile */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#2b2b2b] text-white flex flex-col space-y-4 px-6 py-4 md:hidden border-t border-white/30 bg-gradient-to-br from-[#1f012e] via-[#000000] to-[#3c0059] font-[Montserrat] py-10 px-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-[#91315F]">Home</Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)} className="hover:text-[#91315F]">Gallery</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#91315F]">About</Link>

          {token ? (
            <>
              <div className="flex items-center space-x-4 mt-4">
                <button onClick={() => setShowNotif((prev) => !prev)} className="hover:opacity-80">
                  <img
                    src={adaNotifikasiBaru ? "/ic_notification_active.png" : "/ic_notification.png"}
                    alt="Notif"
                    className="w-6 h-6"
                  />
                </button>
                {showNotif && <Nontifikasi />}
                <Link to="/profil" onClick={() => setMenuOpen(false)}>
                  <img
                    src={userProfile?.profile_picture || "/profile_default.jpeg"}
                    alt="Profil"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Link>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-[#91315F] text-white px-4 py-2 rounded mt-4"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
