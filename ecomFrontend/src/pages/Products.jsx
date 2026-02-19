import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/products");
      setProducts(res.data.products);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axiosInstance.post("/cart", {
        productId,
        quantity: 1,
      });

      fetchCartCount();
    } catch (error) {
      alert(error.response?.data?.msg || "Login required");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">

        {products.map((p) => {
          const isOut = p.stock === 0;
          const isLow = p.stock > 0 && p.stock <= 5;

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">
                {p.name}
              </h3>

              <p className="text-gray-500 text-sm mb-4">
                {p.description}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-blue-600 text-lg">
                  ₹ {p.price}
                </span>

                {/* Stock Badge */}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    isOut
                      ? "bg-red-100 text-red-600"
                      : isLow
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isOut
                    ? "Out of Stock"
                    : isLow
                    ? `Low Stock (${p.stock})`
                    : `In Stock (${p.stock})`}
                </span>
              </div>

              {/* ROLE BASED BUTTONS */}

              {user?.role === "CUSTOMER" && (
                <button
                  onClick={() => handleAddToCart(p.id)}
                  disabled={isOut}
                  className={`w-full py-2 rounded-lg text-white transition ${
                    isOut
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isOut ? "Unavailable" : "Add to Cart"}
                </button>
              )}

              {user?.role === "ADMIN" && (
                <button
                  onClick={() => navigate(`/admin/${p.id}`)}
                  className="w-full py-2 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 transition"
                >
                  Edit Product
                </button>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}
