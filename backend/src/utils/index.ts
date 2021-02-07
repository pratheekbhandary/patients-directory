export function parseToInterger(str: string | undefined): number | undefined {
  const num = parseInt(String(str));
  return Number.isNaN(num) ? undefined : num;
}
