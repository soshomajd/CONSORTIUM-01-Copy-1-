import { useId, useMemo, useState, type FormEvent } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Check,
  CheckCircle,
  MessageSquare,
  Plus,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Textarea } from "./ui/textarea"

type Review = {
  id: string
  name: string
  title: string
  body: string
  rating: number
  recommended: boolean
  buyer: boolean
  date: string
  order: number
  likes: number
  dislikes: number
}
type Vote = "like" | "dislike"
type SortOrder = "newest" | "oldest" | "popular"

const initialReviews: Review[] = [
  {
    id: "review-1",
    name: "نگار احمدی",
    title: "از نزدیک هم به همین زیباییه",
    body: "برای دیوار پشت مبل انتخابش کردم. ترکیب رنگ کرم و طرح گل‌ها خیلی ظریفه و فضای پذیرایی رو روشن‌تر کرده. کیفیت چاپ و بافتش هم رضایت‌بخش بود.",
    rating: 5,
    recommended: true,
    buyer: true,
    date: "2026-11-08T12:00:00Z",
    order: 3,
    likes: 12,
    dislikes: 0,
  },
  {
    id: "review-2",
    name: "محمد رضایی",
    title: "کیفیت خوب و نصب راحت",
    body: "طرح و جنس کاغذ با چیزی که انتظار داشتم مطابقت داشت. بعد از نصب، درزها خیلی کم مشخص می‌شن. برای فضای نشیمن انتخاب خوبی بود.",
    rating: 5,
    recommended: true,
    buyer: true,
    date: "2026-11-04T12:00:00Z",
    order: 2,
    likes: 8,
    dislikes: 1,
  },
  {
    id: "review-3",
    name: "کاربر ناشناس",
    title: "قبل از خرید، نمونه رنگ رو ببینید",
    body: "کیفیتش خوبه، ولی توی نور اتاق ما رنگ زمینه کمی گرم‌تر از عکس دیده می‌شه. پیشنهاد می‌کنم برای انتخاب رنگ، نور محیط رو هم در نظر بگیرید.",
    rating: 3,
    recommended: false,
    buyer: false,
    date: "2026-11-01T12:00:00Z",
    order: 1,
    likes: 5,
    dislikes: 2,
  },
]

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-[#370080]/40 focus-visible:ring-offset-2"
// Match the payment button in ProfilePage's OrderCard.
const productTabStyle = `min-h-11 h-auto flex-none rounded-lg border-0 bg-[#370080] px-2.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#4A1592] data-[state=active]:bg-[#370080] data-[state=active]:text-white sm:px-4 sm:py-2.5 sm:text-sm ${focusRing}`
// Exact text styles from ProfilePage's NotificationsSection and StatementSection.
const profileText = {
  heading: "text-base font-black text-gray-900 sm:text-xl",
  title: "text-sm font-semibold text-[#1E2939]",
  detail: "text-[13px] font-normal text-[#6A7282]",
  label: "block text-sm font-semibold leading-6 text-[#1E2939]",
}
const inputStyle =
  "rounded-xl border-gray-200 bg-[#FCFCFD]/50 text-right text-sm font-light text-[#6A7282] shadow-none placeholder:text-gray-400 focus-visible:border-gray-200 focus-visible:bg-[#F4F4F6] focus-visible:ring-0 md:text-sm"
const reviewBodyStyle = "text-sm font-normal leading-7 text-[#6A7282]"
const fmt = (n: number) => n.toLocaleString("fa-IR")
const reviewDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
})

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex shrink-0 gap-1"
      role="img"
      aria-label={`${fmt(rating)} از ۵ ستاره`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          size={15}
          strokeWidth={1.7}
          className={
            star <= rating ? "fill-[#FBBF24] text-[#FBBF24]" : "text-[#FBBF24]"
          }
        />
      ))}
    </span>
  )
}

