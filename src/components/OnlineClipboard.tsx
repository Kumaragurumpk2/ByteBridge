import React, { useState, useEffect, useRef } from "react";
import { 
  Copy, Check, QrCode, RefreshCw, Trash2, Download, Share2, 
  Sparkles, FileText, ArrowRight, Laptop, Smartphone 
} from "lucide-react";

interface OnlineClipboardProps {
  isDarkMode: boolean;
  currentRoomCode: string;
}

export default function OnlineClipboard({ isDarkMode, currentRoomCode }: OnlineClipboardProps) {
  const [clipboardText, setClipboardText] = useState<string>("");
  const [syncCode, setSyncCode] = useState<string>(currentRoomCode || "");
  const [remoteCode, setRemoteCode] = useState<string>("");
  
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "synced" | "error">("idle");
  const [pullStatus, setPullStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [liveSyncEnabled, setLiveSyncEnabled] = useState<boolean>(true);
  
  const [copied, setCopied] = useState<boolean>(false);
  const [pullCopied, setPullCopied] = useState<boolean>(false);
  const [pulledText, setPulledText] = useState<string>("");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state with current room code if it updates
  useEffect(() => {
    if (currentRoomCode && !syncCode) {
      setSyncCode(currentRoomCode);
    }
  }, [currentRoomCode]);

  // Read URL params for auto-pulling on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clipParam = params.get("clip") || params.get("room") || params.get("code");
    if (clipParam && clipParam.trim().length >= 4) {
      setSyncCode(clipParam);
      handlePullClipboard(clipParam);
    } else if (currentRoomCode) {
      handlePullClipboard(currentRoomCode);
    }
  }, []);

  // Sync to Cloud function
  const handlePushClipboard = async (textToSave: string, codeToSave: string) => {
    if (!codeToSave) return;
    setSyncStatus("saving");
    try {
      const res = await fetch(`/api/bridge/rooms/${codeToSave}/clipboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSave })
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatus("synced");
      } else {
        setSyncStatus("error");
      }
    } catch {
      setSyncStatus("error");
    }
  };

  // Debounced Auto-sync on typing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setClipboardText(val);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSyncStatus("saving");
    saveTimeoutRef.current = setTimeout(() => {
      handlePushClipboard(val, syncCode);
    }, 1000);
  };

  // Manual Pull function
  const handlePullClipboard = async (codeToPull: string) => {
    if (!codeToPull) return;
    setPullStatus("loading");
    try {
      const res = await fetch(`/api/bridge/rooms/${codeToPull}`);
      const data = await res.json();
      if (data.success) {
        const text = data.clipboardShare || "";
        setPulledText(text);
        if (codeToPull === syncCode) {
          setClipboardText(text);
        }
        setPullStatus("success");
      } else {
        setPullStatus("error");
      }
    } catch {
      setPullStatus("error");
    }
  };

  // Live Auto-Refresh polling (updates every 2 seconds if enabled)
  useEffect(() => {
    if (!liveSyncEnabled || !syncCode) return;

    const interval = setInterval(async () => {
      // Only poll when the tab is currently focused and user isn't actively writing (or is idle)
      if (document.visibilityState === "visible" && syncStatus !== "saving") {
        try {
          const res = await fetch(`/api/bridge/rooms/${syncCode}`);
          const data = await res.json();
          if (data.success && data.clipboardShare !== undefined) {
            if (data.clipboardShare !== clipboardText) {
              setClipboardText(data.clipboardShare);
              setSyncStatus("synced");
            }
          }
        } catch {
          // Silent catch
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [liveSyncEnabled, syncCode, clipboardText, syncStatus]);

  // Copy helpers
  const handleCopy = (text: string, isPull: boolean) => {
    navigator.clipboard.writeText(text);
    if (isPull) {
      setPullCopied(true);
      setTimeout(() => setPullCopied(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Clear clipboard
  const handleClear = () => {
    setClipboardText("");
    handlePushClipboard("", syncCode);
  };

  // Download clipboard as .txt file
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([clipboardText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `clipboard-${syncCode}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Generate direct web link
  const shareableUrl = `${window.location.origin}/?clip=${syncCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareableUrl)}`;

  return (
    <div className="space-y-6 animate-fade-in" id="clipboard-view-container">
      {/* Header Panel */}
      <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-black uppercase text-cyan-400 font-mono tracking-wider flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" /> Online Clipboard Transfer Sync
          </h3>
          <p className="text-xs text-white/50 font-mono text-[10px]">Instant cross-device copy-paste board. Generate scannable QR codes for mobile seamless transfer.</p>
        </div>
        <div className="flex gap-2 items-center text-[10px] uppercase font-mono">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white">
            <input 
              type="checkbox" 
              checked={liveSyncEnabled} 
              onChange={() => setLiveSyncEnabled(!liveSyncEnabled)} 
              className="rounded bg-black border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3 h-3 cursor-pointer"
            />
            <span>Auto Real-time Poll</span>
          </label>
          <span className={`px-2 py-0.5 rounded text-[9px] font-black ${liveSyncEnabled ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-white/5 text-white/30"}`}>
            {liveSyncEnabled ? "POLLING ACTIVE" : "MANUAL ONLY"}
          </span>
        </div>
      </div>

      {/* Main Grid: Shared Editor on Left, QR / Sync Key on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Shared Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 uppercase font-black text-[10px] tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" /> Live Shared Notepad Clipboard
              </span>
              <div className="flex items-center gap-3">
                {syncStatus === "saving" && <span className="text-cyan-400 text-[10px] animate-pulse">☁ Saving to Cloud...</span>}
                {syncStatus === "synced" && <span className="text-emerald-400 text-[10px]">✔ Synced and Live</span>}
                {syncStatus === "error" && <span className="text-rose-400 text-[10px]">✖ Network Sync Error</span>}
                
                <button 
                  onClick={handleClear}
                  className="text-white/40 hover:text-white transition uppercase text-[9px] flex items-center gap-1 font-bold cursor-pointer"
                  title="Clear board text"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={clipboardText}
              onChange={handleTextChange}
              placeholder="Paste text, codes, notes, or program outlines here on this device. Changes update dynamically on all secondary screens connected to the same pairing key!"
              className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline focus:outline-cyan-500 leading-relaxed shadow-inner focus:ring-0 resize-none h-[300px]"
            />

            {/* Quick Actions buttons row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
              <div className="text-[10px] text-white/40 font-mono">
                Character Count: <span className="text-cyan-400 font-bold">{clipboardText.length}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(clipboardText, false)}
                  disabled={!clipboardText}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-extrabold uppercase tracking-wide transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer border border-white/5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Content"}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!clipboardText}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg text-xs font-extrabold uppercase tracking-wide transition flex items-center gap-1.5 disabled:opacity-45 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download (.txt)
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-3 font-mono text-[11px] text-white/40 leading-relaxed">
            <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-white/60 font-bold block mb-1">How does it work?</span>
              This clipboard is saved instantly in sandboxed active Node threads. You can write instructions or log variables on a laptop, scan the generated QR code with an Android or iOS camera, and get the text instantly on your mobile screen.
            </div>
          </div>
        </div>

        {/* Right Column: QR Code & Connections */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active pairing code card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 font-mono">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">Access Sharing parameters:</span>
            
            <div className="bg-black/60 p-4 border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-white/40 text-[9px] block">SHARING ROOM CODE</span>
                <span className="text-2xl font-black text-cyan-400 tracking-widest">{syncCode || "--- ---"}</span>
              </div>
              <button 
                onClick={() => handlePullClipboard(syncCode)}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg hover:text-cyan-400 transition cursor-pointer"
                title="Force refresh clipboard sync"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code section */}
            <div className="flex flex-col items-center justify-center space-y-3 pt-2">
              <div className="bg-white p-3 rounded-xl border border-white/10 shadow-[0_4px_25px_rgba(34,211,238,0.15)] flex justify-center items-center">
                <img 
                  src={qrCodeUrl} 
                  alt="Scannable Clipboard QR Code" 
                  className="w-44 h-44 rounded"
                  onError={(e) => {
                    // Fail gracefully
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-center">
                <span className="text-xs font-black text-white/90 uppercase tracking-wide flex items-center justify-center gap-1">
                  <QrCode className="w-4 h-4 text-cyan-400" /> Scannable Sync QR Code
                </span>
                <p className="text-[10px] text-white/40 max-w-xs mt-1">
                  Point your mobile lens to import the direct board. Direct route URL:
                </p>
                <span className="text-[9px] text-cyan-400/80 hover:underline break-all block mt-1.5 font-bold select-all bg-black/40 p-1.5 rounded border border-white/5 max-w-sm mx-auto">
                  {shareableUrl}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Pull from Outer Device */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Pull Shared Clipboard Text:</span>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit sync code"
                  value={remoteCode}
                  onChange={(e) => setRemoteCode(e.target.value.toUpperCase().trim())}
                  className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 uppercase focus:outline-cyan-500 font-black tracking-widest text-center"
                />
                <button
                  onClick={() => handlePullClipboard(remoteCode)}
                  disabled={pullStatus === "loading" || !remoteCode}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black rounded-lg uppercase transition tracking-wide disabled:opacity-40 cursor-pointer"
                >
                  {pullStatus === "loading" ? "Pulling..." : "Pull Clip"}
                </button>
              </div>

              {pullStatus === "error" && (
                <p className="text-[10px] text-rose-400 font-bold">✖ Room session code not found or expired.</p>
              )}

              {pullStatus === "success" && pulledText !== undefined && (
                <div className="bg-black/60 p-3.5 border border-cyan-500/20 rounded-lg space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-emerald-400 font-bold text-[9px] tracking-wide flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> PULLED SUCCESS
                    </span>
                    <button
                      onClick={() => handleCopy(pulledText, true)}
                      className="text-cyan-400 hover:underline hover:text-white transition uppercase text-[9px] flex items-center gap-1 font-bold"
                    >
                      {pullCopied ? "Copied!" : "Copy Text"}
                    </button>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed select-all font-mono break-all max-h-32 overflow-y-auto bg-black/40 p-2 rounded">
                    {pulledText || <em className="text-white/20 select-none">No clipboard content shared yet.</em>}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
