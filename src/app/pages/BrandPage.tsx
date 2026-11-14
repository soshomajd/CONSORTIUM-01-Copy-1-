import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { Header } from "@/app/components/Header";
import brandNext from "@/imports/Brand-Next.png";
import brandWallMaster from "@/imports/Brand-WallMaster.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const F = { fontFamily: "'Vazirmatn', sans-serif" };

const brands: Record<string, {
  label: string;
  logo: string;
  albums: { name: string; nameEn: string; slug: string; img: string }[];
}> = {
  "next": {
    label: "نکست",
    logo: brandNext,
    albums: [],
  },
  "wall-master": {
    label: "وال مستر",
    logo: brandWallMaster,
    albums: [],
  },
};

const sortOptions = ["محبوب‌ترین", "ارزان‌ترین", "گران‌ترین", "جدیدترین", "پربازدیدترین"];

const filterSections = [
  { key: "album",    label: "آلبوم"     },
  { key: "style",    label: "سبک"       },
  { key: "position", label: "موقعیت"   },
  { key: "color",    label: "رنگ"       },
  { key: "pattern",  label: "طرح"       },
];

export function BrandPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const brand = name ? brands[name] : null;

  const [sort, setSort] = useState("محبوب‌ترین");
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const toggleFilter = (key: string) =>
    setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));

  if (!brand) {
    return (
      <div dir="rtl" className="min-h-screen bg-white flex flex-col items-center justify-center" style={F}>
        <Header />
        <p className="text-gray-500 mt-20">برند یافت نشد</p>
        <button onClick={() => navigate("/")} className="mt-4 text-[#3d1a6e] underline text-sm" style={F}>بازگشت</button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5" style={F}>
          <button onClick={() => navigate("/")} className="hover:text-[#3d1a6e]">خانه</button>
          <span>/</span>
          <span className="text-gray-600 font-semibold">{brand.label}</span>
        </div>

        {/* Brand header */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="h-12 w-28 flex items-center">
            <ImageWithFallback src={brand.logo} alt={brand.label} className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900" style={F}>{brand.label}</h1>
            <p className="text-xs text-gray-400 mt-0.5" style={F}>{brand.albums.length} آلبوم</p>
          </div>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Right: Filters ── */}
          <div className="mt-12 w-78 shrink-0 self-stretch">
            <div className="border border-gray-200 rounded-2xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-black text-gray-800" style={F}>فیلتر ها</span>
                <SlidersHorizontal size={15} className="text-gray-500" />
              </div>

              {/* فقط موجود */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-xs text-gray-700 font-medium" style={F}>فقط موجود</span>
                <button
                  onClick={() => setOnlyAvailable(v => !v)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${onlyAvailable ? "bg-[#3d1a6e]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${onlyAvailable ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>

              {/* Filter sections */}
              {filterSections.map(sec => (
                <div key={sec.key} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => toggleFilter(sec.key)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span
                      className="text-xs font-bold text-gray-700"
                      style={F}
                    >
                      {sec.label}
                    </span>
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

          {/* ── Left: Albums grid ── */}
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
            {brand.albums.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-gray-400 text-sm" style={F}>آلبومی برای این برند ثبت نشده است</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {brand.albums.map(album => (
                  <div
                    key={album.nameEn}
                    onClick={() => navigate(`/brand/${name}/album/${album.slug}`)}
                    className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Album image */}
                    <div className="aspect-[3/4] bg-white overflow-hidden flex items-center justify-center p-4">
                      <ImageWithFallback
                        src={album.img}
                        alt={album.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="px-3 py-2.5 border-t border-gray-100">
                      <p className="text-sm font-black text-gray-900 text-right" style={F}>{album.nameEn}</p>
                      <p className="text-xs text-gray-500 text-right mt-0.5" style={F}>{album.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
