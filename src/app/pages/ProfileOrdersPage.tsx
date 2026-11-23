import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ShoppingBag, User, MapPin, Heart, LogOut,
  ChevronLeft, Package, Clock, CheckCircle, XCircle, Truck,
} from "lucide-react";
import { getUser, clearUser } from "@/app/components/Header";

const F = { fontFamily: "'Vazirmatn', sans-serif" };
const PURPLE = "#370080";

type OrderStatus = "در انتظار پرداخت" | "در حال پردازش" | "ارسال شده" | "تحویل داده شده" | "لغو شده";

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  tracking?: string;
}

const mockOrders: Order[] = [
  { id: "ORD-۱۰۰۳۴", date: "۱۴۰۳/۰۵/۱۲", items: 3, total: 1504269, status: "تحویل داده شده", tracking: "TRK-۸۸۱۲" },
  { id: "ORD-۱۰۰۲۸", date: "۱۴۰۳/۰۴/۲۸", items: 1, total: 501423,  status: "ارسال شده",       tracking: "TRK-۷۷۴۵" },
  { id: "ORD-۱۰۰۱۵", date: "۱۴۰۳/۰۳/۰۵", items: 2, total: 1002846, status: "لغو شده" },
  { id: "ORD-۱۰۰۰۹", date: "۱۴۰۳/۰۲/۱۸", items: 4, total: 2009692, status: "تحویل داده شده", tracking: "TRK-۶۶۱۱" },
];

function statusConfig(s: OrderStatus) {
  const map: Record<OrderStatus, { icon: React.ReactNode; color: string; bg: string }> = {
    "در انتظار پرداخت": { icon: <Clock size={14} />,        color: "text-amber-600",   bg: "bg-amber-50"   },
    "در حال پردازش":   { icon: <Package size={14} />,      color: "text-blue-600",    bg: "bg-blue-50"    },
    "ارسال شده":        { icon: <Truck size={14} />,         color: "text-indigo-600",  bg: "bg-indigo-50"  },
    "تحویل داده شده":  { icon: <CheckCircle size={14} />,   color: "text-emerald-600", bg: "bg-emerald-50" },
    "لغو شده":          { icon: <XCircle size={14} />,       color: "text-red-500",     bg: "bg-red-50"     },
  };
  return map[s];
}

function fmt(n: number) { return n.toLocaleString("fa-IR"); }

const menuItems = [
  { icon: <ShoppingBag size={18} />, label: "سفارش‌های من",    path: "/profile/orders",   group: "داشبورد"          },
  { icon: <User size={18} />,        label: "اطلاعات حساب",    path: "/profile",           group: "تنظیمات حساب کاربری" },
  { icon: <MapPin size={18} />,      label: "آدرس‌های من",     path: "/profile/address",   group: "تنظیمات حساب کاربری" },
  { icon: <Heart size={18} />,       label: "علاقه‌مندی‌ها",  path: "/profile/wishlist",  group: "تنظیمات حساب کاربری" },
];

export function ProfileOrdersPage() {
  const navigate = useNavigate();
  const user = getUser() ?? "کاربر سایت";
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");

  const tabs: { key: "all" | OrderStatus; label: string }[] = [
    { key: "all",              label: "همه سفارش‌ها"     },
    { key: "در حال پردازش",   label: "در حال پردازش"    },
    { key: "ارسال شده",        label: "ارسال شده"         },
    { key: "تحویل داده شده",  label: "تحویل داده شده"   },
    { key: "لغو شده",          label: "لغو شده"           },
  ];

  const filtered = activeTab === "all" ? mockOrders : mockOrders.filter(o => o.status === activeTab);

  const handleLogout = () => {
    clearUser();
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50" style={F}>


      <div className="mx-auto px-4 sm:px-6 py-8" style={{ maxWidth: "1380px" }}>
        <div className="flex gap-6 items-start">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-3">

            {/* User card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: PURPLE }}
              >
                <User size={28} className="text-white" />
              </div>
              <p className="font-black text-gray-900 text-base" style={F}>{user}</p>
              <p className="text-xs text-gray-400 mt-1" style={F}>عضو کنسرسیوم</p>
            </div>

            {/* Nav */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {menuItems.map((item, idx) => {
                const isActive = item.path === "/profile/orders";
                const showGroupLabel = idx === 0 || menuItems[idx - 1].group !== item.group;
                return (
                  <div key={item.label}>
                    {showGroupLabel && (
                      <div className={`px-5 py-2.5 ${idx > 0 ? "border-t border-gray-100" : ""}`}>
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider" style={F}>
                          {item.group}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-colors text-right
                        ${isActive ? "text-white" : "text-gray-700 hover:bg-gray-50"}
                        ${idx < menuItems.length - 1 ? "border-b border-gray-100" : ""}
                      `}
                      style={{ ...(isActive ? { background: PURPLE } : {}), ...F }}
                    >
                      <span className={isActive ? "text-white" : "text-gray-400"}>{item.icon}</span>
                      {item.label}
                    </button>
                  </div>
                );
              })}
              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  style={F}
                >
                  <LogOut size={18} />
                  خروج از حساب
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Page title */}
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-black text-gray-900" style={F}>سفارش‌های من</h1>
              <span className="text-sm text-gray-400" style={F}>{fmt(mockOrders.length)} سفارش</span>
            </div>

            {/* Status tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all shrink-0"
                  style={{
                    ...(activeTab === tab.key
                      ? { background: PURPLE, color: "#fff" }
                      : { background: "#fff", color: "#4b5563", border: "1px solid #e5e7eb" }),
                    ...F,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders list */}
            <div className="flex flex-col gap-3">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                  <ShoppingBag size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm" style={F}>سفارشی در این بخش وجود ندارد</p>
                </div>
              ) : filtered.map(order => {
                const sc = statusConfig(order.status);
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Order header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-gray-800" style={F}>{order.id}</span>
                        <span className="text-xs text-gray-400" style={F}>{order.date}</span>
                      </div>
                      <span
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${sc.color} ${sc.bg}`}
                        style={F}
                      >
                        {sc.icon}
                        {order.status}
                      </span>
                    </div>

                    {/* Order body */}
                    <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-6">
                        <div style={F}>
                          <p className="text-xs text-gray-400 mb-0.5">تعداد اقلام</p>
                          <p className="text-sm font-bold text-gray-800">{fmt(order.items)} عدد</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div style={F}>
                          <p className="text-xs text-gray-400 mb-0.5">مبلغ کل</p>
                          <p className="text-sm font-black" style={{ color: PURPLE }}>{fmt(order.total)} تومان</p>
                        </div>
                        {order.tracking && (
                          <>
                            <div className="w-px h-8 bg-gray-100" />
                            <div style={F}>
                              <p className="text-xs text-gray-400 mb-0.5">کد رهگیری</p>
                              <p className="text-sm font-bold text-gray-800">{order.tracking}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        className="flex items-center gap-1 text-sm font-bold transition-colors"
                        style={{ color: PURPLE, ...F }}
                      >
                        جزئیات سفارش
                        <ChevronLeft size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
