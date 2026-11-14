import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react"
import { Header } from "@/app/components/Header"
import { Checkbox } from "@/app/components/ui/checkbox"
import { FestivalProductCard } from "@/app/components/FestivalProductCard"

const PINK = "#CA165C"
const F = { fontFamily: "'Vazirmatn', sans-serif" }

function toPersianNum(n: number) {
  return n.toLocaleString("fa-IR")
}

const SORT_OPTIONS = [
  "پرفروش‌ترین",
  "جدیدترین",
  "گران‌ترین",
  "ارزان‌ترین",
  "پربازدیدترین",
  "محبوب‌ترین",
]
const FILTER_SECTIONS = [
  { key: "album", title: "آلبوم", options: ["نیچرا۱", "اتم", "کلاسیک"] },
  { key: "style", title: "سبک", options: ["مدرن", "کلاسیک", "پست‌مدرن"] },
  {
    key: "position",
    title: "موقعیت",
    options: ["پذیرایی", "اتاق خواب", "راهرو"],
  },
  { key: "color", title: "رنگ", options: ["کرم", "طوسی", "سفید"] },
  { key: "pattern", title: "طرح", options: ["گل‌دار", "ساده", "هندسی"] },
]
const filterCheckboxStyle =
  "size-5 shrink-0 rounded-md border-gray-300 bg-white shadow-none data-[state=checked]:border-[#CA165C] data-[state=checked]:bg-[#CA165C] data-[state=checked]:text-white focus-visible:ring-[#CA165C]/30"

const DISC_PRODUCTS = [
  { code: "WP-B204", basePrice: 3_100_000, discount: 45 },
  { code: "WP-A101", basePrice: 4_200_000, discount: 62 },
  { code: "WP-C317", basePrice: 5_800_000, discount: 70 },
  { code: "WP-D412", basePrice: 2_700_000, discount: 38 },
  { code: "WP-E509", basePrice: 6_300_000, discount: 56 },
  { code: "WP-F623", basePrice: 3_500_000, discount: 61 },
  { code: "WP-G718", basePrice: 4_900_000, discount: 52 },
  { code: "WP-H830", basePrice: 2_200_000, discount: 40 },
  { code: "WP-J910", basePrice: 3_800_000, discount: 35 },
  { code: "WP-K102", basePrice: 5_100_000, discount: 48 },
  { code: "WP-L203", basePrice: 2_600_000, discount: 30 },
  { code: "WP-M315", basePrice: 4_700_000, discount: 55 },
  { code: "WP-N408", basePrice: 3_300_000, discount: 42 },
  { code: "WP-P511", basePrice: 5_500_000, discount: 65 },
  { code: "WP-Q620", basePrice: 2_900_000, discount: 33 },
  { code: "WP-R714", basePrice: 6_100_000, discount: 58 },
  { code: "WP-S816", basePrice: 3_700_000, discount: 47 },
  { code: "WP-T919", basePrice: 4_400_000, discount: 60 },
  { code: "WP-U021", basePrice: 2_400_000, discount: 28 },
  { code: "WP-V124", basePrice: 5_200_000, discount: 50 },
  { code: "WP-W225", basePrice: 3_600_000, discount: 42 },
  { code: "WP-X326", basePrice: 4_800_000, discount: 55 },
  { code: "WP-Y427", basePrice: 2_750_000, discount: 35 },
  { code: "WP-Z528", basePrice: 5_900_000, discount: 48 },
  { code: "WP-AA629", basePrice: 3_250_000, discount: 40 },
  { code: "WP-AB730", basePrice: 4_550_000, discount: 52 },
]
const PAGE_SIZE = 20

export function DiscountedProductsPage() {
  return <ProductCatalogPage discounted />
}

