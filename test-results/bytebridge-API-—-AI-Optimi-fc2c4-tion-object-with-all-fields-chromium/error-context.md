# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bytebridge.spec.ts >> API — AI Optimizer (fallback mode) >> returns a recommendation object with all fields
- Location: tests\bytebridge.spec.ts:517:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  429 |       data: { text: '{"ok":true}', type: "json", action: "validate" },
  430 |     });
  431 |     const { result } = await res.json();
  432 |     expect(result).toContain("Valid");
  433 |   });
  434 | 
  435 |   test("JSON → CSV conversion", async ({ request }) => {
  436 |     const res = await request.post(BASE, {
  437 |       data: {
  438 |         text: JSON.stringify([{ name: "Alice", age: "30" }, { name: "Bob", age: "25" }]),
  439 |         type: "json",
  440 |         action: "convert-csv",
  441 |       },
  442 |     });
  443 |     const { result } = await res.json();
  444 |     expect(result).toContain("name,age");
  445 |     expect(result).toContain("Alice");
  446 |   });
  447 | 
  448 |   test("CSV → JSON conversion", async ({ request }) => {
  449 |     const res = await request.post(BASE, {
  450 |       data: { text: "name,age\nAlice,30\nBob,25", type: "csv", action: "convert-json" },
  451 |     });
  452 |     const { result } = await res.json();
  453 |     const parsed = JSON.parse(result);
  454 |     expect(parsed).toHaveLength(2);
  455 |     expect(parsed[0].name).toBe("Alice");
  456 |   });
  457 | 
  458 |   test("Markdown → HTML", async ({ request }) => {
  459 |     const res = await request.post(BASE, {
  460 |       data: { text: "# Hello\n**bold**", type: "markdown", action: "convert-html" },
  461 |     });
  462 |     const { result } = await res.json();
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
> 529 |     expect(res.status()).toBe(200);
      |                          ^ Error: expect(received).toBe(expected) // Object.is equality
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
```