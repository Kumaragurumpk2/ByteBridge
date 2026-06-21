import { useState, useEffect } from "react";
import { 
  Wrench, Copy, Check, RotateCcw, Calculator, Clock, Lock, Unlock, 
  Trash2, Play, CheckCircle2, BarChart2, Code, Binary, Hash, FileCode 
} from "lucide-react";

interface DeveloperToolkitProps {
  isDarkMode: boolean;
}

export default function DeveloperToolkit({ isDarkMode }: DeveloperToolkitProps) {
  const [activeCategory, setActiveCategory] = useState<"encoders" | "validators" | "converters" | "calculators" | "generators" | "text" | "jwt">("encoders");
  
  // Shared text inputs and outputs
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sub-tab selection state inside categories
  const [encoderFormat, setEncoderFormat] = useState<"base64" | "url" | "html" | "binary" | "hex" | "base32" | "encrypt" | "decrypt">("base64");
  const [encoderAction, setEncoderAction] = useState<"encode" | "decode">("encode");

  // Number system states
  const [numInput, setNumInput] = useState("42");
  const [numFromBase, setNumFromBase] = useState("decimal");
  const [numToBase, setNumToBase] = useState("binary");
  const [numOutput, setNumOutput] = useState("");

  // Validator and Parser states
  const [docFormat, setDocFormat] = useState<"json" | "csv" | "markdown" | "html">("json");
  const [docAction, setDocAction] = useState<"format" | "minify" | "validate" | "convert-csv" | "convert-json" | "convert-html" | "strip-text">("format");

  // Playback speed and other calculators
  const [calculatorSubcategory, setCalculatorSubcategory] = useState<"playback" | "percentage" | "average" | "discount">("playback");
  const [calcHours, setCalcHours] = useState("1");
  const [calcMinutes, setCalcMinutes] = useState("30");
  const [calcSpeed, setCalcSpeed] = useState("1.5");
  const [calcReport, setCalcReport] = useState<{
    formattedOriginal: string;
    formattedAdjusted: string;
    formattedSaved: string;
  } | null>(null);

  // New Calculator states
  const [percentNum, setPercentNum] = useState("15");
  const [percentTotal, setPercentTotal] = useState("200");
  const [percentResult, setPercentResult] = useState<string | null>(null);

  const [averageInput, setAverageInput] = useState("10, 20, 30, 40, 50");
  const [averageResult, setAverageResult] = useState<string | null>(null);

  const [discountPrice, setDiscountPrice] = useState("120");
  const [discountPercent, setDiscountPercent] = useState("25");
  const [discountResult, setDiscountResult] = useState<{ original: number; saved: number; net: number } | null>(null);

  // Generator states
  const [genType, setGenType] = useState<"uuid" | "password" | "token" | "yes-no" | "emoji" | "object" | "cursed" | "invisible">("uuid");
  const [genLength, setGenLength] = useState("16");
  const [generatorResult, setGeneratorResult] = useState("");

  // JWT Decoder state
  const [jwtInput, setJwtInput] = useState("");
  const [jwtHeader, setJwtHeader] = useState("");
  const [jwtPayload, setJwtPayload] = useState("");
  const [jwtError, setJwtError] = useState<string | null>(null);

  // Text analysis states
  const [textCounts, setTextCounts] = useState<{
    words: number;
    chars: number;
    charsNoSpaces: number;
    lines: number;
    sentences: number;
    paragraphs: number;
  } | null>(null);
  const [textProcessType, setTextProcessType] = useState<"analyze" | "uppercase" | "lowercase" | "titlecase" | "reverse" | "remove-breaks" | "remove-empty-lines" | "repeat" | "replace">("analyze");
  const [textRepeatCount, setTextRepeatCount] = useState("3");
  const [replaceSearchTerm, setReplaceSearchTerm] = useState("");
  const [replaceTargetValue, setReplaceTargetValue] = useState("");

  // Clear all fields
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setErrorMsg(null);
  };

  // Copy to clipboard helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Run General Encoder & Decoder
  const handleEncodeDecode = async () => {
    if (!inputText) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/tools/encode-decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: encoderAction,
          format: encoderFormat,
          text: inputText
        })
      });
      const data = await res.json();
      if (data.success) {
        setOutputText(data.result);
      } else {
        setErrorMsg(data.error || "Failed converting encoding format.");
      }
    } catch (err: any) {
      setErrorMsg("Network error contacting bridge server.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Run Number Base System Converter
  const handleNumberConvert = async () => {
    if (!numInput) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/tools/number-convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: numInput,
          fromBase: numFromBase,
          toBase: numToBase
        })
      });
      const data = await res.json();
      if (data.success) {
        setNumOutput(data.result);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg("Error communicating with conversion backplane.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Run Document Parser / Validator / Converter
  const handleDocumentParse = async () => {
    if (!inputText) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/tools/document-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          type: docFormat,
          action: docAction
        })
      });
      const data = await res.json();
      if (data.success) {
        setOutputText(data.result);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg("Error parsing request.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Run Audiobook/Playback speed Calculator
  const handleCalculateSpeed = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/tools/calculator/playback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hours: calcHours,
          minutes: calcMinutes,
          speed: calcSpeed
        })
      });
      const data = await res.json();
      if (data.success) {
        setCalcReport({
          formattedOriginal: data.formattedOriginal,
          formattedAdjusted: data.formattedAdjusted,
          formattedSaved: data.formattedSaved
        });
      } else {
        setErrorMsg(data.error);
      }
    } catch (err) {
      setErrorMsg("Calculator submission failed.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Generate UUID, passcode, yes/no
  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/tools/generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: genType,
          length: genLength
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratorResult(data.result);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err) {
      setErrorMsg("Generators system offline.");
    } finally {
      setLoading(false);
    }
  };

  // 6. Text processor counters & case converters
  const handleTextProcess = async () => {
    if (!inputText) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      if (textProcessType === "replace") {
        const result = inputText.split(replaceSearchTerm).join(replaceTargetValue);
        setOutputText(result);
        setTextCounts(null);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/tools/text-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          type: textProcessType,
          count: textRepeatCount
        })
      });
      const data = await res.json();
      if (data.success) {
        if (textProcessType === "analyze") {
          setTextCounts(data.counts);
        } else {
          setOutputText(data.result);
          setTextCounts(null);
        }
      } else {
        setErrorMsg(data.error);
      }
    } catch (err) {
      setErrorMsg("Processor failed.");
    } finally {
      setLoading(false);
    }
  };

  // 7. Percentage Calculator
  const handlePercentCalc = () => {
    const num = Number(percentNum);
    const total = Number(percentTotal);
    if (isNaN(num) || isNaN(total) || total === 0) {
      setPercentResult("Invalid numerical entries.");
      return;
    }
    const result = ((num / 100) * total).toFixed(4);
    setPercentResult(`${num}% of ${total} is ${parseFloat(result)}`);
  };

  // 8. Average Calculator
  const handleAverageCalc = () => {
    const nums = averageInput.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length === 0) {
      setAverageResult("No valid numeric values detected.");
      return;
    }
    const sum = nums.reduce((a, b) => a + b, 0);
    const average = (sum / nums.length).toFixed(4);
    setAverageResult(`Sum: ${sum} | Count: ${nums.length} | Average: ${parseFloat(average)}`);
  };

  // 9. Discount Calculator
  const handleDiscountCalc = () => {
    const price = Number(discountPrice);
    const disc = Number(discountPercent);
    if (isNaN(price) || isNaN(disc)) {
      setDiscountResult(null);
      return;
    }
    const saved = price * (disc / 100);
    const net = price - saved;
    setDiscountResult({
      original: price,
      saved: parseFloat(saved.toFixed(2)),
      net: parseFloat(net.toFixed(2))
    });
  };

  // 10. JWT Decoder client helper
  const handleDecodeJWT = () => {
    setJwtError(null);
    setJwtHeader("");
    setJwtPayload("");
    if (!jwtInput.trim()) {
      setJwtError("JWT token string input is empty.");
      return;
    }
    try {
      const parts = jwtInput.split(".");
      if (parts.length !== 3) {
        setJwtError("Invalid JWT Format: Must structure as 'Header.Payload.Signature' tokens.");
        return;
      }
      
      const decodeSegment = (str: string) => {
        try {
          const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
          const decoded = atob(base64);
          return JSON.stringify(JSON.parse(decoded), null, 2);
        } catch (e) {
          const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
          return atob(base64);
        }
      };

      setJwtHeader(decodeSegment(parts[0]));
      setJwtPayload(decodeSegment(parts[1]));
    } catch (err: any) {
      setJwtError(`Failed to parse JWT: ${err.message}`);
    }
  };

  // Auto-fill mock helper for testing
  const autoFillSampleText = (type: string) => {
    switch (type) {
      case "json":
        setInputText(JSON.stringify({ userId: 1, name: "Alice", active: true, roles: ["admin", "dev"] }));
        break;
      case "csv":
        setInputText("name,email,role\nAlice,alice@example.com,Admin\nBob,bob@example.com,Dev");
        break;
      case "markdown":
        setInputText("# Hello World\nThis is **bold** text in markdown.\n- Item 1\n- Item 2");
        break;
      default:
        setInputText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    }
  };

  // Trigger conversion when category changes to fit smoothly
  useEffect(() => {
    if (activeCategory !== "encoders") {
      setErrorMsg(null);
    }
  }, [activeCategory]);

  return (
    <div className="space-y-6 animate-fade-in" id="toolkit-view-parent">
      {/* Dynamic Toolkit Sub-header summary */}
      <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-black uppercase text-cyan-400 font-mono tracking-wider flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400 animate-spin-slow" /> GoOnlineTools Bridge Utility Hub
          </h3>
          <p className="text-xs text-white/50 font-mono text-[10px]">Instant server-authenticated encoders, generators, parsing nodes, and text calculators.</p>
        </div>
        <div className="flex gap-2 text-[10px] uppercase font-mono">
          <span className="text-slate-400">Backing Channel Status:</span>
          <span className="text-emerald-400 font-bold font-mono">● LIVE HANDSHAKE Active</span>
        </div>
      </div>

      {/* Categories Rails buttons bar */}
      <div className="flex flex-wrap gap-1.5 font-mono text-xs border-b border-white/5 pb-4" id="toolkit-nav">
        {[
          { id: "encoders", label: "🔒 Encoders & Ciphers" },
          { id: "validators", label: "✔ Validators & Formatters" },
          { id: "converters", label: "🔄 Code Converters" },
          { id: "calculators", label: "⚖ Calculators" },
          { id: "generators", label: "⚙ Multi Generators" },
          { id: "text", label: "📊 Text Treatment" },
          { id: "jwt", label: "🔑 JWT Decoder" }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              setErrorMsg(null);
            }}
            className={`px-3 py-2 rounded-lg transition uppercase font-black tracking-wider border cursor-pointer ${
              activeCategory === cat.id
                ? "bg-cyan-500 text-black border-cyan-500 font-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : isDarkMode ? "text-slate-400 border-white/5 hover:text-white bg-white/5" : "text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Error / System Messages banner */}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-lg text-xs font-mono">
          ✖ ERROR CODE 510: {errorMsg}
        </div>
      )}

      {/* MAIN TWO COLUMN LAYOUT: INPUT/OPTIONS ON LEFT & RESULTS/CONTROLS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Input payload boxes */}
        <div className="lg:col-span-7 space-y-4">
          {/* For non-generators and non-calculators, show general text inputs */}
          {activeCategory !== "calculators" && activeCategory !== "generators" && activeCategory !== "jwt" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/40 uppercase font-black text-[10px]">Source Raw Data Input Payload:</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => autoFillSampleText(docFormat)} 
                    className="text-cyan-400 hover:underline uppercase text-[9px]"
                  >
                    Load Sample
                  </button>
                  <button 
                    onClick={handleClear} 
                    className="text-slate-400 hover:text-white flex items-center gap-1 uppercase text-[9px]"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              <textarea
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type, drag, or paste your text input elements here to compile..."
                className="w-full bg-black/65 border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline bg-blend-darken focus:outline-cyan-500 leading-relaxed shadow-inner"
              />
            </div>
          )}

          {/* SYSTEM VIEW FOR ALL CALCULATORS CATEGORIES */}
          {activeCategory === "calculators" && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-5 font-mono text-xs">
              <div className="flex flex-wrap gap-2 border-b border-white/15 pb-3">
                {[
                  { id: "playback", label: "⏱ Playback Saver" },
                  { id: "percentage", label: "📊 Percentage" },
                  { id: "average", label: "🔢 Average List" },
                  { id: "discount", label: "🏷 Sale Discount" }
                ].map((tc) => (
                  <button
                    key={tc.id}
                    onClick={() => {
                      setCalculatorSubcategory(tc.id as any);
                      setErrorMsg(null);
                    }}
                    className={`px-3 py-1.5 rounded-md uppercase font-black text-[9px] border transition cursor-pointer ${
                      calculatorSubcategory === tc.id
                        ? "bg-cyan-500 text-black border-cyan-500"
                        : "bg-black/40 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>

              {calculatorSubcategory === "playback" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 uppercase font-black text-xs">
                    <Calculator className="w-4 h-4" /> Audiobook Playback Speed Calculator
                  </div>
                  <p className="text-white/50 text-[11px] leading-relaxed">
                    Determine exactly how much time you save by speeding up your audio tracks, video files, lectures, or audiobook directories.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Original Hours</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="1"
                        value={calcHours}
                        onChange={(e) => setCalcHours(e.target.value)}
                        className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white focus:outline-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Original Minutes</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="30"
                        value={calcMinutes}
                        onChange={(e) => setCalcMinutes(e.target.value)}
                        className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white focus:outline-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Speed Multiplier</label>
                      <select
                        value={calcSpeed}
                        onChange={(e) => setCalcSpeed(e.target.value)}
                        className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-cyan-400 focus:outline-cyan-500 cursor-pointer"
                      >
                        <option value="1.0">1.0x (Normal)</option>
                        <option value="1.1">1.1x</option>
                        <option value="1.2">1.2x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.3">1.3x</option>
                        <option value="1.5">1.5x (Fast)</option>
                        <option value="1.75">1.75x</option>
                        <option value="2.0">2.0x (Hyper)</option>
                        <option value="2.5">2.5x</option>
                        <option value="3.0">3.0x</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleCalculateSpeed}
                    disabled={loading}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3 px-6 uppercase w-full rounded tracking-widest text-[11px] transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <Clock className="w-4 h-4" /> Calculate Playback Time Saved
                  </button>
                </div>
              )}

              {calculatorSubcategory === "percentage" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 uppercase font-black text-xs">
                    📊 Percentage Calculator
                  </div>
                  <p className="text-white/50 text-[11px]">Compute percentage portions instantly for scaling, metrics, or financial targets.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">What is (%) portion</label>
                      <input
                        type="number"
                        value={percentNum}
                        onChange={(e) => setPercentNum(e.target.value)}
                        className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white focus:outline-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Of Total Value</label>
                      <input
                        type="number"
                        value={percentTotal}
                        onChange={(e) => setPercentTotal(e.target.value)}
                        className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white focus:outline-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePercentCalc}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3 px-6 uppercase w-full rounded tracking-widest text-[11px] cursor-pointer shadow-md"
                  >
                    Calculate Percentage Value
                  </button>

                  {percentResult && (
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-lg text-cyan-400 font-bold text-center">
                      {percentResult}
                    </div>
                  )}
                </div>
              )}

              {calculatorSubcategory === "average" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 uppercase font-black text-xs">
                    🔢 List Average Calculator
                  </div>
                  <p className="text-white/50 text-[11px]">Submit comma or space separated numbers to compute the count, sum, and average value.</p>
                  
                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Numbers List (Separated by comma or space)</label>
                    <textarea
                      rows={2}
                      value={averageInput}
                      onChange={(e) => setAverageInput(e.target.value)}
                      className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white focus:outline-cyan-500 text-xs font-mono"
                    />
                  </div>

                  <button
                    onClick={handleAverageCalc}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3 px-6 uppercase w-full rounded tracking-widest text-[11px] cursor-pointer shadow-md"
                  >
                    Calculate Average Signature
                  </button>

                  {averageResult && (
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-lg text-cyan-400 font-bold select-all text-center">
                      {averageResult}
                    </div>
                  )}
                </div>
              )}

              {calculatorSubcategory === "discount" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 uppercase font-black text-xs">
                    🏷 Sale & Discount Calculator
                  </div>
                  <p className="text-white/50 text-[11px]">Determine price markdowns, overall monetary savings, and net output costs.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Original Retail Price ($)</label>
                      <input
                        type="number"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white focus:outline-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Discount Percent (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                        className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white focus:outline-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleDiscountCalc}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3 px-6 uppercase w-full rounded tracking-widest text-[11px] cursor-pointer shadow-md"
                  >
                    Calculate Discount Savings
                  </button>

                  {discountResult && (
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-3.5 rounded-lg text-cyan-400 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold border-b border-cyan-500/15 pb-1">
                        <span>Original Price:</span> <span className="text-white">${discountResult.original}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold border-b border-cyan-500/15 pb-1">
                        <span>Total Savings:</span> <span>${discountResult.saved}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] uppercase font-black">
                        <span>Net Final Price:</span> <span className="text-emerald-400 font-extrabold text-sm">${discountResult.net}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SPECIFIC VIEW FOR JWT CODEC */}
          {activeCategory === "jwt" && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-cyan-400 uppercase font-black text-xs">
                🔑 Interactive JSON Web Token (JWT) Decoder
              </div>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Parse and inspect raw JSON Web Tokens (JWT) encoded values instantly. This tool decodes the Header and Payload segments completely in safety.
              </p>
              
              <div className="space-y-1">
                <label className="block text-white/50 text-[10px] uppercase font-bold">Paste Raw JWT Token String:</label>
                <textarea
                  rows={6}
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c..."
                  className="w-full bg-black/65 border border-white/10 rounded-xl p-3 text-xs font-mono text-cyan-400 focus:outline bg-blend-darken focus:outline-cyan-500 leading-normal"
                />
              </div>

              {jwtError && (
                <div className="text-red-400 text-[11px] font-bold bg-red-500/10 p-2.5 rounded border border-red-500/20">
                  ✖ Decode Error: {jwtError}
                </div>
              )}

              <button
                onClick={handleDecodeJWT}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-2.5 px-6 uppercase w-full rounded tracking-widest text-[11px] transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                Decode JWT Token
              </button>
            </div>
          )}

          {/* SPECIFIC VIEW FOR MULTI GENERATOR */}
          {activeCategory === "generators" && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-5 font-mono text-xs">
              <div className="flex items-center gap-2 text-cyan-400 uppercase font-black text-xs">
                <Wrench className="w-5 h-5" /> Secure Generators Backplane
              </div>
              <p className="text-white/50 text-[11px]">Generate standard high-entropy random assets, UUID v4 keys, secure cryptography tokens, or trigger yes/no choices.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Asset Generation Type</label>
                  <select
                    value={genType}
                    onChange={(e) => setGenType(e.target.value as any)}
                    className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white cursor-pointer"
                  >
                    <option value="uuid">UUID v4 Unique Signature</option>
                    <option value="password">Secure Multi-Character Password</option>
                    <option value="token">Secure Alphanumeric Token</option>
                    <option value="yes-no">Decision YES or NO Wheel</option>
                    <option value="emoji">Random Emoji Sequence</option>
                    <option value="object">Random Object Name (GoOnlineTools feature)</option>
                    <option value="cursed">Cursed Text Writer (Zalgo Glitch)</option>
                    <option value="invisible">Invisible Character Injector</option>
                  </select>
                </div>

                {genType !== "uuid" && genType !== "yes-no" && genType !== "object" && genType !== "cursed" && (
                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Char Length</label>
                    <input
                      type="number"
                      min="4"
                      max="128"
                      value={genLength}
                      onChange={(e) => setGenLength(e.target.value)}
                      className="w-full bg-black/65 border border-white/10 p-2.5 rounded text-white"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3 px-6 uppercase w-full rounded tracking-widest text-[11px] transition cursor-pointer shadow-md"
              >
                Generate Token Element Now
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Tool modifiers panel and output compile views */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* OPTIONS CARD: DYNAMIC MODIFIERS PER CATEGORY */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-4 font-mono text-xs">
            <span className="text-cyan-400 font-black uppercase text-[10px] tracking-wider block">Tool Configurations & Execution:</span>

            {/* A. ENCODERS SYSTEM */}
            {activeCategory === "encoders" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Platform Format Option</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "base64", icon: FileCode, label: "Base64" },
                      { id: "base32", icon: FileCode, label: "Base32" },
                      { id: "url", icon: Hash, label: "URL Encode" },
                      { id: "html", icon: Code, label: "HTML Tag" },
                      { id: "binary", icon: Binary, label: "Binary" },
                      { id: "hex", icon: Hash, label: "Hexadecimal" },
                      { id: "encrypt", icon: Lock, label: "Encrypt Text" },
                      { id: "decrypt", icon: Unlock, label: "Decrypt Text" }
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => {
                          setEncoderFormat(fmt.id as any);
                          if (fmt.id === "encrypt") setEncoderAction("encode");
                          if (fmt.id === "decrypt") setEncoderAction("decode");
                        }}
                        className={`p-2 rounded border text-left flex items-center gap-2 uppercase font-bold text-[9px] cursor-pointer ${
                          encoderFormat === fmt.id ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/45" : "bg-black/20 border-white/5 text-slate-400 hover:bg-black/50"
                        }`}
                      >
                        <fmt.icon className="w-3.5 h-3.5" /> {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Operation Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setEncoderAction("encode")}
                      className={`p-2 rounded border uppercase font-extrabold text-[9px] flex items-center justify-center gap-1.5 cursor-pointer ${
                        encoderAction === "encode" ? "bg-cyan-500 text-black border-cyan-500" : "bg-black/20 border-white/5 text-slate-400 hover:bg-black/50"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" /> Encode Content
                    </button>
                    <button
                      onClick={() => setEncoderAction("decode")}
                      className={`p-2 rounded border uppercase font-extrabold text-[9px] flex items-center justify-center gap-1.5 cursor-pointer ${
                        encoderAction === "decode" ? "bg-cyan-500 text-black border-cyan-500" : "bg-black/20 border-white/5 text-slate-400 hover:bg-black/50"
                      }`}
                    >
                      <Unlock className="w-3.5 h-3.5" /> Decode Content
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleEncodeDecode}
                  disabled={loading || !inputText}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase rounded shadow tracking-wider text-[10px] transition cursor-pointer disabled:opacity-40"
                >
                  {loading ? "Transforming..." : "Execute Converter"}
                </button>
              </div>
            )}

            {/* B. VALIDATORS & FORMATTERS */}
            {activeCategory === "validators" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Payload Format Structure</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setDocFormat("json"); setDocAction("format"); }}
                      className={`p-2 rounded border uppercase font-bold text-[9px] cursor-pointer ${
                        docFormat === "json" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40" : "bg-black/20 border-white/5 text-slate-400 hover:bg-black/50"
                      }`}
                    >
                      JSON Document
                    </button>
                    <button
                      onClick={() => { setDocFormat("csv"); setDocAction("convert-json"); }}
                      className={`p-2 rounded border uppercase font-bold text-[9px] cursor-pointer ${
                        docFormat === "csv" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40" : "bg-black/20 border-white/5 text-slate-400 hover:bg-black/50"
                      }`}
                    >
                      CSV Spreadsheet
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Available Validations & Transforms</label>
                  <div className="flex flex-col gap-1.5">
                    {docFormat === "json" && (
                      <>
                        <button
                          onClick={() => setDocAction("format")}
                          className={`p-2 rounded border text-left uppercase text-[9px] cursor-pointer ${docAction === "format" ? "bg-cyan-500/10 text-cyan-450 border-cyan-500/30" : "text-white/40 bg-black/5"}`}
                        >
                          &bull; Format & Beautify JSON (Two-spaced)
                        </button>
                        <button
                          onClick={() => setDocAction("minify")}
                          className={`p-2 rounded border text-left uppercase text-[9px] cursor-pointer ${docAction === "minify" ? "bg-cyan-500/10 text-cyan-450 border-cyan-500/30" : "text-white/40 bg-black/5"}`}
                        >
                          &bull; Minify JSON (Remove spaces)
                        </button>
                        <button
                          onClick={() => setDocAction("validate")}
                          className={`p-2 rounded border text-left uppercase text-[9px] cursor-pointer ${docAction === "validate" ? "bg-cyan-500/10 text-cyan-450 border-cyan-500/30" : "text-white/40 bg-black/5"}`}
                        >
                          &bull; Validate Schema JSON Syntax
                        </button>
                        <button
                          onClick={() => setDocAction("convert-csv")}
                          className={`p-2 rounded border text-left uppercase text-[9px] cursor-pointer ${docAction === "convert-csv" ? "bg-cyan-500/10 text-cyan-450 border-cyan-500/30" : "text-white/40 bg-black/5"}`}
                        >
                          &bull; Convert JSON Schema to CSV file
                        </button>
                      </>
                    )}
                    {docFormat === "csv" && (
                      <button
                        onClick={() => setDocAction("convert-json")}
                        className="p-2 rounded border text-left uppercase text-[9px] bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      >
                        &bull; Convert CSV to JSON Records list
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleDocumentParse}
                  disabled={loading || !inputText}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase rounded shadow tracking-wider text-[10px] transition cursor-pointer disabled:opacity-40"
                >
                  Verify Format
                </button>
              </div>
            )}

            {/* C. CODE CONVERTERS */}
            {activeCategory === "converters" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">From format to Target</label>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => { setDocFormat("markdown"); setDocAction("convert-html"); }}
                      className={`p-2.5 rounded border text-left uppercase font-bold text-[9px] cursor-pointer ${
                        docFormat === "markdown" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40" : "bg-black/20 border-white/5 text-slate-400"
                      }`}
                    >
                      📄 Markdown to Raw HTML elements
                    </button>
                    <button
                      onClick={() => { setDocFormat("html"); setDocAction("strip-text"); }}
                      className={`p-2.5 rounded border text-left uppercase font-bold text-[9px] cursor-pointer ${
                        docFormat === "html" && docAction === "strip-text" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40" : "bg-black/20 border-white/5 text-slate-400"
                      }`}
                    >
                      ✂ HTML Stripper (Extract text content)
                    </button>
                    <button
                      onClick={() => { setDocFormat("html"); setDocAction("minify"); }}
                      className={`p-2.5 rounded border text-left uppercase font-bold text-[9px] cursor-pointer ${
                        docFormat === "html" && docAction === "minify" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40" : "bg-black/20 border-white/5 text-slate-400"
                      }`}
                    >
                      ⚡ HTML Tag Minify compiler
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDocumentParse}
                  disabled={loading || !inputText}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase rounded shadow tracking-wider text-[10px] transition cursor-pointer disabled:opacity-40"
                >
                  Convert Document Format
                </button>

                {/* Subnet converter details */}
                <div className="bg-black/40 p-3 rounded text-[10px] text-white/40 leading-relaxed border border-white/5">
                  Our lightweight backplane parsing engines compiles the source syntax segments safely on server memory.
                </div>
              </div>
            )}

            {/* D. PLAYBACK CALCULATORS */}
            {activeCategory === "calculators" && (
              <div className="space-y-4">
                <span className="text-[10px] uppercase text-white/40 font-bold block">Playback Metrics summary:</span>
                {calcReport ? (
                  <div className="bg-black/60 p-4 border border-white/5 rounded-lg space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-white/40 text-[9px]">RAW LISTEN TIME:</span>
                      <span className="text-white font-bold">{calcReport.formattedOriginal}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-cyan-400 text-[9px]">SPEED ADJUSTED MULTI:</span>
                      <span className="text-cyan-400 font-bold">{calcReport.formattedAdjusted}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-400">
                      <span className="text-[9px] uppercase font-black">NET TIME CONVERGED:</span>
                      <span className="font-extrabold text-xs">{calcReport.formattedSaved} SAVED!</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-black/40 border border-white/5 text-white/30 rounded text-center">
                    Enter audio directory hours and click calculate to compile playback report metrics.
                  </div>
                )}

                {/* Number system converter nested inline */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <span className="text-cyan-400 font-bold text-[9px] uppercase tracking-wide block">Nested 4-Base Number System Converter:</span>
                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div>
                      <label className="text-white/40 block mb-1">Source Base</label>
                      <select value={numFromBase} onChange={(e) => setNumFromBase(e.target.value)} className="w-full bg-black/40 p-1.5 border border-white/5 rounded text-white cursor-pointer">
                        <option value="decimal">Decimal (10)</option>
                        <option value="binary">Binary (2)</option>
                        <option value="hex">Hex (16)</option>
                        <option value="octal">Octal (8)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/40 block mb-1">Target Base</label>
                      <select value={numToBase} onChange={(e) => setNumToBase(e.target.value)} className="w-full bg-black/40 p-1.5 border border-white/5 rounded text-cyan-400 cursor-pointer">
                        <option value="binary">Binary (2)</option>
                        <option value="decimal">Decimal (10)</option>
                        <option value="hex">Hex (16)</option>
                        <option value="octal">Octal (8)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/40 text-[9px] block mb-1">Value array input</label>
                    <input type="text" value={numInput} onChange={(e) => setNumInput(e.target.value)} className="w-full bg-black/40 p-2 border border-white/10 rounded text-emerald-400 font-bold text-[11px]" />
                  </div>
                  
                  <button onClick={handleNumberConvert} className="w-full py-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black border border-cyan-500/25 rounded text-[9px] uppercase font-black cursor-pointer">Convert Number Bases</button>

                  {numOutput && (
                    <div className="p-2.5 bg-black/50 border border-white/10 rounded text-emerald-400 font-bold tracking-wider leading-none select-all text-xs">
                      RESULT: {numOutput}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* E. MULTI GENERATORS */}
            {activeCategory === "generators" && (
              <div className="space-y-4">
                <span className="text-[10px] uppercase text-white/40 font-bold block">Generated Output Element:</span>
                {generatorResult ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-black/60 text-emerald-400 border border-cyan-500/25 rounded-md font-bold tracking-wider break-all select-all font-mono">
                      {generatorResult}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(generatorResult)}
                        className="flex-1 py-2 bg-cyan-500 text-black font-extrabold text-[10px] uppercase rounded flex items-center justify-center gap-1.5 cursor-pointer hover:bg-cyan-400"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy to clipboard"}
                      </button>
                      <button
                        onClick={() => setGeneratorResult("")}
                        className="px-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded flex items-center justify-center"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-black/40 border border-white/5 text-white/30 rounded text-center">
                    No system tokens generated yet. Click generate button on left.
                  </div>
                )}
              </div>
            )}

            {/* F. TEXT PROCESSING & ANALYSIS SUMMARY */}
            {activeCategory === "text" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Text Treatment selection</label>
                  <select
                    value={textProcessType}
                    onChange={(e) => setTextProcessType(e.target.value as any)}
                    className="w-full bg-black/65 border border-white/5 p-2 rounded text-cyan-400 cursor-pointer"
                  >
                    <option value="analyze">📊 Complete High-Fidelity Word & Paragraph Analysis</option>
                    <option value="uppercase">🗚 Transform to UPPERCASE</option>
                    <option value="lowercase">🗚 Transform to lowercase</option>
                    <option value="titlecase">🗚 Transform to Title Case</option>
                    <option value="reverse">🔄 Infinite Words Reverse treatment</option>
                    <option value="remove-breaks">✂ Remove all Line Breaks</option>
                    <option value="remove-empty-lines">✂ Remove Empty Blank Lines</option>
                    <option value="repeat">🔁 Text Repeater loop</option>
                    <option value="replace">🔍 Find & Replace Text</option>
                  </select>
                </div>

                {textProcessType === "repeat" && (
                  <div>
                    <label className="block text-white/50 text-[10px] uppercase font-bold mb-1">Loop repeat size</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={textRepeatCount}
                      onChange={(e) => setTextRepeatCount(e.target.value)}
                      className="w-full bg-black/65 border border-white/5 p-2 rounded text-emerald-400"
                    />
                  </div>
                )}

                {textProcessType === "replace" && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-0.5">Find substring / word</label>
                      <input
                        type="text"
                        value={replaceSearchTerm}
                        onChange={(e) => setReplaceSearchTerm(e.target.value)}
                        placeholder="Search word..."
                        className="w-full bg-black/65 border border-white/5 p-1.5 rounded text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[10px] uppercase font-bold mb-0.5">Replace with value</label>
                      <input
                        type="text"
                        value={replaceTargetValue}
                        onChange={(e) => setReplaceTargetValue(e.target.value)}
                        placeholder="Replace word..."
                        className="w-full bg-black/65 border border-white/5 p-1.5 rounded text-emerald-400 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleTextProcess}
                  disabled={loading || !inputText}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase rounded shadow tracking-wider text-[10px] transition cursor-pointer disabled:opacity-40 select-none pb-2.5"
                >
                  Process Text Manipulation
                </button>
              </div>
            )}
          </div>

          {/* COMPILED TRANSFORMATION RESULT PAYLOAD DISPLAY CARD */}
          {activeCategory !== "calculators" && activeCategory !== "generators" && (
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3 font-mono text-xs">
              {activeCategory === "jwt" ? (
                <div className="space-y-4">
                  <span className="text-cyan-400 font-black uppercase text-[10px] tracking-wider block">Decoded JWT Properties:</span>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                      <span>Header Parameters:</span>
                      {jwtHeader && (
                        <button
                          onClick={() => handleCopy(jwtHeader)}
                          className="text-purple-400 hover:underline hover:text-purple-300 transition"
                        >
                          Copy Header
                        </button>
                      )}
                    </div>
                    <pre className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-[11px] text-purple-300 leading-relaxed overflow-x-auto select-all max-h-[145px] font-mono">
                      {jwtHeader || "No Header Decoded yet. Provide JWT on left."}
                    </pre>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                      <span>Decoded Claims / Payload:</span>
                      {jwtPayload && (
                        <button
                          onClick={() => handleCopy(jwtPayload)}
                          className="text-emerald-400 hover:underline hover:text-emerald-300 transition"
                        >
                          Copy Payload
                        </button>
                      )}
                    </div>
                    <pre className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-[11px] text-emerald-400 leading-relaxed overflow-x-auto select-all max-h-[200px] font-mono">
                      {jwtPayload || "No Payload Decoded yet. Provide JWT on left."}
                    </pre>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-black uppercase text-[10px] tracking-wider">Compiled Output Payload:</span>
                    {outputText && (
                      <button
                        onClick={() => handleCopy(outputText)}
                        className="text-cyan-400 hover:underline flex items-center gap-1 uppercase text-[10px] font-bold"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy Output"}
                      </button>
                    )}
                  </div>

                  {textCounts && activeCategory === "text" && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 text-slate-300">
                      <div className="bg-black/40 border border-white/5 p-2.5 rounded-lg flex justify-between">
                        <span className="text-white/40">Words count:</span>
                        <span className="font-bold text-cyan-400">{textCounts.words}</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-2.5 rounded-lg flex justify-between">
                        <span className="text-white/40">Line count:</span>
                        <span className="font-bold text-cyan-400">{textCounts.lines}</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-2.5 rounded-lg flex justify-between">
                        <span className="text-white/40">Character count:</span>
                        <span className="font-bold text-cyan-400">{textCounts.chars}</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-2.5 rounded-lg flex justify-between">
                        <span className="text-white/40">(No spaces):</span>
                        <span className="font-bold text-cyan-400">{textCounts.charsNoSpaces}</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-2.5 rounded-lg flex justify-between">
                        <span className="text-white/40">Sentences:</span>
                        <span className="font-bold text-cyan-400">{textCounts.sentences}</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-2.5 rounded-lg flex justify-between">
                        <span className="text-white/40">Paragraphs:</span>
                        <span className="font-bold text-cyan-400">{textCounts.paragraphs}</span>
                      </div>
                    </div>
                  )}

                  <div className="w-full bg-black/60 border border-white/10 rounded-lg p-3 min-h-[140px] max-h-[280px] overflow-y-auto break-all font-mono text-[11px] text-emerald-400 leading-relaxed select-all">
                    {loading ? (
                      <span className="text-white/30 animate-pulse uppercase select-none font-bold">Compiling telemetry conversions from bridge...</span>
                    ) : outputText ? (
                      outputText
                    ) : (
                      <span className="text-white/30 select-none">Output results will appear here after executing elements treatment...</span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
