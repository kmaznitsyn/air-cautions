import { Text, View, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { regionData } from "./constants/regionsData";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import { Stack } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCurrentStatus,
  defineAlertFromStatus,
} from "./utils/air-raid-utils";

export default function AirRaidState() {
  const [selectedRegion, setSelectedRegion] = useState<{
    name: string;
    uid: number;
  } | null>(null);
  const [isAlert, setIsAlert] = useState(false);
  const [alertStatusText, setAlertStatusText] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);

  useEffect(() => {
    setAlertStatusText("");
    setIsAlert(false);
  }, [selectedRegion]);

  const params = useLocalSearchParams();

  const initialSelectedRegion = useMemo(() => {
    if (params.name && params.uid) {
      return {
        name: String(params.name),
        uid: Number(params.uid),
      };
    }
    return null;
  }, [params.name, params.uid]);

  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    if (isError) {
      setDisableButtons(true);
      const timeout = setTimeout(() => {
        setDisableButtons(false);
      }, 2 * 60 * 1000); // 2 minutes

      return () => clearTimeout(timeout);
    }
  }, [isError]);

  useEffect(() => {
    if (
      initialSelectedRegion &&
      (!selectedRegion || selectedRegion.uid !== initialSelectedRegion.uid)
    ) {
      setSelectedRegion(initialSelectedRegion);

      const index = regionData.findIndex(
        (region) => region.uid === initialSelectedRegion.uid
      );
      if (index !== -1) {
        dropdownRef.current?.selectIndex(index);
      }
    }
  }, [initialSelectedRegion]);

  const stateHandler = async () => {
    setIsFetching(true);

    try {
      const status = await getCurrentStatus(selectedRegion?.uid!);

      setIsAlert(defineAlertFromStatus(status));

      if (status === "A") {
        setAlertStatusText(
          `There is an existing alert in ${selectedRegion?.name}, be careful`
        );
      } else if (status === "P") {
        setAlertStatusText(
          `There is partial alert in ${selectedRegion?.name}, it is better to stay at home today`
        );
      } else {
        setAlertStatusText(
          `Currently there is no existing alert in ${selectedRegion?.name}`
        );
      }
    } catch (e) {
      setIsError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Air Raid State" }} />

      <Snackbar visible={isError} onDismiss={() => setIsError(false)}>
        There was occured an error. Please try later.
      </Snackbar>

      {isFetching && <ActivityIndicator size="large" color="#2563EB" />}

      <Text style={styles.title}>Choose your region</Text>

      <SelectDropdown
        ref={dropdownRef}
        data={regionData}
        onSelect={(selectedItem) => {
          setSelectedRegion(selectedItem);
        }}
        defaultValue={selectedRegion}
        renderButton={(selectedItem) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem.name) || "Please select region"}
            </Text>
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View
            style={[
              styles.dropdownItemStyle,
              isSelected && { backgroundColor: "#D2D9DF" },
            ]}
          >
            <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
          </View>
        )}
        dropdownStyle={styles.dropdownMenuStyle}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.buttonsContainer}>
        <Button
          disabled={disableButtons}
          mode="contained"
          onPress={stateHandler}
          style={styles.button}
        >
          Get the state
        </Button>

        {!isAlert && (
          <Button
            disabled={disableButtons}
            mode="contained"
            onPress={() =>
              router.push({
                pathname: "/air-raid-prediction",
                params: { ...selectedRegion },
              })
            }
            style={styles.button}
          >
            Predict
          </Button>
        )}
      </View>

      {alertStatusText && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>{alertStatusText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  dropdownButtonStyle: {
    width: 280,
    height: 50,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
    color: "#111827",
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  button: {
    borderRadius: 8,
  },
  alertContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  alertText: {
    fontSize: 22,
    textAlign: "center",
    color: "#EF4444",
    fontWeight: "600",
    fontFamily: "System",
  },
});
