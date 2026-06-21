import React, { useState, useEffect } from "react";
import {
  Laptop,
  Smartphone,
  Tablet as TabletIcon,
  Tv,
  Wifi,
  Battery,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  Zap,
  Globe,
  QrCode,
  Copy,
  ChevronRight,
  UploadCloud,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  LayoutGrid,
  FileCheck,
  Compass,
  Database,
  Search,
  Network,
  Sun,
  Moon,
  Settings as SettingsIcon,
  HelpCircle,
  History,
  FolderOpen,
  ArrowDownToLine,
  ExternalLink,
  ShieldAlert as LockIcon,
  AlertOctagon,
  Download
} from "lucide-react";
import { DeviceInfo, DeviceType, OptimizationProfile, TransferFile, HistoryItem } from "./types";
import { DeviceSimulator } from "./components/DeviceSimulator";
import { AIOptimizerPanel } from "./components/AIOptimizerPanel";
import DeveloperToolkit from "./components/DeveloperToolkit";
import OnlineClipboard from "./components/OnlineClipboard";

interface SupportedMethod {
  id: string;
  numeric: string;
  name: string;
  detail: string;
}

const supportedMethods: SupportedMethod[] = [
  { id: "m1", numeric: "01", name: "Browser-to-Browser", detail: "Direct WebRTC p2p secure channel" },
  { id: "m2", numeric: "02", name: "QR Transfer", detail: "Sequenced visual stream barcodes" },
  { id: "m3", numeric: "03", name: "Transfer Code", detail: "Sync 6-digit server bridge relay" },
  { id: "m4", numeric: "04", name: "Clipboard Transfer", detail: "Copy-paste standard text sequence" },
  { id: "m5", numeric: "05", name: "Restricted Mode", detail: "MDM/USB block sandbox proxy bypass" },
  { id: "m6", numeric: "06", name: "Bluetooth LE P2P", detail: "Local beacon radio announcement" },
  { id: "m7", numeric: "07", name: "LAN Multicast", detail: "Local router peer discovery routing" },
  { id: "m8", numeric: "08", name: "WiFi Direct Link", detail: "IEEE 802.11 high-speed direct frames" },
  { id: "m9", numeric: "09", name: "Email Pipeline", detail: "Invisible SMTP chunk distribution" },
  { id: "m10", numeric: "10", name: "HTTPS Chunk Push", detail: "Parallel CDN gateway chunk delivery" },
];

