import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { predictAirRaid } from "./utils/air-raid-utils";
import { ActivityIndicator, Snackbar } from "react-native-paper";

export default function AirRaidPrediction() {
  const { uid, name } = useLocalSearchParams();
  const [prediction, setPrediction] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!uid) return;
      try {
        const predictionResult = await predictAirRaid(parseInt(uid as string));
        setPrediction(predictionResult || "");
      } catch (e) {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [uid, name]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Air Raid Prediction" }} />

      <Snackbar visible={isError} onDismiss={() => setIsError(false)}>
        There was occured an error. Please try later.
      </Snackbar>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>Prediction for</Text>
          <Text style={styles.region}>{name}</Text>
          <Text style={styles.probability}>
            Probability of Air Raid Alert:{"\n "}
            <Text style={styles.highlight}>{prediction}</Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  region: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  probability: {
    fontSize: 18,
    color: "#4B5563",
    textAlign: "center",
  },
  highlight: {
    fontWeight: "700",
    color: "#EF4444",
  },
});
