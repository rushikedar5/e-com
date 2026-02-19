import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  // 🔒 Protect page
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
    }
  }, []);

  // Fetch product
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      alert(error.response?.data?.msg || "Product not found");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await axiosInstance.put(`/products/edit/${id}`, {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock),
      });

      alert("Product updated successfully");
      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.msg || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-2">
          Edit Product
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Product ID: <span className="font-semibold">{id}</span>
        </p>

        <form onSubmit={handleUpdate} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition disabled:bg-gray-400"
            >
              {updating ? "Updating..." : "Update Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
