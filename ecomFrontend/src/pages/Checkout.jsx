import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { setCartCount } = useCart();

  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // 🔒 Protect route
  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") {
      navigate("/login");
    }
  }, []);

  const handleCheckout = async () => {
    try {
      setProcessing(true);

      const res = await axiosInstance.post("/checkout");

      // 🔥 Instantly clear navbar badge
      setCartCount(0);

      alert("Order placed successfully!");

      navigate("/products");

    } catch (error) {
      alert(error.response?.data?.msg || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Confirm Checkout
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Are you sure you want to place this order?
        </p>

        <div className="flex gap-4">

          <button
            onClick={() => navigate("/cart")}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCheckout}
            disabled={processing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
          >
            {processing ? "Processing..." : "Place Order"}
          </button>

        </div>

      </div>
    </div>
  );
}
