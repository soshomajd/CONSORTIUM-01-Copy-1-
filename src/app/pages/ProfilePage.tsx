import { Fragment, useState, useRef, useEffect } from "react";
import type * as React from "react";
import { useNavigate, useLocation } from "react-router";
import {
  User, ShoppingBag, Bell, Star, Zap, CornerUpLeft, List,
  CreditCard, Wallet, LogOut, Search, CheckCircle2, Plus, Minus, Check,
  Megaphone, Tag, Package, Menu, X, Heart, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Printer, BarChart2, Trash2,
  ClipboardList, RefreshCw, Truck, Home, ShoppingCart, Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { addToCart } from "@/app/lib/cart";
import { clearUser, getUser, openMobileProfileMenu } from "@/app/components/Header";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";
import roll2 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import albumComingSoon from "@/imports/Album-Coming_Soon-V01.png";
import iranMap from "@/imports/Capture02.PNG";
import mapImage from "@/imports/4981369.png";
import abstractShapes from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import trendImg1 from "@/imports/202067-after.jpg";
import trendImg2 from "@/imports/202054447-mockup3.jpg";
import trendImg3 from "@/imports/202057-mockup3.jpg";
import trendImg4 from "@/imports/202084-after.jpg";
import samanLogo from "@/imports/______-______-____-___-____-_____-_____.png";
import parsianLogo from "@/imports/images.jfif";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const F = { fontFamily: "'Vazirmatn', sans-serif" };
const PURPLE = "#370080";

const menuItems = [
  { key: "profile",   label: "تنظیمات حساب کاربری",    icon: User,         color: "",              group: "تنظیمات" },
  { key: "orders",    label: "سفارش‌ها",                 icon: ShoppingBag,  color: "",              group: "داشبورد" },
  { key: "notifs",    label: "اعلانات",                  icon: Bell,         color: "",              group: "داشبورد" },
  { key: "wishlist",  label: "لیست علاقه‌مندی‌ها",       icon: Star,         color: "",              group: "داشبورد" },
  { key: "quick",     label: "سفارش سریع",               icon: Zap,          color: "",              group: "داشبورد" },
  { key: "salesdb",    label: "آمار و ارقام",              icon: BarChart2,    color: "",              group: "داشبورد" },
  { key: "single-roll", label: "فروش تک رولی‌ها",       icon: Package,      color: "",              group: "داشبورد" },
  { key: "return",    label: "ثبت درخواست مرجوعی",       icon: CornerUpLeft, color: "",              group: "تنظیمات" },
  { key: "returns",   label: "لیست درخواست‌های مرجوعی", icon: List,         color: "",              group: "تنظیمات" },
  { key: "statement", label: "صورت حساب",                icon: CreditCard,   color: "",              group: "تنظیمات" },
  { key: "wallet",    label: "کیف پول",                  icon: Wallet,       color: "",              group: "تنظیمات" },
  { key: "logout",    label: "خروج از حساب کاربری",      icon: LogOut,       color: "",              group: "" },
];

const visibleMenuItems = menuItems.filter(({ key }) => key !== "salesdb" && key !== "single-roll");

// ─── Orders ────────────────────────────────────────────────────────────────

type Order = {
  id: string; siteCode: string; deliveryCode: string; amount: number; items: number;
  date: string; delivery: string; status: "paid" | "confirmed" | "cancelled" | "delivered";
  tab: "current" | "review" | "delivered" | "returned" | "cancelled";
};

const mockOrders: Order[] = [
  { id: "141405191", siteCode: "100002", deliveryCode: "DL-۸۸۱۲",  amount: 1500000, items: 1, date: "۱۴۰۵/۴/۹",  delivery: "چهار شنبه ۱۰ تیر ۱۴۰۵",   status: "paid",      tab: "current"   },
  { id: "141405045", siteCode: "100118", deliveryCode: "DL-۷۷۱۲",  amount: 980000,  items: 2, date: "۱۴۰۵/۴/۱۸", delivery: "جمعه ۱۹ تیر ۱۴۰۵",         status: "confirmed", tab: "review"    },
  { id: "141405012", siteCode: "100105", deliveryCode: "DL-۷۶۹۰",  amount: 3200000, items: 3, date: "۱۴۰۵/۴/۱۵", delivery: "سه شنبه ۱۶ تیر ۱۴۰۵",      status: "confirmed", tab: "review"    },
  { id: "141404990", siteCode: "100098", deliveryCode: "DL-۷۵۳۳",  amount: 1750000, items: 1, date: "۱۴۰۵/۳/۲۸", delivery: "شنبه ۳۰ خرداد ۱۴۰۵",        status: "confirmed", tab: "review"    },
  { id: "141403210", siteCode: "100044", deliveryCode: "—",         amount: 860000,  items: 1, date: "۱۴۰۵/۲/۱۰", delivery: "یک شنبه ۱۱ اردیبهشت ۱۴۰۵", status: "cancelled", tab: "cancelled" },
  { id: "141402875", siteCode: "100031", deliveryCode: "DL-۶۱۰۸",  amount: 2450000, items: 2, date: "۱۴۰۵/۱/۲۵", delivery: "سه شنبه ۲۶ فروردین ۱۴۰۵",  status: "delivered", tab: "delivered" },
  { id: "141401540", siteCode: "100018", deliveryCode: "DL-۵۸۷۷",  amount: 1180000, items: 1, date: "۱۴۰۴/۱۲/۱۵", delivery: "شنبه ۱۶ اسفند ۱۴۰۴",      status: "delivered", tab: "delivered" },
];

const orderTabs = [
  { key: "current",   label: "جاری",         count: 1  },
  { key: "review",    label: "در حال بررسی", count: 12 },
  { key: "delivered", label: "تحویل شده",    count: 2  },
  { key: "returned",  label: "مرجوع شده",    count: 0  },
  { key: "cancelled", label: "لغو شده",      count: 1  },
];

function fmt(n: number) { return n.toLocaleString("fa-IR"); }

function ProfileSectionHeading({ children, className = "mb-5" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 items-center justify-between gap-3 ${className}`}>
      <div className="min-w-0">{children}</div>
      <button type="button" onClick={openMobileProfileMenu} aria-label="باز کردن منوی پروفایل" aria-haspopup="dialog" className="flex size-11 shrink-0 items-center justify-center rounded-xl text-[#CA165C] focus-visible:outline-2 focus-visible:outline-[#CA165C] lg:hidden">
        <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
}

function ProfilePagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  const arrowClass = "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-[#CA165C] transition-opacity disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C]";

  return (
    <nav aria-label="صفحه‌بندی" className="mt-6 flex flex-wrap items-center justify-center gap-1.5" dir="rtl" style={F}>
      <button type="button" aria-label="صفحه قبل" disabled={page === 1} onClick={() => onPageChange(page - 1)} className={arrowClass}>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
        <button key={number} type="button" aria-label={`صفحه ${fmt(number)}`} aria-current={page === number ? "page" : undefined} onClick={() => onPageChange(number)}
          className={`flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#CA165C] p-0 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C] ${page === number ? "bg-[#CA165C] font-black text-white" : "bg-white font-normal text-[#CA165C]"}`}>
          {fmt(number)}
        </button>
      ))}
      <button type="button" aria-label="صفحه بعد" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className={arrowClass}>
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], { label: string; cls: string }> = {
    paid: { label: "پرداخت شده", cls: "text-green-600" },
    confirmed: { label: "تایید شده", cls: "text-green-600" },
    cancelled: { label: "لغو شده", cls: "text-red-500" },
    delivered: { label: "تحویل شده", cls: "text-blue-600" },
  };
  const s = map[status];
  return (
    <span className={`flex items-center gap-1 text-sm font-bold ${s.cls}`} style={F}>
      {status !== "cancelled" && <CheckCircle2 size={15} className="shrink-0" />}
      {s.label}
    </span>
  );
}

const SURVEY_QUESTIONS = [
  { q: "کیفیت محصولات دریافتی چطور بود؟", opts: ["عالی", "خوب", "متوسط", "ضعیف"], icons: ["😍", "🙂", "😐", "😞"] },
  { q: "بسته‌بندی محصولات را چگونه ارزیابی می‌کنید؟", opts: ["بسیار مناسب", "مناسب", "معمولی", "نامناسب"], icons: ["📦✨", "📦", "🗂️", "⚠️"] },
  { q: "سرعت ارسال سفارش چطور بود؟", opts: ["خیلی سریع", "سریع", "معمولی", "کند"], icons: ["🚀", "⚡", "🚶", "🐢"] },
  { q: "آیا این خرید را به دیگران توصیه می‌کنید؟", opts: ["قطعاً بله", "احتمالاً بله", "شاید", "خیر"], icons: ["💯", "👍", "🤔", "👎"] },
  { q: "نظرات و پیشنهادات خود را بنویسید", opts: null, icons: null },
];

function SurveyPanel({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(5).fill(null));
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const transitionLocked = useRef(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (transitionTimer.current !== null) clearTimeout(transitionTimer.current);
  }, []);

  const q = SURVEY_QUESTIONS[page];
  const progress = (page / SURVEY_QUESTIONS.length) * 100;

  const goNext = () => {
    if (transitionLocked.current || page >= SURVEY_QUESTIONS.length - 1) return;
    transitionLocked.current = true;
    setAnimDir("out");
    transitionTimer.current = setTimeout(() => {
      setPage(p => Math.min(p + 1, SURVEY_QUESTIONS.length - 1));
      setAnimDir("in");
      transitionLocked.current = false;
      transitionTimer.current = null;
    }, 220);
  };

  const selectOpt = (opt: string) => {
    if (transitionLocked.current) return;
    setAnswers(previous => {
      const next = [...previous];
      next[page] = opt;
      return next;
    });
    if (page < SURVEY_QUESTIONS.length - 1) goNext();
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="flex justify-center mt-3" dir="rtl">
      <div className="w-4/5 rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#f3f4f6" }}>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: submitted ? "100%" : `${progress}%`, backgroundColor: "rgba(252, 252, 253, 0.6)" }} />
        </div>

        <div className="px-6 py-5">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              
              <p className="text-[15px] font-extrabold" style={{ color: "#370080", ...F }}>ممنون از نظر شما!</p>
              <p className="relative -top-5 text-[13px] font-light" style={{ color: "#370080", ...F }}>بازخورد شما برای بهبود خدمات ما بسیار ارزشمند است.</p>
              <button onClick={onClose} className="mt-2 rounded-full px-5 py-2 text-[13px] font-light text-white transition-colors"
                style={{ backgroundColor: "#CA165C", ...F }}>بستن</button>
            </div>
          ) : (
            <div key={page} style={{ animation: `${animDir === "in" ? "surveySlideIn" : "surveySlideOut"} 0.22s ease both` }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={onClose} className="transition-colors"><X size={16} color="#CA165C" /></button>
                <span className="text-xs font-light" style={{ color: "#370080", ...F }}>{"سوال " + ["۱","۲","۳","۴","۵"][page] + " از ۵"}</span>
              </div>

              {/* Question */}
              <p className="mb-4 text-sm font-semibold leading-7" style={{ color: "#370080", ...F }}>{q.q}</p>

              {/* Options or textarea */}
              {q.opts ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {q.opts.map((opt) => (
                      <button key={opt} onClick={() => selectOpt(opt)} disabled={animDir === "out"}
                        className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-2 py-3 text-center focus:border-gray-200"
                        style={F}>
                        <span className="text-sm font-light" style={{ color: "#6a7282" }}>{opt}</span>
                      </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={text} onChange={e => setText(e.target.value)}
                    rows={4} placeholder="نظر خود را اینجا بنویسید..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none"
                    style={{ ...F, color: "#1f2937" }} />
                  <button onClick={handleSubmit}
                    className="self-end text-sm font-black text-white px-6 py-2.5 rounded-xl transition-colors"
                    style={{ backgroundColor: PURPLE, ...F }}>
                    ثبت نظر
                  </button>
                </div>
              )}

              {/* Dots */}
              <div className="flex justify-center gap-1.5 mt-4">
                {SURVEY_QUESTIONS.map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-300"
                    style={{ width: i === page ? 20 : 6, height: 6, backgroundColor: i === page ? PURPLE : "#ffffff" }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes surveySlideIn { from { opacity:0; transform:translateX(18px); } to { opacity:1; transform:translateX(0); } }
        @keyframes surveySlideOut { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-18px); } }
      `}</style>
    </div>
  );
}

function OrderCard({ order, showPay }: { order: Order; showPay: boolean }) {
  const [surveyOpen, setSurveyOpen] = useState(false);
  const statusMap = { paid: { label: "پرداخت شده", bg: "#f0fdf4", color: "#16a34a" }, confirmed: { label: "تایید شده", bg: "#f0fdf4", color: "#16a34a" }, cancelled: { label: "لغو شده", bg: "#fff1f2", color: "#e11d48" }, delivered: { label: "تحویل شده", bg: "#eff6ff", color: "#2563eb" } };
  const s = statusMap[order.status];
  return (
    <div className="pb-2 sm:pb-3 lg:pb-4">
      <div className="relative border border-gray-300 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5" dir="rtl">
          {/* Title row: order code + status badge */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <span className="text-sm font-semibold sm:text-base sm:font-black" style={{ color: "#1E2939", ...F }}>
              کد سفارش: {order.id}
            </span>
            <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold sm:text-base sm:font-black" style={{ backgroundColor: "#fff", color: "#370080", ...F }}>
              {s.label}
            </span>
          </div>
          {/* Order details: amount/date, site/delivery codes, items/dispatch. */}
          <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-6 sm:gap-y-2" style={F}>
            <div data-order-field="amount" className="flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="shrink-0 text-sm font-light text-[#6A7282]">مبلغ:</span>
              <span className="max-w-full break-words text-xs font-medium sm:font-bold leading-5 text-[#1E2939] sm:text-sm">{fmt(order.amount) + " \u062a\u0648\u0645\u0627\u0646"}</span>
            </div>
            <div data-order-field="date" className="flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="shrink-0 text-sm font-light text-[#6A7282]">تاریخ:</span>
              <span className="max-w-full break-words text-xs font-medium sm:font-bold leading-5 text-[#1E2939] sm:text-sm">{order.date}</span>
            </div>
            <div data-order-field="siteCode" className="flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="shrink-0 text-sm font-light text-[#6A7282]">کد سفارش سایت:</span>
              <span className="max-w-full break-words text-xs font-medium sm:font-bold leading-5 text-[#1E2939] sm:text-sm">{order.siteCode}</span>
            </div>
            <div data-order-field="deliveryCode" className="flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="shrink-0 text-sm font-light text-[#6A7282]">کد تحویل:</span>
              <span className="max-w-full break-words text-xs font-medium sm:font-bold leading-5 text-[#1E2939] sm:text-sm">{order.deliveryCode}</span>
            </div>
            <div data-order-field="items" className="flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="shrink-0 text-sm font-light text-[#6A7282]">تعداد اقلام:</span>
              <span className="max-w-full break-words text-xs font-medium sm:font-bold leading-5 text-[#1E2939] sm:text-sm">{fmt(order.items)}</span>
            </div>
            <div data-order-field="delivery" className="flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="shrink-0 text-sm font-light text-[#6A7282]">زمان ارسال:</span>
              <span className="max-w-full break-words text-xs font-medium sm:font-bold leading-5 text-[#1E2939] sm:text-sm">{order.delivery}</span>
            </div>
          </div>

          {/* Timeline — for current, delivered, and review tabs */}
          {(order.tab === "current" || order.tab === "delivered" || order.tab === "review") && (() => {
            const steps = order.tab === "review" ? [
              { label: "ثبت اولیه",        Icon: ClipboardList },
              { label: "در حال بررسی",     Icon: Clock         },
              { label: "در حال پردازش",    Icon: RefreshCw     },
              { label: "آماده ارسال",      Icon: Package       },
              { label: "ارسال شده",        Icon: Truck         },
              { label: "تحویل داده شده",  Icon: Home          },
            ] : [
              { label: "ثبت اولیه",       Icon: ClipboardList },
              { label: "در حال پردازش",   Icon: RefreshCw     },
              { label: "آماده ارسال",     Icon: Package       },
              { label: "ارسال شده",       Icon: Truck         },
              { label: "تحویل داده شده", Icon: Home          },
            ];
            const activeStep = order.tab === "delivered" ? 5 : order.tab === "review" ? 2 : 2;
            return (
              <div className="w-full min-w-0 pb-2" style={{ margin: "21px 0 16px" }}>
                <div className="flex w-full items-start sm:mr-auto sm:max-w-[480px]" style={{ gap: 0 }}>
                  {steps.map(({ label, Icon }, i) => {
                    const stepNum = i + 1;
                    const done = stepNum < activeStep;
                    const active = stepNum === activeStep;
                    const future = stepNum > activeStep;
                    const iconColor = future ? "#d1d5db" : PURPLE;
                    return (
                      <div key={i} className="relative min-w-0 flex-1">
                        <div className="relative z-10 flex w-full flex-col items-center gap-1.5">
                          <div className="flex shrink-0 items-center justify-center rounded-xl transition-all"
                            style={{
                              width: 36, height: 36,
                              backgroundColor: active
                                ? "rgba(55, 0, 128, 0.20)"
                                : done
                                  ? "rgba(55, 0, 128, 0.06)"
                                  : "#f9fafb",
                              boxShadow: "none",
                            }}>
                            <Icon size={16} strokeWidth={future ? 1.8 : 2.2} color={iconColor} />
                          </div>
                          <span className="w-full px-0.5 text-center leading-[18px]" style={{ fontSize: 11, fontWeight: 300, color: future ? "#d1d5db" : PURPLE, ...F }}>
                            {label}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <div aria-hidden="true" style={{ position: "absolute", top: 18, left: "calc(-50% + 18px)", width: "calc(100% - 36px)", height: 2, backgroundColor: "rgba(55, 0, 128, 0.06)", borderRadius: 2 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Bottom row: thumbnails right — buttons left */}
          <div
            className="mt-4 flex flex-col items-stretch justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:gap-0"
            dir="rtl"
          >
            {/* Product thumbnails — right */}
            <div className="flex self-start gap-1.5 sm:self-auto">
              {Array.from({ length: Math.min(order.items, 3) }).map((_, i) => (
                <div key={i} className="h-9 w-9 overflow-hidden rounded-lg border border-gray-100 sm:h-12 sm:w-12">
                  <ImageWithFallback src={roll2} alt="محصول" className="w-full h-full object-cover" />
                </div>
              ))}
              {order.items > 3 && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-xs font-bold sm:h-12 sm:w-12"
                  style={{ backgroundColor: "#f9fafb", color: "#6b7280", ...F }}>
                  +{fmt(order.items - 3)}
                </div>
              )}
            </div>
            {/* Buttons — left */}
            <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:self-auto">
              <button className="inline-flex h-8 min-h-8 items-center justify-center rounded-lg px-[6px] py-[4.8px] sm:h-auto sm:min-h-11 text-xs font-medium sm:font-bold transition-colors sm:px-[9.6px] sm:py-[6px] sm:text-sm" style={{ backgroundColor: "#ffffff", color: "#370080", border: "1px solid #370080", ...F }}>مشاهده صورتحساب</button>
              {order.status === "delivered" && (
                <button onClick={() => setSurveyOpen(o => !o)}
                  className="inline-flex h-8 min-h-8 items-center justify-center rounded-lg px-[6px] py-[4.8px] sm:h-auto sm:min-h-11 text-xs font-medium sm:font-bold transition-colors sm:px-[9.6px] sm:py-[6px] sm:text-sm"
                  style={{ backgroundColor: "#370080", color: "#fff", ...F }}>
                  {surveyOpen ? "بستن نظرسنجی" : "نظرسنجی"}
                </button>
              )}
              {showPay && <button className="inline-flex h-8 min-h-8 items-center justify-center rounded-lg px-[6px] py-[4.8px] sm:h-auto sm:min-h-11 text-xs font-medium sm:font-bold text-white transition-colors sm:px-[9.6px] sm:py-[6px] sm:text-sm" style={{ backgroundColor: "#370080", ...F }}>پرداخت</button>}
              {order.tab !== "cancelled" && order.tab !== "delivered" && (
                <Button
                  className="h-8 min-h-8 rounded-lg bg-brand-pink px-[6px] py-[4.8px] text-xs font-medium sm:font-bold text-white hover:bg-brand-pink/90 hover:text-white sm:h-auto sm:min-h-0 sm:px-[9.6px] sm:py-[6px] sm:text-sm"
                  style={F}
                >
                  لغو سفارش
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Survey panel */}
      <div style={{
        overflow: "hidden",
        maxHeight: surveyOpen ? 540 : 0,
        opacity: surveyOpen ? 1 : 0,
        transform: surveyOpen ? "translateY(0)" : "translateY(-8px)",
        transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease, transform 0.35s ease",
        pointerEvents: surveyOpen ? "auto" : "none",
      }}>
        <div style={{ padding: "16px 0 8px" }}>
          <SurveyPanel orderId={order.id} onClose={() => setSurveyOpen(false)} />
        </div>
      </div>
    </div>
  );
}

const ORDERS_PER_PAGE = 3;

function OrdersSection({ returnRequests }: { returnRequests: ReturnRequest[] }) {
  const [activeTab, setActiveTab] = useState("current");
  const [page, setPage] = useState(1);
  const filtered = mockOrders.filter(o => o.tab === activeTab);
  const totalPages = Math.ceil(filtered.length / ORDERS_PER_PAGE);
  const paginatedOrders = filtered.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);
  return (
    <div className="profile-orders">
      <style>{`
        .profile-orders button:hover {
          background-image: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2));
        }
      `}</style>
      <ProfileSectionHeading>
        <h1 className="text-right text-base font-semibold text-gray-900 sm:text-xl sm:font-black" style={F}>سفارش‌ها</h1>
      </ProfileSectionHeading>
      <div className="h-px bg-gray-100 mb-5" />
      <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 gap-2 mb-6 bg-white sm:py-3">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input type="text" placeholder="جستجو بر اساس کد سفارش، کد سفارش سایت یا شماره حواله" className="min-w-0 flex-1 bg-transparent text-sm font-light text-gray-400 outline-none text-right placeholder:text-gray-400 sm:font-normal" style={{ ...F, fontSize: 14 }} />
      </div>
      <div className="mb-6 flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0">
        {orderTabs.map(({ key, label, count }) => (
          <button key={key} onClick={() => { setActiveTab(key); setPage(1); }}
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-[6px] py-[3.6px] text-sm font-medium transition-all sm:font-semibold sm:gap-1.5 sm:px-[7.2px] sm:py-[4.8px] ${activeTab === key ? "border-[#CA165C] bg-white text-[#CA165C]" : "border-transparent bg-[#370080]/20 text-[#370080]"}`}
            style={F}>
            {label}
            <span className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] sm:h-5 sm:w-5 sm:text-xs"
              style={{ backgroundColor: activeTab === key ? "#CA165C" : "#fff", color: activeTab === key ? "#fff" : "#370080" }}>
              {key === "returned" ? mockReturnRequests.length + returnRequests.length : count}
            </span>
          </button>
        ))}
      </div>
      {activeTab === "returned" ? (
        <ReturnListSection requests={returnRequests} embedded />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16"><ShoppingBag size={40} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm" style={F}>سفارشی در این بخش وجود ندارد</p></div>
          ) : paginatedOrders.map(o => <OrderCard key={o.id} order={o} showPay={activeTab === "review"} />)}
        </div>
      )}
      <ProfilePagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

