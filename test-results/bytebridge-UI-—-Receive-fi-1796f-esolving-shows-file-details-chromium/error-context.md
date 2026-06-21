# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bytebridge.spec.ts >> UI — Receive file flow >> entering code and resolving shows file details
- Location: tests\bytebridge.spec.ts:657:3

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: /receive file/i }) resolved to 2 elements:
    1) <button class="px-3 py-1.5 rounded-md text-xs uppercase font-extrabold tracking-wider transition text-slate-300 hover:bg-white/5">Receive File</button> aka locator('#navigation-rail').getByRole('button', { name: 'Receive File' })
    2) <button class="px-6 py-3 border font-extrabold uppercase text-xs tracking-widest transition active:scale-98 cursor-pointer border-white/20 text-white hover:bg-white/5">Receive File</button> aka locator('#landing-hero-view').getByRole('button', { name: 'Receive File' })

Call log:
  - waiting for getByRole('button', { name: /receive file/i })

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
> 659 |     await page.getByRole("button", { name: /receive file/i }).click();
      |                                                               ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: /receive file/i }) resolved to 2 elements:
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
  733 | 
  734 |     await page.getByRole("button", { name: /calculate playback time saved/i }).click();
  735 |     await expect(page.getByText(/NET TIME CONVERGED/i)).toBeVisible({ timeout: 5000 });
  736 |   });
  737 | });
  738 | 
  739 | test.describe("UI — History tab", () => {
  740 |   test("history logs show pre-populated entries", async ({ page }) => {
  741 |     await page.goto("/");
  742 |     await page.getByRole("button", { name: /history/i }).click();
  743 |     await expect(page.getByText("quarterly_audit_report.pdf")).toBeVisible();
  744 |     await expect(page.getByText("production_backup_db.sql.gz")).toBeVisible();
  745 |   });
  746 | 
  747 |   test("flush logs clears the table", async ({ page }) => {
  748 |     await page.goto("/");
  749 |     await page.getByRole("button", { name: /history/i }).click();
  750 |     await page.getByRole("button", { name: /flush logs/i }).click();
  751 |     await expect(page.getByText(/no logs recorded/i)).toBeVisible();
  752 |   });
  753 | });
  754 | 
  755 | test.describe("UI — Landing page sub-tabs", () => {
  756 |   test("Features sub-tab shows feature cards", async ({ page }) => {
  757 |     await page.goto("/");
  758 |     await page.getByRole("button", { name: /core features/i }).click();
  759 |     await expect(page.getByText(/AES-256 GCM Client Encryption/i)).toBeVisible();
```