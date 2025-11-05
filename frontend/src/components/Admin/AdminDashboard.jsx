import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  useEffect(() => {
    sessionStorage.removeItem("fromLogin");
  }, []);

  const navigate = useNavigate();

  const goToProducts = () => {
    sessionStorage.setItem("fromDashboard", "true");
    navigate("/admin/products");
  };

  const goToOrders = () => {
    sessionStorage.setItem("fromDashboard", "true");
    navigate("/admin/orders");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        <div className="space-x-4 space-y-4">
          <button
            onClick={goToProducts}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Manage Products
          </button>
          <button
            onClick={goToOrders}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
