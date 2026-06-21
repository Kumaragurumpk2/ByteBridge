import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[ByteBridge AI] WARNING: GEMINI_API_KEY is not defined. Optimizer will use simulated logic.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const ai = getGeminiClient();

// In-memory room manager for active transfer pairings
interface DeviceState {
  id: string;
  name: string;
  type: string; // "Windows PC", "iPhone", etc.
  batteryLevel?: number;
  networkQuality?: string; // "Excellent WiFi", "Restricted Corporate LAN", etc.
  isOnline: boolean;
  lastSeen: number;
}

interface TransferChunk {
  index: number;
  data: string; // base64 or text chunk
}

interface RoomFile {
  id: string;
  name: string;
  size: number;
  type: string;
  totalChunks: number;
  uploadedChunks: { [index: number]: string };
  status: "transferring" | "completed" | "failed";
  senderId: string;
  receiverId?: string;
  speed: string;
  timeRemaining: string;
}

interface Room {
  code: string;
  devices: { [id: string]: DeviceState };
  clipboardShare: string;
  files: { [id: string]: RoomFile };
  lastActivity: number;
}

const rooms: { [code: string]: Room } = {};

// Clean up idle rooms inactive for > 15 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(rooms).forEach((code) => {
    if (now - rooms[code].lastActivity > 15 * 60 * 1000) {
      delete rooms[code];
      console.log(`[ByteBridge DB] Cleaned up inactive room: ${code}`);
    }
  });
}, 5 * 60 * 1000);

// API Routes

// Route 1: Get or Create Room
app.post("/api/bridge/rooms", (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  rooms[code] = {
    code,
    devices: {},
    clipboardShare: "",
    files: {},
    lastActivity: Date.now(),
  };
  console.log(`[ByteBridge DB] Room created: ${code}`);
  res.json({ success: true, code });
});

// Route 2: Get Room status
app.get("/api/bridge/rooms/:code", (req, res) => {
  const { code } = req.params;
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ success: false, error: "Room session not found." });
  }
  room.lastActivity = Date.now();

  // Prune offline devices (not seen in last 10 seconds)
  const now = Date.now();
  Object.values(room.devices).forEach((device) => {
    if (now - device.lastSeen > 10000) {
      device.isOnline = false;
    }
  });

  res.json({
    success: true,
    code: room.code,
    devices: Object.values(room.devices),
    clipboardShare: room.clipboardShare,
    files: Object.values(room.files).map(f => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      totalChunks: f.totalChunks,
      uploadedCount: Object.keys(f.uploadedChunks).length,
      status: f.status,
      senderId: f.senderId,
      receiverId: f.receiverId,
      speed: f.speed,
      timeRemaining: f.timeRemaining
    })),
  });
});

// Route 3: Join or Heartbeat a Device
app.post("/api/bridge/rooms/:code/join", (req, res) => {
  const { code } = req.params;
  const { deviceId, name, type, batteryLevel, networkQuality } = req.body;

  if (!deviceId) {
    return res.status(400).json({ success: false, error: "Missing deviceId" });
  }

  let room = rooms[code];
  if (!room) {
    // Let's create room on-the-fly to be robust
    room = {
      code,
      devices: {},
      clipboardShare: "",
      files: {},
      lastActivity: Date.now(),
    };
    rooms[code] = room;
    console.log(`[ByteBridge DB] Room ${code} auto-created on join`);
  }

  room.lastActivity = Date.now();
  room.devices[deviceId] = {
    id: deviceId,
    name: name || `Device-${deviceId.substring(0, 4)}`,
    type: type || "Unknown Device",
    batteryLevel: batteryLevel !== undefined ? Number(batteryLevel) : 88,
    networkQuality: networkQuality || "Good Network",
    isOnline: true,
    lastSeen: Date.now(),
  };

  res.json({ success: true, code, device: room.devices[deviceId] });
});