// ─── Notifications ─────────────────────────────────────────────────────────

type Notif = { id: number; title: string; body: string; date: string; read: boolean; cat: string; icon: typeof Megaphone; };

const mockNotifs: Notif[] = [
  { id: 1, title: "کمپین تابستانه",   body: "آغاز کمپین تابستانه",          date: "۱۴۰۵/۳/۳۱", read: true,  cat: "all", icon: Megaphone },
  { id: 2, title: "آلبوم فری استایل", body: "آلبوم فری استایل منتشر شد...", date: "۱۴۰۵/۴/۱",  read: true,  cat: "all", icon: Package    },
  { id: 3, title: "تخفیف اولین خرید", body: "۲۰٪ تخفیف برای اولین خرید",   date: "۱۴۰۵/۴/۱",  read: false, cat: "discount", icon: Tag },
  { id: 4, title: "موجودی کاغذ دیواری مرمر", body: "محصول مورد نظر شما موجود شد", date: "۱۴۰۵/۴/۵", read: false, cat: "stock", icon: Package },
  { id: 5, title: "وضعیت سفارش ۱۴۱۴۰۵۱۹۱", body: "سفارش شما تأیید و ارسال شد", date: "۱۴۰۵/۴/۹", read: false, cat: "order", icon: ShoppingBag },
];

const PROFILE_COUPONS = [
  { discount: 30, code: "WALL30",    title: "اولین خرید",           desc: "برای خرید از تمام آلبوم‌ها",       expiry: "۱۴۰۳/۱۲/۲۹", minOrder: "۵۰۰,۰۰۰ تومان" },
  { discount: 5,  code: "CARBON5",   title: "آلبوم کربن",           desc: "برای خرید از آلبوم کربن",          expiry: "۱۴۰۳/۰۹/۳۰", minOrder: "۲۰۰,۰۰۰ تومان" },
  { discount: 15, code: "MEMBER15",  title: "باشگاه مشتریان",       desc: "ویژه اعضای باشگاه",                expiry: "۱۴۰۳/۱۰/۱۵", minOrder: "۳۰۰,۰۰۰ تومان" },
  { discount: 30, code: "HYDR30",    title: "آلبوم هیدروژن",        desc: "برای خرید از آلبوم هیدروژن",       expiry: "۱۴۰۳/۱۱/۰۱", minOrder: "۴۰۰,۰۰۰ تومان" },
  { discount: 20, code: "SHIP20",    title: "تخفیف ارسال بهار",     desc: "ارسال رایگان برای سفارش بهار",     expiry: "۱۴۰۳/۱۲/۱۰", minOrder: "۲۵۰,۰۰۰ تومان" },
  { discount: 10, code: "NEXT10",    title: "برند نکست",            desc: "برای تمام محصولات نکست",           expiry: "۱۴۰۳/۰۸/۳۰", minOrder: "۱۵۰,۰۰۰ تومان" },
  { discount: 25, code: "NEXTPREM",  title: "نکست پریمیوم",         desc: "ویژه محصولات پریمیوم نکست",        expiry: "۱۴۰۳/۱۲/۲۹", minOrder: "۶۰۰,۰۰۰ تومان" },
  { discount: 40, code: "FSHIP40",   title: "ارسال ویژه جشنواره",   desc: "ارسال رایگان جشنواره تک‌رولی",    expiry: "۱۴۰۳/۰۷/۳۰", minOrder: "۱۰۰,۰۰۰ تومان" },
  { discount: 15, code: "EXTREME15", title: "اکستریم والز",         desc: "محصولات اکستریم والز",             expiry: "۱۴۰۳/۱۰/۰۱", minOrder: "۳۵۰,۰۰۰ تومان" },
  { discount: 20, code: "EXVIP20",   title: "اکستریم VIP",          desc: "برای مشتریان VIP اکستریم",        expiry: "۱۴۰۳/۱۱/۱۵", minOrder: "۵۰۰,۰۰۰ تومان" },
  { discount: 12, code: "WMASTER12", title: "وال مستر",             desc: "تخفیف ویژه محصولات وال مستر",     expiry: "۱۴۰۳/۱۲/۰۱", minOrder: "۲۸۰,۰۰۰ تومان" },
  { discount: 18, code: "WMGOLD",    title: "وال مستر گلد",         desc: "سری گلد وال مستر",                expiry: "۱۴۰۳/۰۹/۲۰", minOrder: "۴۵۰,۰۰۰ تومان" },
  { discount: 8,  code: "SHIP8",     title: "تخفیف هزینه ارسال",    desc: "تخفیف ارسال برای همه سفارشات",    expiry: "۱۴۰۳/۱۰/۳۰", minOrder: "۱۸۰,۰۰۰ تومان" },
];

const notifTabs = [
  { key: "all",      label: "همه پیام ها"    },
  { key: "order",    label: "وضعیت سفارش"   },
  { key: "discount", label: "تخفیف"          },
  { key: "stock",    label: "موجودی ها"      },
  { key: "points",   label: "امتیازها"       },
];