export function ProductReviews({
  productName,
  code,
  album,
  color,
}: {
  productName: string
  code: string
  album: string
  color: string
}) {
  const formId = useId()
  const [reviews, setReviews] = useState(initialReviews)
  const [sort, setSort] = useState<SortOrder>("newest")
  const [votes, setVotes] = useState<Record<string, Vote | undefined>>({})
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [rating, setRating] = useState("")
  const [recommendation, setRecommendation] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const recommendedPercent = Math.round(
    (reviews.filter((review) => review.recommended).length / reviews.length) *
      100,
  )
  const sortedReviews = useMemo(
    () =>
      [...reviews].sort((a, b) => {
        if (sort === "oldest") return a.order - b.order
        if (sort === "popular")
          return (
            b.likes +
              (votes[b.id] === "like" ? 1 : 0) -
              (a.likes + (votes[a.id] === "like" ? 1 : 0)) || b.order - a.order
          )
        return b.order - a.order
      }),
    [reviews, sort, votes],
  )

  function openForm() {
    setTitle("")
    setBody("")
    setRating("")
    setRecommendation("")
    setAnonymous(false)
    setError("")
    setOpen(true)
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !body.trim() || !rating || !recommendation) {
      setError("عنوان، متن نظر، امتیاز و پیشنهاد خرید را کامل کنید.")
      return
    }
    setReviews((previous) => [
      {
        id: crypto.randomUUID(),
        name: anonymous ? "کاربر ناشناس" : "شما",
        title: title.trim(),
        body: body.trim(),
        rating: Number(rating),
        recommended: recommendation === "yes",
        buyer: false,
        date: new Date().toISOString(),
        order: Math.max(...previous.map((review) => review.order)) + 1,
        likes: 0,
        dislikes: 0,
      },
      ...previous,
    ])
    setSort("newest")
    setSubmitted(true)
    setOpen(false)
  }

  function toggleVote(id: string, vote: Vote) {
    setVotes((previous) => ({
      ...previous,
      [id]: previous[id] === vote ? undefined : vote,
    }))
  }

  return (
    <section
      id="product-reviews"
      className="mt-8 text-sm font-light text-[#6A7282]"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
      dir="rtl"
      aria-label="بررسی و نظرات محصول"
    >
      <Tabs defaultValue="comments" dir="rtl" className="gap-6">
        <div className="w-full border-b border-gray-200 pb-4">
        <TabsList className="h-auto w-full justify-start gap-2 rounded-none bg-transparent p-0 sm:w-fit">
          <TabsTrigger value="comments" className={productTabStyle}>
            نظرات کاربران{" "}
            <span className="mr-1 rounded-md bg-white/15 px-1.5 py-0.5 text-xs font-bold text-white">
              {fmt(reviews.length)}
            </span>
          </TabsTrigger>
          <TabsTrigger value="review" className={productTabStyle}>
            بررسی محصول
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent
          value="review"
          className="rounded-3xl border border-gray-200 bg-[#FCFCFD]/50 p-6 sm:p-8"
        >
          <h2 className={profileText.heading}>{productName}</h2>
          <p className={`mt-4 max-w-3xl leading-8 ${profileText.detail}`}>
            کاغذ دیواری آلبوم {album}، کد {code}، با رنگ {color}. برای انتخاب
            بهتر، نمونهٔ رنگ محصول را در نور فضای خود بررسی کنید.
          </p>
        </TabsContent>

        <TabsContent value="comments" className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className={profileText.heading}>از تجربهٔ دیگران بخوانید</h2>
            </div>
            <div
              className="flex max-w-full flex-wrap items-center gap-1.5 rounded-2xl p-1.5"
              role="group"
              aria-label="مرتب‌سازی نظرات"
            >
              {([
                { id: "newest", label: "جدیدترین" },
                { id: "oldest", label: "قدیمی‌ترین" },
                { id: "popular", label: "محبوب‌ترین" },
              ] as const).map((option) => (
                <Button
                  key={option.id}
                  variant="ghost"
                  type="button"
                  aria-pressed={sort === option.id}
                  onClick={() => setSort(option.id)}
                  className={`min-h-11 rounded-xl border px-3 text-sm font-semibold shadow-none transition-colors ${focusRing} ${
                    sort === option.id
                      ? "border-[#CA165C] bg-white text-[#CA165C] hover:bg-gray-50 hover:text-[#CA165C]"
                      : "border-transparent bg-[#370080]/20 text-[#370080] hover:bg-[#370080]/25 hover:text-[#370080]"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {submitted && (
            <p
              role="status"
              className={`flex items-center gap-2 rounded-2xl border border-gray-200 bg-[#FCFCFD]/50 px-4 py-3 leading-7 ${profileText.detail}`}
            >
              <CheckCircle
                size={18}
                className="shrink-0 text-[#370080]"
                aria-hidden="true"
              />
              نظر شما ثبت شد و به فهرست نظرات اضافه شد.
            </p>
          )}

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_375px]">
            <div className="min-w-0 space-y-4">
              {sortedReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6"
                  aria-label={`نظر ${review.name}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#370080]/6 text-sm font-semibold text-[#370080]"
                        aria-hidden="true"
                      >
                        <MessageSquare size={19} />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={profileText.title}>
                            {review.name}
                          </span>
                          {review.buyer && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-[#370080]/6 px-2 py-1 text-[13px] font-normal text-[#370080]">
                              <Check size={12} aria-hidden="true" />
                              خریدار
                            </span>
                          )}
                        </div>
                        <time
                          dateTime={review.date}
                          className={`mt-1 block ${profileText.detail}`}
                        >
                          <bdi dir="ltr">
                            {reviewDateFormatter.format(new Date(review.date))}
                          </bdi>
                        </time>
                      </div>
                    </div>
                    <Stars rating={review.rating} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold leading-7 text-[#1E2939]">
                    {review.title}
                  </h3>
                  <p
                    className="mt-1 whitespace-pre-wrap break-words text-[15px] font-normal leading-7 text-[#6A7282]"
                  >
                    {review.body}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <span
                      className={`inline-flex items-center gap-2 text-[15px] font-normal ${
                        review.recommended ? "text-[#6A7282]" : "text-[#CA165C]"
                      }`}
                    >
                      {review.recommended ? (
                        <ThumbsUp size={15} aria-hidden="true" />
                      ) : (
                        <ThumbsDown size={15} aria-hidden="true" />
                      )}
                      {review.recommended
                        ? "خرید این محصول را پیشنهاد می‌کنم"
                        : "خرید این محصول را پیشنهاد نمی‌کنم"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="ml-1 hidden text-sm font-light text-[#370080] sm:inline">
                        این نظر مفید بود؟
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label={`پسندیدن نظر ${review.name}`}
                        aria-pressed={votes[review.id] === "like"}
                        onClick={() => toggleVote(review.id, "like")}
                        className={`min-h-11 min-w-14 gap-2 rounded-xl border border-[#370080] px-3 text-[13px] font-normal text-[#370080] hover:bg-[#370080]/6 hover:text-[#370080] ${focusRing} ${
                          votes[review.id] === "like" ? "bg-[#370080]/6" : ""
                        }`}
                      >
                        <ThumbsUp size={15} aria-hidden="true" />
                        {fmt(
                          review.likes + (votes[review.id] === "like" ? 1 : 0),
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label={`نپسندیدن نظر ${review.name}`}
                        aria-pressed={votes[review.id] === "dislike"}
                        onClick={() => toggleVote(review.id, "dislike")}
                        className={`min-h-11 min-w-14 gap-2 rounded-xl border border-[#CA165C] px-3 text-[13px] font-normal text-[#CA165C] hover:bg-[#CA165C]/6 hover:text-[#CA165C] ${focusRing} ${
                          votes[review.id] === "dislike" ? "bg-[#CA165C]/6" : ""
                        }`}
                      >
                        <ThumbsDown size={15} aria-hidden="true" />
                        {fmt(
                          review.dislikes +
                            (votes[review.id] === "dislike" ? 1 : 0),
                        )}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside
              className="order-first rounded-3xl border border-gray-200 bg-white p-6 lg:order-none lg:sticky lg:top-24"
              aria-label="امتیاز محصول و ثبت نظر"
            >
              <p className="text-base font-semibold text-[#1E2939]">
                امتیاز کاربران به این محصول
              </p>
              <div className="mt-5 flex flex-wrap items-end gap-2">
                <strong className="text-[56px] font-black leading-none text-gray-900">
                  {average.toLocaleString("fa-IR", {
                    maximumFractionDigits: 1,
                  })}
                </strong>
                <span className="pb-1 text-sm font-normal text-[#6A7282]">
                  از ۵ امتیاز - {fmt(reviews.length)} دیدگاه
                </span>
              </div>
              <div
                className="mt-6 mr-auto ml-0 w-3/4 space-y-2.5"
                aria-label="توزیع امتیازها"
              >
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(
                    (review) => review.rating === star,
                  ).length
                  return (
                    <div
                      key={star}
                      className="flex items-center gap-2.5 text-sm font-normal text-[#6A7282]"
                      aria-label={`${fmt(star)} ستاره: ${fmt(count)} نظر`}
                    >
                      <span className="w-3 text-center">{fmt(star)}</span>
                      <div
                        dir="ltr"
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F4F4F6]"
                      >
                        <div
                          className="h-full rounded-full bg-[#370080] transition-[width] duration-500 motion-reduce:transition-none"
                          style={{
                            width: `${(count / reviews.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className={`mt-5 flex items-start gap-2 ${reviewBodyStyle}`}>
                <ThumbsUp
                  size={15}
                  className="mt-1 shrink-0 text-[#370080]"
                  aria-hidden="true"
                />
                {fmt(recommendedPercent)}٪ کاربران، خرید این محصول را پیشنهاد
                کرده‌اند.
              </p>
              <div className="mt-6 border-t border-gray-200 pt-5">
                <p className="text-base font-semibold text-[#1E2939]">
                  نظر شما برای ما ارزشمنده!
                </p>
                <p className="mt-1 text-sm font-normal leading-7 text-[#6A7282]">
                  از کیفیت، رنگ و تجربهٔ خریدتان بگویید.
                </p>
                <Button
                  type="button"
                  onClick={openForm}
                  className={`mt-4 min-h-12 w-full gap-2 rounded-xl border border-[#CA165C] bg-[#CA165C] text-base font-medium text-white shadow-none hover:bg-[#CA165C] ${focusRing}`}
                >
                  <Plus size={18} aria-hidden="true" />
                  ثبت نظر
                </Button>
              </div>
            </aside>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-neutral-500/40 backdrop-blur-sm motion-reduce:animate-none" />
          <DialogPrimitive.Content
            dir="rtl"
            aria-describedby={undefined}
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-[540px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-gray-200 bg-white p-5 text-sm font-light text-[#6A7282] shadow-xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className={`${profileText.heading} leading-8`}>
                  تجربهٔ شما از این محصول
                </DialogTitle>
              </div>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="بستن فرم ثبت نظر"
                  className="size-11 shrink-0 rounded-xl bg-transparent text-[#CA165C] hover:bg-transparent hover:text-[#CA165C] focus-visible:ring-2 focus-visible:ring-[#CA165C]/40 focus-visible:ring-offset-2"
                >
                  <X size={24} className="size-6" />
                </Button>
              </DialogClose>
            </div>
            <form onSubmit={submitReview} className="mt-3 space-y-5">
              <div className="space-y-2">
                <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-light leading-7 text-gray-400">
                  <Checkbox
                    checked={anonymous}
                    onCheckedChange={(checked) =>
                      setAnonymous(checked === true)
                    }
                    className="size-5 rounded-md border-gray-200 data-[state=checked]:border-[#370080] data-[state=checked]:bg-[#370080] focus-visible:ring-[#370080]/20"
                  />
                  ارسال نظر به‌صورت ناشناس
                </label>
                <div className="space-y-2">
                  <label
                    htmlFor={`${formId}-title`}
                    className={profileText.label}
                  >
                    عنوان نظر{" "}
                    <span className="text-[13px] font-normal text-[#1E2939]">
                      (الزامی)
                    </span>
                  </label>
                  <Input
                    id={`${formId}-title`}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={100}
                    required
                    placeholder="تجربه‌تان را در یک جمله بگویید"
                    className={`h-12 px-4 ${inputStyle}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor={`${formId}-body`} className={profileText.label}>
                  متن نظر{" "}
                  <span className="text-[13px] font-normal text-[#1E2939]">
                    (الزامی)
                  </span>
                </label>
                <Textarea
                  id={`${formId}-body`}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  maxLength={1200}
                  required
                  placeholder="از کیفیت، رنگ و تجربهٔ استفاده بنویسید…"
                  className={`min-h-28 resize-y px-4 py-3 leading-7 ${inputStyle}`}
                />
                <p className={`text-left ${profileText.detail}`}>
                  {fmt(body.length)} / ۱۲۰۰
                </p>
              </div>
              <fieldset className="min-w-0">
                <legend className="sr-only">امتیاز شما به کیفیت محصول</legend>
                <p id={`${formId}-rating-label`} className={profileText.label}>
                  از کیفیت این کالا چقدر رضایت دارید؟
                </p>
                <RadioGroup
                  value={rating}
                  onValueChange={(value) => {
                    setRating(value)
                    setError("")
                  }}
                  aria-labelledby={`${formId}-rating-label`}
                  dir="rtl"
                  className="mt-3 flex flex-wrap justify-end gap-2"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="cursor-pointer">
                      <RadioGroupItem
                        id={`${formId}-star-${star}`}
                        value={String(star)}
                        className="peer sr-only"
                        aria-label={`${fmt(star)} از ۵ ستاره`}
                      />
                      <span className="flex size-11 items-center justify-center rounded-xl text-[#FBBF24] transition-colors hover:bg-[#FBBF24]/10 peer-focus-visible:ring-2 peer-focus-visible:ring-[#370080]/40">
                        <Star
                          size={29}
                          strokeWidth={1.5}
                          aria-hidden="true"
                          className={
                            star <= Number(rating)
                              ? "fill-[#FBBF24]"
                              : "fill-transparent"
                          }
                        />
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>
              <fieldset>
                <legend
                  id={`${formId}-recommend-label`}
                  className={`mb-3 ${profileText.label}`}
                >
                  خرید این محصول را پیشنهاد می‌کنید؟
                </legend>
                <RadioGroup
                  value={recommendation}
                  onValueChange={(value) => {
                    setRecommendation(value)
                    setError("")
                  }}
                  aria-labelledby={`${formId}-recommend-label`}
                  dir="rtl"
                  className="grid grid-cols-2 gap-3"
                >
                  {([
                    {
                      value: "yes",
                      label: "بله، پیشنهاد می‌کنم",
                      icon: ThumbsUp,
                    },
                    {
                      value: "no",
                      label: "خیر، پیشنهاد نمی‌کنم",
                      icon: ThumbsDown,
                    },
                  ] as const).map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <RadioGroupItem
                        value={option.value}
                        className="peer sr-only"
                      />
                      <span
                        className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-2 py-3 text-[13px] font-normal transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#370080]/40 ${
                          option.value === "no"
                            ? `text-[#CA165C] ${
                                recommendation === "no"
                                  ? "border-[#CA165C]/40 bg-[#CA165C]/6"
                                  : "border-[#CA165C]/15"
                              }`
                            : `text-[#370080] ${
                                recommendation === "yes"
                                  ? "border-[#370080]/35 bg-[#370080]/6"
                                  : "border-gray-200"
                              }`
                        }`}
                      >
                        <option.icon
                          size={17}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                        {option.label}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>
              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-[#CA165C]/6 px-3 py-2 text-[13px] font-normal leading-6 text-[#CA165C]"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className={`min-h-12 w-full gap-2 rounded-xl border border-[#CA165C] bg-[#CA165C] text-sm font-medium text-white shadow-none hover:bg-[#CA165C] ${focusRing}`}
              >
                <Plus size={18} aria-hidden="true" />
                ثبت نظر
              </Button>
            </form>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </section>
  )
}
