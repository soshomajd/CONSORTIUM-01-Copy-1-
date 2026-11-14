import { Fragment, useMemo, useState } from "react";
import { Columns2, Plus, Search, ShoppingCart, Star, X } from "lucide-react";
import { Header } from "@/app/components/Header";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { getCart, saveCart } from "@/app/store/cart";
import rollBlue from "@/imports/2030e111-41ab-41d3-9f51-058659c24704.png";
import rollCream from "@/imports/17169a56-f3d0-48d5-aeb6-4e0ab3dc9043.png";
import designWhite from "@/imports/202067-after.jpg";
import designGold from "@/imports/202084-after.jpg";
import designStone from "@/imports/202054447-mockup3.jpg";
import designFlower from "@/imports/202057-mockup3.jpg";

const F = { fontFamily: "'Vazirmatn', sans-serif" };
const MAX_PRODUCTS = 4;

type CompareProduct = {
  id: string;
  name: string;
  code: string;
  brand: string;
  color: string;
  design: string;
  position: string;
  style: string;
  album: string;
  status: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
};

const products: CompareProduct[] = [
  {
    id: "201060",
    name: "پنتونکست ۲۰۱۰۶۰",
    code: "۲۰۱۰۶۰",
    brand: "NEXT",
    color: "طوسی",
    design: "ساده",
    position: "همه فضاها",
    style: "مدرن",
    album: "آلبوم پنتونکست",
    status: "موجود",
    price: 460_000,
    oldPrice: 520_000,
    image: rollCream,
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: "201002",
    name: "پنتونکست ۲۰۱۰۰۲",
    code: "۲۰۱۰۰۲",
    brand: "NEXT",
    color: "آبی روشن",
    design: "بافت‌دار",
    position: "اتاق نشیمن",
    style: "مینیمال",
    album: "آلبوم پنتونکست",
    status: "موجود",
    price: 588_000,
    oldPrice: 640_000,
    image: rollBlue,
    rating: 4.9,
    reviewCount: 24,
  },
  {
    id: "202067",
    name: "تکسچر ۲۰۲۰۶۷",
    code: "۲۰۲۰۶۷",
    brand: "WALL MASTER",
    color: "سفید",
    design: "تکسچر",
    position: "پذیرایی",
    style: "مدرن",
    album: "آلبوم تکسچر",
    status: "موجود",
    price: 620_000,
    image: designWhite,
    rating: 4.6,
    reviewCount: 11,
  },
  {
    id: "202084",
    name: "تکسچر ۲۰۲۰۸۴",
    code: "۲۰۲۰۸۴",
    brand: "WALL MASTER",
    color: "طلایی",
    design: "کلاسیک",
    position: "اتاق نشیمن",
    style: "کلاسیک",
    album: "آلبوم رویال",
    status: "موجود",
    price: 715_000,
    image: designGold,
    rating: 4.8,
    reviewCount: 16,
  },
  {
    id: "202054",
    name: "سنگ طبیعی ۲۰۲۰۵۴",
    code: "۲۰۲۰۵۴",
    brand: "EXTREME",
    color: "خاکستری",
    design: "سنگ",
    position: "همه فضاها",
    style: "لوکس",
    album: "آلبوم اکستریم",
    status: "موجود",
    price: 680_000,
    image: designStone,
    rating: 4.5,
    reviewCount: 9,
  },
  {
    id: "202057",
    name: "گل کاغذی ۲۰۲۰۵۷",
    code: "۲۰۲۰۵۷",
    brand: "EXTREME",
    color: "صورتی",
    design: "گل‌دار",
    position: "اتاق خواب",
    style: "رمانتیک",
    album: "آلبوم اکستریم",
    status: "موجود",
    price: 655_000,
    image: designFlower,
    rating: 4.7,
    reviewCount: 13,
  },
];

type CompareSpecKey = keyof CompareProduct | "discountPercent";

