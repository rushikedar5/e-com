import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import EditProduct from "./pages/EditProduct"; // 🔥 IMPORTANT
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />


          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:id" element={<EditProduct />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
