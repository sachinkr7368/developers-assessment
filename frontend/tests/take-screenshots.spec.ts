import { test, expect } from "@playwright/test";

test.describe("Capture PR Screenshots", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Dashboard
    await page.goto("/");
    // Wait for mock data
    await expect(page.locator("text=Loading worklogs...")).not.toBeVisible({ timeout: 5000 });
    // Adjust viewport for better screenshot aesthetic
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("Capture 1: Worklogs List View", async ({ page }) => {
    // Main list view
    await expect(page.locator("text=Alice Johnson").first()).toBeVisible();
    await page.waitForTimeout(500); // small delay to ensure rendering settles
    await page.screenshot({ path: "screenshots/1-worklog-list.png", fullPage: true });
  });

  test("Capture 2: Date Range Filtering", async ({ page }) => {
    // Click date range filter
    await page.click("button:has-text('Date Range Filter')");
    await expect(page.locator("text=Start Date")).toBeVisible();
    
    // Fill in dates to show interaction
    await page.fill("input[type='date'] >> nth=0", "2024-10-01");
    await page.fill("input[type='date'] >> nth=1", "2024-10-31");
    
    await page.waitForTimeout(500); // Wait for filtering to apply
    await page.screenshot({ path: "screenshots/2-date-filtering.png", fullPage: true });
  });

  test("Capture 3: Worklog Details / Time Entries", async ({ page }) => {
    // Click on a specific worklog
    await page.locator("text=Frontend Dashboard Integration").first().click();
    await expect(page.locator("h2", { hasText: "Worklog Details:" })).toBeVisible();
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/3-worklog-details.png", fullPage: true });
  });

  test("Capture 4: Payment Review Screen", async ({ page }) => {
    // Click Review Payments
    await page.click("button:has-text('Review Payments')");
    await expect(page.locator("h2", { hasText: "Review Payment Batch" })).toBeVisible();
    
    // Exclude one item to demonstrate functionality
    await page.locator("button:has-text('Exclude')").first().click();
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/4-payment-review.png", fullPage: true });
  });
});
