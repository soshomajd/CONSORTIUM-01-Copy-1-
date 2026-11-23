import logoImg from "@/imports/LOGO01.png"
import { Link } from "react-router"
import { ArrowLeft, Package, ShieldCheck } from "lucide-react"
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback"
import { homeAssets } from "@/app/components/home/assets"

const F = { fontFamily: "'Vazirmatn', sans-serif" }

const socials = [
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "Telegram",
    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
  {
    label: "Twitter",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Pinterest",
    path: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z",
  },
]

const customerLinks = [
  "شرایط و قوانین",
  "سیاست حریم خصوصی",
  "سوالات متداول",
  "آموزش ثبت سفارش",
]
const quickLinks = ["محصولات", "برندها", "درباره ما", "تماس با ما"]
const socialOrder = ["Instagram", "Telegram", "Pinterest", "YouTube"]

export function Footer({ home = false }: { home?: boolean }) {
  return (
    <footer
      dir="rtl"
      className={`storefront-footer mx-auto mt-6 mb-24 w-[calc(100%-2rem)] max-w-[1380px] sm:mb-6 sm:w-[calc(100%-3rem)] ${
        home ? "reference-home-footer" : ""
      }`}
      style={home ? { fontFamily: "HomeIRANSans, Vazirmatn, sans-serif" } : F}
    >
      <div className="grid gap-8 rounded-[26px] bg-[#2D1E3E] px-6 py-8 text-white sm:grid-cols-2 sm:px-[34px] xl:min-h-[310px] xl:grid-cols-[1.1fr_.65fr_.65fr_1.15fr]">
        <div className="footer-company flex min-w-0 flex-col items-start gap-5">
          <ImageWithFallback
            src={home ? homeAssets[0] : logoImg}
            alt="کنسرسیوم کاغذدیواری"
            className="h-10 w-[140px] object-contain brightness-0 invert"
          />
          <p className="text-justify text-sm font-semibold leading-[1.65]">
            کنسرسیوم، یک فروشگاه آنلاین واحد در صنعت کاغذ دیواری است که برندهای
            مختلف کاغذ دیواری، فروشندگان، عاملان فروش و فعالان حوزه‌ی کاغذ دیواری
            را در یک فضای دیجیتال گرد هم می‌آورد. در کنسرسیوم می‌توانید کاغذ
            دیواری‌ها و آلبوم‌های برندهای حاضر را در یک سایت مشاهده کنید، موجودی
            کدها را بررسی کنید، استعلام بگیرید و سفارش خود را از مسیری مشخص و
            رسمی ثبت کنید.
          </p>
        </div>
        <div className="footer-links pt-3">
          <h2 className="mb-5 text-sm font-semibold text-[#CA165C]">
            خدمات مشتریان
          </h2>
          <ul className="space-y-3">
            {customerLinks.map((label) => (
              <li
                key={label}
                className="flex items-center justify-between gap-4 text-sm font-semibold"
              >
                <span>{label}</span>
                <ArrowLeft size={16} aria-hidden="true" className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-links pt-3">
          <h2 className="mb-5 text-sm font-semibold text-[#CA165C]">
            دسترسی سریع
          </h2>
          <ul className="space-y-3">
            {quickLinks.map((label) => (
              <li
                key={label}
                className="flex items-center justify-between gap-4 text-sm font-semibold"
              >
                {label === "محصولات" ? (
                  <Link
                    to="/products"
                    className="rounded-sm hover:text-[#CA165C] focus-visible:outline-2 focus-visible:outline-white"
                  >
                    {label}
                  </Link>
                ) : (
                  <span>{label}</span>
                )}
                <ArrowLeft size={16} aria-hidden="true" className="shrink-0" />
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-socials flex min-w-0 flex-col items-center justify-end gap-7 xl:items-end">
          <div
            aria-label="محل نمایش نماد اعتماد الکترونیکی"
            className="footer-trust flex size-[94px] shrink-0 flex-col items-center justify-center rounded-[24px] bg-white text-center text-[#315C9C] xl:mr-auto xl:ml-[14px]"
          >
            {home ? (
              <img
                src={homeAssets[134]}
                alt="نماد اعتماد الکترونیکی"
                className="w-16 object-contain"
              />
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="h-11 font-serif text-[60px] leading-[.7] italic"
                >
                  ℯ
                </span>
                <span className="mt-1 text-[9px] font-black tracking-tight text-gray-700">
                  eNAMAD.ir
                </span>
                <span
                  aria-hidden="true"
                  className="text-[10px] tracking-[-1px] text-amber-500"
                >
                  ★★★★★
                </span>
                <span className="text-[5px] text-gray-500">
                  نماد اعتماد الکترونیکی
                </span>
              </>
            )}
          </div>
          <div
            dir="ltr"
            className="footer-social-links flex max-w-full flex-wrap justify-center gap-2 xl:flex-nowrap"
          >
            {home ? (
              [15, 16, 14, 17, 18, 19, 20].map((index, order) => (
                <button
                  key={index}
                  type="button"
                  aria-label={
                    [
                      "اینستاگرام",
                      "تلگرام",
                      "پینترست",
                      "یوتیوب",
                      "آپارات",
                      "روبیکا",
                      "بله",
                    ][order]
                  }
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <img
                    src={`/images/home-reference/footer-social-${index}.svg`}
                    alt=""
                    className="size-6"
                  />
                </button>
              ))
            ) : (
              <>
                {socialOrder.map((label) => {
                  const social = socials.find((item) => item.label === label)!
                  return (
                    <button
                      key={label}
                      type="button"
                      aria-label={label}
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="size-6 fill-current"
                      >
                        <path d={social.path} />
                      </svg>
                    </button>
                  )
                })}
                <button
                  type="button"
                  aria-label="آپارات"
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-6 items-center justify-center rounded-full border-2 border-white text-base leading-none"
                  >
                    ✿
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="روبیکا"
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Package size={24} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="ایتا"
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ShieldCheck size={24} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 text-right text-[13px] font-normal leading-6 text-gray-300">
        © تمامی حقوق مادی و معنوی این سایت برای{" "}
        <span className="font-semibold text-[#CA165C]">
          کنسرسیوم کاغذدیواری
        </span>{" "}
        محفوظ است.
      </p>
    </footer>
  )
}
