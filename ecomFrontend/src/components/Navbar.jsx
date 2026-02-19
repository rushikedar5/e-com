import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { cartCount } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-blue-600">
          ECOM
        </Link>

        <div className="flex items-center gap-6">

          <Link
            to="/products"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Products
          </Link>

          {user?.role === "CUSTOMER" && (
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-blue-600 transition"
            >
              Cart

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Admin
            </Link>
          )}

          {user && (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
              {user.role}
            </span>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}
