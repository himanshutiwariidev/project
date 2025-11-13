// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { FaCartPlus, FaUserCircle, FaChevronDown, FaChevronRight, FaSearch, FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

import imageone from "../assets/banner.png";
import logoImg from "../assets/logo.png";
import formal from "../assets/formal.jpeg";
import hoodies from "../assets/hoodies.avif";
import jacket from "../assets/jacket.jpeg";
import jeans from "../assets/jeans.webp";
import joggers from "../assets/joggers.webp";
import oversize from "../assets/oversizetshirt.avif";
import polo from "../assets/Polo.avif";
import regular from "../assets/regulartshirt.avif";

/* URL structure: /products/men|women|customize and /products/:category/:subcategory */
const SUBCATEGORIES = {
  mens: [
    { label: "Regular T-shirt", path: "/products/men/regular-tshirt", img: regular },
    { label: "Oversize T-shirt", path: "/products/men/oversize-tshirt", img: oversize },
    { label:"Jin T-shirt",       path: "/products/men/jin-tshirt",img:imageone},
    { label: "Polo T-shirt", path: "/products/men/polo-tshirt", img: polo },
    { label: "Formal Shirt", path: "/products/men/formal-shirt", img: formal },
    { label: "Regular Shirt", path: "/products/men/regular-shirt", img: imageone },
    { label: "Jeans", path: "/products/men/jeans", img: jeans },
    { label: "Joggers", path: "/products/men/joggers", img: joggers },
    { label: "Shorts", path: "/products/men/shorts", img: imageone },
    { label: "Sweat Shirt", path: "/products/men/sweat-shirt", img: imageone },
    { label: "Jacket", path: "/products/men/jacket", img: jacket },
    { label: "Hoodies", path: "/products/men/hoodies", img: hoodies },
  ],
  womens: [
    { label: "Regular T-shirts", path: "/products/women/regular-tshirt", img: imageone },
    { label: "Polo T-shirts", path: "/products/women/polo-tshirt", img: imageone },
    { label: "Oversize T-shirts", path: "/products/women/oversize-tshirt", img: imageone },
    { label: "Jeans", path: "/products/women/jeans", img: imageone },
    { label: "Jackets", path: "/products/women/jackets", img: imageone },
    { label: "Hoodies", path: "/products/women/hoodies", img: imageone },
    { label: "Sweat Shirt", path: "/products/women/sweat-shirt", img: imageone },

  ],
  customize: [
    { label: "Hoodies", path: "/products/customize/hoodies", img: imageone },
    { label: "Sweatshirt", path: "/products/customize/sweatshirt", img: imageone },
    { label: "Regular T-shirt", path: "/products/customize/regular-tshirt", img: imageone },
    { label: "Oversize T-shirt", path: "/products/customize/oversize-tshirt", img: imageone },
    { label: "Polo T-shirts", path: "/products/customize/polo-tshirt", img: imageone },
    { label: "Regular CoupleTshirt", path: "/products/customize/regular-coupletshirt", img: imageone },
    { label: "Oversize CoupleTshirt", path: "/products/customize/oversize-coupletshirt", img: imageone },
    { label: "Couple Hoodies", path: "/products/customize/couple-hoodies", img: imageone },

  ],
};

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { wishlist } = useWishlist();



const [displayName, setDisplayName] = useState("");

useEffect(() => {
  // localStorage se naam nikal lo
  const storedName = localStorage.getItem("customUserName");
  if (storedName) {
    setDisplayName(storedName);
  } else if (user?.name) {
    setDisplayName(user.name);
  }
}, [user]);

