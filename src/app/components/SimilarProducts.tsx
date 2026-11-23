import { useReducedMotion } from "motion/react"
import { FestivalProductCard } from "./FestivalProductCard"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"

const products = [
  { code: "WP-B204", basePrice: 3_100_000, discount: 45 },
  { code: "WP-A101", basePrice: 4_200_000, discount: 62 },
  { code: "WP-C317", basePrice: 5_800_000, discount: 70 },
  { code: "WP-D412", basePrice: 2_700_000, discount: 38 },
  { code: "WP-E509", basePrice: 6_300_000, discount: 56 },
  { code: "WP-F623", basePrice: 3_500_000, discount: 61 },
  { code: "WP-G718", basePrice: 4_900_000, discount: 52 },
  { code: "WP-H830", basePrice: 2_200_000, discount: 40 },
]

const navigationStyle = "static size-11 shrink-0 translate-x-0 translate-y-0 cursor-pointer rounded-xl border-[#CA165C] bg-white text-[#CA165C] hover:bg-[#CA165C]/5 hover:text-[#CA165C] disabled:opacity-30 [&_svg]:rotate-180"

export function SimilarProducts() {
  const reduceMotion = useReducedMotion()

  return (
    <section aria-labelledby="similar-products-heading" className="catalog-card-layout min-w-0 pb-6" dir="rtl" data-similar-products>
      <Carousel
        dir="rtl"
        aria-label="کالاهای مشابه"
        opts={{ direction: "rtl", align: "start", containScroll: "trimSnaps", duration: reduceMotion ? 0 : 28 }}
        className="min-w-0"
        onKeyDownCapture={event => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
          event.preventDefault()
          event.currentTarget.querySelector<HTMLButtonElement>(event.key === "ArrowLeft" ? '[data-slot="carousel-next"]' : '[data-slot="carousel-previous"]')?.click()
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="similar-products-heading" className="text-base font-black text-gray-900 sm:text-xl">کالاهای مشابه</h2>
          <div className="flex shrink-0 items-center gap-2">
            <CarouselPrevious aria-label="کالاهای قبلی" className={navigationStyle} />
            <CarouselNext aria-label="کالاهای بعدی" className={navigationStyle} />
          </div>
        </div>
        <CarouselContent className="catalog-related-track mx-0 items-start pt-1 pb-4">
          {products.map((item, index) => (
            <CarouselItem key={item.code} className="catalog-related-slide px-0" aria-label={`کالای ${(index + 1).toLocaleString("fa-IR")} از ${products.length.toLocaleString("fa-IR")}`}>
              <FestivalProductCard
                item={item}
                showDiscount={false}
                unavailable={item.code === "WP-A101"}
                title={index < 2 ? "تکسچر ۶۱۳۰" : undefined}
                productHref={item.code === "WP-A101" ? "/product/6130" : "/product/6135"}
                showReviews={item.code !== "WP-A101"}
                hasIncentive={item.code === "WP-C317"}
                fastDelivery={item.code === "WP-D412"}
                amazingTypography
                fluid
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
