import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Edit2, Trash2 } from "lucide-react";

const CardKarya = ({ karya, onLikeToggle }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchLikeStatus();
    fetchCounts();
    fetchCurrentUser();
  }, [karya.id]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error("Gagal ambil user login:", err);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/like/check/${karya.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLiked(data.liked);
    } catch (err) {
      console.error("Failed to fetch like status:", err);
    }
  };

  const fetchCounts = async () => {
    try {
      const [likesRes, commentsRes] = await Promise.all([
        fetch(`http://127.0.0.1:3000/api/like/count/${karya.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://127.0.0.1:3000/api/komentar/${karya.id}`),
      ]);
      const likesData = await likesRes.json();
      const commentsData = await commentsRes.json();
      setLikeCount(likesData.count);
      setCommentCount(commentsData.length);
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    }
  };

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`http://127.0.0.1:3000/api/like/${karya.id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Like action failed");

      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
      if (onLikeToggle) onLikeToggle();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Yakin ingin menghapus karya ini?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/karya/${karya.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus karya.");
      alert("Karya berhasil dihapus.");
      if (onLikeToggle) onLikeToggle(); // refresh list
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/upload/${karya.id}`);
  };

  const handleCardClick = () => {
    navigate(`/pages/Detail/${karya.id}`);
  };

  const translateCategory = (category) => {
    switch (category?.toLowerCase()) {
      case "tulisan":
        return "Writing";
      case "desain":
        return "Design";
      case "fotografi":
        return "Photography";
      default:
        return category || "Uncategorized";
    }
  };

  console.log("currentUser:", currentUser);
  console.log("karya.user_id:", karya.user_id);

  const isOwner = Number(currentUser?.id) === Number(karya.user_id);

  return (
    <div
      onClick={handleCardClick}
      className="w-68 bg-gradient-to-b from-gray-400 to-purple-400 rounded-2xl overflow-hidden shadow-lg font-[Montserrat] cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={karya.file_url || "https://via.placeholder.com/400x300"}
          alt={karya.judul}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 bg-gradient-to-b from-[#77627C] to-[#66304F]">
        <h3 className="text-white text-sm font-semibold truncate mb-1">
          {karya.judul}
        </h3>

        <div className="mb-1">
          <span className="inline-block bg-white text-[#91315F] text-[10px] font-bold px-2 py-0.5 rounded-full">
            {translateCategory(karya.kategori)}
          </span>
        </div>

        <p className="text-white text-xs truncate mb-2">
          By {karya.username || "Unknown"}
        </p>

        <div className="flex items-center justify-between">
          <button onClick={handleLikeToggle} className="flex items-center space-x-1">
            <Heart
              className={`w-4 h-4 ${liked ? "text-red-500 fill-current" : "text-white"}`}
            />
            <span className="text-white text-xs">{likeCount}</span>
          </button>

          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4 text-white" />
            <span className="text-white text-xs">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardKarya;
