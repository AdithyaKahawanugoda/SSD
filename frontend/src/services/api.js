import { AUTH_BASE_URL } from "../constants";

export const logoutHandler = () => {
  localStorage.clear();
  window.open(`${AUTH_BASE_URL}/auth/logout`, "_self");
};
