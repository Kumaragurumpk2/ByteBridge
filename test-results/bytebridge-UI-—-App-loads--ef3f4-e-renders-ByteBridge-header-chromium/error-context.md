# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bytebridge.spec.ts >> UI — App loads and navigation works >> landing page renders ByteBridge header
- Location: tests\bytebridge.spec.ts:561:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('ByteBridge')
Expected: visible
Error: strict mode violation: getByText('ByteBridge') resolved to 3 elements:
    1) <div class="text-2xl font-black uppercase tracking-widest flex items-center gap-2">ByteBridge</div> aka getByText('ByteBridge', { exact: true })
    2) <p class="text-base font-light leading-relaxed border-l-2 border-cyan-500/50 pl-6 text-white/60">Bypass USB blocks, restricted email domains, loca…</p> aka getByText('Bypass USB blocks, restricted')
    3) <span>© 2026 BYTEBRIDGE SYSTEMS INCORPORATED. POWERED B…</span> aka getByText('© 2026 BYTEBRIDGE SYSTEMS')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('ByteBridge')

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - banner [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: BB
      - generic [ref=e8]:
        - generic [ref=e9]: ByteBridge
        - paragraph [ref=e10]: Invisible Pack, Core Encrypt & Unpack Pipeline
    - navigation [ref=e11]:
      - button "Overview" [ref=e12]
      - button "Send File" [ref=e13]
      - button "Receive File" [ref=e14]
      - button "Clipboard" [ref=e15]:
        - img [ref=e16]
        - text: Clipboard
      - button "Toolkit" [ref=e19]:
        - img [ref=e20]
        - text: Toolkit
      - button "History" [ref=e24]:
        - img [ref=e25]
        - text: History
      - button "Settings" [ref=e29]:
        - img [ref=e30]
        - text: Settings
      - button "Help" [ref=e33]:
        - img [ref=e34]
        - text: Help
    - generic [ref=e37]:
      - button "Toggle Light/Dark Theme" [ref=e38]:
        - img [ref=e39]
      - generic [ref=e45]:
        - generic [ref=e46]: Security Core
        - generic [ref=e47]: READY
  - generic [ref=e48]:
    - generic [ref=e49]:
      - button "Overview Hub" [ref=e50]
      - button "Core Features" [ref=e51]
      - button "How It Works" [ref=e52]
      - button "Pricing & Plans" [ref=e53]
      - button "Developer Docs" [ref=e54]
      - button "Contact Support" [ref=e55]
    - generic [ref=e56]:
      - generic [ref=e57]:
        - generic [ref=e58]:
          - heading "Zero Code File Transfer" [level=1] [ref=e59]:
            - text: Zero Code
            - text: File
            - text: Transfer
          - paragraph [ref=e60]: Bypass USB blocks, restricted email domains, local isolation policies, and corporate firewalls with ByteBridge. Simple, secure, browser-based multi-path file tunnels.
          - generic [ref=e61]:
            - generic [ref=e62]: "Streamlined In-App Workflow:"
            - generic [ref=e63]:
              - generic [ref=e64]:
                - generic [ref=e65]: "01"
                - generic [ref=e66]:
                  - generic [ref=e67]: Select File
                  - text: Any type, zero zip errors
              - generic [ref=e68]:
                - generic [ref=e69]: "02"
                - generic [ref=e70]:
                  - generic [ref=e71]: Secure Code
                  - text: Linked to AES session
              - generic [ref=e72]:
                - generic [ref=e73]: "03"
                - generic [ref=e74]:
                  - generic [ref=e75]: Receive Stream
                  - text: Enter code on target node
              - generic [ref=e76]:
                - generic [ref=e77]: "04"
                - generic [ref=e78]:
                  - generic [ref=e79]: Unpack & Save
                  - text: Decoded block restored
          - generic [ref=e80]:
            - button "Start Sending" [ref=e81] [cursor=pointer]
            - button "Receive File" [ref=e82] [cursor=pointer]
        - generic [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e85]:
              - generic [ref=e86]:
                - generic [ref=e87]: Active Tunnel Monitors
                - generic [ref=e88]: ● ONLINE STATE
              - generic [ref=e89]:
                - heading "Zero-Knowledge Backplane" [level=3] [ref=e90]
                - paragraph [ref=e91]: Compresses selections through gzip streams, envelopes blocks inside symmetric AES-256 client-side cryptography salts, and coordinates metadata keys. No files are stored unencrypted on any server.
              - generic [ref=e92]:
                - generic [ref=e93]: GZIP COMPRESS
                - generic [ref=e94]: AES-256 CYCLIC
                - generic [ref=e95]: STREAM HOLES
            - generic [ref=e96]:
              - generic [ref=e97]: "ENCRYPT STANDARD: HIGH"
              - generic [ref=e98]: RESTRICTED MODE COMPATIBLE
          - generic [ref=e99]:
            - generic [ref=e100]: "Supported File Extensions & Formats:"
            - text: ZIP, RAR, TAR.GZ, PDF, DOCX, XLSX, PPTX, DMG, EXE, ISO, PNG, JPG, MP4, Source Code, and any other raw binary file stream.
      - generic [ref=e101]:
        - generic [ref=e102]:
          - generic [ref=e103]: Live System Dashboard Metrics
          - generic [ref=e104]: CURRENT HOUR REPORT
        - generic [ref=e105]:
          - generic [ref=e106]:
            - generic [ref=e107]: Total Transfers
            - generic [ref=e108]: 2,741 files
            - generic [ref=e109]: +182 today
          - generic [ref=e110]:
            - generic [ref=e111]: Transfer Speed
            - generic [ref=e112]: 1.24 GB/s
            - generic [ref=e113]: WebRTC peak
          - generic [ref=e114]:
            - generic [ref=e115]: Files Sent
            - generic [ref=e116]: 1,440 nodes
            - generic [ref=e117]: Packed securely
          - generic [ref=e118]:
            - generic [ref=e119]: Files Received
            - generic [ref=e120]: 1,301 items
            - generic [ref=e121]: Unpacked cleanly
          - generic [ref=e122]:
            - generic [ref=e123]: Active Nodes
            - generic [ref=e124]: 3 Online
            - generic [ref=e125]: Same LAN subnet
          - generic [ref=e126]:
            - generic [ref=e127]: Success Rate
            - generic [ref=e128]: 99.8%
            - generic [ref=e129]: Zero bit errors
  - generic [ref=e130]:
    - generic [ref=e131]:
      - generic [ref=e132]: 10 Dynamic Bridge Transfer Methods Supported
      - generic [ref=e133]: SEAMLESS MULTI-PATH SYSTEM
    - generic [ref=e134]:
      - generic [ref=e135] [cursor=pointer]:
        - generic [ref=e136]: "01"
        - generic [ref=e137]: Browser-to-Browser
        - generic [ref=e138]: Direct WebRTC p2p secure channel
      - generic [ref=e139] [cursor=pointer]:
        - generic [ref=e140]: "02"
        - generic [ref=e141]: QR Transfer
        - generic [ref=e142]: Sequenced visual stream barcodes
      - generic [ref=e143] [cursor=pointer]:
        - generic [ref=e144]: "03"
        - generic [ref=e145]: Transfer Code
        - generic [ref=e146]: Sync 6-digit server bridge relay
      - generic [ref=e147] [cursor=pointer]:
        - generic [ref=e148]: "04"
        - generic [ref=e149]: Clipboard Transfer
        - generic [ref=e150]: Copy-paste standard text sequence
      - generic [ref=e151] [cursor=pointer]:
        - generic [ref=e152]: "05"
        - generic [ref=e153]: Restricted Mode
        - generic [ref=e154]: MDM/USB block sandbox proxy bypass
      - generic [ref=e155] [cursor=pointer]:
        - generic [ref=e156]: "06"
        - generic [ref=e157]: Bluetooth LE P2P
        - generic [ref=e158]: Local beacon radio announcement
      - generic [ref=e159] [cursor=pointer]:
        - generic [ref=e160]: "07"
        - generic [ref=e161]: LAN Multicast
        - generic [ref=e162]: Local router peer discovery routing
      - generic [ref=e163] [cursor=pointer]:
        - generic [ref=e164]: "08"
        - generic [ref=e165]: WiFi Direct Link
        - generic [ref=e166]: IEEE 802.11 high-speed direct frames
      - generic [ref=e167] [cursor=pointer]:
        - generic [ref=e168]: "09"
        - generic [ref=e169]: Email Pipeline
        - generic [ref=e170]: Invisible SMTP chunk distribution
      - generic [ref=e171] [cursor=pointer]:
        - generic [ref=e172]: "10"
        - generic [ref=e173]: HTTPS Chunk Push
        - generic [ref=e174]: Parallel CDN gateway chunk delivery
  - contentinfo [ref=e175]:
    - generic [ref=e176]: © 2026 BYTEBRIDGE SYSTEMS INCORPORATED. POWERED BY INTEGRITY PACK AI.
    - generic [ref=e177]: ACTIVE NETWORK NODE ENCRYPT LINK SECURED
```

# Test source

```ts
  463 |     expect(result).toContain("<h1>");
  464 |     expect(result).toContain("<strong>");
  465 |   });
  466 | 
  467 |   test("HTML strip text", async ({ request }) => {
  468 |     const res = await request.post(BASE, {
  469 |       data: { text: "<h1>Title</h1><p>Body</p>", type: "html", action: "strip-text" },
  470 |     });
  471 |     const { result } = await res.json();
  472 |     expect(result).toBe("TitleBody");
  473 |   });
  474 | 
  475 |   test("invalid JSON → returns error", async ({ request }) => {
  476 |     const res = await request.post(BASE, {
  477 |       data: { text: "{bad json}", type: "json", action: "format" },
  478 |     });
  479 |     const body = await res.json();
  480 |     expect(body.success).toBe(false);
  481 |   });
  482 | });
  483 | 
  484 | // ─────────────────────────────────────────────────────────────
  485 | // SECTION 9: TOOLKIT — Playback calculator
  486 | // ─────────────────────────────────────────────────────────────
  487 | 
  488 | test.describe("API — Playback speed calculator", () => {
  489 |   const BASE = "/api/tools/calculator/playback";
  490 | 
  491 |   test("1h 30m at 1.5x speed saves 30 minutes", async ({ request }) => {
  492 |     const res = await request.post(BASE, { data: { hours: 1, minutes: 30, speed: 1.5 } });
  493 |     const body = await res.json();
  494 |     expect(body.success).toBe(true);
  495 |     expect(body.totalMinutes).toBe(90);
  496 |     expect(Math.round(body.adjustedMinutes)).toBe(60);
  497 |     expect(Math.round(body.timeSavedMinutes)).toBe(30);
  498 |   });
  499 | 
  500 |   test("zero speed returns 400", async ({ request }) => {
  501 |     const res = await request.post(BASE, { data: { hours: 1, minutes: 0, speed: 0 } });
  502 |     expect(res.status()).toBe(400);
  503 |   });
  504 | 
  505 |   test("2x speed halves the time", async ({ request }) => {
  506 |     const res = await request.post(BASE, { data: { hours: 1, minutes: 0, speed: 2.0 } });
  507 |     const body = await res.json();
  508 |     expect(body.adjustedMinutes).toBe(30);
  509 |   });
  510 | });
  511 | 
  512 | // ─────────────────────────────────────────────────────────────
  513 | // SECTION 10: AI OPTIMIZER
  514 | // ─────────────────────────────────────────────────────────────
  515 | 
  516 | test.describe("API — AI Optimizer (fallback mode)", () => {
  517 |   test("returns a recommendation object with all fields", async ({ request }) => {
  518 |     const res = await request.post("/api/gemini/optimize", {
  519 |       data: {
  520 |         sourceDevice: "MacBook",
  521 |         destDevice: "Android Phone",
  522 |         fileName: "report.pdf",
  523 |         fileSize: "45MB",
  524 |         fileType: "application/pdf",
  525 |         networkQuality: "Corporate WiFi",
  526 |         restrictions: "USB blocked, MDM policy",
  527 |       },
  528 |     });
  529 |     expect(res.status()).toBe(200);
  530 |     const body = await res.json();
  531 |     expect(body).toHaveProperty("method");
  532 |     expect(body).toHaveProperty("chunkSize");
  533 |     expect(body).toHaveProperty("compression");
  534 |     expect(body).toHaveProperty("encryption");
  535 |     expect(body).toHaveProperty("route");
  536 |     expect(body).toHaveProperty("explanation");
  537 |   });
  538 | 
  539 |   test("without restrictions — picks different method", async ({ request }) => {
  540 |     const res = await request.post("/api/gemini/optimize", {
  541 |       data: {
  542 |         sourceDevice: "MacBook",
  543 |         destDevice: "Windows PC",
  544 |         fileName: "video.mp4",
  545 |         fileSize: "200MB",
  546 |         fileType: "video/mp4",
  547 |         networkQuality: "Excellent WiFi",
  548 |         restrictions: "",
  549 |       },
  550 |     });
  551 |     const body = await res.json();
  552 |     expect(body.method).toContain("Peer-to-Peer");
  553 |   });
  554 | });
  555 | 
  556 | // ─────────────────────────────────────────────────────────────
  557 | // SECTION 11: UI TESTS — Browser (Playwright page tests)
  558 | // ─────────────────────────────────────────────────────────────
  559 | 
  560 | test.describe("UI — App loads and navigation works", () => {
  561 |   test("landing page renders ByteBridge header", async ({ page }) => {
  562 |     await page.goto("/");
> 563 |     await expect(page.getByText("ByteBridge")).toBeVisible();
      |                                                ^ Error: expect(locator).toBeVisible() failed
  564 |     await expect(page.getByText("Zero Code")).toBeVisible();
  565 |   });
  566 | 
  567 |   test("navigation tabs switch content", async ({ page }) => {
  568 |     await page.goto("/");
  569 | 
  570 |     // Send File tab
  571 |     await page.getByRole("button", { name: /send file/i }).click();
  572 |     await expect(page.getByText(/drag.*drop.*select/i)).toBeVisible();
  573 | 
  574 |     // Receive File tab
  575 |     await page.getByRole("button", { name: /receive file/i }).click();
  576 |     await expect(page.getByText(/Enter Session Transfer Code/i)).toBeVisible();
  577 | 
  578 |     // Clipboard tab
  579 |     await page.getByRole("button", { name: /clipboard/i }).first().click();
  580 |     await expect(page.getByText(/Online Clipboard/i)).toBeVisible();
  581 | 
  582 |     // Toolkit tab
  583 |     await page.getByRole("button", { name: /toolkit/i }).click();
  584 |     await expect(page.getByText(/GoOnlineTools/i)).toBeVisible();
  585 | 
  586 |     // History tab
  587 |     await page.getByRole("button", { name: /history/i }).click();
  588 |     await expect(page.getByText(/Transmission History/i)).toBeVisible();
  589 | 
  590 |     // Settings tab
  591 |     await page.getByRole("button", { name: /settings/i }).click();
  592 |     await expect(page.getByText(/ByteBridge Node Configurations/i)).toBeVisible();
  593 | 
  594 |     // Help tab
  595 |     await page.getByRole("button", { name: /help/i }).click();
  596 |     await expect(page.getByText(/Help Center/i)).toBeVisible();
  597 |   });
  598 | 
  599 |   test("theme toggle switches dark/light mode", async ({ page }) => {
  600 |     await page.goto("/");
  601 |     const root = page.locator("#bytebridge-entire-app");
  602 |     await expect(root).toHaveClass(/bg-\[#050505\]/); // dark mode default
  603 | 
  604 |     await page.locator("#theme-toggle-btn").click();
  605 |     await expect(root).toHaveClass(/bg-slate-50/); // light mode
  606 |   });
  607 | 
  608 |   test("room code is generated on load", async ({ page }) => {
  609 |     await page.goto("/");
  610 |     await page.waitForTimeout(1500);
  611 |     await page.getByRole("button", { name: /send file/i }).click();
  612 |     // The 6-digit code should appear in the cyan box
  613 |     const codeEl = page.locator("h4.text-3xl");
  614 |     await expect(codeEl).toBeVisible();
  615 |     const code = await codeEl.textContent();
  616 |     expect(code?.trim()).toMatch(/^\d{6}$/);
  617 |   });
  618 | });
  619 | 
  620 | test.describe("UI — Send file flow", () => {
  621 |   test("file input populates file name pill", async ({ page }) => {
  622 |     await page.goto("/");
  623 |     await page.getByRole("button", { name: /send file/i }).click();
  624 | 
  625 |     // Upload a test file via input
  626 |     const input = page.locator("#send-file-selector");
  627 |     await input.setInputFiles({
  628 |       name: "my_test_file.pdf",
  629 |       mimeType: "application/pdf",
  630 |       buffer: Buffer.from("PDF_DUMMY_CONTENT"),
  631 |     });
  632 |     await expect(page.getByText("my_test_file.pdf")).toBeVisible();
  633 |   });
  634 | 
  635 |   test("PACK button runs transfer animation and completes", async ({ page }) => {
  636 |     await page.goto("/");
  637 |     await page.waitForTimeout(1500); // wait for room code
  638 |     await page.getByRole("button", { name: /send file/i }).click();
  639 | 
  640 |     const input = page.locator("#send-file-selector");
  641 |     await input.setInputFiles({
  642 |       name: "upload_test.zip",
  643 |       mimeType: "application/zip",
  644 |       buffer: Buffer.from("ZIP_CONTENT"),
  645 |     });
  646 | 
  647 |     await page.getByRole("button", { name: /pack.*encrypt.*transmit/i }).click();
  648 |     // Pipeline stages should become visible
  649 |     await expect(page.getByText("AUTOPACK PIPELINE RUNNING...")).toBeVisible();
  650 |     // Wait for completion
  651 |     await page.waitForTimeout(500);
  652 |     await expect(page.getByText("PACK, ENCRYPT & TRANSMIT NOW")).toBeVisible({ timeout: 5000 });
  653 |   });
  654 | });
  655 | 
  656 | test.describe("UI — Receive file flow", () => {
  657 |   test("entering code and resolving shows file details", async ({ page }) => {
  658 |     await page.goto("/");
  659 |     await page.getByRole("button", { name: /receive file/i }).click();
  660 | 
  661 |     const input = page.locator("input[maxlength='6']").first();
  662 |     await input.fill("123456");
  663 | 
```