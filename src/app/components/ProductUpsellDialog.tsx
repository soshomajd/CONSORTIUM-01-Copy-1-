import { useRef, useState } from "react"
import { Link } from "react-router"
import type { CartItem } from "@/app/store/cart"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { ProductCartControl } from "./ProductCartControl"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import "./ProductUpsellDialog.css"

type RelatedProduct = Omit<CartItem, "qty"> & { album: string; originalPrice: number }

export function ProductUpsellDialog({
  open,
  onOpenChange,
  products,
  onAfterClose,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: RelatedProduct[]
  onAfterClose: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const toggleExpanded = () => {
    if (expanded) listRef.current?.scrollTo({ top: 0, behavior: "instant" })
    setExpanded(previous => !previous)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        data-expanded={expanded}
        className="product-upsell-dialog flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-3xl border-gray-200 bg-white p-0 text-right sm:max-w-[720px] [&>button.absolute]:left-5 [&>button.absolute]:right-auto [&>button.absolute]:top-5 [&>button.absolute]:text-[#CA165C]"
        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        onCloseAutoFocus={event => { event.preventDefault(); setExpanded(false); onAfterClose() }}
      >
        <button type="button" onClick={toggleExpanded} aria-label={expanded ? "جمع کردن کالاهای مرتبط" : "نمایش تمام‌صفحه کالاهای مرتبط"} aria-expanded={expanded} className="product-upsell-handle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C]">
          <span aria-hidden="true" className="h-1 w-10 rounded-full bg-gray-300" />
        </button>
        <DialogHeader className="shrink-0 gap-3 px-5 pb-5 pt-9 text-right sm:px-7 sm:pt-7 sm:text-right">
          <span className="w-fit rounded-full bg-[#370080]/5 px-3 py-1 text-xs font-medium text-[#370080]">
            کالا به سبد خرید اضافه شد
          </span>
          <div className="flex items-center justify-between gap-3 pl-6">
            <DialogTitle className="text-lg font-bold leading-7 text-[#1E2939] sm:text-xl">کالاهای مرتبط</DialogTitle>
          </div>
          <DialogDescription className="-mt-2 text-sm font-light leading-6 text-[#6A7282]">
            این طرح‌ها را هم ببینید؛ شاید انتخاب بعدی شما باشند.
          </DialogDescription>
        </DialogHeader>

        <div className="product-upsell-list-shell relative min-h-0">
          <div
            ref={listRef}
            role="region"
            aria-label="فهرست کالاهای مرتبط"
            tabIndex={0}
            onScroll={event => {
              if (!expanded && event.currentTarget.scrollTop > 28 && window.matchMedia("(max-width: 639px)").matches) setExpanded(true)
            }}
            className="product-upsell-scroll max-h-[48dvh] space-y-3 overflow-y-auto overscroll-contain scroll-smooth px-5 pb-8 pt-1 [scrollbar-width:thin] motion-reduce:scroll-auto sm:max-h-[440px] sm:px-7"
          >
            {products.map(product => (
              <article key={product.id} className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-2xl border border-gray-200 bg-white p-3 sm:grid-cols-[88px_minmax(0,1fr)_184px] sm:items-center sm:gap-4 sm:p-4">
                <Link to={`/product/${product.code}`} onClick={() => onOpenChange(false)} aria-label={`مشاهده ${product.name}`} className="relative row-span-2 aspect-[4/5] self-start overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#370080] sm:row-span-1 sm:self-center">
                  <ImageWithFallback src={product.img} alt={product.name} className="absolute inset-0 h-full w-full rounded-2xl object-cover" />
                </Link>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-light leading-5 text-[#6A7282]">{product.album}</p>
                  <Link to={`/product/${product.code}`} onClick={() => onOpenChange(false)} className="block rounded-lg text-sm font-semibold leading-6 text-[#1E2939] hover:text-[#370080] focus-visible:outline-2 focus-visible:outline-[#370080]">
                    {product.name}
                  </Link>
                </div>
                <div className="col-start-2 flex w-full max-w-[184px] min-w-0 flex-col gap-2 justify-self-end sm:col-start-auto">
                  <div className="flex flex-wrap items-baseline justify-end gap-x-2 gap-y-1 text-left">
                    {product.originalPrice > product.unitPrice && <span className="text-xs font-light text-[#6A7282] line-through">{product.originalPrice.toLocaleString("fa-IR")}</span>}
                    <span className="text-sm font-semibold text-[#6A7282]">{product.unitPrice.toLocaleString("fa-IR")} <span className="text-xs font-light">تومان</span></span>
                  </div>
                  <ProductCartControl compact item={{ id: product.id, name: product.name, code: product.code, unitPrice: product.unitPrice, img: product.img }} />
                </div>
              </article>
            ))}
          </div>
          <div aria-hidden="true" className="product-upsell-edge-blur pointer-events-none absolute bottom-0 h-10" />
        </div>

        <div className="product-upsell-footer flex shrink-0 flex-col gap-4 px-5 pb-5 pt-4 sm:px-7 sm:pb-7">
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => onOpenChange(false)} className="min-h-11 rounded-xl border border-[#CA165C] bg-white px-3 py-2.5 text-sm font-semibold text-[#CA165C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C]">ادامه خرید</button>
            <Link to="/cart" onClick={() => onOpenChange(false)} className="flex min-h-11 items-center justify-center rounded-xl bg-[#CA165C] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#D5457D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA165C]">مشاهده سبد خرید</Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
