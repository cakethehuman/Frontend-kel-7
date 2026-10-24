export const rupiah = (n: number): string =>
  "Rp " + Math.round(n).toLocaleString("id-ID");
