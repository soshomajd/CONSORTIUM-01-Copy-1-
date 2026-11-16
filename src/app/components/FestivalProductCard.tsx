import React from "react"
import { Package } from "lucide-react"
import { Link } from "react-router"
import productImg2 from "@/imports/202067-after.jpg"

const PINK = "#CA165C"
const F = { fontFamily: "'Vazirmatn', sans-serif" }
const toPersianNum = (value: number) => value.toLocaleString("fa-IR")

function PickupTruckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 7.5h10v8H2.5z" />
      <path d="M12.5 10h4.2l3 3.2v2.3h-7.2z" />
      <path d="M16.7 10v3.2h3" />
      <path d="M2.5 15.5h1.8m5 0h5.2m5.2 0h1.8" />
      <circle cx="6.8" cy="16.5" r="2" />
      <circle cx="17.7" cy="16.5" r="2" />
    </svg>
  )
}

export function FestivalProductCard({
  item,
  timer,
  amazingTypography = false,
  hasIncentive = false,
  fluid = false,
  showDiscount = true,
  unavailable = false,
  title = "تکسچر(1) 202011",
  productHref = "/product/6135",
  showReviews = true,
}: {
  item: {
    code: string
    basePrice: number
    discount: number
  }
  timer?: [string, string, string]
  amazingTypography?: boolean
  hasIncentive?: boolean
  fluid?: boolean
  showDiscount?: boolean
  unavailable?: boolean
  title?: string
  productHref?: string
  showReviews?: boolean
}) {
  const afterPrice = Math.round(item.basePrice * (1 - item.discount / 100))

  return (
    <Link
      to={productHref}
      data-product-code={item.code}
      className="min-w-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-[3px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA165C]"
      style={{
        flexShrink: 0,
        width: fluid ? "100%" : 185,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 285,
          overflow: "hidden",
          backgroundColor: "#fafafa",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <img
          src={productImg2}
          alt={item.code}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0,
            height: "15%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))",
            pointerEvents: "none",
          }}
        />
        {showReviews && <span
          style={{
            position: "absolute",
            bottom: 9,
            left: 10,
            zIndex: 1,
            fontSize: 12,
            fontWeight: amazingTypography ? 800 : 700,
            color: "#fff",
            whiteSpace: "nowrap",
            ...F,
          }}
        >
          <span style={{ color: "#fbbf24" }}>★</span> 4/2 ( 15 دیدگاه )
        </span>}
        {showDiscount && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: PINK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 3px 10px rgba(202,22,92,0.24)",
            }}
          >
            <span
              style={{
                fontSize: amazingTypography ? 13 : 11,
                fontWeight: amazingTypography ? 400 : 900,
                color: "#fff",
                ...F,
              }}
            >
              {item.discount}٪
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "12px 12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: amazingTypography ? 15 : 13,
              fontWeight: amazingTypography ? 800 : 900,
              color: "#111827",
              textAlign: "right",
              ...F,
            }}
          >
            {title}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {showDiscount && (
            <span
              style={{
                fontSize: amazingTypography ? 12 : 11,
                fontWeight: amazingTypography ? 200 : undefined,
                color: "#9ca3af",
                textDecoration: "line-through",
                ...F,
              }}
            >
              {toPersianNum(item.basePrice)} تومان
            </span>
          )}
          <span
            style={{
              fontSize: amazingTypography ? 13 : 14,
              fontWeight: unavailable ? 600 : amazingTypography ? 800 : 900,
              color: unavailable ? PINK : "#9ca3af",
              ...F,
            }}
          >
            {unavailable
              ? "ناموجود"
              : `${toPersianNum(showDiscount ? afterPrice : item.basePrice)} تومان`}
          </span>
        </div>

        {showDiscount && hasIncentive && (
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#CA165C",
              }}
            >
              <Package size={11} strokeWidth={2} />
              <span
                style={{
                  fontSize: amazingTypography ? 13 : 11,
                  fontWeight: amazingTypography ? 400 : 700,
                  color: "#CA165C",
                  ...F,
                }}
              >
                تنها ۲۰ رول باقی مانده
              </span>
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: amazingTypography ? 13 : 11,
                fontWeight: amazingTypography ? 400 : 700,
                color: "#CA165C",
                ...F,
              }}
            >
              <PickupTruckIcon size={12} />
              <span>ارسال رایگان</span>
            </span>
          </div>
        )}

        {showDiscount && timer && (
          <>
            <div style={{ height: 1, backgroundColor: "#f3f4f6" }} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  direction: "ltr",
                }}
              >
                {timer.map((unit, index) => (
                  <React.Fragment key={index}>
                    <span
                      style={{
                        fontSize: amazingTypography ? 13 : 12,
                        fontWeight: amazingTypography ? 800 : 900,
                        color: "#CA165C",
                        fontVariantNumeric: "tabular-nums",
                        ...F,
                      }}
                    >
                      {unit}
                    </span>
                    {index < 2 && (
                      <span
                        style={{
                          fontSize: amazingTypography ? 13 : 11,
                          color: "#CA165C",
                          fontWeight: amazingTypography ? 800 : 900,
                        }}
                      >
                        :
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
