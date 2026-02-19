import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { fetchCartCount } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      navigate("/login");
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCartItems(res.data.cartItems);
      setTotalAmount(res.data.totalAmount);

      // 🔥 Sync navbar badge whenever cart loads
      fetchCartCount();
    } catch (error) {
      console.error("Cart fetch failed");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");  // ✅ only navigate
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              refreshCart={fetchCart}
            />
          ))}
        </div>

        <div className="mt-8 border-t pt-6 flex justify-between items-center">
          <span className="text-xl font-semibold">
            Total: ₹ {totalAmount}
          </span>

          <button
            onClick={handleCheckout}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
