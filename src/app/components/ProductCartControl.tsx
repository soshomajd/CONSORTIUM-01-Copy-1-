import { useEffect, useRef, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { addToCart, getCart, setCartItemQuantity } from "@/app/store/cart"
import type { CartItem } from "@/app/store/cart"

export function ProductCartControl({ item, onAdded, compact = false }: { item: Omit<CartItem, "qty">; onAdded?: () => void; compact?: boolean }) {
  const readQuantity = () =>
    getCart().find((product) => product.id === item.id)?.qty ?? 0
  const [quantity, setQuantity] = useState(readQuantity)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const increaseButtonRef = useRef<HTMLButtonElement>(null)
  const previousQuantity = useRef(quantity)

  const handleAdd = () => {
    const firstAddition = readQuantity() === 0
    addToCart(item)
    if (firstAddition) onAdded?.()
  }

  useEffect(() => {
    const update = () =>
      setQuantity(getCart().find((product) => product.id === item.id)?.qty ?? 0)
    update()
    window.addEventListener("cartUpdate", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("cartUpdate", update)
      window.removeEventListener("storage", update)
    }
  }, [item.id])

  useEffect(() => {
    if (previousQuantity.current > 0 && quantity === 0)
      addButtonRef.current?.focus()
    if (previousQuantity.current === 0 && quantity > 0)
      increaseButtonRef.current?.focus()
    previousQuantity.current = quantity
  }, [quantity])

  return (
    <div className={compact ? "min-h-11" : "min-h-14"}>
      {quantity === 0 ? (
        <button
          ref={addButtonRef}
          type="button"
          onClick={handleAdd}
          className={`flex w-full items-center justify-center whitespace-nowrap bg-[#370080] text-white transition-colors hover:bg-[#370080]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#370080] motion-reduce:transition-none ${compact ? "min-h-11 gap-1 rounded-xl px-2 py-2 text-xs font-semibold" : "min-h-14 gap-2 rounded-2xl px-4 py-3 text-base font-bold"}`}
        >
          {!compact && <ShoppingCart size={18} aria-hidden="true" />} افزودن به سبد خرید
        </button>
      ) : (
        <div
          role="group"
          aria-label="تعداد کالا در سبد خرید"
          className={`flex items-center justify-between border border-[#370080] bg-white px-2 text-[#370080] ${compact ? "min-h-11 gap-1 rounded-xl" : "min-h-14 gap-3 rounded-2xl"}`}
        >
          <button
            ref={increaseButtonRef}
            type="button"
            aria-label="افزایش تعداد کالا"
            onClick={() => addToCart(item)}
            className={`flex shrink-0 items-center justify-center rounded-xl text-2xl font-medium transition-colors hover:bg-[#370080]/5 focus-visible:outline-2 focus-visible:outline-[#370080] motion-reduce:transition-none ${compact ? "size-9" : "size-11"}`}
          >
            +
          </button>
          <span
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="flex flex-col items-center py-1 text-center"
          >
            <span className={`${compact ? "text-base" : "text-xl"} font-bold tabular-nums`}>
              {quantity.toLocaleString("fa-IR")}
            </span>

          </span>
          <button
            type="button"
            aria-label={
              quantity === 1 ? "حذف کالا از سبد خرید" : "کاهش تعداد کالا"
            }
            onClick={() => setCartItemQuantity(item.id, readQuantity() - 1)}
            className={`flex shrink-0 items-center justify-center rounded-xl text-2xl font-medium text-[#CA165C] transition-colors hover:bg-[#CA165C]/5 focus-visible:outline-2 focus-visible:outline-[#CA165C] motion-reduce:transition-none ${compact ? "size-9" : "size-11"}`}
          >
            −
          </button>
        </div>
      )}
    </div>
  )
}
