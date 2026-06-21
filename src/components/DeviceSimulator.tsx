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
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full font-mono text-xs text-slate-300" id={`device-sim-${device.id}`}>
      {/* Header */}
      <div className="bg-black/45 border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-sm ${isSender ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-400"}`}>
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-200">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="flex h-1.5 w-1.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${device.isOnline ? "bg-emerald-400" : "bg-rose-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${device.isOnline ? "bg-emerald-500" : "bg-rose-500"}`}></span>
          </span>
          <span className="text-white/40">{device.isOnline ? "SYNCED" : "OFFLINE"}</span>
        </div>
      </div>

      {/* Content Form */}
      <div className="p-4 space-y-4 flex-1">
        {/* Profile Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] uppercase text-white/40 mb-1">Device Name</label>
            <input
              type="text"
              value={device.name}
              onChange={(e) => onChange({ ...device, name: e.target.value })}
              className="w-full text-xs font-mono bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-cyan-500 focus:bg-black transition-all"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase text-white/40 mb-1">Platform OS</label>
            <select
              value={device.type}
              onChange={(e) => handleOSChange(e.target.value as DeviceType)}
              className="w-full text-xs font-mono bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-cyan-500 focus:bg-black transition-all"
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
            <div className="flex justify-between items-center text-[10px] text-white/50 mb-1">
              <span className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-white/30" /> Battery Level
              </span>
              <span className="text-emerald-400 font-bold">{device.batteryLevel}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={device.batteryLevel}
              onChange={(e) => onChange({ ...device, batteryLevel: Number(e.target.value) })}
              className="w-full h-1 bg-black/60 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
            />
          </div>

          {/* Network presets */}
          <div>
            <label className="flex items-center gap-1 block text-[9px] uppercase text-white/40 mb-1">
              <Wifi className="w-3.5 h-3.5 text-white/30" /> Transmission Channel
            </label>
            <select
              value={device.networkQuality}
              onChange={(e) => onChange({ ...device, networkQuality: e.target.value })}
              className="w-full text-xs font-mono bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-cyan-500 focus:bg-black transition-all"
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
            <div className="pt-3 border-t border-white/5 space-y-2">
              <label className="flex items-center gap-1 block text-[9px] uppercase text-rose-400 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" /> Firewall Blockade Presets
              </label>

              <select
                value={restrictionsPresets.find(p => p.value === restrictions)?.value ?? "Custom Settings"}
                onChange={(e) => {
                  if (e.target.value !== "Custom Settings") {
                    onRestrictionsChange(e.target.value);
                  }
                }}
                className="w-full text-xs font-mono bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-cyan-500 focus:bg-black transition-all"
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
                className="w-full text-xs font-mono bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-slate-100 focus:outline-cyan-500 focus:bg-black transition-all leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-black/30 border-t border-white/5 px-4 py-2 flex items-center justify-between text-[9px] text-white/30">
        <span>PEER MAC: {device.id}</span>
        <span className="flex items-center gap-1 uppercase hover:text-white transition">
          <CheckCircle className="w-3 h-3 text-emerald-400" /> Secure Handshake
        </span>
      </div>
    </div>
  );
};
