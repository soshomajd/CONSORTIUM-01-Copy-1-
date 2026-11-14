import { ProductOfferBenefits } from "./ProductOfferBenefits"
import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { addToCart } from "@/app/lib/cart"
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback"
import albumAtom from "@/imports/___.png"
const F = { fontFamily: "'Vazirmatn', sans-serif" }

export function FlashDealCard() {
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60 + 18 * 60 + 43)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60
  const formatTime = (value: number) => String(value).padStart(2, "0")

  const handleAddToCart = () => {
    addToCart(1)
    setAdded(true)
  }

  return (
    <div
      className="sticky top-20 mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6"
      style={F}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-black text-brand-pink">
          پیشنهاد شگفت‌انگیز
        </p>
        <div className="flex items-center gap-1 text-brand-pink" dir="ltr">
          <Clock size={16} aria-hidden="true" />
          <span className="text-sm font-black tabular-nums">
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <ImageWithFallback
          src={albumAtom}
          alt="آلبوم کاغذ دیواری اتم"
          className="h-44 w-36 max-w-full shrink-0 rounded-xl object-contain"
        />
        <div className="min-w-0 w-full">
          <p className="text-[15px] font-extrabold leading-6 text-gray-800">
            تكسچر(1) 202001
          </p>
        </div>
      </div>

      <div className="my-3 border-y border-gray-100 py-3">
        <ProductOfferBenefits />
      </div>

      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="rounded-md bg-brand-pink px-2 py-1 text-[13px] font-black text-white">
          ۲۰٪
        </span>
        <div className="flex flex-wrap items-center justify-end gap-2 text-left">
          <p className="text-xs font-extralight text-gray-400 line-through">
            ۹,۳۷۵,۰۰۰ تومان
          </p>
          <p className="text-[13px] font-extrabold text-gray-400">
            ۷,۵۰۰,۰۰۰ تومان
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleAddToCart}
        disabled={added}
        className="h-10 w-full rounded-xl bg-brand-pink text-xs font-black text-white hover:bg-brand-pink/90"
      >
        {added ? "به سبد خرید اضافه شد" : "افزودن به سبد خرید"}
      </Button>
    </div>
  )
}
