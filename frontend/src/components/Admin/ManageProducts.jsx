// src/components/Admin/ManageProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Central map: yahi se options aayenge
const CATEGORY_MAP = {
  men: [
    "regular-tshirt",
    "oversize-tshirt",
    "jin-tshirt",
    "polo-tshirt",
    "formal-shirt",
    "regular-shirt",
    "jeans",
    "joggers",
    "shorts",
    "sweat-shirt",
    "jacket",
    "hoodies",
  ],

  women: [
    "regular-tshirt",
    "polo-tshirt",
    "oversize-tshirt",
    "jeans",
    "jackets",
    "hoodies",
    "sweat-shirt",
  ],

  customize: [
    "hoodies",
    "sweatshirt",
    "regular-tshirt",
    "oversize-tshirt",
    "polo-tshirt",
    "regular-coupletshirt",
    "oversize-coupletshirt",
    "couple-hoodies",
  ],
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: null,
    images: [],
    price: "",
    description: "",
    features: "",
    category: "",
    subcategory: "", // ✅ new
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const axiosAdmin = axios.create({
    baseURL: `${apiUrl}/api/products`,
    headers: {
      authorization: import.meta.env.VITE_ADMIN_TOKEN,
    },
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axiosAdmin.get("/");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("fromDashboard");
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!newProduct.category) throw new Error("Please select a category");
      if (!newProduct.subcategory) throw new Error("Please select a subcategory");

      if (editingId) {
        // ✅ Update via JSON (images optional via separate multipart if you ever add)
        await axiosAdmin.put(`/${editingId}`, {
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
          features: newProduct.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
          category: newProduct.category,
          subcategory: newProduct.subcategory, // ✅ new
        });
      } else {
        // ✅ Create with multipart (images + fields)
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("price", newProduct.price);
        formData.append("description", newProduct.description);
        formData.append("category", newProduct.category);
        formData.append("subcategory", newProduct.subcategory); // ✅ new

        newProduct.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
          .forEach((f) => formData.append("features", f));

        if (newProduct.image) {
          formData.append("image", newProduct.image); // main image
        }

        if (newProduct.images?.length > 0) {
          Array.from(newProduct.images).forEach((img) => {
            formData.append("images", img); // match multer.fields name
          });
        }

        await axiosAdmin.post(`/`, formData);
      }

      // ✅ Proper reset
      setNewProduct({
        name: "",
        image: null,
        images: [],
        price: "",
        description: "",
        features: "",
        category: "",
        subcategory: "", // ✅ reset
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await axiosAdmin.delete(`/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      features: product.features?.join(", ") || "",
      image: null,
      images: [],
      category: product.category || "",
      subcategory: product.subcategory || "", // ✅ prefill subcategory
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // helpers
  const subcats = newProduct.category ? CATEGORY_MAP[newProduct.category] || [] : [];

  return (
    <div className="p-6 max-w-5xl mx-auto py-9">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Products</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleAddProduct}
        className="bg-gray-100 p-6 rounded-lg shadow mb-8"
        encType="multipart/form-data"
      >
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct((p) => ({
                  ...p,
                  category: e.target.value,
                  subcategory: "", // reset subcategory on category change
                }))
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>
                Choose category
              </option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="customize">customize</option>
            </select>
          </div>

          {/* Subcategory ✅ dependent */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
            <select
              value={newProduct.subcategory}
              onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={!newProduct.category}
            >
              <option value="" disabled>
                {newProduct.category ? "Choose subcategory" : "Select category first"}
              </option>
              {subcats.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editingId ? "New Image (optional)" : "Main Image"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
              className="w-full p-2 border rounded"
              required={!editingId}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full p-2 border rounded"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (comma separated)
            </label>
            <input
              type="text"
              value={newProduct.features}
              onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
              className="w-full p-2 border rounded"
              required
              placeholder="e.g. cotton, slim fit, machine-wash"
            />
          </div>

          {/* Gallery Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewProduct({ ...newProduct, images: e.target.files })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div className="mt-4 flex items-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Processing..." : editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewProduct({
                  name: "",
                  image: null,
                  images: [],
                  price: "",
                  description: "",
                  features: "",
                  category: "",
                  subcategory: "", // ✅ clear on cancel
                });
              }}
              className="ml-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Product List</h3>
        {isLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow flex flex-col sm:flex-row items-center justify-between"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  {product.image && (
                    <img
                      src={`${apiUrl}${product.image}`}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-bold">{product.name}</h4>
                    <p className="text-gray-700">₹{product.price}</p>
                    {/* ✅ show category + subcategory */}
                    {(product.category || product.subcategory) && (
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {product.category}
                        {product.subcategory ? ` / ${product.subcategory}` : ""}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    disabled={isLoading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