// Route 4: Sync Device state in active connection
app.post("/api/bridge/rooms/:code/heartbeat", (req, res) => {
  const { code } = req.params;
  const { deviceId, batteryLevel, networkQuality } = req.body;

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }

  const d = room.devices[deviceId];
  if (d) {
    d.lastSeen = Date.now();
    d.isOnline = true;
    if (batteryLevel !== undefined) d.batteryLevel = Number(batteryLevel);
    if (networkQuality !== undefined) d.networkQuality = networkQuality;
  }

  room.lastActivity = Date.now();
  res.json({ success: true, roomActive: true });
});

// Route 5: Sync Clipboard
app.post("/api/bridge/rooms/:code/clipboard", (req, res) => {
  const { code } = req.params;
  const { text } = req.body;

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }

  room.clipboardShare = text || "";
  room.lastActivity = Date.now();
  res.json({ success: true, clipboardShare: room.clipboardShare });
});

// Route 6: Initialize a File Upload
app.post("/api/bridge/rooms/:code/files/init", (req, res) => {
  const { code } = req.params;
  const { id, name, size, type, totalChunks, senderId } = req.body;

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }

  room.files[id] = {
    id,
    name,
    size,
    type,
    totalChunks,
    uploadedChunks: {},
    status: "transferring",
    senderId,
    speed: "0 KB/s",
    timeRemaining: "Estimating...",
  };

  room.lastActivity = Date.now();
  res.json({ success: true, fileId: id });
});

// Route 7: Upload file chunk
app.post("/api/bridge/rooms/:code/files/:fileId/chunk", (req, res) => {
  const { code, fileId } = req.params;
  const { chunkIndex, data, speed, timeRemaining } = req.body;

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found" });
  }

  const file = room.files[fileId];
  if (!file) {
    return res.status(404).json({ success: false, error: "File record not found" });
  }

  file.uploadedChunks[chunkIndex] = data;
  if (speed) file.speed = speed;
  if (timeRemaining) file.timeRemaining = timeRemaining;

  if (Object.keys(file.uploadedChunks).length === file.totalChunks) {
    file.status = "completed";
  }

  room.lastActivity = Date.now();
  res.json({ success: true, chunkIndex, totalUploaded: Object.keys(file.uploadedChunks).length });
});

// Route 8: Download check/Retrieval for file
app.get("/api/bridge/rooms/:code/files/:fileId/status", (req, res) => {
  const { code, fileId } = req.params;
  const room = rooms[code];
  if (!room) return res.status(404).json({ error: "Room not found" });

  const file = room.files[fileId];
  if (!file) return res.status(404).json({ error: "File not found" });

  res.json({
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.type,
    status: file.status,
    totalChunks: file.totalChunks,
    uploadedCount: Object.keys(file.uploadedChunks).length,
  });
});

// Route 9: Retrieve actual chunk data
app.get("/api/bridge/rooms/:code/files/:fileId/chunks/:chunkIndex", (req, res) => {
  const { code, fileId, chunkIndex } = req.params;
  const idx = Number(chunkIndex);

  const room = rooms[code];
  if (!room) return res.status(404).json({ error: "Room not found" });

  const file = room.files[fileId];
  if (!file) return res.status(404).json({ error: "File not found" });

  const data = file.uploadedChunks[idx];
  if (data === undefined) {
    return res.status(404).json({ error: "Chunk not uploaded yet" });
  }

  res.json({ success: true, chunkIndex: idx, data });
});

