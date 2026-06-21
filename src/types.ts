export interface HistoryItem {
  id: string;
  name: string;
  sizeFormatted: string;
  type: "send" | "receive";
  status: "completed" | "interrupted" | "failed";
  timestamp: string;
  code: string;
}

export type DeviceType =
  | "Windows PC"
  | "Linux PC"
  | "MacBook"
  | "Android Phone"
  | "iPhone"
  | "Tablet"
  | "Smart TV"
  | "Chromebook";

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  batteryLevel: number;
  networkQuality: string;
  isOnline: boolean;
  isCurrentDevice?: boolean;
}

export interface OptimizationProfile {
  method: string;
  chunkSize: string;
  compression: string;
  encryption: string;
  route: string;
  explanation: string;
}

export interface TransferFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  totalChunks: number;
  uploadedCount: number;
  status: "pending" | "transferring" | "completed" | "failed" | "paused";
  senderId: string;
  receiverId?: string;
  speed: string;
  timeRemaining: string;
  dataBase64?: string; // compiled value for client reconstruction
}

export interface SecurityMethodDetail {
  id: string;
  title: string;
  description: string;
  badge: "High Network" | "Low Overhead" | "Ultra Secure" | "Fail-Safe";
  color: string;
}

