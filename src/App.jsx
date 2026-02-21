import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Collections from "./pages/Collections";
import Faq from "./pages/Faq";
import Checkout from "./components/Checkout";
import Dynamic from "./components/Dynamic";
import Accessories from "./pages/Accessories";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><main className="pt-24 md:pt-10"><Home /></main></>} />
      <Route path="/home" element={<><Navbar /><main className="pt-24 md:pt-10"><Home /></main></>} />
      <Route path="/shop" element={<><Navbar /><main className="pt-24 md:pt-10"><Shop /></main></>} />
      <Route path="/product/:id" element={<><Navbar /><main className="pt-24 md:pt-10"><Dynamic /></main></>} />
      <Route path="/collections" element={<><Navbar /><main className="pt-24 md:pt-10"><Accessories /></main></>} />
      <Route path="/faq" element={<><Navbar /><main className="pt-24 md:pt-10"><Faq /></main></>} />
      <Route path="/checkout" element={<><Navbar /><main className="pt-24 md:pt-10"><Checkout /></main></>} />
      <Route path="/myadmin-login" element={<AdminLogin />} />
      <Route path="/myadmin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;