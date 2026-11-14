import { ProductCatalogPage } from "./DiscountedProductsPage"
import { FlashDealCard } from "@/app/components/FlashDealCard"

export function ProductsPage() {
  return <ProductCatalogPage sidebarContent={<FlashDealCard />} />
}
