import { LocationGeocodedAddress } from "expo-location";
import { regionData } from "../constants/regionsData";

export const getUserRegionMatch = (address: any) => {
  const inputRegion = address[0].region || "";
  const inputSubregion = address[0].subregion || "";

  let match =
    regionData.find((r) => r.name_en === inputRegion) ||
    regionData.find((r) => r.name_en === inputSubregion);

  return match || null;
};
