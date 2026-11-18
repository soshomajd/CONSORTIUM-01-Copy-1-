import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  Film,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import * as DecorReact from "react";

type DemoDecorGroup = "before" | "after" | "video";

type DemoDecorRow = {
  id: string;
  group: DemoDecorGroup;
  title: string;
  edited: boolean;
};

function DecorMediaUploadCards() {
  const [decorSuccessOpen, setDecorSuccessOpen] = DecorReact.useState(false);
  const decorTimelineVisible = true;
  const [deletingRowIds, setDeletingRowIds] = DecorReact.useState<string[]>([]);


  // مسیر واقعی عکس آلبوم پروژه را اینجا قرار بده.
  const albumImage = "/images/album-cover.jpg";

  const [rows, setRows] = DecorReact.useState<DemoDecorRow[]>([]);
  const [decorSubmitted, setDecorSubmitted] = useState(false);
  const decorTimelineRef = useRef<HTMLDivElement>(null);
  const decorSendingRef = useRef(false);
  const [decorSending, setDecorSending] = useState(false);


  const cards: {
    group: DemoDecorGroup;
    title: string;
    description: string;
  }[] = [
    {
      group: "before",
      title: "عکس قبل ",
      description: "دکور قبل از تغییر",
    },
    {
      group: "after",
      title: "عکس بعد",
      description: "سه عکس از دکور بعد از تغییر",
    },
    {
      group: "video",
      title: "ویدیو دکور",
      description: "یک فیلم ۳۰ الی ۹۰ ثانیه از بعد تغییر دکور",
    },
  ];

  const decorScrollFrameRef = useRef<number | null>(null);
  const decorSubmitButtonRef = useRef<HTMLButtonElement>(null);
  const decorConfirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => {
    if (decorScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(decorScrollFrameRef.current);
    }
  }, []);

  function handleDecorSubmit() {
    setDecorSuccessOpen(true);
  }

  function handleDecorSuccessConfirm() {
    if (decorSendingRef.current) return;
    decorSendingRef.current = true;
    setDecorSending(true);
    setDecorSuccessOpen(false);
  }

  function scrollToDecorTimeline() {
    // Wait for dialog unmount effects and scroll-lock release, then measure.
    decorScrollFrameRef.current = window.requestAnimationFrame(() => {
      decorScrollFrameRef.current = window.requestAnimationFrame(() => {
        const timeline = decorTimelineRef.current;
        if (!timeline) {
          decorSendingRef.current = false;
          setDecorSending(false);
          return;
        }
        const rect = timeline.getBoundingClientRect();
        const startY = window.scrollY;
        const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const targetY = Math.max(0, Math.min(maxY,
          startY + rect.top + rect.height / 2 - window.innerHeight / 2
        ));
        const distance = targetY - startY;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Give longer journeys more time without making short scrolls feel sluggish.
        const duration = reduceMotion || Math.abs(distance) <= 1
          ? 0
          : Math.min(1100, Math.max(750, 650 + Math.abs(distance) * 0.3));
        const startedAt = performance.now();

        function animateScroll(now: number) {
          const progress = duration === 0 ? 1 : Math.min((now - startedAt) / duration, 1);
          // Smootherstep: zero velocity and acceleration at both ends.
          const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10);
          window.scrollTo({ top: startY + distance * eased, behavior: 'instant' });
          if (progress < 1) {
            decorScrollFrameRef.current = window.requestAnimationFrame(animateScroll);
          } else {
            // Paint the final position before showing the completed step.
            decorScrollFrameRef.current = window.requestAnimationFrame(() => {
              timeline?.focus({ preventScroll: true });
              setDecorSubmitted(true);
              decorSendingRef.current = false;
              setDecorSending(false);
              decorScrollFrameRef.current = null;
            });
          }
        }
        decorScrollFrameRef.current = window.requestAnimationFrame(animateScroll);
      });
    });
  }

  function simulateUpload(group: DemoDecorGroup) {
    const items: DemoDecorRow[] =
      group === "before"
        ? [
            {
              id: "demo-before",
              group: "before",
              title: "عکس قبل",
              edited: false,
            },
          ]
        : group === "after"
          ? [
              {
                id: "demo-after-1",
                group: "after",
                title: "عکس بعد ۱",
                edited: false,
              },
              {
                id: "demo-after-2",
                group: "after",
                title: "عکس بعد ۲",
                edited: false,
              },
              {
                id: "demo-after-3",
                group: "after",
                title: "عکس بعد ۳",
                edited: false,
              },
            ]
          : [
              {
                id: "demo-video",
                group: "video",
                title: "ویدیو",
                edited: false,
              },
            ];

    setRows((previous) => {
      // از ایجاد ردیف تکراری جلوگیری می‌کند.
      // اگر ردیفی حذف شده باشد، دوباره اضافه می‌شود.
      const newItems = items.filter(
        (item) => !previous.some((row) => row.id === item.id)
      );

      return [...previous, ...newItems];
    });
  }

function deleteRow(id: string) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setRows((previous) => previous.filter((row) => row.id !== id));
    return;
  }

  setDeletingRowIds((previous) =>
    previous.includes(id) ? previous : [...previous, id]
  );
}

