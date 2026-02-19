import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Admin() {
  const { id } = useParams(); // 🔥 GET ID FROM URL
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    fetchProducts();
  }, []);

  // 🔥 IF URL HAS ID → LOAD PRODUCT
  useEffect(() => {
    if (id) {
      loadProductForEdit(id);
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/products");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const loadProductForEdit = async (productId) => {
    try {
      const res = await axiosInstance.get(`/products/${productId}`);
      const product = res.data.product;

      setEditId(product.id);
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert("Product not found");
      navigate("/admin");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editId) {
        await axiosInstance.put(`/products/edit/${editId}`, payload);
      } else {
        await axiosInstance.post("/products/add", payload);
      }

      resetForm();
      fetchProducts();
      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.msg || "Operation failed");
    }
  };

  const handleEdit = (product) => {
    navigate(`/admin/${product.id}`); // 🔥 REDIRECT INSTEAD OF LOCAL EDIT
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/products/delete/${id}`);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.msg || "Delete failed");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h2>
          <p className="text-gray-500 mt-2">
            Manage your products
          </p>
        </div>

        {/* Edit Mode Indicator */}
        {editId && (
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500">
            Editing Product ID: {editId}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-semibold mb-6">
            {editId ? "Edit Product" : "Add New Product"}
          </h3>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border rounded-lg px-4 py-3"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="border rounded-lg px-4 py-3"
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
              className="border rounded-lg px-4 py-3"
              required
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border rounded-lg px-4 py-3 md:col-span-2"
              required
            />

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
              >
                {editId ? "Update Product" : "Add Product"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center p-4 border rounded-lg mb-3"
              >
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">
                    ₹ {p.price} | Stock: {p.stock}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
