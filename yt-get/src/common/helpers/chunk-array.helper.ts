export function chunkArray<T>(arr: T[], size: number) {
  return Array(Math.ceil(arr.length / size))
    .fill(0)
    .map((_, i) => arr.slice(i * size, i * size + size));
}
