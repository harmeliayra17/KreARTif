export default function Footer() {
  return (
    <footer
      className="text-white py-10 px-6 md:px-16"
      style={{
        background: "linear-gradient(to top, #392553, #000000)", // ungu ke hitam dari bawah ke atas
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Kiri: Navigasi */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">KreARTif</h2>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a href="/" className="hover:text-white">Home</a>
            </li>
            <li>
              <a href="/gallery" className="hover:text-white">Gallery</a>
            </li>
            <li>
              <a href="/about" className="hover:text-white">About</a>
            </li>
          </ul>
        </div>

        {/* Kanan: Kontak */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Contact</h3>
          <p className="text-sm text-white/70">kreartif11@gmail.com</p>
        </div>
      </div>

      {/* Footer bawah */}
      <div className="mt-10 text-center text-xs text-white/50 border-t border-white/20 pt-4">
        © {new Date().getFullYear()} KreARTif. All rights reserved.
      </div>
    </footer>
  );
}
