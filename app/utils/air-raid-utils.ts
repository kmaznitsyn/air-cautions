import axios from "axios";
import dayjs from "dayjs";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
interface Alert {
  alert_type: string;
  started_at: string;
  finished_at: string | null;
}

console.log(API_KEY);

async function getAlertHistory(
  uid: number,
  period: string = "month_ago"
): Promise<Alert[]> {
  const url = `https://api.alerts.in.ua/v1/regions/${uid}/alerts/${period}.json?token=${API_KEY}`;
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error("Unable to get Alert History");
  }
  return response.data.alerts;
}

export async function getCurrentStatus(uid: number): Promise<string> {
  const url = `https://api.alerts.in.ua/v1/iot/active_air_raid_alerts/${uid}.json?token=${API_KEY}`;
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error("Unable to get Status of Alert");
  }
  return response.data; // A, P або N
}

export function defineAlertFromStatus(status: string) {
  if (status === "A" || status === "P") {
    return true;
  }
  return false;
}

export async function predictAirRaid(uid: number): Promise<string | undefined> {
  try {
    const alerts = await getAlertHistory(uid);
    const airRaids = alerts.filter((alert) => alert.alert_type === "air_raid");

    if (airRaids.length === 0) {
      console.log("Ймовірність повітряної тривоги: 0%");
      return;
    }

    const alertPerDay: Record<string, number> = {};

    airRaids.forEach((alert) => {
      const date = dayjs(alert.started_at).format("YYYY-MM-DD");
      alertPerDay[date] = (alertPerDay[date] || 0) + 1;
    });

    const totalDays = Object.keys(alertPerDay).length;
    const totalAlerts = airRaids.length;
    const averagePerDay = totalAlerts / totalDays;

    const currentStatus = await getCurrentStatus(uid);

    let prediction: string;
    if (currentStatus === "A" || averagePerDay > 2) {
      prediction = "🔴 Huge propability of an air raid alert";
    } else if (averagePerDay > 1) {
      prediction = "🟠 Medium propability of an air raid alert";
    } else {
      prediction = "🟢 Low propability of an air raid alert";
    }
    return prediction;
  } catch (error) {
    return "Unable to predict air raid alert due to " + error;
  }
}
