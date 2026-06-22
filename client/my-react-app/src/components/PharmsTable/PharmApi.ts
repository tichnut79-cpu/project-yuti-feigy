// api/pharmApi.ts
export const getPharmacies = async (city?: string) => {
  const url = city
    ? `/api/pharmacies?city=${encodeURIComponent(city)}`
    : `/api/pharmacies`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch pharmacies");
  }

  return res.json();
};