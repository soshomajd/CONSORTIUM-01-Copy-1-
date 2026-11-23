import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ChevronDown, Store, MapPin, Search, X, Plus, Phone, Map, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getUser } from "@/app/components/Header";
import roll2 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const F = { fontFamily: "'Vazirmatn', sans-serif" };

// Fix Leaflet default marker icon broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function DraggableMarker({ pos, onChange }: { pos: [number, number]; onChange: (p: [number, number]) => void }) {
  const markerRef = useRef<L.Marker>(null);
  useMapEvents({ click(e) { onChange([e.latlng.lat, e.latlng.lng]); } });
  return (
    <Marker draggable position={pos} ref={markerRef}
      eventHandlers={{ dragend() { const m = markerRef.current; if (m) { const p = m.getLatLng(); onChange([p.lat, p.lng]); } } }}
    />
  );
}

const cartItems = [
  { id: "1", name: "001", code: "12345", unitPrice: 999.999, qty: 1 },
  { id: "2", name: "002", code: "12345", unitPrice: 999.999, qty: 5 },
];

const shippingCompanies = ["پست پیشتاز", "تیپاکس", "پنتر", "ماهکس", "اسنپ‌باکس"];

const ADDRESSES: { name: string; detail: string; ostan?: string }[] = [
  { name: "فروشگاه دکور اکبری", detail: "تهران، سعادت‌آباد، خیابان علامه، کوچه گلستان، پلاک ۱۴", ostan: "تهران" },
  { name: "فروشگاه خانه کاغذ",  detail: "کرج، گوهردشت، فاز ۳، ۱۲ام، پلاک ۵۴",                   ostan: "البرز" },
  { name: "فروشگاه دهقان",       detail: "اصفهان، چهارباغ، پلاک ۱۰۸",                              ostan: "اصفهان" },
];

function fmt(n: number) {
  return n.toLocaleString("fa-IR");
}

