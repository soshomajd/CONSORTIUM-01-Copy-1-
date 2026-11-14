export type CartItem = {
  id: string;
  name: string;
  code: string;
  unitPrice: number;
  qty: number;
  img?: string;
};

const KEY = "kd_cart";

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "qty">) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  const total = cart.reduce((s, i) => s + i.qty, 0);
  localStorage.setItem("cartCount", String(total));
  window.dispatchEvent(new Event("cartUpdate"));
}

export function setCartItemQuantity(id: string, qty: number) {
  const cart = getCart()
    .map(item => item.id === id ? { ...item, qty: Math.max(0, qty) } : item)
    .filter(item => item.qty > 0);
  saveCart(cart);
  localStorage.setItem("cartCount", String(cart.reduce((total, item) => total + item.qty, 0)));
  window.dispatchEvent(new Event("cartUpdate"));
}
