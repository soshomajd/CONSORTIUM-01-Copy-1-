import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Link, useLocation, useNavigate } from "react-router"
import {
  ShoppingCart,
  User,
  Zap,
  Bell,
  Heart,
  RefreshCw,
  ClipboardList,
  CreditCard,
  Wallet,
  ChevronLeft,
} from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet"
import mobileProfileIcon from "@/assets/icons/mobile-nav-profile.svg"
import mobileCartIcon from "@/assets/icons/mobile-nav-cart.svg"
import mobileCategoriesIcon from "@/assets/icons/mobile-nav-categories.svg"
import mobileHomeIcon from "@/assets/icons/mobile-nav-home.svg"

function MobileNavIcon({ src }: { src: string }) {
  return <span aria-hidden="true" className="size-7 shrink-0 bg-current" style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")`, maskSize: "36px 36px", WebkitMaskSize: "36px 36px", maskPosition: "center", WebkitMaskPosition: "center", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }} />
}

const accountLinks = [
  { key: "profile", title: "تنظیمات حساب کاربری", icon: User },
  { key: "orders", title: "سفارش‌ها", icon: ShoppingCart },
  { key: "notifs", title: "اعلانات", icon: Bell },
  { key: "wishlist", title: "علاقه‌مندی‌ها", icon: Heart },
  { key: "quick", title: "سفارش سریع", icon: Zap },
  { key: "return", title: "ثبت درخواست مرجوعی", icon: RefreshCw },
  { key: "returns", title: "لیست درخواست‌های مرجوعی", icon: ClipboardList },
  { key: "statement", title: "صورت حساب", icon: CreditCard },
  { key: "wallet", title: "شارژ کیف پول", icon: Wallet },
]

const siteLinks = [
  { title: "برند", to: "/#home-brands" },
  { title: "خرید محصولات", to: "/products" },
  { title: "درباره ما" },
  { title: "تماس با ما" },
  { title: "تخفیفات", to: "/discounts" },
]

export function MobileNavigation({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: string | null
}) {
  const location = useLocation()
  const [siteMenuOpen, setSiteMenuOpen] = useState(false)
  const categoriesButton = useRef<HTMLButtonElement>(null)
  const quickOrderActive = location.pathname === "/profile" && new URLSearchParams(location.search).get("section") === "quick"
  const navigate = useNavigate()
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const close = () => {
      if (media.matches) {
        onOpenChange(false)
        setSiteMenuOpen(false)
      }
    }
    media.addEventListener("change", close)
    return () => media.removeEventListener("change", close)
  }, [onOpenChange])
  useEffect(() => {
    if (open) setSiteMenuOpen(false)
  }, [open])
  useEffect(() => {
    setSiteMenuOpen(false)
  }, [location.pathname, location.search, location.hash])
  const items = [
    { label: "خانه", to: "/", asset: mobileHomeIcon },
    { label: "دسته‌بندی", to: "/products", asset: mobileCategoriesIcon },
    { label: "سبد خرید", to: "/cart", asset: mobileCartIcon },
    { label: "سفارش سریع", to: "/profile?section=quick", icon: Zap },
  ]
  return (
    <>
      {createPortal(<nav
        className="storefront-mobile-bottom"
        dir="rtl"
        aria-label="ناوبری موبایل"
      >
        {items.map(({ label, to, icon: Icon, asset }) => (
          to === "/products" ? (
            <button
              key={to}
              ref={categoriesButton}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={siteMenuOpen}
              className={siteMenuOpen || location.pathname === to ? "is-active" : undefined}
              onClick={() => {
                onOpenChange(false)
                setSiteMenuOpen(true)
              }}
            >
              <MobileNavIcon src={mobileCategoriesIcon} />
              <span>{label}</span>
            </button>
          ) :
          <Link
            key={to}
            to={to}
            aria-current={location.pathname === to || (to === "/profile?section=quick" && quickOrderActive) ? "page" : undefined}
          >
            {asset ? <MobileNavIcon src={asset} /> : Icon && <Icon size={24} strokeWidth={1.8} />}
            <span>{label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={open || (location.pathname === "/profile" && !quickOrderActive) ? "is-active" : undefined}
        >
          <MobileNavIcon src={mobileProfileIcon} />
          <span>پروفایل</span>
        </button>
      </nav>, document.body)}
      <Sheet open={siteMenuOpen} onOpenChange={setSiteMenuOpen}>
        <SheetContent
          side="right"
          dir="rtl"
          className="storefront-account-drawer storefront-site-drawer"
          onCloseAutoFocus={event => {
            event.preventDefault()
            if (window.matchMedia("(max-width: 1023px)").matches) categoriesButton.current?.focus({ preventScroll: true })
          }}
        >
          <div className="storefront-account-heading">
            <SheetTitle>دسته‌بندی‌ها</SheetTitle>
            <SheetDescription className="sr-only">دسترسی به بخش‌های اصلی کنسرسیوم</SheetDescription>
          </div>
          <nav aria-label="منوی اصلی سایت" className="storefront-account-links">
            {siteLinks.map(({ title, to }) => (
              <button
                type="button"
                key={title}
                onClick={() => {
                  setSiteMenuOpen(false)
                  if (to) navigate(to)
                }}
              >
                <span>{title}</span>
                {to === "/#home-brands" && <ChevronLeft size={14} strokeWidth={1.5} aria-hidden="true" />}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          dir="rtl"
          className="storefront-account-drawer"
        >
          <div className="storefront-account-heading">
            <SheetTitle>{user || "حساب کاربری"}</SheetTitle>
            <SheetDescription>091200000</SheetDescription>
          </div>
          <nav
            aria-label="منوی حساب کاربری"
            className="storefront-account-links"
          >
            {accountLinks.map(({ key, title, icon: Icon }) => (
              <button
                type="button"
                key={key}
                onClick={() => {
                  onOpenChange(false)
                  navigate(`/profile?section=${key}`)
                }}
              >
                <Icon size={25} strokeWidth={1.5} />
                <span>{title}</span>
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
