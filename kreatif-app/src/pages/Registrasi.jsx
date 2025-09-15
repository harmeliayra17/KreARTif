import React, { useState } from "react";
import Toast from "../components/Toast"; // pastikan path benar
import { useNavigate } from "react-router-dom";


function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Registration successful! Please login.", "success");
        setFormData({ username: "", email: "", password: "" });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[url('/src/assets/bg_login_regist.png')] bg-cover bg-center flex items-center justify-center p-4 font-[Montserrat]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Image and Text */}
        <div className="order-2 lg:order-1 text-white hidden lg:flex items-center justify-center gap-10">
          <img 
            src="/imgregist.png"
            alt="Creative Work"
            className="w-52 h-auto rounded-xl shadow-xl"
          />
          <h2 className="text-3xl lg:text-4xl font-bold leading-snug text-left">
            Continue<br />
            sharing<br />
            and<br />
            exploring<br />
            creative<br />
            works<br />
            art.
          </h2>
        </div>

        {/* Right side - Register Form */}
        <div className="order-1 lg:order-2">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-2 mt-8">Register</h3>
            <p className="text-white/70 text-sm">Join the KreARTif community!</p>
          </div>

          <div className="p-6 lg:p-8">
            <div className="space-y-5 w-full max-w-md mx-auto text-left">
              <div>
                <label htmlFor="username" className="text-white text-sm font-semibold block mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F] focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-white text-sm font-semibold block mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.name@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F] focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-white text-sm font-semibold block mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F] focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              <div className="text-center">
                <p className="text-white/60 text-sm">
                  By registering, you agree to our{" "}
                  <a href="#" className="text-[#A259FF] hover:text-purple-300 transition-colors">
                    Terms & Conditions
                  </a>
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#A259FF] to-[#91315F] hover:from-[#663b9e] hover:to-[#952c5f] text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Register"
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="text-center">
                <p className="text-white/70 text-sm">
                  Already have an account?{" "}
                  <a href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Login here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
