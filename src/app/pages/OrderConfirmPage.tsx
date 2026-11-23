import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Pencil, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import roll2 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import samanLogo from "@/imports/______-______-____-___-____-_____-_____.png";
import parsianLogo from "@/imports/images.jfif";
import mellatLogo from "@/imports/images.jfif";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const F = { fontFamily: "'Vazirmatn', sans-serif" };
const fmt = (n: number) => n.toLocaleString("fa-IR");

const COL_COUNT = 12;

type DataRow = {
  type: "shipping" | "product" | "summary";
  idx?: number;
  code?: string;
  name: string;
  qty: number;
  unitPrice?: number;
  rawTotal?: number;
  discountPct?: number;
  discountAmt?: number;
  afterDiscount?: number;
  tax?: number;
  grandTotal: number;
};

const tableRows: DataRow[] = [
  {
    type: "product",
    idx: 1,
    code: "11111",
    name: " 1111",
    qty: 1,
    unitPrice: 999999,
    rawTotal: 999999,
    discountPct: 0,
    discountAmt: 0,
    afterDiscount: 999999,
    tax: 181,
    grandTotal: 2000,
  },
  {
    type: "product",
    idx: 2,
    code: "11111",
    name: " 11111",
    qty: 5,
    unitPrice: 999999,
    rawTotal: 999999,
    discountPct: 0,
    discountAmt: 0,
    afterDiscount: 999999,
    tax: 999999,
    grandTotal: 999999,
  },
  {
    type: "shipping",
    name: "هزینه ارسال",
    qty: 1,
    unitPrice: 999999,
    rawTotal: 999999,
    discountPct: 0,
    discountAmt: 0,
    afterDiscount: 999999,
    tax: 999999,
    grandTotal: 999999,
  },
  {
    type: "summary",
    name: "جمع ردیف‌ها",
    qty: 7,
    discountPct: 0,
    discountAmt: 0,
    grandTotal: 9692000,
  },
];

const banks = [
  { key: "saman", label: "سامان", logo: samanLogo },
  { key: "parsian", label: "پارسیان", logo: parsianLogo },
  { key: "mellat", label: "ملت", logo: mellatLogo },
];

const headers = [
  { label: "ردیف", w: 44 },
  { label: "تصویر کالا", w: 70 },
  { label: "شناسه کالا", w: 86 },
  { label: "شرح کالا", w: 130 },
  { label: "تعداد", w: 52 },
  { label: "مبلغ واحد\n(تومان)", w: 96 },
  { label: "مبلغ کل\n(تومان)", w: 96 },
  { label: "درصد\nتخفیف", w: 64 },
  { label: "مبلغ تخفیف\n(تومان)", w: 96 },
  { label: "مبلغ کل پس از\nتخفیف (تومان)", w: 110 },
  { label: "جمع مالیات و\nعوارض افزوده\n(تومان)", w: 110 },
  {
    label: "جمع کل پس از تخفیف\nو مالیات و عوارض\n(تومان)",
    w: 120,
  },
];

