# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bytebridge.spec.ts >> UI — Send file flow >> file input populates file name pill
- Location: tests\bytebridge.spec.ts:621:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('my_test_file.pdf')
Expected: visible
Error: strict mode violation: getByText('my_test_file.pdf') resolved to 2 elements:
    1) <span class="text-white font-semibold truncate">my_test_file.pdf</span> aka getByText('my_test_file.pdf', { exact: true })
    2) <span class="font-bold truncate max-w-[150px] text-slate-300">my_test_file.pdf (0.0 KB)</span> aka getByText('my_test_file.pdf (0.0 KB)')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('my_test_file.pdf')

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
      - button "Send File" [active] [ref=e13]
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
      - generic [ref=e50]:
        - generic [ref=e51]:
          - generic [ref=e52]: "1"
          - generic [ref=e53]: Select File
        - img [ref=e54]
        - generic [ref=e56]:
          - generic [ref=e57]: "2"
          - generic [ref=e58]: Auto-Compress & Encrypt
        - img [ref=e59]
        - generic [ref=e61]:
          - generic [ref=e62]: "3"
          - generic [ref=e63]: Receive and Save Code
      - generic [ref=e64]:
        - generic [ref=e65]: "1. Drag, Drop, or Select Local File:"
        - generic [ref=e66] [cursor=pointer]:
          - generic [ref=e67]:
            - img [ref=e68]
            - generic [ref=e71]:
              - generic [ref=e72]: Drag file here or Click to Browse
              - generic [ref=e73]: Simulated automatic decompression checks apply
          - generic [ref=e74]:
            - generic [ref=e75]:
              - img [ref=e76]
              - generic [ref=e79]: my_test_file.pdf
            - generic [ref=e80]: 0.0 KB
      - generic [ref=e81]:
        - generic [ref=e82]: "Destination Storage Preferences (Simulated):"
        - generic [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e85]: Target Platform OS
            - combobox [ref=e86]:
              - option "Windows PC"
              - option "MacBook"
              - option "Linux PC"
              - option "Android Phone" [selected]
              - option "iPhone"
          - generic [ref=e87]:
            - generic [ref=e88]: Simulated Destination Folder Path
            - textbox [ref=e89]: /Downloads/ByteBridge_Restored/
      - generic [ref=e90]:
        - generic [ref=e91]:
          - heading "Automated Pipeline Progress (Backplane)" [level=4] [ref=e92]
          - generic [ref=e93]: Idle / Awaiting Active Loop
        - generic [ref=e95]:
          - generic [ref=e96]: 1. PACKING TAR
          - generic [ref=e97]: 2. GZIP COMPRESS
          - generic [ref=e98]: 3. SYMMETRIC ENC
          - generic [ref=e99]: 4. SERVER STREAMING
      - button "PACK, ENCRYPT & TRANSMIT NOW" [ref=e100]:
        - img [ref=e101]
        - text: PACK, ENCRYPT & TRANSMIT NOW
    - generic [ref=e103]:
      - generic [ref=e105]:
        - generic [ref=e106]:
          - generic [ref=e107]:
            - generic [ref=e108]: Active Transfer Code Key
            - heading "319716" [level=4] [ref=e109]
          - button "Copy transfer room key to clipboard" [ref=e110]:
            - img [ref=e111]
        - paragraph [ref=e114]: This generated 6-digit session key will allow the destination target node browser instance to instantly auto-authenticate, download compiled chunks, and decrypt/unpack this specific secure document in sub-seconds.
        - generic [ref=e115]:
          - generic [ref=e116]: "SECURITY: KEY-EXCHANGE INSTANT"
          - generic [ref=e117]: "EXPIRY: 14 mins"
      - generic [ref=e118]:
        - generic [ref=e119]:
          - generic [ref=e120]:
            - img [ref=e122]
            - generic [ref=e124]: SENDER NODE MONITOR
          - generic [ref=e129]: SYNCED
        - generic [ref=e130]:
          - generic [ref=e131]:
            - generic [ref=e132]:
              - generic [ref=e133]: Device Name
              - textbox [ref=e134]: MacBook-Corporate
            - generic [ref=e135]:
              - generic [ref=e136]: Platform OS
              - combobox [ref=e137] [cursor=pointer]:
                - option "Windows PC"
                - option "MacBook" [selected]
                - option "Linux PC"
                - option "Android Phone"
                - option "iPhone"
                - option "Tablet"
                - option "Smart TV"
                - option "Chromebook"
          - generic [ref=e138]:
            - generic [ref=e139]:
              - generic [ref=e140]:
                - generic [ref=e141]:
                  - img [ref=e142]
                  - text: Battery Level
                - generic [ref=e144]: 94%
              - slider [ref=e145] [cursor=pointer]: "94"
            - generic [ref=e146]:
              - generic [ref=e147]:
                - img [ref=e148]
                - text: Transmission Channel
              - combobox [ref=e152] [cursor=pointer]:
                - option "Excellent WiFi (Gigabit)"
                - option "Average Home Wi-Fi"
                - option "Restricted Corporate LAN" [selected]
                - option "Cellular 5G Network"
                - option "Slow 4G / Tethered Spot"
                - option "Air-Gapped Local Subnet"
            - generic [ref=e153]:
              - generic [ref=e154]:
                - img [ref=e155]
                - text: Firewall Blockade Presets
              - combobox [ref=e157] [cursor=pointer]:
                - option "None (Direct Connection Handshake)"
                - option "USB Storage Blocks & MDM Lockdown"
                - option "High Corporate Firewall (No File-Up or Cloud Drives)"
                - option "Secure Banking LAN (Strict Host Isolation)"
                - option "Total Air-gapped Offline Environment"
                - option "- Custom Restrictions -" [selected]
              - textbox "Type custom local isolated ports parameters..." [ref=e158]: MDM policy restricts USB mounting. Active corporate firewall blocks file-hosting services and standard email attachments.
        - generic [ref=e159]:
          - generic [ref=e160]: "PEER MAC: device-sender-99"
          - generic [ref=e161]:
            - img [ref=e162]
            - text: Secure Handshake
      - generic [ref=e165]:
        - generic [ref=e166]:
          - generic [ref=e167]:
            - img [ref=e169]
            - generic [ref=e177]:
              - heading "AI Routing Optimizer" [level=3] [ref=e178]:
                - text: AI Routing Optimizer
                - img [ref=e179]
              - paragraph [ref=e182]: Autonomous path config constructor
          - button "RE-OPT" [ref=e183] [cursor=pointer]:
            - img [ref=e184]
            - text: RE-OPT
        - generic [ref=e186]:
          - generic [ref=e187]:
            - generic [ref=e188]: "In-Transit Element:"
            - generic [ref=e189]: my_test_file.pdf (0.0 KB)
          - generic [ref=e190]:
            - generic [ref=e191]: "Encryption Stream:"
            - generic [ref=e192]: ACTIVE CLIENT-SIDE
          - generic [ref=e193]:
            - generic [ref=e194]: "Direct Endpoint:"
            - generic [ref=e195]:
              - text: MacBook
              - img [ref=e196]
              - text: Android
        - generic [ref=e199]:
          - generic [ref=e200]:
            - generic [ref=e201]:
              - generic [ref=e202]: Target method
              - 'generic "Method 5: Restricted Environment Mode + Method 4: Clipboard Packaging" [ref=e203]': Restricted Environment Mode + Method 4
              - generic [ref=e204]: Method 5
            - generic [ref=e205]:
              - generic [ref=e206]: Chunk size profile
              - generic [ref=e207]:
                - img [ref=e208]
                - text: 512 KB
            - generic [ref=e212]:
              - generic [ref=e213]: Auto Compress
              - generic [ref=e214]:
                - img [ref=e215]
                - text: LZMA Level 3
            - generic [ref=e218]:
              - generic [ref=e219]: AES Protection
              - generic [ref=e220]:
                - img [ref=e221]
                - text: AES-256-GCM client-side
          - generic [ref=e224]:
            - generic [ref=e225]:
              - img [ref=e226]
              - text: "Dynamic Transfer Proxy Line:"
            - paragraph [ref=e228]: Split packed data into highly dense textual packages representing AES encrypted base64 payload segments.
          - generic [ref=e229]:
            - strong [ref=e230]: "Gemini Optimizer Advice:"
            - text: High strictness isolated parameters prevent direct P2P socket communication. Chunking clipboard sequence operates within standard system limitations.
      - generic [ref=e231]:
        - generic [ref=e232]: "Method 02: Scannable QR Tunnel"
        - generic [ref=e233]:
          - img [ref=e235]
          - generic [ref=e241]:
            - generic [ref=e242]: Scan on Target Device
            - paragraph [ref=e243]: Open target camera to load pairing instantly. Auto packs and stream starts with zero logins.
  - generic [ref=e244]:
    - generic [ref=e245]:
      - generic [ref=e246]: 10 Dynamic Bridge Transfer Methods Supported
      - generic [ref=e247]: SEAMLESS MULTI-PATH SYSTEM
    - generic [ref=e248]:
      - generic [ref=e249] [cursor=pointer]:
        - generic [ref=e250]: "01"
        - generic [ref=e251]: Browser-to-Browser
        - generic [ref=e252]: Direct WebRTC p2p secure channel
      - generic [ref=e253] [cursor=pointer]:
        - generic [ref=e254]: "02"
        - generic [ref=e255]: QR Transfer
        - generic [ref=e256]: Sequenced visual stream barcodes
      - generic [ref=e257] [cursor=pointer]:
        - generic [ref=e258]: "03"
        - generic [ref=e259]: Transfer Code
        - generic [ref=e260]: Sync 6-digit server bridge relay
      - generic [ref=e261] [cursor=pointer]:
        - generic [ref=e262]: "04"
        - generic [ref=e263]: Clipboard Transfer
        - generic [ref=e264]: Copy-paste standard text sequence
      - generic [ref=e265] [cursor=pointer]:
        - generic [ref=e266]: "05"
        - generic [ref=e267]: Restricted Mode
        - generic [ref=e268]: MDM/USB block sandbox proxy bypass
      - generic [ref=e269] [cursor=pointer]:
        - generic [ref=e270]: "06"
        - generic [ref=e271]: Bluetooth LE P2P
        - generic [ref=e272]: Local beacon radio announcement
      - generic [ref=e273] [cursor=pointer]:
        - generic [ref=e274]: "07"
        - generic [ref=e275]: LAN Multicast
        - generic [ref=e276]: Local router peer discovery routing
      - generic [ref=e277] [cursor=pointer]:
        - generic [ref=e278]: "08"
        - generic [ref=e279]: WiFi Direct Link
        - generic [ref=e280]: IEEE 802.11 high-speed direct frames
      - generic [ref=e281] [cursor=pointer]:
        - generic [ref=e282]: "09"
        - generic [ref=e283]: Email Pipeline
        - generic [ref=e284]: Invisible SMTP chunk distribution
      - generic [ref=e285] [cursor=pointer]:
        - generic [ref=e286]: "10"
        - generic [ref=e287]: HTTPS Chunk Push
        - generic [ref=e288]: Parallel CDN gateway chunk delivery
  - contentinfo [ref=e289]:
    - generic [ref=e290]: © 2026 BYTEBRIDGE SYSTEMS INCORPORATED. POWERED BY INTEGRITY PACK AI.
    - generic [ref=e291]: ACTIVE NETWORK NODE ENCRYPT LINK SECURED
