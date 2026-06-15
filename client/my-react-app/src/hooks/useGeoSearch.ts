import { searchCities, searchStreets } from "../services/geoServices";

export function useGeoSearch() {
  return { searchCities, searchStreets };
}