useEffect(() => {
  const updateName = () => {
    const storedName = localStorage.getItem("customUserName");
    setDisplayName(storedName || user?.name || "");
  };
  window.addEventListener("storage", updateName);
  return () => window.removeEventListener("storage", updateName);
}, [user]);


  const { setShowCartSidebar } = useUI();
  const navigate = useNavigate();
  const itemCount = cartItems.reduce((a, c) => a + c.quantity, 0);
  const apiUrl = import.meta.env.VITE_API_URL;

  // dropdown + menus
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  // mobile search overlay
  const [showSearch, setShowSearch] = useState(false);

  // ---------- helpers ----------
  const handleCartClick = () => {
    setShowCartSidebar(true);
    setIsMenuOpen(false);
    setMobileDropdown(null);
  };

  const handleProfileClick = () => navigate(user ? "/profile" : "/login");

  // Desktop dropdown hover open/close with small delay
  const handleDropdownMouseEnter = (name) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 180);
  };

  // Category click handler
  const handleCategoryClick = (category, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(null);

    const urls = {
      mens: "/products/men",
      womens: "/products/women",
      customize: "/products/customize",
    };

    navigate(urls[category]);
  };

  // Mobile dropdown accordion
  const toggleMobileDropdown = (name) => setMobileDropdown(mobileDropdown === name ? null : name);

  const handleMobileLinkClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setMobileDropdown(null);
  };

  // ---- dropdown panels -----------------------------------------
  const DropdownPanel = ({ children }) => (
    <div
      className={`absolute left-0 mt-3 bg-white/95 backdrop-blur border border-gray-200 shadow-2xl rounded-2xl z-[60]
                  transition-all duration-200 ${activeDropdown ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
      style={{ width: 560, maxHeight: "70vh", overflow: "auto" }}
      onMouseEnter={() => dropdownTimeoutRef.current && clearTimeout(dropdownTimeoutRef.current)}
      onMouseLeave={handleDropdownMouseLeave}
    >
      {children}
    </div>
  );

  // Desktop grid items as Links so click is reliable
  const DropdownGrid = ({ items }) => (
    <div className="grid grid-cols-3 gap-4 p-4">
      {items.map((it) => (
        <Link
          key={it.path}
          to={it.path}
          onClick={() => setActiveDropdown(null)}
          className="group flex flex-col items-start rounded-xl border border-gray-200 hover:border-black hover:shadow-md bg-white transition-all p-3"
        >
          <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
            <img
              src={it.img}
              alt={it.label}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="mt-2 w-full">
            <div className="text-sm font-semibold text-gray-900 group-hover:text-black line-clamp-2 leading-tight">
              {it.label}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  // ---- Search Component ----------------
  const SearchComponent = React.memo(({ isMobile = false }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const inputRef = useRef(null);
    const searchTimerRef = useRef(null);
    const searchAbortRef = useRef(null);

    // Focus input when mobile overlay mounts
    useEffect(() => {
      if (isMobile && inputRef.current) {
        const t = setTimeout(() => inputRef.current?.focus(), 120);
        return () => clearTimeout(t);
      }
    }, [isMobile]);

    const runSearch = (text) => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      if (searchAbortRef.current) searchAbortRef.current.abort();

      const q = (text ?? query).trim();
      if (q.length < 1) {
        setSuggestions([]);
        setSearchLoading(false);
        return;
      }

      searchTimerRef.current = setTimeout(async () => {
        const controller = new AbortController();
        searchAbortRef.current = controller;
        setSearchLoading(true);
        try {
          const res = await axios.get(`${apiUrl}/api/products`, {
            params: { q },
            signal: controller.signal,
          });

          // Relevance sort: exact first, then contains, then alpha
          const qLower = q.toLowerCase();
          const list = (Array.isArray(res.data) ? res.data : res.data?.products || [])
            .sort((a, b) => {
              const aName = (a.name || "").toLowerCase();
              const bName = (b.name || "").toLowerCase();
              if (aName === qLower) return -1;
              if (bName === qLower) return 1;
              const aInc = aName.includes(qLower);
              const bInc = bName.includes(qLower);
              if (aInc && !bInc) return -1;
              if (!aInc && bInc) return 1;
              return aName.localeCompare(bName);
            });

          setSuggestions(list.slice(0, 9));
        } catch {
          setSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      }, 280);
    };

    const handleSuggestionClick = (product) => {
      setQuery("");
      setSuggestions([]);
      navigate(`/product/${product._id}`);
      if (isMobile) setShowSearch(false);
    };

    const hasQuery = query.trim().length > 0;
    const noResults = !searchLoading && hasQuery && suggestions.length === 0;

    return (
      <div className="w-full" onClick={(e) => e.stopPropagation()}>
        <div className={`flex items-center rounded-full px-3 py-2 bg-white ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-black ${isMobile ? "shadow-lg" : ""}`}>
          <FaSearch className="text-gray-500 mr-2 text-base" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            inputMode="search"
            enterKeyHint="search"
            placeholder="Search products..."
            className="w-full outline-none text-base bg-transparent"
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              runSearch(v);
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
              className="text-sm text-gray-500 hover:text-black px-1.5"
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results for mobile and desktop */}
        {(hasQuery && (suggestions.length > 0 || searchLoading || noResults)) && (
          <div className={`mt-3 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden ${isMobile ? "max-h-[65vh] overflow-y-auto" : "absolute left-0 right-0"} z-[70]`}>
            {searchLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
            ) : suggestions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {suggestions.map((p) => (
                  <div
                    key={p._id || p.id || p.slug || p.name}
                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
                    onClick={() => handleSuggestionClick(p)}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                      <img
                        src={p.image ? `${apiUrl}${p.image}` : imageone}
                        alt={p.name || "Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = imageone; }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-900 font-medium truncate">{p.name || "Product"}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-4 text-center text-sm text-gray-600">No products found</div>
            )}
          </div>
        )}
      </div>
    );
  });

  // ---- UI ------------------------------------------------------
  return (
    <nav className="bg-white shadow-sm fixed top-[45px] w-full z-50 border-b border-gray-200">
      {/* 3-column grid keeps logo centered on mobile too */}
      <div className="container mx-auto grid grid-cols-3 items-center px-4 sm:px-6 lg:px-8 py-1 gap-2">
        {/* Left: hamburger on mobile + desktop categories on lg */}
        <div className="flex items-center gap-3 dropdown-container">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-2xl p-1 text-black hover:text-gray-600"
            aria-label="Menu"
          >
            {isMenuOpen ? <RiCloseFill /> : <GiHamburgerMenu />}
          </button>

          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-gray-600 text-sm font-medium uppercase">
              Home
            </Link>

            {/* Mens */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter("mens")}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                onClick={(e) => handleCategoryClick("mens", e)}
                className="flex items-center gap-1 text-black hover:text-gray-600 text-sm font-medium uppercase"
              >
                <span>Mens</span>
                <FaChevronDown className={`text-xs transition-transform ${activeDropdown === "mens" ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel>{activeDropdown === "mens" && <DropdownGrid items={SUBCATEGORIES.mens} />}</DropdownPanel>
            </div>

            {/* Womens */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter("womens")}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                onClick={(e) => handleCategoryClick("womens", e)}
                className="flex items-center gap-1 text-black hover:text-gray-600 text-sm font-medium uppercase"
              >
                <span>Womens</span>
                <FaChevronDown className={`text-xs transition-transform ${activeDropdown === "womens" ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel>{activeDropdown === "womens" && <DropdownGrid items={SUBCATEGORIES.womens} />}</DropdownPanel>
            </div>

            {/* Customize */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter("customize")}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                onClick={(e) => handleCategoryClick("customize", e)}
                className="flex items-center gap-1 text-black hover:text-gray-600 text-sm font-medium uppercase"
              >
                <span>Customize</span>
                <FaChevronDown className={`text-xs transition-transform ${activeDropdown === "customize" ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel>{activeDropdown === "customize" && <DropdownGrid items={SUBCATEGORIES.customize} />}</DropdownPanel>
            </div>
          </div>
        </div>

        {/* Center: logo image always centered */}
        <div className="justify-self-center">
          <Link to="/" className="inline-flex items-center">
            <img src={logoImg} alt="MYRISS" className="h-12 w-auto md:h-15" />
          </Link>
        </div>

        {/* Right: search + cart + profile */}
        <div className="flex items-center justify-end gap-3">
          {/* Mobile search toggle shows full overlay */}
          <button
            className="md:hidden p-2 text-black hover:text-gray-600"
            onClick={() => {
              setShowSearch(true);
              setIsMenuOpen(false);
            }}
            aria-label="Search"
          >
            <FaSearch />
          </button>

          {/* Desktop compact search */}
          <div className="hidden md:block relative">
            <div className="w-[240px]">
              <SearchComponent />
            </div>
          </div>

          <button
            onClick={handleCartClick}
            className="relative flex items-center gap-2 text-black hover:text-gray-600 text-sm font-medium"
            aria-label="Cart"
          >
            <FaCartPlus className="text-xl" />
            {itemCount > 0 && (
              <span className="absolute -top-3 -right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                {itemCount}
              </span>
            )}
          </button>

          {/* wishlist */}
          <button
  onClick={() => navigate("/wishlist")}
  className="hidden md:block relative text-gray-700 hover:text-black transition-colors"
>
  <FaHeart className="text-xl" />
  {wishlist.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
      {wishlist.length}
    </span>
  )}
</button>

<div className="md:hidden">
  <button
    onClick={() => handleMobileLinkClick(user ? "/profile" : "/login")}
    className="flex items-center w-full px-2 py-4 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors text-sm border-b border-gray-100"
  >
    <FaUser className="w-5 h-5" />
  </button>
</div>


          {/* Profile button -> page, not dropdown */}
          <button
            onClick={handleProfileClick}
            className="hidden sm:flex items-center gap-2 text-black hover:text-gray-600"
            aria-label="Profile"
          >
            <FaUserCircle className="text-xl" />
<span className="text-sm font-medium uppercase">{displayName || "Account"}</span>
          </button>
        </div>
      </div>

      {/* Mobile search overlay: fixed, full-width, pretty, and it works */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[2px] md:hidden"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="absolute left-0 right-0 top-0 bg-white rounded-b-2xl shadow-xl p-4 pt-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle vibe */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-200" />
            <SearchComponent isMobile={true} />
            <div className="mt-3 text-right">
              <button
                onClick={() => setShowSearch(false)}
                className="text-sm px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 max-h-screen overflow-y-auto">
          <button
            onClick={() => handleMobileLinkClick("/")}
            className="block w-full text-left px-6 py-4 text-black hover:bg-gray-50 transition-colors border-b border-gray-100 text-sm font-medium uppercase"
          >
            Home
          </button>

          {[
            { key: "mens", title: "Mens", items: SUBCATEGORIES.mens, mainPath: "/products/men" },
            { key: "womens", title: "Womens", items: SUBCATEGORIES.womens, mainPath: "/products/women" },
            { key: "customize", title: "Customize", items: SUBCATEGORIES.customize, mainPath: "/products/customize" },
          ].map((sec) => (
            <div key={sec.key} className="border-b border-gray-100">
              <button
                onClick={() => toggleMobileDropdown(sec.key)}
                className="flex items-center justify-between w-full text-left px-6 py-4 text-black hover:bg-gray-50 transition-colors text-sm font-medium uppercase"
              >
                <span>{sec.title}</span>
                <FaChevronRight className={`transition-transform ${mobileDropdown === sec.key ? "rotate-90" : ""}`} />
              </button>
              {mobileDropdown === sec.key && (
                <div className="bg-gray-50 py-2">
                  {/* Main category link */}
                  <button
                    onClick={() => handleMobileLinkClick(sec.mainPath)}
                    className="w-full text-left px-6 py-3 hover:bg-white transition-colors font-medium border-b border-gray-200"
                  >
                    All {sec.title}
                  </button>
                  {/* Subcategory links */}
                  {sec.items.map((it) => (
                    <button
                      key={it.path}
                      onClick={() => handleMobileLinkClick(it.path)}
                      className="w-full text-left px-6 py-3 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={it.img || imageone} alt={it.label} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-gray-700 text-sm">{it.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div>
            <button
              onClick={() => handleMobileLinkClick(user ? "/profile" : "/login")}
              className="block w-full text-left px-6 py-4 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors text-sm border-b border-gray-100"
            >
              {user ? "Profile" : "Login"}
            </button>
           {/*  {!user && (
              <button
                onClick={() => handleMobileLinkClick("/register")}
                className="block w-full text-left px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Register
              </button>
            )} */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
