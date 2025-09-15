import React, { useEffect, useState } from "react";
import axios from "axios";

function Nontifikasi() {
  const [notifikasi, setNotifikasi] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3000/api/notifikasi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifikasi(res.data);
      } catch (err) {
        console.error("Gagal memuat notifikasi:", err);
      }
    };

    fetchNotifikasi();
  }, []);

  return (
    <div className="fixed top-10 right-20 w-80 z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-4">
      <h1 className="text-lg font-bold mb-3">Notifikasi</h1>

      {notifikasi.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada notifikasi baru.</p>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {notifikasi.map((notif) => (
            <li
              key={notif.id}
              className="flex items-center space-x-3 p-2 bg-gray-50 rounded hover:bg-gray-100"
            >
              <img
                src={notif.dari_user?.profile_picture || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{notif.dari_user?.username}</span>{" "}
                  {notif.jenis === "like"
                    ? "menyukai postingan Anda"
                    : "mengomentari postingan Anda"}
                </p>
              </div>
              {notif.karya?.file_url && (
                <img
                  src={notif.karya.file_url}
                  alt="Karya"
                  className="w-12 h-12 object-cover rounded"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Nontifikasi;
