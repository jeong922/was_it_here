export function setDelay(callback: () => void, ms: number) {
  return setTimeout(callback, ms);
}
