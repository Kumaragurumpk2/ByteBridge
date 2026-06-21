import React from "react";
import { DeviceType, DeviceInfo } from "../types";
import {
  Laptop,
  Smartphone,
  Tablet as TabletIcon,
  Tv,
  Wifi,
  Battery,
  ShieldAlert,
  CheckCircle,
  Monitor
} from "lucide-react";

interface DeviceSimulatorProps {
  device: DeviceInfo;
  onChange: (updated: DeviceInfo) => void;
  title: string;
  isSender: boolean;
  restrictions: string;
  onRestrictionsChange: (val: string) => void;
  isDarkMode: boolean;
}

export const deviceTypeIcons: Record<DeviceType, React.ComponentType<any>> = {
  "Windows PC": Laptop,
  "Linux PC": Laptop,
  MacBook: Laptop,
  "Android Phone": Smartphone,
  iPhone: Smartphone,
  Tablet: TabletIcon,
  "Smart TV": Tv,
  Chromebook: Monitor,
};

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  device,
  onChange,
  title,
  isSender,
  restrictions,
  onRestrictionsChange,
  isDarkMode,
}) => {
  const IconComponent = deviceTypeIcons[device.type] || Laptop;

  const handleOSChange = (type: DeviceType) => {
    let defaultNet = "Excellent WiFi";
    if (type === "Smart TV") defaultNet = "Ethernet (Restricted)";
    if (type === "Android Phone" || type === "iPhone") defaultNet = "Cellular 5G";

    onChange({
      ...device,
      type,
      name: `${type.split(" ")[0]}-Node`,
      networkQuality: defaultNet
    });
  };

  const networkOptions = [
    "Excellent WiFi (Gigabit)",
    "Average Home Wi-Fi",
    "Restricted Corporate LAN",
    "Cellular 5G Network",
    "Slow 4G / Tethered Spot",
    "Air-Gapped Local Subnet",
  ];

  const restrictionsPresets = [
    { label: "None (Direct Connection Handshake)", value: "" },
    { label: "USB Storage Blocks & MDM Lockdown", value: "MDM policy restricts USB mounting. Drives blocked." },
    { label: "High Corporate Firewall (No File-Up or Cloud Drives)", value: "Strict NAT. WebSockets/CloudStorage (Dropbox, GDrive) blocked by firewall proxy." },
    { label: "Secure Banking LAN (Strict Host Isolation)", value: "Machines on same local network isolated completely from peer communication." },
    { label: "Total Air-gapped Offline Environment", value: "Absolutely no access to WAN. Pure peer physical offline constraints exist." },
  ];

  return (
    <div className={`rounded-xl overflow-hidden flex flex-col h-full font-mono text-xs ${
      isDarkMode 
        ? "bg-white/5 border border-white/10 text-slate-300" 
        : "bg-white border border-slate-200 text-slate-700 shadow-xs"
    }`} id={`device-sim-${device.id}`}>
      {/* Header */}
      <div className={`border-b px-4 py-2.5 flex items-center justify-between ${
        isDarkMode ? "bg-black/45 border-white/5" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-sm ${isSender ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-400"}`}>
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <span className={`font-extrabold uppercase tracking-wider text-[11px] ${
            isDarkMode ? "text-slate-200" : "text-slate-900"
          }`}>{title}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="flex h-1.5 w-1.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${device.isOnline ? "bg-emerald-400" : "bg-rose-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${device.isOnline ? "bg-emerald-500" : "bg-rose-500"}`}></span>
          </span>
          <span className={isDarkMode ? "text-white/40" : "text-slate-500"}>{device.isOnline ? "SYNCED" : "OFFLINE"}</span>
        </div>
      </div>

      {/* Content Form */}
      <div className="p-4 space-y-4 flex-1">
        {/* Profile Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-[9px] uppercase mb-1 ${isDarkMode ? "text-white/40" : "text-slate-500"}`}>Device Name</label>
            <input
              type="text"
              value={device.name}
              onChange={(e) => onChange({ ...device, name: e.target.value })}
              className={`w-full text-xs font-mono border rounded-lg px-2.5 py-1.5 focus:outline-cyan-500 transition-all ${
                isDarkMode 
                  ? "bg-black/40 border-white/10 text-slate-100 focus:bg-black focus:border-white/20" 
                  : "bg-white border-slate-350 text-slate-900 focus:bg-white focus:border-cyan-500 shadow-inner"
              }`}
            />
          </div>
          <div>
            <label className={`block text-[9px] uppercase mb-1 ${isDarkMode ? "text-white/40" : "text-slate-500"}`}>Platform OS</label>
            <select
              value={device.type}
              onChange={(e) => handleOSChange(e.target.value as DeviceType)}
              className={`w-full text-xs font-mono border rounded-lg px-2.5 py-1.5 focus:outline-cyan-500 transition-all cursor-pointer ${
                isDarkMode 
                  ? "bg-black/40 border-white/10 text-slate-100 focus:bg-black focus:border-white/20" 
                  : "bg-white border-slate-350 text-slate-900 focus:bg-white focus:border-cyan-500 shadow-inner"
              }`}
            >
              <option value="Windows PC">Windows PC</option>
              <option value="MacBook">MacBook</option>
              <option value="Linux PC">Linux PC</option>
              <option value="Android Phone">Android Phone</option>
              <option value="iPhone">iPhone</option>
              <option value="Tablet">Tablet</option>
              <option value="Smart TV">Smart TV</option>
              <option value="Chromebook">Chromebook</option>
            </select>
          </div>
        </div>

        {/* Sliders and Selects */}
        <div className="space-y-3">
          {/* Battery level */}
          <div>
            <div className={`flex justify-between items-center text-[10px] mb-1 ${isDarkMode ? "text-white/50" : "text-slate-500"}`}>
              <span className="flex items-center gap-1">
                <Battery className={`w-3.5 h-3.5 ${isDarkMode ? "text-white/30" : "text-slate-400"}`} /> Battery Level
              </span>
              <span className="text-emerald-500 font-bold">{device.batteryLevel}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={device.batteryLevel}
              onChange={(e) => onChange({ ...device, batteryLevel: Number(e.target.value) })}
              className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none ${
                isDarkMode ? "bg-black/60" : "bg-slate-200"
              }`}
            />
          </div>

          {/* Network presets */}
          <div>
            <label className={`flex items-center gap-1 block text-[9px] uppercase mb-1 ${isDarkMode ? "text-white/40" : "text-slate-500"}`}>
              <Wifi className={`w-3.5 h-3.5 ${isDarkMode ? "text-white/30" : "text-slate-400"}`} /> Transmission Channel
            </label>
            <select
              value={device.networkQuality}
              onChange={(e) => onChange({ ...device, networkQuality: e.target.value })}
              className={`w-full text-xs font-mono border rounded-lg px-2.5 py-1.5 focus:outline-cyan-500 transition-all cursor-pointer ${
                isDarkMode 
                  ? "bg-black/40 border-white/10 text-slate-100 focus:bg-black focus:border-white/20" 
                  : "bg-white border-slate-350 text-slate-900 focus:bg-white focus:border-cyan-500 shadow-inner"
              }`}
            >
              {networkOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Corporate Network Restrictions */}
          {isSender && (
            <div className={`pt-3 border-t space-y-2 ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
              <label className="flex items-center gap-1 block text-[9px] uppercase text-rose-500 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" /> Firewall Blockade Presets
              </label>

              <select
                value={restrictionsPresets.find(p => p.value === restrictions)?.value ?? "Custom Settings"}
                onChange={(e) => {
                  if (e.target.value !== "Custom Settings") {
                    onRestrictionsChange(e.target.value);
                  }
                }}
                className={`w-full text-xs font-mono border rounded-lg px-2.5 py-1.5 focus:outline-cyan-500 transition-all cursor-pointer ${
                  isDarkMode 
                    ? "bg-black/40 border-white/10 text-slate-100 focus:bg-black focus:border-white/20" 
                    : "bg-white border-slate-350 text-slate-900 focus:bg-white focus:border-cyan-500 shadow-inner"
                }`}
              >
                {restrictionsPresets.map((p) => (
                  <option key={p.label} value={p.value}>
                    {p.label}
                  </option>
                ))}
                <option value="Custom Settings">- Custom Restrictions -</option>
              </select>

              <textarea
                value={restrictions}
                onChange={(e) => onRestrictionsChange(e.target.value)}
                placeholder="Type custom local isolated ports parameters..."
                rows={2}
                className={`w-full text-xs font-mono border rounded-lg px-2.5 py-2 focus:outline-cyan-500 transition-all leading-relaxed ${
                  isDarkMode 
                    ? "bg-black/40 border-white/10 text-slate-100 focus:bg-black focus:border-white/20" 
                    : "bg-white border-slate-350 text-slate-800 focus:bg-white focus:border-cyan-500 shadow-inner"
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className={`border-t px-4 py-2 flex items-center justify-between text-[9px] ${
        isDarkMode 
          ? "bg-black/30 border-white/5 text-white/30" 
          : "bg-slate-50 border-slate-200 text-slate-450"
      }`}>
        <span>PEER MAC: {device.id}</span>
        <span className={`flex items-center gap-1 uppercase transition ${
          isDarkMode ? "text-white/30 hover:text-white" : "text-slate-450 hover:text-slate-900"
        }`}>
          <CheckCircle className="w-3 h-3 text-emerald-500" /> Secure Handshake
        </span>
      </div>
    </div>
  );
};
