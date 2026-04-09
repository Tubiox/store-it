export const getTokenFromCookie = () => {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "token") {
      return value;
    }
  }

  return null;
};