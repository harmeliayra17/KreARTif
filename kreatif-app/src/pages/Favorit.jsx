import React, { useEffect, useState } from "react";
import axios from "axios";
import CardKarya from "../components/CardKarya";

function Favorit() {
  const [karyaLiked, setKaryaLiked] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedKarya = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/like/liked/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKaryaLiked(res.data);
    } catch (err) {
      console.error("Gagal mengambil karya yang disukai:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedKarya();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Karya Favorit Anda</h1>

      {loading ? (
        <p>Memuat...</p>
      ) : karyaLiked.length === 0 ? (
        <p className="text-white">Belum ada karya yang disukai.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {karyaLiked.map((karya) => (
            <CardKarya key={karya.id} karya={karya} onLikeToggle={fetchLikedKarya} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorit;
