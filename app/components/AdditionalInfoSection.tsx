// components/AdditionalInfoSection.tsx
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function AdditionalInfoSection() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.subMessage}>
        ℹ️ For more detailed information, click the button below
      </Text>

      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => router.navigate("/additional-information")}
      >
        Additional Information
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  subMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: "#374151",
  },
  button: {
    marginHorizontal: 32,
    borderRadius: 12,
    paddingVertical: 6,
  },
});
