import React, { useEffect, useState } from "react";
import CardKarya from "../components/CardKarya";

const categories = ["All", "Writing", "Photography", "Design"];

const categoryMap = {
  Writing: "tulisan",
  Photography: "fotografi",
  Design: "desain",
};

function Riwayat() {
  const [karyaList, setKaryaList] = useState([]);
  const [filteredKarya, setFilteredKarya] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKarya();
  }, []);

  const fetchKarya = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const res = await fetch("http://localhost:3000/api/karya/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load your artwork data.");

      const data = await res.json();
      setKaryaList(data);
      setFilteredKarya(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let karya = [...karyaList];

    if (selectedCategory !== "All") {
      const mappedCategory = categoryMap[selectedCategory];
      karya = karya.filter(
        (k) => k.kategori?.toLowerCase() === mappedCategory
      );
    }

    if (searchQuery) {
      karya = karya.filter((k) =>
        k.judul.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredKarya(karya);
  }, [searchQuery, selectedCategory, karyaList]);

  return (
    <div className="min-h-screen w-[980px] flex flex-col items-center justify-start py-2 font-[Montserrat]">
      <h1 className="text-4xl font-extrabold mt-2 text-white mb-2">
        My Artwork History
      </h1>
      <p className="text-white text-md mb-8">
        Browse through all the artworks you have uploaded so far.
      </p>

      {/* Search Input */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-4 mb-6 px-4">
        <input
          type="text"
          placeholder="Search artwork by title..."
          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F] focus:border-transparent transition-all duration-200 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 flex-wrap justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-[#91315F] text-white border-[#757575]"
                : "text-white border-white"
            } transition duration-200`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Section */}
      {loading ? (
        <p className="text-center text-gray-300">Loading artworks...</p>
      ) : filteredKarya.length === 0 ? (
        <p className="text-center text-gray-400">No artworks found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
          {filteredKarya.map((karya) => (
            <div key={karya.id} className="flex justify-center">
              <CardKarya karya={karya} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Riwayat;