export function ProductCatalogPage({
  discounted = false,
  sidebarContent,
}: {
  discounted?: boolean
  sidebarContent?: ReactNode
}) {
  const [sort, setSort] = useState("محبوب‌ترین")
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({})
  const [selectedFilters, setSelectedFilters] =
    useState<Record<string, string[]>>({})
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(DISC_PRODUCTS.length / PAGE_SIZE)
  const [secs, setSecs] = useState(4 * 3600 + 21 * 60 + 33)

  useEffect(() => {
    if (!discounted) return
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [discounted])

  const hh = String(Math.floor(secs / 3600)).padStart(2, "0")
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0")
  const ss2 = String(secs % 60).padStart(2, "0")

  function toggleFilter(key: string) {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function selectFilterOption(key: string, option: string, checked: boolean) {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] ?? []).filter((value) => value !== option), option]
        : (prev[key] ?? []).filter((value) => value !== option),
    }))
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>
      <Header />

      <section
        className="flex justify-center px-4 pt-10 pb-16 sm:px-6"
        dir="rtl"
        aria-label={discounted ? "فهرست کالاهای تخفیف‌دار" : "فهرست محصولات"}
      >
        <div style={{ maxWidth: 1380, width: "100%" }}>
          {/* Main layout: sidebar + grid */}
          <div className="grid items-start gap-6 lg:grid-cols-[312px_minmax(0,1fr)]">
            {/* Filter sidebar — first in DOM = right side in RTL */}
            <div className="min-w-0 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:overscroll-contain">
              <aside
                className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white"
                aria-label="فیلتر محصولات"
              >
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <span
                    className="text-base font-black text-gray-800"
                    style={F}
                  >
                    فیلترها:
                  </span>
                  <SlidersHorizontal
                    size={15}
                    className="text-gray-500"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                  <span
                    id={`discounted-only-available-label`}
                    className="text-base font-normal text-gray-500"
                    style={F}
                  >
                    فقط موجود
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={onlyAvailable}
                    aria-labelledby={`discounted-only-available-label`}
                    onClick={() => setOnlyAvailable((v) => !v)}
                    className="flex size-11 shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C]"
                  >
                    <span
                      className={`relative h-6 w-11 rounded-full transition-colors motion-reduce:transition-none ${
                        onlyAvailable ? "bg-[#CA165C]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-[inset-inline-start] motion-reduce:transition-none ${
                          onlyAvailable ? "start-0.5" : "start-[22px]"
                        }`}
                      />
                    </span>
                  </button>
                </div>

                {FILTER_SECTIONS.map((section) => {
                  const selected = selectedFilters[section.key] ?? []
                  return (
                    <div
                      key={section.key}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center px-4">
                        <button
                          type="button"
                          onClick={() => toggleFilter(section.key)}
                          id={`discounted-filter-trigger-${section.key}`}
                          aria-expanded={!!openFilters[section.key]}
                          aria-controls={`discounted-filter-${section.key}`}
                          className="flex min-h-14 min-w-0 flex-1 items-center justify-between gap-3 rounded-lg text-right transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-[#CA165C]"
                        >
                          <span
                            className="text-base font-normal text-gray-500"
                            style={F}
                          >
                            {section.title}
                          </span>
                          <ChevronDown
                            size={15}
                            className={`shrink-0 text-gray-400 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                              openFilters[section.key] ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <div
                        id={`discounted-filter-${section.key}`}
                        role="region"
                        aria-labelledby={`discounted-filter-trigger-${section.key}`}
                        aria-hidden={!openFilters[section.key]}
                        className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                          openFilters[section.key]
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="max-h-64 overflow-y-auto overscroll-contain bg-white px-12">
                            <div className="divide-y divide-gray-100">
                              {section.options.map((option) => (
                                <label
                                  key={option}
                                  className="flex min-h-11 cursor-pointer items-center justify-between gap-3 py-2 text-sm font-light text-gray-500"
                                >
                                  <span>{option}</span>
                                  <Checkbox
                                    disabled={!openFilters[section.key]}
                                    checked={selected.includes(option)}
                                    onCheckedChange={(checked) =>
                                      selectFilterOption(
                                        section.key,
                                        option,
                                        checked === true,
                                      )
                                    }
                                    className={filterCheckboxStyle}
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </aside>
              {sidebarContent}
            </div>

            {/* Product area */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                role="group"
                aria-label="ترتیب نمایش محصولات"
                className="mb-5 flex w-full items-center gap-5 overflow-x-auto rounded-xl border border-gray-200 bg-white px-4 py-3"
              >
                <span
                  className="shrink-0 text-base font-black text-gray-800"
                  style={F}
                >
                  ترتیب:
                </span>
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSort(option)}
                    aria-pressed={sort === option}
                    className={`min-h-11 shrink-0 cursor-pointer rounded-md text-base font-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C] ${
                      sort === option
                        ? "text-[#CA165C] hover:text-[#CA165C]"
                        : "text-gray-700 hover:text-black"
                    }`}
                    style={F}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-5">
                {DISC_PRODUCTS.slice(
                  (page - 1) * PAGE_SIZE,
                  page * PAGE_SIZE,
                ).map((item) => (
                  <FestivalProductCard
                    key={item.code}
                    item={item}
                    timer={discounted ? [hh, mm, ss2] : undefined}
                    showDiscount={discounted}
                    amazingTypography
                    hasIncentive={discounted}
                    fluid
                  />
                ))}
              </div>

              {/* Pagination */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: 32,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: `1px solid ${PINK}`,
                    backgroundColor: page === 1 ? "#f9fafb" : "#fff",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: page === 1 ? 0.4 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  <ChevronRight size={16} color={PINK} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border:
                          p === page
                            ? discounted
                              ? "none"
                              : `1px solid ${PINK}`
                            : "1px solid #e5e7eb",
                        backgroundColor:
                          p === page && discounted ? PINK : "#fff",
                        color: !discounted
                          ? PINK
                          : p === page
                            ? "#fff"
                            : "#374151",
                        fontSize: 14,
                        fontWeight: p === page ? 900 : 400,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        ...F,
                      }}
                    >
                      {toPersianNum(p)}
                    </button>
                  ),
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: `1px solid ${PINK}`,
                    backgroundColor: page === totalPages ? "#f9fafb" : "#fff",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: page === totalPages ? 0.4 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  <ChevronLeft size={16} color={PINK} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
