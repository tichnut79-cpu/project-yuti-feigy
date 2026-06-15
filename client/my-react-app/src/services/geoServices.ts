export async function searchCities(q: string) {
  const res = await fetch(`/api/geo/cities?q=${q}`);
  return res.json();
}

export async function searchStreets(q: string, city: string) {
  const res = await fetch(
    `/api/geo/streets?q=${q}&city=${city}`
  );
  return res.json();
}