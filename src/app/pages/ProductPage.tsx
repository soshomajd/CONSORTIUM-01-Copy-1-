import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { addToCart } from "@/app/store/cart";
import { Heart, Share2, Bookmark, Bell, Truck, ShieldCheck, Headphones, RotateCcw, MessageSquare, CheckCircle, ShoppingCart, Clock3, Star } from "lucide-react";
import roll1 from "@/imports/2030e111-41ab-41d3-9f51-058659c24704.png";
import roll2 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll3 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll4 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll5 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll6 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll7 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ProductReviews } from "@/app/components/ProductReviews";
import { ProductOfferBenefits } from "@/app/components/ProductOfferBenefits";
import { ProductCartControl } from "@/app/components/ProductCartControl";

const F = { fontFamily: "'Vazirmatn', sans-serif" };

function usesDetailedProductLayout(code: string) { return code === "6135" || code === "6130"; }

const collections: Record<string, {
  code: string; name?: string; brand?: string; category?: string; type: string;
  style?: string; design?: string; material: string;
  position: string; color: string; album: string; washable?: string;
  dimensions?: string; outOfStock: boolean; price: number; originalPrice: number; imgs: string[];
}> = {
  "کتان": { code: "212001", type: "ساده", material: "زمینه کتانی", position: "دیوار داخلی", color: "کرم طبیعی", album: "آلبوم کلاسیک", outOfStock: false, price: 999999, originalPrice: 999999, imgs: [roll1, roll2, roll3, roll4, roll5, roll6, roll7] },
  "موج":  { code: "212002", type: "ساده", material: "زمینه مدرن",  position: "دیوار داخلی", color: "آبی کرم",    album: "آلبوم لاکچر",  outOfStock: true,  price: 999999, originalPrice: 999999, imgs: [roll2, roll1, roll3, roll5, roll4, roll6, roll7] },
  "مرمر": { code: "212003", type: "ساده", material: "زمینه سنگ",   position: "دیوار داخلی", color: "سفید خاکستری",album: "آلبوم لوکس",   outOfStock: false, price: 999999, originalPrice: 999999, imgs: [roll3, roll1, roll2, roll4, roll7, roll5, roll6] },
  "هندسی":{ code: "212004", type: "ساده", material: "زمینه گرافیکی",position: "دیوار داخلی", color: "مشکی سفید", album: "آلبوم مدرن",   outOfStock: false, price: 999999, originalPrice: 999999, imgs: [roll4, roll2, roll3, roll5, roll6, roll1, roll7] },
  "خطی":  { code: "212005", type: "ساده", material: "زمینه ساده",  position: "دیوار داخلی", color: "خاکستری روشن",album: "آلبوم مینیمال",outOfStock: false, price: 999999, originalPrice: 999999, imgs: [roll5, roll1, roll3, roll4, roll7, roll2, roll6] },
  "مه":   { code: "212006", type: "ساده", material: "زمینه مدرن",  position: "دیوار داخلی", color: "کرم",         album: "آلبوم ۲",  outOfStock: true,  price: 999999, originalPrice: 999999, imgs: [roll6, roll1, roll2, roll4, roll5, roll3, roll7] },
  "برگ":  { code: "212007", type: "ساده", material: "زمینه طبیعت", position: "دیوار داخلی", color: "سبز کرم",    album: "آلبوم کلاسیک", outOfStock: false, price: 999999, originalPrice: 999999, imgs: [roll7, roll2, roll3, roll5, roll6, roll1, roll4] },
  // Atom album codes 6116–6135
  ...Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => {
      const code = String(6135 - i);
      const url = `https://extreme-walls.com/wp-content/uploads/2025/05/${code}.webp`;
      const extraImgs6135 = [
        "https://extreme-walls.com/wp-content/uploads/2025/05/6135-3.webp",
        "https://extreme-walls.com/wp-content/uploads/2025/05/6135-32.webp",
        "https://extreme-walls.com/wp-content/uploads/2025/05/6135-34-600x600.webp",
        "https://extreme-walls.com/wp-content/uploads/2025/05/6135-33-1.webp",
        "https://extreme-walls.com/wp-content/uploads/2025/05/6135-31.webp",
        "https://extreme-walls.com/wp-content/uploads/2025/05/6135-2.webp",
      ];
      const imgs = usesDetailedProductLayout(code) ? ["https://extreme-walls.com/wp-content/uploads/2025/05/6135.webp", ...extraImgs6135] : [url, roll1, roll2, roll3, roll4, roll5, roll6];
      const isDetailed = usesDetailedProductLayout(code);
      return [code, {
        code,
        name: isDetailed ? "کاغذ دیواری طرح گلدار پنبه" : undefined,
        brand: isDetailed ? "NEXT" : undefined,
        category: isDetailed ? "آلبوم نیچرا۱" : undefined,
        type: isDetailed ? "گل" : "ساده",
        style: isDetailed ? "پست مدرن" : undefined,
        design: isDetailed ? "پتینه" : undefined,
        material: isDetailed ? "PVC" : "کاغذ دیواری",
        position: isDetailed ? "همه فضاها" : "دیوار داخلی",
        color: isDetailed ? "کرم-خاکی" : "متنوع",
        washable: isDetailed ? "دارد" : undefined,
        dimensions: isDetailed ? "۱۰ در ۵۳ سانتیمتر" : undefined,
        album: isDetailed ? "نیچرا۱" : "آلبوم اتم",
        outOfStock: false,
        price: isDetailed ? 1_085_000 : 999999,
        originalPrice: isDetailed ? 1_300_000 : 999999,
        imgs,
      }];
    })
  ),
};

