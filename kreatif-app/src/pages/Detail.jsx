import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import likeIcon from "../assets/ic_love.png";
import loveTerisiIcon from "../assets/loveterisi.png";
import commentIcon from "../assets/ic_comment.png";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [karya, setKarya] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [komentarList, setKomentarList] = useState([]);
  const [komentarInput, setKomentarInput] = useState("");

  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchKaryaDetail();
    fetchLikeStatus();
    fetchLikeCount();
    fetchKomentarCount();
    fetchKomentar();
  }, [id]);

  const getFormattedCategory = (kategori) => {
    switch (kategori?.toLowerCase()) {
      case "tulisan":
        return "Writing";
      case "fotografi":
        return "Photography";
      case "desain":
        return "Design";
      default:
        return kategori;
    }
  };


  const fetchKaryaDetail = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/karya/${id}`);
      if (!res.ok) throw new Error("Gagal memuat detail karya");
      const data = await res.json();
      setKarya(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/like/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLiked(data.liked);
    } catch (err) {
      console.error("Gagal memuat status like:", err);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/like/count/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLikeCount(data.count);
    } catch (err) {
      console.error("Gagal memuat jumlah like:", err);
    }
  };

  const fetchKomentarCount = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/komentar/${id}`);
      const data = await res.json();
      setCommentCount(data.length);
    } catch (err) {
      console.error("Gagal memuat jumlah komentar:", err);
    }
  };

  const fetchKomentar = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/komentar/${id}`);
      const data = await res.json();
      setKomentarList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat komentar:", err);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`http://127.0.0.1:3000/api/like/${id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Terjadi kesalahan saat like");

      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } catch (err) {
      alert("Gagal memproses like: " + err.message);
    }
  };

  const handleKomentarSubmit = async (e) => {
    e.preventDefault();
    if (!komentarInput.trim()) return;

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/komentar/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isi: komentarInput }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan komentar");

      setKomentarInput("");
      fetchKomentar();
      fetchKomentarCount();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleHapusKarya = async () => {
    const konfirmasi = window.confirm("Yakin ingin menghapus karya ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/karya/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus karya");
      alert("Karya berhasil dihapus");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Memuat detail karya...</div>;
  if (!karya) return <div className="text-white text-center mt-10">Karya tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1A1A2E] to-[#91315F] mt-8 text-white px-4 py-16 font-[Montserrat]">
      <div className="max-w-6xl mx-auto">
        {/* Judul di tengah */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8">{karya.judul}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gambar di kiri */}
          <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg">
            <img
              src={karya.file_url}
              alt={karya.judul}
              className="object-cover w-full h-auto"
            />
          </div>

          {/* Konten di kanan */}
          <div className="text-left space-y-4">
            {/* Kategori */}
            <div>
              <span className="bg-white text-[#91315F] font-semibold px-4 py-1 rounded-full text-sm">
                {getFormattedCategory(karya.kategori)}
              </span>
            </div>

            {/* Deskripsi */}
            <p className="text-sm md:text-base text-gray-200 leading-relaxed whitespace-pre-wrap">
              {karya.deskripsi || "Tidak ada deskripsi."}
            </p>

            {/* Like & Comment Count */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-3">
                <button onClick={handleLikeToggle}>
                  <img src={liked ? loveTerisiIcon : likeIcon} alt="like" className="h-6" />
                </button>
                <span className="text-sm">{likeCount}</span>
              </div>
              <div className="flex items-center gap-3">
                <img src={commentIcon} alt="comment" className="w-6 h-6" />
                <span className="text-sm">{commentCount}</span>
              </div>
            </div>

            {/* Tombol Edit & Hapus */}
            {(karya.user_id === userId || role === "admin") && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => navigate(`/upload/${karya.id}`)}
                  className="bg-[#744AAC] hover:bg-[#5a4675] text-white px-4 py-2 rounded-xl font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={handleHapusKarya}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
                >
                  Delete
                </button>
              </div>
            )}

            {/* Komentar Form */}
            <form
              onSubmit={handleKomentarSubmit}
              className="flex items-center bg-white rounded-full px-4 py-2 mt-6"
            >
              <input
                type="text"
                className="flex-1 text-sm text-black bg-transparent outline-none"
                placeholder="Write ur Comments"
                value={komentarInput}
                onChange={(e) => setKomentarInput(e.target.value)}
                disabled={!token}
              />
              <button
                type="submit"
                className="text-white bg-[#4CAF50] hover:bg-green-600 px-4 py-1 rounded-full text-sm"
                disabled={!token}
              >
                Send
              </button>
            </form>

            {/* Komentar List */}
            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
              {komentarList.length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada komentar.</p>
              ) : (
                komentarList.map((komentar, index) => (
                  <div
                    key={index}
                    className="bg-[#453855] to rounded-lg px-4 py-3 text-left text-sm"
                  >
                    <p className="font-bold mb-1">{komentar.user?.username || "Anonim"}</p>
                    <p className="text-gray-300">{komentar.isi}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Detail;
