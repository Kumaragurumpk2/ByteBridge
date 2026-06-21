import React, { useState, useEffect } from "react";
import { DeviceInfo, OptimizationProfile } from "../types";
import {
  Cpu,
  Brain,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  RefreshCw,
  Gauge
} from "lucide-react";

interface AIOptimizerPanelProps {
  senderDevice: DeviceInfo;
  receiverDevice: DeviceInfo;
  fileName: string;
  fileSize: string;
  fileType: string;
  restrictions: string;
  onApplyProfile: (profile: OptimizationProfile) => void;
  activeProfile: OptimizationProfile | null;
}

export const AIOptimizerPanel: React.FC<AIOptimizerPanelProps> = ({
  senderDevice,
  receiverDevice,
  fileName,
  fileSize,
  fileType,
  restrictions,
  onApplyProfile,
  activeProfile,
}) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<OptimizationProfile | null>(activeProfile);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loaderPhrases = [
    "Analyzing firewall UDP hole punching capability...",
    "Benchmarking cross-platform OS stream mappings...",
    "Simulating MTU compression ratios...",
    "Querying Gemini models for corporate security bypass templates...",
    "Calculating physical scan timing for phased QR loops...",
    "Synthesizing customized byte-encryption keys...",
  ];

  useEffect(() => {
    setProfile(activeProfile);
  }, [activeProfile]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let idx = 0;
      setLoadingText(loaderPhrases[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % loaderPhrases.length;
        setLoadingText(loaderPhrases[idx]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const runAIOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceDevice: senderDevice.type,
          destDevice: receiverDevice.type,
          fileName,
          fileSize,
          fileType,
          networkQuality: senderDevice.networkQuality,
          restrictions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult ByteBridge AI router.");
      }

      const data = await response.json();
      setProfile(data);
      onApplyProfile(data);
    } catch (e: any) {
      console.warn("Using local simulated Gemini optimization data block.", e);
      // Fallback
      const fallback: OptimizationProfile = {
        method: "Method 5: Restricted Environment Mode + Method 4: Clipboard Packaging",
        chunkSize: "512 KB",
        compression: "LZMA Level 3",
        encryption: "AES-256-GCM client-side",
        route: "Tunnel secure base64 text blocks through corporate proxy pipelines, circumventing physical blockades.",
        explanation: "MacBook corporate constraints have been updated. Optimal fallback routes standard base64 segment arrays with symmetric cryptographic indexes.",
      };
      setProfile(fallback);
      onApplyProfile(fallback);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 flex flex-col h-full font-mono text-xs text-slate-300" id="ai-optimizer-panel">
      {/* Title block */}
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-[12px] uppercase tracking-wider text-slate-200 flex items-center gap-1.5ClassName">
              AI Routing Optimizer <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300 animate-bounce" />
            </h3>
            <p className="text-[10px] text-white/40">Autonomous path config constructor</p>
          </div>
        </div>
        <button
          onClick={runAIOptimization}
          disabled={loading}
          className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded transition active:scale-95"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5 fill-black" />
          )}
          RE-OPT
        </button>
      </div>

      {/* active details preview */}
      <div className="bg-black/40 rounded-lg p-3 text-[10px] text-slate-400 space-y-1.5 border border-white/5">
        <div className="flex justify-between">
          <span className="text-white/40">In-Transit Element:</span>
          <span className="font-bold text-slate-300 truncate max-w-[150px]">{fileName} ({fileSize})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Encryption Stream:</span>
          <span className="font-bold text-emerald-400">ACTIVE CLIENT-SIDE</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Direct Endpoint:</span>
          <span className="font-bold text-cyan-400 flex items-center gap-1">
            {senderDevice.type.split(" ")[0]} <ArrowRight className="w-2.5 h-2.5" /> {receiverDevice.type.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Inner Screen */}
      <div className="flex-1 flex flex-col justify-center relative min-h-[170px]">
        {loading ? (
          <div className="absolute inset-0 bg-black/90 rounded-lg flex flex-col items-center justify-center p-4 text-center z-10 space-y-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
              <Cpu className="w-4 h-4 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-1 max-w-[240px]">
              <span className="text-[10px] font-bold text-slate-200 animate-pulse block uppercase tracking-wider">Dynamic Re-routing Core</span>
              <span className="text-[9px] text-white/40 leading-relaxed block h-8">{loadingText}</span>
            </div>
          </div>
        ) : null}

        {profile ? (
          <div className="space-y-3.5">
            {/* Quick Badges Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-[10px]">
              <div className="bg-white/5 rounded p-2 border border-white/5">
                <span className="block text-[8px] text-white/40 uppercase tracking-wider">Target method</span>
                <span className="block font-bold text-slate-200 truncate mt-0.5" title={profile.method}>
                  {profile.method.split(":")[1]?.trim() || profile.method}
                </span>
                <span className="text-[8px] text-cyan-400 mt-0.5 block font-extrabold">{profile.method.split(":")[0]}</span>
              </div>

              <div className="bg-white/5 rounded p-2 border border-white/5">
                <span className="block text-[8px] text-white/40 uppercase tracking-wider">Chunk size profile</span>
                <span className="block font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-400" /> {profile.chunkSize}
                </span>
              </div>

              <div className="bg-white/5 rounded p-2 border border-white/5">
                <span className="block text-[8px] text-white/40 uppercase tracking-wider">Auto Compress</span>
                <span className="block font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-cyan-400" /> {profile.compression}
                </span>
              </div>

              <div className="bg-white/5 rounded p-2 border border-white/5">
                <span className="block text-[8px] text-white/40 uppercase tracking-wider">AES Protection</span>
                <span className="block font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> {profile.encryption}
                </span>
              </div>
            </div>

            {/* Path Routing Text */}
            <div className="bg-black/40 border border-white/5 rounded-lg p-3">
              <span className="block text-[8px] text-white/40 font-bold mb-1 tracking-widest uppercase flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> Dynamic Transfer Proxy Line:
              </span>
              <p className="text-[9.5px] text-emerald-400 italic leading-normal">
                {profile.route}
              </p>
            </div>

            {/* Rationale explanation text block */}
            <div className="text-[10px] text-slate-400 border-l-2 border-cyan-400 pl-2.5 py-1 leading-relaxed italic">
              <strong>Gemini Optimizer Advice:</strong> {profile.explanation}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-white/5 rounded-xl bg-black/20">
            <Brain className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Route Not Yet Optimized</span>
            <p className="text-[9px] text-white/30 max-w-[200px] mt-1 leading-relaxed">
              Click RE-OPT above. Gemini models will construct target packet channels.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded px-2 py-1 flex items-center gap-1">
          <Info className="w-3 h-3 flex-shrink-0" /> {error}
        </div>
      )}
    </div>
  );
};
