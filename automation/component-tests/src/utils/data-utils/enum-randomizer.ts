export function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
    const values = Object.values(enumObj);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex] as T[keyof T];
  }