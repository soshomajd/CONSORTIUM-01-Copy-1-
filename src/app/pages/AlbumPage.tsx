import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import albumCover from "@/imports/Album-Coming_Soon-V01.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const F = { fontFamily: "'Vazirmatn', sans-serif" };

const TOTAL_CODES = 20;

const baseWallpapers = Array.from({ length: TOTAL_CODES }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");
  return { code: num, label: `کد ${num}`, thumb: null as string | null };
});

const sortOptions = ["محبوب‌ترین", "ارزان‌ترین", "گران‌ترین", "جدیدترین"];

const filterSections = [
  { key: "style",    label: "سبک"     },
  { key: "position", label: "موقعیت" },
  { key: "color",    label: "رنگ"     },
  { key: "pattern",  label: "طرح"     },
];

const brandLabels: Record<string, string> = {
  "next":          "برند ۲",
  "wall-master":   "برند ۳",
};

const albumLabels: Record<string, string> = {
  "album-1":  "آلبوم ۱",
  "album-2":  "آلبوم ۲",
  "album-3":  "آلبوم ۳",
  "album-4":  "آلبوم ۴",
  "album-5":  "آلبوم ۵",
  "album-6":  "آلبوم ۶",
  "album-7":  "آلبوم ۷",
  "album-8":  "آلبوم ۸",
  "album-9":  "آلبوم ۹",
  "album-10": "آلبوم ۱۰",
};

export function AlbumPage() {
  const { brandName, albumSlug } = useParams<{ brandName: string; albumSlug: string }>();
  const navigate = useNavigate();

  const [sort, setSort] = useState("محبوب‌ترین");
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const toggleFilter = (key: string) =>
    setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));

  const brandLabel = brandName ? (brandLabels[brandName] ?? brandName) : "";
  const albumLabel = albumSlug ? (albumLabels[albumSlug] ?? albumSlug) : "";
  const wallpapers = baseWallpapers;

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5" style={F}>
          <button onClick={() => navigate("/")} className="hover:text-[#3d1a6e]">خانه</button>
          <span>/</span>
          <button onClick={() => navigate(`/brand/${brandName}`)} className="hover:text-[#3d1a6e]">{brandLabel}</button>
          <span>/</span>
          <span className="text-gray-600 font-semibold">{albumLabel}</span>
        </div>

        {/* Album header */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-16 h-20 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm shrink-0">
            <ImageWithFallback src={albumCover} alt={albumLabel} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900" style={F}>{albumLabel}</h1>
            <p className="text-xs text-gray-400 mt-0.5" style={F}>{TOTAL_CODES} کاغذ دیواری</p>
          </div>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Filter sidebar ── */}
          <div className="w-52 shrink-0 hidden sm:block">
            <div className="border border-gray-200 rounded-2xl overflow-hidden">

              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-black text-gray-800" style={F}>فیلتر ها</span>
                <SlidersHorizontal size={15} className="text-gray-500" />
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-xs text-gray-700 font-medium" style={F}>فقط موجود</span>
                <button
                  onClick={() => setOnlyAvailable(v => !v)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${onlyAvailable ? "bg-[#3d1a6e]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${onlyAvailable ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>

              {filterSections.map(sec => (
                <div key={sec.key} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => toggleFilter(sec.key)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-gray-700" style={F}>{sec.label}</span>
                    {openFilters[sec.key]
                      ? <ChevronUp size={13} className="text-gray-400" />
                      : <ChevronDown size={13} className="text-gray-400" />}
                  </button>
                  {openFilters[sec.key] && (
                    <div className="px-4 pb-3">
                      <p className="text-[11px] text-gray-400" style={F}>موردی یافت نشد</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Products grid ── */}
          <div className="flex-1 min-w-0">

            {/* Sort bar */}
            <div className="flex items-center gap-1 mb-5 flex-wrap">
              {sortOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSort(opt)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium ${
                    sort === opt
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                  style={F}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wallpapers.map((wp) => (
                  <div
                    key={wp.code}
                    onClick={() => navigate(`/product/${wp.code}`)}
                    className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <ImageWithFallback
                        src={wp.thumb ?? albumCover}
                        alt={wp.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="px-3 py-2.5 border-t border-gray-100">
                      <p className="text-sm font-black text-gray-900 text-right" style={F}>{wp.code}</p>
                      <p className="text-xs text-gray-500 text-right mt-0.5" style={F}>{wp.label}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
