import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-linear-to-br from-gray-100 to-gray-200">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to ECOM
        </h1>

        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          A modern e-commerce platform with secure authentication,
          role-based access, and full product management.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition"
          >
            Browse Products
          </Link>

          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg text-lg transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">

          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Secure Authentication
            </h3>
            <p className="text-gray-500">
              JWT-based login system with role-based access control.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Product Management
            </h3>
            <p className="text-gray-500">
              Admin can create, edit, and delete products easily.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Modern UI
            </h3>
            <p className="text-gray-500">
              Clean and responsive interface built with Tailwind CSS.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
