import { toPersianDigits } from "@/app/lib/persian-digits";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { FestivalProductCard } from "@/app/components/FestivalProductCard";
import productImg  from "@/imports/202067-after.jpg";

const BLACK = "#000000";
const PINK   = "#CA165C";
const F      = { fontFamily: "'Vazirmatn', sans-serif" };

// ─── Scalloped Badge SVG ─────────────────────────────────────────────────────
// Matches reference: large center circle + small circles around perimeter (union)
function ScallopedBadge() {
  const N = 20;          // number of bumps
  const CX = 120, CY = 120;
  const bodyR = 76;      // main filled circle
  const bumpD = 82;      // bump centers distance from origin
  const bumpR = 16;      // bump circle radius

  const bumps = Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + bumpD * Math.cos(angle), y: CY + bumpD * Math.sin(angle) };
  });

  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bumps first (behind body for clean overlap) */}
      {bumps.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={bumpR} fill={PINK} />
      ))}
      {/* Main body circle on top */}
      <circle cx={CX} cy={CY} r={bodyR} fill={PINK} />
      {/* Inner ring */}
      <circle cx={CX} cy={CY} r={bodyR - 4} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
    </svg>
  );
}

// ─── Hanging Tag ─────────────────────────────────────────────────────────────
function HangingTag() {
  return (
    <>
      <style>{`
        @keyframes pendulum {
          0%   { transform: rotate(-5deg); }
          50%  { transform: rotate(5deg); }
          100% { transform: rotate(-5deg); }
        }
        .tag-swing {
          transform-origin: top center;
          animation: pendulum 2.8s ease-in-out infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>

      {/* Fixed pin at top */}
      <div style={{ width: 2, height: 32, backgroundColor: "#aaa", borderRadius: 9999 }} />

      {/* Swinging part */}
      <div className="tag-swing">
        {/* Thread from hole to badge */}
        <div style={{ width: 1.5, height: 20, backgroundColor: "#bbb", borderRadius: 9999, marginBottom: -2 }} />
        {/* Hole */}
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          backgroundColor: "#fff",
          border: "1.5px solid #bbb",
          marginBottom: -6,
          zIndex: 2,
          position: "relative",
        }} />

        {/* Badge */}
        <div style={{ position: "relative", width: 240, height: 240 }}>
          <ScallopedBadge />
          {/* Text overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "0 32px",
            textAlign: "center",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: F.fontFamily,
            }}>SPECIAL OFFER</span>
            <span style={{
              fontSize: 22, fontWeight: 900,
              color: "#fff",
              lineHeight: 1.35,
              ...F,
            }}>کاغذ های<br />تخفیف دار</span>
            <span style={{
              display: "inline-block",
              marginTop: 2,
              padding: "3px 12px",
              borderRadius: 9999,
              backgroundColor: "#fff",
              fontSize: 11, fontWeight: 800,
              color: PINK,
              ...F,
            }}>تا ۴۰٪ تخفیف</span>
          </div>
        </div>

        {/* Shadow under badge */}
        <div style={{
          width: 140, height: 18,
          borderRadius: "50%",
          backgroundColor: "rgba(120,120,120,0.28)",
          filter: "blur(10px)",
          marginTop: 4,
        }} />
      </div>
    </>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{ padding: "8px 24px 24px", display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }} dir="rtl">
      <div style={{ maxWidth: 1380, width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
        <HangingTag />
      </div>
    </section>
  );
}

// ─── Banner Section ───────────────────────────────────────────────────────────
function BannerSection() {
  return (
    <section style={{ padding: "0 0 32px", marginTop: -180, display: "flex", justifyContent: "center" }} dir="rtl">
      <div style={{ maxWidth: 1380, width: "100%", padding: "0 24px" }}>
        <div style={{
          position: "relative",
          backgroundColor: PINK,
          borderRadius: 18,
          overflow: "hidden",
          padding: "28px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 88,
        }}>
          {/* Background % pattern */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {[36, 20, 36, 20, 36].map((size, row) => (
              <div key={row} style={{ display: "flex", whiteSpace: "nowrap", lineHeight: 1, overflow: "hidden" }}>
                {Array.from({ length: 60 }).map((_, i) => (
                  <span key={i} style={{ fontSize: size, fontWeight: 900, color: "rgba(255,255,255,0.06)", letterSpacing: "0.15em", userSelect: "none", fontFamily: F.fontFamily }}>%</span>
                ))}
              </div>
            ))}
          </div>
          {/* Main text */}
          <h2 style={{ position: "relative", zIndex: 1, margin: 0, fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "0.01em", textAlign: "center", ...F }}>
            همه‌ی تخفیفامون اینجاست...!
          </h2>
        </div>
      </div>
    </section>
  );
}

function toPersianNum(n: number) {
  return n.toString().replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

// ─── Festival Carousel data ───────────────────────────────────────────────────
const FESTIVAL_ITEMS = [
  { name: "کاغذ دیواری پریمیوم مدل اوک روشن", code: "WP-2201", basePrice: 3_800_000, discount: 40 },
  { name: "کاغذ دیواری وینیل مدل موج بژ",     code: "WP-1809", basePrice: 2_900_000, discount: 30 },
  { name: "کاغذ دیواری بافت‌دار مدل ابری",    code: "WP-3310", basePrice: 4_200_000, discount: 35 },
  { name: "کاغذ دیواری ساده مدل برف سفید",    code: "WP-0512", basePrice: 2_100_000, discount: 25 },
  { name: "کاغذ دیواری طرح‌دار مدل کِرِم وود", code: "WP-4401", basePrice: 3_500_000, discount: 40 },
  { name: "کاغذ دیواری لاکچری مدل مرمر روشن", code: "WP-5503", basePrice: 5_600_000, discount: 20 },
  { name: "کاغذ دیواری کلاسیک مدل پارچه‌ای",  code: "WP-6614", basePrice: 3_100_000, discount: 30 },
  { name: "کاغذ دیواری مدرن مدل خط‌خطی ظریف", code: "WP-7720", basePrice: 2_700_000, discount: 35 },
];

// ─── Amazing Offers Carousel ──────────────────────────────────────────────────
const AMAZING_ITEMS = [
  { name: "تکسچر(1) 202011",                                               code: "202011",  basePrice: 3_090_909, discount: 45, rating: 4.2, sold: 68 },
  { name: "کاغذ دیواری پریمیوم مدل اوک روشن، مناسب اتاق خواب و پذیرایی",  code: "WP-2201", basePrice: 3_800_000, discount: 40, rating: 4.7, sold: 72 },
  { name: "کاغذ دیواری وینیل مدل موج بژ، ضدآب و مقاوم در برابر رطوبت",    code: "WP-1809", basePrice: 2_900_000, discount: 30, rating: 4.5, sold: 58 },
  { name: "کاغذ دیواری بافت‌دار مدل ابری، ایده‌آل برای فضاهای مدرن",      code: "WP-3310", basePrice: 4_200_000, discount: 35, rating: 4.8, sold: 85 },
  { name: "کاغذ دیواری ساده مدل برف سفید، انتخاب اول دکوراسیون مینیمال",  code: "WP-0512", basePrice: 2_100_000, discount: 25, rating: 4.3, sold: 44 },
  { name: "کاغذ دیواری طرح‌دار مدل کِرِم وود، جنس اصل اروپایی",           code: "WP-4401", basePrice: 3_500_000, discount: 40, rating: 4.6, sold: 91 },
  { name: "کاغذ دیواری لاکچری مدل مرمر روشن، مخصوص فضاهای لوکس",         code: "WP-5503", basePrice: 5_600_000, discount: 20, rating: 4.9, sold: 63 },
];

function AmazingOffersCarousel() {
  const [secs, setSecs] = useState(5 * 3600 + 14 * 60 + 22);
  const [idx, setIdx]   = useState(0);
  const scrollRef       = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState(() =>
    window.matchMedia('(min-width: 1024px)').matches ? 2 : 1
  );
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      const visible = media.matches ? 2 : 1;
      setVisibleCards(visible);
      setIdx(current => Math.min(current, Math.max(0, AMAZING_ITEMS.length - visible)));
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const hh  = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm2 = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss3 = String(secs % 60).padStart(2, "0");

  const maxIdx = Math.max(0, AMAZING_ITEMS.length - visibleCards);

  function prev() { setIdx(i => Math.max(0, i - 1)); }
  function next() { setIdx(i => Math.min(maxIdx, i + 1)); }

  const fmt = (n: number) => n.toLocaleString("fa-IR");

  return (
    <section className="special-offers-carousel" style={{ padding: "0 24px 32px", display: "flex", justifyContent: "center" }} dir="rtl">
      <style>{`
        .special-offers-carousel { --offer-card-width: calc(50% - 8px); }
        .special-offer-card { padding: 28px; gap: 24px; }
        @media (max-width: 1023px) {
          .special-offers-carousel { --offer-card-width: 100%; }
        }
        @media (max-width: 639px) {
          .special-offer-card { padding: 16px; gap: 16px; }
        }
      `}</style>
      <div style={{ maxWidth: 1380, width: "100%" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10, padding: "14px 24px",
          backgroundColor: PINK, borderRadius: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#fff", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#fff", ...F }}>پیشنهاد شگفت‌انگیز ویژه</p>
          </div>
          {/* Timer */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, direction: "ltr" }}>
            {[hh, mm2, ss3].map((u, i) => (
              <React.Fragment key={i}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums", minWidth: 26, textAlign: "center", ...F }}>{toPersianDigits(u)}</span>
                {i < 2 && <span style={{ fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.6)" }}>:</span>}
              </React.Fragment>
            ))}
          </div>
          {/* Nav arrows */}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={prev} disabled={idx === 0}
              style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", border: "none", cursor: idx === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", opacity: idx === 0 ? 0.4 : 1 }}>
              <ChevronRight size={15} color="#fff" />
            </button>
            <button onClick={next} disabled={idx === maxIdx}
              style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", border: "none", cursor: idx === maxIdx ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", opacity: idx === maxIdx ? 0.4 : 1 }}>
              <ChevronLeft size={15} color="#fff" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div style={{ overflow: "hidden", backgroundColor: PINK, borderRadius: 20, padding: 20 }}>
          <div
            ref={scrollRef}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${AMAZING_ITEMS.length}, var(--offer-card-width))`,
              gap: 16,
              transform: `translateX(calc(${idx} * (var(--offer-card-width) + 16px)))`,
              transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              direction: "rtl",
            }}
          >
            {AMAZING_ITEMS.map((item) => {
              const afterPrice = Math.round(item.basePrice * (1 - item.discount / 100));
              return (
                <Link to="/product/6135" key={item.code} className="special-offer-card" style={{
                  border: `1px solid #e5e7eb`,
                  borderRadius: 14,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) clamp(88px, 14vw, 160px)",
                  alignItems: "center",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s",
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)"; }}
                >
                  {/* Content (right side in RTL = first in DOM) */}
                  <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "stretch", gap: 10, textAlign: "right" }}>
                    {/* Badge */}
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#CA165C", padding: 0, alignSelf: "flex-start", ...F }}>پیشنهاد شگفت‌انگیز ویژه</span>
                    {/* Title */}
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#111827", lineHeight: 1.6, ...F }}>{toPersianDigits(item.name)}</p>
                    {/* Rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", ...F }}>★ {toPersianDigits(item.rating)}</span>
                    </div>
                    {/* Prices */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <span style={{ fontSize: 13, color: "#9ca3af", textDecoration: "line-through", textAlign: "left", display: "block", ...F }}>{fmt(item.basePrice)} تومان</span>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", backgroundColor: "rgba(202, 22, 92, 0.85)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...F }}>{toPersianDigits(item.discount)}٪</span>
                        <span style={{ fontSize: 14, fontWeight: 900, color: "#9ca3af", ...F }}>{fmt(afterPrice)} تومان</span>
                      </div>
                    </div>
                    {/* Progress */}
                    <div style={{ marginTop: 4, width: "100%" }}>
                      <div style={{ height: 4, backgroundColor: "#e5e7eb", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${item.sold}%`, backgroundColor: BLACK, borderRadius: 9999, transition: "width 0.6s ease" }} />
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: BLACK, ...F }}>{toPersianNum(item.sold)}٪ فروش رفته</p>
                    </div>
                    {/* Timer */}
                    <div style={{ display: "flex", alignItems: "center", gap: 3, direction: "ltr", justifyContent: "flex-start", alignSelf: "flex-start" }}>
                      {[hh, mm2, ss3].map((u, i) => (
                        <React.Fragment key={i}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: PINK, fontVariantNumeric: "tabular-nums", ...F }}>{toPersianDigits(u)}</span>
                          {i < 2 && <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>:</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  {/* Product image (left in RTL = last in DOM) */}
                  <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 14, backgroundColor: "#fafafa", overflow: "hidden", position: "relative", alignSelf: "center" }}>
                    <img src={productImg} alt={item.code} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 9999, border: "none", cursor: "pointer", backgroundColor: i === idx ? BLACK : "#d1d5db", transition: "all 0.3s", padding: 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Festival2 Section ────────────────────────────────────────────────────────
function Festival2Section() {
  const BLUE = PINK;
  const trackRef = useRef<HTMLDivElement>(null);
  const CARD_W = 200;

  // Countdown: start from 19h 04m 58s
  const [secs, setSecs] = useState(19 * 3600 + 4 * 60 + 58);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  function scroll(dir: "right" | "left") {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === "left" ? -CARD_W * 2 : CARD_W * 2, behavior: "smooth" });
  }

  return (
    <section style={{ padding: "32px 0 48px", display: "flex", justifyContent: "center" }} dir="rtl">
      <div style={{ maxWidth: 1380, width: "100%", padding: "0 24px" }}>
        {/* Section title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: PINK, flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: PINK, ...F }}>پیشنهادات شگفت انگیز</p>
        </div>

        {/* Carousel container */}
        <div style={{ backgroundColor: BLUE, borderRadius: 20, display: "flex", alignItems: "stretch", overflow: "hidden" }}>

          {/* ── Right panel: title + timer + CTA ── */}
          <div style={{ flexShrink: 0, width: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "28px 28px", borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
            {/* Title stacked */}
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.45, ...F }}>پیشنهاد</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.45, ...F }}>شگفت‌انگیز</p>
            </div>

            {/* % icon */}
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 400, color: "#fff", ...F }}>٪</span>
            </div>

            {/* Countdown */}
            <div style={{ display: "flex", gap: 4, alignItems: "center", direction: "ltr" }}>
              {[hh, mm, ss].map((unit, i) => (
                <React.Fragment key={i}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 6, padding: "4px 7px", minWidth: 28, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums", ...F }}>{toPersianDigits(unit)}</span>
                    </div>
                  </div>
                  {i < 2 && <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>:</span>}
                </React.Fragment>
              ))}
            </div>

            {/* See all */}
            <Link to="/discounted-products" style={{ marginTop: 4, display: "inline-block", backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 400, color: "#fff", whiteSpace: "nowrap", transition: "background-color 0.2s", textDecoration: "none", ...F }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.28)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.15)"}
            >
              مشاهده همه
            </Link>
          </div>

          {/* ── Scrollable track + arrows ── */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {/* Arrow right */}
            <button
              onClick={() => scroll("right")}
              style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.32)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)"}
            >
              <ChevronRight size={16} color="#fff" />
            </button>

            {/* Arrow left */}
            <button
              onClick={() => scroll("left")}
              style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.32)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)"}
            >
              <ChevronLeft size={16} color="#fff" />
            </button>

            <style>{`.festival-track::-webkit-scrollbar{display:none}`}</style>
            <div
              ref={trackRef}
              className="festival-track"
              style={{ display: "flex", gap: 12, overflowX: "auto", padding: "20px 44px", scrollbarWidth: "none" }}
            >
              {FESTIVAL_ITEMS.map((item) => {
                return (
                  <FestivalProductCard
                    key={item.code}
                    item={{ code: item.code, basePrice: item.basePrice, discount: item.discount }}
                    timer={[hh, mm, ss]}
                    amazingTypography
                    hasIncentive={RANDOM_INCENTIVES.has(item.code)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shgeft Carousel data ────────────────────────────────────────────────────
const SHGEFT_ITEMS = [
  { code: "WP-A101", basePrice: 4_200_000, discount: 62 },
  { code: "WP-B204", basePrice: 3_100_000, discount: 45 },
  { code: "WP-C317", basePrice: 5_800_000, discount: 70 },
  { code: "WP-D412", basePrice: 2_700_000, discount: 38 },
  { code: "WP-E509", basePrice: 6_300_000, discount: 56 },
  { code: "WP-F623", basePrice: 3_500_000, discount: 61 },
  { code: "WP-G718", basePrice: 4_900_000, discount: 52 },
  { code: "WP-H830", basePrice: 2_200_000, discount: 40 },
];

const RANDOM_INCENTIVES = new Set(
  [...SHGEFT_ITEMS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map(item => item.code),
);

const SORTED_SHGEFT_ITEMS = [...SHGEFT_ITEMS].sort(
  (a, b) => Number(RANDOM_INCENTIVES.has(b.code)) - Number(RANDOM_INCENTIVES.has(a.code)),
);

function ShgeftCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  // shared countdown seeded at ~6h 17m 21s
  const [secs, setSecs] = useState(6 * 3600 + 17 * 60 + 21);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  function scroll(dir: "right" | "left") {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === "left" ? -420 : 420, behavior: "smooth" });
  }

  return (
    <div style={{ width: "100%", backgroundColor: "#fff" }}>
      <div style={{ width: "100%", border: `1px solid ${PINK}`, borderRadius: 20, padding: "24px 24px 28px", boxSizing: "border-box" }}>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: PINK, ...F }}>جشنواره طرح های ساده و پرطرفدار</p>
            <div style={{ height: 0.75, backgroundColor: PINK, borderRadius: 9999, marginTop: 4 }} />
          </div>
          {/* Nav buttons — top left */}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => scroll("right")} style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: PINK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            ><ChevronRight size={16} color="#fff" /></button>
            <button onClick={() => scroll("left")} style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: PINK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            ><ChevronLeft size={16} color="#fff" /></button>
          </div>
        </div>

        {/* Carousel */}
        <div style={{ position: "relative" }}>
          <style>{`.shgeft-track::-webkit-scrollbar{display:none}`}</style>
          <div ref={trackRef} className="shgeft-track" style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", padding: "6px 2px 10px" }}>
            {SORTED_SHGEFT_ITEMS.map((item) => {
              return <FestivalProductCard key={item.code} item={item} timer={[hh, mm, ss]} amazingTypography hasIncentive={RANDOM_INCENTIVES.has(item.code)} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShgeftCarousel2() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [secs, setSecs] = useState(4 * 3600 + 52 * 60 + 9);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  function scroll(dir: "right" | "left") {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === "left" ? -420 : 420, behavior: "smooth" });
  }

  return (
    <div style={{ width: "100%", backgroundColor: "#fff" }}>
      <div style={{ width: "100%", border: `1px solid ${PINK}`, borderRadius: 20, padding: "24px 24px 28px", boxSizing: "border-box" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: PINK, ...F }}>جشنواره طرح های شلوغ و متراکم</p>
            <div style={{ height: 0.75, backgroundColor: PINK, borderRadius: 9999, marginTop: 4 }} />
          </div>
          {/* Nav buttons — top left */}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => scroll("right")} style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: PINK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            ><ChevronRight size={16} color="#fff" /></button>
            <button onClick={() => scroll("left")} style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: PINK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            ><ChevronLeft size={16} color="#fff" /></button>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <style>{`.shgeft-track2::-webkit-scrollbar{display:none}`}</style>
          <div ref={trackRef} className="shgeft-track2" style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", padding: "6px 2px 10px" }}>
            {SORTED_SHGEFT_ITEMS.map((item) => {
              return <FestivalProductCard key={item.code} item={item} timer={[hh, mm, ss]} amazingTypography hasIncentive={RANDOM_INCENTIVES.has(item.code)} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Coupon Card ──────────────────────────────────────────────────────────────
type CouponCategory = "shipping" | "roll" | "brand-next" | "brand-extreme" | "brand-wallmaster";

interface CouponData {
  discount: number;
  code: string;
  title: string;
  desc: string;
  expiry: string;
  minOrder: string;
  category: CouponCategory;
}

const ALL_COUPONS: CouponData[] = [
  { discount: 30, code: "WALL30",    title: "اولین خرید",        desc: "برای خرید از تمام آلبوم‌ها",    expiry: "۱۴۰۳/۱۲/۲۹", minOrder: "۵۰۰,۰۰۰ تومان", category: "roll" },
  { discount: 5,  code: "CARBON5",   title: "آلبوم کربن",        desc: "برای خرید از آلبوم کربن",       expiry: "۱۴۰۳/۰۹/۳۰", minOrder: "۲۰۰,۰۰۰ تومان", category: "roll" },
  { discount: 15, code: "MEMBER15",  title: "باشگاه مشتریان",    desc: "ویژه اعضای باشگاه",             expiry: "۱۴۰۳/۱۰/۱۵", minOrder: "۳۰۰,۰۰۰ تومان", category: "roll" },
  { discount: 30, code: "HYDR30",    title: "آلبوم هیدروژن",     desc: "برای خرید از آلبوم هیدروژن",   expiry: "۱۴۰۳/۱۱/۰۱", minOrder: "۴۰۰,۰۰۰ تومان", category: "roll" },
  { discount: 20, code: "SHIP20",    title: "تخفیف ارسال بهار",  desc: "ارسال رایگان برای سفارش بهار",  expiry: "۱۴۰۳/۱۲/۱۰", minOrder: "۲۵۰,۰۰۰ تومان", category: "shipping" },
  { discount: 10, code: "NEXT10",    title: "برند نکست",         desc: "برای تمام محصولات نکست",        expiry: "۱۴۰۳/۰۸/۳۰", minOrder: "۱۵۰,۰۰۰ تومان", category: "brand-next" },
  { discount: 25, code: "NEXTPREM",  title: "نکست پریمیوم",      desc: "ویژه محصولات پریمیوم نکست",     expiry: "۱۴۰۳/۱۲/۲۹", minOrder: "۶۰۰,۰۰۰ تومان", category: "brand-next" },
  { discount: 40, code: "FSHIP40",   title: "ارسال ویژه جشنواره",desc: "ارسال رایگان جشنواره تک‌رولی", expiry: "۱۴۰۳/۰۷/۳۰", minOrder: "۱۰۰,۰۰۰ تومان", category: "shipping" },
  { discount: 15, code: "EXTREME15", title: "اکستریم والز",      desc: "محصولات اکستریم والز",          expiry: "۱۴۰۳/۱۰/۰۱", minOrder: "۳۵۰,۰۰۰ تومان", category: "brand-extreme" },
  { discount: 20, code: "EXVIP20",   title: "اکستریم VIP",       desc: "برای مشتریان VIP اکستریم",     expiry: "۱۴۰۳/۱۱/۱۵", minOrder: "۵۰۰,۰۰۰ تومان", category: "brand-extreme" },
  { discount: 12, code: "WMASTER12", title: "وال مستر",          desc: "تخفیف ویژه محصولات وال مستر",  expiry: "۱۴۰۳/۱۲/۰۱", minOrder: "۲۸۰,۰۰۰ تومان", category: "brand-wallmaster" },
  { discount: 18, code: "WMGOLD",    title: "وال مستر گلد",      desc: "سری گلد وال مستر",             expiry: "۱۴۰۳/۰۹/۲۰", minOrder: "۴۵۰,۰۰۰ تومان", category: "brand-wallmaster" },
  { discount: 8,  code: "SHIP8",     title: "تخفیف هزینه ارسال", desc: "تخفیف ارسال برای همه سفارشات", expiry: "۱۴۰۳/۱۰/۳۰", minOrder: "۱۸۰,۰۰۰ تومان", category: "shipping" },
];

function CouponCard({ coupon }: { coupon: CouponData }) {
  const [copied, setCopied] = useState(false);
  const NOTCH_R = 13;

  function handleCopy() {
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
  }
  return (
    <div style={{
      display: "flex",
      width: "100%",
      borderRadius: 14,
      overflow: "hidden",
      background: "#f2f2f2",
      minHeight: 168,
      position: "relative",
    }}>
      {/* Left stub — pink */}
      <div style={{
        width: 110,
        flexShrink: 0,
        background: PINK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        position: "relative",
      }}>
        {/* Top notch */}
        <div style={{
          position: "absolute", top: -NOTCH_R, right: -NOTCH_R,
          width: NOTCH_R * 2, height: NOTCH_R * 2,
          borderRadius: "50%", background: "#fff", zIndex: 2,
        }} />
        {/* Bottom notch */}
        <div style={{
          position: "absolute", bottom: -NOTCH_R, right: -NOTCH_R,
          width: NOTCH_R * 2, height: NOTCH_R * 2,
          borderRadius: "50%", background: "#fff", zIndex: 2,
        }} />
        <span style={{ fontSize: 40, fontWeight: 900, color: "#fff", lineHeight: 1, ...F }}>{toPersianDigits(coupon.discount)}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", ...F }}>درصد</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.65)", ...F }}>تخفیف</span>
      </div>

      {/* Perforated divider */}
      <div style={{
        width: 0,
        borderLeft: "2px dashed #bbb",
        margin: "12px 0",
        flexShrink: 0,
        marginRight: NOTCH_R,
        marginLeft: NOTCH_R - 2,
      }} />

      {/* Right content */}
      <div style={{
        flex: 1,
        padding: "14px 16px 14px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
        minWidth: 0,
        overflow: "hidden",
        direction: "rtl",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#232323", ...F }}>{coupon.title}</p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#6b7280", ...F }}>{coupon.desc}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Code row */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          {/* مشاهده شرط */}
          <button style={{
            padding: "4px 10px",
            borderRadius: 8,
            border: `1.5px solid #d1d5db`,
            background: "#fff",
            fontSize: 13,
            fontWeight: 600,
            color: "#6b7280",
            cursor: "pointer",
            ...F,
          }}>
            مشاهده شرط
          </button>

          {/* کپی کن / code badge */}
          {copied ? (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#fff",
              border: `1.5px dashed ${PINK}`,
              borderRadius: 8,
              padding: "4px 10px",
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: PINK, letterSpacing: "0.08em", fontFamily: F.fontFamily }}>{toPersianDigits(coupon.code)}</span>
            </div>
          ) : (
            <button
              onClick={handleCopy}
              style={{
                padding: "4px 14px",
                borderRadius: 8,
                border: "none",
                background: PINK,
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                ...F,
              }}
            >
              کپی کن
            </button>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", ...F }}>حداقل خرید: {coupon.minOrder}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", ...F }}>تا {coupon.expiry}</p>
        </div>
        </div>
      </div>
    </div>
  );
}

