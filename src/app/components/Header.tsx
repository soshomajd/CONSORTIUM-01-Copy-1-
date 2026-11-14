import { useState, useRef, useEffect } from "react";
import { getCartCount } from "@/app/lib/cart";
import { getCart } from "@/app/store/cart";
import { useNavigate, Link } from "react-router";
import { ShoppingCart, User, Search, Menu, X, ChevronDown, ChevronLeft } from "lucide-react";
import logoImg from "@/imports/LOGO01.png";
import roll2 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import demoImg1 from "@/imports/202054447-mockup3.jpg";
import demoImg2 from "@/imports/202057-mockup3.jpg";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { saveCart } from "@/app/store/cart";

const DEMO_ITEMS = [
  { id: "demo-1", name: "کاغذ دیواری طرح مارموریت", code: "13120-A", unitPrice: 285000, qty: 1, img: demoImg1 },
  { id: "demo-2", name: "کاغذ دیواری طرح هندسی مدرن", code: "13120-B", unitPrice: 320000, qty: 2, img: demoImg2 },
];

const F = { fontFamily: "'Vazirmatn', sans-serif" };
const navLinks = ["برند", "خرید محصولات", "درباره ما", "تماس با ما"];

export function getUser(): string | null {
  return localStorage.getItem("consortiumUser");
}

export function setUser(name: string) {
  localStorage.setItem("consortiumUser", name);
}

export function clearUser() {
  localStorage.removeItem("consortiumUser");
}


export function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUserState] = useState<string | null>(getUser);
  const [cartCount, setCartCount] = useState(getCartCount);
  const [cartItems, setCartItems] = useState(getCart);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pre-populate cart with demo items on first load
    const existing = getCart();
    if (existing.length === 0) {
      saveCart(DEMO_ITEMS);
      const total = DEMO_ITEMS.reduce((s, i) => s + i.qty, 0);
      localStorage.setItem("cartCount", String(total));
      window.dispatchEvent(new Event("cartUpdate"));
    }

    const onStorage = () => setUserState(getUser());
    const onCart = () => { setCartCount(getCartCount()); setCartItems(getCart()); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdate", onCart);
    setUserState(getUser());
    setCartCount(getCartCount());
    setCartItems(getCart());
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdate", onCart);
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setCartOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    clearUser();
    setUserState(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const fmt = (n: number) => n.toLocaleString("fa-IR");

  return (
    <header className="bg-white sticky top-0 z-50" style={F}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo — right */}
          <div className="shrink-0 cursor-pointer" onClick={() => navigate("/")}>
            <ImageWithFallback src={logoImg} alt="کنسرسیوم کاغذدیواری" className="h-14 w-auto object-contain" />
          </div>

          {/* Center: search + nav */}
          <div className="flex-1 flex items-center justify-center gap-6">
            <div className="hidden md:flex items-center border border-gray-300 rounded-full px-4 py-2 gap-2 w-52">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="جستجوی کد، آلبوم"
                className="bg-transparent text-sm placeholder-gray-400 outline-none w-full text-right"
                style={F}
              />
            </div>
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(l => (
                l === "خرید محصولات" ? <Link key={l} to="/products" className="text-sm text-gray-700 hover:text-[#3d1a6e] px-3 py-2 rounded-lg hover:bg-purple-50 transition-all font-medium whitespace-nowrap" style={F}>{l}</Link> :
                <button key={l} className="text-sm text-gray-700 hover:text-[#3d1a6e] px-3 py-2 rounded-lg hover:bg-purple-50 transition-all font-medium whitespace-nowrap" style={F}>{l}</button>
              ))}
              <button
                onClick={() => navigate("/discounts")}
                className="text-sm font-bold text-white px-4 py-2 rounded-lg whitespace-nowrap transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#370080", ...F }}
              >
                تخفیفات
              </button>
            </nav>
          </div>

          {/* Left: auth + user icon + cart */}
          <div className="flex items-center gap-3 text-gray-600 shrink-0">

            {/* Auth area */}
            {user ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-1 text-sm text-gray-800 font-medium hover:text-[#370080] transition-colors"
                style={F}
              >
                کاربر سایت
              </button>
            ) : (
              <Link to="/login" className="text-sm text-gray-700 font-medium hover:text-[#3d1a6e]" style={F}>
                ورود
              </Link>
            )}

            {/* User icon */}
            <button className="hover:text-[#3d1a6e] transition-colors">
              <User size={22} />
            </button>

            {/* Cart icon + mini-dropdown */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setCartOpen(o => !o)}
                className="hover:text-[#3d1a6e] transition-colors relative"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-[#3d1a6e] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount.toLocaleString("fa-IR")}
                  </span>
                )}
              </button>

              {/* Mini cart dropdown */}
              {cartOpen && (
                <div
                  className="absolute left-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  style={{ direction: "rtl", ...F }}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    {/* right: count */}
                    <span className="text-sm font-bold text-gray-800">{fmt(cartItems.length)} کالا</span>
                    {/* left: view cart */}
                    <button
                      onClick={() => { setCartOpen(false); navigate("/cart"); }}
                      className="flex items-center gap-1 text-sm font-semibold hover:text-[#00695c] transition-colors text-[#4141d9]"
                      style={F}
                    >
                      مشاهده سبد خرید
                      <ChevronLeft size={15} />
                    </button>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-50">
                    {cartItems.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6" style={F}>سبد خرید خالی است</p>
                    ) : cartItems.map(item => (
                      <div key={item.code} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                          <ImageWithFallback
                            src={(item as any).img || roll2}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-right min-w-0" style={F}>
                          <p className="text-sm font-bold text-gray-800 leading-snug truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">کد: {item.code}</p>
                          <p className="text-xs text-gray-400">{fmt(item.qty)} عدد</p>
                        </div>
                        <div className="text-left shrink-0" style={F}>
                          <p className="text-sm font-bold text-[#000000]">{fmt(item.unitPrice * item.qty)}</p>
                          <p className="text-[10px] text-gray-400">تومان</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                    {/* label — right */}
                    <span className="text-sm text-gray-600 font-medium" style={F}>مبلغ قابل پرداخت:</span>
                    {/* price button — left */}
                    <button
                      onClick={() => { setCartOpen(false); navigate("/cart"); }}
                      className="text-white text-sm font-black px-4 py-2 transition-colors"
                      style={{ ...F, backgroundColor: "#370080", borderRadius: 15 }}
                    >
                      {fmt(cartItems.reduce((s, i) => s + i.unitPrice * i.qty, 0))} تومان
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="lg:hidden text-gray-600 hover:text-[#3d1a6e]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>
      <div className="h-px bg-gray-100" />
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3">
          {navLinks.map(l => l === "خرید محصولات" ? <Link key={l} to="/products" onClick={() => setMobileMenuOpen(false)} className="flex w-full text-sm text-gray-700 py-3 border-b border-gray-50 last:border-0" style={F}>{l}</Link> : <button key={l} className="flex w-full text-sm text-gray-700 py-3 border-b border-gray-50 last:border-0" style={F}>{l}</button>)}
        </div>
      )}
    </header>
  );
}
