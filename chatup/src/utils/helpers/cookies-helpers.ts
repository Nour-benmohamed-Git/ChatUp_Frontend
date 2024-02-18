import Cookies from "js-cookie";
interface Item {
  key: string;
  value: string;
}

export function storeItem(items: Item[], expirationDays: number): void {
  const expirationTime = expirationDays * 24 * 60 * 60 * 1000;
  try {
    items.forEach((item) => {
      Cookies.set(item.key, item.value, { expires: expirationTime });
    });
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
export const clearCookies = () => {
  const cookies = Cookies.get();
  Object.keys(cookies).forEach((cookieName) => {
    Cookies.remove(cookieName);
  });
};
