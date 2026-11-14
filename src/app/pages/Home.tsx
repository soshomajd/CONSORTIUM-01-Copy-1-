import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Clock,
  X,
  Search,
  Home,
  LayoutGrid,
  ShoppingCart,
  Zap,
  User,
  Layers,
  Droplets,
  Sofa,
  ChevronLeft,
  ChevronRight,
  Flame,
  Crown,
} from "lucide-react";
import { Header } from "@/app/components/Header";
import brandExtremeImg from "@/imports/Brand-Extreme.png";
import heroImg from "@/imports/Main_Slider.png";
import heroMobileImg from "@/imports/Main_Slider-M-01_1_.png";
import logoImg from "@/imports/LOGO01.png";
import enamadImg from "@/imports/LOGO01.png";
import styleClassic from "@/imports/Search-Style-Classic.png";
import styleKids from "@/imports/Search-Style-Kids.png";
import styleLux from "@/imports/Search-Style-Lux.png";
import styleMinimal from "@/imports/Search-Style-Minimal.png";
import styleModern from "@/imports/Search-Style-Modern.png";
import spaceBedroom from "@/imports/Search-Location-Bed_Room.png";
import spaceCorridor from "@/imports/Search-Location-Corridor.png";
import spaceDining from "@/imports/Search-Location-Dining_Room.png";
import spaceLiving from "@/imports/Search-Location-Living_Room.png";
import spaceOffice from "@/imports/Search-Location-Office.png";
import colorBlack from "@/imports/Search-Color-Black.png";
import colorBlue from "@/imports/Search-Color-Blue.png";
import colorBrown from "@/imports/Search-Color-Brown.png";
import colorGreen from "@/imports/Search-Color-Green.png";
import colorGrey from "@/imports/Search-Color-Grey.png";
import colorOrange from "@/imports/Search-Color-Orange.png";
import colorPink from "@/imports/Search-Color-Pink.png";
import colorPurple from "@/imports/Search-Color-Purple.png";
import colorRed from "@/imports/Search-Color-Red.png";
import colorWhite from "@/imports/Search-Color-White.png";
import brandExtreme from "@/imports/Brand-Extreme.png";
import brandNext from "@/imports/Brand-Next.png";
import brandWallMaster from "@/imports/Brand-WallMaster.png";
import popupImg from "@/imports/PopUp-V03-03.png";
import sliderNext from "@/imports/Main_Slider-D-03.png";
import sliderExtreme from "@/imports/Main_Slider-D-02.png";
import roll1 from "@/imports/2030e111-41ab-41d3-9f51-058659c24704.png";
import roll2 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll3 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll4 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll5 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll6 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import roll7 from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import albumComingSoon from "@/imports/Album-Coming_Soon-V01.png";
import iconAlbum from "@/imports/Qnav-Album-V02.png";
import iconStyle from "@/imports/Qnav-Style-V02.png";
import iconColor from "@/imports/Qnav-Color-V02.png";
import iconBrand from "@/imports/Qnav-Brand-V02.png";
import iconNew from "@/imports/Qnav-New-V02.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const navLinks = [
  "برند",
  "خرید محصولات",
  "مجله/بلاگ",
  "درباره ما",
  "تماس با ما",
];

const features = [
  {
    img: iconAlbum,
    alt: "آلبوم‌ها",
    title: "آلبوم‌ها",
    subtitle: "مشاهده همه",
    subtitleColor: "text-gray-400",
  },
  {
    img: iconStyle,
    alt: "سبک ها",
    title: "سبک‌ها",
    subtitle: "جستجوی طرح",
    subtitleColor: "text-gray-400",
  },
  {
    img: iconColor,
    alt: "رنگها",
    title: "رنگ‌ها",
    subtitle: "براساس رنگ",
    subtitleColor: "text-gray-400",
  },
  {
    img: iconBrand,
    alt: "برندها",
    title: "برندها",
    subtitle: "برندهای عضو",
    subtitleColor: "text-gray-400",
  },
  {
    img: iconNew,
    alt: "جدیدترین ها",
    title: "جدیدترین‌ها",
    subtitle: "محصولات جدید",
    subtitleColor: "text-gray-400",
  },
];

