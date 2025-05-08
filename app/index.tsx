import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import { Stack, useRouter } from "expo-router";

import OutsideUkraineMessage from "./components/OutsideUkraineMessage";
import AdditionalInfoSection from "./components/AdditionalInfoSection";
import { getUserRegionMatch } from "./utils/location-utils";

export default function Index() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<
    Location.LocationGeocodedAddress[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInUkraine, setIsInUkraine] = useState(true);

  const router = useRouter();

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location access denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const geocoded = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const country = geocoded?.[0]?.country;
      const insideUkraine = country === "Ukraine";

      setIsInUkraine(insideUkraine);
      if (insideUkraine) {
        setAddresses(geocoded);
        const userRegion = getUserRegionMatch(geocoded);
        router.push({
          pathname: "/air-raid-state",
          params: { ...userRegion },
        });
      }
    } catch (error) {
      setErrorMsg("Failed to fetch location");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (isLoading) {
    return <ActivityIndicator animating size="large" />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Air Raid Alert" }} />
      <Snackbar visible={!!errorMsg} onDismiss={() => setErrorMsg("")}>
        {errorMsg}
      </Snackbar>

      {!isInUkraine && <OutsideUkraineMessage />}
      {isInUkraine && (
        <Button
          mode="contained"
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/air-raid-state",
              params: { ...getUserRegionMatch(addresses) },
            })
          }
        >
          Get Air Alert State
        </Button>
      )}
      <AdditionalInfoSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  button: {
    borderRadius: 8,
    width: "60%",
    alignSelf: "center",
    margin: 8,
  },
});
