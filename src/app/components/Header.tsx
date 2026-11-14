import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { useReducedMotion } from "motion/react"
import { Search, X, Bell, ShoppingCart, Zap, ChevronLeft } from "lucide-react"
import { getCartCount } from "@/app/lib/cart"
import { MobileNavigation } from "./MobileNavigation"
import { getCart } from "@/app/store/cart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog"
import { homeAssets as assets } from "@/app/components/home/assets"
import "@/styles/home-reference.css"

export function getUser(): string | null {
  return localStorage.getItem("consortiumUser")
}
export function setUser(name: string) {
  localStorage.setItem("consortiumUser", name)
}
export function clearUser() {
  localStorage.removeItem("consortiumUser")
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [info, setInfo] = useState<"about" | "contact" | null>(null)
  const user = getUser()
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
    setInfo(null)
    setCartOpen(false)
    setCartItems(getCart())
    setCartCount(getCartCount())
  }, [location.pathname])
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
              <button type="button" onClick={() => setInfo("about")}>
                درباره‌ما
              </button>
              <button type="button" onClick={() => setInfo("contact")}>
                تماس باما
              </button>
              <Link to="/discounts">تخفیفات</Link>
            </nav>
            <div className="home-desktop-search">{search}</div>
            <Link
              className="home-login"
              to={user ? "/profile" : "/login"}
              onClick={(event) => {
                if (window.innerWidth < 1024 && user) {
                  event.preventDefault()
                  setMobileMenuOpen(true)
                }
              }}
            >
              <Bell
                className="home-mobile-login-icon"
                size={26}
                strokeWidth={1.5}
              />
              {user ? "کاربر سایت" : "ورود"}
            </Link>
            <div className="home-header-actions">
              <Link
                to="/profile/pricing-details"
                aria-label="سفارش سریع"
                className="home-quick-order"
              >
                <Zap size={25} strokeWidth={1.4} />
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
                    <ShoppingCart size={25} strokeWidth={1.4} />
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
                              <span dir="ltr">{item.code}</span>
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
                to={user ? "/profile" : "/login"}
                aria-label="اعلانات حساب کاربری"
                className="home-account"
              >
                <Bell size={25} strokeWidth={1.4} />
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

      <Dialog
        open={info !== null}
        onOpenChange={(open) => {
          if (!open) setInfo(null)
        }}
      >
        <DialogContent dir="rtl" className="reference-home-dialog rounded-3xl">
          <DialogTitle>
            {info === "about" ? "درباره کنسرسیوم" : "تماس با ما"}
          </DialogTitle>
          <DialogDescription>
            {info === "about"
              ? "کنسرسیوم، خانهٔ برندهای کاغذ دیواری؛ فضایی برای مشاهدهٔ آلبوم‌ها، انتخاب طرح و ثبت سفارش از برندهای عضو."
              : "برای پیگیری سفارش‌ها و ارتباط با پشتیبانی، از پنل کاربری وارد بخش سفارش‌ها شوید."}
          </DialogDescription>
          <Link
            to={info === "about" ? "/products" : "/profile"}
            className="home-dialog-action"
          >
            {info === "about" ? "مشاهده محصولات" : "ورود به پنل کاربری"}
          </Link>
        </DialogContent>
      </Dialog>
    </>
  )
}