const collections = [
  { img: roll1, name: "کتان" },
  { img: roll2, name: "موج" },
  { img: roll3, name: "مرمر" },
  { img: roll4, name: "هندسی" },
  { img: roll5, name: "خطی" },
  { img: roll6, name: "مه" },
  { img: roll7, name: "برگ" },
];

const fontStyle = { fontFamily: "'Vazirmatn', sans-serif" };

export function HomePage() {
  const navigate = useNavigate();
  const collectionsRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  const heroSlides = [
    { desktop: sliderNext,    mobile: sliderNext,    alt: "نکست والکاورینگ" },
    { desktop: sliderExtreme, mobile: sliderExtreme, alt: "اکستریم والز" },
    { desktop: heroImg,       mobile: heroMobileImg, alt: "کنسرسیوم کاغذدیواری" },
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(s => (s + 1) % heroSlides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const scrollCollections = (dir: "right" | "left") => {
    if (!collectionsRef.current) return;
    collectionsRef.current.scrollBy({
      left: dir === "left" ? -110 : 110,
      behavior: "smooth",
    });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white pb-4 md:pb-4 pb-20"
      style={fontStyle}
    >
      {/* Announcement Bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="bg-[#2d1a6e] text-white rounded-full py-2.5 px-5 flex items-center justify-between max-w-full">
          <button className="text-white/70 hover:text-white transition-colors shrink-0">
            <X size={15} />
          </button>
          <span
            className="font-medium text-center flex-1 text-[11px]"
            style={fontStyle}
          >
            از ۳ مرداد کنسرسیوم به صورت رسمی در اختیار شما قرار
            می‌گیرد
          </span>
          <div className="w-5 shrink-0" />
        </div>
      </div>

      <Header />

      {/* Mobile search bar */}
      <div className="md:hidden px-3 py-2 border-b border-gray-100">
        <div className="flex items-center border border-gray-200 rounded-full px-4 py-2.5 gap-2 bg-white">
          <Search
            size={16}
            className="text-gray-400 shrink-0"
          />
          <input
            type="text"
            placeholder="جستجو"
            className="flex-1 text-sm placeholder-gray-400 outline-none text-right bg-transparent"
            style={fontStyle}
          />
        </div>
      </div>

      {/* Hero Slider */}
      <section className="mx-3 sm:mx-6 my-4 relative overflow-hidden rounded-2xl">
        {/* Slides */}
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`transition-opacity duration-700 ${i === heroSlide ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          >
            <ImageWithFallback
              src={slide.mobile}
              alt={slide.alt}
              className="w-full object-cover object-center sm:hidden"
            />
            <ImageWithFallback
              src={slide.desktop}
              alt={slide.alt}
              className="w-full object-cover object-center hidden sm:block"
              style={{ maxHeight: "560px", minHeight: "200px" }}
            />
          </div>
        ))}

        {/* Prev / Next arrows */}
        <button
          onClick={() => setHeroSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors z-10"
        >
          <ChevronRight size={18} className="text-white" />
        </button>
        <button
          onClick={() => setHeroSlide(s => (s + 1) % heroSlides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors z-10"
        >
          <ChevronLeft size={18} className="text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === heroSlide ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Feature Icons — mobile: 3+2 grid | desktop: horizontal row */}
      <section className="px-3 sm:px-6 pb-10">
        {/* Mobile */}
        <div className="md:hidden bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden px-2 py-8">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {features.slice(0, 3).map((f) => (
              <button
                key={f.title}
                className="flex flex-col items-center gap-1.5 py-7 px-2 rounded-xl transition-transform duration-200 hover:scale-105"
              >
                <ImageWithFallback
                  src={f.img}
                  alt={f.alt}
                  className="w-14 h-14 object-contain"
                />
                <span
                  className="text-[11px] font-bold text-gray-800 text-center"
                  style={fontStyle}
                >
                  {f.title}
                </span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 px-10">
            {features.slice(3).map((f) => (
              <button
                key={f.title}
                className="flex flex-col items-center gap-1.5 py-7 px-2 rounded-xl transition-transform duration-200 hover:scale-105"
              >
                <ImageWithFallback
                  src={f.img}
                  alt={f.alt}
                  className="w-14 h-14 object-contain"
                />
                <span
                  className="text-[11px] font-bold text-gray-800 text-center"
                  style={fontStyle}
                >
                  {f.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Desktop */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="flex items-stretch overflow-x-auto">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="flex items-stretch flex-1 min-w-[80px]"
              >
                <button className="group flex flex-col items-center gap-2 sm:gap-4 py-10 sm:py-14 px-2 sm:px-4 flex-1 transition-all duration-200">
                  <div className="group-hover:scale-110 transition-transform duration-200">
                    <ImageWithFallback
                      src={feature.img}
                      alt={feature.alt}
                      className="w-14 h-14 sm:w-28 sm:h-28 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div
                      className="font-bold text-gray-800 text-base"
                      style={fontStyle}
                    >
                      {feature.title}
                    </div>
                    <div
                      className={`text-sm mt-1 ${feature.subtitleColor}`}
                      style={fontStyle}
                    >
                      {feature.subtitle}
                    </div>
                  </div>
                </button>
                {i < features.length - 1 && (
                  <div className="w-px bg-[#1e3a5f] my-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#3d1a6e] rounded-sm" />
            <span
              className="text-xs sm:text-base font-black text-[#2d1a6e]"
              style={fontStyle}
            >
              برندهای عضو کنسرسیوم
            </span>
          </div>
          <button
            className="text-[11px] sm:text-sm text-[#e53935] font-medium hover:underline"
            style={fontStyle}
          >
            مشاهده همه برندها
          </button>
        </div>

        {/* Mobile: single row */}
        <div
          className="flex md:hidden gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {[
            {
              name: "برند ۱",
              slug: "products",
              bg: "#3d1a6e",
              Icon: Flame,
              logo: brandExtremeImg,
            },
            {
              name: "برند ۲",
              slug: "next",
              bg: "oklch(0.488 0.243 264.376)",
              Icon: Zap,
              logo: null,
            },
            {
              name: "برند ۳",
              slug: "wall-master",
              bg: "oklch(0.645 0.246 16.439)",
              Icon: Crown,
              logo: null,
            },
          ].map((b) => (
            <div
              key={b.slug}
              onClick={() => navigate(b.slug === "products" ? "/products" : `/brand/${b.slug}`)}
              className="bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col items-center justify-center py-4 px-3 gap-2 shrink-0 flex-1 min-w-0 cursor-pointer hover:shadow-md transition-shadow"
            >
              {b.logo ? (
                <ImageWithFallback src={b.logo} alt={b.name} className="w-20 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: b.bg }}>
                  <b.Icon size={18} className="text-white" />
                </div>
              )}
              <div className="text-[10px] font-bold text-gray-700 text-center" style={fontStyle}>
                {b.logo ? "اکستریم والز" : b.name}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: centered wrap */}
        <div className="hidden md:flex justify-center gap-8 flex-wrap">
          {[
            {
              name: "برند ۱",
              slug: "products",
              bg: "#3d1a6e",
              Icon: Flame,
              logo: brandExtremeImg,
            },
            {
              name: "برند ۲",
              slug: "next",
              bg: "oklch(0.488 0.243 264.376)",
              Icon: Zap,
              logo: null,
            },
            {
              name: "برند ۳",
              slug: "wall-master",
              bg: "oklch(0.645 0.246 16.439)",
              Icon: Crown,
              logo: null,
            },
          ].map((b) => (
            <div
              key={b.slug}
              onClick={() => navigate(b.slug === "products" ? "/products" : `/brand/${b.slug}`)}
              className="bg-white border border-gray-100 rounded-2xl shadow-md flex flex-col items-center justify-center py-8 px-8 gap-4 w-52 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              {b.logo ? (
                <ImageWithFallback src={b.logo} alt={b.name} className="w-36 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: b.bg }}>
                  <b.Icon size={28} className="text-white" />
                </div>
              )}
              <div className="text-sm font-bold text-gray-800 text-center" style={fontStyle}>
                {b.logo ? "اکستریم والز" : b.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Albums Carousel Section */}
      <AlbumsSection />

      {/* Styles / Color / Space Section */}
      <StylesSection />

      {/* New Collections Section */}
      <section className="px-4 sm:px-6 pb-14">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#3d1a6e] rounded-sm" />
            <span
              className="text-xs sm:text-base font-black text-[#2d1a6e]"
              style={fontStyle}
            >
              کالکشن های جدید
            </span>
          </div>
          <button
            className="text-[11px] sm:text-sm text-[#e53935] font-medium hover:underline"
            style={fontStyle}
          >
            مشاهده همه
          </button>
        </div>
        <div
          className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-8"
          style={{
            boxShadow: "0 20px 60px rgba(150,150,180,0.15)",
          }}
        >
          {/* mobile: horizontal slider with arrows */}
          <div className="relative sm:hidden">
            <button
              onClick={() => scrollCollections("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center"
            >
              <ChevronRight
                size={14}
                className="text-gray-600"
              />
            </button>
            <div
              ref={collectionsRef}
              className="flex gap-3 overflow-x-auto px-6 py-1"
              style={{
                scrollSnapType: "x mandatory",
                direction: "ltr",
                scrollbarWidth: "none",
              }}
            >
              {collections.map((item) => (
                <div
                  key={item.name}
                  className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
                  style={{ scrollSnapAlign: "start" }}
                  onClick={() =>
                    navigate(`/product/${item.name}`)
                  }
                >
                  <div
                    className="rounded-xl overflow-hidden group-hover:scale-[1.04] transition-transform duration-300"
                    style={{
                      width: "88px",
                      height: "176px",
                      boxShadow:
                        "0 6px 18px rgba(100,120,160,0.18)",
                    }}
                  >
                    <ImageWithFallback
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="text-[10px] font-bold text-gray-700 text-center"
                    style={fontStyle}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollCollections("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center"
            >
              <ChevronLeft
                size={14}
                className="text-gray-600"
              />
            </button>
          </div>

          {/* desktop: flex wrap centered */}
          <div className="hidden sm:flex flex-row gap-5 justify-center flex-wrap">
            {collections.map((item) => (
              <div
                key={item.name}
                className="shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() =>
                  navigate(`/product/${item.name}`)
                }
              >
                <div
                  className="rounded-2xl overflow-hidden group-hover:scale-[1.04] transition-transform duration-300"
                  style={{
                    width: "155px",
                    height: "310px",
                    boxShadow:
                      "0 8px 28px rgba(100,120,160,0.18)",
                  }}
                >
                  <ImageWithFallback
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="text-sm font-bold text-gray-700 text-center"
                  style={fontStyle}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Bottom Tab Bar — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex items-center justify-around py-2 px-1">
          {[
            {
              icon: Home,
              label: "خانه",
              active: true,
              action: () => navigate("/"),
            },
            {
              icon: LayoutGrid,
              label: "دسته‌بندی",
              active: false,
              action: () => {},
            },
            {
              icon: ShoppingCart,
              label: "سبد خرید",
              active: false,
              action: () => navigate("/cart"),
            },
            {
              icon: Zap,
              label: "سفارش سریع",
              active: false,
              action: () => navigate("/profile"),
            },
            {
              icon: User,
              label: "پروفایل",
              active: false,
              action: () => navigate("/profile"),
            },
          ].map(({ icon: Icon, label, active, action }) => (
            <button
              key={label}
              onClick={action}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${active ? "text-[#3d1a6e]" : "text-gray-500"}`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-medium"
                style={fontStyle}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl sm:max-w-3xl p-5 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 transition-colors flex items-center justify-center"
            >
              <X size={18} className="text-white" />
            </button>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={popupImg}
                alt="کنسرسیوم"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styleItems = [
  { img: styleClassic, label: "کلاسیک" },
  { img: styleKids, label: "کودک" },
  { img: styleLux, label: "لوکس" },
  { img: styleMinimal, label: "مینیمال" },
  { img: styleModern, label: "مدرن" },
];

const spaceItems = [
  { img: spaceBedroom, label: "اتاق خواب" },
  { img: spaceCorridor, label: "راهرو" },
  { img: spaceDining, label: "اتاق غذاخوری" },
  { img: spaceLiving, label: "نشیمن" },
  { img: spaceOffice, label: "دفتر کار" },
];

const colorItems = [
  { img: colorBlack, label: "سیاه" },
  { img: colorBlue, label: "آبی" },
  { img: colorBrown, label: "قهوه‌ای" },
  { img: colorGreen, label: "سبز" },
  { img: colorGrey, label: "خاکستری" },
  { img: colorOrange, label: "نارنجی" },
  { img: colorPink, label: "صورتی" },
  { img: colorPurple, label: "بنفش" },
  { img: colorRed, label: "قرمز" },
  { img: colorWhite, label: "سفید" },
];

const tabs = [
  { key: "style", label: "براساس سبک", icon: Layers },
  { key: "color", label: "براساس رنگ", icon: Droplets },
  { key: "space", label: "براساس فضا", icon: Sofa },
] as const;

const GRID_PAGE_SIZE = 5; // 1 row × 5 cols

function StylesSection() {
  const [active, setActive] = useState<
    "style" | "color" | "space"
  >("style");
  const [colorPage, setColorPage] = useState(0);

  const totalColorPages = Math.ceil(
    colorItems.length / GRID_PAGE_SIZE,
  );
  const visibleColors = colorItems.slice(
    colorPage * GRID_PAGE_SIZE,
    (colorPage + 1) * GRID_PAGE_SIZE,
  );

  /* shared image grid for style/space on mobile: 2-col, desktop: flex row */
  const StaticGrid = ({
    items,
  }: {
    items: { img: string; label: string }[];
  }) => {
    const isOdd = items.length % 2 === 1;
    return (
      <>
        {/* mobile: 2-col grid, last item centered if odd */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          {items.map((item, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-xl cursor-pointer group ${isOdd && i === items.length - 1 ? "col-span-2 w-1/2 mx-auto" : ""}`}
            >
              <ImageWithFallback
                src={item.img}
                alt={item.label}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        {/* desktop: flex row */}
        <div className="hidden sm:flex flex-row justify-center gap-5 flex-wrap">
          {items.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl cursor-pointer group shrink-0"
            >
              <ImageWithFallback
                src={item.img}
                alt={item.label}
                className="w-64 h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <section className="px-4 sm:px-6 pb-14">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#3d1a6e] rounded-sm" />
        <span
          className="text-xs sm:text-base font-black text-[#2d1a6e]"
          style={fontStyle}
        >
          جستجو براساس
        </span>
      </div>

      {/* Tabs — outside container on mobile, inside on desktop */}
      <div className="flex gap-2 mb-3 sm:hidden">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-full transition-all flex-1 justify-center ${
              active === key
                ? "bg-[#3d1a6e] text-white"
                : "bg-gray-50 border border-gray-200 text-gray-600"
            }`}
            style={fontStyle}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      <div
        className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6"
        style={{
          boxShadow: "0 20px 60px rgba(150,150,180,0.18)",
        }}
      >
        {/* Tabs — inside container on desktop only */}
        <div className="hidden sm:flex gap-2 mb-5 flex-wrap justify-start">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full transition-all ${
                active === key
                  ? "bg-[#3d1a6e] text-white"
                  : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-[#3d1a6e]"
              }`}
              style={fontStyle}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {active === "style" ? (
          <StaticGrid items={styleItems} />
        ) : active === "space" ? (
          <StaticGrid items={spaceItems} />
        ) : (
          /* براساس رنگ — 4-per-page slider */
          <div className="relative">
            <button
              onClick={() =>
                setColorPage((p) => Math.max(0, p - 1))
              }
              disabled={colorPage === 0}
              className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center disabled:opacity-30 hover:border-[#3d1a6e] transition-colors"
            >
              <ChevronRight
                size={16}
                className="text-gray-600"
              />
            </button>

            {/* mobile: 2-col grid, last item centered if odd */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {visibleColors.map((item, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-xl cursor-pointer group ${visibleColors.length % 2 === 1 && i === visibleColors.length - 1 ? "col-span-2 w-1/2 mx-auto" : ""}`}
                >
                  <ImageWithFallback
                    src={item.img}
                    alt={item.label}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            {/* desktop: flex row */}
            <div className="hidden sm:flex flex-row justify-center gap-5 flex-wrap px-5">
              {visibleColors.map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl cursor-pointer group shrink-0"
                >
                  <ImageWithFallback
                    src={item.img}
                    alt={item.label}
                    className="w-64 h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setColorPage((p) =>
                  Math.min(totalColorPages - 1, p + 1),
                )
              }
              disabled={colorPage === totalColorPages - 1}
              className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center disabled:opacity-30 hover:border-[#3d1a6e] transition-colors"
            >
              <ChevronLeft
                size={16}
                className="text-gray-600"
              />
            </button>

            {totalColorPages > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: totalColorPages }).map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => setColorPage(i)}
                      className={`rounded-full transition-all ${i === colorPage ? "w-5 h-2 bg-[#3d1a6e]" : "w-2 h-2 bg-gray-300"}`}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const albumColors = [
  "from-violet-500 to-purple-700",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-500",
  "from-fuchsia-500 to-purple-600",
];

function AlbumsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const CARD_W_MOBILE = 110;
  const CARD_W_DESKTOP = 200;

  const scroll = (dir: "right" | "left") => {
    if (!scrollRef.current) return;
    const w =
      window.innerWidth < 640
        ? CARD_W_MOBILE + 12
        : CARD_W_DESKTOP + 20;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -w : w,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-4 sm:px-6 pb-14">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#3d1a6e] rounded-sm" />
          <span
            className="text-xs sm:text-base font-black text-[#2d1a6e]"
            style={fontStyle}
          >
            آلبوم‌های منتخب
          </span>
        </div>
        <button
          className="text-[11px] sm:text-sm text-[#e53935] font-medium hover:underline"
          style={fontStyle}
        >
          مشاهده همه آلبوم ها
        </button>
      </div>
      <div className="relative">
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-9 sm:h-9 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-purple-50 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3 h-3 sm:w-4 sm:h-4"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="#3d1a6e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto px-8 sm:px-10 py-2 sm:justify-center"
          style={{
            scrollSnapType: "x mandatory",
            direction: "ltr",
            scrollbarWidth: "none",
          }}
        >
          {albumColors.map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[110px] sm:w-[200px] flex flex-col gap-1.5 sm:gap-2"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
                <ImageWithFallback
                  src={albumComingSoon}
                  alt={`آلبوم ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p
                className="text-center text-[11px] sm:text-sm font-bold text-gray-700"
                style={fontStyle}
              >
                آلبوم {(i + 1).toLocaleString("fa-IR")}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-9 sm:h-9 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-purple-50 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3 h-3 sm:w-4 sm:h-4"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="#3d1a6e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}