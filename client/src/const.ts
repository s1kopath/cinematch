export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Authentication has been removed. getLoginUrl now returns root as a fallback.
export const getLoginUrl = () => {
  return "/";
};
