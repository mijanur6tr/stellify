/**
 * Formats numbers into Bangladeshi Taka currency format (e.g. ৳1,650)
 */
export function formatBDT(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '৳0';
  }
  const numericAmount = Math.round(Number(amount));
  return `৳${numericAmount.toLocaleString('en-BD')}`;
}
