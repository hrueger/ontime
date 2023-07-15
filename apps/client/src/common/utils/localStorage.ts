export function booleanFromLocalStorage(key: string, fallback: boolean): boolean {
  const valueInStorage = localStorage.getItem(key);
  if (valueInStorage) {
    return valueInStorage === 'true';
  } else {
    localStorage.setItem(key, String(fallback));
    return fallback;
  }
}

export function stringFromLocalStorage(key: string, fallback: string): string {
  const valueInStorage = localStorage.getItem(key);
  if (valueInStorage) {
    return valueInStorage;
  }
  localStorage.setItem(key, fallback);
  return fallback;
}
