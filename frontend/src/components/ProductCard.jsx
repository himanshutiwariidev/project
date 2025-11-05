import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useUI } from "../context/UIContext";
import { FaCartPlus, FaEye } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { setShowCartSidebar } = useUI();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    if (window.innerWidth >= 768) setShowCartSidebar(true);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product);
    window.scrollTo(0, 0);
    navigate("/checkout", {
      state: {
        cartItems: [{ ...product, quantity: 1 }],
        totalAmount: product?.price ?? 0,
      },
    });
  };

  const handleViewDetails = () => {
    navigate(`/product/${product?._id}`);
  };

  const imgSrc = product?.image
    ? `${apiUrl}${product.image}`
    : "https://via.placeholder.com/600x400?text=No+Image";

  const priceText =
    typeof product?.price === "number"
      ? `Rs ${product.price}.00`
      : `Rs ${Number(product?.price || 0)}`;

  return (
    <div className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden" onClick={handleViewDetails}>
        <div className="aspect-square bg-gray-50">
          <img
            src={imgSrc}
            alt={product?.name || "Product"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="bg-white text-black p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200">
              <FaEye className="text-lg" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        {(product?.category || product?.subcategory) && (
          <div className="absolute top-3 left-3">
            <span className="bg-white text-black text-xs px-3 py-1 font-medium tracking-wide uppercase shadow-sm">
              {product?.category}
              {product?.subcategory ? ` / ${product.subcategory}` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 space-y-3" onClick={handleViewDetails}>
        {/* Product Name */}
        <h3 className="text-lg  text-black leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
          {product?.name || "Unnamed Product"}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-md  text-gray-700">
            {priceText}
          </span>
          <span className="text-sm text-gray-500 font-medium tracking-wide uppercase">
            Premium Quality
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 space-y-3">
        {/* Primary CTA */}
        <button
          onClick={handleBuyNow}
          className="w-full bg-black text-white py-3 px-6 font-medium tracking-wide uppercase transition-all duration-200 hover:bg-gray-800 active:bg-gray-900"
        >
          Buy Now
        </button>

        {/* Secondary Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 font-medium tracking-wide uppercase transition-all duration-200 hover:border-gray-400 hover:text-black"
          >
            View Details
          </button>
          
          <button
            onClick={handleAddToCart}
            className="bg-gray-100 text-black p-3 hover:bg-gray-200 transition-colors duration-200 group/cart"
            title="Add to Cart"
          >
            <FaCartPlus className="text-lg group-hover/cart:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;