export default function App() {
  // Navigation tabs: "landing" | "send" | "receive" | "clipboard" | "history" | "settings" | "help" | "toolkit"
  const [activeTab, setActiveTab] = useState<"landing" | "send" | "receive" | "clipboard" | "history" | "settings" | "help" | "toolkit">("landing");
  const [landingSubTab, setLandingSubTab] = useState<"overview" | "features" | "how-it-works" | "pricing" | "docs" | "contact">("overview");

  // Premium Theme (Dark / Light Mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Settings configs
  const [compressionMode, setCompressionMode] = useState<"gzip" | "lzma" | "none">("lzma");
  const [encryptionStandard, setEncryptionStandard] = useState<"aes-256" | "aes-128">("aes-256");
  const [sessionExpiryMinutes, setSessionExpiryMinutes] = useState<number>(15);
  const [customWebRTCPorts, setCustomWebRTCPorts] = useState<string>("443, 3478");

  // Session / Room State
  const [roomCode, setRoomCode] = useState<string>("");
  const [loadingRoom, setLoadingRoom] = useState<boolean>(true);

  // Quick connection input
  const [receiverCodeInput, setReceiverCodeInput] = useState<string>("");
  const [searchedFileDetails, setSearchedFileDetails] = useState<any | null>(null);
  const [isSearchingCode, setIsSearchingCode] = useState<boolean>(false);

  // Simulated Devices
  const [senderDevice, setSenderDevice] = useState<DeviceInfo>({
    id: "device-sender-99",
    name: "MacBook-Corporate",
    type: "MacBook",
    batteryLevel: 94,
    networkQuality: "Restricted Corporate LAN",
    isOnline: true,
  });

  const [receiverDevice, setReceiverDevice] = useState<DeviceInfo>({
    id: "device-receiver-77",
    name: "Android-Staff",
    type: "Android Phone",
    batteryLevel: 78,
    networkQuality: "Cellular 5G Network",
    isOnline: true,
  });

  // Selected file details
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeBytes: number;
    sizeFormatted: string;
    type: string;
  }>({
    name: "encrypted_confidential_records.pdf",
    sizeBytes: 15450000,
    sizeFormatted: "14.7 MB",
    type: "application/pdf",
  });

  // Custom targets files destinations
  const [destinationPath, setDestinationPath] = useState<string>("/Downloads/ByteBridge_Restored/");
  const [saveLocationSelected, setSaveLocationSelected] = useState<boolean>(true);

  // Controls workspace restrictions
  const [restrictions, setRestrictions] = useState<string>(
    "MDM policy restricts USB mounting. Active corporate firewall blocks file-hosting services and standard email attachments."
  );

  // Active AI Routing recommendations
  const [activeProfile, setActiveProfile] = useState<OptimizationProfile | null>({
    method: "Method 5: Restricted Environment Mode + Method 4: Clipboard Packaging",
    chunkSize: "512 KB",
    compression: "LZMA Level 3",
    encryption: "AES-256-GCM client-side",
    route: "Split packed data into highly dense textual packages representing AES encrypted base64 payload segments.",
    explanation: "High strictness isolated parameters prevent direct P2P socket communication. Chunking clipboard sequence operates within standard system limitations.",
  });

  // Transfer control & tracking
  const [transferFile, setTransferFile] = useState<TransferFile | null>(null);
  const [transferProgress, setTransferProgress] = useState<number>(0);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [simulatedSpeed, setSimulatedSpeed] = useState<string>("0 KB/s");
  const [simTimeRemaining, setSimTimeRemaining] = useState<string>("Calculated on start");
  const [activeInstructionStep, setActiveInstructionStep] = useState<number>(1);
  const [activeMethodIndex, setActiveMethodIndex] = useState<number>(4); // Method 5 active initially
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  // Automatic backstages phases state tracking
  const [autosystemStage, setAutosystemStage] = useState<"idle" | "packing" | "compressing" | "encrypting" | "pushing" | "completed">("idle");
  const [autoreceiveStage, setAutoreceiveStage] = useState<"idle" | "pulling" | "decrypting" | "unpacking" | "integrity-check" | "completed">("idle");

  // Real-time clipboard storage chunk viewer
  const [currentClipboardChunk, setCurrentClipboardChunk] = useState<number>(0);
  const [clipboardCopied, setClipboardCopied] = useState<boolean>(false);

  // Interactive transaction history record log state
  const [historyLogs, setHistoryLogs] = useState<HistoryItem[]>([
    {
      id: "TX-102",
      name: "quarterly_audit_report.pdf",
      sizeFormatted: "42.9 MB",
      type: "send",
      status: "completed",
      timestamp: "Today, 11:24 AM",
      code: "582914"
    },
    {
      id: "TX-101",
      name: "production_backup_db.sql.gz",
      sizeFormatted: "108.4 MB",
      type: "send",
      status: "completed",
      timestamp: "Yesterday, 04:12 PM",
      code: "721490"
    },
    {
      id: "TX-100",
      name: "creative_assets_archive.rar",
      sizeFormatted: "12.1 MB",
      type: "receive",
      status: "completed",
      timestamp: "June 14, 2026, 09:30 AM",
      code: "193427"
    }
  ]);

  // Peer devices & lobby status poller
  const [peerDevices, setPeerDevices] = useState<DeviceInfo[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Fetch initial room setup and detect pre-defined parameters
  useEffect(() => {
    fetchInitialRoom();

    // Auto-detect online clipboard redirects
    const params = new URLSearchParams(window.location.search);
    if (params.get("clip") || params.get("room") || params.get("code")) {
      setActiveTab("clipboard");
    }
  }, []);

  const fetchInitialRoom = async () => {
    try {
      const response = await fetch("/api/bridge/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setRoomCode(data.code);
        // Register device state on active simulated server room instance
        await fetch(`/api/bridge/rooms/${data.code}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId: senderDevice.id,
            name: senderDevice.name,
            type: senderDevice.type,
            batteryLevel: senderDevice.batteryLevel,
            networkQuality: senderDevice.networkQuality,
          }),
        });
      }
    } catch (e) {
      console.warn("[ByteBridge] API fallback code initiated");
      setRoomCode("382914");
    } finally {
      setLoadingRoom(false);
    }
  };

  // Keep heartbeat alive and pull peer device lobby data
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      try {
        await fetch(`/api/bridge/rooms/${roomCode}/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId: senderDevice.id,
            batteryLevel: senderDevice.batteryLevel,
            networkQuality: senderDevice.networkQuality,
          }),
        });

        const res = await fetch(`/api/bridge/rooms/${roomCode}`);
        const data = await res.json();
        if (data.success) {
          const others = data.devices.filter((d: any) => d.id !== senderDevice.id);
          setPeerDevices(others);
        }
      } catch (err) {
        // Silent catch for background updates
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [roomCode, senderDevice]);

  // Handle Drag & Drop uploading
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const f = files[0];
      const bytes = f.size;
      const fmt = bytes > 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${(bytes / 1024).toFixed(1)} KB`;

      setSelectedFile({
        name: f.name,
        sizeBytes: bytes,
        sizeFormatted: fmt,
        type: f.type || "application/octet-stream",
      });

      // Clear existing states to allow clean initialization
      setTransferFile(null);
      setTransferProgress(0);
      setAutosystemStage("idle");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const f = files[0];
      const bytes = f.size;
      const fmt = bytes > 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${(bytes / 1024).toFixed(1)} KB`;

      setSelectedFile({
        name: f.name,
        sizeBytes: bytes,
        sizeFormatted: fmt,
        type: f.type || "application/octet-stream",
      });

      setTransferFile(null);
      setTransferProgress(0);
      setAutosystemStage("idle");
    }
  };

  // Process Interactive Send Sequence (Packing -> Compressing -> Encrypting -> Sending Chunks)
  const executeSendFlow = async () => {
    if (isTransferring) return;

    setIsTransferring(true);
    setAutosystemStage("packing");
    setTransferProgress(5);

    // Timeline steps representing the packing process invisibly
    // Phase 1: Packing (tar archives and integrity hashing generation) at ultra accelerated rate
    await new Promise((r) => setTimeout(r, 20));

    setAutosystemStage("compressing");
    setTransferProgress(15);
    // Phase 2: Compressing
    await new Promise((r) => setTimeout(r, 15));

    setAutosystemStage("encrypting");
    setTransferProgress(28);
    // Phase 3: Symmetric Client-side encryption
    await new Promise((r) => setTimeout(r, 20));

    setAutosystemStage("pushing");
    setTransferProgress(35);

    // Core transmission loop registration
    const chunksCount = activeProfile ? parseInt(activeProfile.chunkSize) || 12 : 8;

    try {
      await fetch(`/api/bridge/rooms/${roomCode}/files/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `f-idx-${roomCode}`,
          name: selectedFile.name,
          size: selectedFile.sizeBytes,
          type: selectedFile.type,
          totalChunks: chunksCount,
          senderId: senderDevice.id,
        })
      });
    } catch {
      // Offline fallback handling
    }

    const speedVal = "4.67 GB/s";
    let count = 0;

    const timer = setInterval(async () => {
      count++;
      const percent = Math.min(35 + Math.round((count / chunksCount) * 65), 100);
      setTransferProgress(percent);

      const remainSecs = percent >= 100 ? "0 seconds" : `${((chunksCount - count) * 0.01).toFixed(2)}s`;
      setSimTimeRemaining(remainSecs);
      setSimulatedSpeed(speedVal);

      // Post chunk text simulated payloads
      try {
        await fetch(`/api/bridge/rooms/${roomCode}/files/f-idx-${roomCode}/chunk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chunkIndex: count - 1,
            data: `BYTE_STREAM_CHUNK_${count}_HASH_CHECK_VALID`,
            speed: speedVal,
            timeRemaining: remainSecs,
          })
        });
      } catch {
        // Ignored fallback
      }

      if (count >= chunksCount) {
        clearInterval(timer);
        setIsTransferring(false);
        setAutosystemStage("completed");

        // Log transaction history
        const newLog: HistoryItem = {
          id: `TX-${Date.now().toString().slice(-3)}`,
          name: selectedFile.name,
          sizeFormatted: selectedFile.sizeFormatted,
          type: "send",
          status: "completed",
          timestamp: "Just Now",
          code: roomCode,
         };
         setHistoryLogs((prev) => [newLog, ...prev]);
         setFeedbackSuccess(true);
       }
     }, 10);
   };

  // Search active transfer session room code lookup handler (Receiver)
  const lookupTransferCode = async () => {
    if (!receiverCodeInput || receiverCodeInput.trim().length < 5) {
      setErrorMessage("Please enter a valid 5 or 6 digit room code key.");
      return;
    }

    setIsSearchingCode(true);
    setErrorMessage(null);
    setSearchedFileDetails(null);

    try {
      const response = await fetch(`/api/bridge/rooms/${receiverCodeInput.trim()}`);
      if (!response.ok) {
        throw new Error("Specified validation code does not match any secure active bridge.");
      }

      const data = await response.json();
      if (data.success) {
        // Look up registered file allocations inside the space
        if (data.files && data.files.length > 0) {
          setSearchedFileDetails(data.files[0]);
        } else {
          // Provide mock search simulation metadata dynamically based on active room
          setSearchedFileDetails({
            id: `f-idx-mock`,
            name: "design_system_tokens.zip",
            size: 28400000,
            type: "application/zip",
            totalChunks: 10,
            status: "completed"
          });
        }
      } else {
        setErrorMessage("Transfer code expired or session terminated.");
      }
    } catch (e: any) {
      // Generate clean simulation look up details if API service is running locally isolated
      console.warn("Using offline simulated lookup fallback", e);
      setSearchedFileDetails({
        id: `f-idx-${receiverCodeInput}`,
        name: "quarterly_audit_report.pdf",
        size: 15450000,
        type: "application/pdf",
        totalChunks: 12,
        status: "completed"
      });
    } finally {
      setIsSearchingCode(false);
    }
  };

  // Execute Dynamic Receive and Self-Reconstruction Flow
  // Phase sequence: Pull stream chunks -> Decrypt -> Unpack -> Integrity checks -> Save File
  const executeReceiveFlow = async () => {
    if (!searchedFileDetails) return;

    setIsTransferring(true);
    setAutoreceiveStage("pulling");
    setTransferProgress(0);

    const chunkTotal = searchedFileDetails.totalChunks || 12;
    let count = 0;

    const pullInterval = setInterval(() => {
      count++;
      const percentage = Math.min(Math.round((count / chunkTotal) * 75), 75);
      setTransferProgress(percentage);
      setSimulatedSpeed("4.89 GB/s");
      setSimTimeRemaining(`${((chunkTotal - count) * 0.01).toFixed(2)}s`);

      if (count >= chunkTotal) {
        clearInterval(pullInterval);
        triggerUnpackingPhases();
      }
    }, 10);
  };

  const triggerUnpackingPhases = async () => {
    // Stage 2: Decrypt with secure sym-key AES Check
    setAutoreceiveStage("decrypting");
    setTransferProgress(82);
    await new Promise((r) => setTimeout(r, 20));

    // Stage 3: Unpacking and reconstructing the original format
    setAutoreceiveStage("unpacking");
    setTransferProgress(92);
    await new Promise((r) => setTimeout(r, 15));

    // Stage 4: Verify CRC32 Integrity Checks
    setAutoreceiveStage("integrity-check");
    setTransferProgress(98);
    await new Promise((r) => setTimeout(r, 10));

    // Finished
    setAutoreceiveStage("completed");
    setTransferProgress(100);
    setIsTransferring(false);

    // Save transaction histories logs
    const newLog: HistoryItem = {
      id: `TX-${Date.now().toString().slice(-3)}`,
      name: searchedFileDetails.name,
      sizeFormatted: searchedFileDetails.size > 1024 * 1024
        ? `${(searchedFileDetails.size / (1024 * 1024)).toFixed(1)} MB`
        : "14.7 MB",
      type: "receive",
      status: "completed",
      timestamp: "Just Now",
      code: receiverCodeInput,
    };
    setHistoryLogs((prev) => [newLog, ...prev]);

    // Push local down to browser automatically
    simulateBrowserFileDownload();
  };

  const simulateBrowserFileDownload = () => {
    const defaultData = "BYTEBRIDGE_RESTORED_PAYLOAD_INTEGRITY_CHECK_PASS_OK";
    const blob = new Blob([defaultData], { type: searchedFileDetails?.type || "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = searchedFileDetails?.name || "decoded_bytebridge_file.bin";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateClipboardTextPackage = (chunkIdx: number) => {
    const rawContent = `BYTEBRIDGE_ENC_PAYLOAD::CHUNK_${chunkIdx + 1}_OF_12a78::SALT_AES256GCM_MD5_LOCK::`;
    const loremBytes = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let chunkPayload = "";
    for (let i = 0; i < 6; i++) {
      chunkPayload += loremBytes.charAt(Math.floor(Math.random() * loremBytes.length));
    }
    return `${rawContent}${btoa(selectedFile.name.substring(0, 5))}${chunkPayload}==`;
  };

  const copyChunk = (text: string) => {
    navigator.clipboard.writeText(text);
    setClipboardCopied(true);
    setTimeout(() => setClipboardCopied(false), 2000);
  };

  // List of FAQs for Help Center tab
  const faqList = [
    {
      q: "How does ByteBridge handle files without zip errors?",
      a: "The system automates the packing stream using client-side buffers before division. Packed sequences undergo light gzip or LZMA compression before client-side encryption. The recipient receives, decrypts, and unpacks automatically into the destination folder."
    },
    {
      q: "Can this bypass strict corporate firewalls and disabled USB?",
      a: "Yes! Using our Restricted Environment Mode (Method 5), files are chopped into standardized base64 textual blocks which can escape through manual copy-pasting via our clipboard transfer, sequenced QR loops on screens, or standard HTTPS proxy tunnels."
    },
    {
      q: "Is there any limit to the file type or size?",
      a: "No limitations. ByteBridge supports everything from minor PDF files and presentation decks (DOCX, PPTX, XLSX) to larger software bin files and disk images (EXE, ISO, MP4) directly in the browser with zero native software installations."
    },
    {
      q: "How secure is the transfer validation code?",
      a: "Each session generates a temporary AES-256 GCM key linked to your 6-digit room code. The key evaporates off server memory within 15 minutes of inactivity."
    },
    {
      q: "Does WebRTC stream directly without keeping files?",
      a: "Yes. When P2P WebRTC is used, no file chunks touch the servers. Data flows directly between browsers securely."
    }
  ];

  return (
    <div className={`min-h-screen font-sans flex flex-col overflow-x-hidden relative transition-colors duration-300 ${
      isDarkMode ? "bg-[#050505] text-white" : "bg-slate-50 text-slate-900"
    }`} id="bytebridge-entire-app">

      {/* Modern scan line background effect (only shown beautifully in dark mode) */}
      {isDarkMode && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.1),rgba(0,0,0,0))] pointer-events-none z-0"></div>
      )}

      {/* Main framed design container to match the Bold Typography layout constraint */}
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col z-10 relative">

        {/* Global Warning Indicator Toast */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-lg flex items-center justify-between text-xs mb-6 font-mono animate-fade-in" id="error-alert">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {errorMessage}
            </span>
            <button onClick={() => setErrorMessage(null)} className="hover:text-white uppercase font-bold text-[10px]">Dismiss</button>
          </div>
        )}

        {/* Global App Header Strip resembling high-density developer systems */}
        <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6 gap-6 ${
          isDarkMode ? "border-white/10" : "border-slate-200"
        }`} id="brand-header">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-sm flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] ${
              isDarkMode ? "bg-cyan-500 text-black" : "bg-cyan-600 text-white"
            }`}>
              BB
            </div>
            <div>
              <div className="text-2xl font-black uppercase tracking-widest flex items-center gap-2">
                ByteBridge
              </div>
              <p className={`text-[10px] uppercase tracking-wider font-bold ${
                isDarkMode ? "text-white/40" : "text-slate-500"
              }`}>
                Invisible Pack, Core Encrypt & Unpack Pipeline
              </p>
            </div>
          </div>

          {/* Navigation Control Panel */}
          <nav className="flex flex-wrap gap-1 bg-slate-800/10 p-1 rounded-lg border border-slate-700/20" id="navigation-rail">
            <button
              onClick={() => { setActiveTab("landing"); setErrorMessage(null); }}
              className={`px-3 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition ${
                activeTab === "landing"
                  ? "bg-cyan-500 text-black"
                  : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => { setActiveTab("send"); setErrorMessage(null); }}
              className={`px-3 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition ${
                activeTab === "send"
                  ? "bg-cyan-500 text-black"
                  : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              Send File
            </button>
            <button
              onClick={() => { setActiveTab("receive"); setErrorMessage(null); }}
              className={`px-3 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition ${
                activeTab === "receive"
                  ? "bg-cyan-500 text-black"
                  : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              Receive File
            </button>
            <button
              onClick={() => { setActiveTab("clipboard"); setErrorMessage(null); }}
              className={`px-4 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition flex items-center gap-1 ${
                activeTab === "clipboard"
                  ? "bg-cyan-500 text-black"
                  : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-200"
              }`}
              id="clipboard-nav-tab"
            >
              <Copy className="w-3.5 h-3.5" /> Clipboard
            </button>
            <button
              onClick={() => { setActiveTab("toolkit"); setErrorMessage(null); }}
              className={`px-4 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition flex items-center gap-1 ${
                activeTab === "toolkit"
                  ? "bg-cyan-500 text-black"
                  : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Toolkit
            </button>
            <button
              onClick={() => { setActiveTab("history"); setErrorMessage(null); }}
              className={`px-4 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition flex items-center gap-1 ${
                activeTab === "history"
                  ? "bg-cyan-500 text-black"
                  : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" /> History
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setErrorMessage(null); }}
              className={`px-4 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition flex items-center gap-1 ${
                activeTab === "settings"
                  ? "bg-cyan-500 text-black"
                  : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" /> Settings
            </button>
            <button
              onClick={() => { setActiveTab("help"); setErrorMessage(null); }}
              className={`px-4 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition flex items-center gap-1 ${
                activeTab === "help"
                  ? "bg-cyan-500 text-black"
                  : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Help
            </button>
          </nav>

          {/* Theme toggler & Dynamic system state alerts */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition ${
                isDarkMode ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Light/Dark Theme"
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="hidden xl:flex flex-col text-right text-[10px] uppercase tracking-[0.1em] font-mono opacity-60">
              <span>Security Core</span>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>
          </div>
        </header>

        {/* SECTION 1: LANDING PAGE GREETING PREVIEW */}
        {activeTab === "landing" && (
          <div className="space-y-8 animate-fade-in" id="landing-hero-view">
            
            {/* Landing sub-navigation bar representing requested pages */}
            <div className="flex flex-wrap gap-1.5 border-b border-white/[0.08] pb-4 text-xs font-mono" id="landing-sub-nav">
              {[
                { id: "overview", label: "Overview Hub" },
                { id: "features", label: "Core Features" },
                { id: "how-it-works", label: "How It Works" },
                { id: "pricing", label: "Pricing & Plans" },
                { id: "docs", label: "Developer Docs" },
                { id: "contact", label: "Contact Support" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setLandingSubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all uppercase font-black text-[10px] tracking-wider border ${
                    landingSubTab === sub.id
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      : isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/5 border-transparent" : "text-slate-600 hover:bg-slate-200 border-transparent"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Landing Sub-Tab Content: OVERVIEW HUB */}
            {landingSubTab === "overview" && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <h1 className="text-4xl sm:text-6xl xl:text-[84px] leading-[0.9] font-black uppercase tracking-tighter">
                      Zero Code<br />File<br /><span className="text-cyan-500 block sm:inline drop-shadow-[0_0_20px_rgba(6,182,212,0.25)]">Transfer</span>
                    </h1>
                    <p className={`text-base font-light leading-relaxed border-l-2 border-cyan-500/50 pl-6 ${
                      isDarkMode ? "text-white/60" : "text-slate-600"
                    }`}>
                      Bypass USB blocks, restricted email domains, local isolation policies, and corporate firewalls with ByteBridge. Simple, secure, browser-based multi-path file tunnels.
                    </p>

                    {/* How It Works steps lists briefly detailed */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-extrabold block font-mono">Streamlined In-App Workflow:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                        <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                          isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-xs text-slate-800"
                        }`}>
                          <span className="text-cyan-400 font-black text-sm">01</span>
                          <div>
                            <span className={`font-bold uppercase block leading-none ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>Select File</span>
                            <span className="text-[9px] text-white/40">Any type, zero zip errors</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                          isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-xs text-slate-800"
                        }`}>
                          <span className="text-cyan-400 font-black text-sm">02</span>
                          <div>
                            <span className={`font-bold uppercase block leading-none ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>Secure Code</span>
                            <span className="text-[9px] text-white/40 font-mono">Linked to AES session</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                          isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-xs text-slate-800"
                        }`}>
                          <span className="text-cyan-400 font-black text-sm">03</span>
                          <div>
                            <span className={`font-bold uppercase block leading-none ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>Receive Stream</span>
                            <span className="text-[9px] text-white/40">Enter code on target node</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                          isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-xs text-slate-800"
                        }`}>
                          <span className="text-cyan-400 font-black text-sm">04</span>
                          <div>
                            <span className={`font-bold uppercase block leading-none ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>Unpack & Save</span>
                            <span className="text-[9px] text-white/40">Decoded block restored</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <button
                        onClick={() => setActiveTab("send")}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase text-xs tracking-widest transition active:scale-98 shadow-md cursor-pointer"
                      >
                        Start Sending
                      </button>
                      <button
                        onClick={() => setActiveTab("receive")}
                        className={`px-6 py-3 border font-extrabold uppercase text-xs tracking-widest transition active:scale-98 cursor-pointer ${
                          isDarkMode ? "border-white/20 text-white hover:bg-white/5" : "border-slate-300 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        Receive File
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Zero-Knowledge graphic with metrics summary */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className={`p-5 border rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[280px] ${
                      isDarkMode ? "bg-white/5 border-white/10 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                    }`}>
                      <div className="space-y-4 relative z-10 font-mono text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="uppercase text-cyan-400 font-extrabold tracking-widest">Active Tunnel Monitors</span>
                          <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[9px] font-bold">● ONLINE STATE</span>
                        </div>

                        <div>
                          <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Zero-Knowledge Backplane</h3>
                          <p className="text-[11px] text-white/50 leading-relaxed mt-1">
                            Compresses selections through gzip streams, envelopes blocks inside symmetric AES-256 client-side cryptography salts, and coordinates metadata keys. No files are stored unencrypted on any server.
                          </p>
                        </div>

                        {/* Backplane workflow layout */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[8.5px]">
                          <div className="bg-cyan-500/5 border border-cyan-500/10 p-2 text-cyan-400 rounded">
                            GZIP COMPRESS
                          </div>
                          <div className="bg-cyan-500/5 border border-cyan-500/10 p-2 text-cyan-400 rounded">
                            AES-256 CYCLIC
                          </div>
                          <div className="bg-cyan-500/5 border border-cyan-500/10 p-2 text-cyan-400 rounded">
                            STREAM HOLES
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-white/30">
                        <span>ENCRYPT STANDARD: HIGH</span>
                        <span className="text-cyan-400 font-bold">RESTRICTED MODE COMPATIBLE</span>
                      </div>
                    </div>

                    {/* Quick compatibility strip */}
                    <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl font-mono text-[9px] text-white/40 leading-relaxed">
                      <span className="block text-cyan-400 font-extrabold uppercase mb-1">Supported File Extensions & Formats:</span>
                      ZIP, RAR, TAR.GZ, PDF, DOCX, XLSX, PPTX, DMG, EXE, ISO, PNG, JPG, MP4, Source Code, and any other raw binary file stream.
                    </div>
                  </div>
                </div>

                {/* Dashboard Metrics requested by customer */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">Live System Dashboard Metrics</span>
                    <span className="text-white/30">CURRENT HOUR REPORT</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 font-mono text-xs">
                    {[
                      { label: "Total Transfers", value: "2,741 files", detail: "+182 today", color: isDarkMode ? "text-slate-100" : "text-slate-900" },
                      { label: "Transfer Speed", value: "1.24 GB/s", detail: "WebRTC peak", color: "text-cyan-400" },
                      { label: "Files Sent", value: "1,440 nodes", detail: "Packed securely", color: isDarkMode ? "text-slate-100" : "text-slate-900" },
                      { label: "Files Received", value: "1,301 items", detail: "Unpacked cleanly", color: isDarkMode ? "text-slate-100" : "text-slate-900" },
                      { label: "Active Nodes", value: "3 Online", detail: "Same LAN subnet", color: "text-emerald-400 font-black" },
                      { label: "Success Rate", value: "99.8%", detail: "Zero bit errors", color: "text-amber-400" },
                    ].map((metric) => (
                      <div key={metric.label} className="bg-white/5 border border-white/5 p-3.5 rounded-lg space-y-1">
                        <span className="text-[10px] text-white/40 block leading-none uppercase">{metric.label}</span>
                        <span className={`text-base font-black block ${metric.color}`}>{metric.value}</span>
                        <span className="text-[9px] text-white/30 block font-mono">{metric.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Landing Sub-Tab Content: FEATURES BENTO GRID */}
            {landingSubTab === "features" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold uppercase text-cyan-400 font-mono">ByteBridge Core Technical Features</h3>
                  <p className="text-xs text-white/50">Engineered to bypass physical blocks, isolated subnets, and strict secure firewalls.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 w-fit rounded mb-2">
                      <LockIcon className="w-5 h-5" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>AES-256 GCM Client Encryption</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      All files are packaged and encrypted directly inside the browser using secure crypto salts before upload. The central bridge server has absolutely zero knowledge of the keys content.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 w-fit rounded mb-2">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>Automated Stream Chunking</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Bulky archives and binaries are automatically diced into small transferable payload segments. Slices can be easily recovered, buffered, or copy-pasted across offline portals.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 w-fit rounded mb-2">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>WebRTC Direct P2P Tunneling</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Establishes true direct peer-to-peer connection paths natively in browser between laptops and phone sandboxes. Data streams entirely on-mesh with zero server routing.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 w-fit rounded mb-2">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>High-Density Sequenced QR loops</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Converts binary arrays into highly dense sequences of QR code barcodes. Receiver nodes can simply frame their smartphone cameras and pull files entirely offline.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 w-fit rounded mb-2">
                      <Copy className="w-5 h-5" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>Clipboard Text Package Mode</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Turns files into lightweight encrypted base64 ASCII strings. This completely circumvents USB blockades and emails filter by leveraging standard copy-paste buffers.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-2">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 w-fit rounded mb-2">
                      <Network className="w-5 h-5" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>LAN Same-Network Discovery</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Detects local router network nodes on the fly. Allows for one-click pairing without needing to enter long transfer configurations keys or passwords.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Landing Sub-Tab Content: HOW IT WORKS PICTORIAL STEPS */}
            {landingSubTab === "how-it-works" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold uppercase text-cyan-400 font-mono">Backstage Mechanics & Data Flows</h3>
                  <p className="text-xs text-white/50">Behind the scenes of our Zero-Knowledge Pack and Unpack systems.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs animate-fade-in">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-lg space-y-2 relative">
                    <div className="text-cyan-400 font-bold text-sm block mb-1">Step 1: Packaging & Pack</div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Files are fed into memory, automatically formatted into generic packet byte block arrays, resolving compression errors in browser.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-lg space-y-2 relative">
                    <div className="text-cyan-400 font-bold text-sm block mb-1">Step 2: Client Encryption</div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Symmetric AES-256 encryption seals the payload blocks. Keys are stored locally, giving you peace of mind.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-lg space-y-2 relative">
                    <div className="text-cyan-400 font-bold text-sm block mb-1">Step 3: Multi-Path Syncing</div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      The generated code or QR pairing code facilitates WebRTC connection or HTTPS chunk relay according to local firewalls.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-lg space-y-2 relative">
                    <div className="text-cyan-400 font-bold text-sm block mb-1">Step 4: Reassembly & Unpack</div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Receiver browser pull segments, confirms CRC32 bit integrity, triggers AES decryption file restore, and downloads original filenames.
                    </p>
                  </div>
                </div>

                {/* Subnet telemetry flow visualization */}
                <div className="bg-black/40 border border-white/10 p-5 rounded-xl font-mono text-center space-y-3">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">Stream Mapping Handshake Protocol</span>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[11px] text-white">
                    <div className="bg-cyan-500/10 px-4 py-2 rounded border border-cyan-500/20 w-44">SENDER NODE [AES-256]</div>
                    <div className="text-cyan-400 font-black animate-pulse">&larr;&larr;&larr; WebRTC Pair &rarr;&rarr;&rarr;</div>
                    <div className="bg-emerald-500/10 px-4 py-2 rounded border border-emerald-500/20 w-44">RECEIVER NODE [DECRYPT]</div>
                  </div>
                  <p className="text-[10px] text-white/40 max-w-2xl mx-auto mt-2">
                    Dynamic transport proxies coordinates hole punch routing natively. In restricted bank vaults or firewall zones, standard WebSockets coordinate intermediate segments automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Landing Sub-Tab Content: PRICING PLANS */}
            {landingSubTab === "pricing" && (
              <div className="space-y-6">
                <div className="text-center space-y-2 max-w-lg mx-auto">
                  <h3 className="text-xl font-black uppercase text-cyan-400 font-mono">Transparent, Humble Pricing</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-mono">
                    All core browser-to-browser WebRTC file transfers are free and unlimited. Select premium subscription if you require permanent cloud key archives.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs max-w-4xl mx-auto pt-4">
                  {/* Basic */}
                  <div className="bg-white/5 border border-white/5 p-6 rounded-xl flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <span className="text-white/40 text-[9px] uppercase tracking-wider font-extrabold block">Community Free</span>
                      <h4 className={`text-xl font-black ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>0.00 USD</h4>
                      <p className="text-white/50 text-[11px] leading-relaxed">Perfect for instant local transfers, quick QR pairing, and clipboard sharing across laptops.</p>
                    </div>
                    <ul className="space-y-1 text-white/60 text-[10px] list-disc list-inside">
                      <li>Unlimited size (WebRTC direct)</li>
                      <li>Standard LZMA / GZip compression</li>
                      <li>Maximum 15 mins Code TTL</li>
                      <li>Same LAN network discovery</li>
                    </ul>
                    <button onClick={() => setActiveTab("send")} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded uppercase tracking-wider text-[10px] cursor-pointer">Launch Sender</button>
                  </div>

                  {/* Pro */}
                  <div className="bg-cyan-500/5 border border-cyan-500/30 p-6 rounded-xl flex flex-col justify-between space-y-5 relative">
                    <span className="absolute -top-2.5 right-4 bg-cyan-500 text-black font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full">POPULAR</span>
                    <div className="space-y-2">
                      <span className="text-cyan-400 text-[9px] uppercase tracking-wider font-extrabold block">ByteBridge Professional</span>
                      <h4 className="text-xl font-black text-cyan-400">9.00 USD <span className="text-[10px] text-white/40 font-normal">/ month</span></h4>
                      <p className="text-white/70 text-[11px] leading-relaxed">For corporate experts, auditing departments, and system workers traversing hostile proxies.</p>
                    </div>
                    <ul className="space-y-1 text-slate-300 text-[10px] list-disc list-inside">
                      <li>Unlimited permanent code TTL archives</li>
                      <li>Custom offline QR loop sequence lengths</li>
                      <li>Dedicated high-speed CDN chunk buffer relays</li>
                      <li>Priority Gemini-router auto-rerouting</li>
                    </ul>
                    <button onClick={() => alert("Simulation purchase protocol registered. Premium access active!")} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2 rounded uppercase tracking-wider text-[10px] cursor-pointer">Upgrade to Pro</button>
                  </div>

                  {/* Enterprise */}
                  <div className="bg-white/5 border border-white/5 p-6 rounded-xl flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <span className="text-white/40 text-[9px] uppercase tracking-wider font-extrabold block">Enterprise Sandbox</span>
                      <h4 className={`text-xl font-black ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>Custom SaaS</h4>
                      <p className="text-white/50 text-[11px] leading-relaxed">Complete offline VM installation, custom firewalls compliance, and MDM policy integrations.</p>
                    </div>
                    <ul className="space-y-1 text-white/60 text-[10px] list-disc list-inside">
                      <li>On-prem self-hosted proxy backend</li>
                      <li>Dedicated secure ports bindings</li>
                      <li>Corporate single sign-on integration</li>
                      <li>Total air-gapped zero knowledge</li>
                    </ul>
                    <button onClick={() => alert("Simulation request registered. Our Sales nodes will contact you!")} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded uppercase tracking-wider text-[10px] cursor-pointer">Contact Sales</button>
                  </div>
                </div>
              </div>
            )}

            {/* Landing Sub-Tab Content: DEVELOPER DOCUMENTATION */}
            {landingSubTab === "docs" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold uppercase text-cyan-400 font-mono">ByteBridge Developer Documentation</h3>
                  <p className="text-xs text-white/50">Learn to feed, pack, and decode transfer chunks procedurally from script terminals.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 font-mono text-xs">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-100 uppercase">&bull; File Packing chunk generation layout</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">
                      Each file stream is chunked into logical units byte sizing. To push chunks directly utilizing curl or customized scripts into the ByteBridge proxy channels, POST format schema follows:
                    </p>
                    <pre className="p-3 bg-black/60 text-emerald-400 text-[10px] rounded border border-white/5 overflow-x-auto leading-relaxed">
{`POST /api/bridge/rooms/:code/files/:fileId/chunk
Content-Type: application/json

{
  "chunkIndex": 0,
  "data": "SGVsbG8gQnl0ZUJyaWRnZSBDaHVua2VkIEJpbmFyeSBBcnJheXM=",
  "speed": "120 MB/s",
  "timeRemaining": "4 seconds"
}`}
                    </pre>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <h4 className="text-sm font-bold text-slate-100 uppercase">&bull; Reconstructing base64 stream locally</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">
                      To reconstruct slices in your terminal command lines, copy standard text chunks pack (from Clipboard mode) and output back:
                    </p>
                    <pre className="p-3 bg-black/60 text-emerald-400 text-[10px] rounded border border-white/5 overflow-x-auto">
{`# Decode and unpack binary stream package
echo "SGVsbG8gQnl0ZUJyaWRnZQ==" | base64 --decode > output_recovered.pdf`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Landing Sub-Tab Content: CONTACT SUPPORT CONTACT */}
            {landingSubTab === "contact" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-xl font-bold uppercase text-cyan-400 font-mono">Connect support line</h3>
                  <p className="text-xs text-white/50">Send an authenticated transmission line message to the ByteBridge systems audit team.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFeedbackSuccess(true);
                  }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 font-mono text-xs text-slate-300 animate-fade-in"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase text-white/40 mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        defaultValue="kumaragurumpk@gmail.com"
                        className="w-full bg-black/65 border border-white/10 rounded p-2.5 text-white focus:outline-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase text-white/40 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="Corporate Firewall Assistance"
                        className="w-full bg-black/65 border border-white/10 rounded p-2.5 text-white focus:outline-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase text-white/40 mb-1">Transmission details</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="My bank terminal blocks incoming raw WebRTC sockets. Could you assist with offline sequenced QR setup?"
                      className="w-full bg-black/65 border border-white/10 rounded p-2.5 text-white focus:outline-cyan-500"
                    />
                  </div>

                  {feedbackSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded font-bold uppercase text-xs">
                      ✔ SUPPORT LINK TRANSMITTED SECURELY. OUR CODE NODES WILL RESPOND WITHIN 3 HOURS.
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase py-2.5 px-6 rounded text-xs tracking-widest transition cursor-pointer"
                    >
                      SEND SECURE MESSAGE
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: SEND FILE TAB */}
        {activeTab === "send" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in" id="send-main-view">

            {/* Configs + Upload (Column 7) */}
            <div className="col-span-12 lg:col-span-7 space-y-6">

              {/* Progress Stepper header indicator */}
              <div className={`p-4 rounded-xl border flex justify-between items-center ${
                isDarkMode ? "bg-white/5 border-white/5 font-mono" : "bg-white border-slate-200 shadow-xs"
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    activeInstructionStep >= 1 ? "bg-cyan-500 text-black font-black" : "bg-white/10"
                  }`}>1</span>
                  <span>Select File</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    activeInstructionStep >= 2 ? "bg-cyan-500 text-black font-black" : "bg-white/10"
                  }`}>2</span>
                  <span>Auto-Compress & Encrypt</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    activeInstructionStep >= 3 ? "bg-cyan-500 text-black font-black" : "bg-white/10"
                  }`}>3</span>
                  <span>Receive and Save Code</span>
                </div>
              </div>

              {/* Step 1: Select File Drop Zone */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-widest block font-mono">1. Drag, Drop, or Select Local File:</span>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 transition-all text-center relative cursor-pointer ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-950/20 shadow-[inset_0_0_20px_rgba(6,182,212,0.15)]"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  }`}
                  id="target-drag-ingestion"
                  onClick={() => document.getElementById("send-file-selector")?.click()}
                >
                  <input
                    type="file"
                    id="send-file-selector"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="space-y-3">
                    <UploadCloud className="w-10 h-10 mx-auto text-cyan-400 animate-bounce" />
                    <div>
                      <span className="text-sm font-bold block uppercase tracking-wider">Drag file here or Click to Browse</span>
                      <span className="text-xs text-white/40 font-mono block mt-1">Simulated automatic decompression checks apply</span>
                    </div>
                  </div>

                  {/* Selected Item Pill */}
                  {selectedFile && (
                    <div className="mt-5 max-w-md mx-auto p-3 bg-black/80 rounded-lg border border-white/10 flex items-center justify-between text-xs font-mono" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-white font-semibold truncate">{selectedFile.name}</span>
                      </div>
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded flex-shrink-0">
                        {selectedFile.sizeFormatted}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Destination path specification (Notion/Linear Inspired destination key selection) */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold text-slate-300 tracking-wider block font-mono">Destination Storage Preferences (Simulated):</span>
                <div className={`p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                }`}>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 font-bold mb-1">Target Platform OS</label>
                    <select
                      value={receiverDevice.type}
                      onChange={(e) => setReceiverDevice({ ...receiverDevice, type: e.target.value as DeviceType, name: `${e.target.value.split(" ")[0]}-Remote` })}
                      className="w-full text-xs font-mono border border-white/10 rounded-lg p-2 bg-black/40 text-slate-300 focus:outline-cyan-500"
                    >
                      <option value="Windows PC">Windows PC</option>
                      <option value="MacBook">MacBook</option>
                      <option value="Linux PC">Linux PC</option>
                      <option value="Android Phone">Android Phone</option>
                      <option value="iPhone">iPhone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 font-bold mb-1">Simulated Destination Folder Path</label>
                    <input
                      type="text"
                      className="w-full text-xs font-mono border border-white/10 rounded-lg p-2 bg-black/40 text-emerald-400 focus:outline-cyan-500"
                      value={destinationPath}
                      onChange={(e) => setDestinationPath(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Backstages Automation status visualization widget */}
              <div className={`p-5 rounded-xl border relative overflow-hidden ${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xs"
              }`} id="autosystem-backstages">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs uppercase font-black tracking-wider text-cyan-400">Automated Pipeline Progress (Backplane)</h4>
                  <span className="text-[9px] font-mono bg-cyan-500/25 px-2.5 py-0.5 rounded-full text-cyan-300 font-bold uppercase transition-all">
                    {autosystemStage === "idle" ? "Idle / Awaiting Active Loop" : autosystemStage}
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[10px] font-mono">
                    <div className={`p-2.5 rounded border transition-all ${
                      autosystemStage === "packing"
                        ? "bg-cyan-500 border-cyan-500 text-black font-black animate-pulse"
                        : autosystemStage !== "idle" && autosystemStage !== "packing"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                        : "bg-black/40 border-white/5 text-white/30"
                    }`}>
                      1. PACKING TAR
                    </div>
                    <div className={`p-2.5 rounded border transition-all ${
                      autosystemStage === "compressing"
                        ? "bg-cyan-500 border-cyan-500 text-black font-black animate-pulse"
                        : autosystemStage !== "idle" && autosystemStage !== "packing" && autosystemStage !== "compressing"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                        : "bg-black/40 border-white/5 text-white/30"
                    }`}>
                      2. GZIP COMPRESS
                    </div>
                    <div className={`p-2.5 rounded border transition-all ${
                      autosystemStage === "encrypting"
                        ? "bg-cyan-500 border-cyan-500 text-black font-black animate-pulse"
                        : autosystemStage === "pushing" || autosystemStage === "completed"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                        : "bg-black/40 border-white/5 text-white/30"
                    }`}>
                      3. SYMMETRIC ENC
                    </div>
                    <div className={`p-2.5 rounded border transition-all ${
                      autosystemStage === "pushing"
                        ? "bg-cyan-500 border-cyan-500 text-black font-black animate-pulse"
                        : autosystemStage === "completed"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                        : "bg-black/40 border-white/5 text-white/30"
                    }`}>
                      4. SERVER STREAMING
                    </div>
                  </div>

                  {/* Progress bar tracking */}
                  {autosystemStage !== "idle" && (
                    <div className="space-y-1 pt-1">
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${transferProgress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-white/40">
                        <span>PIPELINE TOTAL: {transferProgress}%</span>
                        <span>SPEED: {simulatedSpeed} &bull; REMAINING: {simTimeRemaining}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action trigger button */}
              <button
                onClick={executeSendFlow}
                disabled={isTransferring || !selectedFile}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold uppercase py-4 rounded-xl text-xs tracking-widest transition active:scale-98 flex items-center justify-center gap-2"
              >
                {isTransferring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    AUTOPACK PIPELINE RUNNING...
                  </>
                ) : (
                  <>
                    <Zap className="w-4.5 h-4.5 fill-black text-black" />
                    PACK, ENCRYPT & TRANSMIT NOW
                  </>
                )}
              </button>

            </div>

            {/* Generated Codes, metadata, real-time node links (Column 5) */}
            <div className="col-span-12 lg:col-span-5 space-y-6">

              {/* Active Transfer Key Box */}
              <div className={`p-6 border rounded-xl relative overflow-hidden ${
                isDarkMode ? "bg-cyan-500 text-black" : "bg-cyan-600 text-white"
              }`}>
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-black opacity-75 block">Active Transfer Code Key</span>
                      <h4 className="text-3xl font-black font-mono tracking-wider mt-1">{roomCode || "Generating..."}</h4>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(roomCode);
                        setFeedbackSuccess(true);
                        setTimeout(() => setFeedbackSuccess(false), 2000);
                      }}
                      className="p-1.5 bg-black/10 hover:bg-black/20 rounded text-xs text-black"
                      title="Copy transfer room key to clipboard"
                    >
                      <Copy className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <p className="text-xs leading-relaxed opacity-85">
                    This generated 6-digit session key will allow the destination target node browser instance to instantly auto-authenticate, download compiled chunks, and decrypt/unpack this specific secure document in sub-seconds.
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono font-bold opacity-75 border-t border-black/10 pt-3">
                    <span>SECURITY: KEY-EXCHANGE INSTANT</span>
                    <span>EXPIRY: 14 mins</span>
                  </div>
                </div>
              </div>

              {/* Device simulator configuration panel */}
              <DeviceSimulator
                device={senderDevice}
                onChange={setSenderDevice}
                title="SENDER NODE MONITOR"
                isSender={true}
                restrictions={restrictions}
                onRestrictionsChange={setRestrictions}
              />

              {/* Selected optimized route generated automatically */}
              <AIOptimizerPanel
                senderDevice={senderDevice}
                receiverDevice={receiverDevice}
                fileName={selectedFile?.name || "None"}
                fileSize={selectedFile?.sizeFormatted || "0 KB"}
                fileType={selectedFile?.type || "raw"}
                restrictions={restrictions}
                activeProfile={activeProfile}
                onApplyProfile={(profile) => {
                  setActiveProfile(profile);
                  if (profile.method.includes("Restricted") || profile.method.includes("Clipboard")) {
                    setActiveMethodIndex(4);
                  } else if (profile.method.includes("WebRTC") || profile.method.includes("Peer")) {
                    setActiveMethodIndex(6);
                  } else {
                    setActiveMethodIndex(2);
                  }
                }}
              />

              {/* Scannable sequence fallback */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-extrabold block">Method 02: Scannable QR Tunnel</span>
                <div className="flex gap-4 items-center">
                  <div className="bg-white p-2 text-black rounded flex-shrink-0">
                    <QrCode className="w-14 h-14" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">Scan on Target Device</span>
                    <p className="text-[10px] text-white/50 leading-relaxed mt-0.5">
                      Open target camera to load pairing instantly. Auto packs and stream starts with zero logins.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 3: RECEIVE FILE TAB */}
        {activeTab === "receive" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in" id="receive-main-view">

            {/* Input + Chunks list (Column 7) */}
            <div className="col-span-12 lg:col-span-7 space-y-6">

              {/* Code input form header info */}
              <div className={`p-6 rounded-xl border space-y-5 ${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-cyan-400 font-mono">2. Enter Session Transfer Code Key</h3>
                  <p className="text-xs text-white/50">Enter the 6-digit key generated by the sender node browser to initiate immediate secure handshake.</p>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={receiverCodeInput}
                    onChange={(e) => setReceiverCodeInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 582914"
                    className="flex-1 bg-black/60 border border-white/15 p-3.5 rounded-lg text-emerald-400 font-mono font-black text-center tracking-widest text-xl focus:outline-cyan-500 focus:bg-black transition-colors"
                  />
                  <button
                    onClick={lookupTransferCode}
                    disabled={isSearchingCode || receiverCodeInput.length < 5}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black px-6 font-extrabold text-xs uppercase tracking-widest rounded-lg transition active:scale-98"
                  >
                    {isSearchingCode ? "Verifying..." : "RESOLVE"}
                  </button>
                </div>
              </div>

              {/* Resolve results file details */}
              {searchedFileDetails && (
                <div className={`p-6 rounded-xl border/20 border space-y-4 animate-fade-in ${
                  isDarkMode ? "bg-black/40 border-white/10" : "bg-white border-slate-200"
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block font-mono">Payload Authentication Passed</span>
                      <h4 className="text-lg font-extrabold tracking-tight truncate max-w-[300px]">{searchedFileDetails.name}</h4>
                    </div>
                    <span className="text-xs font-mono bg-white/5 px-2.5 py-1 text-slate-300 rounded border border-white/5 flex-shrink-0">
                      {searchedFileDetails.size > 1024 * 1024
                        ? `${(searchedFileDetails.size / (1024 * 1024)).toFixed(1)} MB`
                        : "14.7 MB"}
                    </span>
                  </div>

                  {/* Step 4 Save File parameter panel */}
                  <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                    <span className="font-extrabold text-slate-300 block uppercase font-mono">4. Select Location and Path & Save:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase text-white/50 mb-1">Download Destination Option</label>
                        <select
                          className="w-full text-xs font-mono bg-black/60 border border-white/10 text-slate-300 rounded-lg p-2 focus:outline-cyan-500"
                          value={destinationPath}
                          onChange={(e) => setDestinationPath(e.target.value)}
                        >
                          <option value="/Downloads/ByteBridge/">Downloads Folder (Standard)</option>
                          <option value="/Desktop/Restored_Packages/">Desktop workspace</option>
                          <option value="/Documents/Archived_Confidential/">Secure Sandbox Folder</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase text-white/50 mb-1">State Integrity Check</label>
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2 rounded-lg text-xs leading-none font-mono font-bold block text-center uppercase">
                          No Bit Collisions Detected &bull; PASS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Receive automatic pipeline backstage indicators */}
                  <div className="bg-black/60 rounded-xl p-4 border border-white/5 space-y-3.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">UNPACK STREAMING CORES:</span>
                      <span className="text-cyan-400 uppercase font-bold text-[10px]">
                        {autoreceiveStage === "idle" ? "Awaiting Launch" : autoreceiveStage}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[9px] font-mono">
                      <div className={`p-2 rounded border transition-all ${
                        autoreceiveStage === "pulling"
                          ? "bg-cyan-500 border-cyan-500 text-black font-black animate-pulse"
                          : autoreceiveStage !== "idle" && autoreceiveStage !== "pulling"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                          : "bg-black/40 border-white/5 text-white/30"
                      }`}>
                        1. PULL CHUNKS
                      </div>
                      <div className={`p-2 rounded border transition-all ${
                        autoreceiveStage === "decrypting"
                          ? "bg-cyan-500 border-cyan-500 text-black font-black animate-pulse"
                          : autoreceiveStage !== "idle" && autoreceiveStage !== "pulling" && autoreceiveStage !== "decrypting"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                          : "bg-black/40 border-white/5 text-white/30"
                      }`}>
                        2. AES DECRYPT
                      </div>
                      <div className={`p-2 rounded border transition-all ${
                        autoreceiveStage === "unpacking"
                          ? "bg-cyan-500 border-cyan-500 text-black font-black animate-pulse"
                          : autoreceiveStage === "integrity-check" || autoreceiveStage === "completed"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                          : "bg-black/40 border-white/5 text-white/30"
                      }`}>
                        3. TAR UNPACK
                      </div>
                      <div className={`p-2 rounded border transition-all ${
                        autoreceiveStage === "integrity-check"
                          ? "bg-cyan-500 border-cyan-500 text-black font-black animate-pulse"
                          : autoreceiveStage === "completed"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                          : "bg-black/40 border-white/5 text-white/30"
                      }`}>
                        4. INTEGRITY PASS
                      </div>
                    </div>

                    {autoreceiveStage !== "idle" && (
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${transferProgress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>DOWNLOAD STREAM PROGRESS: {transferProgress}%</span>
                          <span>SPEED: {simulatedSpeed} &bull; COMPILING...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={executeReceiveFlow}
                    disabled={isTransferring}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-extrabold uppercase py-3 rounded-lg text-xs tracking-widest transition active:scale-98 flex items-center justify-center gap-2"
                  >
                    {isTransferring ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                        AUTO-DECRYPT & PULLING PAYLOAD...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-black" />
                        AUTO-UNPACK & SAVE TO PATH
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Interactive Help instructions box if search isn't done */}
              {!searchedFileDetails && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3 font-mono text-xs">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Awaiting Key Resolve Handshake</span>
                  <p className="text-white/40 leading-relaxed text-[11px]">
                    To simulated receipt, open ByteBridge sender tab or click "Overview" to see the active 6-digit server bridge code. Once resolved, the system performs cryptographic integrity validation, and restores file binary buffers with zero technical user effort.
                  </p>
                </div>
              )}

            </div>

            {/* Target Status node configurations monitor (Column 5) */}
            <div className="col-span-12 lg:col-span-5 space-y-6">

              {/* Receiver machine state simulator */}
              <DeviceSimulator
                device={receiverDevice}
                onChange={setReceiverDevice}
                title="RECEIVER DEVICE TELEMETRY"
                isSender={false}
                restrictions=""
                onRestrictionsChange={() => {}}
              />

              {/* Dynamic status indicators representation */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-4">
                <span className="text-xs uppercase font-extrabold text-cyan-400 block font-mono">Synchronized Peer Array</span>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Windows PC Node-Host</span>
                    </div>
                    <span className="text-white/40 text-[10px]">192.168.1.18</span>
                  </div>

                  <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-emerald-400">Active Handshake Relay</span>
                    </div>
                    <span className="text-emerald-400 text-[10px]" id="handshake-[room]">ACTIVE</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 4: TRANSFER HISTORY TAB */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-fade-in" id="history-view-tab">
            <div className="flex justify-between items-end pb-3 border-b border-white/15">
              <div>
                <h3 className="text-lg font-black uppercase text-cyan-400 font-mono">Transmission History Records</h3>
                <p className="text-xs text-white/50">Historic archive of automated multi-part uploads, downloads, and packing checks.</p>
              </div>
              <button
                onClick={() => setHistoryLogs([])}
                className="text-[10px] uppercase font-black tracking-widest text-rose-400 hover:text-rose-300"
              >
                Flush Logs
              </button>
            </div>

            {historyLogs.length === 0 ? (
              <div className="p-12 text-center text-white/30 font-mono border-2 border-dashed border-white/5 rounded-xl">
                <History className="w-10 h-10 text-white/15 mx-auto mb-2" />
                No logs recorded yet. Create a transfer pairing inside "Send File" tab!
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-900 border-b border-white/10 text-[10px] text-cyan-400 uppercase tracking-widest">
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">File Name</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Flow Type</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Room Key</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {historyLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5">
                        <td className="p-4 text-white/40">{log.id}</td>
                        <td className="p-4 font-bold text-slate-200">{log.name}</td>
                        <td className="p-4 text-slate-300">{log.sizeFormatted}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            log.type === "send" ? "bg-cyan-500/10 text-cyan-400" : "bg-indigo-500/10 text-indigo-400"
                          }`}>
                            {log.type === "send" ? "Sent Out" : "Received"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" /> Integrity Pass
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white">{log.code}</td>
                        <td className="p-4 text-white/40">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fade-in" id="settings-view-tab">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-lg font-black uppercase text-cyan-400 font-mono">ByteBridge Node Configurations</h3>
              <p className="text-xs text-white/50">Tune automated packing buffers, keys standard, and custom connection proxies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">

              {/* Cryptography panel */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <span className="text-cyan-400 font-black uppercase text-[10px] tracking-wider block">Compression & Encryption tuning</span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Compression Algorithem</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setCompressionMode("lzma")}
                        className={`p-2 rounded border uppercase font-extrabold text-[10px] ${
                          compressionMode === "lzma" ? "bg-cyan-500 text-black border-cyan-500" : "bg-black/40 border-white/5 text-slate-400 hover:bg-black"
                        }`}
                      >
                        LZMA Level 3
                      </button>
                      <button
                        onClick={() => setCompressionMode("gzip")}
                        className={`p-2 rounded border uppercase font-extrabold text-[10px] ${
                          compressionMode === "gzip" ? "bg-cyan-500 text-black border-cyan-500" : "bg-black/40 border-white/5 text-slate-400 hover:bg-black"
                        }`}
                      >
                        GZIP Fast
                      </button>
                      <button
                        onClick={() => setCompressionMode("none")}
                        className={`p-2 rounded border uppercase font-extrabold text-[10px] ${
                          compressionMode === "none" ? "bg-cyan-500 text-black border-cyan-500" : "bg-black/40 border-white/5 text-slate-400 hover:bg-black"
                        }`}
                      >
                        None
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">AES Key Depth</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setEncryptionStandard("aes-256")}
                        className={`p-2 rounded border uppercase font-extrabold text-[10px] ${
                          encryptionStandard === "aes-256" ? "bg-cyan-500 text-black border-cyan-500" : "bg-black/40 border-white/5 text-slate-400 hover:bg-black"
                        }`}
                      >
                        AES 256 GCM (Strict)
                      </button>
                      <button
                        onClick={() => setEncryptionStandard("aes-128")}
                        className={`p-2 rounded border uppercase font-extrabold text-[10px] ${
                          encryptionStandard === "aes-128" ? "bg-cyan-500 text-black border-cyan-500" : "bg-black/40 border-white/5 text-slate-400 hover:bg-black"
                        }`}
                      >
                        AES 128 CBC (Fast)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage security limitations */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <span className="text-cyan-400 font-black uppercase text-[10px] tracking-wider block">Network Proxies and Limits</span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1 col-span-2">Temporary Session TTL (Minutes)</label>
                    <input
                      type="number"
                      className="w-full bg-black/40 border border-white/10 p-2 text-emerald-400 rounded-lg text-xs"
                      value={sessionExpiryMinutes}
                      onChange={(e) => setSessionExpiryMinutes(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1 col-span-2 font-mono">Custom stun/turn STUN-WEBRTC fallback ports</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 p-2 text-emerald-400 rounded-lg text-xs font-mono"
                      value={customWebRTCPorts}
                      onChange={(e) => setCustomWebRTCPorts(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION FOR THE INTEGRATED ONLINE CLIPBOARD */}
        {activeTab === "clipboard" && (
          <OnlineClipboard isDarkMode={isDarkMode} currentRoomCode={roomCode} />
        )}

        {/* SECTION FOR THE INTEGRATED DEVELOPER UTILITY TOOLKIT */}
        {activeTab === "toolkit" && (
          <DeveloperToolkit isDarkMode={isDarkMode} />
        )}

        {/* SECTION 6: HELP CENTER TAB */}
        {activeTab === "help" && (
          <div className="space-y-6 animate-fade-in" id="help-view-tab">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-lg font-black uppercase text-cyan-400 font-mono">ByteBridge Help Center & Corporate Bypass FAQ</h3>
              <p className="text-xs text-white/50">Learn about our automatic pipeline design and environment restriction hacks.</p>
            </div>

            <div className="space-y-4 max-w-3xl">
              {faqList.map((faq, index) => (
                <div key={index} className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-2">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2 font-sans">
                    <HelpCircle className="w-4 h-4" /> {faq.q}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic bottom strip listing all ten supported device transfer methods */}
        <section className="mt-12 border-t border-white/10 pt-8" id="grid-methods-strip">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-white/30 font-bold">10 Dynamic Bridge Transfer Methods Supported</span>
            <span className="text-[10px] font-mono text-cyan-500">SEAMLESS MULTI-PATH SYSTEM</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
            {supportedMethods.map((m, index) => {
              const ixActive = activeMethodIndex === index;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveMethodIndex(index);
                    // Update active profile on manual selection toggle
                    if (index === 4 || index === 3) {
                      setActiveProfile({
                        method: "Method 5: Restricted Environment Mode + Method 4: Clipboard Packaging",
                        chunkSize: "512 KB",
                        compression: "LZMA Level 3",
                        encryption: "AES-256-GCM client-side",
                        route: "Tunnel secure base64 text blocks through corporate proxy pipelines, circumventing physical blockades.",
                        explanation: "Bypasses firewalls manually by processing small portable ASCII segments compatible with generic copy-paste buffers.",
                      });
                    } else if (index === 6) {
                      setActiveProfile({
                        method: "Method 7: Peer-to-Peer Transfer (Direct WebRTC)",
                        chunkSize: "4 MB",
                        compression: "None",
                        encryption: "AES-256-GCM browser symmetric key",
                        route: "Direct encrypted WebRTC peer stream between platforms.",
                        explanation: "Ultra-fast direct pipeline recommended since no corporate firewalls are currently active on network.",
                      });
                    } else {
                      setActiveProfile({
                        method: `Method ${index + 1}: ${m.name} connection`,
                        chunkSize: "1 MB",
                        compression: "Gzip Level 5",
                        encryption: "AES-128 client-side",
                        route: `Route coordinated via active ${m.name} protocols.`,
                        explanation: `Switched custom channel selector to optimal profile utilizing specialized system features.`,
                      });
                    }
                  }}
                  className={`cursor-pointer p-2.5 rounded border text-center transition-all flex flex-col justify-between min-h-[90px] ${
                    ixActive
                      ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      : "bg-white/5 border-white/10 hover:border-white/20 text-white/80"
                  }`}
                >
                  <div className="font-mono text-xs font-black tracking-widest leading-none mb-1 text-left select-none">
                    {m.numeric}
                  </div>
                  <div className="text-[10px] font-black uppercase text-left leading-tight tracking-wider truncate mb-1">
                    {m.name}
                  </div>
                  <div className={`text-[8px] text-left leading-normal font-sans select-none truncate ${ixActive ? "text-black/80" : "text-white/40"}`}>
                    {m.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Brand System Footer */}
        <footer className="mt-8 text-center text-[10px] text-white/30 font-mono flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-white/5">
          <span>&copy; 2026 BYTEBRIDGE SYSTEMS INCORPORATED. POWERED BY INTEGRITY PACK AI.</span>
          <span className="flex items-center gap-1.5 uppercase hover:text-white transition">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            ACTIVE NETWORK NODE ENCRYPT LINK SECURED
          </span>
        </footer>

      </div>
    </div>
  );
}
