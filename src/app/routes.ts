import { Header } from "./components/Header";
import { createElement, Fragment } from "react";
import { Footer } from "./components/Footer";
import { createBrowserRouter, redirect, Outlet, useLocation } from "react-router";
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
  const location = useLocation();
  return createElement(Fragment, null, createElement(Header), createElement(Outlet), createElement(Footer, { home: location.pathname === "/" }));
}

export const router = createBrowserRouter([{
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
