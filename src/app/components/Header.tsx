import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { useReducedMotion } from "motion/react"
import { Search, X, ChevronLeft } from "lucide-react"
import { getCartCount } from "@/app/lib/cart"
import { MobileNavigation } from "./MobileNavigation"
import { getCart } from "@/app/store/cart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback"
import { homeAssets as assets } from "@/app/components/home/assets"
import "@/styles/home-reference.css"

const notificationIcon = `${import.meta.env.BASE_URL}images/header/account-notifications.png`

export function getUser(): string | null {
  return localStorage.getItem("consortiumUser")
}
export function setUser(name: string) {
  localStorage.setItem("consortiumUser", name)
}
export function clearUser() {
  localStorage.removeItem("consortiumUser")
}

export function openMobileProfileMenu() {
  window.dispatchEvent(new Event("openMobileProfileMenu"))
}

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const [announcement, setAnnouncement] = useState(true)
  const [query, setQuery] = useState("")
  const [cartCount, setCartCount] = useState(getCartCount)
  const [cartItems, setCartItems] = useState(getCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const user = getUser()
  useEffect(() => {
    const openMenu = () => {
      if (window.matchMedia("(max-width: 1023px)").matches) setMobileMenuOpen(true)
    }
    window.addEventListener("openMobileProfileMenu", openMenu)
    return () => window.removeEventListener("openMobileProfileMenu", openMenu)
  }, [])
  useEffect(() => {
    const update = () => {
      setCartCount(getCartCount())
      setCartItems(getCart())
    }
    window.addEventListener("cartUpdate", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("cartUpdate", update)
      window.removeEventListener("storage", update)
    }
  }, [])
  useEffect(() => {
    const element = headerRef.current
    if (!element) return
    const update = () =>
      document.documentElement.style.setProperty(
        "--storefront-header-height",
        element.getBoundingClientRect().height + "px",
      )
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty(
        "--storefront-header-height",
      )
    }
  }, [])
  useEffect(() => {
    setCartOpen(false)
    setAccountOpen(false)
    setCartItems(getCart())
    setCartCount(getCartCount())
  }, [location.pathname, location.search])
  useEffect(() => {
    if (location.pathname !== "/" || location.hash !== "#home-brands") return
    const frame = requestAnimationFrame(() =>
      document.getElementById("home-brands")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      }),
    )
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash, reduceMotion])
  function goTo(id: string) {
    if (location.pathname !== "/") {
      navigate("/#" + id)
      return
    }
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
  }
  function submitSearch(event: FormEvent) {
    event.preventDefault()
    navigate(
      query.trim() === "6135"
        ? "/product/6135"
        : `/products${
            query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""
          }`,
    )
  }
  const search = (
    <form className="home-search" role="search" onSubmit={submitSearch}>
      <input
        aria-label="جستجوی کد، آلبوم"
        placeholder="جستجوی کد، آلبوم"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" aria-label="جستجو">
        <Search size={22} strokeWidth={1.8} />
      </button>
    </form>
  )

  return (
    <>
      <div className="storefront-header-spacer" aria-hidden="true" />
      <header ref={headerRef} className="storefront-header" dir="rtl">
        <div className="home-header home-container">
          {announcement && (
            <div className="home-announcement">
              <picture>
                <source media="(min-width: 1024px)" srcSet={assets[1]} />
                <img
                  src={assets[3]}
                  alt="امکان سفارش‌گذاری در کنسرسیوم فعال شد."
                />
              </picture>
              <button
                type="button"
                aria-label="بستن اطلاعیه"
                onClick={() => setAnnouncement(false)}
              >
                <X size={22} />
              </button>
            </div>
          )}
          <div className="home-header-row">
            <Link to="/" aria-label="صفحه اصلی کنسرسیوم" className="home-logo">
              <img src={assets[0]} alt="کنسرسیوم کاغذدیواری" />
            </Link>
            <nav className="home-desktop-navigation" aria-label="منوی اصلی">
              <button type="button" onClick={() => goTo("home-brands")}>
                برند
              </button>
              <Link to="/products">خرید محصولات</Link>
              <button type="button">
                درباره‌ما
              </button>
              <button type="button">
                تماس باما
              </button>
              <Link to="/discounts">تخفیفات</Link>
            </nav>
            <div className="home-desktop-search">{search}</div>
            <div className="home-login">
              <Link to="/profile?section=notifs" aria-label="اعلانات حساب کاربری" className="home-mobile-login-icon">
                <img src={notificationIcon} alt="" width={30} height={30} />
              </Link>
              {user ? (
                <Popover open={accountOpen} onOpenChange={setAccountOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="home-account-label">کاربر سایت</button>
                  </PopoverTrigger>
                  <PopoverContent align="center" sideOffset={12} collisionPadding={12} dir="rtl" aria-label="منوی حساب کاربری" className="header-account-menu w-[106px] rounded-xl border-gray-200 bg-white px-4 py-2 text-center text-[15px] font-normal text-[#1E2939] shadow-[0_4px_20px_rgba(0,0,0,0.08)]" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                    <Link to="/profile?section=profile" onClick={() => setAccountOpen(false)} className="block border-b border-gray-200 py-3 whitespace-nowrap text-[#1E2939] hover:text-[#1E2939] focus-visible:outline-2 focus-visible:outline-[#370080]">پنل مشتری</Link>
                    <button type="button" onClick={() => { clearUser(); setAccountOpen(false); navigate("/login"); }} className="w-full py-3 text-[#CA165C] hover:text-[#CA165C] focus-visible:outline-2 focus-visible:outline-[#370080]">خروج</button>
                  </PopoverContent>
                </Popover>
              ) : <Link to="/login" className="home-account-label">کاربر سایت</Link>}
            </div>
            <div className="home-header-actions">
              <Link
                to="/profile/pricing-details"
                aria-label="سفارش سریع"
                className="home-quick-order"
              >
                <img src={assets[4]} alt="" width={30} height={30} />
              </Link>
              <Popover
                open={cartOpen}
                onOpenChange={(open) => {
                  if (open) {
                    setCartItems(getCart())
                    setCartCount(getCartCount())
                  }
                  setCartOpen(open)
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="home-cart"
                    aria-label={`سبد خرید؛ ${cartCount.toLocaleString("fa-IR")} کالا`}
                  >
                    <img src={assets[5]} alt="" width={30} height={30} />
                    <span>{cartCount.toLocaleString("fa-IR")}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="header-cart-menu"
                  dir="rtl"
                  align="end"
                  sideOffset={12}
                  collisionPadding={12}
                  aria-label="خلاصه سبد خرید"
                >
                  <div className="header-cart-heading">
                    <span>{cartItems.length.toLocaleString("fa-IR")} کالا</span>
                    <Link to="/cart" onClick={() => setCartOpen(false)}>
                      مشاهده سبد خرید <ChevronLeft size={16} />
                    </Link>
                  </div>
                  {cartItems.length ? (
                    <>
                      <div className="header-cart-items">
                        {cartItems.map((item) => (
                          <Link
                            to={`/product/${encodeURIComponent(item.code)}`}
                            key={item.id}
                            className="header-cart-item"
                            onClick={() => setCartOpen(false)}
                          >
                            <ImageWithFallback
                              src={item.img || assets[124]}
                              alt={item.name}
                            />
                            <div className="header-cart-item-details">
                              <p title={item.name}>{item.name}</p>
                              <span>
                                {item.qty.toLocaleString("fa-IR")} عدد
                              </span>
                              <span className="header-cart-item-price">
                                {(item.unitPrice * item.qty).toLocaleString(
                                  "fa-IR",
                                )}{" "}
                                تومان
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="header-cart-total">
                        <span>مبلغ قابل پرداخت:</span>
                        <Link to="/cart" onClick={() => setCartOpen(false)}>
                          {cartItems
                            .reduce(
                              (total, item) =>
                                total + item.unitPrice * item.qty,
                              0,
                            )
                            .toLocaleString("fa-IR")}{" "}
                          تومان
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p className="header-cart-empty">سبد خرید شما خالی است.</p>
                  )}
                </PopoverContent>
              </Popover>
              <Link
                to="/profile?section=notifs"
                aria-label="اعلانات حساب کاربری"
                className="home-account"
              >
                <img src={notificationIcon} alt="" width={30} height={30} />
              </Link>
            </div>
          </div>
          <div className="home-mobile-search">{search}</div>
        </div>
      </header>
      <MobileNavigation
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        user={user}
      />

    </>
  )
}