// ─── Discount Code Section ────────────────────────────────────────────────────
type FilterKey = "all" | CouponCategory;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",              label: "همه" },
  { key: "shipping",         label: "تخفیف هزینه ارسال" },
  { key: "roll",             label: "تخفیف هزینه رول" },
  { key: "brand-next",       label: "برند نکست" },
  { key: "brand-extreme",    label: "برند اکستریم" },
  { key: "brand-wallmaster", label: "برند وال مستر" },
];

const INITIAL_ROWS = 2;
const COLS = 3;

function DiscountCodeSection() {
  const reduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [showAll, setShowAll] = useState(false);
  const [brandDropOpen, setBrandDropOpen] = useState(false);
  const brandDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (brandDropRef.current && !brandDropRef.current.contains(e.target as Node)) {
        setBrandDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = activeFilter === "all" ? ALL_COUPONS : ALL_COUPONS.filter(c => c.category === activeFilter);
  const initialCount = INITIAL_ROWS * COLS;
  const hasMore = filtered.length > initialCount;

  function handleFilter(key: FilterKey) {
    setActiveFilter(key);
    setShowAll(false);
  }

  return (
    <section style={{ padding: "40px 24px 64px", display: "flex", justifyContent: "center" }} dir="rtl">
      <div style={{ maxWidth: 1380, width: "100%" }}>

        {/* Section header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: PINK, flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: PINK, ...F }}>کد تخفیف</p>
          </div>
          <p style={{ margin: 0, fontSize: 15, color: "#6b7280", ...F }}>شرایط برخورداری از کد تخفیف</p>
        </div>

        {/* Filter pills */}
        {(() => {
          const BRAND_FILTERS = [
            { key: "brand-next" as FilterKey,       label: "برند نکست" },
            { key: "brand-extreme" as FilterKey,     label: "برند اکستریم" },
            { key: "brand-wallmaster" as FilterKey,  label: "برند وال مستر" },
          ];
          const SIMPLE_FILTERS = FILTERS.filter(f => !["brand-next","brand-extreme","brand-wallmaster"].includes(f.key));
          const activeBrand = BRAND_FILTERS.find(b => b.key === activeFilter);
          const brandActive = !!activeBrand;
          const brandTotalCount = BRAND_FILTERS.reduce((s, b) => s + ALL_COUPONS.filter(c => c.category === b.key).length, 0);
          return (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 56, alignItems: "center" }}>
              {SIMPLE_FILTERS.map(f => {
                const active = activeFilter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => { handleFilter(f.key); setBrandDropOpen(false); }}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 9999,
                      border: `1.5px solid ${active ? PINK : "#e5e7eb"}`,
                      background: active ? PINK : "#fff",
                      color: active ? "#fff" : "#374151",
                      fontSize: 15,
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      ...F,
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.color = PINK; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; } }}
                  >
                    {f.label}
                    {f.key !== "all" && (
                      <span style={{ marginRight: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: active ? "rgba(255,255,255,0.28)" : "#f3f4f6", fontSize: 12, fontWeight: 700, color: active ? "#fff" : "#9ca3af", ...F }}>
                        {toPersianDigits(ALL_COUPONS.filter(c => c.category === f.key).length)}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Brand dropdown */}
              <div ref={brandDropRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setBrandDropOpen(v => !v)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9999,
                    border: `1.5px solid ${brandActive ? PINK : "#e5e7eb"}`,
                    background: brandActive ? PINK : "#fff",
                    color: brandActive ? "#fff" : "#374151",
                    fontSize: 15,
                    fontWeight: brandActive ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    ...F,
                  }}
                >
                  {activeBrand ? activeBrand.label : "برند"}
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: brandActive ? "rgba(255,255,255,0.28)" : "#f3f4f6", fontSize: 12, fontWeight: 700, color: brandActive ? "#fff" : "#9ca3af", ...F }}>
                    {toPersianDigits(brandActive ? ALL_COUPONS.filter(c => c.category === activeFilter).length : brandTotalCount)}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: 2, transform: brandDropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <path d="M2 4l4 4 4-4" stroke={brandActive ? "#fff" : "#9ca3af"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <AnimatePresence>
                  {brandDropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                      style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, minWidth: 160, backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, overflow: "hidden" }}
                    >
                      {BRAND_FILTERS.map(b => {
                        const isActive = activeFilter === b.key;
                        return (
                          <button
                            key={b.key}
                            onClick={() => { handleFilter(b.key); setBrandDropOpen(false); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: isActive ? "#fdf2f8" : "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: isActive ? 700 : 500, color: isActive ? PINK : "#374151", transition: "background 0.15s", ...F }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#fafafa"; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "#fff"; }}
                          >
                            <span>{b.label}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: isActive ? PINK : "#f3f4f6", fontSize: 12, fontWeight: 700, color: isActive ? "#fff" : "#9ca3af", ...F }}>
                              {toPersianDigits(ALL_COUPONS.filter(c => c.category === b.key).length)}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })()}

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {filtered.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: 16, ...F }}>
                کد تخفیفی در این دسته‌بندی وجود ندارد
              </div>
            ) : filtered.slice(0, initialCount).map((c) => (
              <CouponCard key={c.code} coupon={c} />
            ))}
            <AnimatePresence initial={false}>
              {showAll && hasMore && <motion.div
                key="additional-coupons"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "tween", duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ gridColumn: "1 / -1", overflow: "hidden", minWidth: 0 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 28 }}>
                  {filtered.slice(initialCount).map((c, i) => <motion.div
                    key={c.code}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "tween", duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : i * 0.035, ease: [0.22, 1, 0.36, 1] }}
                    style={{ minWidth: 0, display: "flex" }}
                  ><CouponCard coupon={c} /></motion.div>)}
                </div>
              </motion.div>}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* بیشتر button */}
        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <button
              onClick={() => setShowAll(v => !v)}
              style={{
                padding: "10px 40px",
                borderRadius: 9999,
                border: `1px solid ${PINK}`,
                background: showAll ? PINK : "#fff",
                color: showAll ? "#fff" : PINK,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                ...F,
                transition: "all 0.2s",
              }}
            >
              {showAll ? "بستن" : "بیشتر"}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

// ─── Coupon Cards Section ─────────────────────────────────────────────────────
// ─── Page ─────────────────────────────────────────────────────────────────────
export function DiscountsPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>

      <HeroSection />
      <BannerSection />
      <Festival2Section />

      {/* Two carousel rows stacked */}
      <div dir="rtl" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "20px 24px 48px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ width: "75%", maxWidth: 1071 }}><ShgeftCarousel /></div>
        <div style={{ width: "75%", maxWidth: 1071 }}><ShgeftCarousel2 /></div>
      </div>
      <AmazingOffersCarousel />
      <DiscountCodeSection />
    </div>
  );
}
