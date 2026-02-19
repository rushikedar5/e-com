import { Link } from "react-router-dom";

export default function Footer() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-3">
              ECOM
            </h2>
            <p className="text-gray-500 text-sm">
              A modern e-commerce platform built with
              secure authentication and role-based access.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2 text-gray-600 text-sm">
              <Link to="/products" className="hover:text-blue-600 transition">
                Products
              </Link>

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="hover:text-blue-600 transition"
                >
                  Admin Panel
                </Link>
              )}

              {!user && (
                <>
                  <Link
                    to="/login"
                    className="hover:text-blue-600 transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="hover:text-blue-600 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">
              Contact
            </h3>
            <p className="text-gray-500 text-sm">
              support@ecom.com
            </p>
            <p className="text-gray-500 text-sm">
              +91 98765 43210
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ECOM. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
