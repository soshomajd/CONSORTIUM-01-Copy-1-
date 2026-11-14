import { useState } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import { Header } from "@/app/components/Header";
import roll2 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { getCart, saveCart, CartItem } from "@/app/store/cart";

const F = { fontFamily: "'Vazirmatn', sans-serif" };

function fmt(n: number) { return n.toLocaleString("fa-IR"); }

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
    <div dir="rtl" className="min-h-screen bg-white" style={F}>
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-gray-400 text-lg mb-4" style={F}>سبد خرید شما خالی است</p>
            <button onClick={() => navigate("/")} className="px-6 py-3 bg-[#3d1a6e] text-white rounded-xl text-sm font-bold hover:bg-[#2d1255] transition-colors" style={F}>
              ادامه خرید
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[560px] sm:min-w-0" style={F}>
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {/* RTL: محصول (right) → قیمت → تعداد → قیمت نهایی (left) */}
                    <th className="pb-3 pr-1 text-right text-xs font-bold text-gray-700 sm:pb-4 sm:pr-2 sm:text-sm">محصول</th>
                    <th className="px-2 pb-3 text-center text-xs font-bold text-gray-700 sm:px-6 sm:pb-4 sm:text-sm">قیمت</th>
                    <th className="px-2 pb-3 text-center text-xs font-bold text-gray-700 sm:px-6 sm:pb-4 sm:text-sm">تعداد</th>
                    <th className="pb-3 pl-1 text-left text-xs font-bold text-gray-700 sm:pb-4 sm:pl-2 sm:text-sm">قیمت نهایی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      {/* محصول */}
                      <td className="py-3 pr-1 sm:py-5 sm:pr-2">
                        <div className="flex items-center gap-2 sm:gap-4">
                          {/* image with X */}
                          <div className="relative shrink-0">
                            <div className="h-14 w-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 sm:h-24 sm:w-24">
                              <ImageWithFallback src={roll2} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <button
                              onClick={() => remove(item.id)}
                              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-white shadow transition-colors hover:bg-gray-800 sm:-right-2 sm:-top-2 sm:h-6 sm:w-6"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          {/* name + code */}
                          <div className="text-right" style={F}>
                            <p className="text-xs font-bold text-gray-900 sm:text-sm">{item.name}</p>
                            <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">کد: {item.code}</p>
                          </div>
                        </div>
                      </td>

                      {/* قیمت */}
                      <td className="px-2 py-3 text-center sm:px-6 sm:py-5">
                        <span className="whitespace-nowrap text-xs font-medium text-gray-700 sm:text-sm" style={F}>
                          {fmt(item.unitPrice)} تومان
                        </span>
                      </td>

                      {/* تعداد */}
                      <td className="px-2 py-3 sm:px-6 sm:py-5">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-sm leading-none text-gray-600 transition-colors hover:bg-gray-100 sm:h-7 sm:w-7 sm:text-base"
                          >
                            −
                          </button>
                          <input
                            type="text"
                            value={fmt(item.qty)}
                            readOnly
                            className="w-8 rounded-lg border border-gray-200 bg-white py-1 text-center text-xs font-bold text-gray-800 outline-none sm:w-10 sm:text-sm"
                            style={F}
                          />
                          <button
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-sm leading-none text-gray-600 transition-colors hover:bg-gray-100 sm:h-7 sm:w-7 sm:text-base"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* قیمت نهایی */}
                      <td className="py-3 pl-1 text-left sm:py-5 sm:pl-2">
                        <span className="whitespace-nowrap text-xs font-bold text-gray-900 sm:text-sm" style={F}>
                          {fmt(item.unitPrice * item.qty)} تومان
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary card — visual LEFT (justify-end in RTL) */}
            <div className="mt-10 flex justify-end">
              <div className="w-full sm:w-80 border border-gray-200 rounded-2xl overflow-hidden" style={F}>
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-700 sm:text-sm">جمع جزء</span>
                  <span className="text-xs text-gray-700 sm:text-sm">{fmt(subtotal)} تومان</span>
                </div>
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-700 sm:text-sm">حمل و نقل</span>
                  <span className="text-xs text-gray-500 sm:text-sm">{fmt(shipping)} تومان</span>
                </div>
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                  <span className="text-xs font-black text-[#4141d9] sm:text-sm">مجموع قیمت سفارش</span>
                  <span className="text-xs font-black text-[#4141d9] sm:text-sm">{fmt(total)} تومان</span>
                </div>
                <div className="px-5 py-4">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-3.5 text-xs font-black text-white transition-colors sm:text-sm"
                    style={{ ...F, backgroundColor: "#370080", borderRadius: 16 }}
                  >
                    نهایی کردن سفارش
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
