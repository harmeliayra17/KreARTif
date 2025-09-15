import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Search } from "lucide-react";
import CardKarya from "../components/CardKarya";
import UserCard from "../components/UserCard";
import { Link } from "react-router-dom";
import Footer from '../components/Footer';

const Beranda = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const categories = ["Desain", "Tulisan", "Fotografi"];

  // Hero carousel
  const images = ["/ic_fotografi.png", "/ic_writings.png", "/ic_desain.png"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/karya");
        const data = await res.json();
        setAllPosts(data);
        setFilteredPosts(data);

        const top6 = [...data]
          .filter(post => typeof post.total_like === "number")
          .sort((a, b) => b.total_like - a.total_like)
          .slice(0, 6);
        setPopularPosts(top6);

        const userLikesMap = data.reduce((map, post) => {
          if (!post.user || !post.user.id) return map;

          const userId = post.user.id;
          if (!map[userId]) {
            map[userId] = { ...post.user, totalLikes: 0 };
          }
          map[userId].totalLikes += post.total_like;
          return map;
        }, {});
        const topUsersArr = Object.values(userLikesMap)
          .sort((a, b) => b.totalLikes - a.totalLikes)
          .slice(0, 6);
        setTopUsers(topUsersArr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);


  useEffect(() => {
    let temp = allPosts;
    if (categoryFilter) {
      temp = temp.filter(p => p.kategori === categoryFilter);
    }
    if (searchTerm) {
      temp = temp.filter(p =>
        p.judul.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPosts(temp);
  }, [searchTerm, categoryFilter, allPosts]);

  // Auto-rotate carousel image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white bg-cover bg-center font-[Montserrat] flex flex-col">
      <header className="min-h-[600px] text-white py-4 bg-cover bg-center" style={{ backgroundImage: "url('/home-bg.png')" }}>
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between">

        {/* Kiri: Carousel Gambar */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:items-start md:pl-16 mt-6">
            <img
              src={images[currentImageIndex]}
              alt="Creative Art"
              className="w-[270px] max-w-md mx-auto md:mx-0 rounded-xl shadow-lg transition-opacity duration-500"
            />
            <div className="flex w-full mt-4 justify-center space-x-4">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`
                    w-2.5 h-2.5 rounded-full
                    ${idx === currentImageIndex ? 'bg-pink-400 border-2 border-white' : 'bg-gray-300'}
                  `}
                />
              ))}
            </div>
          </div>

          {/* Kanan: Teks sambutan */}
          <div className="w-full md:pl-20 md:pr-8 text-left mt-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover. Create. Inspire — Welcome to <span className="text-pink-300">KreARTif</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl">
              Step into a world where creativity knows no bounds. Whether you're a designer, a storyteller, or a visual dreamer,
              KreARTif is your stage to shine. 
            </p>
          </div>

        

      </div>
    </header>

      {/* Popular Posts */}
      <section className="h-[580px] text-white py-4 bg-cover bg-center bg-[#121212] pl-[48px] ">
        <div className="text-center mb-6 mt-8">
          <h2 className="text-3xl font-bold font-montserrat mb-2">Latest Posts</h2>
          <p className="text-m text-gray-300 mb-12">Discover the newest creative expressions shared by our amazing artists this week!</p>
        </div>
        {loading ? (
          <p className="text-center text-gray-400">Loading posts…</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-gray-400">No posts found.</p>
        ) : (
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex w-max pb-2">
                {filteredPosts
                  .slice()
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((post, index) => (
                    <div
                      key={post.id}
                      className={`w-[300px] shrink-0 ${index === 0 ? 'ml-[]' : 'ml-2'} ${index === filteredPosts.length - 1 ? 'mr-0' : 'mr-2'}`}
                    >
                      <CardKarya karya={post} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Category Section */}
      <section className="px-4 sm:px-6 py-12 text-white bg-cover bg-center" style={{ backgroundImage: "url('/bg-category.png')" }}>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-white">
        Category
      </h2>
      <p className="text-center text-sm sm:text-base text-white mb-8 px-2">
        Discover your favorite style—one category at a time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Writing Card */}
        <div className="rounded-lg p-6 text-white text-center" style={{ background: "linear-gradient(to bottom, #77627C, #392553)" }}>
          <img src="/icon_write.png" alt="Writing Icon" className="mx-auto w-20 sm:w-24 h-20 sm:h-24 mb-6" />
          <h3 className="bg-white text-[#91315F] px-3 py-1 rounded-full inline-block font-semibold text-sm mb-6">
            Writing
          </h3>
          <p className="text-xs sm:text-sm px-2">
            Immerse yourself in captivating stories, poems, and written works. Discover voices that move, inspire, and ignite imagination.
          </p>
        </div>

        {/* Photography Card */}
        <div className="rounded-lg p-6 text-white text-center" style={{ background: "linear-gradient(to bottom, #77627C, #392553)" }}>
          <img src="/icon_photo.png" alt="Photography Icon" className="mx-auto w-20 sm:w-24 h-20 sm:h-24 mb-6" />
          <h3 className="bg-white text-[#91315F] px-3 py-1 rounded-full inline-block font-semibold text-sm mb-6">
            Photography
          </h3>
          <p className="text-xs sm:text-sm px-2">
            Capture the world through powerful lenses and perspectives. From candid moments to iconic masterpieces, see life in every frame.
          </p>
        </div>

        {/* Design Card */}
        <div className="rounded-lg p-6 text-white text-center" style={{ background: "linear-gradient(to bottom, #77627C, #392553)" }}>
          <img src="/icon_design.png" alt="Design Icon" className="mx-auto w-20 sm:w-24 h-20 sm:h-24 mb-6" />
          <h3 className="bg-white text-[#91315F] px-3 py-1 rounded-full inline-block font-semibold text-sm mb-6">
            Design
          </h3>
          <p className="text-xs sm:text-sm px-2">
            Experience creativity through stunning visuals and bold ideas. Explore innovative compositions from talented visual artists.
          </p>
        </div>
      </div>
    </section>

      {/* Footer */}
      <Footer />

      {/* Search Bar */}
    </div>
  );
};

export default Beranda;
