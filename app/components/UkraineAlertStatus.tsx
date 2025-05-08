import { View, Text, StyleSheet } from "react-native";

type Props = {
  regionName: string;
  hasAlert: boolean;
};

export default function UkraineAlertStatus({ regionName, hasAlert }: Props) {
  return (
    <View style={[styles.container, hasAlert ? styles.alert : styles.safe]}>
      <Text style={styles.title}>
        📍 Region: <Text style={styles.region}>{regionName}</Text>
      </Text>
      <Text style={styles.status}>
        {hasAlert
          ? "🚨 Air alert is active in your region!"
          : "✅ No active alerts in your region."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  alert: {
    backgroundColor: "#FEE2E2",
    borderColor: "#DC2626",
    borderWidth: 1,
  },
  safe: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  region: {
    fontWeight: "bold",
    color: "#1D4ED8",
  },
  status: {
    fontSize: 16,
    textAlign: "center",
    color: "#111827",
  },
});