function fmt(n: number) { return n.toLocaleString("fa-IR"); }

export function ProductPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [added, setAdded] = useState(false);

  const [qty, setQty] = useState(1);
  const p = name ? collections[name] : null;
  const [newReviewRatings, setNewReviewRatings] = useState<number[]>([]);
  useEffect(() => { setNewReviewRatings([]); }, [name]);
  const newReviewAverage = newReviewRatings.length ? newReviewRatings.reduce((total, rating) => total + rating, 0) / newReviewRatings.length : 0;

  function handleAddToCart() {
    if (!p || !name) return;
    addToCart({ id: p.code, name: name, code: p.code, unitPrice: p.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const discountPct = p && p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : 0;

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>


      {!p ? (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-500" style={F}>محصول یافت نشد</p>
          <button onClick={() => navigate("/")} className="mt-4 text-[#3d1a6e] underline" style={F}>بازگشت</button>
        </div>
      ) : (
        <div className={`min-w-0 max-w-[1380px] mx-auto py-6 pb-16 ${usesDetailedProductLayout(p.code) ? "w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)]" : "w-full px-4 sm:px-6"}`}>

          {/* ── Main layout: [image+thumbnails] | info ── */}
          <div className={`flex flex-col xl:flex-row xl:justify-between gap-6 items-start ${usesDetailedProductLayout(p.code) ? "xl:gap-[30px]" : ""}`}>

            {/* ══ Image section (right in RTL = first in DOM) ══ */}
            <div className={`w-full min-w-0 flex flex-col ${usesDetailedProductLayout(p.code) ? "mx-auto max-w-[592px] xl:mx-0 xl:w-[592px] xl:flex-none" : "xl:flex-1"}`}>

              {usesDetailedProductLayout(p.code) && (
                <div
                  dir="rtl"
                  className="mb-4 grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[24px] border border-[#CA165C] bg-white px-4 py-3 text-[#CA165C] xl:flex xl:flex-nowrap"
                  style={F}
                >
                  <span className="col-span-3 shrink-0 text-sm font-black xl:col-span-1">
                    پیشنهاد شگفت‌انگیز ویژه
                  </span>

                  <span className="shrink-0 text-xs font-semibold">
                    ۸۵٪ فروش رفته
                  </span>

                  <div
                    className="h-1 min-w-0 flex-1 overflow-hidden rounded-full xl:min-w-[72px]"
                    style={{ backgroundColor: "rgba(202, 22, 92, 0.15)" }}
                  >
                    <div className="mr-0 ml-auto h-full w-[85%] rounded-full bg-[#CA165C]" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="hidden h-6 w-px shrink-0 xl:block"
                    style={{ backgroundColor: "#CA165C" }}
                  />

                  <div dir="ltr" className="flex shrink-0 items-center gap-1.5">
                    <Clock3 size={16} strokeWidth={1.8} />
                    <span className="text-xs font-bold tracking-wider">۰۷ : ۰۳ : ۰۳</span>
                  </div>
                </div>
              )}

              <div className="flex w-full items-start gap-3">

                {/* Thumbnail strip — right side of image area, scrollable */}
                <div
                  className="hidden xl:flex flex-col gap-2 shrink-0 overflow-y-auto"
                  style={{ width: 130, maxHeight: 560 }}
                >
                  {p.imgs.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`نمایش تصویر ${(i + 1).toLocaleString("fa-IR")}`}
                      aria-pressed={selected === i}
                      className="focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#370080]"
                      onClick={() => setSelected(i)}
                      style={{
                        width: 130, height: usesDetailedProductLayout(p.code) ? undefined : 155, aspectRatio: usesDetailedProductLayout(p.code) ? "26 / 31" : undefined, borderRadius: 14, overflow: "hidden", flexShrink: 0,
                        border: selected === i ? "2.5px solid #370080" : "2px solid #e5e7eb",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Main large image */}
                <div className={`w-full min-w-0 xl:w-[450px] xl:shrink-0 ${usesDetailedProductLayout(p.code) ? "mx-auto max-w-[450px] xl:mx-0" : ""}`}>
                  <div className={`${usesDetailedProductLayout(p.code) ? "relative aspect-[45/56] rounded-[28px]" : "h-[420px] sm:h-[500px] xl:h-[560px] rounded-2xl"} overflow-hidden group cursor-zoom-in bg-gray-100`}>
                    <ImageWithFallback
                      src={p.imgs[selected]}
                      alt={name ?? ""}
                      className={`w-full h-full object-cover transition-transform duration-500 motion-reduce:transition-none motion-safe:group-hover:scale-110 ${usesDetailedProductLayout(p.code) ? "absolute inset-0" : ""}`}
                    />
                  </div>
                  {/* Mobile thumbnails */}
                  <div className="xl:hidden flex gap-2 overflow-x-auto pb-2 mt-3">
                    {(usesDetailedProductLayout(p.code) ? p.imgs : p.imgs.slice(0, 5)).map((img, i) => (
                      <button key={i} type="button" aria-label={`نمایش تصویر ${(i + 1).toLocaleString("fa-IR")}`} aria-pressed={selected === i} className="focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#370080]" onClick={() => setSelected(i)} style={{ width: 72, height: usesDetailedProductLayout(p.code) ? undefined : 84, aspectRatio: usesDetailedProductLayout(p.code) ? "26 / 31" : undefined, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: selected === i ? "2px solid #370080" : "2px solid #e5e7eb" }}>
                        <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ══ LEFTMOST: info panel (last in RTL DOM) ══ */}
            <div
              className={`w-full flex flex-col min-w-0 text-right ${usesDetailedProductLayout(p.code) ? "xl:relative xl:self-stretch xl:flex-1" : "xl:w-[300px] xl:shrink-0"}`}
              dir="rtl"
              style={usesDetailedProductLayout(p.code) ? F : undefined}
            >

              {/* Action icons row — left-aligned (justify-end in RTL) */}
              {!usesDetailedProductLayout(p.code) && <div className="flex items-center gap-4 mb-5 justify-end">
                <Heart size={20} className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
                <Share2 size={20} className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" />
                <Bookmark size={20} className="text-gray-400 cursor-pointer hover:text-[#370080] transition-colors" />
                <Bell size={20} className="text-gray-400 cursor-pointer hover:text-[#370080] transition-colors" />
              </div>}

              {/* Product name / code heading */}
              <div className={`flex w-full items-end justify-between gap-3 pb-3 mb-4 border-b border-gray-200 ${usesDetailedProductLayout(p.code) ? "xl:min-h-[66px]" : ""}`}>
                <h1 className="min-w-0 text-base font-black text-gray-900 text-right leading-7" style={F}>
                  {p.name ? p.name : `کد ${p.code}`}
                </h1>
                {usesDetailedProductLayout(p.code) && <div className="flex shrink-0 flex-col items-end gap-1">
                  <div className="flex items-center gap-0 text-black">
                  <button type="button" aria-label="افزودن به علاقه‌مندی‌ها" className="flex size-8 items-center justify-center rounded-lg hover:text-[#CA165C] focus-visible:outline-2 focus-visible:outline-[#CA165C]"><Heart size={20} /></button>
                  <button type="button" aria-label="ذخیره محصول" className="flex size-8 items-center justify-center rounded-lg hover:text-[#CA165C] focus-visible:outline-2 focus-visible:outline-[#CA165C]"><Bookmark size={20} /></button>
                  <button type="button" aria-label="اطلاع‌رسانی محصول" className="flex size-8 items-center justify-center rounded-lg hover:text-[#CA165C] focus-visible:outline-2 focus-visible:outline-[#CA165C]"><Bell size={20} /></button>
                  </div>
                </div>}
              </div>
              {usesDetailedProductLayout(p.code) && (p.code !== "6130" || newReviewRatings.length > 0) && (
                  <div className="mb-3 flex self-end items-center gap-2 whitespace-nowrap text-base font-semibold text-gray-800" style={F}>
                    {p.code === "6130" ? <>
                      <span>{fmt(newReviewRatings.length)} نظر</span>
                      <span aria-hidden="true">|</span>
                      {newReviewRatings.length ? <span className="inline-flex items-center gap-1"><Star size={13} fill="#FACC15" stroke="#FACC15" aria-hidden="true" />{newReviewAverage.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}</span> : <span className="text-sm font-normal text-[#6A7282]">هنوز امتیازی ثبت نشده</span>}
                    </> : <>
                    <span>۱ نظر</span>
                    <span aria-hidden="true">|</span>
                    <span className="inline-flex items-center gap-1"><Star size={13} fill="#FACC15" stroke="#FACC15" aria-hidden="true" />۴</span>
                    <span>(۱ خریدار)</span>
                    </>}
                  </div>
              )}

              {/* Specs + status */}
              <div className={`flex flex-col gap-2 mb-5 ${usesDetailedProductLayout(p.code) ? "pr-3 sm:pr-0 xl:mb-2.5 xl:ml-auto xl:w-[calc(100%-424px)] xl:min-w-[180px]" : ""}`} style={F}>
                {([
                  { label: "برند",            value: p.brand ?? "کنسرسیوم" },
                  ...(p.category ? [{ label: "دسته بندی", value: p.category }] : []),
                  { label: "نوع",             value: p.type },
                  ...(p.style    ? [{ label: "سبک",         value: p.style }]    : []),
                  { label: "موقعیت",          value: p.position },
                  ...(p.design   ? [{ label: "طرح",         value: p.design }]   : []),
                  { label: "رنگ",             value: p.color },
                  { label: "آلبوم",           value: p.album },
                  ...(p.washable && !usesDetailedProductLayout(p.code) ? [{ label: "قابلیت شستشو", value: p.washable }] : []),
                  ...(p.dimensions && !usesDetailedProductLayout(p.code) ? [{ label: "ابعاد هر رول", value: p.dimensions }] : []),
                ] as { label: string; value: string }[]).map(({ label, value }) => (
                  <div
                    key={label}
                    dir="rtl"
                    className={`flex items-center gap-2 ${usesDetailedProductLayout(p.code) ? "text-base w-full justify-start text-right" : "text-sm justify-end"}`}
                  >
                    {usesDetailedProductLayout(p.code) ? (
                      <>
                        <span className="text-sm text-gray-500 sm:text-base">{label}:</span>
                        <span className="text-gray-800 font-semibold">{value}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-800 font-semibold">{value}</span>
                        <span className="text-gray-500">{label} :</span>
                      </>
                    )}
                  </div>
                ))}
                {/* Status row */}
                {usesDetailedProductLayout(p.code) && <div className="mt-2 self-end text-left sm:self-auto sm:text-right xl:pt-2 xl:pr-2"><ProductOfferBenefits compactMobile /></div>}
                {!usesDetailedProductLayout(p.code) && (
                  <div dir="rtl" className="flex items-center justify-end gap-2 text-sm">
                    <span style={{ color: p.outOfStock ? "#CA165C" : "#16a34a", fontWeight: 600 }}>
                      {p.outOfStock ? "عدم موجودی" : "موجود"}
                    </span>
                    <span className="text-gray-500">وضعیت :</span>
                  </div>
                )}
              </div>

              {/* Purchase card */}
              <div
              className={`w-full border border-gray-200 p-5 bg-white ${
                usesDetailedProductLayout(p.code)
                  ? "rounded-[28px] xl:absolute xl:bottom-0 xl:left-0 xl:max-w-[400px]"
                  : "rounded-2xl"
              }`}

              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              >

                {/* Original price row + discount badge */}
                <div className={`flex items-center justify-end gap-3 mb-1 ${usesDetailedProductLayout(p.code) ? "w-fit ml-auto" : ""}`}>
                  {discountPct > 0 && (
                    <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: usesDetailedProductLayout(p.code) ? "#CA165C" : "#22c55e" }}>
                      {discountPct}% تخفیف
                    </span>
                  )}
                  <span className="text-sm text-gray-400 line-through" style={F}>
                    {fmt(p.originalPrice)} تومان
                  </span>
                </div>

                {/* Final price */}
                <div className={`flex items-baseline justify-end gap-2 mb-3 ${usesDetailedProductLayout(p.code) ? "w-fit ml-auto" : ""}`}>
                  <span className={`text-sm ${usesDetailedProductLayout(p.code) ? "text-black" : "text-gray-500"}`} style={F}>تومان</span>
                  <span className={`text-4xl font-black ${usesDetailedProductLayout(p.code) ? "text-black" : "text-gray-900"}`} style={F}>{fmt(p.price)}</span>
                </div>

                {/* Stock status */}
                <div className="flex items-center justify-end gap-1.5 mb-4">
                  {p.outOfStock ? (
                    <span className="text-sm font-semibold text-red-500" style={F}>ناموجود</span>
                  ) : (
                    <>
                      <span className={`text-sm font-semibold ${usesDetailedProductLayout(p.code) ? "text-[#370080]" : "text-emerald-600"}`} style={F}>موجود در انبار</span>
                      <CheckCircle size={15} className={usesDetailedProductLayout(p.code) ? "text-[#370080]" : "text-emerald-500"} />
                    </>
                  )}
                </div>

                {/* Quantity selector */}
                {!p.outOfStock && !usesDetailedProductLayout(p.code) && (
                  <div className="flex items-center justify-end gap-3 mb-4">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty(q => q + 1)}
                        className={`w-10 h-10 text-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center ${usesDetailedProductLayout(p.code) ? "text-[#D1D5DC]" : "text-gray-600"}`}
                        style={F}
                      >+</button>
                      <span className="w-10 text-center text-sm font-bold text-gray-800" style={F}>{qty}</span>
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className={`w-10 h-10 text-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center ${usesDetailedProductLayout(p.code) ? "text-[#D1D5DC]" : "text-gray-600"}`}
                        style={F}
                      >−</button>
                    </div>
                    <span className="text-sm text-gray-600" style={F}>:تعداد</span>
                  </div>
                )}

                {/* Add to cart button */}
                {usesDetailedProductLayout(p.code) ? <ProductCartControl item={{ id: p.code, name: p.name ?? name ?? p.code, code: p.code, unitPrice: p.price, img: p.imgs[0] }} /> : <button
                  disabled={p.outOfStock || added}
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    ...F,
                    backgroundColor: p.outOfStock ? "#d1d5db" : added ? (usesDetailedProductLayout(p.code) ? "#4141D9" : "#16a34a") : "#370080",
                    cursor: p.outOfStock ? "not-allowed" : "pointer",
                  }}
                >
                  <ShoppingCart size={18} />
                  {p.outOfStock ? "اتمام موجودی" : added ? "افزوده شد ✓" : "افزودن به سبد خرید"}
                </button>}

                {/* Share button */}
                {!usesDetailedProductLayout(p.code) && <button
                  className={`w-full py-3 rounded-2xl border border-solid border-gray-300 font-medium text-sm flex items-center justify-center gap-2 mt-2.5 hover:bg-gray-50 transition-colors ${usesDetailedProductLayout(p.code) ? "text-[#D1D5DC]" : "text-gray-600"}`}
                  style={F}
                >
                  <Share2 size={15} className={usesDetailedProductLayout(p.code) ? "text-[#D1D5DC]" : undefined} />
                  اشتراک گذاری
                </button>}
              </div>

            </div>
          </div>
          {/* ── Below product: guarantees + tabs + description ── */}
          <ProductMeta key={p.code} name={name ?? ""} code={p.code} album={p.album} color={p.color} onReviewAdded={p.code === "6130" ? rating => setNewReviewRatings(previous => [...previous, rating]) : undefined} />
        </div>
      )}
    </div>
  );
}

