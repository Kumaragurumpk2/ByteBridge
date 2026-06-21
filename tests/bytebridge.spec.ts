import { test, expect, request } from "@playwright/test";

// ─────────────────────────────────────────────────────────────
// SECTION 1: SERVER API TESTS  (direct HTTP, no browser)
// ─────────────────────────────────────────────────────────────

test.describe("API — Room management", () => {
  let roomCode: string;

  test("POST /api/bridge/rooms — creates a room", async ({ request }) => {
    const res = await request.post("/api/bridge/rooms");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.code).toMatch(/^\d{6}$/);
    roomCode = body.code;
  });

  test("GET /api/bridge/rooms/:code — returns room status", async ({ request }) => {
    // create fresh room first
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();

    const res = await request.get(`/api/bridge/rooms/${code}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.code).toBe(code);
    expect(Array.isArray(body.devices)).toBe(true);
    expect(body.clipboardShare).toBe("");
    expect(Array.isArray(body.files)).toBe(true);
  });

  test("GET /api/bridge/rooms/999999 — 404 for unknown code", async ({ request }) => {
    const res = await request.get("/api/bridge/rooms/999999");
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("POST /api/bridge/rooms/:code/join — registers a device", async ({ request }) => {
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();

    const res = await request.post(`/api/bridge/rooms/${code}/join`, {
      data: {
        deviceId: "test-device-01",
        name: "Test MacBook",
        type: "MacBook",
        batteryLevel: 88,
        networkQuality: "Excellent WiFi",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.device.id).toBe("test-device-01");
    expect(body.device.isOnline).toBe(true);
  });

  test("POST /api/bridge/rooms/:code/heartbeat — keeps device alive", async ({ request }) => {
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();
    await request.post(`/api/bridge/rooms/${code}/join`, {
      data: { deviceId: "hb-device", name: "HB Phone", type: "Android Phone" },
    });

    const res = await request.post(`/api/bridge/rooms/${code}/heartbeat`, {
      data: { deviceId: "hb-device", batteryLevel: 50, networkQuality: "4G LTE" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.roomActive).toBe(true);
  });

  test("POST /api/bridge/rooms/:code/join — missing deviceId returns 400", async ({ request }) => {
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();
    const res = await request.post(`/api/bridge/rooms/${code}/join`, { data: {} });
    expect(res.status()).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 2: CLIPBOARD API
// ─────────────────────────────────────────────────────────────

test.describe("API — Clipboard sync", () => {
  test("POST clipboard then GET room — text is persisted", async ({ request }) => {
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();

    const push = await request.post(`/api/bridge/rooms/${code}/clipboard`, {
      data: { text: "Hello ByteBridge clipboard!" },
    });
    expect(push.status()).toBe(200);
    const pushBody = await push.json();
    expect(pushBody.clipboardShare).toBe("Hello ByteBridge clipboard!");

    const get = await request.get(`/api/bridge/rooms/${code}`);
    const getBody = await get.json();
    expect(getBody.clipboardShare).toBe("Hello ByteBridge clipboard!");
  });

  test("POST clipboard — empty text clears board", async ({ request }) => {
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();
    await request.post(`/api/bridge/rooms/${code}/clipboard`, {
      data: { text: "some text" },
    });
    await request.post(`/api/bridge/rooms/${code}/clipboard`, {
      data: { text: "" },
    });
    const get = await request.get(`/api/bridge/rooms/${code}`);
    const body = await get.json();
    expect(body.clipboardShare).toBe("");
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 3: FILE TRANSFER API
// ─────────────────────────────────────────────────────────────

test.describe("API — File transfer pipeline", () => {
  test("Full pipeline: init → upload chunks → complete → retrieve", async ({ request }) => {
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();

    // Init file
    const init = await request.post(`/api/bridge/rooms/${code}/files/init`, {
      data: {
        id: "file-test-01",
        name: "test_report.pdf",
        size: 1024000,
        type: "application/pdf",
        totalChunks: 3,
        senderId: "device-sender-99",
      },
    });
    expect(init.status()).toBe(200);
    const initBody = await init.json();
    expect(initBody.success).toBe(true);
    expect(initBody.fileId).toBe("file-test-01");

    // Upload 3 chunks
    for (let i = 0; i < 3; i++) {
      const chunk = await request.post(
        `/api/bridge/rooms/${code}/files/file-test-01/chunk`,
        {
          data: {
            chunkIndex: i,
            data: `CHUNK_DATA_${i}_BASE64_PAYLOAD==`,
            speed: "1.2 GB/s",
            timeRemaining: `${(3 - i) * 10}ms`,
          },
        }
      );
      expect(chunk.status()).toBe(200);
      const chunkBody = await chunk.json();
      expect(chunkBody.success).toBe(true);
      expect(chunkBody.chunkIndex).toBe(i);
      expect(chunkBody.totalUploaded).toBe(i + 1);
    }

    // File status — should be completed
    const status = await request.get(
      `/api/bridge/rooms/${code}/files/file-test-01/status`
    );
    expect(status.status()).toBe(200);
    const statusBody = await status.json();
    expect(statusBody.status).toBe("completed");
    expect(statusBody.uploadedCount).toBe(3);
    expect(statusBody.name).toBe("test_report.pdf");

    // Retrieve chunk 1
    const retrieveChunk = await request.get(
      `/api/bridge/rooms/${code}/files/file-test-01/chunks/1`
    );
    expect(retrieveChunk.status()).toBe(200);
    const retrieveBody = await retrieveChunk.json();
    expect(retrieveBody.success).toBe(true);
    expect(retrieveBody.data).toBe("CHUNK_DATA_1_BASE64_PAYLOAD==");
  });

  test("GET chunk before upload — 404", async ({ request }) => {
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();
    await request.post(`/api/bridge/rooms/${code}/files/init`, {
      data: { id: "f-empty", name: "x.txt", size: 0, type: "text/plain", totalChunks: 2, senderId: "d1" },
    });
    const res = await request.get(`/api/bridge/rooms/${code}/files/f-empty/chunks/0`);
    expect(res.status()).toBe(404);
  });

  test("Status for unknown file — 404", async ({ request }) => {
    const created = await request.post("/api/bridge/rooms");
    const { code } = await created.json();
    const res = await request.get(`/api/bridge/rooms/${code}/files/nonexistent/status`);
    expect(res.status()).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 4: TOOLKIT — Encode / Decode
// ─────────────────────────────────────────────────────────────

test.describe("API — Encode / Decode", () => {
  const BASE = "/api/tools/encode-decode";

  test("base64 encode + decode round-trip", async ({ request }) => {
    const enc = await request.post(BASE, { data: { action: "encode", format: "base64", text: "ByteBridge" } });
    const { result: encoded } = await enc.json();
    expect(encoded).toBe(Buffer.from("ByteBridge").toString("base64"));

    const dec = await request.post(BASE, { data: { action: "decode", format: "base64", text: encoded } });
    const { result: decoded } = await dec.json();
    expect(decoded).toBe("ByteBridge");
  });

  test("url encode + decode", async ({ request }) => {
    const enc = await request.post(BASE, { data: { action: "encode", format: "url", text: "hello world & more" } });
    const { result } = await enc.json();
    expect(result).toBe("hello%20world%20%26%20more");

    const dec = await request.post(BASE, { data: { action: "decode", format: "url", text: result } });
    const { result: back } = await dec.json();
    expect(back).toBe("hello world & more");
  });

  test("html encode + decode", async ({ request }) => {
    const enc = await request.post(BASE, { data: { action: "encode", format: "html", text: "<b>Bold & 'quotes'</b>" } });
    const { result } = await enc.json();
    expect(result).toContain("&lt;b&gt;");
    expect(result).toContain("&amp;");

    const dec = await request.post(BASE, { data: { action: "decode", format: "html", text: result } });
    const { result: back } = await dec.json();
    expect(back).toBe("<b>Bold & 'quotes'</b>");
  });

  test("hex encode + decode", async ({ request }) => {
    const enc = await request.post(BASE, { data: { action: "encode", format: "hex", text: "hi" } });
    const { result } = await enc.json();
    expect(result).toBe("6869");

    const dec = await request.post(BASE, { data: { action: "decode", format: "hex", text: result } });
    const { result: back } = await dec.json();
    expect(back).toBe("hi");
  });

  test("binary encode + decode", async ({ request }) => {
    const enc = await request.post(BASE, { data: { action: "encode", format: "binary", text: "A" } });
    const { result } = await enc.json();
    expect(result).toBe("01000001");

    const dec = await request.post(BASE, { data: { action: "decode", format: "binary", text: result } });
    const { result: back } = await dec.json();
    expect(back).toBe("A");
  });

  test("encrypt + decrypt (Caesar shift)", async ({ request }) => {
    const enc = await request.post(BASE, { data: { action: "encode", format: "encrypt", text: "hello" } });
    const { result: cipher } = await enc.json();
    expect(cipher).not.toBe("hello");

    const dec = await request.post(BASE, { data: { action: "decode", format: "decrypt", text: cipher } });
    const { result: plain } = await dec.json();
    expect(plain).toBe("hello");
  });

  test("invalid format returns error", async ({ request }) => {
    const res = await request.post(BASE, { data: { action: "encode", format: "magic", text: "test" } });
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 5: TOOLKIT — Number Converter
// ─────────────────────────────────────────────────────────────

test.describe("API — Number converter", () => {
  const BASE = "/api/tools/number-convert";

  test("decimal 255 → hex FF", async ({ request }) => {
    const res = await request.post(BASE, { data: { value: "255", fromBase: "decimal", toBase: "hex" } });
    const { result } = await res.json();
    expect(result).toBe("FF");
  });

  test("binary 1010 → decimal 10", async ({ request }) => {
    const res = await request.post(BASE, { data: { value: "1010", fromBase: "binary", toBase: "decimal" } });
    const { result } = await res.json();
    expect(result).toBe("10");
  });

  test("hex FF → octal", async ({ request }) => {
    const res = await request.post(BASE, { data: { value: "FF", fromBase: "hex", toBase: "octal" } });
    const { result } = await res.json();
    expect(result).toBe("377");
  });

  test("invalid number returns error", async ({ request }) => {
    const res = await request.post(BASE, { data: { value: "ZZZ", fromBase: "binary", toBase: "decimal" } });
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 6: TOOLKIT — Text processor
// ─────────────────────────────────────────────────────────────

test.describe("API — Text processor", () => {
  const BASE = "/api/tools/text-process";

  test("uppercase", async ({ request }) => {
    const res = await request.post(BASE, { data: { text: "hello world", type: "uppercase" } });
    const { result } = await res.json();
    expect(result).toBe("HELLO WORLD");
  });

  test("lowercase", async ({ request }) => {
    const res = await request.post(BASE, { data: { text: "HELLO WORLD", type: "lowercase" } });
    const { result } = await res.json();
    expect(result).toBe("hello world");
  });

  test("reverse", async ({ request }) => {
    const res = await request.post(BASE, { data: { text: "abc", type: "reverse" } });
    const { result } = await res.json();
    expect(result).toBe("cba");
  });

  test("analyze — returns word/char counts", async ({ request }) => {
    const res = await request.post(BASE, { data: { text: "Hello world\nSecond line", type: "analyze" } });
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.counts.words).toBe(4);
    expect(body.counts.lines).toBe(2);
  });

  test("remove-breaks", async ({ request }) => {
    const res = await request.post(BASE, { data: { text: "line1\nline2\nline3", type: "remove-breaks" } });
    const { result } = await res.json();
    expect(result).toBe("line1 line2 line3");
  });

  test("titlecase", async ({ request }) => {
    const res = await request.post(BASE, { data: { text: "hello world", type: "titlecase" } });
    const { result } = await res.json();
    expect(result).toBe("Hello World");
  });

  test("repeat × 3", async ({ request }) => {
    const res = await request.post(BASE, { data: { text: "go", type: "repeat", count: 3 } });
    const { result } = await res.json();
    expect(result).toBe("go\ngo\ngo");
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 7: TOOLKIT — Generators
// ─────────────────────────────────────────────────────────────

test.describe("API — Generators", () => {
  const BASE = "/api/tools/generator";

  test("uuid — valid v4 format", async ({ request }) => {
    const res = await request.post(BASE, { data: { type: "uuid" } });
    const { result } = await res.json();
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  test("password — correct length", async ({ request }) => {
    const res = await request.post(BASE, { data: { type: "password", length: 20 } });
    const { result } = await res.json();
    expect(result).toHaveLength(20);
  });

  test("token — alphanumeric only", async ({ request }) => {
    const res = await request.post(BASE, { data: { type: "token", length: 16 } });
    const { result } = await res.json();
    expect(result).toMatch(/^[A-Z0-9]{16}$/);
  });

  test("yes-no — returns YES or NO", async ({ request }) => {
    const res = await request.post(BASE, { data: { type: "yes-no" } });
    const { result } = await res.json();
    expect(["YES", "NO"]).toContain(result);
  });

  test("uuid — two calls give different values", async ({ request }) => {
    const a = await request.post(BASE, { data: { type: "uuid" } });
    const b = await request.post(BASE, { data: { type: "uuid" } });
    const { result: r1 } = await a.json();
    const { result: r2 } = await b.json();
    expect(r1).not.toBe(r2);
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 8: TOOLKIT — Document parser
// ─────────────────────────────────────────────────────────────

test.describe("API — Document parser", () => {
  const BASE = "/api/tools/document-parse";

  test("JSON format (beautify)", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { text: '{"a":1,"b":2}', type: "json", action: "format" },
    });
    const { result } = await res.json();
    expect(result).toContain("\n");
    expect(result).toContain('"a": 1');
  });

  test("JSON minify", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { text: '{\n  "a": 1\n}', type: "json", action: "minify" },
    });
    const { result } = await res.json();
    expect(result).toBe('{"a":1}');
  });

  test("JSON validate — valid", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { text: '{"ok":true}', type: "json", action: "validate" },
    });
    const { result } = await res.json();
    expect(result).toContain("Valid");
  });

  test("JSON → CSV conversion", async ({ request }) => {
    const res = await request.post(BASE, {
      data: {
        text: JSON.stringify([{ name: "Alice", age: "30" }, { name: "Bob", age: "25" }]),
        type: "json",
        action: "convert-csv",
      },
    });
    const { result } = await res.json();
    expect(result).toContain("name,age");
    expect(result).toContain("Alice");
  });

  test("CSV → JSON conversion", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { text: "name,age\nAlice,30\nBob,25", type: "csv", action: "convert-json" },
    });
    const { result } = await res.json();
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("Alice");
  });

  test("Markdown → HTML", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { text: "# Hello\n**bold**", type: "markdown", action: "convert-html" },
    });
    const { result } = await res.json();
    expect(result).toContain("<h1>");
    expect(result).toContain("<strong>");
  });

  test("HTML strip text", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { text: "<h1>Title</h1><p>Body</p>", type: "html", action: "strip-text" },
    });
    const { result } = await res.json();
    expect(result).toBe("TitleBody");
  });

  test("invalid JSON → returns error", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { text: "{bad json}", type: "json", action: "format" },
    });
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 9: TOOLKIT — Playback calculator
// ─────────────────────────────────────────────────────────────

test.describe("API — Playback speed calculator", () => {
  const BASE = "/api/tools/calculator/playback";

  test("1h 30m at 1.5x speed saves 30 minutes", async ({ request }) => {
    const res = await request.post(BASE, { data: { hours: 1, minutes: 30, speed: 1.5 } });
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.totalMinutes).toBe(90);
    expect(Math.round(body.adjustedMinutes)).toBe(60);
    expect(Math.round(body.timeSavedMinutes)).toBe(30);
  });

  test("zero speed returns 400", async ({ request }) => {
    const res = await request.post(BASE, { data: { hours: 1, minutes: 0, speed: 0 } });
    expect(res.status()).toBe(400);
  });

  test("2x speed halves the time", async ({ request }) => {
    const res = await request.post(BASE, { data: { hours: 1, minutes: 0, speed: 2.0 } });
    const body = await res.json();
    expect(body.adjustedMinutes).toBe(30);
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 10: AI OPTIMIZER
// ─────────────────────────────────────────────────────────────

test.describe("API — AI Optimizer (fallback mode)", () => {
  test("returns a recommendation object with all fields", async ({ request }) => {
    const res = await request.post("/api/gemini/optimize", {
      data: {
        sourceDevice: "MacBook",
        destDevice: "Android Phone",
        fileName: "report.pdf",
        fileSize: "45MB",
        fileType: "application/pdf",
        networkQuality: "Corporate WiFi",
        restrictions: "USB blocked, MDM policy",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("method");
    expect(body).toHaveProperty("chunkSize");
    expect(body).toHaveProperty("compression");
    expect(body).toHaveProperty("encryption");
    expect(body).toHaveProperty("route");
    expect(body).toHaveProperty("explanation");
  });

  test("without restrictions — picks different method", async ({ request }) => {
    const res = await request.post("/api/gemini/optimize", {
      data: {
        sourceDevice: "MacBook",
        destDevice: "Windows PC",
        fileName: "video.mp4",
        fileSize: "200MB",
        fileType: "video/mp4",
        networkQuality: "Excellent WiFi",
        restrictions: "",
      },
    });
    const body = await res.json();
    expect(body.method).toContain("Peer-to-Peer");
  });
});

// ─────────────────────────────────────────────────────────────
// SECTION 11: UI TESTS — Browser (Playwright page tests)
// ─────────────────────────────────────────────────────────────

test.describe("UI — App loads and navigation works", () => {
  test("landing page renders ByteBridge header", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("ByteBridge")).toBeVisible();
    await expect(page.getByText("Zero Code")).toBeVisible();
  });

  test("navigation tabs switch content", async ({ page }) => {
    await page.goto("/");

    // Send File tab
    await page.getByRole("button", { name: /send file/i }).click();
    await expect(page.getByText(/drag.*drop.*select/i)).toBeVisible();

    // Receive File tab
    await page.getByRole("button", { name: /receive file/i }).click();
    await expect(page.getByText(/Enter Session Transfer Code/i)).toBeVisible();

    // Clipboard tab
    await page.getByRole("button", { name: /clipboard/i }).first().click();
    await expect(page.getByText(/Online Clipboard/i)).toBeVisible();

    // Toolkit tab
    await page.getByRole("button", { name: /toolkit/i }).click();
    await expect(page.getByText(/GoOnlineTools/i)).toBeVisible();

    // History tab
    await page.getByRole("button", { name: /history/i }).click();
    await expect(page.getByText(/Transmission History/i)).toBeVisible();

    // Settings tab
    await page.getByRole("button", { name: /settings/i }).click();
    await expect(page.getByText(/ByteBridge Node Configurations/i)).toBeVisible();

    // Help tab
    await page.getByRole("button", { name: /help/i }).click();
    await expect(page.getByText(/Help Center/i)).toBeVisible();
  });

  test("theme toggle switches dark/light mode", async ({ page }) => {
    await page.goto("/");
    const root = page.locator("#bytebridge-entire-app");
    await expect(root).toHaveClass(/bg-\[#050505\]/); // dark mode default

    await page.locator("#theme-toggle-btn").click();
    await expect(root).toHaveClass(/bg-slate-50/); // light mode
  });

  test("room code is generated on load", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: /send file/i }).click();
    // The 6-digit code should appear in the cyan box
    const codeEl = page.locator("h4.text-3xl");
    await expect(codeEl).toBeVisible();
    const code = await codeEl.textContent();
    expect(code?.trim()).toMatch(/^\d{6}$/);
  });
});

test.describe("UI — Send file flow", () => {
  test("file input populates file name pill", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /send file/i }).click();

    // Upload a test file via input
    const input = page.locator("#send-file-selector");
    await input.setInputFiles({
      name: "my_test_file.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("PDF_DUMMY_CONTENT"),
    });
    await expect(page.getByText("my_test_file.pdf")).toBeVisible();
  });

  test("PACK button runs transfer animation and completes", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500); // wait for room code
    await page.getByRole("button", { name: /send file/i }).click();

    const input = page.locator("#send-file-selector");
    await input.setInputFiles({
      name: "upload_test.zip",
      mimeType: "application/zip",
      buffer: Buffer.from("ZIP_CONTENT"),
    });

    await page.getByRole("button", { name: /pack.*encrypt.*transmit/i }).click();
    // Pipeline stages should become visible
    await expect(page.getByText("AUTOPACK PIPELINE RUNNING...")).toBeVisible();
    // Wait for completion
    await page.waitForTimeout(500);
    await expect(page.getByText("PACK, ENCRYPT & TRANSMIT NOW")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("UI — Receive file flow", () => {
  test("entering code and resolving shows file details", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /receive file/i }).click();

    const input = page.locator("input[maxlength='6']").first();
    await input.fill("123456");

    await page.getByRole("button", { name: /resolve/i }).click();
    // Should show file details (fallback simulation)
    await expect(page.getByText(/Payload Authentication/i)).toBeVisible({ timeout: 5000 });
  });

  test("RESOLVE is disabled with less than 5 digits", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /receive file/i }).click();

    const input = page.locator("input[maxlength='6']").first();
    await input.fill("123");
    const resolveBtn = page.getByRole("button", { name: /resolve/i });
    await expect(resolveBtn).toBeDisabled();
  });
});

test.describe("UI — Clipboard tab", () => {
  test("typing text shows character count", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /clipboard/i }).first().click();

    const textarea = page.locator("textarea").first();
    await textarea.fill("Hello clipboard test");
    await expect(page.getByText(/Character Count:.*20/)).toBeVisible();
  });

  test("room code and shareable URL are visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: /clipboard/i }).first().click();
    await expect(page.getByText(/SHARING ROOM CODE/i)).toBeVisible();
    await expect(page.getByText(/localhost:3000/)).toBeVisible();
  });
});

test.describe("UI — Developer Toolkit", () => {
  test("Base64 encode works end-to-end in UI", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /toolkit/i }).click();
    await page.waitForTimeout(500);

    await page.locator("textarea").first().fill("test input");
    await page.getByRole("button", { name: /execute converter/i }).click();

    // Output should contain base64 encoded string
    await expect(page.locator(".select-all").filter({ hasText: /[A-Za-z0-9+/=]{4,}/ })).toBeVisible({ timeout: 5000 });
  });

  test("UUID generator produces a UUID", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /toolkit/i }).click();

    await page.getByRole("button", { name: /⚙ multi generators/i }).click();
    await page.getByRole("button", { name: /generate token element/i }).click();

    const output = page.locator(".select-all.break-all").first();
    await expect(output).toBeVisible({ timeout: 5000 });
    const text = await output.textContent();
    expect(text).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4/);
  });

  test("Playback calculator shows time saved", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /toolkit/i }).click();
    await page.getByRole("button", { name: /⚖ calculators/i }).click();

    // Already on playback sub-tab; fill fields
    const hoursInput = page.locator("input[type='number']").first();
    await hoursInput.fill("2");

    await page.getByRole("button", { name: /calculate playback time saved/i }).click();
    await expect(page.getByText(/NET TIME CONVERGED/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe("UI — History tab", () => {
  test("history logs show pre-populated entries", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /history/i }).click();
    await expect(page.getByText("quarterly_audit_report.pdf")).toBeVisible();
    await expect(page.getByText("production_backup_db.sql.gz")).toBeVisible();
  });

  test("flush logs clears the table", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /history/i }).click();
    await page.getByRole("button", { name: /flush logs/i }).click();
    await expect(page.getByText(/no logs recorded/i)).toBeVisible();
  });
});

test.describe("UI — Landing page sub-tabs", () => {
  test("Features sub-tab shows feature cards", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /core features/i }).click();
    await expect(page.getByText(/AES-256 GCM Client Encryption/i)).toBeVisible();
  });

  test("Pricing tab shows plans", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /pricing/i }).click();
    await expect(page.getByText("0.00 USD")).toBeVisible();
    await expect(page.getByText("9.00 USD")).toBeVisible();
  });

  test("How It Works tab shows steps", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /how it works/i }).click();
    await expect(page.getByText(/Backstage Mechanics/i)).toBeVisible();
  });
});
