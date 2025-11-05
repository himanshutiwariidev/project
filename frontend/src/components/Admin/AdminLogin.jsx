import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoPersonCircle } from "react-icons/io5";
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use full URL if no proxy setup
      const response = await axios.post(`${apiUrl}/api/admin/login`, { username, password });

      
     if (response.data.success) {
  localStorage.setItem("isAdmin", "true");
  sessionStorage.setItem("fromLogin", "true"); // ✅ This is crucial
  console.log("Login success, redirecting...");
  navigate("/admin/dashboard");


      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
       <div className="flex justify-center text-6xl text-blue-600 mb-2"> <IoPersonCircle/></div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
