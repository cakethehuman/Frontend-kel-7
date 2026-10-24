import { useSyncExternalStore } from "react";
import { CartStore, type CartItem } from "@/lib/cartStore";

const subscribeNoop = () => () => {};

export function useCart(): CartItem[] {
  return useSyncExternalStore(
    CartStore.subscribe,
    CartStore.getSnapshot,
    CartStore.getServerSnapshot,
  );
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}
