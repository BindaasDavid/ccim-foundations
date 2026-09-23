export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return { ...fallback, ...JSON.parse(raw) } as T
  } catch {
    return fallback
  }
}

export function saveState<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}