function ProductMeta({ name, code, album, color, onReviewAdded }: { name: string; code: string; album: string; color: string; onReviewAdded?: (rating: number) => void }) {
  const [activeTab, setActiveTab] = useState<"review" | "comments">("review");
  const F = { fontFamily: "'Vazirmatn', sans-serif" };

  const guarantees = [
    { icon: <RotateCcw size={36} strokeWidth={1.4} />, label: "ضمانت بازگشت کالا" },
    { icon: <Headphones size={36} strokeWidth={1.4} />, label: "پشتیبانی خرید" },
    { icon: <ShieldCheck size={36} strokeWidth={1.4} />, label: "ضمانت اصالت کالا" },
    { icon: <Truck size={36} strokeWidth={1.4} />,      label: "تحویل سریع و آسان" },
  ];

  return (
    <div className="mt-12" style={F}>
            {/* 4 guarantee icons */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 ${usesDetailedProductLayout(code) ? "relative -top-7 rounded-[28px] border border-gray-200 bg-white px-5 pt-6 pb-7 text-[#6A7282]" : "pt-12 pb-8 border-t border-b border-gray-200"}`} style={usesDetailedProductLayout(code) ? { boxShadow: "0 2px 16px rgba(0,0,0,0.06)" } : undefined}>

        {guarantees.map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-3 text-center">
            <div className={usesDetailedProductLayout(code) ? "text-inherit [&>svg]:size-6 sm:[&>svg]:size-9" : "text-gray-700"}>{icon}</div>
            <span className={usesDetailedProductLayout(code) ? "text-sm font-normal text-gray-500 sm:text-base" : "text-sm font-medium text-gray-700"} style={F}>{label}</span>
          </div>
        ))}
      </div>

      {usesDetailedProductLayout(code) ? (
        <ProductReviews key={code} startEmpty={code === "6130"} onReviewAdded={onReviewAdded} productName={collections[name]?.name ?? `کاغذ دیواری ${code}`} code={code} album={album} color={color} />
      ) : (
      <>
      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mt-8 mb-8">
        {[
          { key: "review",   label: "بررسی محصول" },
          { key: "comments", label: "نظرات کاربران" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as "review" | "comments")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === key
                ? "border-[#3d1a6e] text-[#3d1a6e]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            style={F}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "review" ? (
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-5" style={F}>کاغذ دیواری</h2>
          <p className="text-sm leading-8 text-gray-700 text-center" style={{ ...F, lineHeight: "2.2" }}>
            کاغذ دیواری ساده درجه یک قابل شستشو، آلبوم {album}، رول پنج متر مربع، سیزده کد رنگی (گروه ۳) &ndash; {code} &ndash; ({color})
          </p>
        </div>
      ) : (
        <div className="flex gap-8 items-start">
          {/* Right: comment list area (first in RTL DOM = visual right) */}
          <div className="flex-1">
            <p className="text-sm text-gray-400 py-4" style={F}>هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
          </div>

          {/* Left: submit comment card (second in RTL DOM = visual left) */}
          <div className="shrink-0 w-[280px] rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-gray-100 px-5 py-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-gray-600 shrink-0" />
              <span className="text-sm text-gray-700 font-medium" style={F}>نظر برای ما ارزشمنده!</span>
            </div>
            <div className="p-3 bg-white">
              <button className="w-full bg-black hover:bg-gray-900 text-white text-sm font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2" style={F}>
                <span>ثبت نظر</span>
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>
        </div>
      )}

      </>
      )}

    </div>
  );
}
