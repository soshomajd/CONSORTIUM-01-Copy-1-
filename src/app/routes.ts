import { createElement, Fragment } from "react";
import { Footer } from "./components/Footer";
import { createBrowserRouter, createHashRouter, redirect, Outlet } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { HomePage } from "./pages/Home";
import { ProductPage } from "./pages/ProductPage";
import { LoginPage } from "./pages/LoginPage";
import { OtpPage } from "./pages/OtpPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmPage } from "./pages/OrderConfirmPage";
import { BrandPage } from "./pages/BrandPage";
import { AlbumPage } from "./pages/AlbumPage";
import { DiscountsPage } from "./pages/DiscountsPage";
import { DiscountedProductsPage } from "./pages/DiscountedProductsPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ComparePage } from "./pages/ComparePage";
import { SalesPricingDetailsPage } from "./pages/SalesPricingDetailsPage";

function existingBrandRoute({ params }: LoaderFunctionArgs) {
  const brand = params.name ?? params.brandName;
  if (brand !== "next" && brand !== "wall-master") {
    throw new Response("صفحه یافت نشد", { status: 404 });
  }
  return null;
}

function SiteLayout() {
  return createElement(Fragment, null, createElement(Outlet), createElement(Footer));
}

// Pages serves static files, so keep client routes in the URL fragment there.
const createRouter = import.meta.env.VITE_GITHUB_PAGES === "true"
  ? createHashRouter
  : createBrowserRouter;

export const router = createRouter([{
  Component: SiteLayout,
  children: [
  { path: "/",              Component: HomePage         },
  { path: "/product/:name", Component: ProductPage      },
  { path: "/login",         Component: LoginPage        },
  { path: "/otp",           Component: OtpPage          },
  { path: "/profile",       Component: ProfilePage      },
  { path: "/profile/pricing-details", Component: SalesPricingDetailsPage },
  { path: "/pricing-details", Component: SalesPricingDetailsPage },
  { path: "/cart",          Component: CartPage         },
  { path: "/checkout",      Component: CheckoutPage     },
  { path: "/order-confirm", Component: OrderConfirmPage },
  { path: "/discounts",  Component: DiscountsPage },
  { path: "/discount", Component: DiscountsPage },
  { path: "/discounted-products", Component: DiscountedProductsPage },
  { path: "/products", Component: ProductsPage },
  { path: "/compare",        Component: ComparePage      },
  { path: "/dicount",   loader: () => redirect("/discounts") },
  { path: "/product",   loader: () => redirect("/") },
{ path: "/brand/:name", loader: existingBrandRoute, Component: BrandPage },
  { path: "/brand/:brandName/album/:albumSlug", loader: existingBrandRoute, Component: AlbumPage },
  ],
}]);
