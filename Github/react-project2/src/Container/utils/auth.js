export const isLogin = () => {
  if (localStorage.getItem("tokens")) {
    return true;
  }
  return false;
};
