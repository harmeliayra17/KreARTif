import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import placeholderImage from "../assets/ic_placeholder_img.png"; 

function UploadKarya() {
  const location = useLocation();
  const isInProfilPage = location.pathname.includes("/profil");
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    kategori: "",
    file: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/karya/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            judul: data.judul || "",
            deskripsi: data.deskripsi || "",
            kategori: data.kategori || "",
            file: null,
          });

          if (data.file_url) {
            setImagePreview(data.file_url);
          }
        })
        .catch((err) => console.error("Failed to fetch:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let translatedValue = value;
    if (name === "kategori") {
      if (value === "Writing") translatedValue = "Tulisan";
      if (value === "Photography") translatedValue = "Fotografi";
      if (value === "Design") translatedValue = "Desain";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: translatedValue,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please login.");
      return;
    }

    const form = new FormData();
    form.append("judul", formData.judul);
    form.append("deskripsi", formData.deskripsi);
    form.append("kategori", formData.kategori);
    if (formData.file) {
      form.append("file", formData.file);
    }

    try {
      setIsLoading(true);

      const url = id
        ? `http://localhost:3000/api/karya/update/${id}`
        : `http://localhost:3000/api/karya`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Artwork ${id ? "updated" : "uploaded"} successfully!`);
        navigate("/");
      } else {
        alert("Failed: " + (result.msg || result.error || res.statusText));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred while saving your artwork.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${!isInProfilPage ? "bg-gradient-to-br from-[#1f012e] via-[#000000] to-[#3c0059] font-[Montserrat] mt-12 py-10 px-4" : ""}`}>
      <div className=" text-white flex justify-center items-center font-[Montserrat]">
        <div className="backdrop-blur-md w-full max-w-6xl rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left - Image Upload */}
          <div className="flex p-4">
            <label
              htmlFor="fileInput"
              className="relative w-80 h-[26rem] bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
            >
            <img
              src={imagePreview || placeholderImage}
              alt="Preview"
              className="object-cover w-full h-full rounded-lg"
            />
              <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <span className="text-white text-sm font-medium">Choose Image</span>
              </div>
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required={!id}
            />
          </div>

          {/* Right - Form */}
          <div className="p-2">
            <h1 className="text-3xl font-bold mb-2">
              {id ? "Update Art" : "Upload Art"}
            </h1>
            <p className="text-white/70 mb-6">
              Turn your ideas into impact — share your artwork!
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-1">Title:</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F]"
                  placeholder="Enter artwork title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Category:</label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#91315F] bg-black"
                  required
                  // defaultValue=""
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Writing">Writing</option>
                  <option value="Design">Design</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  rows="1"
                  className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F] resize-none overflow-hidden"
                  placeholder="Describe your artwork"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#A259FF] to-[#91315F] hover:from-[#663b9e] hover:to-[#952c5f] text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving..."
                  : id
                  ? "Update Artwork"
                  : "Submit Artwork"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadKarya;
