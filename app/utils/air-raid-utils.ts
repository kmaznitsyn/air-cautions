import axios from "axios";
import dayjs from "dayjs";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
interface Alert {
  alert_type: string;
  started_at: string;
  finished_at: string | null;
}

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

export type PredictionLevel = "high" | "medium" | "low";

const PREDICTION_CACHE_TTL = 4 * 60 * 1000; // 4 minutes

type PredictionCacheEntry = {
  level: PredictionLevel;
  cachedAt: number;
};

const predictionCache = new Map<number, PredictionCacheEntry>();

export function invalidatePredictionCache(uid: number): void {
  predictionCache.delete(uid);
}

export async function predictAirRaid(uid: number): Promise<PredictionLevel | undefined> {
  const cached = predictionCache.get(uid);
  if (cached && Date.now() - cached.cachedAt < PREDICTION_CACHE_TTL) {
    return cached.level;
  }

  const alerts = await getAlertHistory(uid);
  const airRaids = alerts.filter((alert) => alert.alert_type === "air_raid");

  if (airRaids.length === 0) {
    return "low";
  }

  const alertPerDay: Record<string, number> = {};
  airRaids.forEach((alert) => {
    const date = dayjs(alert.started_at).format("YYYY-MM-DD");
    alertPerDay[date] = (alertPerDay[date] || 0) + 1;
  });

  const averagePerDay = airRaids.length / Object.keys(alertPerDay).length;
  const currentStatus = await getCurrentStatus(uid);

  const level: PredictionLevel =
    currentStatus === "A" || averagePerDay > 2
      ? "high"
      : averagePerDay > 1
      ? "medium"
      : "low";

  predictionCache.set(uid, { level, cachedAt: Date.now() });
  return level;
}
