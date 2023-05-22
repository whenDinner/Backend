export function isValidInterface<T>(obj: T, interfaceCheck: T): boolean {
  for (const key in interfaceCheck) {
    if (!obj.hasOwnProperty(key) || typeof obj[key] !== typeof interfaceCheck[key]) {
      return false;
    }
  }
  return true;
}

export function isValidType<T>(value: any, validTypes: T[]): value is T {
  return validTypes.includes(value as T);
}