const specs: { key: CompareSpecKey; label: string }[] = [
  { key: "brand", label: "برند" },
  { key: "color", label: "رنگ" },
  { key: "design", label: "طرح" },
  { key: "position", label: "موقعیت" },
  { key: "style", label: "سبک" },
  { key: "album", label: "آلبوم" },
  { key: "status", label: "وضعیت" },
  { key: "price", label: "قیمت" },
  { key: "discountPercent", label: "درصد تخفیف" },
];

function formatPrice(price: number) {
  return `${price.toLocaleString("fa-IR")} تومان`;
}

export function ComparePage() {
  const [selectedSlots, setSelectedSlots] = useState<(string | null)[]>(["201060", "201002", null, null]);
  const [quantities, setQuantities] = useState<Record<string, number>>({ "201060": 1, "201002": 1 });
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const productSlots = selectedSlots.map((id) =>
    id ? products.find((product) => product.id === id) ?? null : null,
  );
  const selectedProducts = productSlots
    .filter((product): product is CompareProduct => Boolean(product));
  const selectedIds = selectedProducts.map((product) => product.id);

  const availableProducts = useMemo(() => {
    const normalizedSearch = search.trim();
    return products.filter(
      (product) =>
        !selectedIds.includes(product.id) &&
        (!normalizedSearch ||
          product.name.includes(normalizedSearch) ||
          product.code.includes(normalizedSearch)),
    );
  }, [search, selectedIds]);

  const addProduct = (id: string) => {
    if (selectedIds.length >= MAX_PRODUCTS) return;
    setSelectedSlots((current) => {
      const emptySlot = current.findIndex((item) => item === null);
      if (emptySlot === -1) return current;
      return current.map((item, index) => (index === emptySlot ? id : item));
    });
    setQuantities((current) => ({ ...current, [id]: 1 }));
    setDialogOpen(false);
    setSearch("");
  };

  const removeProduct = (id: string) => {
    setSelectedSlots((current) => current.map((item) => (item === id ? null : item)));
  };

  const updateCartQuantity = (product: CompareProduct, quantity: number) => {
    const nextQuantity = Math.max(0, quantity);
    const cart = getCart();
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (nextQuantity === 0 && existingIndex >= 0) {
      cart.splice(existingIndex, 1);
    } else if (existingIndex >= 0) {
      cart[existingIndex].qty = nextQuantity;
    } else if (nextQuantity > 0) {
      cart.push({
        id: product.id,
        code: product.id,
        name: product.name,
        unitPrice: product.price,
        img: product.image,
        qty: nextQuantity,
      });
    }

    saveCart(cart);
    localStorage.setItem("cartCount", String(cart.reduce((sum, item) => sum + item.qty, 0)));
    window.dispatchEvent(new Event("cartUpdate"));
    setQuantities((current) => ({ ...current, [product.id]: Math.max(1, nextQuantity) }));
    setCartProductIds((current) =>
      nextQuantity > 0
        ? current.includes(product.id) ? current : [...current, product.id]
        : current.filter((id) => id !== product.id),
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={F}>
      <Header />

      <main className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#370080]/6 text-[#370080]">
              <Columns2 size={21} strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-lg font-black text-[#1E2939]">مقایسه کالا</p>
              <p className="mt-1 text-sm font-light text-[#6A7282]">
                مشخصات کالاها را کنار هم ببینید و انتخاب دقیق‌تری داشته باشید.
              </p>
            </div>
          </div>
        </div>

        {selectedProducts.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-[#FCFCFD]/60 px-6 text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#370080]/6 text-[#370080]">
              <Plus size={27} />
            </span>
            <p className="text-base font-semibold text-[#1E2939]">هنوز کالایی برای مقایسه اضافه نشده است</p>
            <p className="mt-2 max-w-md text-sm font-light leading-7 text-[#6A7282]">
              برای شروع، کالاهای موردنظرتان را انتخاب کنید تا مشخصات آن‌ها کنار هم نمایش داده شود.
            </p>
            <Button
              className="mt-5 rounded-xl bg-[#370080] px-6 text-white hover:bg-[#370080]/90"
              onClick={() => setDialogOpen(true)}
            >
              <Plus />
              افزودن کالا برای مقایسه
            </Button>
          </div>
        ) : (
          <div className="overflow-visible pb-2 md:overflow-x-auto">
            <div className="min-w-0 lg:min-w-[1080px]">
              <section aria-label="کالاهای انتخاب‌شده" className="mb-10">
                <div className="grid grid-cols-2 md:grid-cols-[140px_repeat(3,minmax(0,1fr))] lg:grid-cols-[160px_repeat(4,minmax(0,1fr))]">
                  <div aria-hidden="true" className="hidden md:block" />
                  {productSlots.map((product, slotIndex) => (
                    <div
                      key={`product-slot-${slotIndex}`}
                      className={`${
                        slotIndex === 2
                          ? "hidden md:block"
                          : slotIndex === 3
                            ? "hidden lg:block"
                            : ""
                      } px-1 sm:px-2`}
                    >
                      {product ? (() => {
                        const quantity = quantities[product.id] ?? 1;
                        return (
                          <div className="relative flex h-full min-h-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_4px_18px_rgba(30,41,57,0.05)] sm:min-h-[400px] sm:p-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`حذف ${product.name}`}
                              onClick={() => removeProduct(product.id)}
                              className="absolute left-2 top-2 z-10 h-7 w-7 rounded-full bg-[#370080] text-white shadow-sm hover:bg-[#CA165C] hover:text-white"
                            >
                              <X size={14} />
                            </Button>
                            <div className="relative mb-3 h-28 overflow-hidden rounded-xl bg-gray-100 sm:h-56">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-1 flex-col text-center">
                              <p className="text-xs font-semibold text-[#1E2939] sm:text-sm">{product.name}</p>
                              <div className="mt-2 flex items-center justify-center gap-1 sm:gap-1.5" dir="ltr">
                                <Star size={13} fill="#F5B301" className="text-[#F5B301]" />
                                <span className="text-[10px] font-light text-[#6A7282] sm:text-xs">
                                  {product.rating.toLocaleString("fa-IR")}
                                </span>
                                <span className="text-[10px] font-light text-[#6A7282] sm:text-xs">
                                  ({product.reviewCount.toLocaleString("fa-IR")} دیدگاه)
                                </span>
                              </div>
                              <div className="mt-auto pt-4">
                                {cartProductIds.includes(product.id) ? (
                                  <div className="flex h-9 items-center justify-between overflow-hidden rounded-xl border border-[#370080] bg-white">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-full w-10 rounded-none text-[#370080] hover:bg-[#370080]/6"
                                      onClick={() => updateCartQuantity(product, quantity + 1)}
                                    >
                                      <Plus size={14} />
                                    </Button>
                                    <span className="text-xs font-semibold text-[#370080]">
                                      {quantity.toLocaleString("fa-IR")}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-full w-10 rounded-none text-[#370080] hover:bg-[#370080]/6"
                                      onClick={() => updateCartQuantity(product, quantity - 1)}
                                    >
                                      <span className="text-base leading-none">−</span>
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    className="h-9 w-full rounded-xl bg-[#370080] px-1 text-[10px] text-white hover:bg-[#370080]/90 sm:px-2 sm:text-xs"
                                    onClick={() => updateCartQuantity(product, 1)}
                                  >
                                    <ShoppingCart size={14} />
                                    افزودن به سبد خرید
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })() : (
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(true)}
                          className="flex min-h-[260px] h-full w-full flex-col gap-3 whitespace-normal rounded-2xl border-2 border-dashed border-[#6A7282]/20 bg-white px-2 text-center text-[#6A7282] hover:border-[#370080]/20 hover:bg-[#370080]/6 sm:min-h-[400px]"
                        >
                          <Plus size={23} strokeWidth={1.7} />
                          <span className="text-xs font-medium sm:text-sm">افزودن کالا برای مقایسه</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section aria-label="جدول مقایسه کالا">
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <Table className="w-full table-fixed">
                    <TableHeader className="bg-[#F3F4F6]">
                      <TableRow className="hover:bg-[#F3F4F6]">
                        <TableHead className="hidden whitespace-normal border-l border-gray-200 px-2 py-5 text-center text-sm font-semibold text-[#1E2939] md:table-cell md:w-[140px] lg:w-40">
                          مشخصات
                        </TableHead>
                        {productSlots.map((product, slotIndex) => (
                          <TableHead
                            key={`header-slot-${slotIndex}`}
                            className={`${
                              slotIndex === 2
                                ? "hidden md:table-cell"
                                : slotIndex === 3
                                  ? "hidden lg:table-cell"
                                  : ""
                            } whitespace-normal border-l border-gray-200 px-1 py-4 text-center text-[11px] font-semibold text-[#1E2939] last:border-l-0 sm:px-2 sm:py-5 sm:text-sm`}
                          >
                            {product?.name ?? ""}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specs.map((spec) => (
                        <Fragment key={spec.key}>
                          <TableRow className="bg-white hover:bg-[#FCFCFD]/60 md:hidden">
                            <TableCell
                              colSpan={2}
                              className="whitespace-normal px-2 pb-1 pt-3 text-center text-[13px] font-semibold text-[#370080]"
                            >
                              {spec.label}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white hover:bg-[#FCFCFD]/60">
                            <TableCell className="hidden whitespace-normal border-l border-gray-200 px-4 py-3 text-center text-sm font-semibold text-[#370080] md:table-cell">
                              {spec.label}
                            </TableCell>
                            {productSlots.map((product, slotIndex) => (
                              <TableCell
                                key={`value-${spec.key}-${slotIndex}`}
                                className={`${
                                  slotIndex === 2
                                    ? "hidden md:table-cell"
                                    : slotIndex === 3
                                      ? "hidden lg:table-cell"
                                      : ""
                                } whitespace-normal border-l border-gray-100 px-1 py-3 align-middle text-center text-[13px] font-light text-[#6A7282] last:border-l-0 sm:px-4 sm:text-sm`}
                              >
                                {product
                                  ? spec.key === "price"
                                      ? formatPrice(product.price)
                                      : spec.key === "discountPercent"
                                        ? product.oldPrice
                                          ? `${Math.round((1 - product.price / product.oldPrice) * 100).toLocaleString("fa-IR")}٪`
                                          : "—"
                                        : String(product[spec.key])
                                  : "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="max-h-[85vh] overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-gray-100 px-5 pb-4 pt-5 text-right sm:text-right [&~button]:left-4 [&~button]:right-auto [&~button]:text-[#CA165C] [&~button]:opacity-100">
            <DialogTitle className="text-base font-semibold text-[#1E2939]">انتخاب کالا برای مقایسه</DialogTitle>
            <DialogDescription className="text-[13px] font-light text-[#6A7282]">
              نام یا کد کالای موردنظر را جست‌وجو کنید.
            </DialogDescription>
          </DialogHeader>

          <div className="px-5">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7282]" size={16} />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجوی نام یا کد کالا"
                className="h-11 rounded-xl border-transparent pr-10 text-right text-sm font-light text-[#6A7282] shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="grid max-h-[55vh] grid-cols-1 gap-3 overflow-y-auto px-5 pb-5 sm:grid-cols-2">
            {availableProducts.length ? (
              availableProducts.map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  onClick={() => addProduct(product.id)}
                  className="h-auto justify-start gap-3 rounded-xl border-gray-200 p-2 text-right hover:border-[#370080]/25 hover:bg-[#370080]/6"
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#1E2939]">{product.name}</span>
                  </span>
                </Button>
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-sm font-light text-[#6A7282]">
                کالایی برای نمایش پیدا نشد.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
