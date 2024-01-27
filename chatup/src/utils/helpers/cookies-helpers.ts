import Cookies from "js-cookie";

export function storeItem(
  key: string,
  value: string,
  expirationDays: number
): void {
  try {
    const expirationTime = expirationDays * 24 * 60 * 60 * 1000;
    Cookies.set(key, value, { expires: expirationTime });
  } catch (error) {
    console.error("Error saving to cookies", error);
  }
}
export function getItem(key: string) {
  try {
    const serializedItem = Cookies.get(key);
    return serializedItem;
  } catch (error) {
    console.error("Error reading from cookies", error);
    return null;
  }
}
export function deleteItem(key: string): void {
  try {
    Cookies.remove(key);
  } catch (error) {
    console.error("Error deleting cookie", error);
  }
}
