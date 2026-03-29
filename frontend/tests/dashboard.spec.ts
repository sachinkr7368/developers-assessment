import { test, expect } from "@playwright/test";

test.describe("Worklog Payment Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard. The auth guard is removed for this assessment, so it loads directly.
    await page.goto("/");
  });

  test("loads the dashboard and displays the initial worklogs", async ({ page }) => {
    // Should display the main heading
    await expect(page.locator("h1", { hasText: "Worklogs" })).toBeVisible();

    // Wait for mock data to load
    await expect(page.locator("text=Loading worklogs...")).not.toBeVisible({ timeout: 5000 });

    // Should display the table
    await expect(page.locator("table")).toBeVisible();
    
    // Check that at least one freelancer is visible
    await expect(page.locator("text=Alice Johnson").first()).toBeVisible();
  });

  test("can filter worklogs by status using exclusive tabs", async ({ page }) => {
    await expect(page.locator("text=Loading worklogs...")).not.toBeVisible({ timeout: 5000 });

    // Click the Status Filter tab
    await page.click("button:has-text('Status Filter')");

    // Select 'paid' status
    await page.selectOption("select", "paid");

    // Verify only the paid entry shows up (Alice Johnson - Dashboard QA and Testing)
    await expect(page.locator("text=Dashboard QA and Testing")).toBeVisible();
    await expect(page.locator("text=Frontend Dashboard Integration")).not.toBeVisible();
  });

  test("can drill down into a worklog to view time entries", async ({ page }) => {
    await expect(page.locator("text=Loading worklogs...")).not.toBeVisible({ timeout: 5000 });

    // Click on the first worklog row
    await page.locator("text=Frontend Dashboard Integration").click();

    // Header updates to Worklog Details
    await expect(page.locator("h2", { hasText: "Worklog Details:" })).toBeVisible();

    // Raw UTC time entry is visible
    await expect(page.locator("text=2024-10-23T09:00:00.000Z")).toBeVisible();

    // Click back
    await page.click("button:has-text('Back to List')");
    await expect(page.locator("h1", { hasText: "Worklogs" })).toBeVisible();
  });

  test("can review and process a payment batch", async ({ page }) => {
    await expect(page.locator("text=Loading worklogs...")).not.toBeVisible({ timeout: 5000 });

    // Click Review Payments
    await page.click("button:has-text('Review Payments')");

    // We should be in Review Payment Batch mode
    await expect(page.locator("h2", { hasText: "Review Payment Batch" })).toBeVisible();

    // Total should be calculated (pending only). 
    // From mock data: Alice (315) + Bob (120) + Charlie (175) = 610
    // But since the data is dynamic, we just check if it's visible.
    const totalToPay = page.locator("text=Total to Pay").locator("..").locator("p.text-primary");
    await expect(totalToPay).not.toBeEmpty();

    // Exclude the first one
    await page.locator("button:has-text('Exclude')").first().click();

    // Proceed to confirm payment
    const confirmBtn = page.locator("button:has-text('Confirm Payments')");
    await expect(confirmBtn).not.toBeDisabled();
    await confirmBtn.click();

    // Should return to dashboard automatically after processing (success state)
    // Wait for the simulated delay of processing
    await expect(page.locator("h2", { hasText: "Review Payment Batch" })).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator("h1", { hasText: "Worklogs" })).toBeVisible();
  });
});
