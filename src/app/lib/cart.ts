export function getCartCount(): number {
  return parseInt(localStorage.getItem("cartCount") ?? "0", 10);
}

export function addToCart(qty: number) {
  const current = getCartCount();
  localStorage.setItem("cartCount", String(current + qty));
  window.dispatchEvent(new Event("cartUpdate"));
}

export function removeFromCart(qty: number) {
  const current = getCartCount();
  const next = Math.max(0, current - qty);
  localStorage.setItem("cartCount", String(next));
  window.dispatchEvent(new Event("cartUpdate"));
}
