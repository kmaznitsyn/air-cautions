// components/OutsideUkraineMessage.tsx
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function OutsideUkraineMessage() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.message}>
        🌍 You appear to be outside Ukraine. However, you can still check the
        current air raid alert status below.
      </Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.navigate("/air-raid-state")}
      >
        Get Air Alert State
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  message: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  button: {
    marginHorizontal: 32,
    borderRadius: 12,
    paddingVertical: 6,
  },
});
