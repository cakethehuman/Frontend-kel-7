import type { RefObject } from "react";
import type { CartItem } from "@/lib/cartStore";

export type OrderType = "dinein" | "takeaway";
export type Payment = "Cash" | "QRIS" | "Transfer";

export interface FormState {
  name: string;
  phone: string;
  type: OrderType;
  table: string;
  payment: Payment;
  note: string;
}

export type FieldKey = "name" | "phone" | "table";
export type FormErrors = Partial<Record<FieldKey, boolean>>;
export type FieldRefs = Record<FieldKey, RefObject<HTMLInputElement | null>>;

export interface Order {
  name: string;
  phone: string;
  type: OrderType;
  table: string | null;
  payment: Payment;
  note: string;
  items: CartItem[];
  count: number;
  total: number;
  number?: string;
}
