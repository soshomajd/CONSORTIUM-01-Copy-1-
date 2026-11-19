import { useEffect } from "react"
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
  const quickOrderActive = location.pathname === "/profile" && new URLSearchParams(location.search).get("section") === "quick"
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
    { label: "خانه", to: "/", asset: mobileHomeIcon },
    { label: "دسته‌بندی", to: "/products", asset: mobileCategoriesIcon },
    { label: "سبد خرید", to: "/cart", asset: mobileCartIcon },
    { label: "سفارش سریع", to: "/profile?section=quick", icon: Zap },
  ]
  return (
    <>
      <nav
        className="storefront-mobile-bottom"
        dir="rtl"
        aria-label="ناوبری موبایل"
      >
        {items.map(({ label, to, icon: Icon, asset }) => (
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
