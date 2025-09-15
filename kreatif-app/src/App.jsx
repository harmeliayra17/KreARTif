import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Beranda from './pages/Beranda';
import UploadKarya from './pages/UploadKarya';
import Favorit from './pages/Favorit';
import Riwayat from './pages/Riwayat';
import ProfilPage from './pages/Profil';
import ProfilAdmin from './pages/ProfilAdmin'; // ⬅️ Import halaman admin baru
import Notifikasi from './pages/Nontifikasi';
import Detail from "./pages/Detail";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
// ⬇️ Import halaman baru
import LoginForm from './pages/Login';
import RegisterForm from './pages/Registrasi';

// Layout dengan Navbar yang hanya akan membungkus halaman tertentu
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Di sinilah semua halaman dengan navbar akan dirender */}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Semua route yang pakai Navbar dibungkus Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/upload" element={<UploadKarya />} />
          <Route path="/upload/:id" element={<UploadKarya />} />
          <Route path="/favorit" element={<Favorit />} />
          <Route path="/riwayat" element={<Riwayat />} />
          
          {/* Route untuk user biasa */}
          <Route path="/profil/*" element={<ProfilPage />} />
          
          {/* Route untuk admin */}
          <Route path="/admin/*" element={<ProfilAdmin />} />
          
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/notifikasi" element={<Notifikasi />} />
          <Route path="/pages/Detail/:id" element={<Detail />} />
        </Route>
        
        {/* Route tanpa Navbar */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;