```

# Test source

```ts
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
  563 |     await expect(page.getByText("ByteBridge")).toBeVisible();
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
> 632 |     await expect(page.getByText("my_test_file.pdf")).toBeVisible();
      |                                                      ^ Error: expect(locator).toBeVisible() failed
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
  664 |     await page.getByRole("button", { name: /resolve/i }).click();
  665 |     // Should show file details (fallback simulation)
  666 |     await expect(page.getByText(/Payload Authentication/i)).toBeVisible({ timeout: 5000 });
  667 |   });
  668 | 
  669 |   test("RESOLVE is disabled with less than 5 digits", async ({ page }) => {
  670 |     await page.goto("/");
  671 |     await page.getByRole("button", { name: /receive file/i }).click();
  672 | 
  673 |     const input = page.locator("input[maxlength='6']").first();
  674 |     await input.fill("123");
  675 |     const resolveBtn = page.getByRole("button", { name: /resolve/i });
  676 |     await expect(resolveBtn).toBeDisabled();
  677 |   });
  678 | });
  679 | 
  680 | test.describe("UI — Clipboard tab", () => {
  681 |   test("typing text shows character count", async ({ page }) => {
  682 |     await page.goto("/");
  683 |     await page.getByRole("button", { name: /clipboard/i }).first().click();
  684 | 
  685 |     const textarea = page.locator("textarea").first();
  686 |     await textarea.fill("Hello clipboard test");
  687 |     await expect(page.getByText(/Character Count:.*20/)).toBeVisible();
  688 |   });
  689 | 
  690 |   test("room code and shareable URL are visible", async ({ page }) => {
  691 |     await page.goto("/");
  692 |     await page.waitForTimeout(1500);
  693 |     await page.getByRole("button", { name: /clipboard/i }).first().click();
  694 |     await expect(page.getByText(/SHARING ROOM CODE/i)).toBeVisible();
  695 |     await expect(page.getByText(/localhost:3000/)).toBeVisible();
  696 |   });
  697 | });
  698 | 
  699 | test.describe("UI — Developer Toolkit", () => {
  700 |   test("Base64 encode works end-to-end in UI", async ({ page }) => {
  701 |     await page.goto("/");
  702 |     await page.getByRole("button", { name: /toolkit/i }).click();
  703 |     await page.waitForTimeout(500);
  704 | 
  705 |     await page.locator("textarea").first().fill("test input");
  706 |     await page.getByRole("button", { name: /execute converter/i }).click();
  707 | 
  708 |     // Output should contain base64 encoded string
  709 |     await expect(page.locator(".select-all").filter({ hasText: /[A-Za-z0-9+/=]{4,}/ })).toBeVisible({ timeout: 5000 });
  710 |   });
  711 | 
  712 |   test("UUID generator produces a UUID", async ({ page }) => {
  713 |     await page.goto("/");
  714 |     await page.getByRole("button", { name: /toolkit/i }).click();
  715 | 
  716 |     await page.getByRole("button", { name: /⚙ multi generators/i }).click();
  717 |     await page.getByRole("button", { name: /generate token element/i }).click();
  718 | 
  719 |     const output = page.locator(".select-all.break-all").first();
  720 |     await expect(output).toBeVisible({ timeout: 5000 });
  721 |     const text = await output.textContent();
  722 |     expect(text).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4/);
  723 |   });
  724 | 
  725 |   test("Playback calculator shows time saved", async ({ page }) => {
  726 |     await page.goto("/");
  727 |     await page.getByRole("button", { name: /toolkit/i }).click();
  728 |     await page.getByRole("button", { name: /⚖ calculators/i }).click();
  729 | 
  730 |     // Already on playback sub-tab; fill fields
  731 |     const hoursInput = page.locator("input[type='number']").first();
  732 |     await hoursInput.fill("2");
```