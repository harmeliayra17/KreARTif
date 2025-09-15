import React, { useEffect, useState } from "react";
import CardKarya from "../components/CardKarya";
import Footer from "../components/Footer";

const categories = ["All", "Writing", "Design", "Photography"];
const sortOptions = ["Newest", "Oldest", "Popular"];

function Gallery() {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [isLoading, setIsLoading] = useState(true);

  const categoryMap = {
    Writing: "tulisan",
    Photography: "fotografi",
    Design: "desain",
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:3000/api/karya");
      const data = await res.json();
      setTimeout(() => {
        setAllPosts(data);
        setFilteredPosts(data);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let posts = [...allPosts];

    if (selectedCategory !== "All") {
      const mappedCategory = categoryMap[selectedCategory];
      posts = posts.filter(
        (k) => k.kategori?.toLowerCase() === mappedCategory
      );
    }

    if (searchQuery) {
      posts = posts.filter((k) =>
        k.judul.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "Newest") {
      posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "Oldest") {
      posts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "Popular") {
      posts.sort((a, b) => b.like_count - a.like_count);
    }

    setFilteredPosts(posts);
  }, [searchQuery, selectedCategory, sortBy, allPosts]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 bg-gradient-to-br from-[#1f012e] via-[#000000] to-[#3c0059] font-[Montserrat]">
      <h1 className="text-4xl font-extrabold mt-10 text-white mb-2">Explore</h1>
      <p className="text-white text-md mb-8">
        Find inspiration from amazing artworks by the community
      </p>

      {/* Search Input */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-4 mb-4 px-4">
        <input
          type="text"
          placeholder="Search artwork by title..."
          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F] focus:border-transparent transition-all duration-200 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 flex-wrap justify-center mb-6">
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


      {/* Loading / No Data / Gallery */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <img
            src="/gif-loading.gif"
            alt="Loading..."
            className="w-16 h-16 mb-4"
          />
          <p className="text-white text-lg">Loading artworks...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-gray-400">No artworks found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
          {filteredPosts.map((karya) => (
            <div key={karya.id} className="flex justify-center">
              <CardKarya karya={karya} />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="w-full mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default Gallery;