export function OrderConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTimer = (location.state as { timerSec?: number } | null)?.timerSec ?? null;
  const [timerSec, setTimerSec] = useState<number | null>(initialTimer);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [show3plExpired, setShow3plExpired] = useState(false);

  useEffect(() => {
    if (timerSec === null) return;
    timerRef.current = setInterval(() => {
      setTimerSec(s => {
        if (s === null || s <= 1) { clearInterval(timerRef.current!); timerRef.current = null; return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const timerMins = timerSec !== null ? String(Math.floor(timerSec / 60)).padStart(2, "0") : "00";
  const timerSecs = timerSec !== null ? String(timerSec % 60).padStart(2, "0") : "00";
  const timerUrgent = timerSec !== null && timerSec <= 60;

  const [useWallet, setUseWallet] = useState(false);
  const [selectedBank, setSelectedBank] = useState("saman");
  const [deliveryDate, setDeliveryDate] = useState(
    "یک‌شنبه ۲۱ تیر ۱۴۰۵",
  );
  const [editingDate, setEditingDate] = useState(false);
  const [dateConfirmed, setDateConfirmed] = useState(false);

  const borderL = (i: number) =>
    i < COL_COUNT - 1 ? "border-l border-gray-300" : "";

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>


      <AnimatePresence>
        {timerSec !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-7xl mx-auto px-4 sm:px-6 pt-6"
            dir="rtl"
          >
            <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #CA165C 0%, #e8357a 100%)" }}>
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-black leading-tight" style={F}>رزرو موقت سبد خرید</span>
                    <span className="text-white/75 text-xs leading-tight" style={F}>ارسال ۳PL در این بازه زمانی تضمین می‌شود</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-14 h-10 bg-white rounded-lg flex items-center justify-center" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <span className="text-xl font-black leading-none tabular-nums" style={{ color: timerUrgent ? "#ef4444" : "#CA165C", ...F }}>{timerMins}</span>
                  </div>
                  <span className="text-white font-black text-xl" style={F}>:</span>
                  <div className="w-14 h-10 bg-white rounded-lg flex items-center justify-center" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <span className="text-xl font-black leading-none tabular-nums" style={{ color: timerUrgent ? "#ef4444" : "#CA165C", ...F }}>{timerSecs}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        {/* شناسه پیگیری + تاریخ */}
        <div className="flex items-center justify-between">
          <p
            className="text-sm font-bold text-gray-700"
            style={F}
          >
            شناسه پیگیری:{" "}
            <span className="text-[#3d1a6e]">۱۰۰۱۲۲</span>
          </p>
          <p
            className="text-sm font-bold text-gray-700"
            style={F}
          >
            تاریخ: ۱۴۰۵/۴/۲۱
          </p>
        </div>

        {/* ── جدول ── */}
        <div className="overflow-x-auto border border-gray-300 rounded-xl">
          <table
            className="border-collapse"
            style={{
              minWidth:
                headers.reduce((s, h) => s + h.w, 0) + "px",
              width: "100%",
              ...F,
            }}
          >
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    style={{ width: h.w, minWidth: h.w }}
                    className={`px-2 py-2.5 text-center text-[11px] font-bold text-gray-800 leading-snug whitespace-pre-line ${borderL(i)}`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => {
                const isShipping = row.type === "shipping";
                const isSummary = row.type === "summary";
                const isProduct = row.type === "product";
                const bg =
                  isShipping || isSummary
                    ? "bg-gray-50"
                    : "bg-white";
                const td = (
                  i: number,
                  content: React.ReactNode,
                  extra = "",
                ) => (
                  <td
                    key={i}
                    className={`px-2 py-3 text-center text-xs text-gray-700 ${borderL(i)} ${extra}`}
                  >
                    {content}
                  </td>
                );

                if (isShipping) {
                  return (
                    <tr
                      key={ri}
                      className={`border-b border-gray-200 ${bg}`}
                    >
                      {/* colspan 4: ردیف + تصویر + شناسه + شرح */}
                      <td
                        colSpan={4}
                        className={`px-3 py-3 text-right text-xs font-semibold text-gray-700 ${borderL(3)}`}
                      >
                        {row.name}
                      </td>
                      {td(4, fmt(row.qty))}
                      {td(5, fmt(row.unitPrice!))}
                      {td(6, fmt(row.rawTotal!))}
                      {td(7, fmt(row.discountPct ?? 0))}
                      {td(8, fmt(row.discountAmt ?? 0))}
                      {td(9, fmt(row.afterDiscount!))}
                      {td(10, fmt(row.tax!))}
                      {td(
                        11,
                        fmt(row.grandTotal),
                        "font-bold text-gray-900",
                      )}
                    </tr>
                  );
                }

                if (isSummary) {
                  return (
                    <tr
                      key={ri}
                      className={`border-b border-gray-200 last:border-0 ${bg}`}
                    >
                      {/* colspan 4 for summary label */}
                      <td
                        colSpan={4}
                        className={`px-3 py-3 text-right text-xs font-bold text-gray-800 ${borderL(3)}`}
                      >
                        {row.name}
                      </td>
                      {td(4, fmt(row.qty))}
                      {td(5, "")}
                      {td(6, "")}
                      {td(7, fmt(row.discountPct ?? 0))}
                      {td(8, fmt(row.discountAmt ?? 0))}
                      {td(9, "")}
                      {td(10, "")}
                      {td(
                        11,
                        fmt(row.grandTotal),
                        "font-bold text-gray-900",
                      )}
                    </tr>
                  );
                }

                // product row
                return (
                  <tr
                    key={ri}
                    className={`border-b border-gray-200 last:border-0 ${bg}`}
                  >
                    {td(0, fmt(row.idx!), "font-bold")}
                    <td
                      className={`px-2 py-3 text-center ${borderL(1)}`}
                    >
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 mx-auto">
                        <ImageWithFallback
                          src={roll2}
                          alt={row.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    {td(2, row.code)}
                    {td(3, row.name, "text-right font-medium")}
                    {td(4, fmt(row.qty))}
                    {td(5, fmt(row.unitPrice!))}
                    {td(6, fmt(row.rawTotal!))}
                    {td(7, fmt(row.discountPct ?? 0))}
                    {td(8, fmt(row.discountAmt ?? 0))}
                    {td(9, fmt(row.afterDiscount!))}
                    {td(10, fmt(row.tax!))}
                    {td(
                      11,
                      fmt(row.grandTotal),
                      "font-bold text-gray-900",
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── زمان ارسال ── */}
        {/* ── کیف پول + زمان ارسال (کنار هم، انتهای صفحه) ── */}
        <div className="flex items-start justify-between gap-3">
          {/* پرداخت با کیف پول — RIGHT (first in RTL DOM) */}
          <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-2.5">
            <button
              onClick={() => setUseWallet((v) => !v)}
              className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${useWallet ? "bg-[#3d1a6e]" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${useWallet ? "right-0.5" : "left-0.5"}`}
              />
            </button>
            <div className="flex flex-col gap-0.5">
              <span
                className="text-sm font-bold text-gray-800 whitespace-nowrap"
                style={F}
              >
                پرداخت با کیف پول
              </span>
              <span
                className="text-gray-500 whitespace-nowrap text-[13px]"
                style={F}
              >
                مانده:{" "}
                <span className="text-gray-700 font-semibold">
                  {fmt(419768665)}
                </span>{" "}
                تومان
              </span>
            </div>
          </div>

        </div>

        {/* ── انتخاب درگاه پرداخت — آخرین بخش ── */}
        <div className="border border-gray-200 rounded-xl px-5 py-4 flex flex-col gap-4">
          <p
            className="text-sm font-bold text-gray-800 text-right"
            style={F}
          >
            انتخاب درگاه پرداخت :
          </p>

          {/* بانک‌ها سمت راست */}
          <div className="flex items-center gap-8 justify-start">
            {banks.map((bank) => (
              <button
                key={bank.key}
                onClick={() => setSelectedBank(bank.key)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-12 flex items-center justify-center">
                  {bank.logo ? (
                    <ImageWithFallback
                      src={bank.logo}
                      alt={bank.label}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div
                      className="w-16 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold border border-gray-200"
                      style={F}
                    >
                      {bank.label}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedBank === bank.key ? "border-[#3d1a6e]" : "border-gray-400"}`}
                  >
                    {selectedBank === bank.key && (
                      <div className="w-2 h-2 rounded-full bg-[#3d1a6e]" />
                    )}
                  </div>
                  <span
                    className="text-xs text-gray-700"
                    style={F}
                  >
                    {bank.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* دکمه پرداخت — پایین چپ کارت */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (initialTimer !== null) { setShow3plExpired(true); return; }
                alert("در حال انتقال به درگاه پرداخت...");
              }}
              className="px-8 py-2.5 bg-[#CA165C] hover:bg-[#a8124d] text-white text-sm font-bold rounded-xl transition-colors"
              style={F}
            >
              پرداخت
            </button>
          </div>
        </div>
      </div>

      {/* ── 3PL expired modal ── */}
      <AnimatePresence>
        {show3plExpired && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShow3plExpired(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              dir="rtl"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm px-6 py-7 flex flex-col gap-5" style={F}>
                <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto" style={{ backgroundColor: "rgba(202,22,92,0.1)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#CA165C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="text-center flex flex-col gap-2">
                  <p className="text-base font-black text-gray-800" style={F}>زمان رزرو سفارش از نوع 3PL به پایان رسید</p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={F}>لطفاً مجدد نحوه ارسال را انتخاب کنید.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShow3plExpired(false);
                    navigate("/checkout", { state: { openBox: 2 } });
                  }}
                  className="w-full py-3 text-sm font-bold text-white rounded-xl transition-colors"
                  style={{ backgroundColor: "#CA165C", ...F }}
                >
                  بازگشت به انتخاب ارسال
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}