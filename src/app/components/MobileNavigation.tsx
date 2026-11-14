import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  User,
  Zap,
  Bell,
  Heart,
  RefreshCw,
  ClipboardList,
  CreditCard,
  Wallet,
} from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet"

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
  const navigate = useNavigate()
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const close = () => {
      if (media.matches) onOpenChange(false)
    }
    media.addEventListener("change", close)
    return () => media.removeEventListener("change", close)
  }, [onOpenChange])
  const items = [
    { label: "خانه", to: "/", icon: Home },
    { label: "دسته‌بندی", to: "/products", icon: LayoutGrid },
    { label: "سبد خرید", to: "/cart", icon: ShoppingCart },
    { label: "سفارش سریع", to: "/profile/pricing-details", icon: Zap },
  ]
  return (
    <>
      <nav
        className="storefront-mobile-bottom"
        dir="rtl"
        aria-label="ناوبری موبایل"
      >
        {items.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-current={location.pathname === to ? "page" : undefined}
          >
            <Icon
              size={24}
              strokeWidth={1.8}
              fill={
                to === "/" && location.pathname === "/"
                  ? "currentColor"
                  : "none"
              }
            />
            <span>{label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={location.pathname === "/profile" ? "is-active" : undefined}
        >
          <User size={24} strokeWidth={1.8} />
          <span>پروفایل</span>
        </button>
      </nav>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          dir="rtl"
          className="storefront-account-drawer"
        >
          <div className="storefront-account-heading">
            <SheetTitle>{user || "حساب کاربری"}</SheetTitle>
            <SheetDescription>مدیریت حساب و سفارش‌ها</SheetDescription>
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