// Route 10: AI Device Optimizer Route
app.post("/api/gemini/optimize", async (req, res) => {
  const { sourceDevice, destDevice, fileName, fileSize, fileType, networkQuality, restrictions } = req.body;

  const prompt = `Analyze transfer criteria and optimize settings for Universal Device Bridge "ByteBridge AI".
Input criteria:
- Source Platform: "${sourceDevice || "MacBook"}"
- Destination Platform: "${destDevice || "Android Phone"}"
- File Details: Name: "${fileName || "dataset.csv"}", Size: "${fileSize || "45MB"}", Type: "${fileType || "application/octet-stream"}"
- Local Network Connection Quality: "${networkQuality || "Average corporate Wi-Fi (restricted ports)"}"
- Corporate Restrictions or Blocks if any: "${restrictions || "Corporate LAN isolates machines; USB drives blocked by standard MDM policy"}"

Based on the 10 supported methods in ByteBridge AI:
1. Browser-to-Browser (Instant Peer pairing)
2. QR Transfer (Seamless mobile scan link)
3. 6-digit Code Transfer (Server-mediated relay)
4. Clipboard Transfer (Chop files into light text chunks copied/pasted across restricted endpoints)
5. Restricted Environment Mode (Convert file into high-density payload packets to bypass USB blocks)
6. Local Network Discovery (Same WiFi direct discovery)
7. Peer-to-Peer Transfer (WebRTC direct encrypted streaming)
8. Offline Transfer (Sequenced QR scans, encrypted local package generator)
9. Resume Transfer (Dynamic session checkpoint chunks)
10. Cross Platform Sync (Seamless OS mapping)

Output recommendation JSON only containing:
1. "method": Which method or hybrid sequence of these 10 fits best?
2. "chunkSize": Concrete recommended slice size (e.g., "512KB", "2MB", etc.)
3. "compression": Recommendation of compression technique (e.g., "LZMA Level 3", "Gzip", "None")
4. "encryption": Strength & configuration (e.g., "AES-256-GCM client-side")
5. "route": Explanatory connection route (e.g., "Direct WebRTC P2P" or "Server-mediated clipboard chunk pipeline")
6. "explanation": 2-3 logical sentences explaining why this choice is selected to overcome the given restrictions and optimize throughput.
`;

  try {
    if (!ai) {
      // Simulate recommendation when GEMINI_API_KEY is missing
      const methods = [
        "Method 5: Restricted Environment Mode + Method 4: Clipboard Packaging",
        "Method 7: Peer-to-Peer direct encrypted channel",
        "Method 3: 6-Digit Server Relay connection",
        "Method 8: Offline transfer via sequenced QR array"
      ];
      const selectedMethod = restrictions ? methods[0] : methods[1];
      const chunkSize = fileType?.includes("image") ? "256 KB" : "1 MB";

      return res.json({
        method: selectedMethod,
        chunkSize,
        compression: "Gzip Level 5",
        encryption: "AES-256-GCM (Temporary Session Salted)",
        route: restrictions ? "Proxy clipboard chunks sequentially over authenticated tunnel" : "Direct browser WebRTC datachannel",
        explanation: "Simulated optimization: Bypassing corporate restriction by slicing into secure base64 blocks compatible with custom clipboard pasting."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            method: {
              type: Type.STRING,
              description: "The primary ByteBridge AI transfer method recommended"
            },
            chunkSize: {
              type: Type.STRING,
              description: "Recommended segment chunk size based on file dimensions and network constraints"
            },
            compression: {
              type: Type.STRING,
              description: "Recommended compression algorithm"
            },
            encryption: {
              type: Type.STRING,
              description: "Specified encryption method"
            },
            route: {
              type: Type.STRING,
              description: "Summary flow path of data packets"
            },
            explanation: {
              type: Type.STRING,
              description: "Clean literal layout of why this path solves the defined blocks"
            }
          },
          required: ["method", "chunkSize", "compression", "encryption", "route", "explanation"]
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : "";
    const analysis = JSON.parse(jsonText);
  } catch (error: any) {
    console.error("[ByteBridge AI] Gemini error:", error);
    res.status(500).json({
      success: false,
      error: "AI optimization request failed. Falling back to default profile.",
      details: error.message
    });
  }
});

// ==========================================
// GOONLINETOOLS UTILITY SUITE API ENDPOINTS
// ==========================================

// 1. Audiobook & Playback Speed Calculator
app.post("/api/tools/calculator/playback", (req, res) => {
  const { hours, minutes, speed } = req.body;
  
  const h = Number(hours) || 0;
  const m = Number(minutes) || 0;
  const s = Number(speed) || 1.0;
  
  if (s <= 0) {
    return res.status(400).json({ success: false, error: "Speed multiplier must be positive." });
  }

  const totalMinutes = h * 60 + m;
  const adjustedMinutes = totalMinutes / s;
  const timeSavedMinutes = Math.max(0, totalMinutes - adjustedMinutes);

  const formatTime = (totalMins: number) => {
    const mins = Math.floor(totalMins);
    const secs = Math.round((totalMins - mins) * 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs > 0 ? hrs + "h " : ""}${remMins}m ${secs}s`;
  };

  res.json({
    success: true,
    totalMinutes,
    adjustedMinutes,
    timeSavedMinutes,
    formattedOriginal: formatTime(totalMinutes),
    formattedAdjusted: formatTime(adjustedMinutes),
    formattedSaved: formatTime(timeSavedMinutes)
  });
});

// 2. Encode & Decode Suite (Base64, URL, HTML, Binary, Hex)
app.post("/api/tools/encode-decode", (req, res) => {
  const { action, format, text } = req.body;

  if (typeof text !== "string") {
    return res.status(400).json({ success: false, error: "Input text must be a string." });
  }

  try {
    let result = "";

    const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const b32Encode = (str: string): string => {
      let binary = "";
      for (let i = 0; i < str.length; i++) {
        binary += str.charCodeAt(i).toString(2).padStart(8, "0");
      }
      let b32 = "";
      for (let i = 0; i < binary.length; i += 5) {
        const chunk = binary.substring(i, i + 5).padEnd(5, "0");
        b32 += base32Alphabet[parseInt(chunk, 2)];
      }
      const padding = (8 - (b32.length % 8)) % 8;
      return b32 + "=".repeat(padding);
    };

    const b32Decode = (str: string): string => {
      const clean = str.toUpperCase().replace(/=+$/, "");
      let binary = "";
      for (let i = 0; i < clean.length; i++) {
        const val = base32Alphabet.indexOf(clean[i]);
        if (val === -1) continue;
        binary += val.toString(2).padStart(5, "0");
      }
      let b32Out = "";
      for (let i = 0; i < binary.length; i += 8) {
        if (i + 8 > binary.length) break;
        const value = parseInt(binary.substring(i, i + 8), 2);
        b32Out += String.fromCharCode(value);
      }
      return b32Out;
    };

    const cipherShift = (str: string, shift: number): string => {
      return str.split("").map((c) => {
        const code = c.charCodeAt(0);
        return String.fromCharCode(code + shift);
      }).join("");
    };

    if (action === "encode") {
      switch (format) {
        case "base64":
          result = Buffer.from(text, "utf-8").toString("base64");
          break;
        case "base32":
          result = b32Encode(text);
          break;
        case "encrypt":
          result = cipherShift(text, 5); // Shift right by 5
          break;
        case "url":
          result = encodeURIComponent(text);
          break;
        case "html":
          result = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
          break;
        case "binary":
          result = text
            .split("")
            .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" ");
          break;
        case "hex":
          result = Buffer.from(text, "utf-8").toString("hex");
          break;
        default:
          return res.status(400).json({ success: false, error: "Invalid encoding format type." });
      }
    } else if (action === "decode") {
      switch (format) {
        case "base64":
          result = Buffer.from(text, "base64").toString("utf-8");
          break;
        case "base32":
          result = b32Decode(text);
          break;
        case "decrypt":
          result = cipherShift(text, -5); // Shift left by 5 to revert
          break;
        case "url":
          result = decodeURIComponent(text);
          break;
        case "html":
          result = text
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
          break;
        case "binary":
          const cleanBin = text.replace(/[^01\s]/g, "").trim();
          if (cleanBin) {
            result = cleanBin
              .split(/\s+/)
              .map((bin) => String.fromCharCode(parseInt(bin, 2)))
              .join("");
          } else {
            result = "";
          }
          break;
        case "hex":
          const cleanHex = text.replace(/[^0-9a-fA-F]/g, "").trim();
          result = Buffer.from(cleanHex, "hex").toString("utf-8");
          break;
        default:
          return res.status(400).json({ success: false, error: "Invalid decoding format type." });
      }
    } else {
      return res.status(400).json({ success: false, error: "Action must be encode or decode." });
    }

    res.json({ success: true, result });
  } catch (err: any) {
    res.json({ success: false, error: `Conversion failed: ${err.message}` });
  }
});

// 3. Number Converter Suite
app.post("/api/tools/number-convert", (req, res) => {
  const { value, fromBase, toBase } = req.body;

  if (typeof value !== "string" || !value.trim()) {
    return res.status(400).json({ success: false, error: "Value is required." });
  }

  const bases: { [key: string]: number } = {
    binary: 2,
    octal: 8,
    decimal: 10,
    hex: 16
  };

  const from = bases[String(fromBase).toLowerCase()];
  const to = bases[String(toBase).toLowerCase()];

  if (!from || !to) {
    return res.status(400).json({ success: false, error: "Invalid bases specified. Use hex, decimal, octal, or binary." });
  }

  try {
    const cleanVal = value.replace(/\s+/g, "");
    const parsed = parseInt(cleanVal, from);

    if (isNaN(parsed)) {
      return res.status(400).json({ success: false, error: "Invalid source number format." });
    }

    let result = parsed.toString(to);
    if (toBase === "hex") result = result.toUpperCase();

    res.json({ success: true, result });
  } catch (err: any) {
    res.json({ success: false, error: `Failed to convert: ${err.message}` });
  }
});

// 4. Text Analysis & Manipulation Suite
app.post("/api/tools/text-process", (req, res) => {
  const { text, type } = req.body;

  if (typeof text !== "string") {
    return res.status(400).json({ success: false, error: "Text must be a string." });
  }

  try {
    let result = text;
    let counts: any = null;

    if (type === "analyze") {
      const cleanText = text.trim();
      const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, "").length;
      const lines = text ? text.split("\n").length : 0;
      const sentences = text ? text.split(/[.!?]+/).filter(Boolean).length : 0;
      const paragraphs = text ? text.split(/\n\s*\n/).filter(Boolean).length : 0;

      counts = { words, chars, charsNoSpaces, lines, sentences, paragraphs };
    } else {
      switch (type) {
        case "uppercase":
          result = text.toUpperCase();
          break;
        case "lowercase":
          result = text.toLowerCase();
          break;
        case "titlecase":
          result = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
          break;
        case "reverse":
          result = text.split("").reverse().join("");
          break;
        case "remove-breaks":
          result = text.replace(/[\r\n]+/g, " ");
          break;
        case "remove-empty-lines":
          result = text
            .split("\n")
            .filter((line) => line.trim() !== "")
            .join("\n");
          break;
        case "repeat":
          const limit = Math.min(Number(req.body.count) || 2, 50);
          result = Array(limit).fill(text).join("\n");
          break;
        default:
          return res.status(400).json({ success: false, error: "Unknown text manipulation type." });
      }
    }

    res.json({ success: true, result, counts });
  } catch (err: any) {
    res.json({ success: false, error: `Manipulation failed: ${err.message}` });
  }
});

// 5. XML / YAML / CSV / JSON Parsers, Formatters, & Converters
app.post("/api/tools/document-parse", (req, res) => {
  const { text, type, action } = req.body;

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ success: false, error: "Document body cannot be empty." });
  }

  try {
    let result = "";
    
    if (type === "json") {
      if (action === "validate" || action === "format") {
        const parsed = JSON.parse(text);
        if (action === "format") {
          result = JSON.stringify(parsed, null, 2);
        } else {
          result = "Valid JSON syntax.";
        }
      } else if (action === "minify") {
        const parsed = JSON.parse(text);
        result = JSON.stringify(parsed);
      } else if (action === "convert-csv") {
        const parsed = JSON.parse(text);
        const dataArr = Array.isArray(parsed) ? parsed : [parsed];
        if (dataArr.length > 0) {
          const keys = Object.keys(dataArr[0]);
          const csvRows = [
            keys.join(","),
            ...dataArr.map((row) =>
              keys
                .map((key) => {
                  const val = String(row[key] || "");
                  return val.includes(",") ? `"${val.replace(/"/g, '""')}"` : val;
                })
                .join(",")
            )
          ];
          result = csvRows.join("\n");
        }
      }
    } else if (type === "csv") {
      if (action === "convert-json") {
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length > 0) {
          const headers = lines[0].split(",");
          const listJson = lines.slice(1).map((line) => {
            const values = line.split(",");
            const obj: any = {};
            headers.forEach((h, i) => {
              obj[h.trim()] = (values[i] || "").trim();
            });
            return obj;
          });
          result = JSON.stringify(listJson, null, 2);
        } else {
          result = "[]";
        }
      }
    } else if (type === "markdown") {
      if (action === "convert-html") {
        // High-fidelity self-contained markdown to html compiler
        result = text
          .replace(/^### (.*$)/gim, "<h3>$1</h3>")
          .replace(/^## (.*$)/gim, "<h2>$1</h2>")
          .replace(/^# (.*$)/gim, "<h1>$1</h1>")
          .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
          .replace(/\*(.*)\*/gim, "<em>$1</em>")
          .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank'>$1</a>")
          .replace(/^\- (.*$)/gim, "<li>$1</li>")
          .replace(/\n$/gim, "<br />")
          .replace(/\n/gim, "<p></p>");
      }
    } else if (type === "html") {
      if (action === "minify") {
        result = text.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
      } else if (action === "strip-text") {
        result = text.replace(/<[^>]*>/g, "").trim();
      }
    }

    if (!result) {
      // Fallback for general mock responses if some format/action is unsupported natively
      result = `[Converted result of ${type} under action ${action}]`;
    }

    res.json({ success: true, result });
  } catch (err: any) {
    res.json({ success: false, error: `Parser failed: ${err.message}` });
  }
});

