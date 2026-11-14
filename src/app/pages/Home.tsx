import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { Link } from "react-router"
import { useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback"
import { homeAssets as assets } from "@/app/components/home/assets"
import "@/styles/home-reference.css"

type DiscoveryTab = "style" | "color" | "space"
const quickNavigation = [
  {
    image: 16,
    title: "آلبوم ها",
    description: "مشاهده آلبوم‌ها",
    target: "home-albums",
  },
  {
    image: 17,
    title: "سبک ها",
    description: "جستجوی طرح",
    target: "home-discovery",
    tab: "style",
  },
  {
    image: 18,
    title: "رنگها",
    description: "براساس رنگ",
    target: "home-discovery",
    tab: "color",
  },
  {
    image: 19,
    title: "برندها",
    description: "برندهای عضو",
    target: "home-brands",
  },
  {
    image: 20,
    title: "جدیدترین ها",
    description: "محصولات جدید",
    target: "home-new",
  },
] as const
const brands = [
  {
    image: 22,
    title: "اکستریم والز",
    description: "13 آلبوم | 1646 طرح",
    slug: "extreme-walls",
  },
  {
    image: 24,
    title: "نکست والکاورینگ",
    description: "12 آلبوم | 1440 طرح",
    slug: "next",
  },
  {
    image: 23,
    title: "وال‌مستر",
    description: "3 آلبوم | 300 طرح",
    slug: "wall-master",
  },
  {
    image: 27,
    title: "فاین دکور",
    description: "1 آلبوم | 90 طرح",
    slug: "fine-decor",
  },
]
const albumTitles = [
  "مدلی بیس",
  "پینت",
  "لورن",
  "پلوتونیوم ۲",
  "اوپالین",
  "اتم",
  "نیوارا",
  "کالکشن ۶",
  "کالکشن ۴",
  "کالکشن جدید",
  "کالکشن ۵",
  "پمپو",
  "کالکشن ۷",
  "تیتانیوم",
  "کربن ۳",
]
const discovery = {
  style: ["کلاسیک", "مدرن", "مینیمال", "لوکس", "کودک"].map((title, i) => ({
    title,
    image: 83 + i,
  })),
  color: [
    "سفید",
    "صورتی",
    "نارنجی",
    "قرمز",
    "بنفش",
    "آبی",
    "قهوه‌ای",
    "سبز",
    "طوسی",
    "مشکی",
  ].map((title, i) => ({ title, image: 73 + i })),
  space: ["اتاق خواب", "ناهارخوری", "پذیرایی", "فضای اداری", "راهرو"].map(
    (title, i) => ({ title, image: 108 + i }),
  ),
}
const discoveryTabs: {
  id: DiscoveryTab
  title: string
  image: number
}[] = [
  { id: "style", title: "انتخاب براساس سبک", image: 70 },
  { id: "color", title: "انتخاب براساس رنگ", image: 71 },
  { id: "space", title: "انتخاب براساس فضا", image: 72 },
]

export function HomePage() {
  const reduceMotion = useReducedMotion()
  const [slide, setSlide] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const [tab, setTab] = useState<DiscoveryTab>("style")
  const [albumPage, setAlbumPage] = useState(0)
  const [discoveryPage, setDiscoveryPage] = useState(0)
  const albumsRef = useRef<HTMLDivElement>(null)
  const discoveryRef = useRef<HTMLDivElement>(null)
  const pointerX = useRef<number | null>(null)
  const suppressHeroClick = useRef(false)
  useEffect(() => {
    if (reduceMotion || heroPaused) return
    const timer = window.setInterval(
      () => setSlide((value) => (value + 1) % 4),
      7000,
    )
    return () => window.clearInterval(timer)
  }, [heroPaused, reduceMotion])

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
  }
  function selectDiscovery(value: DiscoveryTab) {
    setTab(value)
    setDiscoveryPage(0)
    if (discoveryRef.current) discoveryRef.current.scrollLeft = 0
  }
  function moveTrack(ref: RefObject<HTMLDivElement | null>, direction: number) {
    ref.current?.scrollBy({
      left: direction * ref.current.clientWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  return (
    <div className="reference-home" dir="rtl">
      <main className="home-container">
        <section
          className="home-hero"
          aria-label="بنرهای کنسرسیوم"
          aria-roledescription="کاروسل"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          onFocusCapture={() => setHeroPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setHeroPaused(false)
          }}
          onPointerDown={(event) => {
            suppressHeroClick.current = false
            pointerX.current = event.clientX
          }}
          onPointerUp={(event) => {
            if (
              pointerX.current !== null &&
              Math.abs(event.clientX - pointerX.current) > 40
            ) {
              const direction = event.clientX > pointerX.current ? 3 : 1
              suppressHeroClick.current = true
              setSlide((value) => (value + direction) % 4)
            }
            pointerX.current = null
          }}
          onPointerCancel={() => {
            pointerX.current = null
          }}
          onClickCapture={(event) => {
            if (!suppressHeroClick.current) return
            event.preventDefault()
            event.stopPropagation()
            suppressHeroClick.current = false
          }}
          onDragStart={(event) => event.preventDefault()}
        >
          {[0, 1, 2, 3].map((index) => (
            <Link
              key={index}
              to="/products"
              tabIndex={slide === index ? 0 : -1}
              aria-hidden={slide !== index}
              className={`home-hero-slide ${
                slide === index ? "is-active" : ""
              }`}
            >
              <picture>
                <source
                  media="(min-width: 1024px)"
                  srcSet={assets[8 + index]}
                />
                <img
                  src={assets[12 + index]}
                  alt={
                    [
                      "کنسرسیوم؛ خانه برندهای کاغذ دیواری",
                      "کالکشن جدید مدلی بیس",
                      "آلبوم پینت",
                      "کالکشن لورن",
                    ][index]
                  }
                  fetchPriority={index === 0 ? "high" : "auto"}
                  draggable={false}
                />
              </picture>
            </Link>
          ))}
          <button
            type="button"
            className="home-hero-previous"
            aria-label="بنر قبلی"
            onClick={() => setSlide((value) => (value + 3) % 4)}
          >
            <ChevronLeft size={27} />
          </button>
          <button
            type="button"
            className="home-hero-next"
            aria-label="بنر بعدی"
            onClick={() => setSlide((value) => (value + 1) % 4)}
          >
            <ChevronRight size={27} />
          </button>
          <div className="home-dots">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                type="button"
                className={index === slide ? "is-active" : ""}
                aria-label={`نمایش بنر ${(index + 1).toLocaleString("fa-IR")}`}
                aria-pressed={index === slide}
                onClick={() => setSlide(index)}
              />
            ))}
          </div>
        </section>
        <nav
          className="home-quick-navigation home-panel"
          aria-label="دسترسی سریع محصولات"
          dir="ltr"
        >
          {quickNavigation.map((item) => (
            <button
              key={item.image}
              type="button"
              onClick={() => {
                if ("tab" in item) selectDiscovery(item.tab)
                goTo(item.target)
              }}
            >
              <img src={assets[item.image]} alt="" />
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </nav>
        <section id="home-brands" className="home-brands home-section">
          <div className="home-section-heading">
            <h2>برندهای عضو کنسرسیوم</h2>
            <Link to="/products">مشاهده همه برندها</Link>
          </div>
          <div className="home-brands-grid" dir="ltr">
            {brands.map((brand) => (
              <Link
                to={`/products?brand=${brand.slug}`}
                key={brand.slug}
                className="home-brand-card home-panel"
                dir="rtl"
              >
                <img
                  src={assets[brand.image]}
                  alt={brand.title}
                  loading="lazy"
                />
                <strong>{brand.title}</strong>
                <span>{brand.description}</span>
              </Link>
            ))}
          </div>
        </section>
        <section id="home-albums" className="home-albums home-section">
          <div className="home-section-heading">
            <h2>آلبوم‌های منتخب</h2>
          </div>
          <div className="home-album-carousel">
            <div
              ref={albumsRef}
              className="home-album-track home-scroll-track"
              dir="ltr"
              onScroll={() => {
                const el = albumsRef.current
                if (el) setAlbumPage(Math.round(el.scrollLeft / el.clientWidth))
              }}
            >
              {albumTitles.map((title, index) => (
                <Link
                  to={`/products?album=${encodeURIComponent(title)}`}
                  key={index}
                >
                  <img
                    src={assets[28 + index]}
                    alt={`آلبوم ${title}`}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="home-track-previous"
              aria-label="آلبوم‌های قبلی"
              onClick={() => moveTrack(albumsRef, -1)}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="home-track-next"
              aria-label="آلبوم‌های بعدی"
              onClick={() => moveTrack(albumsRef, 1)}
            >
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="home-dots home-track-dots">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                aria-label={`صفحه آلبوم ${(index + 1).toLocaleString("fa-IR")}`}
                className={Math.min(albumPage, 2) === index ? "is-active" : ""}
                onClick={() =>
                  albumsRef.current?.scrollTo({
                    left: index * albumsRef.current.clientWidth,
                    behavior: reduceMotion ? "auto" : "smooth",
                  })
                }
              />
            ))}
          </div>
        </section>
        <section
          id="home-discovery"
          className="home-discovery home-section"
          aria-label="انتخاب کاغذ دیواری"
        >
          <div
            className="home-discovery-tabs"
            role="tablist"
            aria-label="روش انتخاب کاغذ دیواری"
          >
            {discoveryTabs.map((item) => (
              <button
                key={item.id}
                id={`home-tab-${item.id}`}
                role="tab"
                type="button"
                aria-selected={tab === item.id}
                aria-controls={`home-panel-${item.id}`}
                onClick={() => selectDiscovery(item.id)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                    return
                  event.preventDefault()
                  const index = discoveryTabs.findIndex(
                    (value) => value.id === tab,
                  )
                  const next =
                    discoveryTabs[
                      (index + (event.key === "ArrowRight" ? 1 : 2)) % 3
                    ]
                  selectDiscovery(next.id)
                  document.getElementById(`home-tab-${next.id}`)?.focus()
                }}
                tabIndex={tab === item.id ? 0 : -1}
              >
                <img src={assets[item.image]} alt="" />
                <span>{item.title}</span>
              </button>
            ))}
          </div>
          <div
            className="home-discovery-results"
            role="tabpanel"
            id={`home-panel-${tab}`}
            aria-labelledby={`home-tab-${tab}`}
          >
            <div className="home-discovery-desktop">
              <div
                ref={discoveryRef}
                className="home-category-track home-scroll-track"
                dir="ltr"
                onScroll={() => {
                  const el = discoveryRef.current
                  if (el)
                    setDiscoveryPage(Math.round(el.scrollLeft / el.clientWidth))
                }}
              >
                {discovery[tab].map((item) => (
                  <Link
                    to={`/products?${tab}=${encodeURIComponent(item.title)}`}
                    key={item.image}
                  >
                    <img
                      src={assets[item.image]}
                      alt={item.title}
                      loading="lazy"
                    />
                  </Link>
                ))}
              </div>
              <button
                type="button"
                className="home-track-previous"
                aria-label="گزینه‌های قبلی"
                onClick={() => moveTrack(discoveryRef, -1)}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="home-track-next"
                aria-label="گزینه‌های بعدی"
                onClick={() => moveTrack(discoveryRef, 1)}
              >
                <ChevronRight size={22} />
              </button>
              <div className="home-dots home-track-dots">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`صفحه گزینه‌ها ${(index + 1).toLocaleString("fa-IR")}`}
                    className={
                      Math.min(discoveryPage, 1) === index ? "is-active" : ""
                    }
                    onClick={() =>
                      discoveryRef.current?.scrollTo({
                        left: index * discoveryRef.current.clientWidth,
                        behavior: reduceMotion ? "auto" : "smooth",
                      })
                    }
                  />
                ))}
              </div>
            </div>
            <div className="home-discovery-mobile">
              {discovery[tab].map((item) => (
                <Link
                  to={`/products?${tab}=${encodeURIComponent(item.title)}`}
                  key={item.image}
                >
                  <span className="home-category-description home-panel">
                    <strong>{item.title}</strong>
                    <span dir="ltr">400+</span>
                  </span>
                  <img
                    src={assets[item.image]}
                    alt={item.title}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section id="home-new" className="home-new home-section">
          <div className="home-section-heading">
            <h2>کالکشن های جدید</h2>
            <Link to="/products">مشاهده جدیدترین‌ها</Link>
          </div>
          <div className="home-new-panel home-panel">
            <div className="home-products-track home-scroll-track">
              {Array.from({ length: 10 }, (_, index) => (
                <Link to="/product/6135" key={index}>
                  <ImageWithFallback
                    src={assets[124 + index]}
                    alt={`مدلی بیس ${501012 - index}`}
                    loading="lazy"
                  />
                  <span>مدلی بیس {501012 - index}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