function finishDeleteRow(id: string) {
  setRows((previous) => previous.filter((row) => row.id !== id));
  setDeletingRowIds((previous) => previous.filter((rowId) => rowId !== id));
}


  function editRow(id: string) {
    setRows((previous) =>
      previous.map((row) =>
        row.id === id ? { ...row, edited: true } : row
      )
    );
  }

  return (
    <div
      dir="rtl"
      className="w-full"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >

      <style>{`

      .decor-upload-flip {
  perspective: 1000px;
}

.decor-upload-flip-inner {
  display: grid;
  width: 100%;
  min-height: 280px;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}

.decor-upload-flip-face {
  grid-area: 1 / 1;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.decor-upload-flip-back {
  transform: rotateY(180deg);
}

@media (hover: hover) {
  .decor-upload-flip:hover .decor-upload-flip-inner {
    transform: rotateY(180deg);
  }
}

.decor-upload-flip:focus-visible .decor-upload-flip-inner {
  transform: rotateY(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .decor-upload-flip-inner {
    transition: none;
  }
}



@keyframes decorRowEnter {
  from {
    opacity: 0;
    transform: translateX(36px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.decor-row-enter {
  animation: decorRowEnter 650ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .decor-row-enter {
    animation: none;
  }
}

@keyframes decorRowExit {
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(-36px);
  }
}

.decor-row-exit {
  pointer-events: none;
  animation: decorRowExit 350ms cubic-bezier(0.4, 0, 1, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .decor-row-exit {
    animation-duration: 1ms;
  }
}

  .decor-bin-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 45px;
    height: 45px;
    padding: 0;
    border-radius: 15px;
background-color: #CA165C;
    cursor: pointer;
border: none;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .decor-bin-bottom {
    display: block;
    width: 15px;
    height: auto;
  }

  .decor-bin-top {
    display: block;
    width: 17px;
    height: auto;
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  .decor-bin-button:hover .decor-bin-top,
  .decor-bin-button:focus-visible .decor-bin-top {
    transform: rotate(45deg);
  }

.decor-bin-button:hover {
  background-color: #c72362);
}


  .decor-bin-button:focus-visible {
    outline: 2px solid #CA165C;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .decor-bin-button,
    .decor-bin-top {
      transition: none;
    }

    .decor-bin-button:hover .decor-bin-top,
    .decor-bin-button:focus-visible .decor-bin-top,
    .decor-bin-button:active {
      transform: none;
    }
  }
`}</style>

      {/* تایم‌لاین بالای باکس‌ها و هم‌تراز با ابتدای عنوان */}
      {decorTimelineVisible && (
        <div
          ref={decorTimelineRef}
          tabIndex={-1}
          dir="rtl"


          className="mt-15 w-full overflow-x-auto pb-3"
        >
          <ol
            aria-label="مراحل بررسی دکور"
            className="relative isolate m-0 grid min-w-[660px] list-none grid-cols-3 gap-10 p-0 before:pointer-events-none before:absolute before:inset-x-6 before:top-1/2 before:-z-10 before:h-[2px] before:-translate-y-1/2 before:bg-[#370080]/25 before:content-['']"
          >
            {[
              {
                number: "۱",
                title: decorSubmitted ? "ارسال فایل با موفقیت" : "ارسال فایل",
                status: decorSubmitted ? "انجام شد" : "در انتظار ارسال",

              },
              {
                number: "۲",
                title: "تایید دکور",
                status: "در انتظار بررسی",
              },
              {
                number: "۳",
                title: "دریافت 1 شانس قرعه کشی",
                status: "پس از تایید دکور",
              },
            ].map((step, index) => (
              <li
                key={step.number}
                aria-current={
                  index === (decorSubmitted ? 1 : 0) ? "step" : undefined
                }
                className="flex min-h-[95px] flex-row items-center justify-start gap-4 rounded-[25px] bg-[#370080] px-5 py-4 text-right text-white shadow-sm"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-black ${
                    index === 0 && decorSubmitted
                      ? "bg-[#FFD54F] text-[#370080]"
                      : "bg-white/15 text-white"
                  }`}
                >
                  {index === 0 && decorSubmitted ? (
                    <Check
                      className="h-5 w-5"
                      strokeWidth={3}
                      aria-label="انجام شد"
                    />
                  ) : (
                    step.number
                  )}
                </span>

                <div className="flex min-w-0 flex-col items-start gap-1">
                  <span className="text-[16px] font-semibold">
                    {step.title}
                  </span>

                  <span className="text-[16px] font-light text-white/75">
                    {step.status}
                  </span>
                </div>
              </li>


            ))}
          </ol>
        </div>
      )}

      {/* سه باکس آپلود نمایشی */}

      <div className="mx-auto mt-[90px] mb-10 grid w-full grid-cols-1 gap-6 sm:w-[calc(60%+32px)] sm:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.group}
            type="button"
            onClick={() => simulateUpload(card.group)}
            aria-label={`آپلود ${card.title}، ${card.description}`}
            className="decor-upload-flip group block min-w-0 cursor-pointer rounded-[30px] border-0 bg-transparent p-0 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CA165C] focus-visible:ring-offset-4"
          >
            <span className="decor-upload-flip-inner">
              {/* روی اول کارت: محتوای فعلی */}
              <span
                aria-hidden="true"
                className="decor-upload-flip-face flex min-h-[280px] min-w-0 flex-col items-center justify-center rounded-[30px] border border-gray-100 bg-white p-4 shadow-sm"
              >
                <span className="text-2xl font-black text-[#370080]">
                  {card.title}
                </span>

                <span className="mt-2 text-[16px] font-light leading-7 text-[#370080]">
                  {card.description}
                </span>

                <span className="mt-10 flex flex-col items-center gap-2 text-[#CA165C]">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 16V3m-5 5 5-5 5 5" />
                    <path d="M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
                  </svg>

                  <span className="text-[13px] font-light">
                    آپلود فایل
                  </span>
                </span>
              </span>
              {/* روی دوم کارت: زمینه صورتی، آیکن و متن سفید */}
              <span
                aria-hidden="true"
                className="decor-upload-flip-face decor-upload-flip-back flex min-h-[280px] min-w-0 flex-col items-center justify-center gap-3 rounded-[30px] bg-[#CA165C] p-4 text-white shadow-md"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 16V3m-5 5 5-5 5 5" />
                  <path d="M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
                </svg>

                <span className="text-2xl font-bold">
                  آپلود
                </span>
              </span>


            </span>
          </button>
        ))}

      </div>

      {/* ردیف‌های ثبت‌شده */}
      <div
        className="mx-auto mt-2 flex w-full max-w-[900px] flex-col gap-3"
        aria-live="polite"
      >
      {rows.map((row) => (
      <div
        key={row.id}
        onAnimationEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.animationName === "decorRowExit"
          ) {
            finishDeleteRow(row.id);
          }
        }}
        className={`${
          deletingRowIds.includes(row.id)
            ? "decor-row-exit"
            : "decor-row-enter"
        } flex flex-wrap items-center gap-4 rounded-[20px] border border-[#370080]/25 bg-[#370080]/5 p-4`}
      >


            {/* پیش‌نمایش پیش‌فرض آلبوم */}
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
              <img
                src={albumImage}
                alt={`پیش‌نمایش نمایشی ${row.title}`}
                className="h-full w-full object-cover"
              />

              {row.group === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#CA165C]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              )}
            </div>

            {/* پیام موفقیت */}
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-[600] leading-7 text-[#370080]">
                <span aria-hidden="true">✓ </span>
                {row.title}
                {row.edited
                  ? " با موفقیت ویرایش شد"
                  : " با موفقیت آپلود شد"}
              </p>

              <p className="mt-1 text-[14px] font-[300] text-[#370080]/70">
                {row.group === "video"
                  ? "پیش‌نمایش نمایشی ویدیو"
                  : "پیش‌نمایش تصویر"}
              </p>
            </div>

            {/* ویرایش و حذف */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => editRow(row.id)}
                aria-label={`ویرایش ${row.title}`}
                className="rounded-[10px] border border-[#CA165C]/30 bg-white px-4 py-2 text-[14px] text-[#CA165C] transition-colors hover:bg-[#CA165C]/10"
              >
                ویرایش
              </button>

        <button
          type="button"
          onClick={() => deleteRow(row.id)}
          aria-label={`حذف ${row.title}`}
          title={`حذف ${row.title}`}
          className="decor-bin-button"
        >
          <svg
            className="decor-bin-top"
            viewBox="0 0 39 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <line
              y1="5"
              x2="39"
              y2="5"
              stroke="white"
              strokeWidth="4"
            />
            <line
              x1="12"
              y1="1.5"
              x2="26.0357"
              y2="1.5"
              stroke="white"
              strokeWidth="3"
            />
          </svg>

          <svg
            className="decor-bin-bottom"
            viewBox="0 0 33 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2 0V35C2 36.1 2.9 37 4 37H29C30.1 37 31 36.1 31 35V0"
              stroke="white"
              strokeWidth="4"
            />
            <path
              d="M12 6V29"
              stroke="white"
              strokeWidth="4"
            />
            <path
              d="M21 6V29"
              stroke="white"
              strokeWidth="4"
            />
          </svg>
        </button>


            </div>
          </div>
        ))}
      </div>
{/* تأیید و ارسال */}
<div
  dir="rtl"
  className="mx-auto mt-6 flex w-full max-w-[900px] flex-col items-end gap-4"
>
  <button
    type="button"
    ref={decorSubmitButtonRef}
    onClick={handleDecorSubmit}
    disabled={decorSending}
    aria-busy={decorSending}


    className="inline-flex min-h-[48px] items-center justify-center
      rounded-[30px] border border-[#CA165C] bg-white
      px-7 py-3 text-[16px] font-light text-[#CA165C]
      focus-visible:outline focus-visible:outline-2
      focus-visible:outline-offset-4 focus-visible:outline-[#CA165C]"
    style={{ fontFamily: "inherit" }}
  >
    تایید و ارسال
  </button>

</div>

{/* مدال موفقیت */}
<Dialog open={decorSuccessOpen} onOpenChange={setDecorSuccessOpen}>
  <DialogContent
    onOpenAutoFocus={(event) => {
      event.preventDefault();
      decorConfirmButtonRef.current?.focus({ preventScroll: true });
    }}
    onCloseAutoFocus={(event) => {
      event.preventDefault();
      if (decorSendingRef.current) {
        scrollToDecorTimeline();
      } else {
        decorSubmitButtonRef.current?.focus({ preventScroll: true });
      }
    }}
    dir="rtl"

    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    className="rounded-[30px] border-gray-100 bg-white p-6
      sm:max-w-md [&>button]:left-4 [&>button]:right-auto
      [&>button]:text-[#CA165C]"
  >
    <DialogHeader className="items-center gap-3 pt-5 text-center sm:text-center">
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center
          rounded-full bg-[#CA165C]/10 text-3xl text-[#CA165C]"
      >
        ✓
      </span>

      <DialogTitle className="text-lg font-bold leading-8 text-[#370080]">
        تصاویر و فیلم شما با موفقیت ارسال شد.
      </DialogTitle>
    </DialogHeader>

    <button
      type="button"
      ref={decorConfirmButtonRef}
      onClick={handleDecorSuccessConfirm}
      disabled={decorSending}
      aria-busy={decorSending}

      className="mx-auto mt-2 rounded-[30px] border border-[#CA165C]
        bg-white px-8 py-3 text-base font-light text-[#CA165C]"
    >
      متوجه شدم
    </button>
  </DialogContent>
</Dialog>



    </div>
  );
}

function PromotionHeroAnimatedText() {
  const text =
    "ابتدا باید برند مدنظر رو انتخاب کنید. توجه داشته باشید تا پایان پروموشن فقط امکان انتخاب یک برند رو دارید. این پروموشن به مدت 60 روز از۱۵ آبان ماه تا ۱۵ دی ماه خواهد بود و جوایز نقدی، شارژ کیف پول و شانس شرکت در قرعه کشی را به همراه دارد.";

  const words = text.split(/\s+/);

  return (
    <span className="mx-auto mt-[60px] block w-full max-w-[700px] whitespace-normal break-words text-base font-normal sm:text-xl">
      <style>{`
@keyframes promotion-hero-word-enter {
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.promotion-hero-word-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.12em;
  margin-bottom: -0.12em;
}

.promotion-hero-animated-word {
  display: inline-block;
  animation-name: promotion-hero-word-enter;
  animation-duration: 1100ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: both;
  animation-iteration-count: 1;
}

      `}</style>

      {/* نسخهٔ یکپارچه برای صفحه‌خوان */}
      <span className="sr-only">{text}</span>

      {/* نسخهٔ متحرک */}
      <span aria-hidden="true" dir="rtl">
      {words.map((word, index) => (
        <span key={index}>
          <span className="promotion-hero-word-mask">
            <span
              className="promotion-hero-animated-word"
              style={{
                animationDelay: `${250 + index * 60}ms`,
              }}
            >
              {word}
            </span>
          </span>

          {index < words.length - 1 ? " " : null}
        </span>
      ))}

            </span>
          </span>
        );
      }


const F = { fontFamily: "'Vazirmatn', sans-serif" };
const PURPLE = "#370080";

// ─── Sales Chart ───────────────────────────────────────────────────────────

type ChartFilter = "هفتگی" | "ماهانه" | "سالانه";

const persianMonths = ["آبان","آذر","دی"];
const persianDigits = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
const toPersianNum = (n: number) => String(n).split("").map(d => persianDigits[+d] ?? d).join("");
const toPersianMoney = (n: number) =>
  toPersianNum(Math.abs(n).toLocaleString("en-US") as unknown as number);

const persianWeeks = [
  "هفته اول",
  "هفته دوم",
  "هفته سوم",
  "هفته چهارم",
  "هفته پنجم",
  "هفته ششم",
  "هفته هفتم",
  "هفته هشتم",
];

const chartData: Record<ChartFilter, { label: string; sold: number; target: number }[]> = {
  هفتگی: persianWeeks.map((label, i) => ({
    label,
    sold:   [210, 285, 260, 310, 240, 295, 330, 275][i],
    target: 280,
  })),
  ماهانه: Array.from({ length: 30 }, (_, i) => ({
    label: toPersianNum(i + 1),
    sold:   [88,95,72,110,103,85,120,98,115,90,105,88,130,75,108,95,112,88,125,100,95,115,88,102,120,85,108,95,112,100][i],
    target: 100,
  })),
  سالانه: persianMonths.map((label, i) => ({
    label,
    sold:   [155, 210, 178][i],
    target: 175,
  })),
};

const CHART_H = 300;
const Y_TICKS = 5;

// ─── Persian date helpers ───────────────────────────────────────────────────

const pMonthNames = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const pDayHeaders = ["ش","ی","د","س","چ","پ","ج"];

function isPLeap(y: number) { return ((y * 8) + 29) % 33 < 8; }
function pMonthLen(y: number, m: number) { return m <= 6 ? 31 : m <= 11 ? 30 : isPLeap(y) ? 30 : 29; }

function firstDayOfMonth(year: number, month: number): number {
  const ANCHOR_YEAR = 1403, ANCHOR_DOW = 4;
  let days = 0;
  for (let y = ANCHOR_YEAR; y < year; y++) days += isPLeap(y) ? 366 : 365;
  for (let y = year; y < ANCHOR_YEAR; y++) days -= isPLeap(y) ? 366 : 365;
  for (let m = 1; m < month; m++) days += pMonthLen(year, m);
  return ((ANCHOR_DOW + days) % 7 + 7) % 7;
}

interface PDate { y: number; m: number; d: number; }
function pDateCmp(a: PDate, b: PDate) { return a.y !== b.y ? a.y - b.y : a.m !== b.m ? a.m - b.m : a.d - b.d; }
function pDateEq(a: PDate | null, b: PDate | null) { return a && b && a.y === b.y && a.m === b.m && a.d === b.d; }
function pDateStr(d: PDate) { return `${toPersianNum(d.y)}/${toPersianNum(d.m).padStart(2,"۰")}/${toPersianNum(d.d).padStart(2,"۰")}`; }

function PersianRangePicker({ onChange, compact = false }: { onChange?: (s: PDate, e: PDate) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [viewY, setViewY] = useState(1403);
  const [viewM, setViewM] = useState(5);
  const [start, setStart] = useState<PDate | null>(null);
  const [end, setEnd] = useState<PDate | null>(null);
  const [hover, setHover] = useState<PDate | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function prevMonth() { if (viewM === 1) { setViewY(y => y - 1); setViewM(12); } else setViewM(m => m - 1); }
  function nextMonth() { if (viewM === 12) { setViewY(y => y + 1); setViewM(1); } else setViewM(m => m + 1); }

  function pickDay(d: PDate) {
    if (!start || (start && end)) {
      setStart(d); setEnd(null);
    } else {
      const s = pDateCmp(d, start) < 0 ? d : start;
      const e = pDateCmp(d, start) < 0 ? start : d;
      setEnd(e); setStart(s);
      onChange?.(s, e);
      setTimeout(() => setOpen(false), 180);
    }
  }

  function inRange(d: PDate) {
    if (!start) return false;
    const ref2 = end ?? hover;
    if (!ref2) return false;
    const lo = pDateCmp(start, ref2) <= 0 ? start : ref2;
    const hi = pDateCmp(start, ref2) <= 0 ? ref2 : start;
    return pDateCmp(d, lo) >= 0 && pDateCmp(d, hi) <= 0;
  }

  const mLen = pMonthLen(viewY, viewM);
  const offset = firstDayOfMonth(viewY, viewM);
  const cells = Array.from({ length: offset + mLen }, (_, i) => i < offset ? null : i - offset + 1);
  while (cells.length % 7 !== 0) cells.push(null);

  const label = start && end
    ? `${pDateStr(start)} — ${pDateStr(end)}`
    : start
    ? `از ${pDateStr(start)}`
    : "انتخاب بازه زمانی";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center rounded-lg font-bold transition-all ${
          compact ? "gap-1 px-2 py-1.5 text-[10px] sm:gap-1.5 sm:px-3 sm:text-xs" : "gap-1.5 px-3 py-1.5 text-xs"
        }`}
        style={{ backgroundColor: open || (start && end) ? PURPLE : "#fff", color: open || (start && end) ? "#fff" : PURPLE, border: `1px solid ${PURPLE}`, ...F, whiteSpace: "nowrap" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        {label}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
          style={{ backgroundColor: "#fff", width: 280, ...F }}
          dir="rtl"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <span className="text-sm font-black text-gray-800">{pMonthNames[viewM - 1]} {toPersianNum(viewY)}</span>
            <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 px-3 pt-2 pb-1">
            {pDayHeaders.map(h => (
              <div key={h} className="text-center text-[10px] font-bold text-gray-400 py-1">{h}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map((day, ci) => {
              if (!day) return <div key={`e-${ci}`} />;
              const pd: PDate = { y: viewY, m: viewM, d: day };
              const isStart = pDateEq(pd, start);
              const isEnd   = pDateEq(pd, end);
              const inR     = inRange(pd);
              const isEdge  = isStart || isEnd;
              return (
                <button
                  key={`d-${day}`}
                  onClick={() => pickDay(pd)}
                  onMouseEnter={() => setHover(pd)}
                  onMouseLeave={() => setHover(null)}
                  className="relative h-8 flex items-center justify-center text-xs font-medium transition-all"
                  style={{
                    color: isEdge ? "#fff" : inR ? PURPLE : "#374151",
                    backgroundColor: isEdge ? PURPLE : inR ? "#ede9fe" : "transparent",
                    borderRadius: isEdge ? 8 : inR ? 2 : 6,
                    fontFamily: F.fontFamily,
                  }}
                >
                  {toPersianNum(day)}
                </button>
              );
            })}
          </div>

          {start && !end && (
            <div className="px-4 pb-3 text-center">
              <span className="text-[11px] text-gray-400" style={F}>روز پایان را انتخاب کنید</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SalesChart() {
  const [filter, setFilter] = useState<ChartFilter>("ماهانه");
  const [displayFilter, setDisplayFilter] = useState<ChartFilter>("ماهانه");
  const [chartVisible, setChartVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const data = chartData[displayFilter];
  const filters: ChartFilter[] = ["هفتگی", "ماهانه", "سالانه"];

  useEffect(() => {
    const timer = window.setTimeout(() => setChartVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (filter === displayFilter) return;
    const timer = window.setTimeout(() => {
      setDisplayFilter(filter);
      setChartVisible(true);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450);
    return () => window.clearTimeout(timer);
  }, [filter, displayFilter]);

  function handleFilter(f: ChartFilter) {
    if (f === filter) return;
    setFilter(f);
    setChartVisible(f === displayFilter);
    setHoveredIdx(null);
  }

  const maxVal = Math.max(...data.flatMap(d => [d.sold, d.target]));
  const yMax = Math.ceil(maxVal / 50) * 50 + 50;
  const yTicks = Array.from({ length: Y_TICKS + 1 }, (_, i) =>
    Math.round((yMax / Y_TICKS) * (Y_TICKS - i))
  );

  const xStep = displayFilter === "ماهانه" ? 4 : 1;

return (
  <div className="mt-10 flex w-full max-w-[1380px] flex-col gap-2">
    <div
      className="w-full rounded-[30px] border border-gray-100 bg-white p-5 shadow-sm lg:pl-[40px]"
      style={{ paddingBottom: "60px" }}>
        <div className="mb-4 flex -translate-x-[20px] -translate-y-[-10px] items-center gap-2" dir="rtl">
          <p className="text-[20px] font-[800] text-[#370080]" style={{ color: "#370080", fontWeight: 700, ...F }}>رشد فروش</p>
        </div>
        <div className="flex flex-col items-start gap-8 lg:grid lg:grid-cols-[minmax(0,77fr)_minmax(0,35fr)] lg:items-start lg:gap-x-[80px] lg:gap-y-0" dir="rtl">
        <div className="w-full min-w-0 lg:contents">
        {/* Header */}
        <div className="mb-[32px] flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-0 lg:col-start-1 lg:row-start-1" dir="rtl">
          <div className="flex flex-col gap-1.5">
          </div>
          <div className="flex w-full flex-nowrap items-center gap-1 sm:w-auto sm:gap-1.5">
            {filters.map(f => (
          <button
            key={f}
            type="button"
            onClick={() => handleFilter(f)}
            className="shrink-0 rounded-lg px-2 py-1.5 text-[14px] font-[300] transition-colors duration-300 sm:px-3"
            style={{
              ...F,
              backgroundColor:
                filter === f ? "transparent" : "rgba(65, 65, 217, 0.25)",
              color: filter === f ? "#ca165c" : "#4141D9",
              border: "1px solid",
              borderColor: filter === f ? "#ca165c" : "transparent",
            }}
          >
            {{ "هفتگی": "هفتگی", "ماهانه": "روزانه", "سالانه": "ماهانه" }[f]}
          </button>

            ))}
          </div>
        </div>

        {/* Chart body */}
        <div className="flex w-full min-w-0 gap-2 lg:col-start-1 lg:row-start-2" dir="ltr" style={{ opacity: chartVisible ? 1 : 0, transform: chartVisible? "translate(-20px, 0)": "translate(-20px, 10px)",
          transition: "opacity 0.45s cubic-bezier(0.45,0,0.55,1), transform 0.65s cubic-bezier(0.45,0,0.55,1)" }}>
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between items-end pb-6 shrink-0" style={{ height: CHART_H + 24 }}>
            {yTicks.map(v => (
              <span key={`y-${v}`} className="text-[10px] text-gray-400 leading-none" style={F}>{v}</span>
            ))}
          </div>

          {/* Line chart + X labels */}
          <div className="flex-1 min-w-0">
            <div className="relative" style={{ height: CHART_H }}>
              {(() => {
                const VW = 1000;
                const xN = (i: number) => ((i + 0.5) / data.length) * VW;
                const yN = (v: number) => CHART_H - (v / yMax) * CHART_H;
                const xPct = (i: number) => ((i + 0.5) / data.length) * 100;
                const yPct = (v: number) => (v / yMax) * 100;

                const soldPts   = data.map((d, i) => `${xN(i)},${yN(d.sold)}`).join(" ");
                const targetPts = data.map((d, i) => `${xN(i)},${yN(d.target)}`).join(" ");
                const soldFill   = `${soldPts} ${VW},${CHART_H} 0,${CHART_H}`;
                const targetFill = `${targetPts} ${VW},${CHART_H} 0,${CHART_H}`;

                return (
                  <>
                    <svg
                      key={displayFilter}
                      viewBox={`0 0 ${VW} ${CHART_H}`}
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full"
                      style={{ overflow: "visible" }}
                    >
                      <defs>
                        <linearGradient id="soldGradPricing" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={PURPLE} stopOpacity="0.13" />
                          <stop offset="100%" stopColor={PURPLE} stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id="targetGradPricing" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4141D9" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#4141D9" stopOpacity="0.01" />
                        </linearGradient>

                      </defs>

                      {yTicks.map((_, i) => (
                        <line
                          key={`gl-${i}`}
                          x1={0} y1={(i / Y_TICKS) * CHART_H}
                          x2={VW} y2={(i / Y_TICKS) * CHART_H}
                          stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6 5"
                        />
                      ))}

                      <polygon points={targetFill} fill="url(#targetGradPricing)" style={{ animation: "chartFillFade 1.1s cubic-bezier(0.45,0,0.55,1) 0.15s both" }} />

                      <polyline points={targetPts} fill="none" stroke="#4141D9" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                        pathLength="1" style={{ strokeDasharray: "1", strokeDashoffset: "1", animation: "chartLineDraw 1.4s cubic-bezier(0.45,0,0.55,1) 0.05s forwards" }} />
                      <polyline points={soldPts}   fill="none" stroke={PURPLE}  strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                        pathLength="1" style={{ strokeDasharray: "1", strokeDashoffset: "1", animation: "chartLineDraw 1.4s cubic-bezier(0.45,0,0.55,1) 0.15s forwards" }} />
                    </svg>

                    {data.map((d, i) => (
                      <div key={`dots-${i}`}>
                        <div className="absolute rounded-full z-10 pointer-events-none"
                          style={{ width: 10, height: 10, backgroundColor: PURPLE, left: `${xPct(i)}%`, bottom: `${yPct(d.sold)}%`, transform: "translate(-50%, 50%)" }} />
                      </div>
                    ))}

                    <div className="absolute inset-0 flex">
                      {data.map((_, i) => (
                        <div
                          key={`hz-${i}`}
                          className="flex-1 h-full cursor-default"
                          onMouseEnter={() => setHoveredIdx(i)}
                          onMouseLeave={() => setHoveredIdx(null)}
                        />
                      ))}
                    </div>

                    {hoveredIdx !== null && (
                      <>
                        <div
                          className="absolute top-0 bottom-0 pointer-events-none z-10"
                          style={{
                            left: `${((hoveredIdx + 0.5) / data.length) * 100}%`,
                            width: 1,
                            backgroundColor: `${PURPLE}30`,
                            transform: "translateX(-50%)",
                          }}
                        />
                        {(() => {
                          const d = data[hoveredIdx];
                          const diff = d.sold - d.target;
                          const absDiff = Math.abs(diff);
                          const sign = diff >= 0 ? "+" : "-";
                          const walletBonus = Math.max(diff, 0) * 20000;
                          const leftPct = xPct(hoveredIdx);
                          const clampedLeft = Math.min(Math.max(leftPct, 18), 82);
                          const dotBottomPct = yPct(d.sold);

                          return (
                            <div
                              dir="rtl"
                              className="pointer-events-none absolute z-20 min-w-[215px] rounded-xl border border-[#370080]/15 bg-white px-3.5 py-2.5 text-[14px] font-normal shadow-lg transition-all duration-200 [&_*]:!font-normal [&_span.tooltip-heading]:!font-bold"
                              style={{
                                left: `${clampedLeft}%`,
                                bottom: `calc(${Math.min(dotBottomPct, 78)}% + 14px)`,
                                transform: "translateX(-50%)",
                                ...F,
                              }}
                            >
                          <div className="mb-1.5 flex flex-col items-end gap-[4px] text-left text-[#370080]">
                            <span className="tooltip-heading text-[14px]">
                              {toPersianNum(d.sold)} رول
                            </span>

                            <span className="tooltip-heading text-[14px]">
                              {d.label}
                            </span>
                          </div>

                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 font-bold" style={{ color: diff >= 0 ? "#370080" : "#CA165C" }}>
                                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: diff >= 0 ? "#370080" : "#CA165C" }} />
                                  <span>
                                    {diff >= 0
                                      ? `${sign}${toPersianNum(absDiff)} رول بیشتر از میانگین`
                                      : `${sign}${toPersianNum(absDiff)} رول کمتر از میانگین`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 font-bold text-[#CA165C]">
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#CA165C]" />
                                  <span>
                                    +{toPersianMoney(walletBonus)} تومان شارژ کیف پول
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </>
                );
              })()}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-px mt-[9px]">
              {data.map((d, i) => (
                <div key={`xl-${filter}-${i}`} className="flex-1 text-center overflow-hidden">
                  {i % xStep === 0 && (
                    <span className="text-[10px] text-gray-400 leading-none block truncate" style={F}>{d.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-[22px] lg:col-start-1 lg:row-start-3">
          {[
            { key: "sold",   label: "تعداد فروخته شده", color: "#370080" },
            { key: "target", label: "تعداد تارگت فروش",  color: "#CA165C" },
          ].map(({ key, label, color }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span
                    className="text-xs text-gray-500"
          style={{
            ...F,
            ...(key === "sold"
              ? {
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#370080",
                }
              : key === "target"
                ? {
                  color: "#CA165C",
                  fontSize: "14px",
                  fontWeight: 400,
                  }
                : {}),
          }}

                  >
                    {label}
            </span>
            </div>
          ))}
        </div>
        </div>
        <div className="mx-auto flex w-full max-w-[380px] shrink-0 flex-col gap-4 lg:col-start-2 lg:row-start-2 lg:mx-0 lg:max-w-none lg:justify-self-stretch lg:self-start" dir="rtl" style={F}>
          <div className="album-summary-card flex min-h-[220px] flex-col items-center justify-center rounded-[30px] border border-gray-100 bg-white p-3 text-center shadow-sm">
                <span className="text-2xl font-black text-[#370080] sm:text-3xl">
                  {toPersianNum(20)} رول
                </span>

                <span
                  className="mt-1 text-[16px] font-light text-[#370080]"
                  style={{ color: "#370080", fontSize: "16px", fontWeight: 300 }}
                >
                 میانگین فروش دوماه اخیر شما

                </span>
              </div>
          <div className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl bg-[#370080] px-5 py-3.5 text-white shadow-sm">
              <span className="text-sm font-bold">مجموع شارژ کیف پول شما از رشد فروش</span>
              <span className="rounded-xl bg-white/15 px-3.5 py-1 text-base font-black text-white">
                {toPersianNum(monthlyLotteryStats.reduce((sum, item) => sum + item.chances, 0))} شانس
              </span>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}

const brandCards = [
  { id: "extreme", label: "اکستریم" },
  { id: "next", label: "نکست والکاورینگ" },
  { id: "wallmaster", label: "وال‌مستر" },
];

const promotionRules = [
  "فروش فقط از داده قطعی و پس از کسر مرجوعی محاسبه شود",
  "سفارش صوری یا مرجوعی کامل در ماه بعد امتیاز فروش ندارد و موجب بن شدن شرکت کننده میگردد",
  "در هر روز جدول رنکینگ فروشگاه ها بر اساس امتیاز کسب شده و هر هفته رنکینگ استان ها به نمایش گذاشته میشود",
  "3 نفر برتر فروش در پایان دوره جایزه ویژه دریافت خواهند نمود",
  "به 4 نفر برتر لوح فروش برتر در همایش اهدا خواهد شد.",
  "برندگان قرعه کشی اعلام خواهند شد.",
  "حداکثر ۵ شانس برای هر فروشگاه در کل فصل.",
];

interface QuestMilestone {
  step: number;
  title: string;
  subtitle: string;
  reward?: string;
  color: string;
  x: number;
  y: number;
}

const questMilestones: QuestMilestone[] = [
  {
    step: 1,
    title: "10 روز اول",
    subtitle: "فروش 7 رول",
    color: "#370080",
    x: 410,
    y: 70,
  },
  {
    step: 2,
    title: "10 روز دوم",
    subtitle: "فروش 7 رول",
    color: "#CA165C",
    x: 685,
    y: 70,
  },
  {
    step: 3,
    title: "10 روز سوم",
    subtitle: "فروش 7 رول",
    reward: "+60000 تومان",
    color: "#370080",
    x: 960,
    y: 70,
  },
  {
    step: 4,
    title: "10 روز چهارم",
    subtitle: "فروش 7 رول",
    reward: "+120000 تومان",
    color: "#CA165C",
    x: 960,
    y: 260,
  },
  {
    step: 5,
    title: "10 روز پنجم",
    subtitle: "فروش 7 رول",
    reward: "+180000 تومان",
    color: "#370080",
    x: 705,
    y: 260,
  },
  {
    step: 6,
    title: "10 روز ششم",
    subtitle: "فروش 7 رول",
    reward: "+220000 تومان",
    color: "#CA165C",
    x: 450,
    y: 260,
  },
  {
    step: 7,
    title: "10 روز هفتم",
    subtitle: "فروش 7 رول",
    reward: "+300000 تومان",
    color: "#370080",
    x: 195,
    y: 260,
  },
  {
    step: 8,
    title: "10 روز هشتم",
    subtitle: "فروش 7 رول",
    reward: "+350000 تومان",
    color: "#CA165C",
    x: 195,
    y: 450,
  },
  {
    step: 9,
    title: "10 روز نهم",
    subtitle: "فروش 7 رول",
    reward: "+400000 تومان",
    color: "#370080",
    x: 450,
    y: 450,
  },
];

function ContinuousPurchaseRoadmap() {
  return (
    <div className="mt-10 w-full max-w-[1380px]" style={F}>
      <div
        dir="rtl"
        className="relative isolate overflow-hidden rounded-[30px] px-5 py-10 text-white sm:px-10 sm:py-12"
        style={{
          background:
            "radial-gradient(ellipse at 48% 52%, #65399e 10%, #480d94 48%, #370080 100%)",
        }}
      >
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1.5px)",
            backgroundSize: "46px 46px",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 bottom-0 -z-10 h-48 w-48 rounded-full bg-[#ca165c]/25 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-0 -z-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl"
        />

        {/* Heading */}
        <div className="text-center">

          <h3 className="mt- text-[20px] font-[900] text-white ">
            مستمر خرید کن
          </h3>

          <p className="mt-2 text-[16px] font-[300] text-white/75">
            و آخر فصل جایزه بگیر
          </p>
        </div>

        {/* Horizontal roadmap — scrollable on smaller screens */}
{/* Zigzag roadmap */}
<div
  className="mt-8 pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
  tabIndex={0}
  role="region"
  aria-label="مسیر زیگزاگی خرید مستمر؛ برای دیدن تمام مراحل افقی پیمایش کنید"
>
  {(() => {
    const width = 1440;
    const height = 440;
    const sidePadding = 90;

    const points = questMilestones.map((milestone, index) => {
      const x =
        questMilestones.length <= 1
          ? width / 2
          : width -
            sidePadding -
            (index * (width - sidePadding * 2)) /
              (questMilestones.length - 1);

      const y = index % 2 === 0 ? 150 : 290;

      return { milestone, x, y };
    });

    const linePoints = points
      .map(({ x, y }) => `${x},${y}`)
      .join(" ");

    return (
      <div
        className="relative w-full"
        style={{ height }}
      >
        {/* Zigzag line and milestone dots */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Soft glow behind the line */}
          <polyline
            points={linePoints}
            stroke="#67E8F9"
            strokeWidth={12}
            strokeOpacity={0.08}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <polyline
            points={linePoints}
            stroke="#A5B4FC"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {points.map(({ milestone, x, y }) => (
            <g key={milestone.step}>
              <circle
                cx={x}
                cy={y}
                r={13}
                fill="#67E8F9"
                fillOpacity={0.12}
              />

              <circle
                cx={x}
                cy={y}
                r={6}
                fill="#A5B4FC"
                stroke="#FFFFFF"
                strokeOpacity={0.7}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>

        {/* Labels positioned beside the zigzag vertices */}
        <ol className="relative m-0 h-full list-none p-0">
          {points.map(({ milestone, x, y }, index) => {
            const above = index % 2 === 0;

            return (
              <li
                key={milestone.step}
                className="absolute w-[140px] -translate-x-1/2 text-center"
                style={{
                  left: `${(x / width) * 100}%`,
                  ...(above
                    ? { bottom: height - y + 24 }
                    : { top: y + 24 }),
                }}
              >
                <span className="text-[11px] font-normal text-cyan-200">
                  مرحله {toPersianNum(milestone.step)}
                </span>

                <h4 className="mt-1 text-[15px] font-bold text-white">
                  {milestone.title}
                </h4>

                <p className="mt-2 text-[13px] font-normal text-white/70">
                  {milestone.subtitle}
                </p>

                {milestone.reward && (
                  <p className="mt-2 inline-block rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-[12px] font-medium text-cyan-100">
                    {milestone.reward}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  })()}
          ()
        </div>
      </div>
    </div>
  );
}

function RoadmapBicycle() {
  const bicycleSvg = String.raw`
<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2015.44 1278.73"><defs><style>.cls-1{fill:#c6c6c6;}.cls-2{fill:#999;}.cls-3{fill:#787878;}.cls-4{fill:#21141a;}.cls-5{fill:#ccc;}.cls-6{fill:#a5c715;}.cls-7{fill:#8a9aa4;}.cls-8{fill:#575757;}.cls-9{fill:#383839;}.cls-10{fill:#045166;}.cls-11{fill:#1c2c42;}</style></defs><path class="cls-1" d="M148.28,1187.55c0,234.72,190.27,425,425,425,198.9,0,365.83-136.65,412.17-321.16a7,7,0,0,0,5.93,3.39,7.11,7.11,0,0,0,3.21-.79l.31-.2c.85,1.36,1.71,2.71,2.62,4l-.27.18a7,7,0,0,0,4.38,12.44,7.08,7.08,0,0,0,4.38-1.53l.23-.23c1.09,1.18,2.22,2.32,3.37,3.44l-.24.24a7,7,0,0,0,5.36,11.51,7.08,7.08,0,0,0,5.36-2.52l.17-.26c1.3,1,2.64,1.83,4,2.71l-.2.3a7,7,0,0,0,2.75,9.46,6.76,6.76,0,0,0,3.35.89,7,7,0,0,0,6.15-3.64l.13-.29c1.46.67,2.95,1.27,4.45,1.87l-.15.33a7,7,0,0,0,4.57,8.76,6.4,6.4,0,0,0,2.1.33,7,7,0,0,0,6.66-4.89l.07-.34c1.56.37,3.13.68,4.71,1l-.07.35a7,7,0,0,0,6.2,7.68l.79.05a6.92,6.92,0,0,0,6.9-6.2v-.36c1.63.06,3.24.11,4.85.09v.32a7,7,0,0,0,2.11,4.36L1092,1413l-19.67-3.46a11.36,11.36,0,1,0-3.93,22.37l80.16,14.07a11.35,11.35,0,1,0,3.93-22.36l-35.4-6.21-10.91-76a6.92,6.92,0,0,0,3.44-8l-.14-.34c1.51-.56,3-1.13,4.49-1.77l.12.3a6.9,6.9,0,0,0,6.2,3.77,7.35,7.35,0,0,0,3.22-.79,7,7,0,0,0,3-9.41l-.2-.31c1.37-.85,2.71-1.71,4-2.62l.17.27a7,7,0,0,0,5.45,2.61,6.72,6.72,0,0,0,4.38-1.54,6.91,6.91,0,0,0,1.07-9.79l-.23-.24c1.19-1.1,2.34-2.22,3.47-3.38l.26.27a7.06,7.06,0,0,0,4.47,1.63,6.9,6.9,0,0,0,5.36-2.52,7,7,0,0,0-.84-9.83l-.27-.19c.93-1.3,1.82-2.62,2.7-4l.28.2a7.48,7.48,0,0,0,3.4.88,7,7,0,0,0,3.36-13.14l-.3-.13c.67-1.46,1.27-3,1.87-4.44l.33.14a6.67,6.67,0,0,0,2.1.33,7,7,0,0,0,2.1-13.66l-.33-.07c.37-1.55.69-3.12,1-4.71l.33.07.79,0a7,7,0,0,0,.75-13.93h-.34c.06-1.61.12-3.22.1-4.82l.33,0a7,7,0,1,0-1.17-13.94l-.37.07c-.25-1.58-.5-3.17-.83-4.73l.32,0a7,7,0,0,0-3.92-13.47l-.32.13c-.57-1.51-1.13-3-1.76-4.49l.31-.12a7,7,0,1,0-6.43-12.39l-.31.2c-.85-1.39-1.72-2.76-2.64-4.09l.3-.17a6.82,6.82,0,0,0,2.25-3.57l428.1-500.09.62,2.83a10.59,10.59,0,0,0,8.55,8.14l-.89.2a5.71,5.71,0,0,0-4.35,6.78l.61,2.78a5.71,5.71,0,0,0,6.78,4.35l8.8-1.93,9.57,45.9c-2.78,3.17-3.93,7.51-2.26,13.5,0,0,1,4.5,2.82,12.42-174.79,52.72-302.11,214.9-302.11,406.88,0,234.72,190.27,425,425,425s425-190.28,425-425-190.28-425-425-425a426.07,426.07,0,0,0-80.25,7.67l-2.38-12.76c-1.3-5.84-4.31-8.89-8.2-10.3l-9.49-45.48,3.64-.8a5.71,5.71,0,0,0,4.34-6.78l-.61-2.78A5.71,5.71,0,0,0,1639,687l-.9.2a10.6,10.6,0,0,0,4.37-11l-25.61-116.89a10.58,10.58,0,0,0-9.42-8.22L1609,550a5.71,5.71,0,0,0,4.35-6.78l-.61-2.78a5.72,5.72,0,0,0-6.79-4.35l-.52-3.8a49.61,49.61,0,0,1,18.44-45.73l19.84-15.62a42.66,42.66,0,0,0,15.38-42.15l-13-62.57c-5.09-15.8-29.36-34.89-44.57-32.13-9.62,1.75-45.89,12.72-63,20.75l-.69-2.15c-.82-2.55-.56-1.32-3.89-.25,0,0-84.74,27.93-92.07,36.35s-1.19,27.07,9.62,28.71,92.64-32.95,92.64-32.95c3.33-1.06,3.83-.14,3-2.68l-.62-1.94,44.34-14.88c16.22-5.94,24.06,15.47,25.73,23.54l4.83,23.36A42.65,42.65,0,0,1,1607,453.3l-31.56,26.4a49.62,49.62,0,0,0-17.39,44.14l2.75,22.14a5.71,5.71,0,0,0-4.35,6.78l.61,2.78a5.72,5.72,0,0,0,6.79,4.35l1.63.44a10.6,10.6,0,0,0-5.12,9L1008.11,901.56,926.82,663.38a8.2,8.2,0,0,0,3.72-10.12L926.16,642a8.23,8.23,0,0,0-10.61-4.67l-3.41,1.32-21.52-66.21-2.27-7.24a10.25,10.25,0,0,0-.41-1c30.22-1.8,58.53-4.42,75.67-6.4,33.6-3.87,50-47.92-1.16-49.17-69.29-1.68-228.29-53.49-244-52-7.14.7-9.54,8.2-9.26,17.76-1.51,73.15,19,105.74,72.19,104.87,3.71-.06,8.16-.39,13.1-.92a40.38,40.38,0,0,0,15.79,13.13,65.57,65.57,0,0,0,26.93,5.6,72.85,72.85,0,0,0,10.76-.84,76.82,76.82,0,0,0,17.15,5L881,650.74l-9,3.48a8.21,8.21,0,0,0-4.67,10.6l4.38,11.28a8.23,8.23,0,0,0,10.61,4.67l.57-.23,9.19,26.94-86,124.57a422.94,422.94,0,0,0-232.81-69.49C338.55,762.56,148.28,952.83,148.28,1187.55ZM845.93,570a9.73,9.73,0,0,0-1.1,4.27v5.27l-12,1.87a14,14,0,0,0,1.9,4.73,54.27,54.27,0,0,1-20-4.52,26.94,26.94,0,0,1-7.26-4.89C819.63,575,833.2,572.52,845.93,570Zm877.25,263.06,10.14,307.71c-2.3-6.18-4.54-12.86-6.51-20-6.56-23.63-36.68-182-55.43-281.69A356,356,0,0,1,1723.18,833.08Zm121.1,15.57L1749,1141.27a47,47,0,0,0-7.84-.78L1731,832.88c2.56,0,5.11-.19,7.69-.19A354.94,354.94,0,0,1,1844.28,848.65Zm133.06,76.24-209.89,224.2a46.1,46.1,0,0,0-10.88-5.72l95.14-292.2A354.49,354.49,0,0,1,1977.34,924.89Zm75,96.66-273.46,139.12a47.36,47.36,0,0,0-5.43-6.54L1983,930.3A356.4,356.4,0,0,1,2052.37,1021.55Zm40.77,148.36L1786.56,1180a46,46,0,0,0-3.78-12.51l273.16-139A352.65,352.65,0,0,1,2093.14,1169.91ZM2078,1291.85l-291.83-95a46.61,46.61,0,0,0,1-9l306.21-10.09c.09,3.27.25,6.52.25,9.8A354.67,354.67,0,0,1,2078,1291.85Zm-76.53,134.25-224.36-210a46.35,46.35,0,0,0,6.77-11.73l291.67,95A354.59,354.59,0,0,1,2001.45,1426.1Zm-97.52,75.5-139.59-274.37a46.58,46.58,0,0,0,7.38-5.45l224.32,210A355.72,355.72,0,0,1,1903.93,1501.6ZM1754.4,1542l-10.17-308.37a46.19,46.19,0,0,0,13.07-3L1897,1505.18A352.84,352.84,0,0,1,1754.4,1542Zm-122.43-16,95.73-294a46.18,46.18,0,0,0,8.68,1.61l10.17,308.58c-2.61.06-5.2.2-7.83.2A354.56,354.56,0,0,1,1632,1526.05Zm-133.88-77.76,211.63-226.06a46.57,46.57,0,0,0,10.64,7l-95.82,294.29A354.47,354.47,0,0,1,1498.09,1448.29Zm-74.67-98,276.23-140.53a46.46,46.46,0,0,0,4.6,6.81l-211.84,226.28A356,356,0,0,1,1423.42,1350.32Zm-39.22-149.2L1694,1190.91a46.42,46.42,0,0,0,2.49,11.71l-276.61,140.72A353,353,0,0,1,1384.2,1201.12Zm16.45-121.56,294.65,95.94a45.94,45.94,0,0,0-1.31,7.56l-310,10.22c0-1.91-.14-3.81-.14-5.73A354.26,354.26,0,0,1,1400.65,1079.56Zm77.4-132.71,225.8,211.39a46.71,46.71,0,0,0-6,9.85l-294.72-96A354.54,354.54,0,0,1,1478.05,946.85Zm97.11-74.19,116.28,228.57c3.7,14.16,6.57,24.33,8.24,28.82,2.93,7.86,6.21,15.43,9.49,22.43L1483.46,941.17A355.86,355.86,0,0,1,1575.16,872.66Zm56.34-23.44c15,65.51,36.19,156.59,51.26,217.65L1582.14,869.08A351.13,351.13,0,0,1,1631.5,849.22ZM312.6,946.85l224.17,209.86a46.79,46.79,0,0,0-6.85,10.56l-292.21-95.14A354.54,354.54,0,0,1,312.6,946.85Zm97.11-74.19,139.36,273.92a47,47,0,0,0-6.72,4.61L318,941.17A355.86,355.86,0,0,1,409.71,872.66Zm148-39.58,10.14,307.59a46.19,46.19,0,0,0-11.67,2.64L416.69,869.08A353,353,0,0,1,557.73,833.08Zm121.1,15.57-95.47,293.23a45.94,45.94,0,0,0-7.64-1.24L565.58,832.88c2.56,0,5.11-.19,7.69-.19A354.94,354.94,0,0,1,678.83,848.65Zm87.38,41.13-175,253.38,95.07-292A353.1,353.1,0,0,1,766.21,889.78Zm45.68,35.11L646,1102.13l138.15-200A354.85,354.85,0,0,1,811.89,924.89Zm5.68,5.41A356.8,356.8,0,0,1,866,987L633.52,1126.9Zm149.27-3.91-40.59,24.42A427.25,427.25,0,0,0,824,844.43l76.92-111.34Zm55.64,17.29L1570,614.34l2.82,12.88-448.78,526a6.87,6.87,0,0,0-7.72,3.31l-.13.31c-1.46-.67-3-1.29-4.46-1.89l.16-.33a7,7,0,0,0-13.32-4.24l-.08.36q-2.34-.56-4.74-1l.11-.35a7,7,0,0,0-3.45-6.79l-23.26-68.15h26.39a11.36,11.36,0,1,0,0-22.71h-34.14ZM987.61,1282c.12-.56.26-1.1.38-1.66.15.37.28.74.44,1.11l-.28.11C987.94,1281.66,987.81,1281.86,987.61,1282Zm-39-293.86,32.63-19.63,28.49,83.49a11.35,11.35,0,0,0,2.4,22.44h5.26l25.72,75.36a6.87,6.87,0,0,0-.13,3.87l.16.33c-1.52.56-3,1.12-4.51,1.76l-.12-.32a7,7,0,1,0-12.4,6.48l.19.26c-1.38.85-2.74,1.7-4.07,2.62l-.18-.27a7,7,0,0,0-10.95,8.71l.25.25c-.71.66-1.4,1.35-2.1,2l-3.72-.11a6.81,6.81,0,0,0-4.14-.13l-3.41-.1A422.73,422.73,0,0,0,948.59,988.13Zm-20.9,181.78-50.84,1.67L654.6,1165l177.19-106.59,58.7-29.86A352.65,352.65,0,0,1,927.69,1169.91Zm-15.16,121.94-230.67-75.11,244,10.73A353.23,353.23,0,0,1,912.53,1291.85ZM836,1426.1,609.94,1214.47c.21-.29.44-.57.64-.86l42,1.85,257.51,83.84A354.45,354.45,0,0,1,836,1426.1Zm-97.51,75.5L598.21,1225.88a46.13,46.13,0,0,0,6.63-5.44l225.75,211.34A355.84,355.84,0,0,1,738.49,1501.6ZM589,1542l-10.18-308.7a46.25,46.25,0,0,0,12.57-3.65L731.5,1505.18A352.68,352.68,0,0,1,589,1542Zm-122.43-16L562,1232.72a47.5,47.5,0,0,0,8.91,1.07l10.16,308.43c-2.61.06-5.2.2-7.83.2A354.87,354.87,0,0,1,466.52,1526.05Zm-133.88-77.76L543,1223.6a46.59,46.59,0,0,0,11.55,6.79l-95.45,293.14A354.33,354.33,0,0,1,332.64,1448.29Zm-74.67-98,274-139.4a46.45,46.45,0,0,0,5.32,7.27L327,1442.88A356,356,0,0,1,258,1350.32Zm-39.22-149.2L525.63,1191a46.53,46.53,0,0,0,2.93,12.85L254.4,1343.34A353,353,0,0,1,218.75,1201.12Zm-.2-7.84c0-1.91-.14-3.81-.14-5.73a354.57,354.57,0,0,1,16.79-108l292,95.07a47,47,0,0,0-1.55,8.53Z" transform="translate(-148.28 -333.82)"/><path class="cls-2" d="M1072.32,1409.57,1092,1413l-12.39-69.19a6.89,6.89,0,0,0,4.84,2h.61a7,7,0,0,0,6.38-7.55l-.07-.37c1.58-.25,3.16-.51,4.72-.84l.06.33a7.11,7.11,0,0,0,6.76,5,6.9,6.9,0,0,0,1.91-.28,6.76,6.76,0,0,0,1.36-.71l10.91,76,35.4,6.21a11.35,11.35,0,1,1-3.93,22.36l-80.16-14.07a11.36,11.36,0,1,1,3.93-22.37Z" transform="translate(-148.28 -333.82)"/><path class="cls-2" d="M1009.71,1052a11.1,11.1,0,0,1,2.4-.27h81.38a11.36,11.36,0,1,1,0,22.71h-32l12,69.68,10.47,60.62,4.26,24.68,1.76,10.24a15,15,0,1,1-29.69,4.52l-1.1-8.08-3.62-26.36-8.81-64.24-9.74-71.06h-24.95a11.35,11.35,0,0,1-2.4-22.44Z" transform="translate(-148.28 -333.82)"/><path class="cls-3" d="M1059.17,1418.79a11.37,11.37,0,0,1,13.15-9.22L1092,1413l25.09,4.41,35.4,6.21a11.35,11.35,0,1,1-3.93,22.36l-80.16-14.07A11.37,11.37,0,0,1,1059.17,1418.79Z" transform="translate(-148.28 -333.82)"/><path class="cls-3" d="M1009.71,1052a11.1,11.1,0,0,1,2.4-.27h81.38a11.36,11.36,0,1,1,0,22.71h-81.38a11.35,11.35,0,0,1-2.4-22.44Z" transform="translate(-148.28 -333.82)"/><path class="cls-4" d="M573.27,762.56a422.86,422.86,0,0,1,232.81,69.49L787.6,858.81a390.57,390.57,0,0,0-214.33-63.75c-216.76,0-392.49,175.73-392.49,392.49S356.51,1580,573.27,1580c202.72,0,369.52-153.7,390.28-350.92l11.47.51a6.84,6.84,0,0,0-.8,2.47v.28l-.05.09a7.06,7.06,0,0,0,6.2,7.74h.36c-.06,1.61-.1,3.21-.08,4.8h-.33a7,7,0,0,0,.61,13.93h.6l.35-.06c.26,1.59.52,3.18.86,4.75l-.32.07a7,7,0,0,0,2,13.7,6.93,6.93,0,0,0,2-.28l.34-.14c.42,1.13.87,2.24,1.32,3.35-.12.56-.26,1.1-.38,1.66a7,7,0,0,0-2.44,9c.07.14.19.24.27.38-46.34,184.51-213.27,321.16-412.17,321.16-234.72,0-425-190.28-425-425S338.55,762.56,573.27,762.56Z" transform="translate(-148.28 -333.82)"/><path class="cls-4" d="M926.25,950.81l-27.89,16.77a394.58,394.58,0,0,0-92.87-96.4L824,844.43A427.38,427.38,0,0,1,926.25,950.81Z" transform="translate(-148.28 -333.82)"/><path class="cls-4" d="M965.43,1174.21a390.27,390.27,0,0,0-44.76-169.29l27.92-16.79A422.73,422.73,0,0,1,998,1175.18Z" transform="translate(-148.28 -333.82)"/><path class="cls-5" d="M686.26,851.17c-2.48-.84-4.93-1.74-7.43-2.52a354.94,354.94,0,0,0-105.56-16c-2.58,0-5.13.14-7.69.19s-5.24.09-7.85.2a353,353,0,0,0-141,36c-2.35,1.16-4.67,2.37-7,3.58A355.86,355.86,0,0,0,318,941.17c-1.81,1.88-3.63,3.76-5.41,5.68a354.54,354.54,0,0,0-74.89,125.28c-.85,2.47-1.72,4.94-2.51,7.43a354.57,354.57,0,0,0-16.79,108c0,1.92.11,3.82.14,5.73,0,2.62.1,5.24.2,7.84a353,353,0,0,0,35.65,142.22c1.15,2.35,2.37,4.66,3.57,7a356,356,0,0,0,69,92.56c1.88,1.81,3.76,3.64,5.68,5.41a354.33,354.33,0,0,0,126.45,75.24c2.48.85,4.93,1.73,7.43,2.52a354.87,354.87,0,0,0,106.75,16.37c2.63,0,5.22-.14,7.83-.2s5.24-.09,7.85-.2a352.68,352.68,0,0,0,142.55-36.84q3.51-1.76,7-3.58a355.84,355.84,0,0,0,92.1-69.82c1.8-1.9,3.65-3.74,5.41-5.68a354.45,354.45,0,0,0,74.08-126.8c.82-2.48,1.68-4.94,2.45-7.45a353.23,353.23,0,0,0,13.31-64.38l37.71,1.65C942.79,1426.34,776,1580,573.27,1580c-216.76,0-392.49-175.72-392.49-392.49S356.51,795.06,573.27,795.06A390.57,390.57,0,0,1,787.6,858.81l-21.39,31A353.1,353.1,0,0,0,686.26,851.17Z" transform="translate(-148.28 -333.82)"/><path class="cls-5" d="M898.36,967.58,866,987a356.8,356.8,0,0,0-48.46-56.73c-1.9-1.8-3.74-3.65-5.68-5.41a354.85,354.85,0,0,0-27.78-22.76l21.38-31A394.58,394.58,0,0,1,898.36,967.58Z" transform="translate(-148.28 -333.82)"/><path class="cls-5" d="M927.77,1173.1c0-1.06,0-2.14-.08-3.19a352.65,352.65,0,0,0-37.2-141.38c-.7-1.4-1.41-2.78-2.13-4.17l32.31-19.44a390.27,390.27,0,0,1,44.76,169.29Z" transform="translate(-148.28 -333.82)"/><path class="cls-4" d="M1346.23,1187.55c0,216.77,175.72,392.49,392.49,392.49s392.49-175.72,392.49-392.49-175.72-392.49-392.49-392.49a394.35,394.35,0,0,0-74.28,7.11c-2.49-13.28-4.53-24.21-6-31.94a426.15,426.15,0,0,1,80.25-7.67c234.72,0,425,190.27,425,425s-190.28,425-425,425-425-190.28-425-425c0-192,127.32-354.16,302.11-406.88,1.73,7.65,4.21,18.51,7.23,31.73C1462.75,861.77,1346.23,1011,1346.23,1187.55Z" transform="translate(-148.28 -333.82)"/><path class="cls-5" d="M2131.21,1187.55c0,216.77-175.72,392.49-392.49,392.49s-392.49-175.72-392.49-392.49c0-176.51,116.52-325.78,276.84-375.15,2.48,10.86,5.32,23.29,8.43,36.82a351.13,351.13,0,0,0-49.36,19.86c-2.35,1.16-4.67,2.37-7,3.58a355.86,355.86,0,0,0-91.7,68.51c-1.81,1.88-3.64,3.76-5.41,5.68a354.54,354.54,0,0,0-74.89,125.28c-.85,2.47-1.72,4.94-2.51,7.43a354.57,354.57,0,0,0-16.79,108c0,1.92.11,3.82.14,5.73,0,2.62.1,5.24.2,7.84a353,353,0,0,0,35.65,142.22c1.15,2.35,2.37,4.66,3.57,7a356,356,0,0,0,69,92.56c1.88,1.81,3.75,3.64,5.68,5.41a354.47,354.47,0,0,0,126.45,75.24c2.48.85,4.93,1.73,7.43,2.52a354.56,354.56,0,0,0,106.75,16.37c2.63,0,5.22-.14,7.83-.2s5.24-.09,7.85-.2A352.84,352.84,0,0,0,1897,1505.18q3.51-1.76,7-3.58a355.84,355.84,0,0,0,92.1-69.82c1.8-1.9,3.65-3.74,5.41-5.68a354.45,354.45,0,0,0,74.08-126.8c.82-2.48,1.68-4.94,2.45-7.45a354.67,354.67,0,0,0,15.61-104.3c0-3.28-.16-6.53-.25-9.8-.07-2.61-.07-5.24-.2-7.84a352.65,352.65,0,0,0-37.2-141.38c-1.17-2.34-2.35-4.68-3.57-7A356.17,356.17,0,0,0,1983,930.3c-1.9-1.8-3.74-3.65-5.68-5.41a354.34,354.34,0,0,0-125.63-73.72c-2.48-.84-4.93-1.74-7.43-2.52a354.94,354.94,0,0,0-105.56-16c-2.58,0-5.13.14-7.69.19s-5.24.09-7.85.2a356,356,0,0,0-51.8,6.07c-2.55-13.58-4.9-26.06-6.94-37a394.35,394.35,0,0,1,74.28-7.11C1955.49,795.06,2131.21,970.79,2131.21,1187.55Z" transform="translate(-148.28 -333.82)"/><path class="cls-6" d="M1007.85,1176.86l-.22-.27a6.64,6.64,0,0,0-2.12-1.18l3.72.11C1008.77,1176,1008.3,1176.4,1007.85,1176.86Z" transform="translate(-148.28 -333.82)"/><path class="cls-7" d="M844.83,574.29a9.73,9.73,0,0,1,1.1-4.27c8.39-1.65,16.41-3.31,23.41-4.81,6.23-.28,12.45-.61,18.6-1a10.25,10.25,0,0,1,.41,1l2.27,7.24-45.79,7.13Z" transform="translate(-148.28 -333.82)"/><path class="cls-6" d="M1037.06,1074.43l9.74,71.06a6.77,6.77,0,0,0-3.71,4.3l-25.72-75.36Z" transform="translate(-148.28 -333.82)"/><path class="cls-6" d="M1067.1,1074.43l23.26,68.15a7.25,7.25,0,0,0-2.75-.95,7,7,0,0,0-7.69,6.2v.35c-1.62-.06-3.24-.12-4.84-.11v-.33a6.84,6.84,0,0,0-1.54-3.63l-12-69.68Z" transform="translate(-148.28 -333.82)"/><path class="cls-6" d="M1157.49,1185.79l428.1-500.09.62,2.83a10.59,10.59,0,0,0,8.55,8.14l43.33-9.49a10.6,10.6,0,0,0,4.37-11l-25.61-116.89a10.61,10.61,0,0,0-12.59-8.07l-35.6,7.8a10.6,10.6,0,0,0-8.29,10.3L1008.11,901.56,926.82,663.38a9.43,9.43,0,0,1-1,.49l-42.93,16.67,9.19,26.94-86,124.57L787.6,858.81l-21.39,31-175,253.38-10.88,15.75-3.11,1.87-.8.48-2.21,1.33H574a32.63,32.63,0,0,0-5.41.47c-.75.12-1.41.33-2.11.5a23.08,23.08,0,0,0-7.24,3.06c-.08.06-.19.09-.27.15a20.27,20.27,0,0,0-5.43,5.66,23.83,23.83,0,0,0-1.24,2.14,25.94,25.94,0,0,0-2.46,7.44c0,.12,0,.24,0,.35a31.8,31.8,0,0,0-.24,7.86c.08.92.26,1.82.43,2.73a31.45,31.45,0,0,0,2.36,7.6c.16.34.32.69.49,1a21.87,21.87,0,0,0,4.78,6.37,15.22,15.22,0,0,0,3.42,2.4,12.93,12.93,0,0,0,3.78,1.25l4,.18,1.37.06,7.86.34,4.46.2,9,.39,5.36.24,12.05.53,1.63.07,42,1.85,29.29,1.28,244,10.73,37.71,1.65,11.47.51A6.88,6.88,0,0,1,982,1226l.35.07c.3-1.61.63-3.19,1-4.77l-.33-.06a7,7,0,1,1,4.24-13.33l.31.14c.6-1.5,1.22-3,1.89-4.43l-.34-.13a7,7,0,0,1,6.81-12.22l.28.2c.88-1.35,1.78-2.68,2.73-4l-.31-.18a7,7,0,0,1-.79-9.83,6.76,6.76,0,0,1,3.57-2.15l-3.41-.1-32.53-1-37.66-1.11-50.92-1.52L654.6,1165l177.19-106.59,56.57-34,32.31-19.44,27.92-16.79,32.63-19.63,28.49,83.49a11.1,11.1,0,0,1,2.4-.27h47.24l-36.87-108L1570,614.34l2.82,12.88-448.78,526a6.76,6.76,0,0,1,1.79.56,7,7,0,0,1,2.7,9.51l-.2.27c1.36.89,2.7,1.79,4,2.74l.21-.31a7,7,0,0,1,10.67,9l-.25.25q1.72,1.68,3.36,3.45l.25-.25a7,7,0,0,1,9.83,1.12A6.75,6.75,0,0,1,1157.49,1185.79Zm-568.86-.66a15,15,0,0,1,.2,2,14.82,14.82,0,1,1-24.59-11.05,14.82,14.82,0,0,1,9.78-3.76A14.78,14.78,0,0,1,588.63,1185.13ZM966.84,926.39l-40.59,24.42-27.89,16.77L866,987,633.52,1126.9l-8,4.8L646,1102.13l138.15-200,21.38-31L824,844.43l76.91-111.34Z" transform="translate(-148.28 -333.82)"/><path class="cls-8" d="M1106.82,1434.33a6.85,6.85,0,1,1,7.94-5.57A6.85,6.85,0,0,1,1106.82,1434.33Z" transform="translate(-148.28 -333.82)"/><path class="cls-5" d="M987.61,1282c.2-.13.33-.33.54-.44l.28-.11c-.16-.37-.29-.74-.44-1.11-.45-1.11-.9-2.22-1.32-3.35l-.34.14a6.93,6.93,0,0,1-2,.28,7,7,0,0,1-2-13.7l.32-.07c-.34-1.57-.6-3.16-.86-4.75l-.35.06h-.6a7,7,0,0,1-.61-13.93h.33c0-1.59,0-3.19.08-4.8h-.36a7.06,7.06,0,0,1-6.2-7.74l.05-.09v-.28A7.1,7.1,0,0,1,982,1226l.35.07c.3-1.61.63-3.19,1-4.77l-.33-.06a7,7,0,1,1,4.24-13.33l.31.14c.6-1.5,1.22-3,1.89-4.43l-.34-.13a7,7,0,0,1,6.81-12.22l.28.2c.88-1.35,1.78-2.68,2.73-4l-.31-.18a7,7,0,0,1-.79-9.83,7.35,7.35,0,0,1,7.71-2,6.64,6.64,0,0,1,2.12,1.18l.22.27c.45-.46.92-.89,1.38-1.34.7-.69,1.39-1.38,2.1-2l-.25-.25a7,7,0,0,1,10.95-8.71l.18.27c1.33-.92,2.69-1.77,4.07-2.62l-.19-.26a7,7,0,1,1,12.4-6.48l.12.32c1.48-.64,3-1.2,4.51-1.76l-.16-.33a6.87,6.87,0,0,1,.13-3.87,6.77,6.77,0,0,1,3.71-4.3l8.81,64.24a39.66,39.66,0,1,0,28.39-5l-10.47-60.62a6.84,6.84,0,0,1,1.54,3.63v.33c1.6,0,3.22,0,4.84.11v-.35a7,7,0,0,1,7.69-6.2,7.25,7.25,0,0,1,2.75.95,7,7,0,0,1,3.45,6.79l-.11.35q2.4.43,4.74,1l.08-.36a7,7,0,0,1,13.32,4.24l-.16.33c1.5.6,3,1.22,4.46,1.89l.13-.31a6.87,6.87,0,0,1,7.72-3.31,6.76,6.76,0,0,1,1.79.56,7,7,0,0,1,2.7,9.51l-.2.27c1.36.89,2.7,1.79,4,2.74l.21-.31a7,7,0,0,1,10.67,9l-.25.25q1.72,1.68,3.36,3.45l.25-.25a7,7,0,0,1,9.83,1.12,6.75,6.75,0,0,1,1.14,6.22,6.82,6.82,0,0,1-2.25,3.57l-.3.17c.92,1.33,1.79,2.7,2.64,4.09l.31-.2a7,7,0,1,1,6.43,12.39l-.31.12c.63,1.48,1.19,3,1.76,4.49l.32-.13a7,7,0,0,1,3.92,13.47l-.32,0c.33,1.56.58,3.15.83,4.73l.37-.07a7,7,0,1,1,1.17,13.94l-.33,0c0,1.6,0,3.21-.1,4.82h.34a7,7,0,0,1-.75,13.93l-.79,0-.33-.07c-.29,1.59-.61,3.16-1,4.71l.33.07a7,7,0,0,1-2.1,13.66,6.72,6.72,0,0,1-2.1-.33l-.33-.14c-.6,1.49-1.2,3-1.87,4.44l.3.13a7,7,0,0,1-3.36,13.14,7.48,7.48,0,0,1-3.4-.88l-.28-.2c-.88,1.35-1.77,2.67-2.7,4l.27.19a7,7,0,0,1,.84,9.83,6.9,6.9,0,0,1-5.36,2.52,7.06,7.06,0,0,1-4.47-1.63l-.26-.27c-1.13,1.16-2.28,2.28-3.47,3.38l.23.24a6.91,6.91,0,0,1-1.07,9.79,6.72,6.72,0,0,1-4.38,1.54,7,7,0,0,1-5.45-2.61l-.17-.27c-1.33.91-2.67,1.77-4,2.62l.2.31a7,7,0,0,1-3,9.41,7.35,7.35,0,0,1-3.22.79,6.9,6.9,0,0,1-6.2-3.77l-.12-.3c-1.48.64-3,1.21-4.49,1.77l.14.34a6.92,6.92,0,0,1-3.44,8,6.76,6.76,0,0,1-1.36.71,6.9,6.9,0,0,1-1.91.28,7.11,7.11,0,0,1-6.76-5l-.06-.33c-1.56.33-3.14.59-4.72.84l.07.37a7,7,0,0,1-6.38,7.55h-.61a6.89,6.89,0,0,1-4.84-2,7,7,0,0,1-2.11-4.36v-.32c-1.61,0-3.22,0-4.85-.09v.36a6.92,6.92,0,0,1-6.9,6.2l-.79-.05a7,7,0,0,1-6.2-7.68l.07-.35c-1.58-.29-3.15-.61-4.71-1l-.07.34a7,7,0,0,1-6.66,4.89,6.4,6.4,0,0,1-2.1-.33,7,7,0,0,1-4.57-8.76l.15-.33c-1.5-.6-3-1.2-4.45-1.87l-.13.29a7,7,0,0,1-6.15,3.64,6.79,6.79,0,0,1-3.35-.89,7,7,0,0,1-2.75-9.46l.2-.3c-1.35-.88-2.69-1.76-4-2.71l-.17.26a7.08,7.08,0,0,1-5.36,2.52,7,7,0,0,1-5.36-11.51l.24-.24c-1.15-1.12-2.28-2.26-3.37-3.44l-.23.22a7,7,0,0,1-4.38,1.54,7,7,0,0,1-4.38-12.44l.27-.18c-.91-1.32-1.77-2.67-2.62-4l-.31.2a7.11,7.11,0,0,1-3.21.79,7,7,0,0,1-5.93-3.39c-.08-.14-.2-.24-.27-.38A7,7,0,0,1,987.61,1282Z" transform="translate(-148.28 -333.82)"/><path class="cls-6" d="M1647.89,747.17c3.89,1.41,6.9,4.46,8.2,10.3l2.38,12.76c1.44,7.73,3.48,18.66,6,31.94,2,10.92,4.39,23.4,6.94,37,18.75,99.71,48.87,258.06,55.43,281.69,2,7.09,4.21,13.77,6.51,20,2.85,7.62,5.8,14.45,8.52,20.23l.43.91c1.83,3.84,3.53,7.2,5,10,.75,1.43,1.44,2.68,2.06,3.8,2,3.54,3.21,5.54,3.21,5.54a10.32,10.32,0,0,1,.51,1.37,11.6,11.6,0,0,1,.62,3.64,12,12,0,0,1-2.55,7.42,11.43,11.43,0,0,1-2.62,2.43,10.59,10.59,0,0,1-8,1.53,11.71,11.71,0,0,1-1.46-.39,18,18,0,0,1-6.86-4.29,29.67,29.67,0,0,1-2.37-2.55s-.85-1.32-2.24-3.62l-.6-1c-1.51-2.51-3.54-6-5.89-10.17-.47-.85-1-1.73-1.46-2.65-3.19-5.81-6.81-12.79-10.44-20.51-3.28-7-6.56-14.57-9.49-22.43-1.67-4.49-4.54-14.66-8.24-28.82-2.54-9.74-5.47-21.36-8.68-34.36-15.07-61.06-36.21-152.14-51.26-217.65-3.11-13.53-6-26-8.43-36.82-3-13.22-5.5-24.08-7.23-31.73L1613,768.25c-1.67-6-.52-10.33,2.26-13.5,3.6-4.11,10-6.27,16.49-7.53C1637.48,746.12,1643.3,745.51,1647.89,747.17Z" transform="translate(-148.28 -333.82)"/><path class="cls-5" d="M1612.72,540.44l.61,2.78A5.71,5.71,0,0,1,1609,550l-45.12,9.89a5.72,5.72,0,0,1-6.79-4.35l-.61-2.78a5.71,5.71,0,0,1,4.35-6.78l45.12-9.89A5.72,5.72,0,0,1,1612.72,540.44Z" transform="translate(-148.28 -333.82)"/><path class="cls-5" d="M1639,687a5.71,5.71,0,0,1,6.78,4.35l.61,2.78a5.71,5.71,0,0,1-4.34,6.78l-3.64.8-32.69,7.16-8.8,1.93a5.71,5.71,0,0,1-6.78-4.35l-.61-2.78a5.71,5.71,0,0,1,4.35-6.78l.89-.2,43.33-9.49Z" transform="translate(-148.28 -333.82)"/><path class="cls-9" d="M1547.13,381.87c.81,2.54.31,1.62-3,2.68,0,0-81.83,34.58-92.64,32.95s-17-20.28-9.62-28.71,92.07-36.35,92.07-36.35c3.33-1.07,3.07-2.3,3.89.25l.69,2.15,8,25.09Z" transform="translate(-148.28 -333.82)"/><path class="cls-3" d="M1057.65,1241.59a18.65,18.65,0,1,0,30.61-12.18l-4.26-24.68a39.74,39.74,0,1,1-28.39,5l3.62,26.36A18.37,18.37,0,0,0,1057.65,1241.59Z" transform="translate(-148.28 -333.82)"/><path class="cls-8" d="M1094.72,1245.64a18.65,18.65,0,1,1-37.07-4.05,18.37,18.37,0,0,1,1.58-5.5l1.1,8.08a15,15,0,1,0,29.69-4.52l-1.76-10.24A18.63,18.63,0,0,1,1094.72,1245.64Z" transform="translate(-148.28 -333.82)"/><path class="cls-8" d="M1050.34,1069.93a6.86,6.86,0,1,1,6.85-6.86A6.86,6.86,0,0,1,1050.34,1069.93Z" transform="translate(-148.28 -333.82)"/><path class="cls-7" d="M882.94,680.54l-.57.23a8.23,8.23,0,0,1-10.61-4.67l-4.38-11.28a8.21,8.21,0,0,1,4.67-10.6l9-3.48,31.14-12.1,3.41-1.32A8.23,8.23,0,0,1,926.16,642l4.38,11.27a8.2,8.2,0,0,1-3.72,10.12,9.43,9.43,0,0,1-1,.49Z" transform="translate(-148.28 -333.82)"/><path class="cls-7" d="M814.77,581.64a54.32,54.32,0,0,0,20,4.52c.82,0,1.63.12,2.46.12A61.64,61.64,0,0,0,853,584.2a5.44,5.44,0,0,1,2.79,10.51h0a75.87,75.87,0,0,1-7.85,1.6,72.85,72.85,0,0,1-10.76.84,65.57,65.57,0,0,1-26.93-5.6,40.38,40.38,0,0,1-15.79-13.13c4-.43,8.42-1,13-1.67A26.94,26.94,0,0,0,814.77,581.64Z" transform="translate(-148.28 -333.82)"/><path class="cls-10" d="M709.21,474.47c-.28-9.56,2.12-17.06,9.26-17.76,15.69-1.54,174.69,50.27,244,52,51.12,1.24,34.77,45.3,1.16,49.17-17.14,2-45.45,4.6-75.67,6.4-6.15.37-12.37.7-18.6,1-7,1.5-15,3.16-23.41,4.81-12.73,2.5-26.3,5-38.42,6.73-4.59.67-9,1.24-13,1.67-4.94.53-9.39.86-13.1.92C728.17,580.21,707.7,547.62,709.21,474.47Z" transform="translate(-148.28 -333.82)"/><path class="cls-4" d="M579.21,1201a14.75,14.75,0,0,1-15-24.88,14.82,14.82,0,0,1,9.78-3.76,14.78,14.78,0,0,1,14.61,12.79,15,15,0,0,1,.2,2A14.77,14.77,0,0,1,579.21,1201Z" transform="translate(-148.28 -333.82)"/><path class="cls-11" d="M803.81,565.8c19.19.89,42.37.47,65.53-.59-7,1.5-15,3.16-23.41,4.81-12.73,2.5-26.3,5-38.42,6.73-4.59.67-9,1.24-13,1.67-4.94.53-9.39.86-13.1.92-53.23.87-73.7-31.72-72.19-104.87.33,11.46,4.53,25.88,9.24,35.26C727.08,526.93,754.11,563.51,803.81,565.8Z" transform="translate(-148.28 -333.82)"/></svg>
`;

  return (
    <svg
      x={112}
      y={10}
      width={150}
      height={95}
      viewBox="0 0 2015.44 1278.73"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="دوچرخه"
      style={{
        background: "transparent",
        pointerEvents: "none",
      }}
      dangerouslySetInnerHTML={{
        __html: bicycleSvg
          .replace(/<svg\b[^>]*>/, "")
          .replace(/<\/svg>\s*$/, "")
          .replace(/<defs>[\s\S]*?<\/defs>/, "")
          .replace(
            /class="cls-(\d+)"/g,
            (_, number: string) => {
              const colors: Record<string, string> = {
              "1": "rgba(65, 65, 217, 0.13)",
              "2": "rgba(65, 65, 217, 0.20)",
              "3": "rgba(65, 65, 217, 0.20)",
              "4": "rgba(65, 65, 217, 0.07)",
              "5": "rgba(65, 65, 217, 0.13)",
              "6": "rgba(65, 65, 217, 0.07)",
              "7": "rgba(65, 65, 217, 0.20)",
              "8": "rgba(65, 65, 217, 0.40)",
              "9": "rgba(65, 65, 217, 0.40)",
              "10": "rgba(65, 65, 217, 0.40)",
              "11": "rgba(65, 65, 217, 0.45)",
            };

              return `fill="${colors[number]}"`;
            },
          ),
      }}
    />
  );
}



function QuestPathTrackerBox({
  isActive,
}: {
  isActive: boolean;
}) {

  return (
    <div
    
  className="mt-10 flex w-full max-w-[1380px] flex-col gap-2 overflow-clip"
  data-roadmap-active={isActive ? "true" : "false"}
>
  <style>{`
    /* Only the horizontal axis is scrollable while roadmap elements enter. */
    .quest-roadmap-scroll::-webkit-scrollbar:vertical {
      width: 0;
    }
    @keyframes questRoadmapEnter {
      0% {
        opacity: 0;
        transform: translateY(18px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes questRoadmapLineEnter {
      0% {
        opacity: 0;
        clip-path: inset(0 100% 0 0);
      }

      15% {
        opacity: 1;
      }

      100% {
        opacity: 1;
        clip-path: inset(0 0 0 0);
      }
    }


    [data-roadmap-active] .quest-roadmap-item,
    [data-roadmap-active] .quest-roadmap-line {
      opacity: 0;
      animation: none;
    }

    [data-roadmap-active="true"] .quest-roadmap-item {
      animation-name: questRoadmapEnter;
      animation-duration: 850ms;
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      animation-fill-mode: both;
    }

    @media (prefers-reduced-motion: reduce) {
      [data-roadmap-active] .quest-roadmap-item,
      [data-roadmap-active] .quest-roadmap-line {
        animation: none;
        clip-path: none;
        opacity: 1;
        transform: none;
      }
    }
  @keyframes questLineReveal {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes questConnectorFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.quest-line-reveal-window {
  transform-origin: 0 0;
  transform: scaleX(0);
}

[data-roadmap-active="true"] .quest-line-reveal-window {
  animation: questLineReveal 1800ms ease-in-out both;
}

[data-roadmap-active="true"] .quest-roadmap-line {
  animation: questConnectorFade 450ms ease-out both;
}

.quest-roadmap-connector {
  opacity: 0;
}

[data-roadmap-active="true"] .quest-roadmap-connector {
  animation: questConnectorFade 600ms ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  [data-roadmap-active] .quest-line-reveal-window {
    animation: none;
    transform: scaleX(1);
  }

  [data-roadmap-active] .quest-roadmap-line,
  [data-roadmap-active] .quest-roadmap-connector {
    animation: none;
    opacity: 1;
  }
}

@keyframes questBicycleEnter {
  from {
    opacity: 0;
    transform: translate(-28px, 8px);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

[data-roadmap-active] .quest-bicycle-enter {
  opacity: 0;
  animation: none;
}

[data-roadmap-active="true"] .quest-bicycle-enter {
  animation: questBicycleEnter 1000ms
    cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
}

@media (prefers-reduced-motion: reduce) {
  [data-roadmap-active] .quest-bicycle-enter {
    animation: none;
    opacity: 1;
    transform: none;
  }
}


  `}
  </style>

      <div
          className="w-full rounded-[30px] border border-gray-100 bg-white p-0 shadow-sm"
          style={{ padding: "40px 40px 40px 40px" }}

          >
      <div className="mb-4 flex flex-col items-start gap-2 text-right" dir="rtl">
        <p
          className="text-[20px] font-[800] text-[#370080]"
          style={{ ...F, color: "#370080", fontWeight: 800 }}
        >
          مستمر خرید کن
        </p>

        <p
          className="text-[16px] font-[300] text-[#370080]"
          style={{ ...F, color: "#370080", fontWeight: 300 }}
        >
          تا آخر فصل کیف پولت شارژ بشه.
        </p>
      </div>



        {/* Desktop / Tablet Serpentine Timeline (Exact match to reference image) */}
        <div
            data-entrance="self-animated"
            className="quest-roadmap-scroll relative mx-auto mt-6 hidden w-[100%] overflow-x-auto overflow-y-hidden md:block"
            dir="ltr"
          >

          <svg
            viewBox="0 0 1240 670"
            className="block h-auto w-full min-w-[768px] overflow-hidden select-none"
            style={F}
          >
            {/* Main Serpentine Connecting Line (starts from step 1, no line from start pill to step 1) */}
              <path
                className="quest-roadmap-line"
                d="M 410 70 L 1065 70 A 95 95 0 0 1 1065 260 L 135 260 A 95 95 0 0 0 135 450 L 450 450"
                fill="none"
                stroke="rgba(65, 65, 217, 0.20)"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

            {/* Outline Bicycle */}
            {/* Bicycle */}

            <g className="quest-bicycle-enter">
              <RoadmapBicycle />
            </g>


            {/* Steps 1 to 9 */}
            {questMilestones.map((m) => {
              const pillW = 68;
              const pillH = 40;
              const pillBottomY = m.y + pillH / 2;
              const elbowY = pillBottomY + 42;
              const elbowX = m.x + 20;
              const cornerR = 8;
              const boxX = elbowX + 4;
              const boxY = pillBottomY + 6;
              const boxW = 225;
              const boxH = 120;
              const isStep5 = m.step === 5;
              const isStep1To4 = m.step >= 1 && m.step <= 4;
              const pillBg = isStep5
                ? "#ffffff"
                : isStep1To4
                ? "#370080"
                : "#4141d910";

              const isDisabled = m.step >= 5 && m.step <= 9;

              const pillTextColor = isStep5
                ? "#CA165C"
                : isStep1To4
                ? "#ffffff"
                : "#4141d9";


              return (
                <g
                    key={m.step}
                    className="quest-roadmap-item"
                    style={{
                      animationDelay: `${250 + (m.step - 1) * 140}ms`,
                    }}
                  >

                <path
                  d={`M ${m.x} ${pillBottomY} L ${m.x} ${elbowY - cornerR} Q ${m.x} ${elbowY} ${m.x + cornerR} ${elbowY} L ${elbowX} ${elbowY}`}
                  fill="none"
                  stroke="rgba(65, 65, 217, 0.20)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />


                  {/* Numbered Pill */}
                  {isStep1To4 && (
                    <g>
                      <circle
                        cx={m.x}
                        cy={m.y - pillH / 2 - 14}
                        r="10"
                        fill="#4141d9"
                      />
                      <path
                        d={`M ${m.x - 4.5} ${m.y - pillH / 2 - 14} L ${m.x - 1.2} ${m.y - pillH / 2 - 10.5} L ${m.x + 4.8} ${m.y - pillH / 2 - 17.5}`}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}
                    {/* لایهٔ پوشاننده برای مخفی کردن خط پشت شماره */}
                    <rect
                      x={m.x - pillW / 2}
                      y={m.y - pillH / 2}
                      width={pillW}
                      height={pillH}
                      rx={pillH / 2}
                      fill="#ffffff"
                    />

                    {/* پس‌زمینه و حاشیهٔ اصلی شماره */}
                    <rect
                      x={m.x - pillW / 2}
                      y={m.y - pillH / 2}
                      width={pillW}
                      height={pillH}
                      rx={pillH / 2}
                      fill={pillBg}
                      stroke={isStep5 ? "#CA165C" : "none"}
                      strokeWidth={isStep5 ? "2" : "0"}
                    />

                  <text
                    x={m.x}
                    y={m.y + 6}
                    textAnchor="middle"
                    fill={pillTextColor}
                    fontSize="16"
                    fontWeight="900"
                  >
                    {toPersianNum(m.step)}
                  </text>

                  {/* Step Info Box with #370080 20% background */}
            {/* Step Info Box */}
            <foreignObject
              x={boxX}
              y={boxY}
              width={boxW}
              height={boxH}
              style={{ overflow: "visible", position: "relative", zIndex: 10 }}

            >
              <div className="group inline-block cursor-pointer p-2">
                <div
                  dir="rtl"
                  className="inline-flex min-w-[175px] flex-col rounded-2xl border border-gray-100 bg-white px-6 py-4 text-right shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2"
                  style={{
                    backgroundColor: isDisabled ? "#fefefe" : "#f5f2f9",
                    ...F,
                  }}

                >
      <p
        className="text-[14px] font-semibold leading-6"
        style={{
          color: isDisabled ? "#4141D940" : "#370080",
          fontWeight: 600,
        }}
      >
        {m.title}
      </p>

      <p
        className="mt-0.5 text-[14px] font-light leading-6"
        style={{
          color: isDisabled ? "#4141D940" : "#370080",
          fontWeight: 300,
        }}
      >
        {m.subtitle}
      </p>

      {m.reward && (
        <p
          className="mt-0.5 text-[14px] font-extrabold leading-6"
          style={{ color: isDisabled ? "#4141D940" : "#CA165C" }}
        >
          {m.reward}
        </p>
      )}
    </div>
  </div>
</foreignObject>


                </g>
              );
            })}
          </svg>
        </div>

        {/* Mobile Fallback Vertical Path */}
        <div className="relative mt-2 space-y-4 md:hidden" dir="rtl">
          <div
            className="absolute bottom-4 right-6 top-16 w-[1.5px]"
            style={{ backgroundColor: "#f3f4f6" }}
          />
          <div
            className="relative z-10 inline-flex items-center rounded-full px-5 py-2.5 text-xs font-black text-white"
            style={{ backgroundColor: "#370080", ...F }}
          >
            مسیر خرید مستمر و جوایز
          </div>
          {questMilestones.map((m) => {
            const isStep5 = m.step === 5;
            const isStep1To4 = m.step >= 1 && m.step <= 4;
            return (
            <div key={m.step} className="relative flex items-start gap-3.5 pr-1">
              <div
                className="relative z-10 flex h-8 w-12 shrink-0 items-center justify-center rounded-full text-xs font-black"
                style={{
                backgroundColor: isStep5
                  ? "#ffffff"
                  : isStep1To4
                  ? "#370080"
                  : "#f5f2f9",
                color: isStep5
                  ? "#CA165C"
                  : isStep1To4
                  ? "#ffffff"
                  : "#370080",

                  border: isStep5 ? "2px solid #CA165C" : "none",
                  ...F,
                }}
              >
                {isStep1To4 && (
                  <span className="absolute -top-2.5 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-[#370080] text-white">
                    <Check className="size-2.5 stroke-[3]" />
                  </span>
                )}
                {toPersianNum(m.step)}
              </div>
<div className="group flex-1 cursor-pointer">
  <div
    className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform group-hover:-translate-y-1.5"
    style={{
      backgroundColor:
        m.step >= 5 && m.step <= 9 ? "#fefefe" : "#ffffff",
      ...F,
    }}
  >
    <p
      className="text-[14px] font-semibold"
      style={{
        color: m.step >= 5 && m.step <= 9 ? "#6a7282" : "#1E2939",
        fontWeight: 600,
      }}
    >
      {m.title}
    </p>

    <p
      className="mt-1 text-[14px] font-light"
      style={{ color: "#6a7282", fontWeight: 300 }}
    >
      {m.subtitle}
    </p>

    {m.reward && (
      <p
        className="mt-1 text-[14px] font-extrabold"
        style={{
          color: m.step >= 5 && m.step <= 9 ? "#6a7282" : "#CA165C",
        }}
      >
        {m.reward}
      </p>
    )}
  </div>
</div>

            </div>
            );
          })}
        </div>

        {/* مجموع شارژ کیف پول خرید مستمر */}
                <div
                  dir="rtl"
                  style={F}
                  className="mx-auto mt-6 flex w-[90%] items-center justify-between gap-4
                    rounded-2xl bg-[#370080] px-5 py-3.5 text-white shadow-sm"

                >
                  <span className="text-[600] font-[16px]">
                    مجموع شارژ کیف پول شما از خرید مستمر
                  </span>

                  <span className="shrink-0 rounded-xl bg-white/15 px-3.5 py-1 text-base font-black text-white">
                    180000 تومان
                  </span>
                </div>
        
      </div>
    </div>
  );
}

interface AlbumBarItem {
  id: string;
  name: string;
  count: number;
}

const albumDiversityData: AlbumBarItem[] = [
  { id: "pantonext", name: "پنتونکست", count: 9 },
  { id: "texture3", name: "تکسچر 3", count: 8 },
  { id: "motive", name: "موتیو", count: 5 },
  { id: "newera", name: "نیوارا", count: 7 },
  { id: "freestyle", name: "فری استایل", count: 4 },
];

const ALBUM_CHART_H = 280;
const ALBUM_MAX_Y = 10;
const ALBUM_BASELINE = 7;

const diversityRewardTiers = [
  { id: "tier-0", label: "کمتر از ۵۰ درصد", min: 0, max: 50, amount: 0 },
  { id: "tier-1", label: "۵۰–۷۰ درصد", min: 50, max: 70, amount: 3500000 },
  { id: "tier-2", label: "۷۰–۹۰ درصد", min: 70, max: 90, amount: 5000000 },
  { id: "tier-3", label: "۹۰–۱۰۰ درصد", min: 90, max: 101, amount: 7000000 },
];

function AlbumDiversityChartBox({ isActive }: { isActive: boolean }) {
  const [hoveredAlbumIdx, setHoveredAlbumIdx] = useState<number | null>(null);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    setBarsVisible(false);
    setHoveredAlbumIdx(null);

    if (!isActive) return;

    // فرصت کوتاه برای نمایش تب و ثبت حالت اولیه ستون‌ها
    const timer = window.setTimeout(() => {
      setBarsVisible(true);
    }, 60);

    return () => window.clearTimeout(timer);
  }, [isActive]);

  const yTicks = Array.from({ length: ALBUM_MAX_Y + 1 }, (_, i) => ALBUM_MAX_Y - i);
  const baselineBottomPct = (ALBUM_BASELINE / ALBUM_MAX_Y) * 100;
  const totalAlbums = albumDiversityData.length;
  const qualifiedAlbums = albumDiversityData.filter((a) => a.count >= ALBUM_BASELINE).length;
  const diversityPercent = Math.round((qualifiedAlbums / totalAlbums) * 100);
  const activeTier =
    diversityRewardTiers.find(
      (t) => diversityPercent >= t.min && diversityPercent < t.max
    ) ?? diversityRewardTiers[0];
  const walletReward = activeTier.amount;

  return (
    <div className="mt-10 flex w-full max-w-[1380px] flex-col gap-2">
      <style>{`
      .album-diversity-bar {
  transform-origin: center bottom;
  transform: scaleY(0);
  opacity: 0;
  transition:
    transform 850ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 500ms ease-out;
}

.album-diversity-bar[data-visible="true"] {
  transform: scaleY(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .album-diversity-bar {
    transition: none !important;
  }
}

.album-summary-card {
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (hover: hover) and (pointer: fine) {
  .album-summary-card:hover {
    transform: translateY(-5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .album-summary-card {
    transition: none;
  }

  .album-summary-card:hover {
    transform: none;
  }
}

      .album-baseline-badge {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        font-family: inherit;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.5;
        padding: 15px 20px;
        color: #ffffff;
        background: #370080;
        border: #ffffff 1px;
        border-radius: 12px;
        transition: box-shadow 0.2s;
      }

        @keyframes albumBaselineFadeBounce {
          0% {
            opacity: 0;
            transform: translate(-50%, 14px) scale(0.94);
          }

          55% {
            opacity: 1;
            transform: translate(-50%, -7px) scale(1.02);
          }

          75% {
            transform: translate(-50%, 3px) scale(0.99);
          }

          90% {
            transform: translate(-50%, -2px) scale(1);
          }

          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        .album-baseline-badge[data-visible="false"] {
          opacity: 0;
          animation: none;
        }

        .album-baseline-badge[data-visible="true"] {
          animation: albumBaselineFadeBounce 800ms ease-out 300ms both;
        }

        @media (prefers-reduced-motion: reduce) {
          .album-baseline-badge[data-visible="true"] {
            animation: none;
            opacity: 1;
            transform: translateX(-50%);
          }
        }


      .album-baseline-badge::before,
      .album-baseline-badge::after {
        content: "";
        position: absolute;
        top: 51%;
        transform: translateY(-50%);
        width: 5px;
        height: 40%;
        background-color: #ffffff;
        transition: height 0.2s;
      }

      .album-baseline-badge::before {
        left: 0;
        border-radius: 45px;
      }

      .album-baseline-badge::after {
        right: 0;
        border-radius: 45px;
      }

      .album-baseline-badge:hover {
        box-shadow: 0 0.5em 1.5em -0.5em rgba(255, 255, 255, 100);
      }

      .album-baseline-badge:hover::before,
      .album-baseline-badge:hover::after {
        height: 60%;
      }

    `}</style>
      <div
        className="w-full rounded-[30px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
        style={{ padding: "40px" }}
      >
        <div
          className="mb-6 flex flex-wrap items-center justify-between gap-3"
          dir="rtl"
        >
          <div className="flex flex-col items-start gap-2">
            <p
              className="text-[20px] font-[800] text-[#370080]"
              style={{ ...F, color: "#370080", fontWeight: 800 }}
            >
              متنوع خرید کن
            </p>

            <p
              className="text-[16px] font-[300] text-[#370080]"
              style={{ ...F, color: "#370080", fontWeight: 300 }}
            >
              تا کیف پولت شارژ بشه
            </p>
          </div>
        </div>


        <div className="mt-13 mb-3 flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14" dir="rtl">
          {/* Right Side: Bar Chart */}
          <div className="w-full lg:w-3/5">
            <div className="flex gap-3" dir="ltr">
            {/* Y-axis (0 to 10) */}
            <div
              className="flex shrink-0 flex-col items-end justify-between pr-1"
              style={{ height: ALBUM_CHART_H }}
            >
              {yTicks.map((val) => (
                <span
                  key={`album-y-${val}`}
                  className={`text-[11px] leading-none ${
                    val === ALBUM_BASELINE ? "font-black text-[#CA165C]" : "text-gray-400"
                  }`}
                  style={F}
                >
                  {toPersianNum(val)}
                </span>
              ))}
            </div>

            {/* Plot area + X-axis */}
            <div className="min-w-0 flex-1">
              {/* Bars & Grid container */}
              <div className="relative" style={{ height: ALBUM_CHART_H }}>
                {/* Horizontal dashed grid lines for 0..10 */}
                {yTicks.map((val) => {
                  const topPct = ((ALBUM_MAX_Y - val) / ALBUM_MAX_Y) * 100;
                  const isBase = val === ALBUM_BASELINE;
                  return (
                    <div
                      key={`grid-${val}`}
                      className="pointer-events-none absolute left-0 right-0"
                      style={{
                        top: `${topPct}%`,
                        borderTop: isBase
                          ? "2px dashed #4141D930"
                          : "1px dashed #e5e7eb",
                        filter: isBase
                          ? "drop-shadow(0 0 4px #ca165c00)"
                          : undefined,
                        zIndex: isBase ? 15 : 1,

                      }}
                    >
                      {isBase && (
                        <span
                          dir="rtl"
                          className="album-baseline-badge"
                          data-visible={isActive && barsVisible ? "true" : "false"}
                          style={F}
                        >
                          خط مبنا: {toPersianNum(ALBUM_BASELINE)} رول
                        </span>


                      )}
                    </div>
                  );
                })}

                {/* Columns */}
                <div
                  className="relative z-auto flex h-full items-end justify-around gap-3 px-2 sm:gap-6 sm:px-6"
                  dir="rtl"
                >
                  {albumDiversityData.map((album, idx) => {
                    const heightPct = (album.count / ALBUM_MAX_Y) * 100;
                    const isHovered = hoveredAlbumIdx === idx;

                    return (
                      <div
                        key={album.id}
                        className="relative flex h-full flex-1 flex-col items-center justify-end"
                        onMouseEnter={() => setHoveredAlbumIdx(idx)}
                        onMouseLeave={() => setHoveredAlbumIdx(null)}
                      >
                {/* Hover Toggle Tooltip */}
                {isHovered && (
                  <div
                    dir="rtl"
                    className="pointer-events-none absolute z-[250] min-w-[170px] rounded-xl border border-[#370080]/15 bg-white px-3.5 py-2.5 text-[14px] font-normal shadow-lg transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
                    style={{
                      bottom: "calc(70% + 18px)", // بالاتر از خط مبنا و دکمه ۷ رول
                      left: "50%",
                      transform: "translate(-50%, 0)",
                      fontFamily: "'Vazirmatn', sans-serif",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-[#370080]">
                        {album.name}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between border-t  pt-1.5 text-[13px]">
                      <span className="text-[13px] font-[300] text-[#ca165c]">تعداد خرید:</span>
                      <span className="font-bold text-[#ca165c]">
                        {toPersianNum(album.count)} رول
                      </span>
                    </div>
                  </div>
                )}





                      {/* Bar */}
                      <div
                        className="album-diversity-bar relative z-[20] w-full max-w-[81px] cursor-pointer rounded-[17px]"
                        data-visible={isActive && barsVisible ? "true" : "false"}
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor:
                            album.count < ALBUM_BASELINE
                              ? "#E1D9EC"
                              : "#B9A6D3",

                          transitionDelay:
                            isActive && barsVisible
                              ? `${Math.min(idx * 75, 450)}ms`
                              : "0ms",
                        }}

                      />

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* X-axis: Album Names + Images */}
              <div
                className="mt-1 flex items-start justify-around gap-3 px-2 sm:gap-6 sm:px-6"
                dir="rtl"
              >
                {albumDiversityData.map((album) => (
                  <div
                    key={`label-${album.id}`}
                    className="flex flex-1 flex-col items-center text-center"
                  >
                    <p
                      className="text-[14px] font-light leading-6 text-[#1E2939]"
                      style={{
                        color: "#370080",
                        fontSize: "13px",
                        fontWeight: 300,
                        ...F,
                      }}
                    >
                      {album.name}
                    </p>
                    <div className="mt-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-white p-1 shadow-xs sm:h-20 sm:w-20">

                      <img
                        src="/images/album-cover.jpg"
                        alt={album.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>

            {/* Chart Legend */}
            <div
              className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs"
              dir="rtl"
              style={F}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: "#370080" }}
                />
                <span className="text-[#370080] text-[14px] font-[300]" >
                  تعداد خرید از آلبوم
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="h-0.5 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: "#4141D9" }}
                />
                <span className="text-[#4141D9] text-[14px] font-[300]">
                  خط مبنا ({toPersianNum(ALBUM_BASELINE)} عدد)
                </span>
              </div>
            </div>
          </div>


          {/* Left Side: Calculated Percentage & Wallet Charge Box */}
          <div className="mx-auto flex w-[80%] flex-col justify-between gap-3.5 lg:mx-0 lg:w-[32%]" dir="rtl" style={F}>
            <div className="grid grid-cols-2 gap-[24px]">
              {/* Square Box 1: Diversity Percentage */}
              <div className="album-summary-card flex aspect-square flex-col items-center justify-center rounded-[30px] border border-gray-100 bg-white p-3 text-center shadow-sm">
                <span className="text-2xl font-black text-[#370080] sm:text-3xl">
                  {toPersianNum(diversityPercent)}٪
                </span>
                <span
                  className="mt-1 text-[14px] font-semibold text-[#370080]"
                  style={{ color: "#370080", fontSize: "16px", fontWeight: 300 }}
                >
                  درصد تنوع
                </span>
              </div>

              {/* Square Box 2: Wallet Charge Amount */}
              <div className="album-summary-card flex aspect-square flex-col items-center justify-center rounded-[30px] border border-gray-100 bg-white p-2 text-center shadow-sm">

                <span
                  dir="ltr"
                  className="text-lg font-black text-[#CA165C] sm:text-xl"
                >
                  {walletReward > 0
                    ? `+${toPersianMoney(walletReward)}`
                    : toPersianNum(0)}
                </span>
                <span
                  className="mt-1 text-[14px] font-normal text-[#CA165C]"
                  style={{ color: "#CA165C", fontSize: "16px", fontWeight: 300 }}
                >
                  شارژ کیف پول دریافتی
                </span>
              </div>
            </div>

            {/* Reward Tiers Table */}
            <div className="mt-5 flex flex-col gap-3">
              <div
                className="grid grid-cols-2 rounded-2xl border border-gray-100 bg-[#370080]/[0.06] px-4 py-2.5 text-center text-[13px] font-light text-[#370080] shadow-sm"
                style={{ color: "#370080", fontSize: "14px", fontWeight: 600 }}
              >
                <span>درصد تنوع آلبوم در فروش</span>
                <span>مبلغ (تومان)</span>
              </div>
              <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                {diversityRewardTiers.map((tier) => {
                  const isCurrent = tier.id === activeTier.id;
                  return (
              <div
                key={tier.id}
                className="px-1 py-1.5"
              >
                <div
                  className={`relative isolate grid grid-cols-2 items-center px-3 py-1.5 text-center text-[13px] font-light ${
                    isCurrent
                      ? "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-1 before:-z-10 before:rounded-[11px] before:bg-[#4141d9]/10 before:content-['']"
                      : ""
                  }`}
                  style={{
                    color: isCurrent ? "#4141d9" : "#370080",
                    fontSize: "14px",
                    fontWeight: 300,
                  }}
                >
                  <span>{tier.label}</span>

                  <span
                    dir="ltr"
                    style={{
                      color: isCurrent ? "#4141d9" : "#370080",
                      fontSize: "14px",
                      fontWeight: 300,
                    }}
                  >
                    {tier.amount > 0
                      ? `+${toPersianMoney(tier.amount)}`
                      : toPersianNum(0)}
                  </span>
                </div>
              </div>


                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LotteryGaugeSegment {
  id: string;
  insideTop: string;
  insideBottom?: string;
  outsideLine1: string;
  outsideLine2: string;
  opacity: number;
  textColor: string;
  startDeg: number;
  endDeg: number;
}

const lotteryGaugeSegments: LotteryGaugeSegment[] = [
  {
    id: "seg-0",
    insideTop: "کمتر از",
    insideBottom: "٪۵۰",
    outsideLine1: "صفر شانس",
    outsideLine2: "قرعه‌کشی",
    opacity: 0.07,
    textColor: "#370080",
    startDeg: 180,
    endDeg: 152,
  },
  {
    id: "seg-1",
    insideTop: "از ٪۵۰ تا",
    insideBottom: "کمتر از ٪۶۰",
    outsideLine1: "۱ شانس",
    outsideLine2: "قرعه‌کشی",
    opacity: 0.14,
    textColor: "#370080",
    startDeg: 149.5,
    endDeg: 121.5,
  },
  {
    id: "seg-2",
    insideTop: "از ٪۶۰ تا",
    insideBottom: "کمتر از ٪۷۰",
    outsideLine1: "۲ شانس",
    outsideLine2: "قرعه‌کشی",
    opacity: 0.20,
    textColor: "#370080",
    startDeg: 119,
    endDeg: 91,
  },
  {
    id: "seg-3",
    insideTop: "از ٪۷۰ تا",
    insideBottom: "کمتر از ٪۸۰",
    outsideLine1: "۳ شانس",
    outsideLine2: "قرعه‌کشی",
    opacity: 0.26,
    textColor: "#370080",
    startDeg: 89,
    endDeg: 61,
  },
  {
    id: "seg-4",
    insideTop: "از ٪۸۰ تا",
    insideBottom: "کمتر از ٪۹۰",
    outsideLine1: "۴ شانس",
    outsideLine2: "قرعه‌کشی",
    opacity: 0.32,
    textColor: "#370080",
    startDeg: 58.5,
    endDeg: 30.5,
  },
  {
    id: "seg-5",
    insideTop: "٪۹۰",
    insideBottom: "به بالا",
    outsideLine1: "۵ شانس",
    outsideLine2: "قرعه‌کشی",
    opacity: 0.38,
    textColor: "#370080",
    startDeg: 28,
    endDeg: 0,
  },
];

function buildRoundedAnnularSectorPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number,
  cornerRadius = 8
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (r: number, deg: number) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy - r * Math.sin(toRad(deg)),
  });

  const dDegOuter = (cornerRadius / rOuter) * (180 / Math.PI);
  const dDegInner = (cornerRadius / rInner) * (180 / Math.PI);

  const sOut = startDeg - dDegOuter;
  const eOut = endDeg + dDegOuter;
  const sIn = startDeg - dDegInner;
  const eIn = endDeg + dDegInner;

  const pOutStartRadial = pt(rOuter - cornerRadius, startDeg);
  const pOutStartArc = pt(rOuter, sOut);
  const pOutCorner1 = pt(rOuter, startDeg);

  const pOutEndArc = pt(rOuter, eOut);
  const pOutEndRadial = pt(rOuter - cornerRadius, endDeg);
  const pOutCorner2 = pt(rOuter, endDeg);

  const pInEndRadial = pt(rInner + cornerRadius, endDeg);
  const pInEndArc = pt(rInner, eIn);
  const pInCorner2 = pt(rInner, endDeg);

  const pInStartArc = pt(rInner, sIn);
  const pInStartRadial = pt(rInner + cornerRadius, startDeg);
  const pInCorner1 = pt(rInner, startDeg);

  return [
    `M ${pOutStartRadial.x} ${pOutStartRadial.y}`,
    `Q ${pOutCorner1.x} ${pOutCorner1.y} ${pOutStartArc.x} ${pOutStartArc.y}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${pOutEndArc.x} ${pOutEndArc.y}`,
    `Q ${pOutCorner2.x} ${pOutCorner2.y} ${pOutEndRadial.x} ${pOutEndRadial.y}`,
    `L ${pInEndRadial.x} ${pInEndRadial.y}`,
    `Q ${pInCorner2.x} ${pInCorner2.y} ${pInEndArc.x} ${pInEndArc.y}`,
    `A ${rInner} ${rInner} 0 0 0 ${pInStartArc.x} ${pInStartArc.y}`,
    `Q ${pInCorner1.x} ${pInCorner1.y} ${pInStartRadial.x} ${pInStartRadial.y}`,
    "Z",
  ].join(" ");
}

const monthlyLotteryStats = [
  {
    id: "aban",
    monthTitle: "درصد رشد آبان ماه",
    growthPct: 55,
    chances: 1,
  },
  {
    id: "azar",
    monthTitle: "درصد رشد آذر ماه",
    growthPct: 75,
    chances: 3,
  },
  {
    id: "dey",
    monthTitle: "درصد رشد دی ماه",
    growthPct: 65,
    chances: 2,
  },
];

{/* Copied Diversity Reward Tiers Table */}
<div className="flex w-full flex-col gap-3" dir="rtl" style={F}>
  <div
    className="grid grid-cols-2 rounded-2xl border border-gray-100 bg-[#370080]/[0.06] px-4 py-2.5 text-center shadow-sm"
    style={{
      color: "#370080",
      fontSize: "14px",
      fontWeight: 600,
    }}
  >
    <span>درصد تنوع آلبوم در فروش</span>
    <span>مبلغ (تومان)</span>
  </div>

  <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
    {(() => {
      const total = albumDiversityData.length;
      const qualified = albumDiversityData.filter(
        (album) => album.count >= ALBUM_BASELINE
      ).length;

      const percent =
        total > 0 ? Math.round((qualified / total) * 100) : 0;

      const currentTier =
        diversityRewardTiers.find(
          (tier) => percent >= tier.min && percent < tier.max
        ) ?? diversityRewardTiers[0];

      return diversityRewardTiers.map((tier) => {
        const isCurrent = tier.id === currentTier.id;

        return (
          <div key={tier.id} className="px-1 py-1.5">
            <div
              className={`relative isolate grid grid-cols-2 items-center px-3 py-1.5 text-center ${
                isCurrent
                  ? "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-1 before:-z-10 before:rounded-[11px] before:bg-[#4141d9]/10 before:content-['']"
                  : ""
              }`}
              style={{
                color: isCurrent ? "#4141d9" : "#370080",
                fontSize: "14px",
                fontWeight: 300,
              }}
            >
              <span>{tier.label}</span>

              <span dir="ltr">
                {tier.amount > 0
                  ? `+${toPersianMoney(tier.amount)}`
                  : toPersianNum(0)}
              </span>
            </div>
          </div>
        );
      });
    })()}
  </div>
</div>

{/* Horizontal Total Chances Box */}

const lotteryMonthlySales: Record<
  string,
  { month: string; averageRolls: number | null }
> = Object.fromEntries(
  monthlyLotteryStats.map((item) => [
    item.id,
    {
      month:
        item.id === "aban"
          ? "آبان"
          : item.id === "azar"
          ? "آذر"
          : "دی",

      averageRolls: Math.round(20 * (1 + item.growthPct / 100)),
    },
  ])
);

function LotteryRadialGaugeBox({ isActive }: { isActive: boolean }) {
  const [gaugeVisible, setGaugeVisible] = useState(false);

  useEffect(() => {
    setGaugeVisible(false);
    setHoveredSegIdx(null);

    if (!isActive) return;

    // فرصت برای ثبت حالت اولیه، پس از نمایش تب
    const timer = window.setTimeout(() => {
      setGaugeVisible(true);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [isActive]);

    const [hoveredLotteryMonthId, setHoveredLotteryMonthId] =
    useState<string | null>(null);

  const hoveredMonthlySale = hoveredLotteryMonthId
    ? lotteryMonthlySales[hoveredLotteryMonthId]
    : null;

  const totalAlbums = albumDiversityData.length;
  const qualifiedAlbums = albumDiversityData.filter(
    (a) => a.count >= ALBUM_BASELINE
  ).length;

  const diversityPercent =
    totalAlbums > 0
      ? Math.round((qualifiedAlbums / totalAlbums) * 100)
      : 0;

  const activeTier =
    diversityRewardTiers.find(
      (t) => diversityPercent >= t.min && diversityPercent < t.max
    ) ?? diversityRewardTiers[0];

  const walletReward = activeTier.amount;


  const [selectedSegIdx, setSelectedSegIdx] = useState<number>(3);
  const [hoveredSegIdx, setHoveredSegIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const totalChances = monthlyLotteryStats.reduce((sum, item) => sum + item.chances, 0);
  const cx = 500;
  const cy = 380; // نمودار ۳۵ پیکسل بالاتر می‌رود و فضای پایین بازتر می‌شود
  const rInner = 145;
  const rOuter = 275;
  const rMid = (rInner + rOuter) / 2;

  const currentSegIdx = hoveredSegIdx ?? selectedSegIdx;
  const activeSeg = lotteryGaugeSegments[currentSegIdx] ?? lotteryGaugeSegments[0];
  const rawNeedleDeg = (activeSeg.startDeg + activeSeg.endDeg) / 2;
  // محدود کردن و نگاشت دقیق روی نیم‌دایره بالای صفحه (۰ تا ۱۸۰ درجه)
  const needleDeg = Math.max(0, Math.min(180, rawNeedleDeg));


  const needleGap = 8; // فاصلهٔ نوک پیکان تا باکس
  const needleRound = 6; // میزان گردی گوشه‌های پیکان
  const needleColor = "#370080"; // رنگ پیشنهادی: صورتی

  const needleLen = rInner - needleGap - needleRound / 2;


  const baseHalfW = 16;

  return (
    <div className="flex w-full flex-col gap-2 rounded-[30px] border border-gray-100 bg-white p-5 shadow-sm sm:p-10">
      <div className="w-full">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2" dir="rtl">
        <div className="flex flex-col items-start gap-2">
          <p
            className="text-[20px] font-[800] text-[#370080]"
            style={{ ...F, color: "#370080", fontWeight: 800 }}
          >
            رشد کن
          </p>

          <p
            className="text-[16px] font-[300] text-[#370080]"
            style={{ ...F, color: "#370080", fontWeight: 300 }}
          >
             شانس قرعه‌کشی بگیر
          </p>
        </div>

        </div>

        <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center" dir="rtl">
          {/* Right Side: Radial Gauge Chart */}
          <div className="relative w-full overflow-hidden lg:w-3/5" dir="ltr">
          <svg
            viewBox="145 55 710 365"
            className="h-auto w-full translate-x-[50px] select-none"
            style={F}
          >
            {lotteryGaugeSegments.map((seg, idx) => {
              const midDeg = (seg.startDeg + seg.endDeg) / 2;
              const midRad = (midDeg * Math.PI) / 180;

              const pathD = buildRoundedAnnularSectorPath(
                cx,
                cy,
                rInner,
                rOuter,
                seg.startDeg,
                seg.endDeg,
                22
              );

              // Inside label coordinates (Growth Percentage inside segment)
              const inX = cx + rMid * Math.cos(midRad);
              const inY = cy - rMid * Math.sin(midRad);

              // Outside label position directly in front of each segment with a small gap
              const labelR = rOuter + 32;
              const outX = cx + labelR * Math.cos(midRad);
              const outY = cy - labelR * Math.sin(midRad);
              const isSelected = selectedSegIdx === idx;

              return (
                  <g
                    key={seg.id}
                    style={{
                      opacity: gaugeVisible ? 1 : 0,

                      transform: !gaugeVisible
                        ? "translateY(0px) scale(0.97)"
                        : hoveredSegIdx === idx
                        ? "translateY(-3px) scale(1.02)"
                        : "translateY(0px) scale(1)",

                      transformBox: "fill-box",
                      transformOrigin: "center",

                      transition: gaugeVisible
                        ? `opacity 450ms ease ${idx * 90}ms, transform 350ms cubic-bezier(0.22, 1, 0.36, 1)`
                        : "none",

                      pointerEvents: gaugeVisible ? "auto" : "none",
                    }}


                    onMouseEnter={(event) => {
                      setSelectedSegIdx(idx);
                      setHoveredSegIdx(idx);

                      setTooltipPos({
                        x: event.clientX,
                        y: event.clientY,
                      });
                    }}
                    onMouseMove={(event) => {
                      setTooltipPos({
                        x: event.clientX,
                        y: event.clientY,
                      });
                    }}
                    onMouseLeave={() => setHoveredSegIdx(null)}
                    className="cursor-default transition-opacity"
                  >


                  {/* Rounded Gauge Segment (no stroke) */}
                    <path
                      d={pathD}
                      fill="#370080"
                      fillOpacity={seg.opacity}
                      style={{
                        filter:
                          hoveredSegIdx === idx
                            ? "drop-shadow(0px 2px 3px rgba(55, 0, 128, 0.10))"
                            : "drop-shadow(0px 0px 0px rgba(55, 0, 128, 0))",
                        transition: "filter 350ms ease",
                      }}
                    />

                  {/* Inside Text: Growth Percentage */}
                  <text
                    x={inX}
                    y={seg.insideBottom ? inY - 6 : inY + 4}
                    textAnchor="middle"
                    fill={seg.textColor}
                    fontSize="14"
                    fontWeight="500"
                    direction="rtl"
                  >
                    {seg.insideTop}
                  </text>
                  {seg.insideBottom && (
                    <text
                      x={inX}
                      y={inY + 14}
                      textAnchor="middle"
                      fill={seg.textColor}
                      fontSize="14"
                      fontWeight="500"
                      direction="rtl"
                    >
                      {seg.insideBottom}
                    </text>
                  )}

                  {/* Outside Text: Lottery Chances directly in front of segment */}
                </g>
              );
            })}

{/* Gauge Needle (Pointer) */}
<style>
  {`
    @keyframes lottery-needle-enter-spin {
      from {
        transform: rotate(-180deg);
      }
      to {
        transform: rotate(0deg);
      }
    }

    @keyframes lottery-needle-enter-fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .lottery-needle-enter {
      transform-origin: 0px 0px;
      transform-box: view-box;
      animation:
        lottery-needle-enter-spin 2200ms
        cubic-bezier(0.65, 0, 0.2, 1) 120ms both;
    }

    .lottery-needle-fade {
      animation:
        lottery-needle-enter-fade 650ms
        ease-out 120ms both;
    }

    @media (prefers-reduced-motion: reduce) {
      .lottery-needle-enter,
      .lottery-needle-fade {
        animation: none;
      }

      .lottery-needle-angle {
        transition: none !important;
      }
    }
  `}
</style>

        <g
          transform={`translate(${cx} ${cy})`}
          style={{ pointerEvents: "none" }}
        >
          {isActive && gaugeVisible && (
            <g className="lottery-needle-fade">
              {/* چرخش ورود، مستقل از زاویهٔ انتخاب‌شده */}
              <g className="lottery-needle-enter">
              <g
            className="lottery-needle-angle"
            style={{
              // چرخش دقیق روی نیم‌دایره بالا (از سمت چپ ۱۸۰ تا سمت راست ۰)
              transform: `rotate(${-needleDeg}deg)`,
              transformOrigin: "0px 0px",
              transformBox: "view-box",
              transition:
                "transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              willChange: "transform",
            }}
          >


                  <polygon
                    points={`0,${-baseHalfW} ${needleLen},0 0,${baseHalfW}`}
                    fill={needleColor}
                    stroke={needleColor}
                    strokeWidth={needleRound}
                    strokeLinejoin="round"
                  />
                </g>
              </g>

              {/* مرکز عقربه همراه با Fade-in */}
              <circle
                cx="0"
                cy="0"
                r="26"
                fill={needleColor}
              />

              <circle
                cx="0"
                cy="0"
                r="14"
                fill="#ffffff"
              />
            </g>
          )}
        </g>



          </svg>

        {hoveredSegIdx !== null && (
          <div
            dir="rtl"
            role="tooltip"
            className="pointer-events-none fixed z-20 flex h-[60px] w-[110px] items-center justify-center rounded-xl border border-[#370080]/15 bg-white p-6 text-[14px] font-light shadow-lg"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 14,
              transform: "translate(-50%, -100%)",
              fontFamily: "'Vazirmatn', sans-serif",
              fontWeight: 300,
            }}
          >
            <span style={{ color: "#ca165c", fontWeight: 700 }}>
              {5 - hoveredSegIdx} شانس
            </span>
          </div>
        )}


            <p
              dir="rtl"
              className="mt-4 w-full text-center text-[15px] font-[300] leading-6 text-[#ca165c] translate-x-[50px] "
              style={F}
            >
             <span style={{ fontWeight: 700 }}>توجه:</span>{" "}
              جهت مشاهده تعداد قرعه هر بازه، روی نمودار هاور کنید. 

            </p>


          </div>

          {/* Left Side: 3x4 Summary Box */}
          <div
            dir="rtl"
            style={F}
            className="flex w-full flex-col justify-center gap-5 lg:w-2/5"
          >


          {/* Diversity Percentage & Wallet Charge Cards */}
          <div className="w-full" dir="rtl" style={F}>
            <div className="grid grid-cols-2 gap-[24px]">
              {/* Square Box 1: Diversity Percentage */}
              <div className="album-summary-card flex aspect-square flex-col items-center justify-center rounded-[30px] border border-gray-100 bg-white p-3 text-center shadow-sm">
                <span className="text-2xl font-black text-[#370080] sm:text-3xl">
                  20 رول
                </span>

                <span
                  className="mt-1 text-[16px] font-light text-[#370080]"
                  style={{ color: "#370080", fontSize: "16px", fontWeight: 300 }}
                >
                 میانگین فروش دوماه اخیر شما

                </span>
              </div>

        {/* Monthly Average Sales Hover Card */}
        <div className="album-summary-card flex aspect-square flex-col items-center justify-center rounded-[30px] border border-gray-100 bg-white p-3 text-center shadow-sm">
          {hoveredMonthlySale ? (
            <>
              <span className="text-2xl font-black text-[#CA165C] sm:text-3xl">
                {hoveredMonthlySale.averageRolls !== null
                  ? `${toPersianNum(hoveredMonthlySale.averageRolls)} رول`
                  : "— رول"}
              </span>

              <span
                className="mt-1 text-[16px] font-light text-[#CA165C]"
                style={{
                  color: "#CA165C",
                  fontSize: "16px",
                  fontWeight: 300,
                }}
              >
                میانگین فروش {hoveredMonthlySale.month} ماه شما
              </span>
            </>
          ) : (
            <span
              className="text-[16px] font-light leading-7 text-[#CA165C]"
              style={{
                color: "#CA165C",
                fontSize: "16px",
                fontWeight: 300,
              }}
            >
              با هاور روی هر ردیف جدول میتوانید تعداد رول فروش رفته در هر ماه رو ببینید
            </span>
          )}
        </div>

            </div>
          </div>


            {/* Horizontal Total Chances Box */}

        {/* Lottery Monthly Table */}
        <div className="flex w-full flex-col gap-3" dir="rtl" style={F}>
          {/* Table Header */}
          <div
            className="grid grid-cols-[0.7fr_1.6fr_0.8fr] items-center gap-2 rounded-2xl border border-gray-100 bg-[#370080]/[0.06] px-3 py-3 text-center shadow-sm"
            style={{
              color: "#370080",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <span>ماه</span>
            <span>درصد تنوع آلبوم در فروش</span>
            <span>تعداد شانس</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {monthlyLotteryStats.map((item) => (
          <div
            key={item.id}
            tabIndex={0}
            onMouseEnter={() => setHoveredLotteryMonthId(item.id)}
            onMouseLeave={() => setHoveredLotteryMonthId(null)}
            onFocus={() => setHoveredLotteryMonthId(item.id)}
            onBlur={() => setHoveredLotteryMonthId(null)}
            className={`relative isolate grid grid-cols-[0.7fr_1.6fr_0.8fr] items-center gap-2 px-3 py-4 text-center transition-colors duration-200 before:pointer-events-none before:absolute before:inset-x-1 before:inset-y-1.5 before:-z-10 before:rounded-[11px] before:bg-[#4141d9]/10 before:transition-opacity before:duration-200 before:content-[''] ${
              hoveredLotteryMonthId === item.id
                ? "before:opacity-100"
                : "before:opacity-0"
            }`}
            style={{
              color:
                hoveredLotteryMonthId === item.id
                  ? "#4141d9"
                  : "#370080",
              fontSize: "14px",
              fontWeight: 300,
            }}
          >

                <span>
                  {{
                    aban: "آبان",
                    azar: "آذر",
                    dey: "دی",
                  }[item.id]}
                </span>

                <span>{toPersianNum(item.growthPct)}٪</span>

                <span>{toPersianNum(item.chances)}</span>
              </div>
            ))}
          </div>
        </div>



            <div className="flex items-center justify-between rounded-2xl bg-[#370080] px-5 py-3.5 text-white shadow-sm">
              <span className="text-sm font-bold">مجموع شارژ کیف پول شما از رشد فروش</span>
              <span className="rounded-xl bg-white/15 px-3.5 py-1 text-base font-black text-white">
                {toPersianNum(totalChances)} شانس
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UploadSlotConfig {
  id: "before" | "after" | "video";
  title: string;
  subtitle: string;
  accept: string;
  maxSizeMB: number;
  maxSizeLabel: string;
  type: "image" | "video";
}

const decorUploadSlots: UploadSlotConfig[] = [
  {
    id: "before",
    title: "آپلود عکس قبل از تغییر",
    subtitle: "فرمت‌های مجاز: JPG, PNG, WEBP",
    accept: "image/*",
    maxSizeMB: 10,
    maxSizeLabel: "حداکثر حجم مجاز: ۱۰ مگابایت",
    type: "image",
  },
  {
    id: "after",
    title: "آپلود عکس بعد از تغییر",
    subtitle: "فرمت‌های مجاز: JPG, PNG, WEBP",
    accept: "image/*",
    maxSizeMB: 10,
    maxSizeLabel: "حداکثر حجم مجاز: ۱۰ مگابایت",
    type: "image",
  },
  {
    id: "video",
    title: "آپلود فیلم",
    subtitle: "فرمت‌های مجاز: MP4, MOV, WEBM",
    accept: "video/*",
    maxSizeMB: 50,
    maxSizeLabel: "حداکثر حجم مجاز: ۵۰ مگابایت",
    type: "video",
  },
];

interface UploadedFileState {
  file: File;
  previewUrl: string;
}

function DecorChallengeUploadBox() {
  const [uploads, setUploads] = useState<Record<string, UploadedFileState | null>>({
    before: null,
    after: null,
    video: null,
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({
    before: null,
    after: null,
    video: null,
  });
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const uploadsRef = useRef(uploads);
  uploadsRef.current = uploads;

  useEffect(() => {
    return () => {
      Object.values(uploadsRef.current).forEach((item) => {
        if (item?.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  const handleFileChange = (slot: UploadSlotConfig, fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    const maxBytes = slot.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrors((prev) => ({
        ...prev,
        [slot.id]: `حجم فایل بیش از ${toPersianNum(slot.maxSizeMB)} مگابایت است.`,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [slot.id]: null }));
    const previewUrl = URL.createObjectURL(file);

    setUploads((prev) => {
      if (prev[slot.id]?.previewUrl) {
        URL.revokeObjectURL(prev[slot.id]!.previewUrl);
      }
      return {
        ...prev,
        [slot.id]: { file, previewUrl },
      };
    });
  };

  const handleRemove = (slotId: string) => {
    setUploads((prev) => {
      if (prev[slotId]?.previewUrl) {
        URL.revokeObjectURL(prev[slotId]!.previewUrl);
      }
      return { ...prev, [slotId]: null };
    });
    setErrors((prev) => ({ ...prev, [slotId]: null }));
    if (inputRefs.current[slotId]) {
      inputRefs.current[slotId]!.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${toPersianNum(Math.round(mb * 10) / 10)} مگابایت`;
    }
    const kb = Math.max(1, Math.round(bytes / 1024));
    return `${toPersianNum(kb)} کیلوبایت`;
  };

  return (
    <div className="mt-10 flex w-full max-w-[1380px] flex-col gap-2">
      <div className="w-full rounded-[30px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6" dir="rtl" style={F}>
        {/* Header */}
        <div className="flex flex-col items-start gap-2">
        <p
            className="text-[20px] font-[800] text-[#370080]"
            style={{ ...F, color: "#370080", fontWeight: 800 }}
          >
             رشد کن
          </p>

          <p
            className="text-[16px] font-[300] text-[#370080]"
            style={{ ...F, color: "#370080", fontWeight: 300 }}
          >
              و شانس قرعه‌کشی بگیر
          </p>
        </div>

  


        {/* 3 Upload Boxes */}
        <div className="mx-auto grid w-full max-w-[780px] grid-cols-1 justify-items-center gap-6 md:grid-cols-3">
          {decorUploadSlots.map((slot) => {
            const current = uploads[slot.id];
            const errorMsg = errors[slot.id];
            const IconComponent = slot.type === "video" ? Film : ImagePlus;

            return (
              <div
                key={slot.id}
                className="flex aspect-[3/4] w-full max-w-[230px] flex-col justify-between rounded-2xl border border-dashed border-[#370080]/30 bg-[#fcfcfd] px-5 py-6 transition-colors hover:border-[#370080]"
              >
                <input
                  ref={(el) => {
                    inputRefs.current[slot.id] = el;
                  }}
                  type="file"
                  accept={slot.accept}
                  className="hidden"
                  onChange={(e) => handleFileChange(slot, e.target.files)}
                />

                {!current ? (
                  <div
                    onClick={() => inputRefs.current[slot.id]?.click()}
                    className="flex h-full cursor-pointer flex-col items-center justify-center text-center"
                  >
                    <div className="mb-3 flex items-center justify-center text-[#370080]">
                      <IconComponent className="size-7" />
                    </div>
                    <p
                      className="text-[14px] font-semibold text-[#1E2939]"
                      style={{ color: "#1E2939", fontSize: "14px", fontWeight: 600 }}
                    >
                      {slot.title}
                    </p>
                    <span className="mt-3 rounded-lg bg-[#370080]/5 px-2.5 py-1 text-[11px] font-medium text-[#370080]">
                      {slot.maxSizeLabel}
                    </span>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#370080] px-4 py-2 text-xs font-bold text-white">
                      <Upload className="size-3.5" />
                      انتخاب فایل
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p
                          className="text-xs font-semibold text-[#1E2939]"
                          style={{ color: "#1E2939", fontWeight: 600 }}
                        >
                          {slot.title}
                        </p>
                        <span className="rounded-md bg-[#370080]/10 px-2 py-0.5 text-[11px] font-bold text-[#370080]">
                          {formatFileSize(current.file.size)}
                        </span>
                      </div>

                      <div className="relative h-32 w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
                        {slot.type === "video" ? (
                          <video
                            src={current.previewUrl}
                            controls
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={current.previewUrl}
                            alt={slot.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <p className="mt-2 truncate text-xs font-medium text-[#6A7282]" dir="ltr">
                        {current.file.name}
                      </p>
                      <p className="mt-0.5 text-[11px] font-light text-[#6A7282]">
                        {slot.maxSizeLabel}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => inputRefs.current[slot.id]?.click()}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#370080] px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#370080]/90"
                      >
                        <RefreshCw className="size-3.5" />
                        تغییر فایل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(slot.id)}
                        className="flex items-center justify-center rounded-xl border border-[#CA165C] bg-white p-1.5 text-[#CA165C] transition-colors hover:bg-[#CA165C]/5"
                        aria-label="حذف فایل"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <p className="mt-2 text-center text-xs font-bold text-[#CA165C]">
                    {errorMsg}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Notice Banner */}
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-dashed border-[#CA165C] bg-[#CA165C]/5 px-4 py-3 text-right">
          <AlertCircle className="size-5 shrink-0 text-[#CA165C]" />
          <p
            className="text-sm font-light text-[#CA165C]"
            style={{ color: "#CA165C", fontWeight: 300 }}
          >
            <span className="font-black text-[#CA165C]">توجه: </span>
            هزینه بیشتر یا ارسال عکس بیشتر، شانس اضافه ندارد.
          </p>
        </div>
      </div>
    </div>
  );
}

function PromotionHero({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <section
      dir="rtl"
      aria-label=" پروموشن پاییز"
      className="mx-auto w-full max-w-[1380px] overflow-hidden rounded-[18px] border border-[#370080]/15 sm:rounded-[30px]"
      style={{ backgroundColor: "rgba(55, 0, 128, 0.06)" }}
    >
{/* تصویر تمام‌عرض با منحنی سفید در پایین */}
<div className="relative h-[320px] w-full overflow-hidden sm:h-[440px] lg:h-[560px]">
  <img
    src="/images/promotion-hero.webp"
    alt="آلبوم کاغذدیواری تکسچر"
    className="absolute inset-0 block h-full w-full object-cover"
    style={{ objectPosition: "center 42%" }}
    fetchPriority="high"
  />

<svg
  className="pointer-events-none absolute -bottom-px left-0 block h-[80px] w-full sm:h-[110px] lg:h-[140px]"
  viewBox="0 0 1380 140"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <defs>
    {/* محدود کردن خط به سمت تصویر */}
    <clipPath id="promotion-hero-image-clip">
      <path d="M-20 -200 H1400 V15 Q690 195 -20 15 Z" />
    </clipPath>
  </defs>

  {/* زمینه پایین منحنی */}
  <path
    d="M-20 15 Q690 195 1400 15 L1400 160 L-20 160 Z"
    fill="#F3F0F7"
  />

  {/* نوار مشکی فقط روی تصویر */}
  <path
    d="M-20 15 Q690 195 1400 15"
    fill="none"
    stroke="black"
    strokeOpacity={0.25}
    strokeWidth="35"
    vectorEffect="non-scaling-stroke"
    clipPath="url(#promotion-hero-image-clip)"
  />
</svg>
</div>


      {/* دکمه روی مرز تصویر و بخش پایین */}
      <div className="relative z-10 -mt-8 flex justify-center">
        <button
          type="button"
          onClick={onStart}
          aria-label="رفتن به بخش انتخاب برند"
          className="flex h-[90px] w-11 -translate-y-[35px] items-center justify-center rounded-full border border-[#ca165c]/10 bg-white text-[#ca165c] shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-[34px] motion-reduce:transition-none motion-reduce:hover:-translate-y-[35px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#370080]"

        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4v16M6 14l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* عنوان و دکمه‌ها */}
        <div className="flex min-h-[400px] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[430px] sm:px-10">
        <h1 className="text-xl font-bold leading-relaxed text-[#370080] sm:text-3xl -translate-y-[12px]">
         پروموشن پاییز
        <PromotionHeroAnimatedText />

        </h1>
        <div
          aria-hidden="true"
          className="mx-auto mt-[-90px] h-1 w-10 -translate-y-[50px] rounded-full bg-white shadow-[0_0_8px_#FFFFFFE6,0_0_20px_#FFFFFF99,0_0_40px_#FFFFFF4D]"
        />

      <div className="mt-[104px] flex flex-wrap items-center justify-center gap-3">
        <style>{`
  @keyframes promo-button-enter-from-left {
    from {
      opacity: 0;
      transform: translateX(-36px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes promo-button-enter-from-right {
    from {
      opacity: 0;
      transform: translateX(36px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .promo-button-entry {
    display: inline-flex;
    max-width: 100%;
    animation-duration: 1200ms;
    animation-delay: 350ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    animation-fill-mode: both;
    animation-iteration-count: 1;
  }

  .promo-button-entry--left {
    animation-name: promo-button-enter-from-left;
  }

  .promo-button-entry--right {
    animation-name: promo-button-enter-from-right;
  }

  @media (prefers-reduced-motion: reduce) {
    .promo-button-entry {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`}</style>

        {/* دکمه بازگشت */}
        <div className="promo-button-entry promo-button-entry--right">

        <button
          type="button"
          onClick={onBack}
          style={{ fontSize: "inherit" }}
          className="promo-btn-shine promo-btn-shine--back inline-flex min-h-12 items-center justify-center rounded-full border border-[#ca165c]/80 bg-white px-6 py-3 font-[300] leading-6 text-[#ca165c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#370080] focus-visible:ring-offset-2"
        >
          <span className="promo-btn-content">
            <ArrowRight
              className="size-4 shrink-0"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>بازگشت به پنل فروشگاه</span>
          </span>
        </button>
        </div>

        

        {/* دکمه شروع */}
        <div className="promo-button-entry promo-button-entry--left">
        <button
          type="button"
          onClick={onStart}
          style={{ fontSize: "inherit" }}
          className="promo-btn-shine promo-btn-shine--start inline-flex min-h-12 items-center justify-center rounded-full bg-[#370080] px-7 py-3 font-[300] leading-6 text-white transition-colors hover:bg-[#370080]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#370080] focus-visible:ring-offset-2"
        >
          <span className="promo-btn-content">
            <span>شروع پروموشن</span>
            <ArrowRight
              className="size-4 shrink-0 rotate-180"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
        </button>
        </div>
      </div>


        <div aria-hidden="true" className="h-[170px]" />
      </div> {/* پایان باکس عنوان و دکمه‌ها */}
      <style>{`
      /* Shine effect — adapted from Uiverse.io by mobinkakei */
      .promo-btn-shine {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        cursor: pointer;
      }

      .promo-btn-shine > .promo-btn-content {
        position: relative;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .promo-btn-shine::after {
        content: "";
        position: absolute;
        top: -50%;
        left: -80px;
        width: 50px;
        height: 200%;
        background: var(--promo-shine-color, rgba(255, 255, 255, 0.4));
        transform: rotate(35deg);
        pointer-events: none;
        z-index: 1;
        transition: left 550ms cubic-bezier(0.19, 1, 0.22, 1);
      }

      .promo-btn-shine--back {
        --promo-shine-color: rgba(202, 22, 92, 0.15);
      }

      .promo-btn-shine--start {
        --promo-shine-color: rgba(255, 255, 255, 0.4);
      }

    @media (hover: hover) and (prefers-reduced-motion: no-preference) {
        .promo-btn-shine:hover {
        animation: promo-btn-rotate 0.7s ease-in-out both;
      }

      .promo-btn-shine:hover > .promo-btn-content {
        animation: promo-btn-storm 0.7s ease-in-out both;
        animation-delay: 0.06s;
      }

      .promo-btn-shine:hover::after {
        left: 120%;
        }
    }

    @keyframes promo-btn-rotate {
      0%, 100% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(3deg);
      }
      50% {
        transform: rotate(-3deg);
      }
      75% {
        transform: rotate(1deg);
      }
    }

    @keyframes promo-btn-storm {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(4px);
      }
      50% {
        transform: translateX(-3px);
      }
      75% {
        transform: translateX(2px);
      }
    `     }</style>
        </section>
      );
    }


export function SalesPricingDetailsPage() {
  const navigate = useNavigate();
  const [pendingBrandId, setPendingBrandId] = useState<string | null>(null);
  const [confirmedBrandId, setConfirmedBrandId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("sales-growth");
  const confirmTimerRef = useRef<number | null>(null);
  const promotionPanelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = promotionPanelsRef.current;
    if (!container || !confirmedBrandId) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) return;

    const panel = container.querySelector<HTMLElement>(':scope > section:not([hidden])');
    if (!panel) return;

    const animations: Animation[] = [];
    const candidates = Array.from(panel.querySelectorAll<HTMLElement>(
      'div[class*="rounded"], h2, h3, p, button, input, select, textarea, table, ol > li, img, svg'
    )).filter(element =>
      // SVG internals and button icons already travel with their parent control.
      !element.closest('svg, [data-entrance="self-animated"]') &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
    );

    const animate = (element: HTMLElement, index: number) => {
      // Preserve existing Tailwind translations on charts, labels, and controls.
      const baseTranslate = window.getComputedStyle(element).translate;
      const [baseX = '0px', baseY = '0px', baseZ = '0px'] =
        baseTranslate === 'none' ? [] : baseTranslate.split(/\s+/);
      const animation = element.animate([
        { opacity: 0, translate: baseX + ' calc(' + baseY + ' + 14px) ' + baseZ },
        { opacity: 1, translate: baseX + ' ' + baseY + ' ' + baseZ },
      ], {
        duration: 800,
        delay: Math.min(index * 35, 280),
        easing: 'cubic-bezier(0.45, 0, 0.25, 1)',
        fill: 'backwards',
      });
      animations.push(animation);
    };

    // Replay when changing tabs, preserving each menu's state and chart animations.
    candidates.forEach(animate);
    const stopAnimations = () => animations.forEach(animation => animation.cancel());
    motionPreference.addEventListener('change', stopAnimations);
    return () => {
      motionPreference.removeEventListener('change', stopAnimations);
      stopAnimations();
    };
  }, [activeSection, confirmedBrandId]);

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current !== null) {
        window.clearTimeout(confirmTimerRef.current);
      }
    };
  }, []);

  const handleCardClick = (cardId: string) => {
    if (confirmedBrandId || isConfirming) return;
    setPendingBrandId(cardId);
  };

  const handleConfirmBrand = () => {
    if (!pendingBrandId || isConfirming) return;
    const selectedId = pendingBrandId;
    setIsConfirming(true);
    confirmTimerRef.current = window.setTimeout(() => {
      setIsConfirming(false);
      setConfirmedBrandId(selectedId);
      setIsRulesOpen(true);
      setPendingBrandId(null);
      confirmTimerRef.current = null;
    }, 2000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .pricing-promotion-panels *,
          .pricing-promotion-panels *::before,
          .pricing-promotion-panels *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        @keyframes chartLineDraw {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes chartFillFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

        <div className="px-4 pt-6 sm:px-6">
            <PromotionHero
                onBack={() => navigate("/profile")}
                onStart={() => {
                document.getElementById("promotion-brand-cards")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
          });
          }}
          />
        </div>

<main className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">


        {/* 3 Interactive Brand Cards */}
        <div
          id="promotion-brand-cards"
          className="relative z-10 -mt-[130px] flex scroll-mt-24 flex-wrap items-center justify-center gap-8 pb-8 pt-0 sm:pb-12"
          >

          {brandCards.map((card) => {
            const isFixedHover = pendingBrandId === card.id || confirmedBrandId === card.id;
            const isLocked = Boolean(confirmedBrandId);

            return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`relative h-80 w-60 overflow-hidden rounded-[40px] bg-[#370080] text-2xl font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${
                isLocked ? "cursor-default" : "cursor-pointer"
              }`}

            >
              <div className={`absolute z-10 h-full w-full ${isLocked ? "" : "peer"}`}></div>
              <div
                className={`absolute rounded-full bg-[#734DA6] transition-all duration-500 ${
                  isFixedHover
                    ? "-left-16 -top-20 h-[140%] w-[140%]"
                    : "-left-16 -top-32 h-44 w-32 peer-hover:-left-16 peer-hover:-top-20 peer-hover:h-[140%] peer-hover:w-[140%]"
                }`}
              ></div>
              <div
                className={`absolute flex rounded-full bg-[#734DA6] px-4 text-center text-xl transition-all duration-500 ${
                  isFixedHover
                    ? "bottom-0 right-0 h-full w-full items-center justify-center rounded-b-none text-white"
                    : "-bottom-32 -right-16 h-44 w-36 items-end justify-end text-purple-950 peer-hover:bottom-0 peer-hover:right-0 peer-hover:h-full peer-hover:w-full peer-hover:items-center peer-hover:justify-center peer-hover:rounded-b-none peer-hover:text-white"
                }`}
              >
                <span>
                  <span className="font-extralight">شروع ماجرا با</span><br />{card.label}
                </span>
              </div>
              <div className="flex h-full w-full items-center justify-center p-4 text-center">
                {card.label}
              </div>
            </div>
            );
          })}
        </div>

        {confirmedBrandId && (
          <div className="mx-auto mt-2 max-w-xl rounded-[20px] border border-[#ca165c] bg-[#ffffff] px-6 py-4 text-center shadow-sm">
            <p className="flex items-center justify-center gap-2 text-base font-[300] text-[#ca165c]">
              <CheckCircle className="size-5 shrink-0 text-[#ca165c]" />
              تبریک میگم پروموشن شما با موفقیت شروع شد.
            </p>
          </div>
        )}

        <div id="brand-selection" className="scroll-mt-24 space-y-2 text-center">
        </div>

{/* Promotion Rules Box */}
<div className="mx-auto mt-20 flex w-full max-w-[1380px] flex-col gap-2">
  <div
    className="w-full overflow-hidden rounded-2xl sm:rounded-[30px] border border-[#370080]/10"
    style={{ ...F, backgroundColor: "rgba(55, 0, 128, 0.06)" }}
    dir="rtl"
  >
    <button
      type="button"
      onClick={() => setIsRulesOpen((prev) => !prev)}
      aria-expanded={isRulesOpen}
      aria-controls="promotion-rules-content"
      className="relative flex w-full items-center justify-center px-14 py-7 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#370080] sm:px-20 sm:py-9"
    >
      <span className="text-xl font-bold leading-relaxed text-[#370080] sm:text-3xl">
        قوانین پروموشن
      </span>

    <ChevronDown
      aria-hidden="true"
      className={`absolute left-5 size-5 shrink-0 text-[#370080] transition-transform duration-500 ease-in-out motion-reduce:transition-none sm:left-8 ${
        isRulesOpen ? "rotate-180" : "rotate-0"
      }`}
    />

    </button>

    <div
      id="promotion-rules-content"
      aria-hidden={!isRulesOpen}
      className={`grid transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none ${
        isRulesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="px-5 pt-8 pb-14 sm:px-8 sm:pt-10 sm:pb-16 lg:px-10">

          <ol
            dir="rtl"
            className="w-full list-none space-y-2 p-0 text-right text-[14px] font-[300] leading-8 text-[#370080]"
          >
            {promotionRules.map((rule, index) => (
              <li
                key={index}
                className="flex items-start gap-4 sm:gap-5"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[14px] font-[300] leading-none text-[#ca165c]"
                >
                  {toPersianNum(index + 1)}
                </span>

                <span
                  className="min-w-0 flex-1 text-right text-[16px] font-[400] leading-8 text-[#370080]"
                >
                  {rule}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  </div>
</div>


{/* منوی افقی بخش‌های پروموشن */}
<nav
  aria-label="بخش‌های پروموشن"
  dir="rtl"
  className="mx-auto mt-6 w-full max-w-[800px] overflow-x-auto rounded-[26px] border border-gray-100 bg-white shadow-sm"
>
  <div className="relative isolate flex min-w-max px-5">
    {[
      { id: "sales-growth", label: "رشد فروش", color: "#4141D9" },
      { id: "continuous-purchase", label: "خرید مستمر", color: "#4141D9" },
      { id: "diverse-purchase", label: "خرید متنوع", color: "#4141D9" },
      { id: "lottery", label: "قرعه کشی", color: "#4141D9" },
    ].map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => setActiveSection(item.id)}
        aria-pressed={activeSection === item.id}
        style={{
          color: activeSection === item.id ? item.color : undefined,
        }}
        className={[
          "relative z-10 flex-1 shrink-0 whitespace-nowrap",
          "px-5 py-7 text-[16px] font-[400]",
          "transition-colors duration-300 hover:text-[#4141D9]/50",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-inset focus-visible:ring-violet-400",
          "after:pointer-events-none after:absolute",
          "after:inset-x-5 after:bottom-0 after:h-[5px]",
          "after:rounded-t-[8px] after:bg-[#4141D9]/30",
          "after:opacity-0 after:transition-opacity after:duration-300",
          activeSection === item.id
            ? ""
            : "text-[#83818c] hover:text-[#333] hover:after:opacity-100",
        ].join(" ")}
      >
        {item.label}
      </button>
    ))}

    {/* خط رنگی متحرک زیر گزینهٔ فعال */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 z-20 h-[5px] rounded-t-[8px] transition-[left,width,background-color] duration-[700ms] ease-[cubic-bezier(0.45,0,0.55,1)] motion-reduce:transition-none"
      ref={(indicator) => {
      if (!indicator) return;

      const container = indicator.parentElement;
      if (!container) return;

      const updateIndicator = () => {
        const activeButton =
          container.querySelector<HTMLButtonElement>(
            'button[aria-pressed="true"]'
          );

        if (!activeButton) {
          indicator.style.width = "0px";
          return;
        }

        indicator.style.width = `${activeButton.offsetWidth - 12}px`;
        indicator.style.left = `${activeButton.offsetLeft + 6}px`;
        indicator.style.backgroundColor = activeButton.style.color;
      };
      updateIndicator();
    }}
  />
  </div>
</nav>


{/* راهنما پیش از تأیید برند */}
{!confirmedBrandId && (
  <p className="mt-10 text-center text-[16px] font-[300] text-[#4141D9]">
    برای مشاهده بخش‌های پروموشن، ابتدا برند خود را انتخاب و تأیید کن.
  </p>
)}

{/* نمایش سکشن انتخاب‌شده */}
{confirmedBrandId && (
  <div ref={promotionPanelsRef} className="pricing-promotion-panels w-full max-w-[1380px]">
    <section
      className="pricing-sales-growth-panel"
      aria-label="رشد فروش"
      hidden={activeSection !== "sales-growth"}
    >
      <SalesChart />
    </section>

    <section
      aria-label="خرید مستمر"
      hidden={activeSection !== "continuous-purchase"}
    >
    <QuestPathTrackerBox
      isActive={activeSection === "continuous-purchase"}
    />

    </section>

    <section
      aria-label="مستمر خرید کن 2"
      hidden={activeSection !== "continuous-purchase-2"}
    >
      <ContinuousPurchaseRoadmap />
    </section>


    <section
      aria-label="خرید متنوع"
      hidden={activeSection !== "diverse-purchase"}
    >
      <AlbumDiversityChartBox isActive={activeSection === "diverse-purchase"} />

    </section>

    <section
      aria-label="قرعه کشی"
      hidden={activeSection !== "lottery"}
    >
    <div className="mt-10 flex w-full max-w-[1380px] flex-col gap-10">
    <LotteryRadialGaugeBox isActive={activeSection === "lottery"} />

<div className="flex w-full flex-col gap-2">
  <div
    className="w-full rounded-[30px] border border-gray-100 bg-white p-5 shadow-sm sm:p-10"
    dir="rtl"
    style={F}
  >
    {/* Header */}
    <div className="flex flex-col items-start gap-2">
      <p
        className="text-[20px] font-[800] text-[#370080]"
        style={{ ...F, color: "#370080", fontWeight: 800 }}
      >
         دکورت رو جذاب کن
      </p>

      <p
        className="text-[16px] font-[300] text-[#370080]"
        style={{ ...F, color: "#370080", fontWeight: 300 }}
      >
        و شانس قرعه‌کشی بگیر
      </p>
    </div>

 <DecorMediaUploadCards />

  </div>
</div>


    </div>
    </section>

  <section
    aria-label="قرعه‌کشی"
    hidden={activeSection !== "شناسهٔ واقعی منوی قرعه‌کشی"}
  >
    {/* کل باکس «رشد کن و شانس قرعه‌کشی بگیر» */}

    <div className="mt-6">
      <DecorChallengeUploadBox />
    </div>
  </section>


  </div>
)}


        <Dialog open={pendingBrandId !== null} onOpenChange={(open) => !open && !isConfirming && setPendingBrandId(null)}>
          <DialogContent
            dir="rtl"
            style={F}
            className={`max-w-md rounded-[30px] border-gray-100 bg-white p-6 text-right [&>button]:left-4 [&>button]:shadow-none [&>button]:right-auto [&>button]:text-brand-pink [&>button]:opacity-100 ${
              isConfirming ? "[&>button]:pointer-events-none [&>button]:opacity-30" : ""
            }`}
          >
            <DialogHeader className="space-y-[-5px] pt-2 text-right sm:text-right">
              <DialogTitle className="text-base text-[18px] font-bold text-[#1E2939]" style={{ color: "#3c2671", fontWeight: 800 }}>
                آیا این برند انتخاب تو برای شروع پروموشنه؟
              </DialogTitle>
              <DialogDescription className=" font-light text-[#3c2671] text-[16px] font-[400]">
                در ادامه امکان تغییر برند وجود ندارد.
              </DialogDescription>
            </DialogHeader>
            {isConfirming ? (
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <Loader2 className="size-8 animate-spin text-[#3c2671]" />
              </div>
            ) : (
              <DialogFooter 
              dir="rtl"   
              className="mt-2 flex-row justify-start gap-2 sm:justify-start -translate-x-[280px]" >
                <Button
                  onClick={handleConfirmBrand}
                  className="rounded-xl bg-[#370080] px-6 text-white shadow-none hover:bg-[#370080]/90"
                >
                  بله
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPendingBrandId(null)}
                  className="rounded-xl border-0 bg-white text-brand-pink shadow-none hover:bg-brand-pink/5 hover:text-brand-pink"
                >
                  بیشتر فکر کنم
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
