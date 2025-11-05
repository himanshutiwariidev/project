// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { token, user } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token && user) fetchWishlist();
  }, [token, user]);

  const fetchWishlist = async () => {
    if (!token) return; // 🧠 Prevent unauthorized calls
    try {
      const { data } = await axios.get(`${apiUrl}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(data.products || []);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("⚠️ Not authorized to fetch wishlist, please login again.");
      } else {
        console.error("❌ Error fetching wishlist:", err.response?.data || err);
      }
    }
  };

  const addToWishlist = async (productId) => {
    if (!token || !user) {
      console.warn("⚠️ User not logged in, cannot add to wishlist.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(data.products || []);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("⚠️ Unauthorized (token expired or missing)");
      }
      console.error("❌ Error adding to wishlist:", err.response?.data || err);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token || !user) {
      console.warn("⚠️ User not logged in, cannot remove wishlist.");
      return;
    }
    try {
      const { data } = await axios.delete(`${apiUrl}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(data.products || []);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("⚠️ Unauthorized (token expired or missing)");
      }
      console.error("❌ Error removing from wishlist:", err.response?.data || err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
