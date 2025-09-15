import React, { useEffect, useState } from "react";
import Footer from '../components/Footer';

const images = ["/ic_fotografi.png", "/ic_desain.png", "/ic_writings.png"];

function About() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2500); // ganti setiap 2.5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-[Montserrat]">
      {/* Section About */}
      <section
      className="min-h-[600px] bg-cover bg-center text-white px-6 py-12 flex flex-col md:flex-row items-center justify-center gap-12"
      style={{ backgroundImage: "url('/bg-about.png')" }}
    >
      {/* Left Side Text */}
      <div className="w-full md:w-1/2 max-w-xl text-center md:text-left">
        <h1 className="text-4xl font-extrabold mb-6">About KreARTif</h1>
        <p className="text-lg leading-relaxed text-gray-200">
          <span className="font-semibold">KreARTif</span> is a digital platform built to empower aspiring artists,
          writers, and photographers by providing a space to share, grow, and connect. Whether you're showcasing your
          design, telling stories through writing, or capturing moments through photography—KreARTif is your creative
          home.
        </p>
      </div>

      {/* Right Side Image Carousel */}
      <div className="w-full md:w-[300px] h-[400px] rounded-xl overflow-hidden shadow-lg border border-white/30">
        <img
          src={images[currentImage]}
          alt="carousel"
          className="object-cover w-full h-full transition-all duration-700"
        />
      </div>
    </section>


      {/* Section Vision & Mission */}
      <div
        className="py-20 px-6 text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-vm.png')" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Our Vision</h2>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur border border-white/20 shadow-md mb-10">
            <p className="text-lg text-gray-200">
              To become the leading online community platform that nurtures creativity and supports the artistic journey of youth across Indonesia and beyond.
            </p>
          </div>

          <h2 className="text-3xl font-extrabold mb-4">Our Mission</h2>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur border border-white/20 shadow-md text-left">
            <ul className="list-disc list-inside text-gray-200 space-y-2">
              <li>Provide an inclusive space for creatives to publish and showcase their work.</li>
              <li>Encourage collaboration and feedback among creators from various disciplines.</li>
              <li>Celebrate diverse forms of art by promoting equal opportunities for all.</li>
              <li>Support growth through competitions, exposure, and learning resources.</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
