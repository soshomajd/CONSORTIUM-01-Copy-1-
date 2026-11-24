import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { X, Plus, Minus, Store } from "lucide-react";
import roll2 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { getCart, saveCart, CartItem } from "@/app/store/cart";
import { toPersianDigits } from "@/app/lib/persian-digits";
import "./CartPage.css";

const F = { fontFamily: "'Vazirmatn', sans-serif" };

function fmt(n: number) { return n.toLocaleString("fa-IR"); }

function originalCartPrice(item: CartItem) {
  return (item as CartItem & { originalPrice?: number }).originalPrice ?? item.unitPrice;
}

function cartProductDetails(item: CartItem) {
  if (item.code === "13120-A" || item.name.includes("کاغذ دیواری طرح هندسی مدرن")) {
    return { name: "تکسچر ری استایبل ۵۰۳۰۲۱", subtitle: "آلبوم تکسچر(۱)" };
  }
  if (item.code === "13120-B" || item.name.includes("کاغذ دیواری طرح مارموریت")) {
    return { name: "تکسچر ۵۰۳۰۲۰", subtitle: "آلبوم تکسچر(۱)" };
  }
  return { name: toPersianDigits(item.name), subtitle: `کد: ${toPersianDigits(item.code)}` };
}

export function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(() => getCart());

  const persist = (next: CartItem[]) => { setItems(next); saveCart(next); };

  const setQty = (id: string, val: number) => {
    if (val < 1) return;
    persist(items.map(i => i.id === id ? { ...i, qty: val } : i));
  };

  const remove = (id: string) => persist(items.filter(i => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div dir="rtl" className="min-w-0 bg-white" style={F}>


      <div className="mx-auto w-[calc(100%-2rem)] max-w-[1380px] pt-8 pb-6 sm:w-[calc(100%-3rem)]">
        <header className="mb-6">
          <div className="flex items-center justify-start gap-3">
            <Store size={32} strokeWidth={1.6} style={{ color: "#370080", opacity: 0.85 }} aria-hidden="true" />
            <h1 className="text-2xl font-black text-gray-900">سبد خرید</h1>
          </div>
          <nav aria-label="مسیر صفحه" className="mt-2">
            <ol className="flex items-center justify-start gap-1.5 text-xs text-gray-400">
              <li><Link to="/" className="rounded-sm hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-[#370080]">خانه</Link></li>
              <li aria-hidden="true" className="select-none text-base text-gray-300">|</li>
              <li aria-current="page">سبد خرید</li>
            </ol>
          </nav>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="mb-4 text-[15px] font-normal text-[#6A7282] sm:text-lg sm:text-gray-400" style={F}>سبد خرید شما خالی است</p>
            <button onClick={() => navigate("/")} className="px-6 py-3 bg-[#CA165C] sm:bg-[#3d1a6e] text-white rounded-xl text-sm font-bold hover:bg-[#CA165C]/90 sm:hover:bg-[#2d1255] transition-colors" style={F}>
              ادامه خرید
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="cart-table w-full min-w-[1120px] xl:min-w-0" style={F}>
                <colgroup><col className="w-[36%]" /><col className="w-[16%]" /><col className="w-[16%]" /><col className="w-[16%]" /><col className="w-[16%]" /></colgroup>
                <thead>
                  <tr>
                    {/* RTL: محصول → قیمت → قیمت بعد از تخفیف → تعداد → قیمت نهایی */}
                    <th className="pb-3 pr-1 text-right text-sm font-light text-[#6A7282] sm:pb-4 sm:pr-2">محصول</th>
                    <th className="px-2 pb-3 text-center text-sm font-light text-[#6A7282] sm:px-6 sm:pb-4">قیمت</th>
                    <th className="px-2 pb-3 text-center text-sm font-light text-[#6A7282] sm:px-6 sm:pb-4">قیمت بعد از تخفیف</th>
                    <th className="px-2 pb-3 text-center text-sm font-light text-[#6A7282] sm:px-6 sm:pb-4">تعداد</th>
                    <th className="pb-3 pl-1 text-left text-sm font-light text-[#6A7282] sm:pb-4 sm:pl-2">قیمت نهایی</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="cart-table-gap" aria-hidden="true"><td colSpan={5} /></tr>
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      {/* محصول */}
                      <td className="py-3 pr-1 sm:pr-2">
                        <div className="flex items-center gap-2 sm:gap-4">
                          {/* image with X */}
                          <div className="relative shrink-0">
                            <div className="h-24 w-28 overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 sm:h-[120px] sm:w-[140px]">
                              <ImageWithFallback src={item.img ?? roll2} alt={cartProductDetails(item).name} className="w-full h-full object-cover" />
                            </div>
                            <button
                              type="button"
                              aria-label={`حذف ${cartProductDetails(item).name}`}
                              onClick={() => remove(item.id)}
                              className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#CA165C] text-white shadow transition-colors hover:bg-[#D5457D]"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          {/* name + code */}
                          <div className="min-w-0 flex-1 break-words text-right" style={F}>
                            <p className="text-[15px] font-semibold text-[#1E2939]">{cartProductDetails(item).name}</p>
                            <p className="mt-0.5 text-[15px] font-normal text-[#6A7282]">{cartProductDetails(item).subtitle}</p>
                          </div>
                        </div>
                      </td>

                      {/* قیمت */}
                      <td className="px-2 py-3 text-center sm:px-6">
                        <span className="whitespace-nowrap text-sm font-medium text-[#1E2939]" style={F}>{fmt(originalCartPrice(item))} تومان</span>
                      </td>

                      {/* قیمت بعد از تخفیف */}
                      <td className="px-2 py-3 text-center sm:px-6">
                        <span className="whitespace-nowrap text-sm font-medium text-[#1E2939]" style={F}>{fmt(item.unitPrice)} تومان</span>
                      </td>

                      {/* تعداد */}
                      <td className="px-2 py-3 sm:px-6">
                        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                          <button type="button" aria-label={`افزایش تعداد ${cartProductDetails(item).name}`} onClick={() => setQty(item.id, item.qty + 1)} className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#6A7282] transition-colors hover:border-[#370080] hover:bg-[#370080] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#370080] sm:size-8"><Plus size={16} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" /></button>
                          <span aria-live="polite" aria-atomic="true" className="min-w-3.5 text-center text-xs font-normal tabular-nums text-[#6A7282] sm:min-w-5 sm:text-sm sm:font-light">{fmt(item.qty)}</span>
                          <button type="button" aria-label={`کاهش تعداد ${cartProductDetails(item).name}`} disabled={item.qty <= 1} onClick={() => setQty(item.id, item.qty - 1)} className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#6A7282] transition-colors hover:border-[#370080] hover:bg-[#370080] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-[#6A7282] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#370080] sm:size-8"><Minus size={16} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" /></button>
                        </div>
                      </td>

                      {/* قیمت نهایی */}
                      <td className="py-3 pl-1 text-left sm:pl-2">
                        <span className="whitespace-nowrap text-sm font-medium text-[#1E2939]" style={F}>
                          {fmt(item.unitPrice * item.qty)} تومان
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary card — visual LEFT (justify-end in RTL) */}
            <div className="mt-6 flex justify-end">
              <div className="w-full overflow-hidden rounded-[28px] border border-gray-200 bg-white sm:w-[400px]" style={{ ...F, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                  <span className="text-sm font-normal text-[#6A7282]">جمع جزء</span>
                  <span className="text-sm font-medium text-[#1E2939]">{fmt(subtotal)} تومان</span>
                </div>
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                  <span className="text-sm font-normal text-[#6A7282]">حمل و نقل</span>
                  <span className="text-sm font-medium text-[#1E2939]">{fmt(shipping)} تومان</span>
                </div>
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                  <span className="text-sm font-semibold text-[#1E2939]">مجموع قیمت سفارش</span>
                  <span className="text-sm font-medium text-[#1E2939]">{fmt(total)} تومان</span>
                </div>
                <div className="px-5 py-4">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-3.5 text-sm font-semibold text-white transition-colors"
                    style={{ ...F, backgroundColor: "#370080", borderRadius: 16 }}
                  >
                    ادامه خرید
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
