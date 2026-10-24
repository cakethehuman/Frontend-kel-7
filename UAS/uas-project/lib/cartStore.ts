import type { MenuItem } from "@/data/menu";

export interface CartItem extends MenuItem {
  qty: number;
}

const KEY = "mb_cart";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? (data as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(cart: CartItem[]) {
  try {
    if (cart.length) sessionStorage.setItem(KEY, JSON.stringify(cart));
    else sessionStorage.removeItem(KEY);
  } catch {
  }
  listeners.forEach((listener) => listener());
}

let cachedRaw: string | null = null;
let cachedCart: CartItem[] = EMPTY;

export const CartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): CartItem[] {
    const raw = readRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedCart = raw ? parse(raw) : EMPTY;
    }
    return cachedCart;
  },
  getServerSnapshot(): CartItem[] {
    return EMPTY;
  },
  add(item: MenuItem) {
    const cart = parse(readRaw());
    const found = cart.find((c) => c.id === item.id);
    if (found) found.qty = Math.min(99, found.qty + 1);
    else cart.push({ ...item, qty: 1 });
    write(cart);
  },
  setQty(id: string, qty: number) {
    const cart = parse(readRaw());
    const found = cart.find((c) => c.id === id);
    if (found) found.qty = Math.min(99, Math.max(1, qty));
    write(cart);
  },
  remove(id: string) {
    write(parse(readRaw()).filter((c) => c.id !== id));
  },
  clear() {
    write([]);
  },
};