function CouponCard({ coupon }: { coupon: typeof PROFILE_COUPONS[0] }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="flex items-center py-4">
      <div className="flex items-center gap-2 w-full">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-[-65px] mx-[0px] mt-[-60px] mb-[0px]" style={{ backgroundColor: "#CA165C" }}>
          <Tag size={15} style={{ color: "#fff" }} />
        </div>
        <div className="text-right flex-1" style={F}>
          <p className="font-bold text-gray-900 text-[15px]">{coupon.title} — {coupon.discount}٪ تخفیف</p>
          <p className="text-gray-400 mt-0.5 text-[15px]">{coupon.desc}</p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text- mb-[0px]gray-400 text-[15px] mx-[0px] mt-[-30px] mb-[0px] text-[#99a1af]" style={F}>انقضا: {coupon.expiry}</span>
            <button
              onClick={handleCopy}
              className="font-black rounded-md transition-all text-[15px]"
              style={{
                padding: "10px 10px",
                backgroundColor: copied ? "#CA165C" : "#fff",
                color: copied ? "#fff" : "#CA165C",
                border: "1px dashed #CA165C",
                ...F
              }}
            >
              {copied ? "کپی شد ✓" : coupon.code}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [activeTab, setActiveTab] = useState("all");
  const filtered = activeTab === "all" ? mockNotifs : mockNotifs.filter(n => n.cat === activeTab);

  return (
    <div>
      <ProfileSectionHeading><h1 className="text-right text-[15px] font-black text-gray-900" style={F}>اعلانات</h1></ProfileSectionHeading>
      <div className="h-px bg-gray-100 mb-5" />

      {/* Filter tabs — right aligned (justify-start = visual right in RTL) */}
      <div className="mb-6 flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0">
        {notifTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[15px] font-semibold transition-all sm:px-3 sm:py-2 ${activeTab === key ? "border-[#CA165C] bg-white text-[#CA165C]" : "border-transparent bg-[#370080]/20 text-[#370080]"}`}
            style={F}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Coupon list for discount tab */}
      {activeTab === "discount" ? (
        <div className="flex flex-col divide-y divide-gray-100">
          {PROFILE_COUPONS.map(c => <CouponCard key={c.code} coupon={c} />)}
        </div>
      ) : (
        /* Notif list */
        <div className="flex flex-col divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="text-center py-16"><Bell size={40} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-[15px]" style={F}>اعلانی وجود ندارد</p></div>
          ) : filtered.map(n => (
              <div key={n.id} className={`flex items-center justify-start py-4 ${!n.read ? "opacity-100" : "opacity-60"}`}>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "rgba(55, 0, 128, 0.06)" }}>
                    <Megaphone size={15} style={{ color: "#370080" }} />
                  </div>
                  <div className="text-right" style={F}>
                    <p className="text-[15px] font-semibold text-[#1E2939]">{n.title}</p>
                    <p className="mt-0.5 text-[15px] font-normal text-[#6A7282]">{n.body}</p>
                    <p className="mt-1 text-[15px] font-normal text-[#6A7282]">{n.date}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Quick Order ───────────────────────────────────────────────────────────

type Product = { id: string; name: string; inStock: boolean; price: number | null; };

const allProducts: Product[] = [
  { id: "201005", name: "پنتونکست 201005", inStock: false, price: null },
  { id: "201061", name: "پنتونکست 201061", inStock: false, price: null },
  { id: "202036", name: "کد 202036",    inStock: false, price: null },
  { id: "201051", name: "پنتونکست 201051", inStock: false, price: null },
  { id: "202003", name: "کد 202003",    inStock: false, price: null },
  { id: "202008", name: "کد 202008",    inStock: false, price: null },
  { id: "202037", name: "کد 202037",    inStock: false, price: null },
  { id: "201060", name: "پنتونکست 201060", inStock: false, price: null },
  { id: "201081", name: "پنتونکست 201081", inStock: false, price: null },
  { id: "201084", name: "پنتونکست 201084", inStock: true,  price: 1900000 },
  { id: "201089", name: "پنتونکست 201089", inStock: false, price: null },
  { id: "201003", name: "پنتونکست 201003", inStock: false, price: null },
  { id: "201090", name: "پنتونکست 201090", inStock: true,  price: 2100000 },
  { id: "202010", name: "کد 202010",    inStock: true,  price: 1750000 },
];

const categories = [
  { key: "all",       label: "همه محصولات", bold: true  },
  {
    key: "brands", label: "برندها", bold: false,
    children: ["برند ۱", "برند ۲", "برند ۳"],
  },
  {
    key: "wallpaper", label: "کاغذدیواری", bold: false,
    children: [
      "آلبوم پنتونکست(۱)", "آلبوم پنتونکست(۲)",
      "آلبوم ۲(۲)", "فری استایل (۱)", "آلبوم ۲(۱)",
    ],
  },
  { key: "popular",   label: "پرفروش‌ها",    bold: false },
  { key: "newest",    label: "جدیدترین‌ها",   bold: false },
  { key: "selected",  label: "منتخب",        bold: false },
];

const PAGE_SIZE = 10;

function QuickOrderSection() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [onlyStock, setOnlyStock] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [expandedCat, setExpandedCat] = useState<string | null>("wallpaper");
  const [page, setPage] = useState(1);

  const filtered = allProducts.filter(p => {
    if (onlyStock && !p.inStock) return false;
    if (search && !p.name.includes(search)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setQty = (id: string, val: number) =>
    setQuantities(q => ({ ...q, [id]: Math.max(0, val) }));

  const handleAdd = (product: Product) => {
    const qty = quantities[product.id] ?? 0;
    if (qty > 0 && product.inStock) addToCart(qty);
  };

  return (
    <div>
      <ProfileSectionHeading><h1 className="text-right text-base font-black text-gray-900 sm:text-xl" style={F}>سفارش سریع</h1></ProfileSectionHeading>
      <div className="h-px bg-gray-100 mb-5" />

      <div className="flex min-w-0 flex-col items-stretch gap-4 sm:gap-5 xl:flex-row xl:items-start">

        {/* RIGHT: category sidebar (first in RTL DOM) */}
        <div className="w-full min-w-0 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-[#FCFCFD]/50 xl:w-44">
          <button type="button" onClick={() => setCategoryOpen(open => !open)} aria-expanded={categoryOpen} aria-controls="profile-quick-categories" className="flex min-h-11 w-full items-center gap-3 px-4 py-2 text-right text-sm font-semibold leading-6 text-[#1E2939] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#CA165C] xl:hidden" style={F}><span className="min-w-0 flex-1 text-right">دسته‌بندی</span><ChevronDown size={16} className={`shrink-0 text-[#6A7282] transition-transform ${categoryOpen ? "rotate-180" : ""}`} aria-hidden="true" /></button>
          <div className="hidden border-b border-gray-200 px-4 py-3 text-right text-sm font-semibold leading-6 text-[#1E2939] xl:block" style={F}>دسته‌بندی</div>
          <div id="profile-quick-categories" className={categoryOpen ? "block border-t border-gray-200 xl:border-t-0" : "hidden xl:block"}>
          {categories.map(cat => (
            <div key={cat.key}>
              <button
                onClick={() => cat.children ? setExpandedCat(expandedCat === cat.key ? null : cat.key) : null}
                className="flex min-h-11 w-full items-center justify-between gap-2 px-4 py-2.5 text-right text-[13px] font-light leading-6 text-[#6A7282]"
                style={F}
              >
                <span className="flex-1 text-right">{cat.label}</span>
                {cat.children && (expandedCat === cat.key ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
              </button>
              {cat.children && expandedCat === cat.key && (
                <div className="bg-white border-t border-gray-100">
                  {cat.children.map(child => (
                    <button key={child} className="min-h-10 w-full px-6 py-2 text-right text-[13px] font-light leading-6 text-[#6A7282]" style={F}>
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        </div>

        {/* LEFT: product table */}
        <div className="w-full flex-1 min-w-0">
          {/* Toolbar */}
          <div className="mb-4 flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 min-h-11 w-full min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3">
              <Search size={16} className="shrink-0 text-[#6A7282]" aria-hidden="true" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} type="search" aria-label="جستجو در نام یا کد طرح" placeholder="جستجو در نام یا کد طرح" className="h-full w-full min-w-0 flex-1 bg-transparent text-right text-sm font-light leading-6 text-[#6A7282] outline-none placeholder:text-[#6A7282]" style={{ ...F, fontSize: 14 }} />
            </div>
            <label htmlFor="quick-only-stock" className="flex min-h-8 shrink-0 cursor-pointer items-center gap-2 self-end sm:self-auto" style={F}>
              <span className="text-[13px] font-semibold text-[#CA165C]">فقط موجودها</span>
              <button
                id="quick-only-stock"
                type="button"
                role="switch"
                aria-checked={onlyStock}
                aria-label="فقط محصولات موجود"
                onClick={() => { setOnlyStock(o => !o); setPage(1); }}
                className={`w-10 h-5 rounded-full transition-colors relative ${onlyStock ? "bg-[#CA165C]" : "bg-[#F3F4F6]"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${onlyStock ? "left-0.5" : "right-0.5"}`} />
              </button>
            </label>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full table-fixed border-collapse text-center" style={F}>
              <caption className="sr-only">محصولات سفارش سریع</caption>
              <colgroup>
                <col className="w-[49%] sm:w-[36%]" />
                <col className="w-[34%] sm:w-[26%]" />
                <col className="w-[17%] sm:w-[16%]" />
                <col className="hidden sm:table-column sm:w-[22%]" />
              </colgroup>
              <thead className="bg-[#F4F4F6] text-xs font-semibold leading-5 text-[#1E2939] sm:text-sm">
                <tr>
                  <th scope="col" className="px-2 py-2.5 text-right font-semibold sm:px-3 sm:py-3"><span className="sm:hidden">محصول و قیمت</span><span className="hidden sm:inline">نام محصول</span></th>
                  <th scope="col" className="px-1 py-2.5 font-semibold sm:px-2 sm:py-3">مقدار</th>
                  <th scope="col" className="px-0 py-2.5 font-semibold sm:px-2 sm:py-3">موجودی</th>
                  <th scope="col" className="hidden px-1 py-2.5 font-semibold sm:table-cell sm:px-2 sm:py-3">قیمت</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={4} className="px-3 py-10 text-center text-sm text-[#6A7282]">محصولی یافت نشد</td></tr>
                ) : paginated.map((p, i) => (
                  <tr key={p.id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <th scope="row" className="break-words px-2 py-2.5 text-right text-xs font-normal leading-5 text-[#6A7282] sm:px-3 sm:py-3.5 sm:text-sm sm:font-light"><span className="block">{p.name}</span><span className="mt-1 block whitespace-nowrap text-xs font-light tabular-nums leading-5 sm:hidden"><span className="sr-only">قیمت: </span>{p.price ? fmt(p.price) : "−"}</span></th>
                    <td className="px-0.5 py-2.5 sm:px-2 sm:py-3.5">
                      <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                        <button type="button" aria-label={`افزایش تعداد ${p.name}`} onClick={() => { const q = (quantities[p.id] ?? 0) + 1; setQty(p.id, q); if (p.inStock) addToCart(1); }}
                          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#6A7282] transition-colors hover:border-[#370080] hover:bg-[#370080] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#370080] sm:size-8"><Plus size={14} strokeWidth={1.5} aria-hidden="true" /></button>
                        <span aria-live="polite" aria-atomic="true" className="min-w-3.5 text-center text-xs font-normal tabular-nums text-[#6A7282] sm:min-w-5 sm:text-sm sm:font-light">{fmt(quantities[p.id] ?? 0)}</span>
                        <button type="button" aria-label={`کاهش تعداد ${p.name}`} disabled={(quantities[p.id] ?? 0) === 0} onClick={() => { if ((quantities[p.id] ?? 0) > 0) { setQty(p.id, (quantities[p.id] ?? 0) - 1); if (p.inStock) addToCart(-1); } }}
                          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#6A7282] transition-colors hover:border-[#370080] hover:bg-[#370080] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-[#6A7282] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#370080] sm:size-8"><Minus size={14} strokeWidth={1.5} aria-hidden="true" /></button>
                      </div>
                    </td>
                    <td className={`px-0.5 py-2.5 text-xs font-light leading-5 sm:px-2 sm:py-3.5 sm:text-sm ${p.inStock ? "text-[#370080]" : "text-[#CA165C]"}`}>{p.inStock ? "دارد" : "ندارد"}</td>
                    <td className="hidden whitespace-nowrap px-1 py-2.5 text-xs font-light tabular-nums leading-5 text-[#6A7282] sm:table-cell sm:px-2 sm:py-3.5 sm:text-sm">{p.price ? fmt(p.price) : "−"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <ProfilePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

      </div>
    </div>
  );
}

// ─── Wishlist ──────────────────────────────────────────────────────────────

type WishItem = { id: number; name: string; code: string; price: string; img: string; };

const mockWishlist: WishItem[] = [
  { id: 1, name: "پنتونکست", code: "201083", price: "۲،۰۰۰", img: roll2 },
  { id: 2, name: "موج آبی",  code: "212002", price: "۲،۶۰۰", img: roll2 },
];

function WishlistSection() {
  const [items, setItems] = useState<WishItem[]>(mockWishlist);
  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <div>
      <ProfileSectionHeading><h1 className="text-right text-base font-black text-gray-900 sm:text-xl" style={F}>
        لیست علاقه مندی ها <span className="text-gray-400 font-normal text-base">({items.length})</span>
      </h1></ProfileSectionHeading>
      <div className="h-px bg-gray-100 mb-5" />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart size={40} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm" style={F}>لیست علاقه‌مندی‌های شما خالی است</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 border border-gray-200 rounded-2xl p-3 sm:p-4 bg-white hover:shadow-sm transition-shadow">
              {/* Text — right side (first in RTL) */}
              <div className="flex-1 text-right" style={F}>
                <p className="text-sm font-bold text-gray-800">{item.name} {item.code}</p>
                <p className="text-sm text-gray-500 mt-2.5">- {item.price} تومان</p>
              </div>
              {/* Image + X — left side (last in RTL) */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-gray-100">
                  <ImageWithFallback src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#CA165C] text-white shadow transition-colors hover:bg-[#D5457D]"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Return Request ────────────────────────────────────────────────────────

type ReturnProduct = { id: string; name: string; };

const returnableProducts: ReturnProduct[] = [
  { id: "201001", name: "پنتونکست 201001" },
  { id: "201002", name: "پنتونکست 201002" },
  { id: "201005", name: "پنتونکست 201005" },
  { id: "201050", name: "پنتونکست 201050" },
  { id: "201051", name: "پنتونکست 201051" },
  { id: "201060", name: "پنتونکست 201060" },
  { id: "201061", name: "پنتونکست 201061" },
  { id: "201083", name: "پنتونکست 201083" },
  { id: "201084", name: "پنتونکست 201084" },
  { id: "201089", name: "پنتونکست 201089" },
  { id: "201090", name: "پنتونکست 201090" },
];

type ReturnItem = { product: ReturnProduct; qty: number; };

export type ReturnRequest = {
  id: string; date: string; items: ReturnItem[]; status: "pending" | "approved" | "rejected"; shippingMethod?: string;
};

function ReturnRequestSection({ onSubmit }: { onSubmit: (req: ReturnRequest) => void }) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingMethodOpen, setShippingMethodOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const shippingDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (shippingDropRef.current && !shippingDropRef.current.contains(e.target as Node)) setShippingMethodOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = returnableProducts.filter(p =>
    p.name.includes(search) || p.id.includes(search)
  );

  const selectProduct = (p: ReturnProduct) => {
    if (!items.find(i => i.product.id === p.id)) {
      setItems(prev => [...prev, { product: p, qty: 1 }]);
    }
    setSearch("");
    setDropdownOpen(false);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id));
  const setQty = (id: string, val: number) =>
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(1, val) } : i));

  const handleSubmit = () => {
    if (items.length === 0 || !shippingMethod) return;
    onSubmit({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("fa-IR"),
      items,
      status: "pending",
      shippingMethod,
    });
    setItems([]);
    setShippingMethod("");
  };

  return (
    <div>
      <ProfileSectionHeading><h1 className="text-right text-base font-black text-gray-900 sm:text-xl" style={F}>ثبت درخواست مرجوعی</h1></ProfileSectionHeading>
      <div className="h-px bg-gray-100 mb-5" />

      {/* Shipping method and product search */}
      <div className="mb-5 flex items-end gap-4">
        <div className="flex w-2/5 flex-col gap-2">
          <label className="text-right text-sm font-semibold text-[#1E2939]" style={F}>انتخاب شیوه ارسال</label>
          <div className="relative w-full" ref={shippingDropRef}>
          <button
            type="button"
            onClick={() => setShippingMethodOpen(open => !open)}
            className="flex h-11 w-full min-w-[100px] items-center justify-between gap-2 rounded-xl border border-gray-300 bg-[#FCFCFD]/50 px-3 text-right text-sm font-light text-[#6A7282]"
            style={F}
          >
            <span>{shippingMethod === "smart-distribution" ? "توزیع هوشمند" : "انتخاب کنید"}</span>
            <ChevronDown
              size={14}
              className="shrink-0 text-gray-400 transition-transform duration-200"
              style={{ transform: shippingMethodOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          <AnimatePresence>
            {shippingMethodOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                style={F}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShippingMethod("smart-distribution");
                    setShippingMethodOpen(false);
                  }}
                  className="w-full px-3 py-2 text-right text-sm font-light text-[#6A7282]"
                >
                  توزیع هوشمند
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>

        {/* Search dropdown */}
        <div className="relative min-w-0 flex-1" ref={dropRef}>
          <div
            className="flex h-11 cursor-text items-center gap-2 rounded-xl border border-gray-300 bg-[#FCFCFD]/50 px-4"
            onClick={() => setDropdownOpen(true)}
          >
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setDropdownOpen(true); }}
              placeholder="جستجوی کد یا نام محصول..."
              className="min-w-0 flex-1 bg-transparent text-right text-sm font-light text-[#6A7282] outline-none placeholder:text-[#6A7282]"
              style={F}
            />
            <Search size={14} className="shrink-0 text-[#6A7282]" />
          </div>
          {dropdownOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
              {filtered.map(p => {
                const already = !!items.find(i => i.product.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => selectProduct(p)}
                    disabled={already}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm text-right transition-colors border-b border-gray-100 last:border-0 ${already ? "bg-gray-50 cursor-default" : "hover:bg-gray-50"}`}
                    style={F}
                  >
                    <span className={already ? "text-gray-400" : "text-gray-700"}>{p.name}</span>
                    {already && <CheckCircle2 size={15} className="text-[#3d1a6e] shrink-0" />}
                  </button>
                );
              })}
              {filtered.length === 0 && <p className="text-center text-xs text-gray-400 py-4" style={F}>نتیجه‌ای یافت نشد</p>}
            </div>
          )}
        </div>
      </div>

      {/* Items list */}
      {items.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {items.map(item => (
            <div key={item.product.id} className="flex flex-wrap items-center gap-3 border border-gray-200 rounded-2xl p-3 sm:flex-nowrap sm:p-4 bg-white">

              {/* Image + upload — first in DOM = visual RIGHT in RTL */}
              <div className="shrink-0 flex flex-col items-center gap-1 min-w-[72px]">
                <div className="w-14 h-14 rounded-xl bg-pink-100 overflow-hidden border border-pink-200">
                  <ImageWithFallback src={roll2} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <button className="text-[10px] font-semibold flex items-center gap-0.5" style={{ color: "#CA165C", ...F }}>
                  <span>↑</span><span>بارگذاری تصویر کالا</span>
                </button>
                <span className="text-center text-[13px] leading-5 text-gray-400" style={F}>PNG و JPG — حداکثر ۵ مگابایت</span>
              </div>

              {/* Product name — middle, grows */}
              <span className="min-w-0 flex-1 basis-[calc(100%-100px)] break-words text-sm font-semibold text-gray-800 text-right sm:basis-0" style={F}>{item.product.name}</span>

              {/* Qty controls */}
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" aria-label={`کاهش تعداد ${item.product.name}`} onClick={() => setQty(item.product.id, item.qty - 1)} className="flex h-10 w-10 items-center justify-center sm:h-7 sm:w-7 rounded-full border-[1.5px] border-[#CA165C] text-[#CA165C] hover:bg-[#CA165C]/5"><Minus size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" /></button>
                <span className="w-6 text-center text-sm font-bold text-[#CA165C]" style={F}>{item.qty.toLocaleString("fa-IR")}</span>
                <button type="button" aria-label={`افزایش تعداد ${item.product.name}`} onClick={() => setQty(item.product.id, item.qty + 1)} className="flex h-10 w-10 items-center justify-center sm:h-7 sm:w-7 rounded-full border-[1.5px] border-[#CA165C] text-[#CA165C] hover:bg-[#CA165C]/5"><Plus size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" /></button>
              </div>

              {/* حذف — last in DOM = visual LEFT in RTL */}
              <button
                onClick={() => removeItem(item.product.id)}
                className="mr-6 shrink-0 rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: "#CA165C", ...F }}
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Shipping receipt upload */}
      <div className="mb-6 flex flex-col items-start gap-1 rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-right">
        <button className="text-sm font-semibold flex items-center gap-1" style={{ color: "#CA165C", ...F }}>
          <span>↑</span><span>بارگذاری رسید باربری</span>
        </button>
        <span className="text-[13px] leading-5 text-gray-400" style={F}>فرمت‌های مجاز PNG و JPG — حداکثر حجم ۵ مگابایت</span>
      </div>

      {/* Submit — visual LEFT (flex justify-end in RTL) */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={items.length === 0 || !shippingMethod}
          className={`px-8 py-3 rounded-xl text-white text-sm font-black transition-colors ${items.length === 0 || !shippingMethod ? "bg-gray-300 cursor-not-allowed" : ""}`}
          style={{ ...(items.length > 0 && shippingMethod ? { backgroundColor: "#370080" } : {}), ...F }}
        >
          ثبت درخواست مرجوعی
        </button>
      </div>
    </div>
  );
}

// ─── Return List ───────────────────────────────────────────────────────────

const statusLabel: Record<ReturnRequest["status"], { text: string; cls: string }> = {
  pending:  { text: "در انتظار بررسی", cls: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  approved: { text: "تایید شده",       cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  rejected: { text: "رد شده",          cls: "bg-red-50 text-red-600 border border-red-200" },
};

const mockReturnRequests: ReturnRequest[] = [
  {
    id: "ret-001",
    date: "۱۴۰۵/۴/۱",
    status: "approved",
    items: [{ product: { id: "201002", name: "پنتونکست 201002" }, qty: 2 }],
  },
  {
    id: "ret-002",
    date: "۱۴۰۵/۳/۱۵",
    status: "pending",
    items: [
      { product: { id: "201050", name: "پنتونکست 201050" }, qty: 1 },
      { product: { id: "201060", name: "پنتونکست 201060" }, qty: 3 },
    ],
  },
];

function ReturnListSection({ requests, embedded = false }: { requests: ReturnRequest[]; embedded?: boolean }) {
  const allRequests = [...mockReturnRequests, ...requests];
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-w-0 pb-4 sm:pb-6 lg:pb-8">
      {!embedded && (
        <>
          <ProfileSectionHeading><h1 className="text-right text-base font-black text-gray-900 sm:text-xl" style={F}>
            لیست درخواست های مرجوعی
          </h1></ProfileSectionHeading>
          <div className="h-px bg-gray-200 mb-5" />
        </>
      )}

      {allRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CornerUpLeft size={40} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm" style={F}>درخواست مرجوعی‌ای ثبت نشده است</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
          <table className="w-full table-fixed border-collapse text-right" style={F}>
            <caption className="sr-only">لیست درخواست‌های مرجوعی</caption>
            <colgroup><col className="w-1/3" /><col className="w-1/3" /><col className="w-1/3" /></colgroup>
            <thead className="bg-[#F4F4F6] text-xs font-semibold leading-5 text-[#1E2939] sm:text-sm">
              <tr>
                <th scope="col" className="break-words px-3 py-3 text-right align-top font-semibold sm:px-6">تعداد اقلام مرجوعی</th>
                <th scope="col" className="px-3 py-3 text-right align-top font-semibold sm:px-6">تاریخ</th>
                <th scope="col" className="break-words px-3 py-3 text-right align-top font-semibold sm:px-6">شناسه درخواست مرجوعی</th>
              </tr>
            </thead>
            <tbody>
              {allRequests.map(req => {
                const isOpen = expanded === req.id;
                const reqCode = req.id.replace("ret-", "MRJ-");
                const detailId = `profile-${embedded ? "orders-" : ""}return-${req.id}`;
                const toggle = () => setExpanded(isOpen ? null : req.id);
                return (
                  <Fragment key={req.id}>
                    <tr data-return-summary={req.id} onClick={toggle} className="cursor-pointer border-t border-gray-200 bg-white transition-colors hover:bg-gray-50">
                      <td className="px-3 py-2 text-right align-middle text-xs font-light tabular-nums text-[#CA165C] sm:px-6 sm:py-3 sm:text-sm">
                        <button type="button" aria-expanded={isOpen} aria-controls={detailId} aria-label={`${isOpen ? "بستن" : "نمایش"} جزئیات درخواست ${reqCode}`} onClick={event => { event.stopPropagation(); toggle(); }}
                          className="flex min-h-11 w-full items-center gap-2 rounded-lg bg-transparent p-0 text-right text-xs font-light text-[#CA165C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C] sm:hidden">
                          <ChevronDown size={12} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                          <span>{fmt(req.items.length)}</span>
                        </button>
                        <span className="hidden sm:inline">{fmt(req.items.length)}</span>
                      </td>
                      <td className="py-2 pl-1 pr-3 text-right align-middle text-xs font-light tabular-nums text-[#6A7282] sm:px-6 sm:py-3 sm:text-sm"><span dir="ltr" className="inline-block whitespace-nowrap">{req.date}</span></td>
                      <td className="py-2 pl-0.5 pr-3 align-middle sm:px-6 sm:py-3">
                        <span data-return-code dir="ltr" className="block min-w-0 break-all text-right text-xs font-light leading-5 text-[#6A7282] sm:hidden">{reqCode}</span>
                        <button type="button" aria-expanded={isOpen} aria-controls={detailId} aria-label={`${isOpen ? "بستن" : "نمایش"} جزئیات درخواست ${reqCode}`} onClick={event => { event.stopPropagation(); toggle(); }}
                          className="hidden min-h-11 w-full min-w-0 items-center justify-between gap-0 rounded-lg bg-transparent p-0 text-right text-xs font-light leading-5 text-[#6A7282] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C] sm:flex sm:gap-2 sm:text-sm">
                          <span data-return-code dir="ltr" className="min-w-0 break-all">{reqCode}</span>
                          <ChevronDown size={12} className={`shrink-0 text-[#CA165C] transition-transform duration-300 sm:size-4 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                    <tr data-return-detail={req.id}>
                      <td colSpan={3} className="border-0 p-0">
                        <div id={detailId} aria-hidden={!isOpen} className="grid transition-[grid-template-rows,opacity] duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}>
                          <div className="min-h-0 overflow-hidden">
                            <div className="border-t border-gray-200 pb-8 pt-4">
                              <p data-return-items-title className="mb-3 px-3 text-sm font-light leading-6 text-[#6A7282] sm:px-6">اقلام مرجوعی</p>
                              <div className="relative bg-white py-px">
                                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 inset-x-3 rounded-xl border border-gray-200 sm:inset-x-6" />
                                {req.items.map((item, index) => (
                                  <div key={item.product.id} className="relative grid min-w-0 grid-cols-3 items-center">
                                    {index > 0 && <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gray-200 sm:inset-x-6" />}
                                    <div className="col-span-2 flex min-w-0 items-center gap-2 py-2 pl-2 pr-5 sm:gap-3 sm:py-3 sm:pl-3 sm:pr-9">
                                      <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 sm:size-11">
                                        <ImageWithFallback src={roll2} alt={item.product.name} className="h-full w-full object-cover" />
                                      </div>
                                      <span className="min-w-0 break-words text-xs font-medium leading-5 text-[#1E2939] sm:text-sm sm:font-semibold">{item.product.name}</span>
                                    </div>
                                    <div className="min-w-0 px-3 py-2 text-right sm:px-6 sm:py-3">
                                      <span data-return-item-quantity className="whitespace-nowrap rounded-lg border border-[#CA165C] bg-white px-2 py-1 text-xs font-semibold leading-5 text-[#CA165C]">{fmt(item.qty)} عدد</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="px-3 sm:px-6">
                                <p className="mb-2 mt-4 text-sm font-light leading-6 text-[#6A7282]">رسید باربری</p>
                                <div data-return-receipt className="w-full max-w-[240px] rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3">
                                  <div className="aspect-[3/2] w-full overflow-hidden rounded-xl border border-gray-200">
                                    <ImageWithFallback src={roll2} alt="رسید باربری" className="h-full w-full object-cover" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Statement ─────────────────────────────────────────────────────────────

type StatementRow = {
  date: string; desc: string; orderId: string; shipping: string;
  product: string; qty: string; fee: string; gross: string;
  discount: string; debit: string; credit: string; balance: string;
};

const mockStatement: StatementRow[] = [
  {
    date: "",           desc: "مانده از قبل",    orderId: "—",        shipping: "—",
    product: "—",       qty: "—",                fee: "—",            gross: "—",
    discount: "—",      debit: "—",              credit: "—",         balance: "(۴۱۷,۷۶۸,۶۶۶)",
  },
  {
    date: "۱۴۰۵/۰۴/۰۱", desc: "خرید کاغذدیواری", orderId: "۱۴۱۴۰۵۰۱", shipping: "۵۰,۰۰۰",
    product: "پنتونکست ۲۰۱۰۵۰", qty: "۲",        fee: "۱,۹۰۰,۰۰۰",  gross: "۳,۸۰۰,۰۰۰",
    discount: "۳۸۰,۰۰۰", debit: "۳,۴۷۰,۰۰۰",    credit: "—",         balance: "(۴۲۱,۲۳۸,۶۶۶)",
  },
  {
    date: "۱۴۰۵/۰۴/۰۵", desc: "پرداخت آنلاین",   orderId: "—",        shipping: "—",
    product: "—",       qty: "—",                fee: "—",            gross: "—",
    discount: "—",      debit: "—",              credit: "۵,۰۰۰,۰۰۰", balance: "(۴۱۶,۲۳۸,۶۶۶)",
  },
  {
    date: "۱۴۰۵/۰۴/۱۰", desc: "خرید کاغذدیواری", orderId: "۱۴۱۴۰۵۱۰", shipping: "۵۰,۰۰۰",
    product: "کد ۲۰۲۰۰۳",    qty: "۳",        fee: "۱,۷۵۰,۰۰۰",  gross: "۵,۲۵۰,۰۰۰",
    discount: "۲۶۲,۵۰۰", debit: "۵,۰۳۷,۵۰۰",    credit: "—",         balance: "(۴۲۱,۲۷۶,۱۶۶)",
  },
  {
    date: "۱۴۰۵/۰۴/۱۵", desc: "تخفیف ویژه",      orderId: "—",        shipping: "—",
    product: "—",       qty: "—",                fee: "—",            gross: "—",
    discount: "—",      debit: "—",              credit: "۲,۰۰۰,۰۰۰", balance: "(۴۱۹,۲۷۶,۱۶۶)",
  },
  {
    date: "۱۴۰۵/۰۴/۲۱", desc: "خرید کاغذدیواری", orderId: "۱۴۱۴۰۵۲۱", shipping: "۰",
    product: "پنتونکست ۲۰۱۰۸۴", qty: "۱",        fee: "۲,۱۰۰,۰۰۰",  gross: "۲,۱۰۰,۰۰۰",
    discount: "—",      debit: "۲,۱۰۰,۰۰۰",      credit: "—",         balance: "(۴۲۱,۳۷۶,۱۶۶)",
  },
];

const statCols: { key: keyof StatementRow; label: string; }[] = [
  { key: "date",     label: "تاریخ"          },
  { key: "desc",     label: "توضیحات"        },
  { key: "orderId",  label: "شناسه سفارش"   },
  { key: "shipping", label: "هزینه ارسال"   },
  { key: "product",  label: "محصول"         },
  { key: "qty",      label: "مقدار"         },
  { key: "fee",      label: "فی"            },
  { key: "gross",    label: "مبلغ ناخالص"  },
  { key: "discount", label: "تخفیف"        },
  { key: "debit",    label: "بدهکار"       },
  { key: "credit",   label: "بستانکار"     },
  { key: "balance",  label: "مانده"        },
];

function StatementSection() {
  const [fromDate, setFromDate] = useState("۱۴۰۵/۰۴/۲۱");
  const [toDate, setToDate]     = useState("۱۴۰۵/۰۴/۲۱");
  const [perPage, setPerPage]   = useState("۱۰");
  const [perPageOpen, setPerPageOpen] = useState(false);

  const totalQty    = "◦";
  const totalDebit  = "◦";
  const totalCredit = "◦";

  return (
    <div>
      {/* Header row: balance and print actions */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-200">
        <h1 className="text-base font-black text-gray-900 text-right" style={F}>
          مانده حساب : <span className="font-normal text-[#6A7282]">۰تومان</span>
        </h1>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-[#CA165C] bg-white px-4 py-2 text-sm text-[#CA165C] transition-colors hover:bg-gray-50"
          style={F}
        >
          <Printer size={15} />
          <span>چاپ</span>
        </button>
      </div>

      {/* Filter controls: تعداد نمایش (right) | از تاریخ | تا تاریخ (left) */}
      <div className="flex items-end gap-4 flex-wrap mb-5">
        {/* تعداد نمایش — first = visual right */}
        <div className="flex flex-col gap-1.5 min-w-[100px]">
          <label className="text-right text-sm font-semibold text-[#6A7282]" style={F}>تعداد نمایش</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setPerPageOpen(open => !open)}
              className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-[#FCFCFD]/50 px-3 py-2.5 text-right text-sm font-light text-[#6A7282] transition-colors ${
                perPageOpen ? "border-[#370080]" : "border-gray-200"
              }`}
              style={F}
            >
              <span>{perPage}</span>
              <ChevronDown
                size={13}
                className="shrink-0 text-gray-400 transition-transform duration-200"
                style={{ transform: perPageOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            <AnimatePresence>
              {perPageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                  style={F}
                >
                  {["۱۰", "۲۰", "۵۰", "۱۰۰"].map(value => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setPerPage(value);
                        setPerPageOpen(false);
                      }}
                      className="w-full px-3 py-2 text-right text-sm font-light text-[#6A7282]"
                    >
                      {value}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* از تاریخ */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
          <label className="text-right text-sm font-semibold" style={{ color: "#CA165C", ...F }}>از تاریخ</label>
          <input
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="rounded-xl border border-gray-200 bg-[#FCFCFD]/50 px-3 py-2.5 text-right text-sm font-light text-[#6A7282] outline-none transition-colors focus:border-[#3d1a6e]"
            style={F}
            placeholder="۱۴۰۵/۰۴/۲۱"
          />
        </div>

        {/* تا تاریخ */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
          <label className="text-right text-sm font-semibold text-[#CA165C]" style={F}>تا تاریخ</label>
          <input
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="rounded-xl border border-gray-200 bg-[#FCFCFD]/50 px-3 py-2.5 text-right text-sm font-light text-[#6A7282] outline-none transition-colors focus:border-[#3d1a6e]"
            style={F}
            placeholder="۱۴۰۵/۰۴/۲۱"
          />
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <p className="mb-3 text-xs leading-6 text-[#6A7282] sm:hidden">{"برای دیدن همهٔ ستون‌ها، جدول را به چپ و راست بکشید."}</p>
      <div role="region" aria-label="جدول گردش حساب" tabIndex={0} className="overflow-x-auto overscroll-x-contain rounded-xl border border-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#370080]">
        <table className="min-w-max w-full text-sm border-collapse" style={F}>
          <thead>
            <tr className="border-b border-gray-200 bg-[#F4F4F6]">
              {statCols.map((col, i) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-[#1E2939] ${i < statCols.length - 1 ? "border-l border-gray-300" : ""}`}
                  style={F}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockStatement.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {statCols.map((col, i) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-3 text-right text-sm font-light text-[#6A7282] ${i < statCols.length - 1 ? "border-l border-gray-100" : ""}`}
                    style={F}
                  >
                    {row[col.key] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* Summary footer */}
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-[#F4F4F6]">
              {statCols.map((col, i) => {
                let content = "";
                if (col.key === "qty")    content = `جمع مقدار: ۶`;
                if (col.key === "debit")  content = `جمع بدهکار: ۱۰,۶۰۷,۵۰۰`;
                if (col.key === "credit") content = `جمع بستانکار: ۷,۰۰۰,۰۰۰`;
                if (col.key === "balance" || col.key === "date") content = "—";
                return (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-[#1E2939] ${i < statCols.length - 1 ? "border-l border-gray-300" : ""}`}
                    style={F}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── Wallet ────────────────────────────────────────────────────────────────

function WalletSection() {
  const [walletAction, setWalletAction] = useState<"charge" | "refund" | null>(null);
  const [amount, setAmount] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [selectedGateway, setSelectedGateway] = useState<"saman" | "parsian">("saman");
  const [amountError, setAmountError] = useState(false);
  const [refundAmountError, setRefundAmountError] = useState(false);
  const [showAmountNotification, setShowAmountNotification] = useState(false);
  const [showInvalidCardNotification, setShowInvalidCardNotification] = useState(false);
  const [showCardHolderMismatchNotification, setShowCardHolderMismatchNotification] = useState(false);
  const [showRefundSuccessNotification, setShowRefundSuccessNotification] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [showNewCardInput, setShowNewCardInput] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiryMonth, setNewCardExpiryMonth] = useState("");
  const [newCardExpiryYear, setNewCardExpiryYear] = useState("");
  const [bankCards, setBankCards] = useState([
    {
      id: "parsian-default",
      holder: "یزدان طاهری",
      bank: "پارسیان",
      number: "۶۲۲۱ ۰۶۱۲ ۲۶۳۳ ۹۵۳۱",
      logo: parsianLogo as string | null,
    },
  ]);
  const [selectedBankCardId, setSelectedBankCardId] = useState("parsian-default");
  const refundSubmitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!showAmountNotification) return;
    const timeout = window.setTimeout(() => setShowAmountNotification(false), 1000);
    return () => window.clearTimeout(timeout);
  }, [showAmountNotification]);

  useEffect(() => {
    if (!showInvalidCardNotification) return;
    const timeout = window.setTimeout(() => setShowInvalidCardNotification(false), 3500);
    return () => window.clearTimeout(timeout);
  }, [showInvalidCardNotification]);

  useEffect(() => {
    if (!showCardHolderMismatchNotification) return;
    const timeout = window.setTimeout(() => setShowCardHolderMismatchNotification(false), 3500);
    return () => window.clearTimeout(timeout);
  }, [showCardHolderMismatchNotification]);

  useEffect(() => {
    if (!showRefundSuccessNotification) return;
    const timeout = window.setTimeout(() => setShowRefundSuccessNotification(false), 4500);
    return () => window.clearTimeout(timeout);
  }, [showRefundSuccessNotification]);

  useEffect(() => {
    return () => {
      if (refundSubmitTimeoutRef.current !== null) {
        window.clearTimeout(refundSubmitTimeoutRef.current);
      }
    };
  }, []);

  const handleAmountChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits || Number(digits) <= 400_000_000) {
      setAmount(digits);
      if (digits) {
        setAmountError(false);
        setShowAmountNotification(false);
      }
    }
  };

  const validateAmount = () => {
    if (!amount) {
      setAmountError(true);
      setShowAmountNotification(true);
      return false;
    }
    return true;
  };

  const handleGatewaySelect = (gateway: "saman" | "parsian") => {
    if (!validateAmount()) return;
    setSelectedGateway(gateway);
  };

  const handleAddBankCard = () => {
    if (newCardNumber.length !== 16 || newCardExpiryMonth.length !== 2 || newCardExpiryYear.length !== 2) return;
    if (newCardNumber === "2222222222222222") {
      setShowInvalidCardNotification(true);
      return;
    }
    const id = `bank-card-${Date.now()}`;
    const formattedNumber = newCardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
    setBankCards(cards => [
      ...cards,
      {
        id,
        holder: "یزدان طاهری",
        bank: "کارت بانکی",
        number: formattedNumber,
        logo: null,
      },
    ]);
    setSelectedBankCardId(id);
    setNewCardNumber("");
    setNewCardExpiryMonth("");
    setNewCardExpiryYear("");
    setShowNewCardInput(false);
  };

  const handleRefundRequest = () => {
    if (isSubmittingRefund) return;
    if (!refundAmount) {
      setRefundAmountError(true);
      return;
    }
    const selectedCard = bankCards.find(card => card.id === selectedBankCardId);
    const cardNumber = selectedCard?.number.replace(/\D/g, "");
    setIsSubmittingRefund(true);
    setShowInvalidCardNotification(false);
    setShowCardHolderMismatchNotification(false);
    setShowRefundSuccessNotification(false);

    refundSubmitTimeoutRef.current = window.setTimeout(() => {
      if (cardNumber === "2222222222222222") {
        setShowInvalidCardNotification(true);
      } else if (cardNumber === "3333333333333333") {
        setShowCardHolderMismatchNotification(true);
      } else {
        setShowRefundSuccessNotification(true);
      }
      setIsSubmittingRefund(false);
      refundSubmitTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <div>
      {/* Title + divider */}
      <div className="pb-4 mb-6 border-b border-gray-200">
        <ProfileSectionHeading className=""><h1 className="text-right text-base font-black text-gray-900 sm:text-xl" style={F}>کیف پول</h1></ProfileSectionHeading>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-4 lg:mb-8">
        {[
          { action: "charge" as const, title: "افزایش موجودی", subtitle: "شارژ کیف پول", Icon: Wallet },
          { action: "refund" as const, title: "عودت وجه", subtitle: "بازگشت مبلغ به کیف پول", Icon: RefreshCw },
        ].map(({ action, title, subtitle, Icon }) => (
          <button
            key={action}
            type="button"
            data-wallet-action={action}
            onClick={() => { setWalletAction(action); setShowNewCardInput(false); }}
            aria-pressed={walletAction === action}
            className={`group relative flex min-h-44 min-w-0 items-center justify-between gap-2 rounded-[20px] border bg-white p-3 text-[#1E2939] shadow-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2939] sm:min-h-40 sm:gap-3 sm:rounded-[24px] sm:p-5 lg:p-6 ${walletAction === action ? "border-[#1E2939]" : "border-gray-300"}`}
            style={F}
          >
            <span className="flex w-full min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row sm:gap-3 lg:gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#CA165C] text-white sm:size-12 sm:rounded-2xl">
                <Icon size={20} strokeWidth={1.8} className="sm:size-6" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col items-center text-center sm:items-start sm:text-right">
                <span className="min-h-12 break-words text-[15px] font-semibold text-[#1E2939] sm:min-h-0">{title}</span>
                <span className="mt-0.5 min-h-10 break-words text-[15px] font-normal text-[#6A7282] sm:min-h-0">{subtitle}</span>
              </span>
            </span>
            <ChevronLeft size={20} className="hidden shrink-0 text-[#1E2939] transition-transform group-hover:-translate-x-1 sm:block" aria-hidden="true" />
          </button>
        ))}
      </div>

      {walletAction === "charge" && (
        <div className="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:p-6" dir="rtl">
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 text-right text-sm font-semibold text-[#1E2939]" style={F}>
              <span>مبلغ شارژ (تومان)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={event => handleAmountChange(event.target.value)}
              placeholder="لطفا مبلغ شارژ را وارد کنید"
              title="لطفا مبلغ شارژ را وارد کنید"
              aria-invalid={amountError}
              className={`w-full rounded-xl border bg-white px-4 py-3.5 text-right text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus-visible:bg-[#FCFCFD] focus-visible:ring-0 ${amountError ? "border-[#CA165C]" : "border-gray-200"}`}
              style={F}
            />
            <p className="mt-2 text-left text-sm font-normal text-[#CA165C]" style={F}>
              توجه: حداکثر مبلغ قابل شارژ ۴۰۰٬۰۰۰٬۰۰۰ تومان است.
            </p>
          </div>

          <fieldset className="mb-6 min-w-0">
            <legend className="mb-4 text-right text-sm font-semibold text-[#1E2939]" style={F}>انتخاب درگاه پرداخت</legend>
            <div className="mx-auto grid w-full max-w-[520px] grid-cols-1 justify-items-center gap-3 px-2 sm:grid-cols-2 sm:px-3">
              {[
                { key: "saman" as const, label: "بانک سامان", logo: samanLogo },
                { key: "parsian" as const, label: "بانک پارسیان", logo: parsianLogo },
              ].map(gateway => {
                const active = selectedGateway === gateway.key;
                return (
                  <label
                    key={gateway.key}
                    className="flex min-h-[104px] w-full min-w-0 max-w-[240px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-3 transition-colors sm:gap-3 sm:px-3 sm:py-4"
                  >
                    <input type="radio" name="wallet-payment-gateway" value={gateway.key} checked={active} onChange={() => handleGatewaySelect(gateway.key)} aria-label={gateway.label} className="peer sr-only" />
                    <span className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white sm:size-14">
                        <ImageWithFallback src={gateway.logo} alt="" className="size-8 object-contain sm:size-11" />
                      </span>
                      <span className="min-w-0 break-words text-sm font-bold text-[#1E2939]" style={F}>{gateway.label}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      data-gateway-indicator={gateway.key}
                      className={`flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-[#CA165C] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#CA165C] ${active ? "bg-[#CA165C] text-white" : "bg-white"}`}
                    >
                      {active && <Check size={14} strokeWidth={2.5} />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={validateAmount}
            className="w-full rounded-2xl bg-[#CA165C] py-4 text-base font-semibold text-white transition-colors hover:bg-[#CA165C]/90"
            style={F}
          >
            شارژ کیف پول
          </button>
        </div>
      )}

      {walletAction === "refund" && (
        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm sm:p-6" dir="rtl">
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 text-right text-sm font-semibold text-[#1E2939]" style={F}>
              <span>مبلغ عودت (تومان)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={refundAmount}
              onChange={event => {
                const digits = event.target.value.replace(/\D/g, "");
                setRefundAmount(digits);
                if (digits) setRefundAmountError(false);
              }}
              placeholder="لطفا مبلغ عودت را وارد کنید"
              aria-invalid={refundAmountError}
              className={`w-full rounded-xl border bg-white px-4 py-3.5 text-right text-sm font-light text-[#6A7282] outline-none transition-colors placeholder:text-gray-400 focus-visible:bg-[#FCFCFD] focus-visible:ring-0 ${refundAmountError ? "border-[#CA165C]" : "border-gray-200"}`}
              style={F}
            />
            <p className="mt-2 text-left text-sm font-normal text-[#CA165C]" style={F}>
              توجه: مبلغ وارد شده نباید از مانده‌ی صورتحساب بیشتر شود.
            </p>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-right text-sm font-semibold text-[#1E2939]" style={F}>
              <span>کارت بانکی</span>
            </h3>

            <div className="mb-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowNewCardInput(value => !value)}
                aria-expanded={showNewCardInput}
                className="flex items-center gap-1.5 text-[15px] font-normal text-[#6A7282]"
                style={F}
              >
                <span aria-hidden="true">+</span>
                <span>کارت جدید</span>
              </button>
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity,margin-bottom] duration-200 ease-out ${
                showNewCardInput
                  ? "mb-3 grid-rows-[1fr] opacity-100"
                  : "pointer-events-none mb-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden px-2 sm:px-3">
                <div
                  data-wallet-new-card
                  className="relative overflow-hidden rounded-[24px] border border-gray-300 p-5 text-white shadow-sm"
                  style={{ backgroundColor: "#CA165C" }}
                >
                  <span className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
                  <span className="pointer-events-none absolute -bottom-14 -right-8 h-36 w-36 rounded-full bg-white/10" />

                  <div className="relative">
                    <label className="mb-3 block text-right text-sm font-bold text-white" style={F}>
                      شماره کارت بانکی
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={newCardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                      onChange={event => setNewCardNumber(event.target.value.replace(/\D/g, "").slice(0, 16))}
                      placeholder="---- ---- ---- ----"
                      maxLength={19}
                      dir="ltr"
                      className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3.5 text-center text-lg font-bold tracking-[0.16em] text-white outline-none transition-colors placeholder:text-white/55 focus:border-white/70"
                      style={F}
                    />
                    <p className="mt-2 text-right text-xs font-medium text-white/75" style={F}>
                      ۱۶ رقم شماره کارت را وارد کنید
                    </p>

                    <div className="mt-4">
                      <span className="mb-2 block text-right text-sm font-bold text-white" style={F}>
                        تاریخ انقضا
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-right text-xs font-medium text-white/80" style={F}>
                            ماه
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={newCardExpiryMonth}
                            onChange={event => {
                              const value = event.target.value.replace(/\D/g, "").slice(0, 2);
                              if (!value || Number(value) <= 12) setNewCardExpiryMonth(value);
                            }}
                            placeholder="ماه"
                            maxLength={2}
                            dir="ltr"
                            className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-center text-base font-bold text-white outline-none transition-colors placeholder:text-white/55 focus:border-white/70"
                            style={F}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-right text-xs font-medium text-white/80" style={F}>
                            سال
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={newCardExpiryYear}
                            onChange={event => setNewCardExpiryYear(event.target.value.replace(/\D/g, "").slice(0, 2))}
                            placeholder="سال"
                            maxLength={2}
                            dir="ltr"
                            className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-center text-base font-bold text-white outline-none transition-colors placeholder:text-white/55 focus:border-white/70"
                            style={F}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={newCardNumber.length !== 16 || newCardExpiryMonth.length !== 2 || newCardExpiryYear.length !== 2}
                      onClick={handleAddBankCard}
                      className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-black text-[#CA165C] transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-55"
                      style={F}
                    >
                      تأیید و افزودن کارت
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {bankCards.map(card => {
                const selected = selectedBankCardId === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedBankCardId(card.id)}
                    aria-pressed={selected}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-300 bg-[#F3F4F6] p-4 text-right shadow-sm"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white px-1 text-center">
                        <span className="text-[11px] font-semibold leading-tight text-[#1E2939]" style={F}>
                          {card.bank}
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className={`block truncate text-sm text-[#1E2939] ${card.id === "parsian-default" ? "font-semibold" : "font-black"}`} style={F}>
                          {card.holder}
                        </span>
                        <span className="mt-1 block text-sm text-[#1E2939]" dir="rtl" style={F}>
                          {card.number}
                        </span>
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      data-bank-card-indicator={card.id}
                      className={`flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-[#CA165C] ${selected ? "bg-[#CA165C] text-white" : "bg-white"}`}
                    >
                      {selected && <Check size={14} strokeWidth={2.5} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-2 text-left text-sm font-normal text-[#CA165C]" style={F}>
              توجه: کارت بانکی حتماً باید به نام خود فروشگاه‌دار باشد.
            </p>

            <button
              type="button"
              onClick={handleRefundRequest}
              disabled={isSubmittingRefund}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#CA165C] py-4 text-base font-semibold text-white transition-colors hover:bg-[#CA165C]/90 disabled:cursor-wait disabled:bg-[#CA165C]"
              style={F}
            >
              {isSubmittingRefund ? (
                <>
                  <RefreshCw size={19} className="animate-spin" />
                  <span>در حال ثبت درخواست</span>
                </>
              ) : (
                "ثبت درخواست عودت"
              )}
            </button>
          </div>
        </div>
      )}

      <div
        role="alert"
        aria-live="assertive"
        aria-hidden={!showAmountNotification}
        className={`fixed left-1/2 top-5 z-[100] flex w-[calc(100%-2rem)] max-w-xl items-center gap-4 rounded-2xl px-5 py-4 text-white shadow-2xl transition-opacity duration-200 ease-out ${
          showAmountNotification ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          ...F,
          backgroundColor: "#CA165C",
          transform: "translateX(-50%)",
          willChange: "opacity",
        }}
        dir="rtl"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/35 text-sm font-black">
          !
        </span>
        <p className="flex-1 text-center text-sm font-bold">
          ابتدا مبلغ را وارد کنید.
        </p>
        <button
          type="button"
          onClick={() => setShowAmountNotification(false)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          aria-label="بستن اعلان"
        >
          <X size={15} />
        </button>
      </div>

      <AnimatePresence>
        {showInvalidCardNotification && (
          <div className="pointer-events-none fixed inset-x-0 top-5 z-[110] flex justify-center px-4">
            <motion.div
              role="alert"
              aria-live="assertive"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="pointer-events-auto flex w-full max-w-xl items-center gap-4 rounded-2xl px-5 py-4 text-white shadow-2xl"
              style={{ ...F, backgroundColor: "#CA165C" }}
              dir="rtl"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/35 text-sm font-black">
                !
              </span>
              <p className="flex-1 text-center text-sm font-bold">
                شماره کارت بانکی معتبر نیست.
              </p>
              <button
                type="button"
                onClick={() => setShowInvalidCardNotification(false)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="بستن اعلان"
              >
                <X size={15} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div
        role="alert"
        aria-live="assertive"
        aria-hidden={!showCardHolderMismatchNotification}
        className={`fixed left-1/2 top-5 z-[120] flex w-[calc(100%-2rem)] max-w-xl items-center gap-4 rounded-2xl px-5 py-4 text-white shadow-2xl transition-opacity duration-200 ease-out ${
          showCardHolderMismatchNotification ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          ...F,
          backgroundColor: "#CA165C",
          transform: "translateX(-50%)",
          willChange: "opacity",
        }}
        dir="rtl"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/35 text-sm font-black">
          !
        </span>
        <p className="flex-1 text-center text-sm font-bold">
          نام دارنده کارت بانکی با نام ثبت‌شده در حساب کاربری فروشگاه مطابقت ندارد.
        </p>
        <button
          type="button"
          onClick={() => setShowCardHolderMismatchNotification(false)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          aria-label="بستن اعلان"
        >
          <X size={15} />
        </button>
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-hidden={!showRefundSuccessNotification}
        className={`fixed left-1/2 top-5 z-[120] flex w-[calc(100%-2rem)] max-w-xl items-center gap-4 rounded-2xl px-5 py-4 text-white shadow-2xl transition-opacity duration-200 ease-out ${
          showRefundSuccessNotification ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          ...F,
          backgroundColor: "#370080",
          transform: "translateX(-50%)",
          willChange: "opacity",
        }}
        dir="rtl"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/35 text-sm font-black">
          ✓
        </span>
        <p className="flex-1 text-center text-sm font-bold">
          درخواست عودت شما با موفقیت ثبت شد، به زودی مبلغ به حساب شما واریز خواهد شد.
        </p>
        <button
          type="button"
          onClick={() => setShowRefundSuccessNotification(false)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          aria-label="بستن اعلان"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Sales Chart ───────────────────────────────────────────────────────────

type ChartFilter = "هفتگی" | "ماهانه" | "سالانه";

const persianDays = ["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"];
const persianMonths = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const persianDigits = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
const toPersianNum = (n: number) => String(n).split("").map(d => persianDigits[+d] ?? d).join("");

const persianWeeks = ["هفته اول","هفته دوم","هفته سوم","هفته چهارم","هفته پنجم"];

const chartData: Record<ChartFilter, { label: string; sold: number; target: number }[]> = {
  هفتگی: persianWeeks.map((label, i) => ({
    label,
    sold:   [210,285,260,310,240][i],
    target: [230,270,280,300,250][i],
  })),
  ماهانه: Array.from({ length: 30 }, (_, i) => ({
    label: toPersianNum(i + 1),
    sold:   [88,95,72,110,103,85,120,98,115,90,105,88,130,75,108,95,112,88,125,100,95,115,88,102,120,85,108,95,112,100][i],
    target: 100,
  })),
  سالانه: persianMonths.map((label, i) => ({
    label,
    sold:   [120,145,98,160,175,132,190,155,210,178,195,200][i],
    target: [100,130,120,140,150,145,160,165,180,175,185,180][i],
  })),
};

const CHART_H = 240;
const Y_TICKS = 5;

// ─── Persian date helpers ───────────────────────────────────────────────────

const pMonthNames = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const pDayHeaders = ["ش","ی","د","س","چ","پ","ج"];

function isPLeap(y: number) { return ((y * 8) + 29) % 33 < 8; }
function pMonthLen(y: number, m: number) { return m <= 6 ? 31 : m <= 11 ? 30 : isPLeap(y) ? 30 : 29; }

function firstDayOfMonth(year: number, month: number): number {
  // Anchor: 1403/01/01 = Wednesday = day 4 in 0=Sat scheme
  const ANCHOR_YEAR = 1403, ANCHOR_DOW = 4;
  let days = 0;
  for (let y = ANCHOR_YEAR; y < year; y++) days += isPLeap(y) ? 366 : 365;
  for (let y = year; y < ANCHOR_YEAR; y++) days -= isPLeap(y) ? 366 : 365;
  for (let m = 1; m < month; m++) days += pMonthLen(year, m);
  return ((ANCHOR_DOW + days) % 7 + 7) % 7;
}

interface PDate { y: number; m: number; d: number; }
function pDateCmp(a: PDate, b: PDate) { return a.y !== b.y ? a.y - b.y : a.m !== b.m ? a.m - b.m : a.d - b.d; }
function pDateEq(a: PDate | null, b: PDate | null) { return a && b && a.y === b.y && a.m === b.m && a.d === b.d; }
function pDateStr(d: PDate) { return `${toPersianNum(d.y)}/${toPersianNum(d.m).padStart(2,"۰")}/${toPersianNum(d.d).padStart(2,"۰")}`; }

function PersianRangePicker({ onChange, compact = false }: { onChange?: (s: PDate, e: PDate) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [viewY, setViewY] = useState(1403);
  const [viewM, setViewM] = useState(5);
  const [start, setStart] = useState<PDate | null>(null);
  const [end, setEnd] = useState<PDate | null>(null);
  const [hover, setHover] = useState<PDate | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function prevMonth() { if (viewM === 1) { setViewY(y => y - 1); setViewM(12); } else setViewM(m => m - 1); }
  function nextMonth() { if (viewM === 12) { setViewY(y => y + 1); setViewM(1); } else setViewM(m => m + 1); }

  function pickDay(d: PDate) {
    if (!start || (start && end)) {
      setStart(d); setEnd(null);
    } else {
      const s = pDateCmp(d, start) < 0 ? d : start;
      const e = pDateCmp(d, start) < 0 ? start : d;
      setEnd(e); setStart(s);
      onChange?.(s, e);
      setTimeout(() => setOpen(false), 180);
    }
  }

  function inRange(d: PDate) {
    if (!start) return false;
    const ref2 = end ?? hover;
    if (!ref2) return false;
    const lo = pDateCmp(start, ref2) <= 0 ? start : ref2;
    const hi = pDateCmp(start, ref2) <= 0 ? ref2 : start;
    return pDateCmp(d, lo) >= 0 && pDateCmp(d, hi) <= 0;
  }

  const mLen = pMonthLen(viewY, viewM);
  const offset = firstDayOfMonth(viewY, viewM);
  const cells = Array.from({ length: offset + mLen }, (_, i) => i < offset ? null : i - offset + 1);
  while (cells.length % 7 !== 0) cells.push(null);

  const label = start && end
    ? `${pDateStr(start)} — ${pDateStr(end)}`
    : start
    ? `از ${pDateStr(start)}`
    : "انتخاب بازه زمانی";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center rounded-lg font-bold transition-all ${
          compact ? "gap-1 px-2 py-1.5 text-[10px] sm:gap-1.5 sm:px-3 sm:text-xs" : "gap-1.5 px-3 py-1.5 text-xs"
        }`}
        style={{ backgroundColor: open || (start && end) ? PURPLE : "#fff", color: open || (start && end) ? "#fff" : PURPLE, border: `1px solid ${PURPLE}`, ...F, whiteSpace: "nowrap" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        {label}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 max-w-[calc(100vw-6rem)] rounded-2xl border border-gray-100 shadow-xl overflow-hidden sm:left-0 sm:right-auto"
          style={{ backgroundColor: "#fff", width: 280, ...F }}
          dir="rtl"
        >
          {/* Month nav header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <span className="text-sm font-black text-gray-800">{pMonthNames[viewM - 1]} {toPersianNum(viewY)}</span>
            <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pt-2 pb-1">
            {pDayHeaders.map(h => (
              <div key={h} className="text-center text-[10px] font-bold text-gray-400 py-1">{h}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map((day, ci) => {
              if (!day) return <div key={`e-${ci}`} />;
              const pd: PDate = { y: viewY, m: viewM, d: day };
              const isStart = pDateEq(pd, start);
              const isEnd   = pDateEq(pd, end);
              const inR     = inRange(pd);
              const isEdge  = isStart || isEnd;
              return (
                <button
                  key={`d-${day}`}
                  onClick={() => pickDay(pd)}
                  onMouseEnter={() => setHover(pd)}
                  onMouseLeave={() => setHover(null)}
                  className="relative h-8 flex items-center justify-center text-xs font-medium transition-all"
                  style={{
                    color: isEdge ? "#fff" : inR ? PURPLE : "#374151",
                    backgroundColor: isEdge ? PURPLE : inR ? "#ede9fe" : "transparent",
                    borderRadius: isEdge ? 8 : inR ? 2 : 6,
                    fontFamily: F.fontFamily,
                  }}
                >
                  {toPersianNum(day)}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          {start && !end && (
            <div className="px-4 pb-3 text-center">
              <span className="text-[11px] text-gray-400" style={F}>روز پایان را انتخاب کنید</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sales Dashboard ───────────────────────────────────────────────────────

const salesCards = [
  {
    icon: ShoppingBag,
    value: "۱۲۵",
    label: "تعداد سفارش‌ها",
    sub: "تعداد کل خریدها",
  },
  {
    icon: Package,
    value: "۱۸",
    label: "تعداد خریداری شده",
    sub: "تعداد آلبوم‌های خریداری شده",
  },
  {
    icon: Tag,
    value: "۳",
    label: "تعداد خریداری نشده",
    sub: "تعداد آلبوم‌های خریداری نشده",
  },
  {
    icon: Wallet,
    value: "۲،۴۵۰،۰۰۰",
    label: "تومان",
    sub: "موجودی کیف پول",
  },
];

// ─── Best Codes Donut ─────────────────────────────────────────────────────

const CODE_COLORS_9 = [
  "#370080","#502593","#6443A3","#735BAF","#8573BC",
  "#A096CC","#C1BDE0","#D1D1E8",
];
const PERSIAN_MONTHS_D = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const DONUT_YEARS = [1401, 1402, 1403, 1404];
const PRODUCTS_9 = [
  { code: "WP-1001", name: "رز طلایی" },
  { code: "WP-1048", name: "برگ پاییزی" },
  { code: "WP-1095", name: "طرح مدرن" },
  { code: "WP-1142", name: "گل‌های بنفش" },
  { code: "WP-1189", name: "اقیانوس آبی" },
  { code: "WP-1236", name: "کلاسیک نخودی" },
  { code: "WP-1283", name: "هندسی خاکستری" },
  { code: "WP-1330", name: "پرنده بهاری" },
];

function genCounts(seed: number) {
  return PRODUCTS_9.map((_, i) => Math.max(8, ((seed * 31 + i * 17 + i * i * 7) % 180) + 15));
}

type DonutFilter = "day" | "week" | "month" | "year";

function sliceTextColor(hex: string) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.55 ? "#370080" : "#ffffff";
}

function FilterDropdown({ label, options, active, open, onToggle, onSelect, selectedLabel }: {
  label: string; options: { value: number; label: string }[]; active: boolean;
  open: boolean; onToggle: () => void; onSelect: (v: number) => void; selectedLabel?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <button onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: 5,
        backgroundColor: active ? "#370080" : "#fff",
        color: active ? "#fff" : "#370080",
        border: "1px solid #370080", borderRadius: 20,
        padding: "4px 12px", fontSize: 12, cursor: "pointer",
        fontWeight: 700, outline: "none", whiteSpace: "nowrap", fontFamily: "'Vazirmatn', sans-serif",
      }}>
        {active && selectedLabel ? selectedLabel : label}
        <ChevronDown size={12} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      <div style={{
        position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100,
        backgroundColor: "#fff", borderRadius: 12,
        boxShadow: "0 8px 24px rgba(55,0,128,0.14), 0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #ede8f7", minWidth: 110, overflow: "hidden",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(-6px)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        pointerEvents: open ? "auto" : "none",
      }}>
        {options.map(o => (
          <div key={o.value} onClick={() => onSelect(o.value)}
            style={{
              padding: "8px 14px", fontSize: 12, cursor: "pointer",
              fontFamily: "'Vazirmatn', sans-serif", transition: "background 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f5f0ff")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function BestCodesDonut({ filterType, selectedMonth, selectedYear, rangeLabel }: {
  filterType: DonutFilter; selectedMonth: number; selectedYear: number; rangeLabel: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const chartWrapRef = useRef<HTMLDivElement>(null);

  const seed =
    filterType === "day" ? 13 :
    filterType === "week" ? 27 :
    filterType === "month" ? selectedMonth * 11 + 3 :
    (selectedYear % 100) * 7;

  const counts = genCounts(seed);
  const total = counts.reduce((s, c) => s + c, 0);

  const CX = 180, CY = 180, R = 165;
  let angle = -Math.PI / 2;

  const slices = PRODUCTS_9.map((p, i) => {
    const frac = counts[i] / total;
    const sa = angle;
    angle += frac * 2 * Math.PI;
    const ea = angle;
    const mid = (sa + ea) / 2;
    return { ...p, count: counts[i], frac, sa, ea, midAngle: mid, color: CODE_COLORS_9[i] };
  });

  function arcPath(sa: number, ea: number) {
    const rc = Math.min(13, (ea - sa) * R * 0.28);
    if (rc < 3) {
      const x1 = CX + R * Math.cos(sa), y1 = CY + R * Math.sin(sa);
      const x2 = CX + R * Math.cos(ea), y2 = CY + R * Math.sin(ea);
      return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${ea-sa>Math.PI?1:0} 1 ${x2} ${y2} Z`;
    }
    const aOff = rc / R;
    const f = (n: number) => n.toFixed(2);
    // start corner points
    const px1 = CX + (R - rc) * Math.cos(sa),  py1 = CY + (R - rc) * Math.sin(sa);
    const cpx1 = CX + R * Math.cos(sa),          cpy1 = CY + R * Math.sin(sa);
    const qx1  = CX + R * Math.cos(sa + aOff),   qy1  = CY + R * Math.sin(sa + aOff);
    // end corner points
    const qx2  = CX + R * Math.cos(ea - aOff),   qy2  = CY + R * Math.sin(ea - aOff);
    const cpx2 = CX + R * Math.cos(ea),           cpy2 = CY + R * Math.sin(ea);
    const px2  = CX + (R - rc) * Math.cos(ea),   py2  = CY + (R - rc) * Math.sin(ea);
    const large = ea - sa > Math.PI ? 1 : 0;
    return [
      `M ${CX} ${CY}`,
      `L ${f(px1)} ${f(py1)}`,
      `Q ${f(cpx1)} ${f(cpy1)} ${f(qx1)} ${f(qy1)}`,
      `A ${R} ${R} 0 ${large} 1 ${f(qx2)} ${f(qy2)}`,
      `Q ${f(cpx2)} ${f(cpy2)} ${f(px2)} ${f(py2)}`,
      `Z`,
    ].join(' ');
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (chartWrapRef.current) {
      const rect = chartWrapRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div
      ref={chartWrapRef}
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center gap-6 sm:flex-row sm:items-start"
      style={{ position: "relative" }}
    >

      {/* Pie SVG */}
      <div className="w-full max-w-[320px] shrink-0 sm:max-w-[360px] sm:flex-[0_1_55%]">
        <svg viewBox="0 0 360 360" style={{ width: "100%", height: "auto" }}>
          {slices.map((s, i) => {
            const tx = hovered === i ? Math.cos(s.midAngle) * 10 : 0;
            const ty = hovered === i ? Math.sin(s.midAngle) * 10 : 0;
            const labelR = R * 0.62;
            const lx = CX + labelR * Math.cos(s.midAngle);
            const ly = CY + labelR * Math.sin(s.midAngle);
            const tc = sliceTextColor(s.color);
            return (
              <g key={i} transform={`translate(${tx}, ${ty})`} style={{ transition: "transform 0.15s", cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}>
                <path d={arcPath(s.sa, s.ea)} fill={s.color} stroke="#fff" strokeWidth={2} />
                {s.frac > 0.07 && (
                  <>
                    <text x={lx} y={ly - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={tc} fontFamily="Vazirmatn, sans-serif">{s.name}</text>
                    <text x={lx} y={ly + 8} textAnchor="middle" fontSize={9} fill={tc} fontFamily="Vazirmatn, sans-serif" opacity={0.85}>{s.code}</text>
                  </>
                )}
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r={15} fill="white" style={{ pointerEvents: "none" }} />
        </svg>
      </div>

      {/* Legend — paddingTop matches top of pie arc (CY-R = 180-165 = 15px in SVG space) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingTop: 15 }}>
        {slices.map((s, i) => (
          <div key={i} dir="ltr"
            style={{ display: "flex", alignItems: "center", gap: 7, opacity: hovered === null || hovered === i ? 1 : 0.35, transition: "opacity 0.15s", cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#370080", fontWeight: 700, ...F }}>{s.name}</span>
            <span style={{ fontSize: 11, color: "#888", ...F }}>({s.code})</span>
            <span style={{ fontSize: 12, color: "#555", ...F, marginLeft: 4 }}>{(s.frac * 100).toFixed(1)}٪</span>
          </div>
        ))}
      </div>

      {/* Floating tooltip */}
      {hovered !== null && (() => {
        const s = slices[hovered];
        const tipW = 220;
        const offX = 18, offY = -12;
        const wrapW = chartWrapRef.current?.offsetWidth ?? 800;
        const flipX = mousePos.x + offX + tipW > wrapW;
        return (
          <div dir="rtl" style={{
            position: "absolute",
            left: flipX ? mousePos.x - tipW - offX : mousePos.x + offX,
            top: mousePos.y + offY,
            width: tipW,
            backgroundColor: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 28px rgba(55,0,128,0.16), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid #ede8f7",
            borderRight: `4px solid ${s.color}`,
            padding: "12px 14px",
            pointerEvents: "none",
            zIndex: 50,
            ...F,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(55, 0, 128, 0.06)" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#370080" }}>{s.name}</span>
            </div>
            {[
              { label: "کد کالا", value: s.code },
              { label: "درصد از کل فروش", value: `${(s.frac * 100).toFixed(1)}٪` },
              { label: "استان", value: "تهران" },
              { label: "بازه نمایش", value: rangeLabel },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#999" }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#370080" }}>{value}</span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

function BestCodesCard() {
  const [filterType, setFilterType] = useState<DonutFilter>("day");
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [selectedYear, setSelectedYear] = useState(1403);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(e.target as Node)) setMonthOpen(false);
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) setYearOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const rangeLabel =
    filterType === "day" ? "روز جاری" :
    filterType === "week" ? "هفته جاری" :
    filterType === "month" ? PERSIAN_MONTHS_D[selectedMonth] :
    String(selectedYear);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    ...F,
    backgroundColor: active ? "#370080" : "#fff",
    color: active ? "#fff" : "#370080",
    border: "1px solid #370080",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 700,
    outline: "none",
    whiteSpace: "nowrap",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-3">
      {/* Card title */}
      <div className="flex items-center gap-2 mb-4" dir="rtl">
        <p className="font-black text-[16px]" style={{ color: "#370080", ...F }}>کدهای پرفروش استان شما</p>
      </div>

      {/* Map row */}
      <div className="flex justify-center sm:justify-start" dir="ltr">
        <div className="w-full sm:w-1/2" style={{ padding: "8px 16px 8px 8px" }}>
          <div className="relative group cursor-pointer w-full">
  <img
    src={mapImage}
    alt="نقشه"
    className="w-full h-auto object-contain transition-filter duration-300"
    style={{ transition: "filter 0.3s" }}
    onMouseEnter={e => (e.currentTarget.style.filter = "brightness(0.78)")}
    onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
  />
  <div
    className="absolute hidden items-center pointer-events-none sm:flex"
    style={{ top: "50%", right: -110, transform: "translateY(-50%)", opacity: 0, transition: "opacity 0.25s" }}
    ref={el => {
      if (!el) return;
      const parent = el.parentElement!;
      const show = () => { el.style.opacity = "1"; };
      const hide = () => { el.style.opacity = "0"; };
      parent.addEventListener("mouseenter", show);
      parent.addEventListener("mouseleave", hide);
    }}
  >
    <div style={{
      background: "#fff",
      border: "1.5px solid #c4b5fd",
      borderRadius: 14,
      padding: "10px 18px",
      boxShadow: "0 8px 28px rgba(55,0,128,0.13)",
      fontFamily: "'Vazirmatn', sans-serif",
      textAlign: "center",
      animation: "mapBounce 0.8s ease infinite alternate",
      position: "relative",
      maxWidth: 280,
    }}>
      <span style={{ display: "block", fontSize: 11, color: "#9ca3af", marginBottom: 3, fontFamily: "'Vazirmatn', sans-serif" }}>💡</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#370080", fontFamily: "'Vazirmatn', sans-serif", direction: "rtl" }}>
        شما می‌توانید کدهای پرفروش استان خود را مشاهده کنید
      </span>
      <span style={{
        position: "absolute",
        top: "50%",
        left: -8,
        transform: "translateY(-50%)",
        width: 14,
        height: 14,
        background: "#fff",
        border: "1.5px solid #c4b5fd",
        borderTop: "none",
        borderRight: "none",
        rotate: "45deg",
        display: "block",
      }} />
    </div>
  </div>
  <style>{`
    @keyframes mapBounce {
      from { transform: translateY(0px); }
      to   { transform: translateY(-8px); }
    }
  `}</style>
</div>
        </div>
        <div className="hidden sm:block sm:w-1/2" />
      </div>

      {/* Filters — directly above chart */}
      <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0 12px", alignItems: "center", marginLeft: 20 }}>
        <button style={btnStyle(filterType === "day")} onClick={() => setFilterType("day")}>روز جاری</button>
        <button style={btnStyle(filterType === "week")} onClick={() => setFilterType("week")}>هفته جاری</button>
        <div ref={monthRef}>
          <FilterDropdown
            label="ماه" active={filterType === "month"} open={monthOpen}
            onToggle={() => { setMonthOpen(p => !p); setYearOpen(false); }}
            onSelect={(v) => { setFilterType("month"); setSelectedMonth(v); setMonthOpen(false); }}
            options={PERSIAN_MONTHS_D.map((m, i) => ({ value: i, label: m }))}
            selectedLabel={PERSIAN_MONTHS_D[selectedMonth]}
          />
        </div>
        <div ref={yearRef}>
          <FilterDropdown
            label="سال" active={filterType === "year"} open={yearOpen}
            onToggle={() => { setYearOpen(p => !p); setMonthOpen(false); }}
            onSelect={(v) => { setFilterType("year"); setSelectedYear(v); setYearOpen(false); }}
            options={DONUT_YEARS.map(y => ({ value: y, label: String(y) }))}
            selectedLabel={String(selectedYear)}
          />
        </div>
      </div>

      {/* Chart */}
      <div>
        <BestCodesDonut
          filterType={filterType}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          rangeLabel={rangeLabel}
        />
      </div>
    </div>
  );
}

const ALBUMS = [
  { name: "آلبوم کلاسیک ۱", rolls: 12, codes: [
    { code: "KL-1001", qty: 3 }, { code: "KL-1002", qty: 5 }, { code: "KL-1003", qty: 2 },
    { code: "KL-1004", qty: 7 }, { code: "KL-1005", qty: 1 }, { code: "KL-1006", qty: 4 },
    { code: "KL-1007", qty: 6 }, { code: "KL-1008", qty: 2 }, { code: "KL-1009", qty: 3 },
    { code: "KL-1010", qty: 5 }, { code: "KL-1011", qty: 1 }, { code: "KL-1012", qty: 4 },
    { code: "KL-1013", qty: 2 }, { code: "KL-1014", qty: 3 }, { code: "KL-1015", qty: 6 },
    { code: "KL-1016", qty: 2 },
  ]},
  { name: "آلبوم مدرن ۲", rolls: 8, codes: [
    { code: "MD-2001", qty: 4 }, { code: "MD-2002", qty: 2 }, { code: "MD-2003", qty: 6 },
    { code: "MD-2004", qty: 1 }, { code: "MD-2005", qty: 3 }, { code: "MD-2006", qty: 5 },
    { code: "MD-2007", qty: 2 }, { code: "MD-2008", qty: 4 }, { code: "MD-2009", qty: 1 },
  ]},
  { name: "آلبوم لاکچری ۳", rolls: 15, codes: [
    { code: "LX-3001", qty: 5 }, { code: "LX-3002", qty: 3 }, { code: "LX-3003", qty: 7 },
    { code: "LX-3004", qty: 2 }, { code: "LX-3005", qty: 4 }, { code: "LX-3006", qty: 6 },
    { code: "LX-3007", qty: 1 }, { code: "LX-3008", qty: 3 }, { code: "LX-3009", qty: 5 },
    { code: "LX-3010", qty: 2 }, { code: "LX-3011", qty: 4 }, { code: "LX-3012", qty: 7 },
    { code: "LX-3013", qty: 1 }, { code: "LX-3014", qty: 3 }, { code: "LX-3015", qty: 2 },
    { code: "LX-3016", qty: 6 }, { code: "LX-3017", qty: 4 }, { code: "LX-3018", qty: 3 },
    { code: "LX-3019", qty: 5 }, { code: "LX-3020", qty: 2 }, { code: "LX-3021", qty: 1 },
    { code: "LX-3022", qty: 4 },
  ]},
  { name: "آلبوم طبیعت ۴", rolls: 10, codes: [
    { code: "NT-4001", qty: 2 }, { code: "NT-4002", qty: 5 }, { code: "NT-4003", qty: 3 },
    { code: "NT-4004", qty: 1 }, { code: "NT-4005", qty: 4 }, { code: "NT-4006", qty: 6 },
    { code: "NT-4007", qty: 2 }, { code: "NT-4008", qty: 3 }, { code: "NT-4009", qty: 5 },
    { code: "NT-4010", qty: 1 }, { code: "NT-4011", qty: 4 }, { code: "NT-4012", qty: 2 },
    { code: "NT-4013", qty: 3 },
  ]},
  { name: "آلبوم شهری ۵", rolls: 7, codes: [
    { code: "CT-5001", qty: 3 }, { code: "CT-5002", qty: 1 }, { code: "CT-5003", qty: 4 },
    { code: "CT-5004", qty: 2 }, { code: "CT-5005", qty: 5 }, { code: "CT-5006", qty: 1 },
  ]},
];

const ROWS_PER_PAGE = 7;

const PURCHASED_ALBUMS = [
  "آلبوم کلاسیک ۱", "آلبوم مدرن ۲", "آلبوم لاکچری ۳", "آلبوم طبیعت ۴", "آلبوم شهری ۵",
  "آلبوم پاییزی ۶", "آلبوم بهاری ۷", "آلبوم زمستانی ۸", "آلبوم رمانتیک ۹", "آلبوم مینیمال ۱۰",
];

const NOT_PURCHASED_ALBUMS = [
  "آلبوم ویژه A", "آلبوم پریمیوم B", "آلبوم اکسکلوسیو C",
];

function SalesDashboardSection() {
  const navigate = useNavigate();
  const [weeklyClickedBar, setWeeklyClickedBar] = useState<number | null>(null);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [selectedAlbumIdx, setSelectedAlbumIdx] = useState(0);
  const [showPurchased, setShowPurchased] = useState(false);
  const [showNotPurchased, setShowNotPurchased] = useState(false);
  const [tablePage, setTablePage] = useState(0);

  const handleBarClick = (idx: number | null) => {
    setWeeklyClickedBar(idx);
    setSliderIdx(0);
    setSelectedAlbumIdx(0);
    setTablePage(0);
  };

  const handleAlbumSelect = (ai: number) => {
    setSelectedAlbumIdx(ai);
    setTablePage(0);
  };

  const VISIBLE = 2;
  const canPrev = sliderIdx > 0;
  const canNext = sliderIdx < ALBUMS.length - VISIBLE;

  const selectedAlbum = ALBUMS[selectedAlbumIdx];
  const codes = selectedAlbum?.codes ?? [];
  const totalPages = Math.ceil(codes.length / ROWS_PER_PAGE);
  const pageRows = codes.slice(tablePage * ROWS_PER_PAGE, (tablePage + 1) * ROWS_PER_PAGE);
  const dayLabel = weeklyClickedBar !== null ? purchaseData["هفتگی"][weeklyClickedBar]?.label : "";

  return (
    <div className="flex flex-col gap-6">
      <ProfileSectionHeading className=""><h2 className="text-base font-black text-gray-900 sm:text-xl" style={F}>پنل فروش</h2></ProfileSectionHeading>
      <div className="h-px bg-gray-100" />

      {/* ── Section 1: stat cards ── */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#CA165C" }} />
        <p className="font-black text-[16px]" style={{ color: "#CA165C", ...F }}>آمار کلی شما</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {salesCards.map(({ icon: Icon, value, label, sub }, cardIdx) => {
          const isClickable = cardIdx === 1 || cardIdx === 2;
          const isActive = (cardIdx === 1 && showPurchased) || (cardIdx === 2 && showNotPurchased);
          return (
            <div
              key={sub}
              className="group relative flex flex-col items-center justify-center text-center rounded-2xl border bg-white min-h-[180px] px-3 py-5 sm:min-h-[250px] sm:px-5 sm:py-7"
              style={{
                width: "100%",
                cursor: isClickable ? "pointer" : "default",
                backgroundColor: "#ffffff",
                borderColor: isActive ? "#370080" : "#f3f4f6",
                boxShadow: isActive ? "0 0 0 2px #37008022" : "none",
                transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease",
              }}
              onClick={() => {
                if (cardIdx === 1) { setShowPurchased(p => !p); setShowNotPurchased(false); }
                if (cardIdx === 2) { setShowNotPurchased(p => !p); setShowPurchased(false); }
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-7px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: isActive ? "#d4d4f8" : "#e8e8fb" }}>
                <Icon size={22} style={{ color: "#4141D9" }} />
              </div>
              <span className="break-words text-[22px] font-black leading-tight mb-3 sm:text-3xl" style={{ color: "#370080", ...F }}>{value}</span>
              <span className="text-sm font-bold mb-1.5" style={{ color: "#370080", ...F }}>{label}</span>
              <span className="text-xs text-gray-400" style={F}>{sub}</span>
              {isClickable && (
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: isActive ? "#370080" : "#f3f4f6", color: isActive ? "#fff" : "#aaa", transition: "all 0.3s", ...F }}>
                  {isActive ? "بستن" : "مشاهده"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Purchased albums expandable panel ── */}
      <div style={{
        overflow: "hidden",
        maxHeight: showPurchased ? 900 : 0,
        opacity: showPurchased ? 1 : 0,
        transition: "max-height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
      }}>
        <div className="mx-0 rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-sm sm:mx-16 sm:px-10" dir="rtl"
          style={{ marginTop: showPurchased ? 0 : -16, transition: "margin-top 0.5s ease" }}>
          <p className="text-sm font-black mb-4" style={{ color: "#370080", ...F }}>آلبوم‌های خریداری شده</p>
          <div className="grid grid-cols-2 justify-items-center gap-x-2 gap-y-4 sm:grid-cols-5">
            {PURCHASED_ALBUMS.map((name, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm" style={{ width: 100, height: 118 }}>
                  <ImageWithFallback src={albumComingSoon} alt={name}
                    className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-center leading-tight" style={{ color: "#370080", ...F, maxWidth: 100 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Not purchased albums expandable panel ── */}
      <div style={{
        overflow: "hidden",
        maxHeight: showNotPurchased ? 500 : 0,
        opacity: showNotPurchased ? 1 : 0,
        transition: "max-height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
      }}>
        <div className="mx-0 rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-sm sm:mx-16 sm:px-10" dir="rtl"
          style={{ marginTop: showNotPurchased ? 0 : -16, transition: "margin-top 0.5s ease" }}>
          <p className="text-sm font-black mb-4" style={{ color: "#370080", ...F }}>آلبوم‌های خریداری نشده</p>
          <div className="grid grid-cols-2 justify-items-center gap-4 sm:flex sm:justify-center">
            {NOT_PURCHASED_ALBUMS.map((name, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm" style={{ width: 100, height: 118 }}>
                  <ImageWithFallback src={albumComingSoon} alt={name}
                    className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-center leading-tight" style={{ color: "#370080", ...F, maxWidth: 100 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 2: partners club card ── */}
      <div
        className="rounded-2xl overflow-hidden p-5"
        style={{ background: "linear-gradient(135deg, #5b21b6 0%, #370080 55%, #1e0050 100%)" }}
      >
        {/* Header row */}
        <div className="flex items-start justify-end gap-3 mb-4">
          <div className="text-right">
            <p className="text-white font-[600] text-base leading-tight" style={F}>باشگاه همکاران</p>
            <p className="text-purple-200 text-[16px] mt-0.5" style={F}> پروموشن پاییز </p>
          </div>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", marginLeft: "auto" }}
          >
            <Star size={22} className="text-yellow-300" fill="#fde047" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-2 mb-4 text-[16px] sm:grid-cols-2" >
          {[
            { label: "رول های فروخته شده توسط شما از ابتدای پروموشن",  value: "۱7۰ رول"      },
            { label: "مقدار شارژ کیف پول شما از ابتدای پروموشن", value: "750000 تومان"},
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl px-4 py-3 text-right"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <p className="text-purple-200 text-xs mb-1" style={F}>{label}</p>
              <p className="text-white font-black text-sm" style={F}>{value}</p>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => navigate("/profile/pricing-details")}
          className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#ffffff", color: "#1e0050", ...F }}
        >
          ورود به پروموشن پاییزی
          <span className="text-base leading-none">‹</span>
        </button>
      </div>

      {/* ── Section 4: purchase chart ── */}
      <PurchaseChart onBarClick={handleBarClick} />

      {/* ── Section 5: detail cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" dir="rtl">
        {/* Right card: album slider or placeholder */}
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col"
          style={{ minHeight: 240, padding: "16px" }}
        >
          {weeklyClickedBar !== null ? (
            <div key={weeklyClickedBar} dir="rtl" className="flex flex-col h-full"
              style={{ animation: "pbi-fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both" }}>
              {/* Title — top, matching left card */}
              <div className="flex items-center gap-2 mb-4">
                <p className="font-black text-[14px]" style={{ color: "#370080", ...F }}>
                  آلبوم‌های خریداری شده — <span style={{ color: PURPLE }}>{dayLabel}</span>
                </p>
              </div>

              {/* Slider + nav — centered in remaining space */}
              <div className="flex flex-col items-center justify-center flex-1 gap-3">

              {/* Slider — 85% wide, centered */}
              <div style={{ width: "85%", overflow: "hidden" }}>
                <div
                  className="flex gap-2 transition-transform duration-300"
                  style={{ transform: `translateX(${sliderIdx * 50}%)` }}
                >
                  {ALBUMS.map((alb, ai) => {
                    const isSel = selectedAlbumIdx === ai;
                    return (
                      <div
                        key={ai}
                        className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col"
                        style={{
                          width: "calc(50% - 4px)",
                          border: isSel ? `2px solid ${PURPLE}` : `2px solid #f3f4f6`,
                          backgroundColor: isSel ? "rgba(55, 0, 128, 0.06)" : "#fafafa",
                        }}
                        onClick={() => handleAlbumSelect(ai)}
                      >
                        <img
                          src={albumComingSoon}
                          alt={alb.name}
                          className="w-full object-contain"
                          style={{ height: 130 }}
                        />
                        <div className="px-2 py-1.5 flex flex-col gap-0.5" dir="rtl">
                          <p className="text-[11px] font-black leading-tight" style={{ color: isSel ? PURPLE : "#1f2937", ...F }}>{alb.name}</p>
                          <p className="text-[10px]" style={{ color: PURPLE, ...F }}>{alb.rolls} رول</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons — bottom center */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSliderIdx(i => Math.max(0, i - 1))}
                  disabled={!canPrev}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: canPrev ? PURPLE : "#f3f4f6", color: canPrev ? "#fff" : "#d1d5db" }}
                ><ChevronRight size={13} /></button>
                <button
                  onClick={() => setSliderIdx(i => Math.min(ALBUMS.length - VISIBLE, i + 1))}
                  disabled={!canNext}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: canNext ? PURPLE : "#f3f4f6", color: canNext ? "#fff" : "#d1d5db" }}
                ><ChevronLeft size={13} /></button>
              </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-full text-center">
              <div className="flex items-center justify-center rounded-xl p-3" style={{ border: `1px dashed ${PURPLE}60` }}>
                <Search size={22} style={{ color: PURPLE, opacity: 0.8 }} />
              </div>
              <p className="text-xs leading-7 text-center" style={{ color: PURPLE, whiteSpace: "pre-line", ...F }}>{"با کلیک بر روی هر ستون، آلبوم‌های خریداری شده\nدر آن تاریخ را می‌بینید."}</p>
            </div>
          )}
        </div>

        {/* Left card: codes table */}
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col"
          style={{ minHeight: 240, padding: "16px" }}
        >
          {weeklyClickedBar !== null ? (
            <div key={weeklyClickedBar} className="flex flex-col h-full" dir="rtl"
              style={{ animation: "pbi-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both" }}>
              {/* Title */}
              <div className="flex items-center gap-2 mb-4">
                <p className="font-black text-[14px]" style={{ color: "#370080", ...F }}>کدهای خریداری شده — {selectedAlbum?.name}</p>
              </div>

              {/* Table wrapper: centered, narrower, rounded corners */}
              <div className="flex justify-center" style={{ marginTop: 10 }}>
                <style>{`
                  @media (max-width: 639px) {
                    .purchase-code-row:hover {
                      background-color: rgba(252, 252, 253, 0.6) !important;
                    }
                  }
                `}</style>
                <table
                  className="text-xs overflow-hidden"
                  style={{ ...F, width: "85%", borderCollapse: "separate", borderSpacing: 0, borderRadius: 10 }}
                >
                  <thead>
                    <tr style={{ animation: "pbi-row-in 0.35s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}>
                      {[
                        { label: "ردیف",   w: "20%", first: true,  last: false },
                        { label: "کد کالا", w: "50%", first: false, last: false },
                        { label: "تعداد",  w: "30%", first: false, last: true  },
                      ].map(({ label, w, first, last }) => (
                        <th
                          key={label}
                          className="text-center text-[10px] font-black py-2 px-3"
                          style={{
                            width: w,
                            color: PURPLE,
                            backgroundColor: "#f3f0f8",
                            borderBottom: `1.5px solid #e9e3f5`,
                            borderTopRightRadius: first ? 10 : 0,
                            borderTopLeftRadius: last ? 10 : 0,
                          }}
                        >{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, ri) => {
                      const isEven = ri % 2 === 0;
                      const isLast = ri === pageRows.length - 1;
                      return (
                        <tr
                          key={ri}
                          className="purchase-code-row transition-colors sm:hover:brightness-95"
                          style={{
                            backgroundColor: "#fff",
                            animation: `pbi-row-in 0.38s cubic-bezier(0.22,1,0.36,1) ${0.18 + ri * 0.055}s both`,
                          }}
                        >
                          <td className="py-2 px-3 text-center text-gray-400 text-[11px]"
                            style={{ borderBottomRightRadius: isLast ? 10 : 0 }}>
                            {toPersianNum(tablePage * ROWS_PER_PAGE + ri + 1)}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-[11px]" style={{ color: PURPLE }}>
                            {row.code}
                          </td>
                          <td className="py-2 px-3 text-center text-gray-700 font-bold text-[11px]"
                            style={{ borderBottomLeftRadius: isLast ? 10 : 0 }}>
                            {toPersianNum(row.qty)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-auto pt-4">
                  {Array.from({ length: totalPages }, (_, pi) => (
                    <button
                      key={pi}
                      onClick={() => setTablePage(pi)}
                      className="w-6 h-6 rounded-full text-[11px] font-bold transition-all"
                      style={{
                        backgroundColor: tablePage === pi ? PURPLE : "#f3f0f8",
                        color: tablePage === pi ? "#fff" : PURPLE,
                        ...F,
                      }}
                    >{toPersianNum(pi + 1)}</button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 flex-1 text-center">
              <div className="flex items-center justify-center rounded-xl p-3" style={{ border: `1px dashed ${PURPLE}60` }}>
                <Search size={22} style={{ color: PURPLE, opacity: 0.8 }} />
              </div>
              <p className="text-xs leading-7 text-center" style={{ color: PURPLE, whiteSpace: "pre-line", ...F }}>{"با کلیک روی هر ستون، کدهای خریداری شده\nدر آن بازه زمانی را می‌بینید."}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 6: best-selling codes ── */}
      <div className="flex flex-col gap-2" dir="rtl">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#CA165C" }} />
          <p className="font-black text-[16px]" style={{ color: "#CA165C", ...F }}>کدهای پرفروش</p>
        </div>
        <BestCodesCard />
      </div>


      {/* ── Section 8: طرح های ترند ── */}
      <div className="flex flex-col gap-2" dir="rtl">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#CA165C" }} />
          <p className="font-black text-[16px]" style={{ color: "#CA165C", ...F }}>طرح های ترند</p>
        </div>
        <TrendSlider />
      </div>

    </div>
  );
}

// ─── Trend Slider ───────────────────────────────────────────────────────────

const TREND_ITEMS = [
  { img: trendImg1, album: "آلبوم برف سفید",   code: "۲۰۶۷"   },
  { img: trendImg2, album: "آلبوم سنگ طبیعی", code: "۲۰۵۴۴"  },
  { img: trendImg3, album: "آلبوم کاغذ گل",    code: "۲۰۵۷"   },
  { img: trendImg4, album: "آلبوم طلایی کهن",  code: "۲۰۸۴"   },
];

function TrendSlider() {
  const [active, setActive] = useState(1);
  const n = TREND_ITEMS.length;

  // Per-property transitions — slow, no overshoot
  const T = "left 0.85s cubic-bezier(0.4,0,0.2,1), top 0.85s cubic-bezier(0.4,0,0.2,1), width 0.85s cubic-bezier(0.4,0,0.2,1), height 0.85s cubic-bezier(0.4,0,0.2,1), filter 0.85s ease, box-shadow 0.85s ease";

  function cs(i: number): React.CSSProperties {
    let off = i - active;
    // Normalize for circular wrap
    if (off > n / 2) off -= n;
    if (off < -n / 2) off += n;
    const base: React.CSSProperties = { position: "absolute", overflow: "hidden", transition: T };
    if (off === 0) return {
      ...base, left: "25%", top: "0%", width: "50%", height: "100%",
      borderRadius: 18, zIndex: 3, filter: "none",
      boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
    };
    if (off === -1) return {
      ...base, left: "9%", top: "28%", width: "22%", height: "66%",
      borderRadius: 14, zIndex: 2, filter: "grayscale(100%) brightness(0.75)",
      boxShadow: "0 4px 14px rgba(0,0,0,0.10)", cursor: "pointer",
    };
    if (off === 1) return {
      ...base, left: "69%", top: "28%", width: "22%", height: "66%",
      borderRadius: 14, zIndex: 2, filter: "grayscale(100%) brightness(0.75)",
      boxShadow: "0 4px 14px rgba(0,0,0,0.10)", cursor: "pointer",
    };
    // Off-screen — clipped by overflow:hidden on stage, no opacity tricks
    return {
      ...base, left: off < 0 ? "-28%" : "107%", top: "28%", width: "22%", height: "66%",
      borderRadius: 14, zIndex: 1, filter: "grayscale(100%)", pointerEvents: "none",
    };
  }

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 20, padding: "32px 0 32px", marginTop: 12, border: "1px solid #f0f0f0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }} dir="ltr">
      <style>{`
        @media (max-width: 639px) {
          .trend-slide {
            height: auto !important;
            aspect-ratio: 1 / 1;
          }
          .trend-slide-active {
            left: 16% !important;
            width: 68% !important;
          }
          .trend-slider-track {
            position: relative;
            display: block !important;
            padding-right: 8px !important;
            padding-left: 8px !important;
          }
          .trend-slider-nav {
            position: absolute !important;
            top: calc(50% + 10px);
            width: 32px !important;
            height: 32px !important;
            margin-top: 0 !important;
            transform: translateY(-50%);
          }
          .trend-slider-prev {
            left: calc(16% + 16px);
          }
          .trend-slider-next {
            right: calc(16% + 16px);
          }
        }
      `}</style>

      {/* Title — white gradient overlaid */}
      <div style={{ position: "relative", textAlign: "center", marginBottom: 66, padding: "0 20px", paddingTop: 30 }}>
        <p style={{ fontSize: 39, fontWeight: 900, letterSpacing: "0.02em", color: "#c7cfe8", textTransform: "uppercase", fontFamily: "sans-serif", margin: 0, position: "relative", zIndex: 1, lineHeight: 1.1, marginTop: 15 }}>
          This month&apos;s<br />trends
        </p>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 58%, rgba(255,255,255,0.7) 82%, #fff 100%)", zIndex: 2, pointerEvents: "none" }} />
      </div>

      {/* Arrows + stage */}
      <div className="trend-slider-track" style={{ display: "flex", alignItems: "center", padding: "0 28px" }}>
        <button className="trend-slider-nav trend-slider-prev" onClick={() => setActive(a => (a - 1 + n) % n)} style={{
          flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
          border: `2px solid ${PURPLE}`,
          backgroundColor: PURPLE,
          color: "#fff",
          cursor: "pointer",
          fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.22s", boxShadow: "0 4px 14px rgba(55,0,128,0.28)", zIndex: 10,
          marginTop: 40,
        }}>‹</button>

        {/* outer wrapper: overflow:hidden clips side cards; vertical padding gives shadow room */}
        <div style={{ flex: 1, overflow: "hidden", marginTop: -50, marginBottom: -50, paddingTop: 50, paddingBottom: 50 }}>
          <div className="h-[220px] sm:h-[360px]" style={{ position: "relative" }}>
            {TREND_ITEMS.map((item, i) => (
              <div key={i} className={`trend-slide ${i === active ? "trend-slide-active" : ""}`} style={cs(i)} onClick={() => i !== active && setActive(i)}>
                <img src={item.img} alt={item.album}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={e => { if (i === active) e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="trend-slider-nav trend-slider-next" onClick={() => setActive(a => (a + 1) % n)} style={{
          flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
          border: `2px solid ${PURPLE}`,
          backgroundColor: PURPLE,
          color: "#fff",
          cursor: "pointer",
          fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.22s", boxShadow: "0 4px 14px rgba(55,0,128,0.28)", zIndex: 10,
          marginTop: 40,
        }}>›</button>
      </div>

      {/* Info — doubled gap from stage */}
      <div style={{ textAlign: "center", marginTop: 48, padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", marginBottom: 10 }}>
          <div style={{ flex: 1, maxWidth: 56, height: 1, backgroundColor: PURPLE, borderRadius: 9999 }} />
          <p style={{ fontSize: 15, fontWeight: 900, color: "#370080", margin: 0, ...F }}>
            {TREND_ITEMS[active].album}
          </p>
          <div style={{ flex: 1, maxWidth: 56, height: 1, backgroundColor: PURPLE, borderRadius: 9999 }} />
        </div>
        <p style={{ fontSize: 15, color: PURPLE, fontWeight: 700, letterSpacing: "0.04em", margin: 0, ...F }}>
          {TREND_ITEMS[active].code}
        </p>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
        {TREND_ITEMS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? 22 : 7, height: 7, borderRadius: 9999,
            backgroundColor: i === active ? PURPLE : "#c4b5fd",
            border: "none", cursor: "pointer", padding: 0,
            transition: "all 0.35s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Purchase Chart ────────────────────────────────────────────────────────

type PurchaseFilter = "هفتگی" | "ماهانه" | "سالانه";

const purchaseData: Record<PurchaseFilter, { label: string; rolls: number }[]> = {
  هفتگی: persianDays.map((label, i) => ({
    label,
    rolls: [28, 45, 38, 62, 51, 47, 22][i],
  })),
  ماهانه: Array.from({ length: 30 }, (_, i) => ({
    label: toPersianNum(i + 1),
    rolls: [32,41,28,55,48,36,62,44,58,39,51,35,68,30,47,43,57,38,64,49,42,60,33,52,70,37,55,41,59,45][i],
  })),
  سالانه: persianMonths.map((label, i) => ({
    label,
    rolls: [210, 265, 240, 310, 295, 280, 380, 355, 410, 450, 490, 540][i],
  })),
};

const PURCHASE_H = 240;
const PURCHASE_Y_TICKS = 5;

function fmtRolls(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function PurchaseChart({ onBarClick }: { onBarClick?: (idx: number | null) => void }) {
  const [filter, setFilter] = useState<PurchaseFilter>("سالانه");
  const [displayFilter, setDisplayFilter] = useState<PurchaseFilter>("سالانه");
  const [chartVisible, setChartVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pinIdx, setPinIdx] = useState<number>(0);
  const data = purchaseData[displayFilter];
  const filters: PurchaseFilter[] = ["هفتگی", "ماهانه", "سالانه"];

  useEffect(() => {
    const t = setTimeout(() => setChartVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hoveredIdx !== null) setPinIdx(hoveredIdx);
  }, [hoveredIdx]);

  function handleFilter(f: PurchaseFilter) {
    if (f === filter) return;
    setFilter(f);
    setChartVisible(false);
    setHoveredIdx(null);
    setPinIdx(0);
    if (f !== "هفتگی") onBarClick?.(null);
    setTimeout(() => {
      setDisplayFilter(f);
      setChartVisible(true);
    }, 280);
  }

  const maxVal = Math.max(...data.map(d => d.rolls));
  const yMax = Math.ceil(maxVal / 50) * 50 + 50;
  const yTicks = Array.from({ length: PURCHASE_Y_TICKS + 1 }, (_, i) =>
    Math.round((yMax / PURCHASE_Y_TICKS) * (PURCHASE_Y_TICKS - i))
  );
  const xStep = displayFilter === "ماهانه" ? 4 : 1;

  return (
    <div className="flex flex-col gap-2">
      {/* Title — outside card */}
      <div className="flex items-center gap-2" dir="rtl">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#CA165C" }} />
        <p className="font-black text-[16px]" style={{ color: "#CA165C", ...F }}>آمار کل خرید</p>
      </div>

    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm" style={{ marginTop: 15 }}>
      {/* Header */}
      <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0" dir="rtl">
        <div className="flex flex-col gap-1" dir="rtl">
          <p className="text-sm font-black" style={{ color: "#370080", ...F }}>آمار خرید</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-1.5">
          <PersianRangePicker compact />
          <div className="w-px h-5 bg-gray-200" />
          {filters.map(f => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className="shrink-0 rounded-lg px-2 py-1.5 text-[10px] font-bold transition-all sm:px-3 sm:text-xs"
              style={{ backgroundColor: filter === f ? PURPLE : "#f3f4f6", color: filter === f ? "#fff" : "#6b7280", ...F }}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex gap-2" dir="ltr" style={{ opacity: chartVisible ? 1 : 0, transform: chartVisible ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Y-axis */}
        <div className="flex flex-col justify-between items-end pb-6 shrink-0" style={{ height: PURCHASE_H + 24 }}>
          {yTicks.map(v => (
            <span key={`py-${v}`} className="text-[10px] text-gray-400 leading-none" style={F}>{fmtRolls(v)}</span>
          ))}
        </div>

        {/* Bars + X */}
        <div className="flex-1 min-w-0">
          <div className="relative" style={{ height: PURCHASE_H }}>
            {/* Grid lines */}
            {yTicks.map((_, i) => (
              <div
                key={`pgrid-${i}`}
                className="absolute w-full"
                style={{ top: `${(i / PURCHASE_Y_TICKS) * 100}%`, borderTop: "1px dashed #e5e7eb" }}
              />
            ))}

            {/* Floating tooltip — single instance, transitions with bar height */}
            {(() => {
              const safeIdx = Math.min(pinIdx, data.length - 1);
              const pd = data[safeIdx];
              const pBarH = Math.round((pd.rolls / yMax) * PURCHASE_H);
              const tipBottom = pBarH + 14;
              const leftPct = ((pinIdx + 0.5) / data.length) * 100;
              const clampedLeft = Math.min(Math.max(leftPct, 8), 92);
              return (
                <div
                  className="absolute z-30 pointer-events-none"
                  style={{
                    bottom: tipBottom,
                    left: `${clampedLeft}%`,
                    transform: "translateX(-50%)",
                    opacity: hoveredIdx !== null ? 1 : 0,
                    transition: "bottom 0.28s cubic-bezier(0.34,1.2,0.64,1), left 0.28s cubic-bezier(0.34,1.2,0.64,1), opacity 0.18s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    className="rounded-xl px-3.5 py-2.5 text-right"
                    style={{
                      backgroundColor: "#fff",
                      border: "1.5px solid #ede9fe",
                      boxShadow: "0 6px 20px rgba(55,0,128,0.12)",
                      ...F,
                    }}
                  >
                    <p className="font-black text-xs text-gray-800 mb-2">{pd.label}</p>
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <span className="font-black" style={{ color: PURPLE }}>{pd.rolls}</span>
                      <span className="text-gray-400">تعداد رول خریداری شده</span>
                    </div>
                  </div>
                  <div
                    className="absolute w-2.5 h-2.5"
                    style={{
                      bottom: -5,
                      left: "50%",
                      transform: "translateX(-50%) rotate(45deg)",
                      backgroundColor: "#fff",
                      border: "1.5px solid #ede9fe",
                      borderTop: "none",
                      borderLeft: "none",
                    }}
                  />
                </div>
              );
            })()}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-px">
              {data.map((d, i) => {
                const barH = Math.round((d.rolls / yMax) * PURCHASE_H);
                const isHovered = hoveredIdx === i;
                return (
                  <div
                    key={`pgroup-${filter}-${i}`}
                    className="flex-1 flex items-end justify-center relative cursor-pointer"
                    style={{ height: "100%" }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => { if (filter === "هفتگی") onBarClick?.(i); }}
                  >
                    <div
                      className="absolute inset-x-0 inset-y-0 transition-opacity duration-200"
                      style={{ backgroundColor: "rgba(55,0,128,0.04)", opacity: isHovered ? 1 : 0 }}
                    />
                    <div
                      className="relative z-10 w-4/5"
                      style={{
                        height: barH,
                        backgroundColor: PURPLE,
                        borderRadius: "4px 4px 0 0",
                        opacity: isHovered ? 1 : 0.88,
                        transformOrigin: "bottom",
                        transition: "opacity 0.2s",
                        animation: `barGrow 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.03}s both`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X labels */}
          <div className="flex gap-px mt-1">
            {data.map((d, i) => (
              <div key={`pxl-${filter}-${i}`} className="flex-1 text-center overflow-hidden">
                {i % xStep === 0 && (
                  <span className="text-[10px] text-gray-400 leading-none block truncate" style={F}>{d.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}

// ─── Single Roll Sale ──────────────────────────────────────────────────────

const SR_PRODUCTS = [
  { code: "202002", price: 1_800_000 },
  { code: "202006", price: 2_400_000 },
  { code: "202017", price: 3_200_000 },
  { code: "202039", price: 1_500_000 },
  { code: "202040", price: 2_800_000 },
];
const SR_LOTS    = ["0103", "0109", "1206", "0108"];
const SR_SERIALS = ["1134", "2287", "3301", "4456"];

function SrFieldCard({ label, placeholder, value, options, enabled, open, onToggle, onSelect }: {
  label: string; placeholder: string; value: string;
  options: string[]; enabled: boolean;
  open: boolean; onToggle: () => void;
  onSelect: (v: string) => void;
}) {
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setSearch(""); const t = setTimeout(() => inputRef.current?.focus(), 60); return () => clearTimeout(t); }
  }, [open]);

  useEffect(() => {
    function h(e: MouseEvent) { if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) onToggle(); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onToggle]);

  const filtered = options.filter(o => o.includes(search));

  return (
    <div ref={containerRef} style={{ position: "relative", flex: 1 }}>
      <button onClick={() => enabled && onToggle()} style={{
        width: "100%", padding: "18px 16px 18px 32px", borderRadius: 14,
        background: enabled ? "#fff" : "rgba(248,248,248,0.9)",
        border: `1.5px solid ${open ? PURPLE : enabled ? "#e5e7eb" : "rgba(216,216,216,0.35)"}`,
        boxShadow: enabled ? "0 2px 12px rgba(0,0,0,0.05)" : "none",
        cursor: enabled ? "pointer" : "not-allowed",
        textAlign: "right", display: "flex", flexDirection: "column", gap: 6,
        transition: "border-color 0.2s",
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: enabled ? "rgba(55,0,128,0.6)" : "#ccc", ...F }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 900, color: enabled ? (value ? PURPLE : "#370080") : "#ccc", ...F }}>
          {value || placeholder}
        </span>
        <svg style={{ position: "absolute", left: 12, top: "50%", transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: "transform 0.25s", opacity: enabled ? 0.55 : 0.2 }}
          width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M2 4.5l5 5 5-5" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{
        position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50,
        backgroundColor: "#fff", border: "1.5px solid #ede8f7", borderRadius: 12,
        boxShadow: "0 8px 32px rgba(55,0,128,0.12)", overflow: "hidden",
        maxHeight: open ? 280 : 0, opacity: open ? 1 : 0,
        transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s",
        pointerEvents: open ? "auto" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderBottom: "1px solid #f0ebff", backgroundColor: "#faf8ff" }}>
          <Search size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
          <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..." dir="rtl"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 13, backgroundColor: "transparent", color: "#374151", textAlign: "right", ...F }} />
        </div>
        <div style={{ overflowY: "auto", maxHeight: 210 }}>
          {filtered.length === 0
            ? <p style={{ margin: 0, padding: "12px 16px", fontSize: 13, color: "#9ca3af", textAlign: "right", ...F }}>موردی یافت نشد</p>
            : filtered.map(opt => (
              <button key={opt} onClick={() => { onSelect(opt); onToggle(); }}
                style={{ width: "100%", padding: "10px 16px", textAlign: "right", backgroundColor: opt === value ? "rgba(55, 0, 128, 0.06)" : "#fff", border: "none", borderBottom: "1px solid #f5f0ff", cursor: "pointer", fontSize: 14, fontWeight: 700, color: opt === value ? PURPLE : "#374151", ...F }}>
                {opt}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

type SrRecord = { id: number; productCode: string; lot: string; serial: string };

function SrRecordRow({ rec, idx, onDelete }: { rec: SrRecord; idx: number; onDelete: () => void }) {
  const product = SR_PRODUCTS.find(p => p.code === rec.productCode);
  const basePrice  = product?.price ?? 0;
  const afterPrice = Math.round(basePrice * 0.6);
  return (
    <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
      style={{ backgroundColor: "#fff", borderTop: "1.5px solid #ede8f7" }}
    >
      <div className="flex w-full flex-col gap-3 sm:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-gray-100">
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", ...F }}>{toPersianNum(idx + 1)}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 text-right">
            <span style={{ fontSize: 14, fontWeight: 300, color: "#6A7282", ...F }}>شناسه بسته</span>
            <span className="break-all" style={{ fontSize: 14, fontWeight: 600, color: "#1E2939", ...F }}>ParcelT120201712107569</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[["نام کالا", rec.productCode], ["لات", rec.lot], ["سریال", rec.serial]].map(([lbl, val]) => (
            <div key={lbl} className="flex min-w-0 flex-col gap-1 text-right">
              <span style={{ fontSize: 14, fontWeight: 300, color: "#6A7282", ...F }}>{lbl}</span>
              <span className="break-words" style={{ fontSize: 14, fontWeight: 600, color: "#1E2939", ...F }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-gray-100 sm:flex">
        <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", ...F }}>{toPersianNum(idx + 1)}</span>
      </div>
      <div className="hidden flex-1 grid-cols-[1fr_auto_auto_auto] items-start gap-x-[22px] sm:grid">
        <div className="flex flex-col gap-1 text-right">
          <span style={{ fontSize: 14, fontWeight: 300, color: "#6A7282", ...F }}>شناسه بسته</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1E2939", whiteSpace: "nowrap", ...F }}>ParcelT120201712107569</span>
        </div>
        {[["نام کالا", rec.productCode], ["لات", rec.lot], ["سریال", rec.serial]].map(([lbl, val]) => (
          <div key={lbl} className="flex flex-col gap-1 text-right">
            <span style={{ fontSize: 14, fontWeight: 300, color: "#6A7282", ...F }}>{lbl}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1E2939", ...F }}>{val}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full items-center justify-between gap-3 sm:contents">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col gap-1">
            <span style={{ fontSize: 14, fontWeight: 600, color: "#370080", textDecoration: "line-through", ...F }}>{toPersianNum(basePrice)} تومان</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#370080", ...F }}>{toPersianNum(afterPrice)} تومان</span>
          </div>
          <span style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#370080", color: "#fff", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...F }}>۴۰٪</span>
        </div>
        <div className="flex items-center gap-2 sm:mr-auto">
          <button onClick={() => addToCart(1)} style={{ padding: "8px 18px", borderRadius: 10, backgroundColor: "#CA165C", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 900, color: "#fff", boxShadow: "0 3px 10px #CA165C44", ...F }}>
            <ShoppingCart size={13} style={{ display: "inline", marginLeft: 4 }} />
            افزودن به سبد
          </button>
          <button onClick={onDelete} style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: "#fff0f4", border: "1.5px solid #CA165C", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trash2 size={15} color="#CA165C" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SrProductTable() {
  const [productCode, setProductCode] = useState("");
  const [lot, setLot]   = useState("");
  const [serial, setSerial] = useState("");
  const [records, setRecords] = useState<SrRecord[]>([]);
  const [openField, setOpenField] = useState<"product" | "lot" | "serial" | null>(null);
  const idRef = useRef(0);

  const step2 = productCode !== "";
  const step3 = step2 && lot !== "";

  function toggleField(name: "product" | "lot" | "serial") {
    setOpenField(prev => prev === name ? null : name);
  }

  function handleSerialSelect(v: string) {
    setRecords(prev => [...prev, { id: ++idRef.current, productCode, lot, serial: v }]);
    setProductCode(""); setLot(""); setSerial("");
  }

  return (
    <div style={{ marginTop: 48 }}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SrFieldCard label="نام کالا" placeholder="انتخاب کنید" value={productCode} options={SR_PRODUCTS.map(p => p.code)} enabled={true}
          open={openField === "product"} onToggle={() => toggleField("product")}
          onSelect={v => { setProductCode(v); setLot(""); setSerial(""); setOpenField(null); }} />
        <SrFieldCard label="لات نامبر" placeholder="ابتدا انتخاب کنید" value={lot} options={SR_LOTS} enabled={step2}
          open={openField === "lot"} onToggle={() => toggleField("lot")}
          onSelect={v => { setLot(v); setSerial(""); setOpenField(null); }} />
        <SrFieldCard label="سریال" placeholder="ابتدا لات انتخاب کنید" value={serial} options={SR_SERIALS} enabled={step3}
          open={openField === "serial"} onToggle={() => toggleField("serial")}
          onSelect={v => { handleSerialSelect(v); setOpenField(null); }} />
      </div>
      <AnimatePresence>
        {records.length > 0 && (
          <motion.div key="sr-table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.24 }}
            style={{ marginTop: 14, borderRadius: 14, border: "1.5px solid #ede8f7", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 2px 14px rgba(55,0,128,0.06)" }}>
            <div style={{ padding: "16px 24px", backgroundColor: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: "#fff", ...F }}>اطلاعات کالاهای انتخابی</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", ...F }}>({toPersianNum(records.length)} ردیف)</span>
            </div>
            <AnimatePresence initial={false}>
              {records.map((rec, idx) => (
                <SrRecordRow key={rec.id} rec={rec} idx={idx} onDelete={() => setRecords(prev => prev.filter(r => r.id !== rec.id))} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SingleRollSaleSection() {
  return (
    <div>
      <ProfileSectionHeading>
        <h1 className="text-right text-base font-black text-gray-900 sm:text-xl" style={F}>فروش تک رولی‌ها</h1>
      </ProfileSectionHeading>
      <div className="h-px bg-gray-100 mb-5" />
      <p className="text-sm text-gray-500 text-right mb-6" style={F}>شما می‌تونی با تخفیف ویژه از ما خریداری کنی. فقط کافیه کد رول دلخواتو انتخاب و از تخفیف ویژه استفاده کنی.</p>
      <SrProductTable />
    </div>
  );
}

// ─── Profile Page ──────────────────────────────────────────────────────────

export function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("profile");
  useEffect(() => {
    const section = new URLSearchParams(location.search).get("section");
    if (section && menuItems.some(item => item.key === section)) setActive(section);
  }, [location.search]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeDesktopMenu = () => { if (media.matches) setSidebarOpen(false); };
    media.addEventListener("change", closeDesktopMenu);
    return () => media.removeEventListener("change", closeDesktopMenu);
  }, []);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const storedUser: unknown = getUser();
  const userRecord = storedUser && typeof storedUser === "object"
    ? storedUser as Record<string, unknown>
    : null;
  const nameValue = typeof storedUser === "string"
    ? storedUser
    : userRecord?.name ?? userRecord?.fullName;
  const nameParts = (typeof nameValue === "string" ? nameValue.trim() : "").split(/\s+/);
  const firstName = "کاربر";
  const lastName = "سایت";

  const [notifEnabled, setNotifEnabled] = useState(false);

  const handleReturnSubmit = (req: ReturnRequest) => {
    setReturnRequests(prev => [req, ...prev]);
    setActive("returns");
  };

  const handleMenu = (key: string) => {
    setSidebarOpen(false);
    if (key === "logout") { clearUser(); navigate("/login"); return; }
    setActive(key);
  };

  const activeLabel = menuItems.find(m => m.key === active)?.label ?? "";

  return (
    <div id="profile-page" dir="rtl" className="min-h-screen bg-[#ffffff]" style={F}>
    <style>{`
      @media (max-width: 639px) {
        #profile-content input, #profile-content textarea, #profile-content select { font-size: 16px; min-width: 0; }
        #profile-content button { touch-action: manipulation; }
      }
      @media (prefers-reduced-motion: reduce) {
        #profile-content *, #profile-mobile-menu * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
      @keyframes pbi-fade-up {
        from { opacity: 0; transform: translateY(18px) scale(0.98); filter: blur(2px); }
        to   { opacity: 1; transform: translateY(0)   scale(1);    filter: blur(0); }
      }
      @keyframes pbi-row-in {
        from { opacity: 0; transform: translateY(-10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes chartLineDraw {
        from { stroke-dashoffset: 1; }
        to   { stroke-dashoffset: 0; }
      }
      @keyframes chartFillFade {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes barGrow {
        from { transform: scaleY(0); opacity: 0; }
        to   { transform: scaleY(1); opacity: 1; }
      }
    `}</style>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-10">

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent id="profile-mobile-menu" side="right" dir="rtl"
            className="w-[min(90vw,360px)] gap-0 overflow-y-auto rounded-l-3xl border-[#370080]/10 px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-5 text-[#370080] [&>button]:left-4 [&>button]:right-auto [&>button]:rounded-xl [&>button]:p-2.5"
            style={F}
            onCloseAutoFocus={event => { event.preventDefault(); mobileMenuButtonRef.current?.focus({ preventScroll: true }); }}
          >
            <SheetHeader className="px-1 pb-5 pt-0 text-right">
              <SheetTitle className="text-lg font-bold text-[#370080]">حساب کاربری</SheetTitle>
              <SheetDescription className="text-xs leading-6 text-[#370080]/60">دسترسی به سفارش‌ها، کیف پول و تنظیمات</SheetDescription>
            </SheetHeader>
            <nav aria-label="منوی حساب کاربری" className="space-y-5">
              {Array.from(new Set(visibleMenuItems.map(item => item.group).filter(Boolean))).map(group => (
                <div key={group}>
                  <p className="mb-2 px-3 text-xs font-medium text-[#370080]/50">{group}</p>
                  <div className="space-y-1">
                    {visibleMenuItems.filter(item => item.group === group).map(({ key, label, icon: Icon }) => (
                      <button key={key} type="button" data-profile-menu={key}
                        aria-current={active === key ? "page" : undefined}
                        onClick={() => handleMenu(key)}
                        className={`flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-3 text-right text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#370080] ${active === key ? "bg-[#F1EDF8] font-semibold text-[#370080]" : "text-[#370080]/75 hover:bg-[#F8F6FC]"}`}
                      >
                        <Icon size={19} className="shrink-0" aria-hidden="true" />
                        <span className="min-w-0 flex-1 leading-6">{key === "salesdb" ? "پنل فروشگاه" : label}</span>
                        {["salesdb", "single-roll", "wallet"].includes(key) && <span className="rounded-full bg-[#CA165C]/8 px-2 py-0.5 text-[10px] text-[#CA165C]">جدید</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => handleMenu("logout")} className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-[#CA165C]/15 px-3 py-3 text-right text-sm font-medium text-[#CA165C]"><LogOut size={19} aria-hidden="true" />خروج از حساب کاربری</button>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex gap-5 items-start">

          {/* ── RIGHT: sidebar — desktop only ── */}
          <div className="hidden w-[260px] shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-sm lg:block xl:w-[280px]">
            {visibleMenuItems.map(({ key, label, icon: Icon, color, group }, idx) => {
              const prevGroup = idx > 0 ? visibleMenuItems[idx - 1].group : null;
              const showHeader = group && group !== prevGroup;
              return (
                <div key={key}>
                  <button data-profile-menu={key} onClick={() => handleMenu(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-base font-medium transition-colors border-b border-gray-100 last:border-0 hover:bg-[#FCFCFD]/60 ${active === key && key !== "logout" ? "bg-white text-[#1E2939]" : "text-gray-700 bg-white"}`}
                    style={{ color: key === "logout" ? "#CA165C" : undefined, ...F }}>
                    <Icon size={16} className="shrink-0" color={key === "logout" ? "#CA165C" : "#9ca3af"} />
                    <span className="flex-1 text-right">{key === "salesdb" ? "پنل فروشگاه" : label}</span>
                    {(key === "salesdb" || key === "single-roll" || key === "wallet") && (
                      <span className="rounded-full px-1.5 py-0.5 text-xs font-light" style={{ backgroundColor: "#CA165C", color: "#fff", ...F }}>جدید</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── LEFT: content ── */}
          <div id="profile-content" data-profile-section={active} className={`w-full flex-1 min-w-0 ${active === "profile" ? "flex flex-col gap-5" : "bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8"}`}>

            {active === "profile" && (
              <>
                {/* کارت ۱ — اطلاعات مشتری حقیقی */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
                  <ProfileSectionHeading><h1 className="text-right text-base font-black text-gray-900 sm:text-xl" style={F}>تنظیمات حساب کاربری</h1></ProfileSectionHeading>
                  <div className="h-px bg-gray-100 mb-5" />
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-3 sm:gap-5">
                      <div className="flex min-w-0 flex-col gap-2">
                        <label className="text-right text-sm font-semibold text-[#1E2939]" style={F}>نام :</label>
                        <div className="break-words rounded-xl border border-gray-200 bg-[#FCFCFD]/50 px-3 py-2.5 text-right text-sm font-light text-[#6A7282]" style={F}>کاربر</div>
                      </div>
                      <div className="flex min-w-0 flex-col gap-2">
                        <label className="text-right text-sm font-semibold text-[#1E2939]" style={F}>نام خانوادگی :</label>
                        <div className="break-words rounded-xl border border-gray-200 bg-[#FCFCFD]/50 px-3 py-2.5 text-right text-sm font-light text-[#6A7282]" style={F}>سایت</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-right text-sm font-semibold text-[#1E2939]" style={F}>تلفن همراه :</label>
                      <div className="rounded-xl border border-gray-200 bg-[#FCFCFD]/50 px-3 py-2.5 text-right text-sm font-light text-[#6A7282]" dir="ltr" style={F}>0910000000</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-right text-sm font-semibold text-[#1E2939]" style={F}>آدرس :</label>
                      <div className="min-h-11 whitespace-normal break-words rounded-xl border border-gray-200 bg-[#FCFCFD]/50 px-3 py-2.5 text-right text-sm leading-7 font-light text-[#6A7282]" style={F}>اینجا باید آدرس تفصیلی مشتری درج شود.</div>
                    </div>
                  </div>
                </div>

                {/* کارت ۲ — فعال‌سازی / غیرفعال‌سازی اعلان */}
              </>
            )}

            {active === "orders"   && <OrdersSection returnRequests={returnRequests} />}
            {active === "notifs"   && <NotificationsSection />}
            {active === "wishlist" && <WishlistSection />}
            {active === "quick"    && <QuickOrderSection />}
            {active === "return"    && <ReturnRequestSection onSubmit={handleReturnSubmit} />}
            {active === "returns"   && <ReturnListSection requests={returnRequests} />}
            {active === "statement" && <StatementSection />}
            {active === "wallet"    && <WalletSection />}
            {active === "salesdb"     && <SalesDashboardSection />}
            {active === "single-roll" && <SingleRollSaleSection />}

            {!["profile","orders","notifs","wishlist","quick","return","returns","statement","wallet","salesdb","single-roll"].includes(active) && (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  {(() => { const item = menuItems.find(m => m.key === active); if (!item) return null; const Icon = item.icon; return <Icon size={24} className="text-gray-400" />; })()}
                </div>
                <p className="text-gray-400 text-sm" style={F}>{menuItems.find(m => m.key === active)?.label}</p>
                <p className="text-gray-300 text-xs mt-1" style={F}>به زودی</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
