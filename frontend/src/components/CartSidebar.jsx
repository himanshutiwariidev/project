import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const TIERS = [
  { threshold: 1400, rate: 0.10, label: "10%" },
  { threshold: 2000, rate: 0.15, label: "15%" },
  { threshold: 3000, rate: 0.20, label: "20%" },
];

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const CartSidebar = ({ onClose }) => {
  const { cartItems, removeFromCart, clearCart, updateCartItemQuantity } =
    useContext(CartContext);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [showGift, setShowGift] = useState(false);

  // ---- money math (no vibes, only numbers)
  const {
    subtotal,
    activeTier,
    nextTier,
    discountRate,
    discountAmount,
    finalTotal,
    progressPct,
  } = useMemo(() => {
    const subtotalRaw = cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0
    );

    const active = [...TIERS].filter((t) => subtotalRaw >= t.threshold).pop() || null;
    const next = TIERS.find((t) => subtotalRaw < t.threshold) || null;
    const rate = active ? active.rate : 0;
    const discount = Math.floor(subtotalRaw * rate);
    const total = Math.max(subtotalRaw - discount, 0);

    const maxThreshold = TIERS[TIERS.length - 1].threshold;
    const pct = Math.min((subtotalRaw / maxThreshold) * 100, 100);

    return {
      subtotal: subtotalRaw,
      activeTier: active,
      nextTier: next,
      discountRate: rate,
      discountAmount: discount,
      finalTotal: total,
      progressPct: pct,
    };
  }, [cartItems]);

  // Trigger gift popup at 15% tier
  useEffect(() => {
    if (activeTier?.rate === 0.20) {
      setShowGift(true);
    } else {
      setShowGift(false);
    }
  }, [activeTier]);

  const handleCheckout = () => {
    window.scrollTo(0, 0);
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
        discountRate,
        discountAmount,
        totalAmount: finalTotal,
        appliedTier: activeTier?.label || "0%",
      },
    });
    onClose();
  };

  // helper: clamp quantity at 1+ (because 0 quantity is a breakup)
  const changeQty = (id, delta, currentQty) => {
    if (delta < 0 && currentQty <= 1) return;
    updateCartItemQuantity(id, delta);
  };

  return (
    <div className="fixed top-12 right-0 w-full sm:w-96 h-full bg-white shadow-lg shadow-gray-300 z-50 transition-transform duration-300 transform translate-x-0 overflow-y-auto">
      <div className="p-4 pb-3 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-xl cursor-pointer"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Discount progress section */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Discount progress</span>
            <span>
              {activeTier ? `${activeTier.label} applied` : "No discount yet"}
            </span>
          </div>

          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
            {TIERS.map((t) => {
              const maxT = TIERS[TIERS.length - 1].threshold;
              const left = `${(t.threshold / maxT) * 100}%`;
              const achieved = subtotal >= t.threshold;
              return (
                <div
                  key={t.threshold}
                  className="absolute top-0 -translate-x-1/2"
                  style={{ left }}
                >
                  <div
                    className={`w-0.5 h-3 ${
                      achieved ? "bg-green-700" : "bg-gray-400"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between text-[11px] text-gray-600">
            {TIERS.map((t) => (
              <div
                key={t.threshold}
                className="text-center"
                style={{ width: `${100 / TIERS.length}%` }}
              >
                <div
                  className={`font-medium ${
                    subtotal >= t.threshold ? "text-green-700" : ""
                  }`}
                >
                  {t.label}
                </div>
                <div>{formatINR(t.threshold)}</div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-sm">
            {nextTier ? (
              <span className="text-gray-700">
                {formatINR(nextTier.threshold - subtotal)} aur add karo to{" "}
                {nextTier.label} off mil jayega.
              </span>
            ) : (
              <span className="text-green-700 font-medium">
                Max {TIERS[TIERS.length - 1].label} off applied. Itna kaafi
                discount hai, Warren Buffett bhi nod karega.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 items-center border p-2 rounded"
              >
                <img
                  src={`${apiUrl}${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded bg-gray-100"
                />
                <div className="flex-1">
                  <p className="font-semibold truncate">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatINR(item.price)} × {item.quantity}
                  </p>
                  <div className="flex gap-2 mt-1 items-center">
                    <button
                      onClick={() => changeQty(item._id, -1, item.quantity)}
                      className="px-2 py-0.5 bg-gray-200 rounded"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => changeQty(item._id, 1, item.quantity)}
                      className="px-2 py-0.5 bg-gray-200 rounded"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {formatINR(item.price * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-xs text-red-500 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  Discount {activeTier ? `(${activeTier.label})` : ""}
                </span>
                <span
                  className={
                    discountAmount ? "text-green-700 font-medium" : ""
                  }
                >
                  − {formatINR(discountAmount)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatINR(finalTotal)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 text-red-600 text-sm hover:underline cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🎁 Gift Popup */}
      {showGift && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
            <div className="text-5xl mb-3 animate-bounce">🎁</div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Congratulations!
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              You’ve unlocked a <span className="font-semibold">15% discount</span> and earned a
              surprise gift!
            </p>
            <button
              onClick={() => setShowGift(false)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Claim Gift
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