const CITIES_BY_OSTAN: Record<string, string[]> = {
  "تهران": ["تهران","کرج","ری","شهریار","اسلامشهر","پاکدشت","ورامین","فیروزکوه","دماوند","رباط کریم"],
  "اصفهان": ["اصفهان","کاشان","خمینی‌شهر","نجف‌آباد","شاهین‌شهر","فلاورجان","زرین‌شهر","اردستان","نایین","تیران"],
  "فارس": ["شیراز","مرودشت","جهرم","کازرون","فسا","داراب","آباده","اقلید","نی‌ریز","لارستان"],
  "خراسان رضوی": ["مشهد","نیشابور","سبزوار","تربت حیدریه","قوچان","تربت جام","کاشمر","گناباد","فریمان","چناران"],
  "مازندران": ["ساری","بابل","آمل","قائم‌شهر","نوشهر","چالوس","بابلسر","تنکابن","رامسر","نکا"],
  "آذربایجان شرقی": ["تبریز","مراغه","مرند","اهر","میانه","شبستر","بناب","سراب","هشترود","جلفا"],
  "کرمان": ["کرمان","سیرجان","رفسنجان","زرند","بم","جیرفت","کهنوج","بردسیر","شهربابک","انار"],
  "البرز": ["کرج","فردیس","نظرآباد","هشتگرد","طالقان","ماهدشت","گرمدره","آسارا","چهارباغ","اشتهارد"],
  "گیلان": ["رشت","انزلی","لاهیجان","لنگرود","آستارا","تالش","رودبار","فومن","صومعه‌سرا","رودسر"],
  "سیستان و بلوچستان": ["زاهدان","چابهار","زابل","ایرانشهر","خاش","سراوان","نیکشهر","کنارک","دلگان","قصرقند"],
  "لرستان": ["خرم‌آباد","بروجرد","دورود","ازنا","الیگودرز","کوهدشت","نورآباد","پلدختر","سلسله","رومشکان"],
  "همدان": ["همدان","ملایر","نهاوند","اسدآباد","تویسرکان","بهار","کبودرآهنگ","رزن","فامنین","سامن"],
  "کرمانشاه": ["کرمانشاه","اسلام‌آباد غرب","سنقر","کنگاور","هرسین","جوانرود","سرپل ذهاب","پاوه","دالاهو","ثلاث باباجانی"],
  "مرکزی": ["اراک","ساوه","خمین","محلات","تفرش","آشتیان","شازند","دلیجان","کمیجان","زرندیه"],
  "اردبیل": ["اردبیل","پارس‌آباد","مشگین‌شهر","خلخال","گرمی","نمین","نیر","سرعین","کوثر","انگوت"],
  "زنجان": ["زنجان","ابهر","خدابنده","قیدار","طارم","ماهنشان","سلطانیه","ایجرود","هیدج","خرمدره"],
  "گلستان": ["گرگان","گنبد کاووس","گرگانرود","آق‌قلا","علی‌آباد","کردکوی","بندرگز","مینودشت","رامیان","آزادشهر"],
  "قم": ["قم"],
  "خوزستان": ["اهواز","شوشتر","دزفول","آبادان","خرمشهر","بهبهان","اندیمشک","ماهشهر","ایذه","مسجدسلیمان"],
  "بوشهر": ["بوشهر","دشتستان","برازجان","دشتی","دیر","عسلویه","تنگستان","گناوه","کنگان","جم"],
  "یزد": ["یزد","میبد","اردکان","بافق","تفت","مهریز","ابرکوه","خاتم","صدوق","بهاباد"],
  "سمنان": ["سمنان","شاهرود","دامغان","گرمسار","مهدی‌شهر","آرادان","میامی","سرخه","شمیرانات","ایوانکی"],
  "چهارمحال و بختیاری": ["شهرکرد","بروجن","فارسان","اردل","سامان","لردگان","کیار","کوهرنگ","بن","میانکوه"],
  "کهگیلویه و بویراحمد": ["یاسوج","گچساران","دوگنبدان","دنا","بویراحمد","کهگیلویه","باشت","لنده","چرام","مارگون"],
  "قزوین": ["قزوین","البرز","بوئین‌زهرا","تاکستان","آبیک","آوج","اقبالیه","شال","الموت","خاکعلی"],
  "خراسان شمالی": ["بجنورد","شیروان","اسفراین","جاجرم","آشخانه","مانه و سملقان","فاروج","گرمه","راز و جرگلان","صفی‌آباد"],
  "خراسان جنوبی": ["بیرجند","قاینات","نهبندان","طبس","فردوس","سرایان","بشرویه","زیرکوه","سربیشه","درمیان"],
  "ایلام": ["ایلام","ایوان","دهلران","مهران","آبدانان","شیروان و چرداول","چوار","ملکشاهی","سیروان","بدره"],
  "کردستان": ["سنندج","سقز","مریوان","بانه","قروه","کامیاران","بیجار","دیواندره","سروآباد","دهگلان"],
  "هرمزگان": ["بندرعباس","بندرلنگه","قشم","خمیر","رودان","جاسک","میناب","حاجی‌آباد","بستک","سیریک"],
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = getUser() ?? "کاربر سایت";
  const [firstName, lastName] = userName.split(" ");

  const [shippingCo, setShippingCo] = useState("");
  const [shippingMethod, setShippingMethod] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [phone, setPhone] = useState("09121111111");
  const [openBox, setOpenBox] = useState<number>(1);
  const [maxUnlocked, setMaxUnlocked] = useState<number>(1);
  const [showAddrAlert, setShowAddrAlert] = useState(false);
  const [showShippingAlert, setShowShippingAlert] = useState(false);
  const [customOrders, setCustomOrders] = useState<Record<string, boolean>>({});
  const [uids, setUids] = useState<Record<string, string>>({});
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponDropOpen, setCouponDropOpen] = useState(false);
  const [selectedAddr, setSelectedAddr] = useState<number | null>(0);
  const [addrOpen, setAddrOpen] = useState(false);
  const [shippingCoOpen, setShippingCoOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [showNewAddrForm, setShowNewAddrForm] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState("");
  const [newAddrOstan, setNewAddrOstan] = useState("");
  const [newAddrPhone, setNewAddrPhone] = useState("");
  const [newAddrMap, setNewAddrMap] = useState("");
  const [newAddrDetail, setNewAddrDetail] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("");
  const [newAddrMainStreet, setNewAddrMainStreet] = useState("");
  const [newAddrSideStreet, setNewAddrSideStreet] = useState("");
  const [newAddrAlley, setNewAddrAlley] = useState("");
  const [newAddrPlaque, setNewAddrPlaque] = useState("");
  const [addrTouched, setAddrTouched] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPos, setMapPos] = useState<[number, number]>([35.6892, 51.3890]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [showAddrConfirmPanel, setShowAddrConfirmPanel] = useState(false);
  const [newAddrName, setNewAddrName] = useState("");
  const [addrRecipient, setAddrRecipient] = useState<"self" | "other">("self");
  const [recipientFirstName, setRecipientFirstName] = useState("");
  const [recipientLastName, setRecipientLastName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [ostanDropOpen, setOstanDropOpen] = useState(false);
  const [cityDropOpen, setCityDropOpen] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [newAddrUnit, setNewAddrUnit] = useState("");
  const [newAddrPostalCode, setNewAddrPostalCode] = useState("");
  const [locationPanelErrors, setLocationPanelErrors] = useState<{ plaque?: string; postal?: string }>({});
  const [timerSec, setTimerSec] = useState<number | null>(null);
  const [showTimerExpired, setShowTimerExpired] = useState(false);
  const [stepNotif, setStepNotif] = useState<string | null>(null);
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showStepNotif = (msg: string) => {
    if (notifRef.current) clearTimeout(notifRef.current);
    setStepNotif(msg);
    notifRef.current = setTimeout(() => setStepNotif(null), 4000);
  };

  const addrRef = useRef<HTMLDivElement>(null);
  const shippingCoRef = useRef<HTMLDivElement>(null);
  const ostanDropRef = useRef<HTMLDivElement>(null);
  const cityDropRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Open box 2 when redirected back from order-confirm after 3PL expiry
  useEffect(() => {
    const state = location.state as { openBox?: number } | null;
    if (state?.openBox === 2) {
      setOpenBox(2);
      setMaxUnlocked(m => Math.max(m, 2));
      setShippingMethod("");
    }
  }, []);

  // Start 15-min countdown when 3PL box 3 opens
  useEffect(() => {
    if (openBox === 3 && shippingMethod === "3pl") {
      if (timerRef.current) return; // already running
      setTimerSec(15 * 60);
      timerRef.current = setInterval(() => {
        setTimerSec(s => {
          if (s === null || s <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimerSec(null);
    }
    return () => {};
  }, [openBox, shippingMethod]);

  useEffect(() => {
    if (openBox === 3) {
      setSlotsLoaded(false);
      const t = setTimeout(() => setSlotsLoaded(true), 2000);
      return () => clearTimeout(t);
    }
  }, [openBox]);

  const storeAddressNames = ["فروشگاه دکور اکبری", "فروشگاه خانه کاغذ"];
  const isStoreAddr = selectedAddr !== null && !!ADDRESSES[selectedAddr] && storeAddressNames.includes(ADDRESSES[selectedAddr].name);
  const selectedOstan = selectedAddr !== null ? ADDRESSES[selectedAddr]?.ostan ?? "" : "";
  const isTehranAlborz = selectedOstan === "تهران" || selectedOstan === "البرز";
  const showTimer = timerSec !== null && shippingMethod === "3pl";
  const timerMins = timerSec !== null ? String(Math.floor(timerSec / 60)).padStart(2, "0") : "00";
  const timerSecs = timerSec !== null ? String(timerSec % 60).padStart(2, "0") : "00";
  const timerUrgent = timerSec !== null && timerSec <= 60;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (addrRef.current && !addrRef.current.contains(e.target as Node)) setAddrOpen(false);
      if (shippingCoRef.current && !shippingCoRef.current.contains(e.target as Node)) setShippingCoOpen(false);
      if (ostanDropRef.current && !ostanDropRef.current.contains(e.target as Node)) setOstanDropOpen(false);
      if (cityDropRef.current && !cityDropRef.current.contains(e.target as Node)) setCityDropOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const subtotal = cartItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const total = subtotal;

  const readonlyInput = (value: string) => (
    <input
      value={value}
      readOnly
      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 text-right outline-none cursor-default"
      style={F}
    />
  );

  const accordions = [
    {
      num: 1,
      title: "آدرس",
      sub: "انتخاب آدرس تحویل بار",
      content: (
        <div className="flex flex-col gap-4">
          {/* Custom address dropdown — fully inline so the accordion expands to fit */}
          <div className="flex flex-col gap-2 px-0 py-0 sm:px-[45px]" ref={addrRef}>
            {/* Selected address chip — stays visible after selection */}
            {selectedAddr !== null && ADDRESSES[selectedAddr] && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl" dir="rtl">
                <MapPin size={14} style={{ color: "#370080", flexShrink: 0 }} />
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-semibold text-[#370080] truncate text-[14px]" style={F}>{ADDRESSES[selectedAddr].name}</p>
                  <p className="text-gray-500 truncate text-[13px]" style={F}>{ADDRESSES[selectedAddr].detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAddr(null)}
                  className="shrink-0 w-5 h-5 rounded-full bg-purple-200 hover:bg-purple-300 transition-colors flex items-center justify-center"
                >
                  <X size={10} style={{ color: "#370080" }} />
                </button>
              </div>
            )}

            {/* Search input — always visible */}
            <div
              className="w-full flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-[#3d1a6e] transition-colors cursor-text"
              dir="rtl"
              onClick={() => setAddrOpen(o => !o)}
            >
              <Search size={15} style={{ color: "#370080", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="جستجو و انتخاب سایر آدرس ها"
                readOnly
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent text-right cursor-pointer"
                style={F}
              />
              <ChevronDown
                size={15}
                className="text-gray-400 shrink-0 transition-transform duration-200"
                style={{ transform: addrOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </div>

            {/* Dropdown list — inline, pushes accordion height */}
            <AnimatePresence>
              {addrOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden rounded-xl border border-gray-200 shadow-sm"
                  dir="rtl"
                >
                  {ADDRESSES.map((addr, i) => (
                    <div
                      key={i}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-right border-b border-gray-100 bg-white cursor-pointer"
                      onClick={() => { setSelectedAddr(i); setAddrOpen(false); setShowNewAddrForm(false); }}
                    >
                      <MapPin size={15} style={{ color: "#370080", flexShrink: 0, marginTop: 2 }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800" style={F}>{addr.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed" style={F}>{addr.detail}</p>
                      </div>
                      {selectedAddr === i && (
                        <div className="shrink-0 w-4 h-4 rounded-md bg-[#370080] flex items-center justify-center mt-1">
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                      {i >= 3 && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            ADDRESSES.splice(i, 1);
                            const newSel = selectedAddr === i
                              ? (ADDRESSES.length > 0 ? 0 : null)
                              : selectedAddr !== null && selectedAddr > i
                                ? selectedAddr - 1
                                : selectedAddr;
                            setSelectedAddr(newSel);
                          }}
                          className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors mt-0.5"
                        >
                          <X size={12} style={{ color: "#CA165C" }} />
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Add new address — last item in dropdown */}
                  <button
                    type="button"
                    onClick={() => { setShowMapModal(true); setAddrOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-purple-50 transition-colors text-right bg-white border-t border-dashed border-gray-200"
                    dir="rtl"
                  >
                    <Plus size={14} style={{ color: "#CA165C", flexShrink: 0 }} />
                    <span className="text-sm font-semibold text-[#ca165c]" style={F}>افزودن آدرس جدید</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* New address form */}
            <AnimatePresence>
              {showNewAddrForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-3 pt-1 pb-1 border border-[#370080]/20 rounded-2xl px-4 py-4 bg-white" dir="rtl">
                    <p className="text-sm font-black text-[#370080]" style={F}>آدرس جدید</p>

                    {/* استان + شهر */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500" style={F}>استان <span style={{ color: "#CA165C" }}>*</span></label>
                        <div className="relative" ref={ostanDropRef}>
                          <button
                            type="button"
                            dir="rtl"
                            onClick={() => setOstanDropOpen(o => !o)}
                            className={`w-full flex items-center justify-between border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 bg-white cursor-pointer text-right ${ostanDropOpen ? "border-[#370080] shadow-[0_0_0_3px_rgba(55,0,128,0.08)]" : addrTouched && !newAddrOstan ? "border-[#CA165C]" : "border-gray-200 hover:border-gray-300"}`}
                            style={F}
                          >
                            <span className={newAddrOstan ? "text-gray-700" : "text-gray-400"} style={F}>
                              {newAddrOstan || "انتخاب استان"}
                            </span>
                            <ChevronDown
                              size={14}
                              className="text-gray-400 transition-transform duration-200 shrink-0"
                              style={{ transform: ostanDropOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                            />
                          </button>
                          {addrTouched && !newAddrOstan && (
                            <p className="text-xs mt-1 font-semibold" style={{ color: "#CA165C", ...F }}>انتخاب استان الزامی است</p>
                          )}
                          <AnimatePresence>
                            {ostanDropOpen && (
                              <motion.ul
                                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                                dir="rtl"
                                className="absolute right-0 left-0 top-full mt-1.5 z-50 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
                                style={{ maxHeight: 220, overflowY: "auto", ...F }}
                              >
                                {["تهران","اصفهان","فارس","خراسان رضوی","مازندران","آذربایجان شرقی","کرمان","البرز","گیلان","سیستان و بلوچستان","لرستان","همدان","کرمانشاه","مرکزی","اردبیل","زنجان","گلستان","قم","خوزستان","بوشهر","یزد","سمنان","چهارمحال و بختیاری","کهگیلویه و بویراحمد","قزوین","خراسان شمالی","خراسان جنوبی","ایلام","کردستان","هرمزگان"].map(p => (
                                  <li key={p}>
                                    <button
                                      type="button"
                                      dir="rtl"
                                      onClick={() => { setNewAddrOstan(p); setOstanDropOpen(false); setNewAddrCity(""); }}
                                      className={`w-full text-right px-4 py-2.5 text-sm transition-colors duration-150 ${newAddrOstan === p ? "bg-purple-50 text-[#370080] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                      style={F}
                                    >
                                      {p}
                                    </button>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500" style={F}>شهر <span style={{ color: "#CA165C" }}>*</span></label>
                        <div className="relative" ref={cityDropRef}>
                          <button
                            type="button"
                            dir="rtl"
                            onClick={() => { if (newAddrOstan) setCityDropOpen(o => !o); }}
                            className={`w-full flex items-center justify-between border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 bg-white text-right ${!newAddrOstan ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${cityDropOpen ? "border-[#370080] shadow-[0_0_0_3px_rgba(55,0,128,0.08)]" : addrTouched && !newAddrCity ? "border-[#CA165C]" : "border-gray-200 hover:border-gray-300"}`}
                            style={F}
                          >
                            <span className={newAddrCity ? "text-gray-700" : "text-gray-400"} style={F}>
                              {newAddrCity || (newAddrOstan ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید")}
                            </span>
                            <ChevronDown
                              size={14}
                              className="text-gray-400 transition-transform duration-200 shrink-0"
                              style={{ transform: cityDropOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                            />
                          </button>
                          {addrTouched && !newAddrCity && (
                            <p className="text-xs mt-1 font-semibold" style={{ color: "#CA165C", ...F }}>انتخاب شهر الزامی است</p>
                          )}
                          <AnimatePresence>
                            {cityDropOpen && newAddrOstan && (
                              <motion.ul
                                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                                dir="rtl"
                                className="absolute right-0 left-0 top-full mt-1.5 z-50 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
                                style={{ maxHeight: 220, overflowY: "auto", ...F }}
                              >
                                {(CITIES_BY_OSTAN[newAddrOstan] ?? []).map(city => (
                                  <li key={city}>
                                    <button
                                      type="button"
                                      dir="rtl"
                                      onClick={() => { setNewAddrCity(city); setCityDropOpen(false); }}
                                      className={`w-full text-right px-4 py-2.5 text-sm transition-colors duration-150 ${newAddrCity === city ? "bg-purple-50 text-[#370080] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                      style={F}
                                    >
                                      {city}
                                    </button>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* خیابان اصلی + خیابان فرعی */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500" style={F}>خیابان اصلی <span style={{ color: "#CA165C" }}>*</span></label>
                        <input type="text" value={newAddrMainStreet} onChange={e => setNewAddrMainStreet(e.target.value)}
                          placeholder="نام خیابان اصلی" dir="rtl"
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white ${addrTouched && !newAddrMainStreet.trim() ? "border-[#CA165C]" : "border-gray-200"}`}
                          style={F} />
                        {addrTouched && !newAddrMainStreet.trim() && (
                          <p className="text-xs font-semibold" style={{ color: "#CA165C", ...F }}>وارد کردن خیابان اصلی الزامی است</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500" style={F}>خیابان فرعی</label>
                        <input type="text" value={newAddrSideStreet} onChange={e => setNewAddrSideStreet(e.target.value)}
                          placeholder="نام خیابان فرعی" dir="rtl"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white"
                          style={F} />
                      </div>
                    </div>

                    {/* کوچه + پلاک */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500" style={F}>کوچه <span style={{ color: "#CA165C" }}>*</span></label>
                        <input type="text" value={newAddrAlley} onChange={e => setNewAddrAlley(e.target.value)}
                          placeholder="نام کوچه" dir="rtl"
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white ${addrTouched && !newAddrAlley.trim() ? "border-[#CA165C]" : "border-gray-200"}`}
                          style={F} />
                        {addrTouched && !newAddrAlley.trim() && (
                          <p className="text-xs font-semibold" style={{ color: "#CA165C", ...F }}>وارد کردن کوچه الزامی است</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500" style={F}>پلاک <span style={{ color: "#CA165C" }}>*</span></label>
                        <input type="text" value={newAddrPlaque} onChange={e => setNewAddrPlaque(e.target.value)}
                          placeholder="شماره پلاک" dir="rtl"
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white ${addrTouched && !newAddrPlaque.trim() ? "border-[#CA165C]" : "border-gray-200"}`}
                          style={F} />
                        {addrTouched && !newAddrPlaque.trim() && (
                          <p className="text-xs font-semibold" style={{ color: "#CA165C", ...F }}>وارد کردن پلاک الزامی است</p>
                        )}
                      </div>
                    </div>

                    {/* شماره تماس */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500" style={F}>شماره تماس <span style={{ color: "#CA165C" }}>*</span></label>
                      <div className="relative">
                        <input type="tel" value={newAddrPhone} onChange={e => setNewAddrPhone(e.target.value)}
                          placeholder="09xxxxxxxxx" dir="rtl"
                          className={`w-full border rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white ${addrTouched && !newAddrPhone.trim() ? "border-[#CA165C]" : "border-gray-200"}`}
                          style={F} />
                        <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {addrTouched && !newAddrPhone.trim() && (
                        <p className="text-xs font-semibold" style={{ color: "#CA165C", ...F }}>وارد کردن شماره تماس الزامی است</p>
                      )}
                    </div>

                    {/* کد پستی */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500" style={F}>کد پستی <span style={{ color: "#CA165C" }}>*</span></label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={newAddrPostalCode}
                        onChange={e => setNewAddrPostalCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="۱۰ رقم" dir="ltr"
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white ${addrTouched && (newAddrPostalCode.length < 10) ? "border-[#CA165C]" : "border-gray-200"}`}
                        style={F}
                      />
                      {addrTouched && newAddrPostalCode.length === 0 && (
                        <p className="text-xs font-semibold" style={{ color: "#CA165C", ...F }}>وارد کردن کد پستی الزامی است</p>
                      )}
                      {addrTouched && newAddrPostalCode.length > 0 && newAddrPostalCode.length < 10 && (
                        <p className="text-xs font-semibold" style={{ color: "#CA165C", ...F }}>کد پستی باید ۱۰ رقم باشد</p>
                      )}
                    </div>

                    {/* موقعیت روی نقشه — فقط در حالت غیر دستی */}
                    {!isManualMode && <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500" style={F}>موقعیت روی نقشه</label>
                      <div
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#370080]/30 bg-purple-50 text-right cursor-pointer hover:border-[#370080]/60 transition-colors"
                        dir="rtl"
                        onClick={() => setShowMapModal(true)}
                      >
                        <Map size={15} style={{ color: "#370080", flexShrink: 0 }} />
                        <span className="text-sm text-[#370080] font-semibold" style={F}>
                          📍 {mapPos[0].toFixed(5)}, {mapPos[1].toFixed(5)}
                        </span>
                        <span className="mr-auto text-xs text-[#370080]/60 underline" style={F}>ویرایش</span>
                      </div>
                    </div>}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 justify-end" dir="rtl">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewAddrForm(false);
                          setShowMapPicker(false);
                          setAddrTouched(false);
                        }}
                        className="px-4 py-2 text-sm text-gray-500 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        style={F}
                      >
                        انصراف
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddrTouched(true);
                          const isValid = newAddrOstan && newAddrCity && newAddrMainStreet.trim() && newAddrAlley.trim() && newAddrPlaque.trim() && newAddrPhone.trim() && newAddrPostalCode.length === 10;
                          if (!isValid) return;
                          setShowNewAddrForm(false);
                          setShowAddrConfirmPanel(true);
                        }}
                        className="px-5 py-2 text-sm font-bold text-white rounded-xl transition-colors"
                        style={{ backgroundColor: "#370080", ...F }}
                      >
                        ادامه و تایید
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Next step button — bottom left */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => { if (selectedAddr === null) { setShowAddrAlert(true); return; } setMaxUnlocked(m => Math.max(m, 2)); setOpenBox(2); }}
              className="py-2.5 text-sm font-bold text-white rounded-xl transition-colors px-[40px] py-[10px]"
              style={{ backgroundColor: "#370080", ...F }}
            >
              مرحله بعد
            </button>
          </div>
        </div>
      ),
    },
    {
      num: 2,
      title: "نحوه ارسال",
      sub: "انتخاب روش و موسسه حمل",
      content: !isTehranAlborz && selectedAddr !== null ? (
        <div className="flex flex-col gap-3 px-0 py-0 sm:px-[45px]" dir="rtl">
          {[
            { key: "barbari",         label: "باربری",         sub: "ارسال توسط باربری" },
            { key: "express",         label: "اکسپرس",         sub: "ارسال توسط شرکت" },
            { key: "fori-shahrestan", label: "فوری شهرستان",   sub: "ارسال فوری به شهرستان" },
            { key: "3pl",             label: "3PL",            sub: "ارسال توسط دیجی‌اکسپرس" },
          ].map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setShippingMethod(opt.key)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border transition-colors text-right ${
                shippingMethod === opt.key
                  ? "border-[#370080] bg-purple-50"
                  : "border-gray-200 bg-white hover:border-[#370080]/40"
              }`}
              dir="rtl"
            >
              <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                shippingMethod === opt.key ? "border-[#CA165C] bg-[#CA165C]" : "border-gray-300 bg-white"
              }`}>
                {shippingMethod === opt.key && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div className="flex flex-col gap-0.5 ml-[30px]">
                <span className="text-sm font-bold text-gray-800" style={F}>{opt.label}</span>
                {opt.sub && <span className="text-xs text-gray-400" style={F}>{opt.sub}</span>}
              </div>
            </button>
          ))}
          {(shippingMethod === "barbari" || shippingMethod === "fori-shahrestan") && (
            <div className="flex flex-col gap-1.5" dir="rtl" ref={shippingCoRef}>
              <label className="text-xs font-bold text-gray-500 pr-1" style={F}>انتخاب موسسه حمل</label>

              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setShippingCoOpen(o => !o)}
                dir="rtl"
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 bg-white transition-all duration-200 ${
                  shippingCoOpen
                    ? "border-[#370080] shadow-[0_0_0_3px_rgba(55,0,128,0.08)]"
                    : "border-gray-200 hover:border-[#370080]/40"
                }`}
              >
                <span className={`text-sm ${shippingCo ? "font-semibold text-gray-800" : "text-gray-400"}`} style={F}>
                  {shippingCo || "انتخاب کنید..."}
                </span>
                <ChevronDown
                  size={15}
                  className="shrink-0 text-gray-400 transition-transform duration-300"
                  style={{ transform: shippingCoOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {/* Inline list — expands in flow so accordion grows to fit */}
              <AnimatePresence>
                {shippingCoOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden rounded-2xl border border-gray-200 shadow-md"
                    dir="rtl"
                  >
                    {shippingCompanies.map((co, i) => (
                      <button
                        key={co}
                        type="button"
                        onClick={() => { setShippingCo(co); setShippingCoOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm text-right bg-white transition-colors duration-150
                          ${shippingCo === co ? "bg-purple-50 text-[#370080] font-bold" : "text-gray-700 hover:bg-gray-50"}
                          ${i < shippingCompanies.length - 1 ? "border-b border-gray-100" : ""}`}
                        style={F}
                      >
                        {co}
                        {shippingCo === co && (
                          <div className="w-4 h-4 rounded-full bg-[#370080] flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <AnimatePresence>
            {shippingMethod === "fori-shahrestan" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-1.5 pt-1" dir="rtl">
                  <label className="text-xs font-bold text-gray-500 pr-1" style={F}>توضیحات</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="توضیحات تکمیلی خود را وارد کنید..."
                    rows={3}
                    dir="rtl"
                    className="w-full resize-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] leading-relaxed"
                    style={F}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-start pt-1">
            <button
              type="button"
              onClick={() => { if (!shippingMethod) { setShowShippingAlert(true); return; } setMaxUnlocked(m => Math.max(m, 3)); setOpenBox(3); }}
              className="px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-colors"
              style={{ backgroundColor: "#370080", ...F }}
            >
              مرحله بعد
            </button>
          </div>
        </div>
      ) : isTehranAlborz ? (
        <div className="flex flex-col gap-3 px-0 py-0 sm:px-[45px]" dir="rtl">
          {[
            { key: "3pl",     label: "ارسال با 3PL",          sub: "ارسال سریع توسط شرکت‌های لجستیک" },
            { key: "company", label: "ارسال توسط شرکت",       sub: "ارسال توسط شرکت" },
            { key: "express", label: "ارسال فوری",             sub: "ارسال توسط اسنپ" },
          ].map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setShippingMethod(opt.key)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border transition-colors text-right ${
                shippingMethod === opt.key
                  ? "border-[#370080] bg-purple-50"
                  : "border-gray-200 bg-white hover:border-[#370080]/40"
              }`}
              dir="rtl"
            >
              <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                shippingMethod === opt.key ? "border-[#370080] bg-[#370080]" : "border-gray-300 bg-white"
              }`}>
                {shippingMethod === opt.key && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
              <div className="flex flex-col gap-0.5 ml-[30px]">
                <span className="text-sm font-bold text-gray-800" style={F}>{{ "3pl": "تحویل در محل", "company": "express", "express": "فوری" }[opt.key as string] ?? opt.label}</span>
                {opt.sub && (
                  <span className="text-xs text-gray-400" style={F}>{opt.sub}</span>
                )}
              </div>
            </button>
          ))}
          <div className="flex justify-start pt-1">
            <button
              type="button"
              onClick={() => { if (!shippingMethod) { setShowShippingAlert(true); return; } setMaxUnlocked(m => Math.max(m, 3)); setOpenBox(3); }}
              className="px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-colors"
              style={{ backgroundColor: "#370080", ...F }}
            >
              مرحله بعد
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 cursor-pointer" style={F}>
            <div className="w-4 h-4 rounded-full border-2 border-[#3d1a6e] flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#3d1a6e]" />
            </div>
            <span className="text-sm text-gray-700">شهرستان</span>
          </label>
          <div className="relative">
            <select
              value={shippingCo}
              onChange={(e) => setShippingCo(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-right outline-none focus:border-[#3d1a6e] transition-colors cursor-pointer text-gray-500"
              style={F}
            >
              <option value="" disabled>انتخاب موسسه حمل</option>
              {shippingCompanies.map(co => <option key={co} value={co}>{co}</option>)}
            </select>
            <ChevronDown size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      ),
    },
    {
      num: 3,
      title: "زمان تحویل",
      sub: "انتخاب بازه زمانی تحویل",
      content: (() => {
        const slots = [
          { day: "یکشنبه",   date: "۱۴۰۵/۰۳/۲۳", time: "۰۹:۰۰ تا ۱۵:۰۰" },
          { day: "دوشنبه",   date: "۱۴۰۵/۰۳/۲۴", time: "۰۹:۰۰ تا ۱۵:۰۰" },
          { day: "سه‌شنبه",  date: "۱۴۰۵/۰۳/۲۵", time: "۰۹:۰۰ تا ۱۵:۰۰" },
          { day: "چهارشنبه", date: "۱۴۰۵/۰۳/۲۶", time: "۰۹:۰۰ تا ۱۵:۰۰" },
          { day: "پنجشنبه",  date: "۱۴۰۵/۰۳/۲۷", time: "۰۹:۰۰ تا ۱۵:۰۰" },
          { day: "جمعه",     date: "۱۴۰۵/۰۳/۲۸", time: "۰۹:۰۰ تا ۱۵:۰۰" },
        ];
        if (shippingMethod === "express") {
          return (
            <div className="px-0 py-0 sm:px-[45px]" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border-2 border-[#370080] bg-purple-50"
                style={{ width: 106 }}
              >
                <div className="w-4 h-4 rounded-md border-2 border-[#370080] bg-[#370080] flex items-center justify-center">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="font-black text-sm text-[#370080] py-[10px]" style={F}>شنبه</span>
                <span className="text-xs text-center text-[#370080]/80" style={F}>۱۴۰۵/۰۴/۱۱</span>
                <span className="text-xs text-center text-[#370080]" style={F}>۰۸:۰۰ تا ۱۴:۰۰</span>
              </motion.div>
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {!slotsLoaded ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center py-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-[3px]"
                    style={{ borderColor: "rgba(55,0,128,0.15)", borderTopColor: "#370080" }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="slots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="px-0 sm:px-[45px]"
                  dir="rtl"
                >
                  <div className="flex flex-col gap-3">
                    {/* Scrollable track */}
                    <div
                      ref={sliderRef}
                      className="flex overflow-x-auto gap-[12px]"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollBehavior: "smooth" }}
                    >
                      {slots.map((slot, i) => {
                        const active = selectedSlot === i;
                        return (
                          <motion.button
                            key={i}
                            type="button"
                            initial={{ x: 36, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: i * 0.1 }}
                            onClick={() => setSelectedSlot(i)}
                            className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border-2 transition-colors ${ active ? "border-[#370080] bg-purple-50" : "border-gray-200 bg-white hover:border-[#370080]/40" } mx-[4px] my-[0px]`}
                            style={{ minWidth: 90 }}
                          >
                            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${active ? "border-[#370080] bg-[#370080]" : "border-[#370080] bg-white"}`}>
                              {active && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <span className={`font-black text-sm ${active ? "text-[#370080]" : "text-gray-700"} px-[0px] py-[10px]`} style={F}>{slot.day}</span>
                            <span className={`text-xs text-center ${active ? "text-[#370080]/80" : "text-gray-400"}`} style={F}>{slot.date}</span>
                            <span className={`text-xs text-center ${active ? "text-[#370080]" : "text-gray-500"} text-[#99a1af]`} style={F}>{slot.time}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    {/* Prev / Next buttons — bottom-left */}
                    <div className="flex items-center gap-2 justify-start">
                      <button
                        type="button"
                        onClick={() => sliderRef.current?.scrollBy({ left: -220, behavior: "smooth" })}
                        className="w-8 h-8 rounded-full border-0 flex items-center justify-center transition-colors"
                        style={{ backgroundColor: "#CA165C", boxShadow: "0 0 10px 2px rgba(202,22,92,0.18)" }}
                      >
                        <ChevronDown size={14} color="white" style={{ transform: "rotate(-90deg)" }} />
                      </button>
                      <button
                        type="button"
                        onClick={() => sliderRef.current?.scrollBy({ left: 220, behavior: "smooth" })}
                        className="w-8 h-8 rounded-full border-0 flex items-center justify-center transition-colors"
                        style={{ backgroundColor: "#CA165C", boxShadow: "0 0 10px 2px rgba(202,22,92,0.18)" }}
                      >
                        <ChevronDown size={14} color="white" style={{ transform: "rotate(90deg)" }} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })()
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>


      {/* ── Step validation notification ── */}
      <AnimatePresence>
        {stepNotif && (
          <motion.div
            initial={{ opacity: 0, y: -48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -48 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
            dir="rtl"
          >
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl"
              style={{ backgroundColor: "#370080", maxWidth: 480, width: "100%" }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <span className="flex-1 text-sm font-bold text-white" style={F}>{stepNotif}</span>
              <button type="button" onClick={() => setStepNotif(null)} className="shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <X size={12} style={{ color: "white" }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page header ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center justify-start gap-3">
          <Store size={32} style={{ color: "#370080", opacity: 0.85 }} strokeWidth={1.6} />
          <h1 className="text-2xl font-black text-gray-900" style={F}>اطلاعات ارسال</h1>
        </div>
        <div className="flex items-center gap-1.5 justify-start mt-2" style={F}>
          <span className="text-xs text-gray-400">خانه</span>
          <span className="text-gray-300 select-none">|</span>
          <span className="text-xs text-gray-400">سبد خرید</span>
          <span className="text-gray-300 select-none">|</span>
          <span className="text-xs text-gray-400">اطلاعات ارسال</span>
        </div>

        {/* 3PL countdown timer banner */}
        <AnimatePresence>
          {showTimer && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="mt-4 rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #CA165C 0%, #e8357a 100%)" }}
              dir="rtl"
            >
              <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                {/* Label */}
                <div className="flex min-w-0 items-center gap-2.5">
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

                {/* Timer digits */}
                <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
                  <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-white sm:h-10 sm:w-14" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <span className="text-lg font-black leading-none tabular-nums sm:text-xl" style={{ color: timerUrgent ? "#ef4444" : "#CA165C", ...F }}>{timerMins}</span>
                  </div>
                  <span className="text-lg font-black text-white sm:text-xl" style={F}>:</span>
                  <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-white sm:h-10 sm:w-14" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <span className="text-lg font-black leading-none tabular-nums sm:text-xl" style={{ color: timerUrgent ? "#ef4444" : "#CA165C", ...F }}>{timerSecs}</span>
                  </div>
                </div>
              </div>


            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto px-3 pb-8 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ══ Form column ══ */}
          <div className="order-2 flex w-full min-w-0 flex-1 flex-col gap-4 lg:order-1">

            {/* Timeline */}
            <div className="rounded-2xl border border-gray-100 bg-white px-3 py-4 shadow-sm sm:px-8 sm:py-5">
              <div className="flex items-center justify-center" dir="rtl">
                {[
                  { num: 1, label: "انتخاب آدرس" },
                  { num: 2, label: "انتخاب نحوه ارسال" },
                  { num: 3, label: "زمان تحویل" },
                ].map((step, idx, arr) => {
                  const done = step.num < openBox && maxUnlocked >= step.num;
                  const active = step.num === openBox;
                  return (
                    <div key={step.num} className={`flex items-start ${idx < arr.length - 1 ? "flex-1" : ""}`}>
                      <div className="flex w-[72px] flex-shrink-0 flex-col items-center gap-2 sm:w-[88px]">
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          backgroundColor: active ? "#370080" : done ? "#370080" : "#f3f4f6",
                          border: done && !active ? "2px solid #370080" : "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: 14, ...F,
                          color: active || done ? "#fff" : "#9ca3af",
                        }}>
                          {done && !active
                            ? <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : step.num}
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: active ? 700 : 500,
                          color: active ? "#370080" : done ? "#370080" : "#9ca3af",
                          whiteSpace: "nowrap", ...F,
                        }}>
                          {step.label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div
                          className="mx-1 mt-[19px] h-0.5 min-w-0 flex-1 sm:mx-2"
                          style={{ backgroundColor: maxUnlocked > step.num ? "#370080" : "#e5e7eb" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accordion boxes */}
            {accordions.map(box => {
              const locked = box.num > maxUnlocked;
              const isOpen = openBox === box.num;
              const editable = !locked && !isOpen && box.num < openBox && maxUnlocked === 2;
              return (
              <div key={box.num} className={`rounded-2xl overflow-hidden transition-all duration-200 ${locked ? "border border-gray-200 bg-gray-100" : "border border-gray-200 bg-white"}`}>
                {/* Header */}
                <div
                  onClick={() => editable && setOpenBox(box.num)}
                  className={`flex w-full items-center gap-3 px-3 py-3.5 text-right transition-colors sm:gap-4 sm:px-5 sm:py-4 ${locked ? "cursor-not-allowed" : editable ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}`}
                  dir="rtl"
                >
                  {/* Number badge */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    backgroundColor: locked ? "#e5e7eb" : isOpen ? "#370080" : "#f3f4f6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontWeight: 800, fontSize: 14,
                    color: locked ? "#9ca3af" : isOpen ? "#fff" : "#9ca3af",
                    transition: "all 0.2s", ...F,
                  }}>
                    {locked ? <Lock size={14} style={{ color: "#9ca3af" }} /> : box.num}
                  </div>
                  {/* Title + subtitle */}
                  <div className="flex-1 text-right">
                    <p className={`font-bold ${locked ? "text-gray-500" : "text-gray-800"} text-[15px]`} style={F}>{box.num === 3 ? (shippingMethod === "3pl" || shippingMethod === "express" ? "زمان تحویل" : ["barbari","fori-shahrestan"].includes(shippingMethod) ? "زمان ارسال" : box.title) : box.title}</p>
                    <p className={`mt-0.5 ${locked ? "text-gray-400" : "text-gray-400"} text-[13px]`} style={F}>{locked ? "ابتدا مراحل قبل را تکمیل کنید" : box.num === 3 ? (shippingMethod === "3pl" || shippingMethod === "express" ? "مشاهده زمان تحویل" : ["barbari","fori-shahrestan"].includes(shippingMethod) ? "مشاهده زمان ارسال" : box.sub) : box.sub}</p>
                  </div>
                  {/* Chevron or lock */}
                  {!locked && (
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-colors ${editable ? "text-[#370080]" : "text-gray-400"}`}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                      }}
                    />
                  )}
                </div>

                {/* Animated content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className={`px-3 pt-1 sm:px-5 ${box.num === 1 ? "pb-8 sm:pb-10" : "pb-5"}`} dir="rtl">
                        {box.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );})}

            {/* Back to shopping */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95 ml-auto border-2"
                style={{ backgroundColor: "transparent", borderColor: "#CA165C", color: "#CA165C", ...F }}
                dir="rtl"
              >بازگشت به سبد خرید<ChevronDown size={16} style={{ transform: "rotate(-90deg)" }} /></button>
            </div>
          </div>

          {/* ══ Summary column ══ */}
          <div className="order-1 w-full min-w-0 shrink-0 overflow-hidden rounded-2xl border border-gray-200 lg:order-2 lg:w-[360px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <span className="text-gray-700 font-bold text-[14px]" style={F}>سبد خرید</span>
              
            </div>
            <div className="divide-y divide-gray-100">
              {cartItems.map(item => {
                const isChecked = !!customOrders[item.id];
                const uidVal = uids[item.id] ?? "";
                return (
                  <div key={item.id} className="flex flex-col px-4 py-3 gap-2" dir="rtl">
                    {/* Product row */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        <ImageWithFallback src={roll2} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 text-xs text-right text-[#4a5565]" style={F}>تکسچر ۲۰۲۰۳۰</span>
                      <span className="text-xs text-gray-600 shrink-0 whitespace-nowrap" style={F}>۱٬۷۵۰٬۰۰۰ تومان</span>
                    </div>

                    {/* Custom order checkbox */}
                    <button
                      type="button"
                      onClick={() => setCustomOrders(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="flex items-center gap-2 self-start"
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-colors shrink-0 ${isChecked ? "bg-[#370080] border-[#370080]" : "border-gray-300 bg-white"}`}>
                        {isChecked && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-600" style={F}>کسری کار</span>
                    </button>

                    {/* UID input */}
                    <AnimatePresence>
                      {isChecked && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-1 pt-1">
                            <input
                              type="text"
                              value={uidVal}
                              onChange={e => setUids(prev => ({ ...prev, [item.id]: e.target.value.slice(0, 16) }))}
                              placeholder="UID — 0000000000000000"
                              dir="ltr"
                              maxLength={16}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white tracking-widest"
                              style={F}
                            />
                            <span className="text-xs text-gray-400 pr-1 text-left" style={F}>رقم {uidVal.length}/۱۶</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 px-4 pt-4 pb-3 flex flex-col gap-3" dir="rtl">
              {/* مبلغ سبد خرید */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-[14px]" style={F}>مبلغ سبد خرید:</span>
                <span className="text-sm font-black text-gray-900" style={F}>۳٬۵۰۰٬۰۰۰ تومان</span>
              </div>

              {/* مقدار سود */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-[13px]" style={F}>مقدار سود شما از خرید:</span>
                <span className="text-sm font-bold text-[#000000]" style={F}>
                  {discount > 0 ? `${fmt(discount)} تومان` : "۰ تومان"}
                </span>
              </div>

              {/* کد تخفیف */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!coupon.trim()) { setCouponError(true); setCouponApplied(false); return; }
                      if (coupon.trim().toUpperCase() === "DECOR10") {
                        const d = Math.round(subtotal * 0.1);
                        setDiscount(d); setCouponApplied(true); setCouponError(false);
                      } else {
                        setDiscount(0); setCouponApplied(false); setCouponError(true);
                      }
                    }}
                    className="shrink-0 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-colors"
                    style={{ backgroundColor: "#4141D9", ...F }}
                  >
                    اعمال
                  </button>
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponError(false); setCouponApplied(false); }}
                    placeholder="کد تخفیف"
                    dir="ltr"
                    className={`min-w-0 flex-1 border rounded-xl py-2.5 text-sm text-gray-700 placeholder-gray-300 outline-none transition-all bg-white text-right ${couponError ? "border-[#CA165C] focus:border-[#CA165C] focus:shadow-[0_0_0_3px_rgba(202,22,92,0.12)]" : couponApplied ? "border-green-400 focus:border-green-400" : "border-gray-200 focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)]"} pl-[0px] pr-[12px] py-[10px]`}
                    style={F}
                  />
                </div>
                {couponError && (
                  <span className="text-xs pr-1 text-[#ca165c] text-left" style={F}>کد تخفیف نامعتبر است</span>
                )}
                {couponApplied && (
                  <span className="text-xs text-green-500 pr-1" style={F}>کد تخفیف با موفقیت اعمال شد</span>
                )}
                {/* کدهای تخفیف شخصی */}
                <div className="relative mt-1" dir="rtl">
                  <button
                    type="button"
                    onClick={() => setCouponDropOpen(o => !o)}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                    style={F}
                  >
                    <span className="mx-[0px] my-[5px] text-[#6a7282] font-normal text-[13px]" style={F}>کدهای تخفیف شخصی من</span>
                    <ChevronDown size={13} className="text-gray-400 transition-transform duration-200" style={{ transform: couponDropOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                  <AnimatePresence>
                    {couponDropOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden mt-1 bg-white border border-gray-100 rounded-2xl shadow-lg"
                        dir="rtl"
                      >
                        {[
                          { code: "DECOR10", label: "۱۰٪ تخفیف ویژه مشتریان وفادار", expiry: "۱۴۰۳/۱۲/۲۹" },
                          { code: "WELCOME5", label: "۵٪ تخفیف خوش‌آمدگویی", expiry: "۱۴۰۳/۱۰/۳۰" },
                          { code: "DECOR20", label: "۲۰٪ تخفیف جشنواره پاییز", expiry: "۱۴۰۳/۰۹/۱۵" },
                        ].map(item => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => {
                              setCoupon(item.code);
                              setCouponDropOpen(false);
                              setCouponError(false);
                              setCouponApplied(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <span className="text-xs text-gray-400" style={F}>{item.expiry}</span>
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-xs font-bold text-[#370080] tracking-wider" style={F}>{item.code}</span>
                              <span className="text-xs text-gray-500" style={F}>{item.label}</span>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* جمع کل */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500 font-medium" style={F}>جمع کل:</span>
                <span className="text-base font-black text-gray-900" style={F}>۳٬۵۰۰٬۰۰۰ تومان</span>
              </div>
            </div>
            <div className="px-4 pb-4">
              <button
                onClick={() => {
                  if (maxUnlocked < 2 || openBox === 1) {
                    showStepNotif("ابتدا آدرس انتخاب‌شده را تأیید کنید");
                    setOpenBox(1); return;
                  }
                  if (maxUnlocked < 3) {
                    showStepNotif(!shippingMethod ? "ابتدا نحوه ارسال را انتخاب کنید" : "برای تأیید نحوه ارسال دکمه مرحله بعد را بزنید");
                    setOpenBox(2); return;
                  }
                  if (selectedSlot === null && shippingMethod !== "express") {
                    showStepNotif("ابتدا زمان تحویل را انتخاب کنید");
                    setOpenBox(3); return;
                  }
                  if (shippingMethod === "3pl" && selectedSlot === 4) {
                    setShowTimerExpired(true);
                    return;
                  }
                  if (shippingMethod === "3pl" && selectedSlot === 5) {
                    navigate("/order-confirm", { state: { timerSec } });
                    return;
                  }
                  navigate("/order-confirm");
                }}
                className="w-full py-3.5 text-white font-black text-sm rounded-xl transition-colors"
                style={{ backgroundColor: "#370080", ...F }}
              >
                ثبت سفارش
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Address required modal ── */}
      <AnimatePresence>
        {showAddrAlert && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowAddrAlert(false)}
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
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mx-auto">
                  <MapPin size={26} style={{ color: "#370080" }} strokeWidth={1.8} />
                </div>
                <div className="text-center flex flex-col gap-1.5">
                  <p className="text-base font-black text-gray-800" style={F}>آدرس انتخاب نشده</p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={F}>برای ادامه، ابتدا آدرس تحویل بار را انتخاب کنید.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddrAlert(false)}
                  className="w-full py-3 text-sm font-bold text-white rounded-xl transition-colors"
                  style={{ backgroundColor: "#370080", ...F }}
                >
                  باشه، انتخاب می‌کنم
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Shipping method required modal ── */}
      <AnimatePresence>
        {showShippingAlert && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowShippingAlert(false)}
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
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mx-auto">
                  <Store size={26} style={{ color: "#370080" }} strokeWidth={1.8} />
                </div>
                <div className="text-center flex flex-col gap-1.5">
                  <p className="text-base font-black text-gray-800" style={F}>نحوه ارسال انتخاب نشده</p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={F}>برای ادامه، ابتدا روش ارسال مورد نظر خود را انتخاب کنید.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShippingAlert(false)}
                  className="w-full py-3 text-sm font-bold text-white rounded-xl transition-colors"
                  style={{ backgroundColor: "#370080", ...F }}
                >
                  باشه، انتخاب می‌کنم
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Timer expired modal ── */}
      <AnimatePresence>
        {showTimerExpired && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/40 z-40"
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
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto" style={{ backgroundColor: "rgba(202,22,92,0.1)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#CA165C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                {/* Text */}
                <div className="text-center flex flex-col gap-2">
                  <p className="text-base font-black text-gray-800" style={F}>زمان رزرو سفارش از نوع 3PL به پایان رسید</p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={F}>لطفاً مجدد نحوه ارسال را انتخاب کنید.</p>
                </div>
                {/* Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowTimerExpired(false);
                    setTimerSec(null);
                    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
                    setShippingMethod("");
                    setOpenBox(2);
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

      {/* Location confirm panel — after "ثبت موقعیت مکانی" */}
      <AnimatePresence>
        {showLocationPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowLocationPanel(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
              dir="rtl"
            >
              <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "96vh", ...F }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
                  <p className="text-base font-black text-gray-800" style={F}>افزودن آدرس جدید</p>
                  <button
                    type="button"
                    onClick={() => setShowLocationPanel(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-5 flex flex-col gap-4 pb-4">
                  {/* Mini map with "ویرایش موقعیت" button */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: 160 }}>
                    <MapContainer center={mapPos} zoom={14} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false} zoomControl={false} dragging={false} doubleClickZoom={false} attributionControl={false}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={mapPos} />
                    </MapContainer>
                    {/* Overlay edit button */}
                    <div className="absolute inset-0 pointer-events-none z-[1000] flex items-start justify-start p-3">
                      <button
                        type="button"
                        className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg"
                        style={{ backgroundColor: "#CA165C", ...F }}
                        onClick={() => { setShowLocationPanel(false); setShowMapModal(true); }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        ویرایش موقعیت
                      </button>
                    </div>
                  </div>

                  {/* Reverse-geocoded address display */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs" style={{ color: "#99A1AF", ...F }}>آدرس براساس موقعیت مکانی انتخاب شده</p>
                    <div
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 leading-relaxed text-right"
                      dir="rtl"
                      style={F}
                    >
                      تهران، میدان انقلاب، خیابان هشتم، فرعی دوم
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed" style={F}>
                      اگر آدرس نادرست است، می‌توانید از ثبت دستی آدرس استفاده کنید.
                    </p>
                    <button
                      type="button"
                      className="text-left text-sm font-bold flex items-center gap-0.5 mr-auto"
                      style={{ color: "#CA165C", ...F }}
                      onClick={() => { setShowLocationPanel(false); setIsManualMode(true); setShowNewAddrForm(true); }}
                    >
                      ثبت دستی آدرس
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(180deg)" }}>
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </div>

                  {/* پلاک + واحد */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-600" style={F}>پلاک <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={newAddrPlaque}
                        onChange={e => { setNewAddrPlaque(e.target.value); setLocationPanelErrors(p => ({ ...p, plaque: undefined })); }}
                        dir="rtl"
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none transition-all bg-white ${locationPanelErrors.plaque ? "border-[#CA165C] focus:border-[#CA165C] shadow-[0_0_0_3px_rgba(202,22,92,0.12)]" : "border-gray-200 focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)]"}`}
                        style={F}
                      />
                      {locationPanelErrors.plaque && (
                        <p className="text-xs mt-0.5" style={{ color: "#CA165C", ...F }}>{locationPanelErrors.plaque}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-600" style={F}>واحد</label>
                      <input
                        type="text"
                        value={newAddrUnit}
                        onChange={e => setNewAddrUnit(e.target.value)}
                        dir="rtl"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white"
                        style={F}
                      />
                    </div>
                  </div>

                  {/* کدپستی */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600" style={F}>کدپستی <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newAddrPostalCode}
                      onChange={e => { setNewAddrPostalCode(e.target.value); setLocationPanelErrors(p => ({ ...p, postal: undefined })); }}
                      placeholder="باید ۱۰ رقمی باشد"
                      dir="rtl"
                      maxLength={10}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all bg-white ${locationPanelErrors.postal ? "border-[#CA165C] focus:border-[#CA165C] shadow-[0_0_0_3px_rgba(202,22,92,0.12)]" : "border-gray-200 focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)]"}`}
                      style={F}
                    />
                    {locationPanelErrors.postal && (
                      <p className="text-xs mt-0.5" style={{ color: "#CA165C", ...F }}>{locationPanelErrors.postal}</p>
                    )}
                  </div>
                </div>

                {/* Footer button */}
                <div className="px-5 pb-6 pt-3 shrink-0 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      const errors: { plaque?: string; postal?: string } = {};
                      if (!newAddrPlaque.trim()) errors.plaque = "پلاک را وارد کنید.";
                      if (!newAddrPostalCode.trim()) errors.postal = "اینجا را خالی نگذارید";
                      else if (newAddrPostalCode.length < 10) errors.postal = "کدپستی باید ۱۰ رقم باشد.";
                      setLocationPanelErrors(errors);
                      if (Object.keys(errors).length === 0) {
                        setShowLocationPanel(false);
                        setShowAddrConfirmPanel(true);
                      }
                    }}
                    className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-colors"
                    style={{ backgroundColor: "#CA165C", ...F }}
                  >
                    تایید و ادامه
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Address confirmation panel */}
      <AnimatePresence>
        {showAddrConfirmPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddrConfirmPanel(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
              dir="rtl"
            >
              <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "96vh", ...F }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
                  <p className="text-base font-black text-gray-800" style={F}>تایید اطلاعات آدرس</p>
                  <button type="button" onClick={() => setShowAddrConfirmPanel(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 px-5 flex flex-col gap-4 pb-4">
                  {/* Mini map */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: 160 }}>
                    <MapContainer center={mapPos} zoom={14} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false} zoomControl={false} dragging={false} doubleClickZoom={false} attributionControl={false}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={mapPos} />
                    </MapContainer>
                    <div className="absolute inset-0 pointer-events-none z-[1000] flex items-center justify-center pb-7">
                      <div className="px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg" style={{ backgroundColor: "#CA165C", ...F }}>
                        موقعیت تحویل سفارش
                      </div>
                    </div>
                  </div>

                  {/* Readonly address row */}
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50" dir="rtl">
                    <MapPin size={16} style={{ color: "#364153", flexShrink: 0 }} />
                    <span className="text-sm text-gray-700 leading-relaxed" style={F}>
                      {isManualMode
                        ? [newAddrCity, newAddrMainStreet, newAddrSideStreet, newAddrAlley, newAddrPlaque ? `پلاک ${newAddrPlaque}` : "", newAddrUnit ? `واحد ${newAddrUnit}` : ""].filter(Boolean).join("، ") || "آدرس وارد نشده"
                        : `تهران، میدان انقلاب، خیابان هشتم، فرعی دوم${newAddrPlaque ? `، پلاک ${newAddrPlaque}` : ""}${newAddrUnit ? `، واحد ${newAddrUnit}` : ""}`}
                    </span>
                  </div>

                  {/* نام آدرس */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700" style={F}>نام آدرس <span style={{ color: "#CA165C" }}>*</span></label>
                    <input
                      type="text"
                      value={newAddrName}
                      onChange={e => setNewAddrName(e.target.value)}
                      placeholder="مثال: فروشگاه کل یخ"
                      dir="rtl"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white"
                      style={F}
                    />
                  </div>

                  {/* تحویل به */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-gray-700" style={F}>سفارش‌های این آدرس را به چه کسی تحویل می‌گیرد؟</p>
                    <div className="flex items-center gap-6 mx-[0px] my-[15px]" dir="rtl">
                      {([{ val: "self", label: "تحویل به خودم" }, { val: "other", label: "تحویل به شخص دیگر" }] as const).map(({ val, label }) => (
                        <button key={val} type="button" onClick={() => setAddrRecipient(val)}
                          className="flex items-center gap-2" style={F}>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${addrRecipient === val ? "border-[#CA165C] bg-[#CA165C]" : "border-gray-300 bg-white"}`}>
                            {addrRecipient === val && (
                              <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                          </div>
                          <span className="text-sm" style={{ color: "#364153", ...F }}>{label}</span>
                        </button>
                      ))}
                    </div>

                    {/* فیلدهای شخص دیگر */}
                    <AnimatePresence>
                      {addrRecipient === "other" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs f:ont-bold" style={{ color: "#99A1AF", ...F }}>نام و نام خانوادگی</label>
                              <input type="text" value={recipientFirstName} onChange={e => setRecipientFirstName(e.target.value)}
                                placeholder="نام و نام خانوادگی" dir="rtl"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white" style={F} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold" style={{ color: "#99A1AF", ...F }}>شماره همراه:</label>
                              <div className="relative">
                                <input type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)}
                                  placeholder="09xxxxxxxxx" dir="rtl"
                                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#370080] focus:shadow-[0_0_0_3px_rgba(55,0,128,0.08)] transition-all bg-white" style={F} />
                                <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-5 pb-6 pt-3 shrink-0 border-t border-gray-100">
                  <button type="button"
                    onClick={() => setShowAddrConfirmPanel(false)}
                    className="flex-3 py-3.5 text-sm font-bold rounded-xl border-2 transition-colors"
                    style={{ borderColor: "#CA165C", color: "#CA165C", backgroundColor: "transparent", ...F }}>
                    انصراف
                  </button>
                  <button type="button"
                    onClick={() => {
                      const name = newAddrName.trim() || "آدرس جدید";
                      const detail = isManualMode
                        ? [newAddrCity, newAddrMainStreet, newAddrSideStreet, newAddrAlley, newAddrPlaque ? `پلاک ${newAddrPlaque}` : "", newAddrUnit ? `واحد ${newAddrUnit}` : ""].filter(Boolean).join("، ") || "آدرس وارد نشده"
                        : `تهران، میدان انقلاب، خیابان هشتم، فرعی دوم${newAddrPlaque ? `، پلاک ${newAddrPlaque}` : ""}${newAddrUnit ? `، واحد ${newAddrUnit}` : ""}`;
                      ADDRESSES.push({ name, detail, ostan: newAddrOstan || undefined });
                      setSelectedAddr(ADDRESSES.length - 1);
                      setNewAddrPlaque(""); setNewAddrUnit(""); setNewAddrPostalCode("");
                      setNewAddrName(""); setAddrRecipient("self");
                      setRecipientFirstName(""); setRecipientLastName(""); setRecipientPhone("");
                      setLocationPanelErrors({}); setMapPos([35.6892, 51.3890]);
                      setNewAddrCity(""); setNewAddrMainStreet(""); setNewAddrSideStreet(""); setNewAddrAlley("");
                      setIsManualMode(false);
                      setShowAddrConfirmPanel(false);
                    }}
                    className="flex-4 py-3.5 text-sm font-bold text-white rounded-xl transition-colors"
                    style={{ backgroundColor: "#CA165C", ...F }}>
                    ذخیره آدرس
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Map location picker modal */}
      <AnimatePresence>
        {showMapModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMapModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
              dir="rtl"
            >
              <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "92vh", ...F }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <p className="text-base font-black text-gray-800" style={F}>انتخاب موقعیت مکانی</p>
                  <button
                    type="button"
                    onClick={() => setShowMapModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed px-5 pb-3" style={F}>
                  سفارش‌های شما به موقعیتی که انتخاب می‌کنید ارسال می‌شود. لطفاً موقعیت مکانی را دقیق انتخاب کنید تا از تأخیر در تحویل جلوگیری شود.
                </p>

                {/* Map area */}
                <div className="relative flex-1 mx-4 mb-1 rounded-xl overflow-hidden" style={{ minHeight: 300 }}>
                  {/* Search overlay */}
                  <div className="absolute top-3 right-3 left-3 z-[1000] flex items-center gap-2 bg-white rounded-xl shadow-md px-3 py-2.5 border border-gray-100">
                    <Search size={15} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={mapSearchQuery}
                      onChange={e => setMapSearchQuery(e.target.value)}
                      placeholder="جستجوی استان و شهر ..."
                      dir="rtl"
                      className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                      style={F}
                    />
                  </div>

                  {/* Pin label overlay */}
                  <div className="absolute inset-0 pointer-ev px-[0px] py-[20px]ents-none z-[999] flex items-center justify-center">
                    <div className="relative flex flex-col items-center" style={{ marginBottom: 28 }}>
                      <div
                        className="px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg mb-1"
                        style={{ backgroundColor: "#CA165C", ...F }}
                      >
                        موقعیت تحویل سفارش
                      </div>
                    </div>
                  </div>

                  <MapContainer center={mapPos} zoom={13} style={{ height: "100%", width: "100%", minHeight: 300 }} scrollWheelZoom={true} zoomControl={false}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <DraggableMarker pos={mapPos} onChange={setMapPos} />
                  </MapContainer>
                </div>

                {/* Coordinates feedback */}
                

                {/* Bottom buttons */}
                <div className="flex gap-3 px-4 pb-5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMapModal(false);
                      setIsManualMode(true);
                      setShowNewAddrForm(true);
                    }}
                    className="flex-1 py-3.5 text-sm font-bold rounded-xl border-2 transition-colors"
                    style={{ borderColor: "#CA165C", color: "#CA165C", backgroundColor: "transparent", ...F }}
                  >
                    ثبت دستی آدرس
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMapModal(false);
                      setIsManualMode(false);
                      setShowLocationPanel(true);
                    }}
                    className="flex-1 py-3.5 text-sm font-bold text-white rounded-xl transition-colors"
                    style={{ backgroundColor: "#CA165C", ...F }}
                  >
                    ثبت موقعیت مکانی
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
