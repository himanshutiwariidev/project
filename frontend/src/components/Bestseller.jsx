import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CATEGORIES = ["men", "women", "customize"];

export default function Bestsellers({
  chunkSize = 4,
  rotateMs = 6000,
}) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // Fetch like ProductList does, per category
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setErr("");
      try {
        console.log("Fetching products from API...");
        
        const responses = await Promise.all(
          CATEGORIES.map((cat) =>
            axios
              .get(`${apiUrl}/api/products`, {
                params: { category: cat },
              })
              .then((r) => {
                const products = Array.isArray(r.data) ? r.data : r.data?.products || [];
                console.log(`Category ${cat}:`, products.length, "products");
                return products;
              })
              .catch((error) => {
                console.log(`Error fetching ${cat}:`, error.message);
                return [];
              })
          )
        );

        const allProducts = responses.flat();
        
        // STRONG Deduplication
        const seen = new Set();
        const deduped = [];
        
        allProducts.forEach((p) => {
          const key = p._id || p.id || `${p.name}-${p.price}-${p.image}`;
          
          if (!key) {
            deduped.push(p);
            return;
          }
          
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(p);
          }
        });

        console.log("After deduplication:", deduped.length, "products");

        // Ab categories ke hisab se filter karo
        const categoryWise = CATEGORIES.map(cat => 
          deduped.filter(p => {
            const productCategory = (p.category || p.gender || p.segment || "").toLowerCase();
            return productCategory.includes(cat);
          })
        );
        
        // Fir interleave aur shuffle karo
        const mixed = interleave(categoryWise);
        const shuffled = knuthShuffle(mixed);

        console.log("Final items:", shuffled.length);

        if (!cancelled) {
          setItems(shuffled);
          setPage(0);
        }
      } catch (e) {
        console.error("Fetch error:", e);
        if (!cancelled) {
          setErr("Bestsellers load karne mein dikkat aa gayi.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  // Auto-rotate - ONLY if we have more than chunkSize products
  useEffect(() => {
    if (paused) return;
    if (items.length <= chunkSize) return;

    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % Math.max(1, totalPages(items.length, chunkSize)));
    }, rotateMs);

    return () => clearInterval(timerRef.current);
  }, [items.length, chunkSize, rotateMs, paused]);

  const slice = useMemo(() => {
    if (items.length === 0) return [];
    
    // Agar products kam hain chunkSize se, toh bas available products show karo
    if (items.length <= chunkSize) {
      return items;
    }
    
    const pages = totalPages(items.length, chunkSize);
    const safePage = page % pages;
    const start = safePage * chunkSize;
    const end = start + chunkSize;
    
    // Normal slice - no wrap around
    return items.slice(start, end);
  }, [items, page, chunkSize]);

  const pagesCount = useMemo(
    () => totalPages(items.length, chunkSize),
    [items.length, chunkSize]
  );

  const goPrev = () => {
    if (items.length <= chunkSize) return; // No navigation if not enough products
    setPage((p) => (p - 1 + pagesCount) % pagesCount);
  };
  
  const goNext = () => {
    if (items.length <= chunkSize) return; // No navigation if not enough products
    setPage((p) => (p + 1) % pagesCount);
  };

  return (
    <section
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Bestsellers</h2>
          <p className="text-gray-600 mt-1">Top picks across Men, Women and Customize</p>
        </div>

        {/* Desktop arrows - ONLY show if we have enough products */}
        {items.length > chunkSize && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
              onClick={goPrev}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <button
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
              onClick={goNext}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: chunkSize }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-3 animate-pulse">
              <div className="w-full aspect-[4/5] bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded mt-3 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && err && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">{err}</div>
      )}

      {!loading && !err && (
        <div className="relative">
          {/* Mobile arrows - ONLY show if we have enough products */}
          {items.length > chunkSize && (
            <div className="sm:hidden flex justify-between mb-3">
              <button
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
                onClick={goPrev}
                aria-label="Previous"
              >
                <FaChevronLeft />
              </button>
              <button
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
                onClick={goNext}
                aria-label="Next"
              >
                <FaChevronRight />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slice.map((p, index) => (
              <BestCard 
                key={`${p._id}-${p.id}-${index}`} 
                product={p} 
                apiUrl={apiUrl} 
              />
            ))}
            
            {/* Agar products kam hain, toh empty spaces show karo */}
            {slice.length < chunkSize &&
              Array.from({ length: chunkSize - slice.length }).map((_, index) => (
                <div key={`empty-${index}`} className="border border-gray-200 rounded-2xl p-3 opacity-0" />
              ))
            }
          </div>

          {/* Dots - ONLY show if we have enough products */}
          {pagesCount > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: pagesCount }).map((_, i) => (
                <button
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${i === page ? "bg-black" : "bg-gray-300"}`}
                  onClick={() => setPage(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ----------------------- sub components & utils ----------------------- */

function BestCard({ product, apiUrl }) {
  const id = product._id || product.id;
  const name = product.name || "Product";
  const price = product.price != null ? Number(product.price) : null;
  const img = product.image ? `${apiUrl}${product.image}` : "/placeholder.png";
  const category =
    product.category || product.gender || product.segment || product.type || "";

  return (
    <Link
      to={`/product/${id}`}
      className="group block border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition"
    >
      <div className="relative w-full aspect-[4/5] bg-gray-50">
        <img
          src={img}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
        {category ? (
          <span className="absolute left-2 top-2 px-2 py-0.5 text-[11px] rounded-full bg-black text-white capitalize">
            {category}
          </span>
        ) : null}
      </div>
      <div className="p-3">
        <div className="text-sm font-medium text-gray-900 truncate">{name}</div>
        {price != null && <div className="text-sm text-gray-700 mt-1">₹{price.toFixed(2)}</div>}
      </div>
    </Link>
  );
}

function interleave(arrays) {
  const max = Math.max(...arrays.map((a) => a.length));
  const out = [];
  for (let i = 0; i < max; i++) {
    for (const arr of arrays) if (arr[i]) out.push(arr[i]);
  }
  return out;
}

function totalPages(total, chunk) {
  return Math.max(1, Math.ceil(total / chunk));
}

function knuthShuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}