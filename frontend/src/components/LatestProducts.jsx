// src/components/LatestProducts.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const LatestProducts = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const trackRef = useRef(null);

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/products/latest?limit=20`);
      setLatestProducts(response.data);
    } catch (error) {
      console.error("Error fetching latest products:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    trackRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    trackRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">New Arrivals</h2>

        <Link 
          to="/products?sort=newest"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All →
        </Link>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse w-40 flex-shrink-0">
              <div className="bg-gray-300 h-48 rounded-lg mb-2"></div>
              <div className="bg-gray-300 h-4 rounded mb-1"></div>
              <div className="bg-gray-300 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : latestProducts.length === 0 ? (
        <p className="text-center text-gray-500">No new products available.</p>
      ) : (
        <div className="relative">

          {/* Left Arrow (desktop only) */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
          >
            <FaChevronLeft />
          </button>

          {/* Scroll Row */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory hide-scrollbar"
          >
            {latestProducts.map((product) => (
              <div
                key={product._id}
                className="w-40 sm:w-48 lg:w-52 flex-shrink-0 snap-start rounded-lg overflow-hidden shadow-lg shadow-gray-200 hover:shadow-md transition-shadow"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={`${apiUrl}${product.image}`}
                    alt={product.name}
                    className="w-full h-44 sm:h-48 object-contain bg-white"
                  />

                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-xs mb-1 capitalize">
                      {product.category}
                      {product.subcategory ? ` • ${product.subcategory}` : ""}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-black">
                        ₹{product.price}
                      </span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Arrow (desktop only) */}
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestProducts;
