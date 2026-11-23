import { ShieldCheck } from "lucide-react"

export function ProductOfferBenefits({ compactMobile = false }: { compactMobile?: boolean }) {
  const typography = compactMobile ? "text-sm font-normal sm:text-[16px] sm:font-[500]" : "text-[16px] font-[500]"
  return (
    <div className="space-y-2" mt-4>
      <div className={`flex items-center gap-2 text-[#CA165C] ${typography}`}>
        <ShieldCheck
          size={14}
          className="shrink-0 text-brand-pink"
          aria-hidden="true"
        />
        <span>تضمین اصالت و کیفیت کالا</span>
      </div>
      <div className={`flex items-center gap-2 text-[#CA165C] ${typography}`}>
        <span
          aria-hidden="true"
          className="flex size-2.5 shrink-0 items-center justify-center rounded-full bg-brand-pink text-[8px] font-black text-white"
        >
          ✓
        </span>
        <span>ارسال سریع به سراسر ایران</span>
      </div>
    </div>
  )
}
