import Cookies from "js-cookie";

export function getItem(key: string) {
  try {
    const serializedItem = Cookies.get(key);
    return serializedItem;
  } catch (error) {
    console.error("Error reading from cookies", error);
    return null;
  }
}

export const clearCookies = () => {
  const cookies = Cookies.get();
  Object.keys(cookies).forEach((cookieName) => {
    Cookies.remove(cookieName);
  });
};