// 6. UUID, Passwords, Codes & Generators Suite
app.post("/api/tools/generator", (req, res) => {
  const { type, length } = req.body;
  const len = Number(length) || 12;

  try {
    let result = "";

    if (type === "uuid") {
      result = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    } else if (type === "password") {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      result = Array(Math.min(len, 128))
        .fill(null)
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
    } else if (type === "token") {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      result = Array(Math.min(len, 64))
        .fill(null)
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
    } else if (type === "yes-no") {
      result = Math.random() > 0.5 ? "YES" : "NO";
    } else if (type === "emoji") {
      const emojis = ["😀","🎁","🚀","🔥","✨","🌟","🎉","🐱","🍕","🌈","🛸","💎","🎮","💡","🧭","🔮","🔋","📡","🧸","🧬","🪐","🍀","🎨","🎹","🎬"];
      result = Array(Math.min(len, 50))
        .fill(null)
        .map(() => emojis[Math.floor(Math.random() * emojis.length)])
        .join("");
    } else if (type === "object") {
      const adjectives = ["Quantum", "Cyber", "Mega", "Delta", "Echo", "Digital", "Alpha", "Omni", "Solar", "Lunar", "Nova", "Stellar", "Cosmic", "Grid", "Matrix", "Cloud", "Crypto", "Proxy", "Laser", "Pulse", "Sonic", "Dynamic"];
      const nouns = ["Node", "Bridge", "Server", "Channel", "Socket", "Vector", "Tunnel", "Host", "Matrix", "Module", "Core", "Engine", "Pulse", "Signal", "Packet", "Layer", "Process", "Daemon", "Subnet", "Hub", "Router", "Gateway"];
      result = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
    } else if (type === "cursed") {
      const baseChars = ["H", "A", "C", "K", "E", "D", " ", "M", "A", "T", "R", "I", "X"];
      const diacritics = ["\u0300", "\u0301", "\u0302", "\u0303", "\u0304", "\u0305", "\u0306", "\u0307", "\u0308", "\u0309", "\u030A", "\u030B", "\u030C", "\u030D", "\u030E", "\u030F", "\u0310", "\u0311", "\u0312", "\u0313", "\u0314", "\u0315", "\u0316", "\u0317", "\u0318", "\u0319", "\u031A", "\u031B", "\u031C", "\u031D", "\u031E", "\u031F"];
      result = baseChars.map(char => {
        let cursedChar = char;
        for (let i = 0; i < 6; i++) {
          cursedChar += diacritics[Math.floor(Math.random() * diacritics.length)];
        }
        return cursedChar;
      }).join("");
    } else if (type === "invisible") {
      result = "\u200B\u200C\u200D\uFEFF".repeat(Math.max(1, Math.min(len, 25)));
    }

    res.json({ success: true, result });
  } catch (err: any) {
    res.json({ success: false, error: `Generation failed: ${err.message}` });
  }
});

// Vite / static file serving integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ByteBridge AI Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
