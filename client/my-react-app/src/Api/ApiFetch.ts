export const apiFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

   const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, {
    ...options,
    headers,
  });
};