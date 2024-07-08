export const globals = {
  tokenKey: "authToken",
  currentUserId: "currentUserId",
  authorizationKey: "Authorization",
  unauthorizedCode: 401,
  algorithm: "HS256",
  expireIn: 24 * 60 * 60 * 1000,
};
export const maxFileSize = 5 * 1024 * 1024;
export const units = ["B", "KB", "MB", "GB", "TB"];
export const acceptedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export enum MenuPosition {
  BOTTOM_RIGHT = "bottom-right",
  BOTTOM_LEFT = "bottom-left",
  TOP_RIGHT = "top-right",
  TOP_LEFT = "top-left",
}

export enum Direction {
  "FORWARD",
  "BACKWARD",
}
