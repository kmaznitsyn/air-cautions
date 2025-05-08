import { Text, View, Linking, Pressable, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function AdditionalInformation() {
  const openLink = () => {
    Linking.openURL("https://alerts.in.ua/");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Additional Information" }} />

      <Text style={styles.title}>⚠️ Air Raid Risk Insight</Text>

      <Text style={styles.description}>
        This app helps users assess the current level of danger in specific
        regions based on official alert data.
      </Text>

      <Text style={styles.description}>
        For a complete overview of alerts across all regions and sources, visit{" "}
        <Text style={styles.link} onPress={openLink}>
          this page
        </Text>
        .
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#111827",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#374151",
    marginBottom: 12,
    lineHeight: 24,
  },
  link: {
    color: "#2563EB",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
